import BlockMath from '../components/pasosprueba/BlockMath'

/**
 * Componente FraccionContinuaSimpleLatex
 * 
 * Renderiza la representación LaTeX de una fracción continua simple
 * usando la notación estándar: a₀ + \cfrac{1}{a₁ + \cfrac{1}{a₂ + \cdots}}
 * 
 * Props:
 *   - coeficientes: array de strings (ej: ["2", "B", "5"] para base 16)
 *   - className: clase CSS adicional (opcional)
 *   - numeradorStr: numerador de la fracción original (opcional, para mostrar igualdad)
 *   - denominadorStr: denominador de la fracción original (opcional, para mostrar igualdad)
 *   - base: base numérica (opcional, para mostrar subíndice)
 * 
 * Si se proporcionan numeradorStr, denominadorStr y base, muestra:
 *   \frac{\text{numerador}}{\text{denominador}}_{(base)} = a₀ + \cfrac{1}{a₁ + \cdots}
 * 
 * Si no, muestra solo la expansión de la fracción continua (comportamiento anterior).
 */
export default function FraccionContinuaSimpleLatex({ 
  coeficientes, 
  className = '', 
  numeradorStr, 
  denominadorStr, 
  base 
}) {
  // Función para escapar texto LaTeX (copiada de PasoDelConversor.jsx)
  const latexEscapeText = (s) => {
    return String(s)
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/%/g, '\\%')
      .replace(/&/g, '\\&')
      .replace(/_/g, '\\_')
  }

  // Función para generar LaTeX de fracción continua anidada
  const generarLatexFraccionContinua = (coeficientes) => {
    if (!coeficientes || coeficientes.length === 0) {
      return '\\text{No hay coeficientes}'
    }

    if (coeficientes.length === 1) {
      // Caso trivial: solo un coeficiente
      const coef = coeficientes[0]
      return esMultiCaracter(coef) ? `\\text{${coef}}` : coef
    }

    // Función recursiva para construir la fracción anidada
    const construirFraccionAnidada = (coeficientes, indice = 0) => {
      if (indice === coeficientes.length - 1) {
        // Último coeficiente
        const coef = coeficientes[indice]
        return esMultiCaracter(coef) ? `\\text{${coef}}` : coef
      }

      const coefActual = coeficientes[indice]
      const coefActualFormateado = esMultiCaracter(coefActual) ? `\\text{${coefActual}}` : coefActual
      const resto = construirFraccionAnidada(coeficientes, indice + 1)

      return `${coefActualFormateado} + \\cfrac{1}{${resto}}`
    }

    return construirFraccionAnidada(coeficientes)
  }

  // Función para detectar si un coeficiente tiene múltiples caracteres
  // (necesario para bases > 10 donde usamos A-Z)
  const esMultiCaracter = (coef) => {
    return coef.length > 1 || /[A-Z]/.test(coef)
  }

  if (!coeficientes || coeficientes.length === 0) {
    return (
      <div className={`fraccion-continua-latex ${className}`}>
        <div className="latex-vacio">
          <span className="texto-vacio">No hay coeficientes para mostrar</span>
        </div>
      </div>
    )
  }

  const expansionLatex = generarLatexFraccionContinua(coeficientes)
  
  // Construir ecuación completa si hay datos de fracción del usuario
  let latexString = expansionLatex
  
  if (numeradorStr && denominadorStr && base !== undefined) {
    const fraccionUsuarioLatex = `\\frac{\\text{${latexEscapeText(numeradorStr)}}}{\\text{${latexEscapeText(denominadorStr)}}}_{(${base})}`
    latexString = `${fraccionUsuarioLatex} \\;=\\; ${expansionLatex}`
  }

  return (
    <div className={`fraccion-continua-latex ${className}`}>
      <div className="latex-contenedor">
        <BlockMath math={latexString} />
      </div>
    </div>
  )
}

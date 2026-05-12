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
 */
export default function FraccionContinuaSimpleLatex({ coeficientes, className = '' }) {
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

  const latexString = generarLatexFraccionContinua(coeficientes)

  return (
    <div className={`fraccion-continua-latex ${className}`}>
      <div className="latex-contenedor">
        <BlockMath math={latexString} />
      </div>
    </div>
  )
}

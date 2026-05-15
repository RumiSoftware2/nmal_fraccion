import BlockMath from '../components/pasosprueba/BlockMath'

/**
 * Renderiza LaTeX de fracción continua periódica (√p = [a0; overline{...}]).
 */
export default function FraccionPeriodicaContinuaSimpleLatex({
  preperiodo = [],
  periodo = [],
  esPeriodico = false,
  latexBackend = '',
  className = '',
}) {
  const formatearCoef = (n) => String(n)

  const generarNotacionCorchetes = () => {
    if (!preperiodo?.length) return '[]'

    const a0 = preperiodo[0]
    const cola = preperiodo.slice(1)

    if (!esPeriodico || !periodo?.length) {
      return `[${preperiodo.map(formatearCoef).join(', ')}]`
    }

    const prefijo = cola.length
      ? `${a0}; ${cola.map(formatearCoef).join(', ')}`
      : formatearCoef(a0)

    return `[${prefijo}; ${periodo.map(formatearCoef).join(', ')}...]`
  }

  // Función recursiva para construir la fracción anidada
  const generarLatexFraccionContinua = () => {
    const elementos = [
      ...(preperiodo || []).map(p => ({ valor: p, esPeriodo: false })),
      ...(periodo || []).map(p => ({ valor: p, esPeriodo: true }))
    ]

    if (elementos.length === 0) {
      return latexBackend || '\\text{Sin representación LaTeX}'
    }

    if (elementos.length === 1) {
      const el = elementos[0]
      const coefStr = el.esPeriodo ? `\\textcolor{#3b82f6}{${el.valor}}` : el.valor
      if (esPeriodico) {
        return `${coefStr} + \\cfrac{1}{\\textcolor{#3b82f6}{\\ddots}}`
      }
      return coefStr
    }

    const construirFraccionAnidada = (indice = 0) => {
      const el = elementos[indice]
      const coefStr = el.esPeriodo ? `\\textcolor{#3b82f6}{${el.valor}}` : el.valor

      if (indice === elementos.length - 1) {
        if (esPeriodico) {
          return `${coefStr} + \\cfrac{1}{\\textcolor{#3b82f6}{\\ddots}}`
        }
        return coefStr
      }

      const resto = construirFraccionAnidada(indice + 1)
      return `${coefStr} + \\cfrac{1}{${resto}}`
    }

    return construirFraccionAnidada()
  }

  const latexString = generarLatexFraccionContinua()

  return (
    <div className={`fraccion-continua-latex ${className}`}>
      <div className="notacion-brackets-display">
        <span className="notacion-corchetes-label">Notación:</span>
        <code className="notacion-corchetes-valor">{generarNotacionCorchetes()}</code>
      </div>
      <div className="latex-contenedor">
        <BlockMath math={latexString} />
      </div>
    </div>
  )
}

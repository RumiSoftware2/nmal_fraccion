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
      ? `${a0}, ${cola.map(formatearCoef).join(', ')}`
      : formatearCoef(a0)

    return `[${prefijo}; ${periodo.map(formatearCoef).join(', ')}...]`
  }

  const latexString = latexBackend || '\\text{Sin representación LaTeX}'

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

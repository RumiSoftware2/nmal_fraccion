import { motion } from 'framer-motion'

export default function Paso1Illustration({ input }) {
  const { entero, no_periodo, periodo, base } = input
  const m = no_periodo.length
  const n = periodo.length

  const xNotation = `${entero}${no_periodo ? '.' + no_periodo : ''}${periodo ? `(${periodo})` : ''}`
  const valueAllDigits = `${entero}${no_periodo}${periodo}`
  const valueBeforePeriod = `${entero}${no_periodo}`

  return (
    <motion.div 
      className="math-step-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <h3>Paso 1: Preparar x y multiplicar por la base</h3>
      <p>
        Sea <strong>x</strong> el número periódico:
      </p>
      <div className="math-expression">
        <span className="math-inline">x =</span>
        <span className="math-value">{xNotation}</span>
        <span className="subscript"><em>base</em> {base}</span>
      </div>

      <p>
        Multiplicamos por <strong>b<sup>m+n</sup></strong> para tomar todos los dígitos (incluyendo periodo):
      </p>
      <div className="math-expression">
        <span className="math-inline">{base}<sup>{m + n}</sup> · x =</span>
        <span className="math-value">{valueAllDigits}</span>
        <span className="subscript"><em>base</em> {base}</span>
      </div>

      <p>
        Multiplicamos por <strong>b<sup>m</sup></strong> para tomar los dígitos antes del periodo:
      </p>
      <div className="math-expression">
        <span className="math-inline">{base}<sup>{m}</sup> · x =</span>
        <span className="math-value">{valueBeforePeriod}</span>
        <span className="subscript"><em>base</em> {base}</span>
      </div>

      <p>
        Resta (paso siguiente): <strong>{base}<sup>{m + n}</sup>·x − {base}<sup>{m}</sup>·x</strong> da numerador sin las repeticiones.
      </p>
    </motion.div>
  )
}

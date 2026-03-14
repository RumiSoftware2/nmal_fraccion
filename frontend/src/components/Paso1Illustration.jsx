import { motion } from 'framer-motion'
import 'katex/dist/katex.min.css'
import { BlockMath, InlineMath } from 'react-katex'

export default function Paso1Illustration({ input }) {
  const { entero, no_periodo, periodo, base } = input
  const m = no_periodo.length
  const n = periodo.length

  const xString = `${entero}${no_periodo ? '.' + no_periodo : ''}${periodo ? `(${periodo})` : ''}`

  const fullDigits = `${entero}${no_periodo}${periodo}`
  const beforeDigits = `${entero}${no_periodo}`
  const fullValue10 = parseInt(fullDigits, base)
  const beforeValue10 = parseInt(beforeDigits, base)

  const latexX = `x = ${entero}${no_periodo ? `.${no_periodo}` : ''}${periodo ? `\\ overline{${periodo}}` : ''}`
  const latexAllDigits = `${base}^{${m + n}} \\ cdot x = ${fullDigits}`
  const latexAllDigits10 = `(${fullDigits})_{${base}} = ${fullValue10}_{10}`
  const latexBefore = `${base}^{${m}} // cdot x = ${beforeDigits}`
  const latexBefore10 = `${beforeDigits}_{${base}} = ${beforeValue10}_{10}`
  const latexDiff = `${base}^{${m + n}}x - ${base}^{${m}}x = ${fullDigits} - ${beforeDigits}`
  const latexValueDiff = `${fullValue10}_{10} - ${beforeValue10}_{10} = ${fullValue10 - beforeValue10}_{10}`

  return (
    <motion.div 
      className="math-step-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <h3>Paso 1: x y multiplicación en base {base}</h3>

      <p>Definimos:</p>
      <BlockMath math={latexX} />

      <p>Multiplicar para tomar todos los dígitos (incluido periodo):</p>
      <BlockMath math={latexAllDigits} />
      <p>En notación decimal (base 10):</p>
      <BlockMath math={latexAllDigits10} />

      <p>Multiplicar para tomar solo dígitos antes del periodo (m = {m}):</p>
      <BlockMath math={latexBefore} />
      <p>En notación decimal (base 10):</p>
      <BlockMath math={latexBefore10} />

      <p>Resta para eliminar parte periódica (m = {m}, n = {n}):</p>
      <BlockMath math={latexDiff} />
      <p>Correspondiente en base 10:</p>
      <BlockMath math={latexValueDiff} />

      <p>
        Número completo: <strong>{xString}</strong> (base {base})
      </p>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import 'katex/dist/katex.min.css'
import { BlockMath, InlineMath } from 'react-katex'

export default function Paso1Illustration({ input }) {
  const { entero, no_periodo, periodo, base } = input
  const m = no_periodo.length
  const n = periodo.length

  const xString = `${entero}${no_periodo ? '.' + no_periodo : ''}${periodo ? `(${periodo})` : ''}`

  const latexX = `x = ${entero}${no_periodo ? `.${no_periodo}` : ''}${periodo ? `(${periodo})` : ''}`
  const latexAllDigits = `${base}^{${m + n}} x = ${entero}${no_periodo}${periodo}`
  const latexBefore = `${base}^{${m}} x = ${entero}${no_periodo}`
  const latexDiff = `${base}^{${m + n}}x - ${base}^{${m}}x = ${entero}${no_periodo}${periodo} - ${entero}${no_periodo}`

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

      <p>Multiplicar para tomar solo digitos antes del periodo:</p>
      <BlockMath math={latexBefore} />

      <p>Resta para eliminar parte periódica:</p>
      <BlockMath math={latexDiff} />

      <p>
        Número completo: <strong>{xString}</strong> (base {base})
      </p>
    </motion.div>
  )
}

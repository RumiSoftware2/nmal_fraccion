import { motion } from 'framer-motion'
import BlockMath from './BlockMath'

export default function PasoMultiplicaAntes({ entero, no_periodo, base }) {
  const m = no_periodo.length
  const beforeDigits = `${entero}${no_periodo}`
  const latexBefore = `${base}^{${m}} \\cdot x = ${beforeDigits}_{${base}}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
    >
      <p>Multiplicamos para capturar solo los dígitos antes del periodo (m = {m}):</p>
      <BlockMath math={latexBefore} />
    </motion.div>
  )
}

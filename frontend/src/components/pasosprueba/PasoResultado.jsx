import { motion } from 'framer-motion'
import BlockMath from './BlockMath'

export default function PasoResultado({ entero, no_periodo, periodo, base }) {
  const fullDigits   = `${entero}${no_periodo}${periodo}`
  const beforeDigits = `${entero}${no_periodo}`

  const fullValue10   = parseInt(fullDigits,   base)
  const beforeValue10 = parseInt(beforeDigits, base)
  const diffValue10   = fullValue10 - beforeValue10
  const diffInBase    = diffValue10.toString(base).toUpperCase()

  const latexResultado = `${fullDigits}_{${base}} - ${beforeDigits}_{${base}} = ${diffInBase}_{${base}} \\;=\\; ${diffValue10}_{10}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.4 }}
    >
      <p>Resultado:</p>
      <BlockMath math={latexResultado} />
    </motion.div>
  )
}

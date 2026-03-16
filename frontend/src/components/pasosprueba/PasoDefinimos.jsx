import { motion } from 'framer-motion'
import BlockMath from './BlockMath'

export default function PasoDefinimos({ entero, no_periodo, periodo, base }) {
  const latexX = `x = ${entero}${no_periodo ? `.${no_periodo}` : ''}${periodo ? `\\overline{${periodo}}` : ''}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <p>Definimos:</p>
      <BlockMath math={latexX} />
    </motion.div>
  )
}

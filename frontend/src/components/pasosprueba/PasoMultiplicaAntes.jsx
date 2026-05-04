import { motion } from 'framer-motion'
import BlockMath from './BlockMath'

export default function PasoMultiplicaAntes({ entero, no_periodo, base }) {
  // Helper function to convert number to its representation in the given base
  const convertToBase = (numero, baseDestino) => {
    return numero.toString(baseDestino).toUpperCase()
  }

  const m = no_periodo.length
  const beforeDigits = `${entero}${no_periodo}`
  
  // Convert all numbers to their correct base representation
  const baseEnBase = convertToBase(base, base)
  const exponentEnBase = convertToBase(m, base)
  const latexBefore = `${baseEnBase}^{${exponentEnBase}} \\cdot x = ${beforeDigits}_{${baseEnBase}}`

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

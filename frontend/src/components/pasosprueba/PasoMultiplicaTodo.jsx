import { motion } from 'framer-motion'
import BlockMath from './BlockMath'

export default function PasoMultiplicaTodo({ entero, no_periodo, periodo, base }) {
  // Helper function to convert number to its representation in the given base
  const convertToBase = (numero, baseDestino) => {
    return numero.toString(baseDestino).toUpperCase()
  }

  const m = no_periodo.length
  const n = periodo.length
  const fullDigits = `${entero}${no_periodo}${periodo}`
  
  // Convert all numbers to their correct base representation
  const baseEnBase = convertToBase(base, base)
  const exponentEnBase = convertToBase(m + n, base)
  const latexAllDigits = `${baseEnBase}^{${exponentEnBase}} \\cdot x = ${fullDigits}_{${baseEnBase}}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      <p>Multiplicamos para capturar todos los dígitos incluyendo el periodo:</p>
      <BlockMath math={latexAllDigits} />
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import BlockMath from './BlockMath'

export default function PasoResultado({ entero, no_periodo, periodo, base }) {
  // Helper function to convert number to its representation in the given base
  const convertToBase = (numero, baseDestino) => {
    return numero.toString(baseDestino).toUpperCase()
  }

  const fullDigits   = `${entero}${no_periodo}${periodo}`
  const beforeDigits = `${entero}${no_periodo}`

  // Calculate m and n
  const m = no_periodo.length
  const n = periodo.length

  // Numerator calculations (existing)
  const fullValue10   = parseInt(fullDigits,   base)
  const beforeValue10 = parseInt(beforeDigits, base)
  const diffValue10   = fullValue10 - beforeValue10
  const diffInBase    = diffValue10.toString(base).toUpperCase()

  // Denominator calculations (new)
  const denominadorValue10 = Math.pow(base, m + n) - Math.pow(base, m)
  const denominadorInBase = denominadorValue10.toString(base).toUpperCase()

  // Convert all numbers to their correct base representation
  const baseEnBase = convertToBase(base, base)
  const exponentMNEnBase = convertToBase(m + n, base)
  const exponentMEnBase = convertToBase(m, base)

  // LaTeX equations
  const latexNumerador = `${fullDigits}_{${baseEnBase}} - ${beforeDigits}_{${baseEnBase}} = ${diffInBase}_{${baseEnBase}} `
  const latexDenominador = `${baseEnBase}^{${exponentMNEnBase}} - ${baseEnBase}^{${exponentMEnBase}} = ${denominadorInBase}_{${baseEnBase}} `
  const latexFraccion = `\\frac{${diffInBase}}{${denominadorInBase}}_{(${baseEnBase})}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.4 }}
    >
      <p>Numerador:</p>
      <BlockMath math={latexNumerador} />

      <p>Denominador:</p>
      <BlockMath math={latexDenominador} />

      <p>Fracción final:</p>
      <BlockMath math={latexFraccion} />
    </motion.div>
  )
}

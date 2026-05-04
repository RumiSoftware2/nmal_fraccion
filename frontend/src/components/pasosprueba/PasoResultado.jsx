import { motion } from 'framer-motion'
import BlockMath from './BlockMath'

export default function PasoResultado({ entero, no_periodo, periodo, base }) {
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

  // LaTeX equations
  const latexNumerador = `${fullDigits}_{${base}} - ${beforeDigits}_{${base}} = ${diffInBase}_{${base}} \;=\; ${diffValue10}_{10}`
  const latexDenominador = `${base}^{${m+n}} - ${base}^{${m}} = ${denominadorInBase}_{${base}} \;=\; ${denominadorValue10}_{10}`
  const latexFraccion = `\\frac{${diffInBase}}{${denominadorInBase}}_{(${base})}`

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

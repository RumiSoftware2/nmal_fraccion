import { motion } from 'framer-motion'
import BlockMath from './BlockMath'
import { latexRestaColumnas, generarPotenciaEnBase } from './mathUtils'

export default function PasoRestaColumnas({ entero, no_periodo, periodo, base }) {
  // Helper function to convert number to its representation in the given base
  const convertToBase = (numero, baseDestino) => {
    return numero.toString(baseDestino).toUpperCase()
  }

  const m = no_periodo.length
  const n = periodo.length
  const fullDigits  = `${entero}${no_periodo}${periodo}`
  const beforeDigits = `${entero}${no_periodo}`

  // Generar potencias para el denominador
  const potenciaMN = generarPotenciaEnBase(base, m + n)
  const potenciaM = generarPotenciaEnBase(base, m)

  // Convert all numbers to their correct base representation
  const baseEnBase = convertToBase(base, base)
  const exponentMNEnBase = convertToBase(m + n, base)
  const exponentMEnBase = convertToBase(m, base)
  
  const latexEcuacion = `(${baseEnBase}^{${exponentMNEnBase}} - ${baseEnBase}^{${exponentMEnBase}})\\cdot x = ${fullDigits}_{${baseEnBase}} - ${beforeDigits}_{${baseEnBase}}`
  const latexRestaB   = latexRestaColumnas(fullDigits, beforeDigits, base)
  const latexRestaDen = latexRestaColumnas(potenciaMN, potenciaM, base)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3 }}
    >
      <p>Restamos para eliminar la parte periódica:</p>
      <BlockMath math={latexEcuacion} />

      <p>
        Operación columna por columna <strong>en base {base}</strong>{' '}
        (dígito tachado = se pidió prestado de la columna anterior):
      </p>
      <BlockMath math={latexRestaB} />

      <p>
        <strong>Resta del Denominador</strong> - potencias de la base:
      </p>
      <BlockMath math={latexRestaDen} />
    </motion.div>
  )
}

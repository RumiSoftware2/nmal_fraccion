import { useState } from 'react'
import { motion } from 'framer-motion'
import MathInput from './MathInput'
import MathButton from './MathButton'
import { Hash } from 'lucide-react'
import './SimpleConversionForm.css'

function parseNumero(numero) {
  /**
   * Parsea un número en diferentes formatos:
   * - Periódico puro: 0.(3) => entero="0", no_periodo="", periodo="3"
   * - Periódico mixto: 0.1(6) => entero="0", no_periodo="1", periodo="6"
   * - Sin período: 2.5 => entero="2", no_periodo="5", periodo=""
   * - Solo entero: 5 => entero="5", no_periodo="", periodo=""
   */
  let entero = ''
  let no_periodo = ''
  let periodo = ''

  const dotIndex = numero.indexOf('.')
  const parenIndex = numero.indexOf('(')

  if (dotIndex !== -1) {
    // Hay punto decimal
    entero = numero.substring(0, dotIndex)
    if (parenIndex !== -1) {
      // Hay paréntesis después del punto: número periódico mixto
      no_periodo = numero.substring(dotIndex + 1, parenIndex)
      periodo = numero.substring(parenIndex + 1, numero.indexOf(')'))
    } else {
      // No hay paréntesis: número sin período (decimal finito)
      no_periodo = numero.substring(dotIndex + 1)
      periodo = ''
    }
  } else {
    // No hay punto decimal
    if (parenIndex !== -1) {
      // Hay paréntesis: número periódico puro como 5(3)
      entero = numero.substring(0, parenIndex)
      periodo = numero.substring(parenIndex + 1, numero.indexOf(')'))
      no_periodo = ''
    } else {
      // Solo número entero
      entero = numero
      no_periodo = ''
      periodo = ''
    }
  }

  return { entero, no_periodo, periodo }
}

export default function SimpleConversionForm({ onSubmit, loading }) {
  const [campos, setCampos] = useState({
    numero: '', 
    base: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const { entero, no_periodo, periodo } = parseNumero(campos.numero)
    onSubmit({ entero, no_periodo, periodo, base: parseInt(campos.base) })
  }

  const handleChange = (e) => {
    setCampos(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <motion.div 
      className="conversion-form"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <form onSubmit={handleSubmit} className="math-form">
        <div className="input-grid">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <MathInput
              label="Número (Periódico o Sin Período)"
              name="numero"
              value={campos.numero}
              onChange={handleChange}
              placeholder=""
              type="text"
              icon={<Hash size={16} />}
              helpText="Periódico: 0.1(6)=0.1666... | Periódico puro: 0.(3)=0.3333...  | Sin período: 2.5 | Entero: 5"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <MathInput
              label="Base"
              name="base"
              value={campos.base}
              onChange={handleChange}
              placeholder=""
              type="number"
              icon={<Hash size={16} />}
              helpText="Base numérica (entre 2 y 36)"
            />
          </motion.div>
        </div>

        <motion.div 
          className="form-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <MathButton
            type="submit"
            loading={loading}
            disabled={loading}
            variant="primary"
            size="large"
          >
            {loading ? 'Calculando...' : '🚀 Convertir a Fracción'}
          </MathButton>
        </motion.div>
      </form>
    </motion.div>
  )
}
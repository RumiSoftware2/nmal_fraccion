import { useState } from 'react'
import { motion } from 'framer-motion'
import MathInput from './MathInput'
import MathButton from './MathButton'
import { Hash } from 'lucide-react'
import './SimpleConversionForm.css'

function parseNumero(numero) {
  let entero = ''
  let no_periodo = ''
  let periodo = ''

  const dotIndex = numero.indexOf('.')
  const parenIndex = numero.indexOf('(')

  if (dotIndex !== -1) {
    entero = numero.substring(0, dotIndex)
    if (parenIndex !== -1) {
      no_periodo = numero.substring(dotIndex + 1, parenIndex)
      periodo = numero.substring(parenIndex + 1, numero.indexOf(')'))
    } else {
      no_periodo = numero.substring(dotIndex + 1)
      periodo = ''
    }
  } else {
    if (parenIndex !== -1) {
      entero = numero.substring(0, parenIndex)
      periodo = numero.substring(parenIndex + 1, numero.indexOf(')'))
      no_periodo = ''
    } else {
      entero = numero
      no_periodo = ''
      periodo = ''
    }
  }

  return { entero, no_periodo, periodo }
}

function isValidBase(val) {
  if (val === '' || val === null || val === undefined) return false
  const n = Number(val)
  if (!Number.isInteger(n)) return false
  if (n < 2) return false
  return true
}

function getBaseError(val) {
  if (val === '' || val === null || val === undefined) return ''
  const n = Number(val)
  if (!Number.isFinite(n)) return 'La base debe ser un número válido'
  if (!Number.isInteger(n)) return 'La base debe ser un número entero'
  if (n < 2) return 'La base debe ser un número entero ≥ 2'
  return ''
}

export default function SimpleConversionForm({ onSubmit, loading }) {
  const [campos, setCampos] = useState({
    numero: '', 
    base: ''
  })
  const [baseError, setBaseError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValidBase(campos.base)) return
    const { entero, no_periodo, periodo } = parseNumero(campos.numero)
    onSubmit({ entero, no_periodo, periodo, base: parseInt(campos.base) })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCampos(prev => ({ ...prev, [name]: value }))
    if (name === 'base') {
      setBaseError(getBaseError(value))
    }
  }

  const canSubmit = isValidBase(campos.base) && campos.numero.trim() !== '' && !loading

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
              label="Número N-mal"
              name="numero"
              value={campos.numero}
              onChange={handleChange}
              placeholder=""
              type="text"
              icon={<Hash size={16} />}
              helpText="Periódico: 3.1(456)=3.1456456456... | Periódico puro: 0.(3)=0.3333...  | Sin período: 2.5 | Entero: 5"
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
              min="2"
              step="1"
              error={baseError}
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
            disabled={!canSubmit}
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

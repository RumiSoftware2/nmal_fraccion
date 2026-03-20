import { useState } from 'react'
import { motion } from 'framer-motion'
import MathInput from './MathInput'
import MathButton from './MathButton'
import { Hash } from 'lucide-react'

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
    }
  } else {
    if (parenIndex !== -1) {
      entero = numero.substring(0, parenIndex)
      periodo = numero.substring(parenIndex + 1, numero.indexOf(')'))
    } else {
      entero = numero
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="math-form">
        <div className="input-grid">
          <MathInput
            label="Número Periódico"
            name="numero"
            value={campos.numero}
            onChange={handleChange}
            placeholder="ej: 0.1(6)"
            type="text"
            icon={<Hash size={16} />}
            helpText="Ingresa el número en formato: entero.no_periodo(periodo), ej: 1.23(45)"
          />
          
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
        </div>

        <motion.div 
          className="form-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
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
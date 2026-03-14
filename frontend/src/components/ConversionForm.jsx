import { useState } from 'react'
import { motion } from 'framer-motion'
import MathInput from './MathInput'
import MathButton from './MathButton'
import { Hash, Repeat, Square } from 'lucide-react'

export default function ConversionForm({ onSubmit, loading }) {
  const [campos, setCampos] = useState({
    entero: '', 
    no_periodo: '', 
    periodo: '', 
    base: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(campos)
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
            label="Parte Entera"
            name="entero"
            value={campos.entero}
            onChange={handleChange}
            placeholder="Ej: 0"
            type="text"
            icon={<Hash size={16} />}
            helpText="La parte entera del número periódico"
          />
          
          <MathInput
            label="No Período"
            name="no_periodo"
            value={campos.no_periodo}
            onChange={handleChange}
            placeholder="Ej: 1"
            type="text"
            icon={<Square size={16} />}
            helpText="Los dígitos que no se repiten"
          />
          
          <MathInput
            label="Período"
            name="periodo"
            value={campos.periodo}
            onChange={handleChange}
            placeholder="Ej: 6"
            type="text"
            icon={<Repeat size={16} />}
            helpText="Los dígitos que se repiten indefinidamente"
          />
          
          <MathInput
            label="Base"
            name="base"
            value={campos.base}
            onChange={handleChange}
            placeholder="Ej: 7"
            type="number"
            icon={<Hash size={16} />}
            helpText="Base numérica (generalmente 10)"
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
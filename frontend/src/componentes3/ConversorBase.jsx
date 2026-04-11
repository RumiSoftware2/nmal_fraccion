import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import './ConversorBase.css'

const CONFIG_API = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
}

export default function ConversorBase() {
  const [formData, setFormData] = useState({
    entero: '0',
    no_periodo: '0',
    periodo: '0',
    base_origen: '10',
    base_destino: '2'
  })

  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleConvert = async () => {
    setError(null)
    setResultado(null)
    setLoading(true)

    try {
      // Validar que base_origen y base_destino sean diferentes
      if (formData.base_origen === formData.base_destino) {
        throw new Error('La base origen y destino deben ser diferentes')
      }

      // Validar rangos de bases
      const baseOrigen = parseInt(formData.base_origen)
      const baseDestino = parseInt(formData.base_destino)

      if (baseOrigen < 2 || baseOrigen > 36) {
        throw new Error('La base origen debe estar entre 2 y 36')
      }

      if (baseDestino < 2 || baseDestino > 36) {
        throw new Error('La base destino debe estar entre 2 y 36')
      }

      const response = await fetch(`${CONFIG_API.VITE_API_URL}/convertir-base`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entero: formData.entero,
          no_periodo: formData.no_periodo,
          periodo: formData.periodo,
          base_origen: baseOrigen,
          base_destino: baseDestino
        })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Error en la conversión')
      }

      const data = await response.json()
      setResultado(data)
    } catch (err) {
      setError(err.message || 'Error al convertir')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="conversor-base-container">
      <motion.div
        className="conversor-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>🔄 Conversor de Bases</h2>
        <p>Convierte números n-mal entre diferentes bases numéricas</p>
      </motion.div>

      <motion.div
        className="conversor-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="form-section">
          <h3>📝 Ingresa los Datos</h3>

          <div className="input-group">
            <label>Parte Entera</label>
            <input
              type="text"
              name="entero"
              value={formData.entero}
              onChange={handleInputChange}
              placeholder="Ej: 3"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Parte Antes del Período (No Periódica)</label>
            <input
              type="text"
              name="no_periodo"
              value={formData.no_periodo}
              onChange={handleInputChange}
              placeholder="Ej: 25"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Parte Periódica</label>
            <input
              type="text"
              name="periodo"
              value={formData.periodo}
              onChange={handleInputChange}
              placeholder="Ej: 3 (para 3,253333...)"
              disabled={loading}
            />
          </div>

          <div className="bases-row">
            <div className="input-group">
              <label>Base Origen</label>
              <select
                name="base_origen"
                value={formData.base_origen}
                onChange={handleInputChange}
                disabled={loading}
              >
                {Array.from({ length: 35 }, (_, i) => i + 2).map(base => (
                  <option key={base} value={base}>
                    Base {base}
                  </option>
                ))}
              </select>
            </div>

            <div className="arrow-icon">
              <ArrowRight size={24} />
            </div>

            <div className="input-group">
              <label>Base Destino</label>
              <select
                name="base_destino"
                value={formData.base_destino}
                onChange={handleInputChange}
                disabled={loading}
              >
                {Array.from({ length: 35 }, (_, i) => i + 2).map(base => (
                  <option key={base} value={base}>
                    Base {base}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            className="convert-btn"
            onClick={handleConvert}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Convirtiendo...' : '🔄 Convertir'}
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {resultado && (
            <motion.div
              className="resultado-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="resultado-header">
                <CheckCircle size={24} className="success-icon" />
                <h3>✨ Resultado</h3>
              </div>

              <div className="resultado-content">
                <div className="conversiones-display">
                  <div className="conversion-item">
                    <span className="label">Número Original (Base {resultado.base_origen}):</span>
                    <span className="value">{resultado.numero_original}</span>
                  </div>

                  <div className="conversion-item">
                    <span className="label">Número Convertido (Base {resultado.base_destino}):</span>
                    <span className="value">{resultado.numero_convertido}</span>
                  </div>

                  <div className="conversion-item">
                    <span className="label">Valor en Base 10:</span>
                    <span className="value">{resultado.valor_base_10}</span>
                  </div>
                </div>

                {resultado.detalles && (
                  <div className="detalles-section">
                    <h4>📊 Detalles de la Conversión</h4>
                    <p>{resultado.detalles}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

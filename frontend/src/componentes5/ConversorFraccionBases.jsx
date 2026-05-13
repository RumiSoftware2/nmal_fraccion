import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightLeft, RotateCcw, AlertCircle } from 'lucide-react'
import PasosConversorFraccionLatex from './PasosConversorFraccionLatex'
import './ConversorFraccionBases.css'

export default function ConversorFraccionBases() {
  const [fraccion, setFraccion] = useState('')
  const [baseOrigen, setBaseOrigen] = useState('10')
  const [baseDestino, setBaseDestino] = useState('2')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)

  const calcular = () => {
    setError(null)
    setResultado(null)

    if (!fraccion || !fraccion.includes('/')) {
      setError('Ingresa la fracción en formato: numerador/denominador (ej: 14/5)')
      return
    }

    const [numStr, denStr] = fraccion.split('/').map(s => s.trim())
    
    if (!numStr || !denStr) {
      setError('Fracción inválida. Usa el formato: numerador/denominador')
      return
    }

    const baseO = parseInt(baseOrigen, 10)
    const baseD = parseInt(baseDestino, 10)

    if (isNaN(baseO) || baseO < 2 || baseO > 36) {
      setError('La base de partida debe estar entre 2 y 36')
      return
    }

    if (isNaN(baseD) || baseD < 2 || baseD > 36) {
      setError('La base de llegada debe estar entre 2 y 36')
      return
    }

    const num10 = parseInt(numStr, baseO)
    const den10 = parseInt(denStr, baseO)

    if (isNaN(num10) || isNaN(den10)) {
      setError(`Los valores ingresados no son válidos para la base de partida ${baseO}`)
      return
    }

    if (den10 === 0) {
      setError('El denominador matemático no puede ser cero')
      return
    }

    const numDest = num10.toString(baseD).toUpperCase()
    const denDest = den10.toString(baseD).toUpperCase()

    setResultado({
      base_origen: baseO,
      base_destino: baseD,
      numerador_origen: numStr.toUpperCase(),
      denominador_origen: denStr.toUpperCase(),
      numerador_destino: numDest,
      denominador_destino: denDest,
      numerador_base_10: num10,
      denominador_base_10: den10
    })
  }

  const resetear = () => {
    setFraccion('')
    setBaseOrigen('10')
    setBaseDestino('2')
    setResultado(null)
    setError(null)
  }

  return (
    <div className="conversor-fraccion-wrapper">
      <motion.div 
        className="conversor-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="conversor-title">
          <ArrowRightLeft size={28} color="#ec4899" />
          Conversor de Fracciones
        </h2>
        <p className="conversor-desc">
          Transforma matemáticamente una fracción de cualquier base (2-36) a otra base distinta, visualizando el proceso detallado.
        </p>

        <div className="inputs-grid">
          <div className="input-group">
            <label className="input-label">Fracción Original</label>
            <input 
              type="text" 
              className="conversor-input"
              value={fraccion}
              onChange={e => setFraccion(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && calcular()}
              placeholder="ej: A/7"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Base Partida</label>
            <input 
              type="text" 
              className="conversor-input"
              value={baseOrigen}
              onChange={e => setBaseOrigen(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyPress={e => e.key === 'Enter' && calcular()}
              placeholder="2 - 36"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Base Llegada</label>
            <input 
              type="text" 
              className="conversor-input"
              value={baseDestino}
              onChange={e => setBaseDestino(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyPress={e => e.key === 'Enter' && calcular()}
              placeholder="2 - 36"
            />
          </div>
        </div>

        <div className="conversor-actions">
          <motion.button 
            className="btn-convertir"
            onClick={calcular}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowRightLeft size={20} /> Convertir Base
          </motion.button>
          
          <motion.button 
            className="btn-limpiar"
            onClick={resetear}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
             <RotateCcw size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/> Limpiar
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, height: 0, marginTop: 0 }} 
              animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }} 
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {resultado && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PasosConversorFraccionLatex resultado={resultado} />
        </motion.div>
      )}
    </div>
  )
}

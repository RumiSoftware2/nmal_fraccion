import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dividirFracciones } from '../services/api'
import PasosSuma from './PasosSuma'
import ConversorResultadoSuma from './ConversorResultadoSuma'
import '../componentes2Styles/Suma.css'

// Trunca la parte decimal de un string numérico a maxDecimals dígitos
function truncateDecimal(value, maxDecimals = 4) {
  if (!value || typeof value !== 'string') return value
  const dotIndex = value.indexOf('.')
  if (dotIndex === -1) return value
  const decimalPart = value.slice(dotIndex + 1)
  if (decimalPart.length <= maxDecimals) return value
  return value.slice(0, dotIndex + 1 + maxDecimals) + '…'
}

// Redondea automáticamente si hay dos ceros seguidos en los decimales
function roundOnDoubleZeros(value) {
  if (!value || typeof value !== 'string') return value
  const dotIndex = value.indexOf('.')
  if (dotIndex === -1) return value // No tiene decimales
  
  const decimalPart = value.slice(dotIndex + 1)
  const zeroIndex = decimalPart.indexOf('00')
  
  if (zeroIndex === -1) return value // No hay dos ceros seguidos
  
  // Redondear en el punto donde comienzan los dos ceros
  const beforeZeros = value.slice(0, dotIndex + 1 + zeroIndex)
  return beforeZeros
}

export default function Suma({ result1, result2, base1, base2 }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)
  // 'none' | 'resultado' | 'pasos' | 'conversor'
  const [activeView, setActiveView] = useState('none')

  // Parsear la fracción (ej: "1/2" -> { num: "1", den: "2" })
  const parseFraccion = (fractionStr) => {
    const parts = fractionStr.split('/')
    return {
      numerador: parts[0]?.trim() || '0',
      denominador: parts[1]?.trim() || '1'
    }
  }

  const frac1 = parseFraccion(result1?.fraccion_base_original || '0/1')
  const frac2 = parseFraccion(result2?.fraccion_base_original || '0/1')

  // Detectar si ambas fracciones están en la misma base
  const mismaBase = base1 === base2
  const base = base1

  const handleSuma = async () => {
    if (!mismaBase) {
      setError('❌ Las fracciones deben estar en la misma base para sumarlas')
      return
    }

    setLoading(true)
    setError('')
    setResultado(null)

    try {
      const datos = {
        numerador1: frac1.numerador,
        denominador1: frac1.denominador,
        numerador2: frac2.numerador,
        denominador2: frac2.denominador,
        base: base,
        operacion: 'suma'
      }

      const respuesta = await dividirFracciones(datos)
      setResultado(respuesta)
      setActiveView('resultado')
    } catch (err) {
      console.error('Error en suma:', err)
      setError(err.message || 'Error al realizar la suma')
    } finally {
      setLoading(false)
    }
  }

  const handleShowPasos = () => {
    setActiveView(prev => prev === 'pasos' ? 'none' : 'pasos')
  }

  const handleShowResultado = () => {
    if (!resultado) {
      handleSuma()
    } else {
      setActiveView(prev => prev === 'resultado' ? 'none' : 'resultado')
    }
  }

  return (
    <motion.div
      className="suma-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="suma-header">
        <h3>➕ Suma de Fracciones</h3>
        <p className="base-info">Base: {base}</p>
      </div>

      {/* Verificación de bases */}
      {!mismaBase && (
        <motion.div
          className="alert alert-warning"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>⚠️ Las fracciones están en bases diferentes:</p>
          <p>Fracción 1: Base {base1} | Fracción 2: Base {base2}</p>
          <p>Para sumar, deben estar en la misma base.</p>
        </motion.div>
      )}

      {/* Card de operación */}
      <div className="suma-operation">
        {/* Fracción 1 */}
        <div className="fraccion-card">
          <div className="fraccion-content">
            <div className="fraccion-numero">
              <span className="numerador">{frac1.numerador}</span>
              <div className="linea"></div>
              <span className="denominador">{frac1.denominador}</span>
            </div>
          </div>
          <p className="base-label">Base {base}</p>
        </div>

        {/* Operador */}
        <div className="operador">
          <span className="icon">➕</span>
        </div>

        {/* Fracción 2 */}
        <div className="fraccion-card">
          <div className="fraccion-content">
            <div className="fraccion-numero">
              <span className="numerador">{frac2.numerador}</span>
              <div className="linea"></div>
              <span className="denominador">{frac2.denominador}</span>
            </div>
          </div>
          <p className="base-label">Base {base}</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="suma-actions">
        <motion.button
          className={`btn-calcular ${activeView === 'resultado' ? 'active' : ''}`}
          onClick={handleShowResultado}
          disabled={loading || !mismaBase}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Calculando...
            </>
          ) : (
            '🔢 Calcular Suma'
          )}
        </motion.button>

        <motion.button
          className={`btn-pasos ${activeView === 'pasos' ? 'active' : ''}`}
          onClick={handleShowPasos}
          disabled={!mismaBase}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          📋 Pasos de la Suma
        </motion.button>

        <motion.button
          className={`btn-convertir ${activeView === 'conversor' ? 'active' : ''}`}
          onClick={() => setActiveView(prev => prev === 'conversor' ? 'none' : 'conversor')}
          disabled={!resultado || !mismaBase}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          title={!resultado ? 'Primero calcula la suma' : 'Convertir resultado a otra base'}
        >
          🔁 Convertir Resultado
        </motion.button>
      </div>

      {/* Mostrar errores */}
      {error && (
        <motion.div
          className="alert alert-error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Contenido exclusivo: resultado O pasos */}
      <AnimatePresence mode="wait">
        {/* Mostrar resultado */}
        {activeView === 'resultado' && resultado && (
          <motion.div
            key="resultado"
            className="resultado-suma"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <h4>📊 Resultado</h4>

            <div className="resultado-row">
              <div className="resultado-item">
                <p className="label">En base {base}:</p>
                <p className="valor resultado-fraccion">{roundOnDoubleZeros(resultado.resultado_completo)}</p>
              </div>
            </div>

            {/* Información sobre si es periódico */}
            <motion.div
              className={`periodicidad ${resultado.es_periodico ? 'es-periodico' : 'es-exacto'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {resultado.es_periodico ? (
                <>
                  <span className="icon">🔄</span>
                  <p>Este es un <strong>decimal periódico</strong> en base {base}</p>
                </>
              ) : (
                <>
                  <span className="icon">✅</span>
                  <p>Este es un <strong>decimal exacto</strong> en base {base}</p>
                </>
              )}
            </motion.div>

            {/* Desglose del resultado */}
            <div className="resultado-desglose">
              <div className="desglose-item">
                <p className="label">Parte Entera:</p>
                <p className="valor">{resultado.resultado_entero}</p>
              </div>
              <div className="desglose-item">
                <p className="label">Parte Decimal:</p>
                <p className="valor">{resultado.resultado_decimal ? roundOnDoubleZeros(resultado.resultado_decimal) : '(sin parte decimal)'}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mostrar pasos */}
        {activeView === 'pasos' && (
          <motion.div
            key="pasos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <PasosSuma frac1={frac1} frac2={frac2} base={base} />
          </motion.div>
        )}

        {/* Mostrar conversor de resultado */}
        {activeView === 'conversor' && (
          <motion.div
            key="conversor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <ConversorResultadoSuma
              resultadoSuma={resultado}
              base={base}
              baseDestino={10}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

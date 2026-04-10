import { useState } from 'react'
import { motion } from 'framer-motion'
import { dividirFracciones } from '../services/api'
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

export default function Suma({ result1, result2, base1, base2 }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)

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
        base: base
      }

      const respuesta = await dividirFracciones(datos)
      setResultado(respuesta)
    } catch (err) {
      console.error('Error en suma:', err)
      setError(err.message || 'Error al realizar la suma')
    } finally {
      setLoading(false)
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

      {/* Botón para calcular */}
      <motion.button
        className="btn-calcular"
        onClick={handleSuma}
        disabled={loading || !mismaBase}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? (
          <>
            <span className="spinner"></span> Calculando...
          </>
        ) : (
          '🔢 Calcular Suma'
        )}
      </motion.button>

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

      {/* Mostrar resultado */}
      {resultado && (
        <motion.div
          className="resultado-suma"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h4>📊 Resultado</h4>

          <div className="resultado-row">
            <div className="resultado-item">
              <p className="label">En base {base}:</p>
              <p className="valor resultado-fraccion">{truncateDecimal(resultado.resultado_completo)}</p>
            </div>

            <div className="resultado-item">
              <p className="label">En base 10 (verificación):</p>
              <p className="valor">{truncateDecimal(String(resultado.decimal_base10))}</p>
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
              <p className="valor">{resultado.resultado_decimal ? truncateDecimal(resultado.resultado_decimal) : '(sin parte decimal)'}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

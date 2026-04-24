import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle } from 'lucide-react'
import PasoDelConversor from '../componentes3/PasoDelConversor'
import '../componentes3/ConversorBase.css'

const CONFIG_API = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
}

/**
 * Parsea un string numérico con posible periodo en paréntesis.
 * Soporta formatos como "3.2(1)", "5", "2.5", "0.(3)"
 * También soporta el formato con "…" al final (truncado) → lo limpia.
 */
function parseResultadoNmal(valor) {
  if (!valor || typeof valor !== 'string') {
    return { entero: '0', no_periodo: '', periodo: '' }
  }

  // Limpiar el caracter de truncado si existe
  let v = valor.replace(/…/g, '').trim()

  let entero = '0'
  let no_periodo = ''
  let periodo = ''

  const partes = v.split('.')
  entero = partes[0] || '0'

  if (partes.length === 1) {
    return { entero, no_periodo, periodo }
  }

  const parteDecimal = partes[1]
  const idxP = parteDecimal.indexOf('(')

  if (idxP === -1) {
    no_periodo = parteDecimal
  } else {
    no_periodo = parteDecimal.substring(0, idxP)
    const idxC = parteDecimal.indexOf(')')
    periodo = idxC > idxP ? parteDecimal.substring(idxP + 1, idxC) : ''
  }

  return { entero, no_periodo, periodo }
}

/**
 * Reconstruye el string n-mal desde sus partes (para mostrar en UI).
 */
function reconstruirNmal({ entero, no_periodo, periodo }) {
  let s = entero
  if (no_periodo || periodo) {
    s += '.'
    s += no_periodo
    if (periodo) s += `(${periodo})`
  }
  return s
}

/**
 * ConversorResultadoSuma
 * 
 * Props:
 *   - resultadoSuma: objeto devuelto por el backend al sumar (tiene resultado_completo, resultado_entero, resultado_decimal, es_periodico, etc.)
 *   - base: base en la que está expresado el resultado de la suma
 *   - baseDestino: base a la que se quiere convertir (por defecto 10)
 */
export default function ConversorResultadoSuma({ resultadoSuma, base, baseDestino = 10 }) {
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [convertido, setConvertido] = useState(false)

  // Construir el número n-mal a partir del resultado de la suma
  const numeroNmal = (() => {
    if (!resultadoSuma) return null

    // Preferir resultado_completo si existe y tiene formato con paréntesis
    const completo = resultadoSuma.resultado_completo
    if (completo && typeof completo === 'string') {
      return completo.replace(/…/g, '').trim()
    }

    // Fallback: combinar parte entera y decimal
    const entero = String(resultadoSuma.resultado_entero || '0')
    const decimal = resultadoSuma.resultado_decimal
      ? String(resultadoSuma.resultado_decimal).replace(/…/g, '').trim()
      : ''

    if (!decimal) return entero
    return `${entero}.${decimal}`
  })()

  const parsed = numeroNmal ? parseResultadoNmal(numeroNmal) : null
  const numeroDisplay = parsed ? reconstruirNmal(parsed) : '—'

  const handleConvertir = async () => {
    if (!parsed) return

    setLoading(true)
    setError(null)
    setResultado(null)

    try {
      const baseOrigenNum = parseInt(base)
      const baseDestinoNum = parseInt(baseDestino)

      const response = await fetch(`${CONFIG_API.VITE_API_URL}/convertir-base`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entero: parsed.entero,
          no_periodo: parsed.no_periodo,
          periodo: parsed.periodo,
          base_origen: baseOrigenNum,
          base_destino: baseDestinoNum
        })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Error en la conversión')
      }

      const data = await response.json()
      setResultado(data)
      setConvertido(true)
    } catch (err) {
      setError(err.message || 'Error al convertir')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Auto-convertir al montar si hay resultadoSuma
  useEffect(() => {
    if (resultadoSuma && !convertido) {
      handleConvertir()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultadoSuma])

  if (!resultadoSuma) {
    return (
      <div className="conversor-resultado-suma-empty">
        <p>Primero calcula la suma para poder convertir el resultado.</p>
      </div>
    )
  }

  return (
    <div className="conversor-resultado-suma-wrap">
      {/* Header */}
      <div className="crs-header">
        <span className="crs-icon">🔁</span>
        <div>
          <h4 className="crs-title">Convertir Resultado a Base {baseDestino}</h4>
          <p className="crs-subtitle">
            Resultado de la suma:{' '}
            <code className="crs-code">{numeroDisplay}</code>{' '}
            en base {base} → base {baseDestino}
          </p>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-message"
            style={{ marginTop: '1rem' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <motion.div
          className="crs-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="spinner" style={{ borderTopColor: '#4f46e5', borderColor: 'rgba(79,70,229,0.2)' }} />
          <span>Convirtiendo...</span>
        </motion.div>
      )}

      {/* Resultado de conversión */}
      <AnimatePresence>
        {resultado && (
          <motion.div
            className="resultado-card"
            style={{ marginTop: '1rem' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Resumen de valores */}
            <div className="resultado-header">
              <CheckCircle size={22} className="success-icon" />
              <h3>✨ Conversión completada</h3>
            </div>

            <div className="resultado-content">
              <div className="conversiones-display">
                <div className="conversion-item">
                  <span className="label">Número original (Base {resultado.base_origen}):</span>
                  <span className="value">{resultado.numero_original}</span>
                </div>

                <div className="conversion-item">
                  <span className="label">Fracción equivalente (Base {resultado.base_destino}):</span>
                  <span className="value">{resultado.numero_convertido}</span>
                </div>

                {resultado.resultado_nmal && (
                  <div className="conversion-item highlight">
                    <span className="label">Valor N-mal (Base {resultado.base_destino}):</span>
                    <span className="value">{resultado.resultado_nmal}</span>
                  </div>
                )}

                <div className="conversion-item">
                  <span className="label">Valor en Base 10:</span>
                  <span className="value">{resultado.valor_base_10}</span>
                </div>
              </div>

              {/* Pasos detallados usando PasoDelConversor */}
              <div className="detalles-section">
                <h4>📊 Pasos de la conversión</h4>
                <PasoDelConversor resultado={resultado} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón para reintentar */}
      {(error || (convertido && !loading)) && (
        <motion.button
          className="crs-retry-btn"
          onClick={handleConvertir}
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{ marginTop: '1rem' }}
        >
          🔄 Volver a convertir
        </motion.button>
      )}
    </div>
  )
}

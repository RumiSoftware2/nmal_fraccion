import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import PasoDelConversor from '../componentes3/PasoDelConversor'
import '../componentes3/ConversorBase.css'

const CONFIG_API = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
}

function parseResultadoNmal(valor) {
  if (!valor || typeof valor !== 'string') {
    return { entero: '0', no_periodo: '', periodo: '' }
  }

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

function reconstruirNmal({ entero, no_periodo, periodo }) {
  let s = entero
  if (no_periodo || periodo) {
    s += '.'
    s += no_periodo
    if (periodo) s += `(${periodo})`
  }
  return s
}

export default function ConversorResultadoResta({ resultadoResta, base }) {
  const [baseDestino, setBaseDestino] = useState('10')
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Construir el número n-mal a partir del resultado de la suma
  const numeroNmal = (() => {
    if (!resultadoResta) return null

    const completo = resultadoResta.resultado_completo
    if (completo && typeof completo === 'string') {
      return completo.replace(/…/g, '').trim()
    }

    const entero = String(resultadoResta.resultado_entero || '0')
    const decimal = resultadoResta.resultado_decimal
      ? String(resultadoResta.resultado_decimal).replace(/…/g, '').trim()
      : ''

    if (!decimal) return entero
    return `${entero}.${decimal}`
  })()

  const parsed = numeroNmal ? parseResultadoNmal(numeroNmal) : null
  const numeroDisplay = parsed ? reconstruirNmal(parsed) : '—'

  const handleConvertir = async () => {
    if (!parsed) return

    const baseOrigenNum = parseInt(base)
    const baseDestinoNum = parseInt(baseDestino)

    if (baseOrigenNum === baseDestinoNum) {
      setError('La base origen y la base destino deben ser diferentes')
      return
    }

    setLoading(true)
    setError(null)
    setResultado(null)

    try {
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
    } catch (err) {
      setError(err.message || 'Error al convertir')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!resultadoResta) {
    return (
      <div className="conversor-resultado-suma-empty">
        <p>Primero calcula la resta para poder convertir el resultado.</p>
      </div>
    )
  }

  return (
    <div className="conversor-resultado-suma-wrap">
      <div className="crs-header">
        <span className="crs-icon">🔁</span>
        <div>
          <h4 className="crs-title">Convertir Resultado a otra Base</h4>
          <p className="crs-subtitle">
            Resultado de la resta:{' '}
            <code className="crs-code">{numeroDisplay}</code>{' '}
            en base {base}
          </p>
        </div>
      </div>

      <div className="crs-selector-row">
        <div className="crs-base-display">
          <span className="crs-base-label">Base {base}</span>
          <span className="crs-base-hint">(origen)</span>
        </div>

        <ArrowRight size={20} className="crs-arrow" />

        <div className="input-group" style={{ margin: 0, flex: 1 }}>
          <label style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>Base Destino</label>
          <select
            value={baseDestino}
            onChange={(e) => {
              setBaseDestino(e.target.value)
              setResultado(null)
              setError(null)
            }}
            disabled={loading}
          >
            {Array.from({ length: 35 }, (_, i) => i + 2).map((b) => (
              <option key={b} value={b} disabled={b === parseInt(base)}>
                Base {b}{b === parseInt(base) ? ' (origen)' : ''}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          className="crs-convert-btn"
          onClick={handleConvertir}
          disabled={loading || parseInt(baseDestino) === parseInt(base)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {loading ? (
            <><span className="spinner" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.25)', width: 14, height: 14, borderWidth: 2 }} /> Convirtiendo...</>
          ) : '🔄 Convertir'}
        </motion.button>
      </div>

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

              <div className="detalles-section">
                <h4>📊 Pasos de la conversión</h4>
                <PasoDelConversor resultado={resultado} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

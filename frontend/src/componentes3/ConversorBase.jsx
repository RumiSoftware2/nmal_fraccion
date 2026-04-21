import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react'
import './ConversorBase.css'

const CONFIG_API = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
}

/**
 * Parsea un número n-mal en formato: 1.3(4)
 * Retorna: { entero, no_periodo, periodo }
 * 
 * Ejemplos:
 * "1.3(4)" → { entero: "1", no_periodo: "3", periodo: "4" }
 * "2.5" → { entero: "2", no_periodo: "5", periodo: "" }
 * "0.(3)" → { entero: "0", no_periodo: "", periodo: "3" }
 * "3" → { entero: "3", no_periodo: "", periodo: "" }
 */
function parseNumeroNmal(numero) {
  if (!numero || numero.trim() === '') {
    throw new Error('El número no puede estar vacío')
  }

  numero = numero.trim()
  let entero = '0'
  let no_periodo = ''
  let periodo = ''

  // Separar por el punto decimal
  const partes = numero.split('.')
  
  if (partes.length > 2) {
    throw new Error('Formato inválido: solo puede haber un punto decimal')
  }

  // Parte entera
  if (partes[0]) {
    entero = partes[0]
  }

  // Si no hay parte decimal, listo
  if (partes.length === 1) {
    return { entero, no_periodo, periodo }
  }

  // Procesar parte decimal
  const parteDecimal = partes[1]

  // Buscar paréntesis para la parte periódica
  const indiceParentesis = parteDecimal.indexOf('(')

  if (indiceParentesis === -1) {
    // No hay período, todo es no periódico
    no_periodo = parteDecimal
  } else {
    // Hay período
    no_periodo = parteDecimal.substring(0, indiceParentesis)
    
    // Extraer lo que está dentro del paréntesis
    const indiceCierre = parteDecimal.indexOf(')')
    
    if (indiceCierre === -1) {
      throw new Error('Formato inválido: paréntesis sin cerrar en la parte periódica')
    }
    
    periodo = parteDecimal.substring(indiceParentesis + 1, indiceCierre)
    
    if (!periodo) {
      throw new Error('Formato inválido: el período no puede estar vacío (use .5 para números sin período)')
    }
  }

  return { entero, no_periodo, periodo }
}

export default function ConversorBase() {
  // Estado para N-mal a N-mal
  const [numeroInput, setNumeroInput] = useState('1.3(4)')
  const [baseOrigen, setBaseOrigen] = useState('10')
  const [baseDestino, setBaseDestino] = useState('2')
  const [resultado, setResultado] = useState(null)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const handleConvert = async () => {
    setError(null)
    setResultado(null)
    setLoading(true)

    try {
      // Validar que base_origen y base_destino sean diferentes
      const baseOrigenNum = parseInt(baseOrigen)
      const baseDestinoNum = parseInt(baseDestino)

      if (baseOrigenNum === baseDestinoNum) {
        throw new Error('La base origen y destino deben ser diferentes')
      }

      if (baseOrigenNum < 2 || baseOrigenNum > 36) {
        throw new Error('La base origen debe estar entre 2 y 36')
      }

      if (baseDestinoNum < 2 || baseDestinoNum > 36) {
        throw new Error('La base destino debe estar entre 2 y 36')
      }

      // Parsear el número n-mal
      const { entero, no_periodo, periodo } = parseNumeroNmal(numeroInput)

      const response = await fetch(`${CONFIG_API.VITE_API_URL}/convertir-base`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entero,
          no_periodo,
          periodo,
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
        {(
          <div className="form-section">
            <div className="section-header-with-help">
              <h3>📝 Ingresa el Número N-mal</h3>
              <motion.button
                className="help-btn"
                onClick={() => setShowHelp(!showHelp)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Ver ayuda de formato"
              >
                <HelpCircle size={20} />
              </motion.button>
            </div>

            <AnimatePresence>
              {showHelp && (
                <motion.div
                  className="help-box"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="help-content">
                    <p><strong>Formato:</strong> [entero].[no_período](período)</p>
                    <p><strong>Ejemplos:</strong></p>
                    <ul>
                      <li><code>1.3(4)</code> = 1.3444... (período = 4)</li>
                      <li><code>2.5</code> = 2.5 (sin período)</li>
                      <li><code>0.(3)</code> = 0.333... (período = 3)</li>
                      <li><code>3</code> = 3 (número entero)</li>
                      <li><code>0.1(6)</code> = 0.1666... (no_período=1, período=6)</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="input-group">
              <label>Número (formato: 1.3(4))</label>
              <input
                type="text"
                value={numeroInput}
                onChange={(e) => setNumeroInput(e.target.value)}
                placeholder="Ej: 1.3(4) ó 2.5 ó 3"
                disabled={loading}
                className="numero-input"
              />
              <span className="input-hint">
                El paréntesis indica qué dígitos se repiten infinitamente
              </span>
            </div>

            <div className="bases-row">
              <div className="input-group">
                <label>Base Origen</label>
                <select
                  value={baseOrigen}
                  onChange={(e) => setBaseOrigen(e.target.value)}
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
                  value={baseDestino}
                  onChange={(e) => setBaseDestino(e.target.value)}
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
        )}

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
                    <span className="label">Fracción Convertida (Base {resultado.base_destino}):</span>
                    <span className="value">{resultado.numero_convertido}</span>
                  </div>

                  {resultado.resultado_nmal && (
                    <div className="conversion-item highlight" style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      <span className="label">Valor Decimal (Base {resultado.base_destino}):</span>
                      <span className="value">{resultado.resultado_nmal}</span>
                    </div>
                  )}

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

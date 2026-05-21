import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw, ChevronDown } from 'lucide-react'
import { procesarExpresionFC } from './cerebro7'
import {
  PasoReducta,
  ExpansionFraccionContinua,
  ListaCompactaReductas
} from './ReductasFinitasLatex'
import './ReductasFinitas.css'

/**
 * Componente ReductasFinitas
 * 
 * Calcula y visualiza las reductas (convergentes) de una fracción continua simple finita.
 * 
 * Entrada del usuario:
 *   - Expresión: "2;2,3,4" → [2, 2, 3, 4]
 * 
 * Proceso (todo en frontend, sin backend):
 *   1. Parsea la expresión
 *   2. Calcula reductas usando recurrencia de Euclides
 *   3. Renderiza resultados con LaTeX
 */
export default function ReductasFinitas() {
  // ============================================================
  // ESTADO
  // ============================================================

  const [expresion, setExpresion] = useState('')          // Ej: "2;2,3,4"
  const [resultado, setResultado] = useState(null)       // Resultado de procesarExpresionFC
  const [error, setError] = useState(null)               // Mensaje de error
  const [loading, setLoading] = useState(false)          // Spinner mientras calcula
  const [expandedStep, setExpandedStep] = useState(null) // Qué paso está expandido

  // ============================================================
  // CALCULAR (sin backend)
  // ============================================================

  const calcular = async () => {
    setLoading(true)
    setError(null)

    try {
      // Pequeño delay para mostrar spinner (UX)
      await new Promise(resolve => setTimeout(resolve, 300))

      const res = procesarExpresionFC(expresion.trim())

      if (!res.ok) {
        setError(res.error)
        setResultado(null)
      } else {
        setError(null)
        setResultado(res)
        setExpandedStep(null) // Reset pasos expandidos
      }
    } catch (err) {
      setError(`Error inesperado: ${err.message}`)
      setResultado(null)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // RESETEAR
  // ============================================================

  const resetear = () => {
    setExpresion('')
    setResultado(null)
    setError(null)
    setExpandedStep(null)
  }

  // ============================================================
  // RENDER - SECCIÓN ENTRADA
  // ============================================================

  const renderSeccionEntrada = () => (
    <motion.div
      className="entrada-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>📉 Reductas Finitas</h2>
      <p className="subtitulo">
        Ingresa una fracción continua en formato [a₀; a₁, a₂, …] para calcular sus convergentes
      </p>

      <div className="formulario-contenedor">
        {/* Input de expresión */}
        <div className="grupo-input">
          <label htmlFor="expresion">Fracción continua (ej: 2;2,3,4)</label>
          <input
            id="expresion"
            type="text"
            placeholder="ej: 2;2,3,4 o 5 o 0;3,2"
            value={expresion}
            onChange={(e) => setExpresion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && calcular()}
            disabled={loading}
            className="input-expresion"
          />
          <small>
            Formato: a₀;a₁,a₂,… (números separados por comas, con punto y coma antes de la "parte periódica")
            <br />
            O solo un número si es un único coeficiente.
          </small>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="grupo-botones">
        <motion.button
          className="btn-calcular"
          onClick={calcular}
          disabled={loading || !expresion}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? (
            <>
              <span className="spinner" /> Calculando...
            </>
          ) : (
            <>
              <Send size={18} /> Calcular
            </>
          )}
        </motion.button>

        <motion.button
          className="btn-resetear"
          onClick={resetear}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={18} /> Limpiar
        </motion.button>
      </div>

      {/* Mensaje de error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mensaje-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  // ============================================================
  // RENDER - RESUMEN
  // ============================================================

  const renderResumen = () => {
    if (!resultado) return null

    const { coeficientes, notacion, valorFinal, reductas } = resultado

    return (
      <motion.div
        className="resumen-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="resumen-header">
          <h3>📊 Resultado</h3>
        </div>

        <div className="resumen-contenido">
          <div className="item-resumen">
            <span className="label">Notación:</span>
            <span className="valor notacion-valor">{notacion}</span>
          </div>

          <div className="item-resumen">
            <span className="label">Valor exacto:</span>
            <span className="valor fraccion-valor">
              {valorFinal.p}/{valorFinal.q}
            </span>
          </div>

          <div className="item-resumen">
            <span className="label">Cantidad de coeficientes:</span>
            <span className="valor">{coeficientes.length}</span>
          </div>
        </div>
      </motion.div>
    )
  }

  // ============================================================
  // RENDER - LISTA COMPACTA DE REDUCTAS
  // ============================================================

  const renderListaReductas = () => {
    if (!resultado) return null

    const { reductas } = resultado

    return (
      <motion.div
        className="lista-reductas-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3>🔢 Reductas</h3>
        <div className="reductas-compactas">
          {reductas.map((red, idx) => (
            <span key={idx} className="reducta-badge">
              {red.p}/{red.q}
            </span>
          ))}
        </div>
      </motion.div>
    )
  }

  // ============================================================
  // RENDER - EXPANSIÓN COMPLETA
  // ============================================================

  const renderExpansion = () => {
    if (!resultado) return null

    const { coeficientes, valorFinal } = resultado

    return (
      <motion.div
        className="expansion-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ExpansionFraccionContinua
          coeficientes={coeficientes}
          valorFinal={valorFinal}
        />
      </motion.div>
    )
  }

  // ============================================================
  // RENDER - PASOS DEL ALGORITMO
  // ============================================================

  const renderPasos = () => {
    if (!resultado) return null

    const { reductas } = resultado

    return (
      <motion.div
        className="pasos-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3>🛠️ Pasos del algoritmo</h3>
        <div className="pasos-lista">
          {reductas.map((paso, idx) => (
            <motion.div
              key={idx}
              className="paso-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
            >
              <button
                className="paso-toggle"
                onClick={() =>
                  setExpandedStep(expandedStep === idx ? null : idx)
                }
              >
                <span className="paso-toggle-label">
                  Paso {idx}: a_{idx} = {paso.a_k}
                </span>
                <ChevronDown
                  size={18}
                  className={`chevron ${expandedStep === idx ? 'expanded' : ''}`}
                />
              </button>

              <AnimatePresence>
                {expandedStep === idx && (
                  <motion.div
                    className="paso-contenido-expandido"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PasoReducta paso={paso} indice={idx} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  // ============================================================
  // RENDER PRINCIPAL
  // ============================================================

  return (
    <div className="reductas-finitas-wrapper">
      {renderSeccionEntrada()}

      <AnimatePresence>
        {resultado && (
          <>
            {renderResumen()}
            {renderListaReductas()}
            {renderExpansion()}
            {renderPasos()}

            {/* Mensaje de éxito */}
            <motion.div
              className="mensaje-exito"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              ✅ Cálculo completado exitosamente
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

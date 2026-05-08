import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw, ChevronDown } from 'lucide-react'
import './FraccionContinuaSimpl.css'

/**
 * Componente FraccionContinuaSimpl
 * 
 * Calcula la fracción continua simple de un número racional c/d
 * usando el algoritmo de Euclides en cualquier base (2-36).
 * 
 * Entrada del usuario:
 *   - Fracción: a/b (numerador/denominador)
 *   - Base: 2-36
 * 
 * Proceso:
 *   1. Valida entrada
 *   2. Envía al backend: POST /fraccion-continua-simple
 *   3. Recibe coeficientes y pasos del algoritmo
 *   4. Renderiza resultados
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function FraccionContinuaSimpl() {
  // ============================================================
  // ESTADO
  // ============================================================
  
  const [fraccion, setFraccion] = useState('')      // Entrada: "43/19"
  const [base, setBase] = useState(10)              // Base: 2-36
  const [resultado, setResultado] = useState(null)  // Resultado del backend
  const [loading, setLoading] = useState(false)     // Estado carga
  const [error, setError] = useState(null)          // Mensajes error
  const [expandedStep, setExpandedStep] = useState(null)  // Paso expandido

  // ============================================================
  // VALIDACIÓN
  // ============================================================

  const validarEntrada = () => {
    // Validar que la fracción tenga formato a/b
    if (!fraccion || !fraccion.includes('/')) {
      setError('Ingresa la fracción en formato: numerador/denominador (ej: 43/19)')
      return false
    }

    const [numerador_str, denominador_str] = fraccion.split('/').map(s => s.trim())

    if (!numerador_str || !denominador_str) {
      setError('Fracción inválida. Usa el formato: numerador/denominador')
      return false
    }

    // Validar que numerador y denominador sean válidos en la base
    try {
      const num = parseInt(numerador_str, base)
      const den = parseInt(denominador_str, base)

      if (isNaN(num) || isNaN(den)) {
        setError(`Los valores no son válidos en base ${base}`)
        return false
      }

      if (den === 0) {
        setError('El denominador no puede ser cero')
        return false
      }
    } catch (e) {
      setError(`Error al validar: ${e.message}`)
      return false
    }

    // Validar base
    if (base < 2 || base > 36) {
      setError('La base debe estar entre 2 y 36')
      return false
    }

    return true
  }

  // ============================================================
  // ENVÍO AL BACKEND
  // ============================================================

  const enviarAlBackend = async () => {
    if (!validarEntrada()) return

    setLoading(true)
    setError(null)
    setResultado(null)

    try {
      const [numerador_str, denominador_str] = fraccion.split('/').map(s => s.trim())

      const response = await fetch(`${API_BASE_URL}/fraccion-continua-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          numerador: numerador_str,
          denominador: denominador_str,
          base: parseInt(base)
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Error HTTP ${response.status}`)
      }

      const data = await response.json()

      if (!data.exito) {
        throw new Error(data.error || 'Error desconocido del servidor')
      }

      setResultado(data)
      setError(null)
    } catch (err) {
      setError(`Error: ${err.message}`)
      console.error('Error detallado:', err)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // RESETEAR FORMULARIO
  // ============================================================

  const resetear = () => {
    setFraccion('')
    setBase(10)
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
      <h2>🔢 Fracción Continua Simple</h2>
      <p className="subtitulo">
        Descompone una fracción c/d en su representación como fracción continua [a₁, a₂, ..., aₙ]
      </p>

      <div className="formulario-contenedor">
        {/* Input de fracción */}
        <div className="grupo-input">
          <label htmlFor="fraccion">Fracción (formato: numerador/denominador)</label>
          <input
            id="fraccion"
            type="text"
            placeholder="ej: 43/19 o A/7 o 101/11"
            value={fraccion}
            onChange={(e) => setFraccion(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && enviarAlBackend()}
            disabled={loading}
            className="input-fraccion"
          />
          <small>En base 10 usa dígitos 0-9, en base 16 usa 0-9 y A-F, etc.</small>
        </div>

        {/* Selector de base */}
        <div className="grupo-input">
          <label htmlFor="base">Base Numérica (2-36)</label>
          <input
            id="base"
            type="number"
            min="2"
            max="36"
            value={base}
            onChange={(e) => setBase(Math.max(2, Math.min(36, parseInt(e.target.value) || 10)))}
            disabled={loading}
            className="input-base"
          />
          <small>Binaria (2), Octal (8), Decimal (10), Hexadecimal (16), etc.</small>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="grupo-botones">
        <motion.button
          className="btn-calcular"
          onClick={enviarAlBackend}
          disabled={loading || !fraccion}
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
  // RENDER - RESULTADOS
  // ============================================================

  const renderResultados = () => {
    if (!resultado) return null

    return (
      <motion.div
        className="resultado-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Tarjeta resumen */}
        <div className="resumen-card">
          <div className="resumen-header">
            <h3>📊 Resultado</h3>
            <span className="badge-base">Base {resultado.base}</span>
          </div>

          <div className="resumen-contenido">
            <div className="item-resumen">
              <span className="label">Fracción:</span>
              <span className="valor">
                {resultado.valores_en_base.numerador}/{resultado.valores_en_base.denominador}
              </span>
            </div>

            {resultado.valores_en_base.numerador !== resultado.valores_base_10.numerador.toString() && (
              <div className="item-resumen">
                <span className="label">En base 10:</span>
                <span className="valor">
                  {resultado.valores_base_10.numerador}/{resultado.valores_base_10.denominador}
                </span>
              </div>
            )}

            <div className="item-resumen" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
              <span className="label">Cantidad de coeficientes:</span>
              <span className="valor">{resultado.coeficientes.cantidad}</span>
            </div>
          </div>
        </div>

        {/* Fracción continua */}
        <motion.div
          className="fraccion-continua-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <h3>🔗 Fracción Continua</h3>
          <div className="fraccion-continua-display">
            <span className="notacion-corchetes">[</span>
            <span className="coeficientes-lista">
              {resultado.coeficientes.en_base.map((coef, idx) => (
                <span key={idx}>
                  {coef}
                  {idx < resultado.coeficientes.en_base.length - 1 && <span className="separador">,</span>}
                </span>
              ))}
            </span>
            <span className="notacion-corchetes">]</span>
          </div>
          <p className="explicacion">
            {resultado.fraccion_continua.notacion_matematica}
          </p>
        </motion.div>

        {/* Pasos del algoritmo */}
        <motion.div
          className="pasos-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3>🧮 Algoritmo de Euclides</h3>
          <p className="subtitulo-pasos">Divisiones sucesivas hasta residuo 0</p>

          <div className="pasos-lista">
            {resultado.pasos_euclides.map((paso, idx) => (
              <motion.div
                key={idx}
                className={`paso-item ${expandedStep === idx ? 'expandido' : ''}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx }}
              >
                <button
                  className="paso-header"
                  onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                >
                  <span className="paso-numero">Paso {paso.paso}</span>
                  <span className="paso-ecuacion">{paso.ecuacion}</span>
                  <ChevronDown
                    size={18}
                    className={`chevron ${expandedStep === idx ? 'rotated' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {expandedStep === idx && (
                    <motion.div
                      className="paso-detalles"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="detalle-fila">
                        <span className="etiqueta">Dividendo:</span>
                        <span className="valor">{paso.dividendo} (base 10) = {paso.dividendo_base} (base {resultado.base})</span>
                      </div>
                      <div className="detalle-fila">
                        <span className="etiqueta">Divisor:</span>
                        <span className="valor">{paso.divisor} (base 10) = {paso.divisor_base} (base {resultado.base})</span>
                      </div>
                      <div className="detalle-fila">
                        <span className="etiqueta">Cociente (aₖ):</span>
                        <span className="valor highlight-cociente">{paso.cociente} (base 10) = {paso.cociente_base} (base {resultado.base})</span>
                      </div>
                      <div className="detalle-fila">
                        <span className="etiqueta">Residuo:</span>
                        <span className="valor">{paso.residuo} (base 10) = {paso.residuo_base} (base {resultado.base})</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reconstrucción */}
        <motion.div
          className={`reconstruccion-card ${resultado.reconstruccion.exito ? 'exitosa' : 'fallida'}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
        >
          <h3>✓ Verificación - Reconstrucción de Fracción</h3>
          <div className="reconstruccion-contenido">
            <p className="estado">
              {resultado.reconstruccion.exito ? (
                <span className="exitoso">✓ Reconstrucción exitosa</span>
              ) : (
                <span className="fallido">✗ Reconstrucción fallida</span>
              )}
            </p>

            <div className="item-verificacion">
              <span className="label">Fracción reconstruida (base 10):</span>
              <span className="valor">{resultado.reconstruccion.fraccion_base_10}</span>
            </div>

            <div className="item-verificacion">
              <span className="label">Fracción reconstruida (base {resultado.base}):</span>
              <span className="valor">{resultado.reconstruccion.fraccion_en_base}</span>
            </div>

            <div className="item-verificacion">
              <span className="label">Fracción original:</span>
              <span className="valor">{resultado.input.fraccion_str}</span>
            </div>

            <p className="coincidencia">
              {resultado.reconstruccion.exito
                ? '✅ La fracción reconstruida coincide con la fracción original'
                : '⚠️ La fracción reconstruida no coincide'}
            </p>
          </div>
        </motion.div>

        {/* Mensaje final */}
        <motion.div
          className="mensaje-exito"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          ✨ {resultado.mensaje}
        </motion.div>
      </motion.div>
    )
  }

  // ============================================================
  // RENDER PRINCIPAL
  // ============================================================

  return (
    <div className="fraccion-continua-wrapper">
      <AnimatePresence mode="wait">
        {!resultado ? (
          <motion.div key="entrada" exit={{ opacity: 0 }}>
            {renderSeccionEntrada()}
          </motion.div>
        ) : (
          <motion.div key="resultados" exit={{ opacity: 0 }}>
            {renderSeccionEntrada()}
            {renderResultados()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw, ChevronDown } from 'lucide-react'
import { useFraccionContinua } from '../hooks/useFraccionContinua'
import FraccionContinuaSimpleLatex from './FraccionContinuaSimpleLatex'
import PasoFraccionContinuaLatex from './PasoFraccionContinuaLatex'
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


export default function FraccionContinuaSimpl() {
  // ============================================================
  // ESTADO Y HOOKS
  // ============================================================
  
  const [fraccion, setFraccion] = useState('')      // Entrada: "43/19"
  const [base, setBase] = useState(10)              // Base: 2-36
  const [expandedStep, setExpandedStep] = useState(null)  // Paso expandido
  
  const { resultado, error, loading, calcular, limpiarError } = useFraccionContinua()

  // ============================================================
  // VALIDACIÓN
  // ============================================================

  const validarEntrada = () => {
    // Validar que la fracción tenga formato a/b
    if (!fraccion || !fraccion.includes('/')) {
      return 'Ingresa la fracción en formato: numerador/denominador (ej: 43/19)'
    }

    const [numerador_str, denominador_str] = fraccion.split('/').map(s => s.trim())

    if (!numerador_str || !denominador_str) {
      return 'Fracción inválida. Usa el formato: numerador/denominador'
    }

    // Validar que numerador y denominador sean válidos en la base
    try {
      const num = parseInt(numerador_str, base)
      const den = parseInt(denominador_str, base)

      if (isNaN(num) || isNaN(den)) {
        return `Los valores no son válidos en base ${base}`
      }

      if (den === 0) {
        return 'El denominador no puede ser cero'
      }
    } catch (e) {
      return `Error al validar: ${e.message}`
    }

    // Validar base
    if (base < 2 || base > 36) {
      return 'La base debe estar entre 2 y 36'
    }

    return null // No hay error
  }

  // ============================================================
  // ENVÍO AL BACKEND
  // ============================================================

  const enviarAlBackend = async () => {
    const errorValidacion = validarEntrada()
    
    const [numerador_str, denominador_str] = fraccion.split('/').map(s => s.trim())
    
    await calcular({
      numerador: numerador_str,
      denominador: denominador_str,
      base: parseInt(base)
    }, errorValidacion)
  }

  // ============================================================
  // RESETEAR FORMULARIO
  // ============================================================

  const resetear = () => {
    setFraccion('')
    setBase(10)
    setExpandedStep(null)
    limpiarError()
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
          
          {/* Representación LaTeX */}
          <div className="latex-section">
            <div className="latex-header">
              <span className="latex-label">Representación matemática:</span>
            </div>
            <FraccionContinuaSimpleLatex 
              coeficientes={resultado.coeficientes.en_base}
              className="latex-display"
              numeradorStr={resultado.input?.numerador_str}
              denominadorStr={resultado.input?.denominador_str}
              base={resultado.base}
            />
          </div>
        </motion.div>

        {/* Pasos de la construcción (Euclides) */}
        {resultado.pasos_euclides && resultado.pasos_euclides.length > 0 && (
          <PasoFraccionContinuaLatex 
            pasos={resultado.pasos_euclides} 
            numeradorOriginal={resultado.input?.numerador_str}
            denominadorOriginal={resultado.input?.denominador_str}
            base={resultado.base}
          />
        )}

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

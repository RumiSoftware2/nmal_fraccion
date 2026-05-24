/**
 * ReductasPeriodicas.jsx
 * Componente principal para fracciones continuas eventualmente periódicas
 * Patrón: entrada → procesamiento local → resultados + pasos
 */

import { useState } from 'react'
import BlockMath from '../components/pasosprueba/BlockMath'
import { procesarFCPeriodica } from './cerebro8'
import { PasoReducta } from './ReductasPeriodicasLatex'
import PasosPapelFC from './PeriodicaFraccionLatex'
import './ReductasPeriodicas.css'

/**
 * Limpia la notación matemática: [1;(1)] → 1;(1)
 * Si tiene corchetes al inicio y final, los remueve
 * Si no los tiene, devuelve la expresión tal cual
 */
function limpiarNotacionMatematica(expr) {
  const trimmed = expr.trim()
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.substring(1, trimmed.length - 1)
  }
  return trimmed
}

export default function ReductasPeriodicas() {
  const [expresion, setExpresion] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expandedStep, setExpandedStep] = useState(null)

  const handleCalcular = () => {
    if (!expresion.trim()) {
      setError('Ingresa una expresión')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Limpiar notación matemática (remover corchetes si los tiene)
      const expresionLimpia = limpiarNotacionMatematica(expresion.trim())
      
      const res = procesarFCPeriodica(expresionLimpia)
      if (!res.ok) {
        setError(res.error)
        setResultado(null)
      } else {
        setResultado(res)
        setError(null)
      }
    } catch (err) {
      setError(`Error procesando: ${err.message}`)
      setResultado(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLimpiar = () => {
    setExpresion('')
    setResultado(null)
    setError(null)
    setExpandedStep(null)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleCalcular()
    }
  }

  return (
    <div className="reductas-periodicas-container">
      {/* Sección de entrada */}
      <div className="entrada-section">
        <div className="input-group">
          <label htmlFor="fc-input">Fracción Continua Periódica</label>
          <input
            id="fc-input"
            type="text"
            value={expresion}
            onChange={(e) => setExpresion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ej: 1;2(34) o 1;2,3,(4,5) — 0;1,2,(3,4) — ;(1)"
            className="fc-input"
            disabled={loading}
          />
          <div className="input-help">
            Use <code>;</code> para separar y <code>()</code> para el período. `a₀` debe ser un solo entero antes del <code>;</code>.
            Use comas para coeficientes multi-dígito en cola o período: <strong>1;23(45)</strong> o <strong>1;2,3,(4,5)</strong>
          </div>
        </div>

        <div className="botones-grupo">
          <button
            onClick={handleCalcular}
            disabled={loading || !expresion.trim()}
            className="boton boton-calcular"
          >
            {loading ? 'Procesando...' : 'Calcular'}
          </button>
          <button onClick={handleLimpiar} className="boton boton-limpiar" disabled={loading}>
            Limpiar
          </button>
        </div>

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Sección de resultados */}
      {resultado && (
        <div className="resultados-section">
          {/* Resumen */}
          <div className="bloque-resultado">
            <h3>Resumen</h3>
            <div className="resumen-contenido">
              <div className="item-resumen">
                <label>Notación</label>
                <div className="latex-pequeno">
                  <BlockMath math={resultado.continued_fraction} />
                </div>
              </div>

              <div className="item-resumen">
                <label>Polinomio Mínimo</label>
                <div className="valor-resumen">
                  <code>{resultado.minimal_polynomial}</code>
                </div>
              </div>

              <div className="item-resumen">
                <label>Solución (x)</label>
                <div className="latex-pequeno">
                  <BlockMath math={resultado.solution_as_root} />
                </div>
              </div>

              <div className="item-resumen">
                <label>Discriminante</label>
                <div className="valor-resumen">
                  <code>Δ = {resultado.discriminant}</code>
                </div>
              </div>

              {resultado.numerical_approximation !== null && (
                <div className="item-resumen">
                  <label>Raíz Positiva</label>
                  <div className="valor-resumen">
                    <code>{resultado.numerical_approximation.toFixed(10)}</code>
                  </div>
                </div>
              )}

              <div className="item-resumen">
                <label>Irreducible</label>
                <div className="valor-resumen">
                  <code>{resultado.is_irreducible ? 'Sí' : 'No'}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen compacto y pasos en papel */}
          <div className="bloque-resultado">
            <h3>Resumen</h3>
            <div className="resumen-contenido">
              <div className="item-resumen">
                <label>Notación</label>
                <div className="latex-pequeno">
                  <BlockMath math={resultado.continued_fraction} />
                </div>
              </div>

              <div className="item-resumen">
                <label>Polinomio Mínimo</label>
                <div className="valor-resumen">
                  <code>{resultado.minimal_polynomial}</code>
                </div>
              </div>

              <div className="item-resumen">
                <label>Solución simplificada (x)</label>
                <div className="latex-pequeno">
                  <BlockMath math={resultado.solution_simplified || resultado.solution_as_root} />
                </div>
              </div>

              <div className="item-resumen">
                <label>Discriminante</label>
                <div className="valor-resumen">
                  <code>Δ = {resultado.discriminant}</code>
                </div>
              </div>

              {resultado.numerical_approximation !== null && (
                <div className="item-resumen">
                  <label>Raíz Positiva</label>
                  <div className="valor-resumen">
                    <code>{resultado.numerical_approximation.toFixed(10)}</code>
                  </div>
                </div>
              )}

              <div className="item-resumen">
                <label>Irreducible</label>
                <div className="valor-resumen">
                  <code>{resultado.is_irreducible ? 'Sí' : 'No'}</code>
                </div>
              </div>
            </div>
          </div>

          <div className="bloque-resultado">
            <h3>Proceso paso a paso</h3>
            <PasosPapelFC pasos={resultado.pasos_papel || []} />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * ReductasPeriodicas.jsx
 * Componente principal para fracciones continuas eventualmente periódicas
 * Patrón: entrada → procesamiento local → resultados + pasos
 */

import { useState } from 'react'
import { BlockMath } from 'react-katex'
import { procesarFCPeriodica } from './cerebro8'
import { PasoReducta } from './ReductasPeriodicasLatex'
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
            placeholder="Ej: 1;2(34) o [1;2(34)]"
            className="fc-input"
            disabled={loading}
          />
          <div className="input-help">
            Use <code>;</code> para separar, <code>()</code> para el período.
            Puedes escribir con o sin corchetes: <strong>1;2(34)</strong> o <strong>[1;2(34)]</strong>
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
                  <BlockMath>{resultado.continued_fraction}</BlockMath>
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
                  <BlockMath>{resultado.solution_as_root}</BlockMath>
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

          {/* Matrices */}
          <div className="bloque-resultado">
            <h3>Matrices</h3>
            <div className="matrices-grid">
              <div className="matriz-item">
                <h4>Matriz T (Período)</h4>
                <div className="tabla-matriz">
                  <table>
                    <tbody>
                      <tr>
                        <td>{resultado.matrix_T[0][0]}</td>
                        <td>{resultado.matrix_T[0][1]}</td>
                      </tr>
                      <tr>
                        <td>{resultado.matrix_T[1][0]}</td>
                        <td>{resultado.matrix_T[1][1]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="matriz-item">
                <h4>Matriz P (Preperíodo)</h4>
                <div className="tabla-matriz">
                  <table>
                    <tbody>
                      <tr>
                        <td>{resultado.matrix_P[0][0]}</td>
                        <td>{resultado.matrix_P[0][1]}</td>
                      </tr>
                      <tr>
                        <td>{resultado.matrix_P[1][0]}</td>
                        <td>{resultado.matrix_P[1][1]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Ecuaciones */}
          <div className="bloque-resultado">
            <h3>Ecuaciones</h3>
            <div className="ecuaciones-grid">
              <div className="ecuacion-item">
                <h4>Ecuación en y</h4>
                <div className="latex-ecuacion">
                  <BlockMath>{`${resultado.equation_y.a}y^2 + ${resultado.equation_y.b}y + ${resultado.equation_y.c} = 0`}</BlockMath>
                </div>
              </div>

              <div className="ecuacion-item">
                <h4>Ecuación en x (normalizada)</h4>
                <div className="latex-ecuacion">
                  <BlockMath>{`${resultado.equation_x.a}x^2 ${resultado.equation_x.b >= 0 ? '+' : ''} ${resultado.equation_x.b}x ${resultado.equation_x.c >= 0 ? '+' : ''} ${resultado.equation_x.c} = 0`}</BlockMath>
                </div>
              </div>
            </div>
          </div>

          {/* Solución General */}
          <div className="bloque-resultado bloque-solucion">
            <h3>✓ Solución General</h3>
            <div className="solucion-contenido">
              <div className="latex-ecuacion solucion-latex">
                <BlockMath>{resultado.solution_as_root}</BlockMath>
              </div>
              <div className="valores-solucion">
                <p>
                  <strong>Raíz positiva:</strong>{' '}
                  <code>{resultado.numerical_approximation?.toFixed(10) || 'No existe'}</code>
                </p>
              </div>
            </div>
          </div>

          {/* Acordeón de pasos */}
          <div className="bloque-resultado">
            <h3>Pasos del Algoritmo</h3>
            <div className="acordeon">
              {resultado.pasos.map((paso, idx) => (
                <div key={idx} className="paso-acordeon">
                  <button
                    className={`paso-boton ${expandedStep === paso.numero ? 'expanded' : ''}`}
                    onClick={() =>
                      setExpandedStep(expandedStep === paso.numero ? null : paso.numero)
                    }
                  >
                    <span className="paso-numero">Paso {paso.numero}</span>
                    <span className="paso-titulo">{paso.titulo}</span>
                    <span className="paso-toggle">
                      {expandedStep === paso.numero ? '▼' : '▶'}
                    </span>
                  </button>

                  {expandedStep === paso.numero && (
                    <div className="paso-contenido">
                      <PasoReducta paso={paso} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

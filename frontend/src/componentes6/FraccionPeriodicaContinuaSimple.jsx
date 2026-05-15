import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { useFraccionContinuaPeriodica } from '../hooks/useFraccionContinuaPeriodica'
import FraccionPeriodicaContinuaSimpleLatex from './FraccionPeriodicaContinuaSimpleLatex'
import BlockMath from '../components/pasosprueba/BlockMath'
import '../componentes4/FraccionContinuaSimpl.css'
import './FraccionPeriodicaContinuaSimple.css'

export default function FraccionPeriodicaContinuaSimple() {
  const [p, setP] = useState('')
  const [expandedStep, setExpandedStep] = useState(null)


  const { resultado, error, loading, calcular, limpiar } = useFraccionContinuaPeriodica()

  const validarEntrada = () => {
    const pNum = parseInt(p, 10)

    if (!p.trim() || Number.isNaN(pNum)) {
      return 'Ingresa un radicando p entero (ej: 7)'
    }
    if (pNum < 2) {
      return 'El radicando p debe ser mayor o igual a 2'
    }
    return null
  }

  const enviarAlBackend = async () => {
    const errorValidacion = validarEntrada()
    await calcular(
      { p: parseInt(p, 10), indice: 2 },
      errorValidacion
    )
  }

  const resetear = () => {
    setP('')
    setExpandedStep(null)
    limpiar()
  }

  const renderRationalization = (paso, pasoIndex, p, pasosArr) => {
    const n = paso.paso
    const m_n = paso.m
    const d_n = paso.d
    const a_n = paso.a_i
    const d_prev = pasoIndex === 0 ? 1 : pasosArr[pasoIndex - 1].d
    const m_n_sq = m_n * m_n
    const den_unsimp = p - m_n_sq

    let latex = `\\begin{aligned}\n`
    latex += `\\alpha_{${n}} &= \\frac{${d_prev}}{\\sqrt{${p}} - ${m_n}} \\\\[8pt]\n`
    
    if (m_n > 0) {
      latex += `&= \\frac{${d_prev}(\\sqrt{${p}} + ${m_n})}{(\\sqrt{${p}} - ${m_n})(\\sqrt{${p}} + ${m_n})} \\\\[8pt]\n`
      latex += `&= \\frac{${d_prev}(\\sqrt{${p}} + ${m_n})}{${p} - ${m_n_sq}} \\\\[8pt]\n`
    } else if (m_n < 0) {
      latex += `&= \\frac{${d_prev}(\\sqrt{${p}} + ${Math.abs(m_n)})}{(\\sqrt{${p}} - ${m_n})(\\sqrt{${p}} + ${Math.abs(m_n)})} \\\\[8pt]\n`
    } else {
      latex += `&= \\frac{${d_prev}\\sqrt{${p}}}{\\sqrt{${p}}\\sqrt{${p}}} \\\\[8pt]\n`
      latex += `&= \\frac{${d_prev}\\sqrt{${p}}}{${p}} \\\\[8pt]\n`
    }

    if (d_prev !== 1 || den_unsimp !== d_n) {
      if (m_n > 0) {
        latex += `&= \\frac{${d_prev}(\\sqrt{${p}} + ${m_n})}{${den_unsimp}} \\\\[8pt]\n`
      }
    }
    
    latex += `&= \\frac{\\sqrt{${p}} + ${m_n}}{${d_n}} \\\\[8pt]\n`
    latex += `a_{${n}} &= \\left\\lfloor \\alpha_{${n}} \\right\\rfloor = \\left\\lfloor \\frac{\\sqrt{${p}} + ${m_n}}{${d_n}} \\right\\rfloor = ${a_n}\n`
    latex += `\\end{aligned}`

    return latex
  }

  const generarFraccionParcial = (pasoIndex, a0, pasosArr, p) => {
    const a_seq = pasosArr.slice(0, pasoIndex + 1).map(step => step.a_i)
    const elements = [a0, ...a_seq]
    const n = pasosArr[pasoIndex].paso

    const build = (idx) => {
      if (idx === elements.length - 1) {
        return `${elements[idx]} + \\cfrac{1}{\\alpha_{${n + 1}}}`
      }
      return `${elements[idx]} + \\cfrac{1}{${build(idx + 1)}}`
    }

    return `\\sqrt{${p}} = ` + build(0)
  }

  const renderEntrada = () => (
    <motion.div
      className="entrada-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Fracción continua periódica</h2>
      <p className="subtitulo">
        Calcula la expansión en fracción continua simple de √p y detecta su período
        (ej: √7 = [2; 1, 1, 1, 4, ...])
      </p>

      <div className="formulario-contenedor formulario-radicando">
        <div className="grupo-input">
          <label htmlFor="radicando-p">Radicando p</label>
          <input
            id="radicando-p"
            type="number"
            min="2"
            placeholder="ej: 7"
            value={p}
            onChange={(e) => setP(e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && enviarAlBackend()}
            disabled={loading}
            className="input-fraccion"
          />
          <small>Número natural ≥ 2 bajo la raíz</small>
        </div>

      </div>

      <div className="grupo-botones">
        <motion.button
          className="btn-calcular"
          onClick={enviarAlBackend}
          disabled={loading || !p}
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

      <AnimatePresence>
        {error && (
          <motion.div
            className="mensaje-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  const renderResultados = () => {
    if (!resultado) return null

    const { coeficientes, fraccion_continua: fc, input, pasos } = resultado
    const pre = coeficientes?.preperiodo ?? []
    const per = coeficientes?.periodo ?? []

    return (
      <motion.div
        className="resultado-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="resumen-card">
          <div className="resumen-header">
            <h3>Resultado</h3>
            <span className={`badge-periodicidad ${resultado.es_periodico ? 'periodico' : 'finito'}`}>
              {resultado.es_racional
                ? 'Racional'
                : resultado.es_periodico
                  ? 'Periódico'
                  : 'Finito'}
            </span>
          </div>

          <div className="resumen-contenido">
            <div className="item-resumen">
              <span className="label">Entrada:</span>
              <span className="valor">
                √{input?.p}
                {input?.factor_entero > 1 && (
                  <span className="detalle-simpl">
                    {' '}
                    (= {input.factor_entero}√{input.radicando_simplificado})
                  </span>
                )}
              </span>
            </div>
            <div className="item-resumen">
              <span className="label">Preperíodo:</span>
              <span className="valor">[{pre.join(', ')}]</span>
            </div>
            {per.length > 0 && (
              <div className="item-resumen">
                <span className="label">Período:</span>
                <span className="valor periodo-valor">⟨{per.join(', ')}⟩</span>
              </div>
            )}
          </div>
        </div>

        <motion.div className="fraccion-continua-card">
          <h3>Fracción continua</h3>
          <FraccionPeriodicaContinuaSimpleLatex
            preperiodo={pre}
            periodo={per}
            esPeriodico={resultado.es_periodico}
            latexBackend={fc?.latex}
            className="latex-display"
          />
          {fc?.notacion_periodica && (
            <p className="notacion-backend">{fc.notacion_periodica}</p>
          )}
        </motion.div>

        {pasos?.length > 0 && (
          <div className="pasos-algoritmo-card">
            <h3>Pasos del algoritmo</h3>
            <div className="pasos-lista">
              {pasos.map((paso, pasoIndex) => (
                <div
                  key={paso.paso}
                  className={`paso-item ${paso.es_inicio_periodo ? 'inicio-periodo' : ''}`}
                >
                  <button
                    type="button"
                    className="paso-header-btn"
                    onClick={() =>
                      setExpandedStep(expandedStep === paso.paso ? null : paso.paso)
                    }
                  >
                    <span>
                      Paso {paso.paso}: a<sub>{paso.paso}</sub> = {paso.a_i}
                      {paso.es_inicio_periodo && (
                        <span className="badge-inicio-periodo"> inicio del período</span>
                      )}
                    </span>
                    {expandedStep === paso.paso ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedStep === paso.paso && (
                      <motion.div
                        className="paso-detalle"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="paso-explicacion">
                          <h4 style={{marginBottom: '0.5rem', color: '#6366f1'}}>1. Racionalización y cálculo de a<sub>{paso.paso}</sub></h4>
                          <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem'}}>
                            Multiplicamos por el conjugado para racionalizar el denominador y obtener el valor exacto de α<sub>{paso.paso}</sub>, luego tomamos su parte entera.
                          </p>
                          <BlockMath math={renderRationalization(paso, pasoIndex, input?.p, pasos)} />
                          
                          <h4 style={{marginBottom: '0.5rem', marginTop: '2rem', color: '#6366f1'}}>2. Fracción continua parcial</h4>
                          <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem'}}>
                            Estado de la fracción continua en este paso.
                          </p>
                          <BlockMath math={generarFraccionParcial(pasoIndex, coeficientes.a0, pasos, input?.p)} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}

        <motion.div className="mensaje-exito">{resultado.mensaje}</motion.div>
      </motion.div>
    )
  }

  return (
    <div className="fraccion-continua-wrapper fraccion-periodica-wrapper">
      <AnimatePresence mode="wait">
        <motion.div key={resultado ? 'con-resultado' : 'sin-resultado'}>
          {renderEntrada()}
          {renderResultados()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

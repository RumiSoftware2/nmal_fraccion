import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { useFraccionContinuaPeriodica } from '../hooks/useFraccionContinuaPeriodica'
import FraccionPeriodicaContinuaSimpleLatex from './FraccionPeriodicaContinuaSimpleLatex'
import BlockMath from '../components/pasosprueba/BlockMath'
import '../componentes4/FraccionContinuaSimpl.css'
import './FraccionPeriodicaContinuaSimple.css'

const esCuadradoPerfecto = (pNum) => {
  if (typeof pNum !== 'number' || !Number.isFinite(pNum)) return false
  const r = Math.floor(Math.sqrt(pNum))
  return r * r === pNum
}

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

  // ==========================================================================
  // CONVENCIÓN DE ÍNDICES PARA FRACCIÓN CONTINUA DE RAÍCES CUADRADAS
  // ==========================================================================
  // a₀ = coeficientes.a0 (parte entera de √p)
  // r₀ = √p - a₀ (residuo, no es un coeficiente)
  // α₁ = 1 / r₀ (primer residuo de la fracción continua)
  // Paso UI 0: define α₁; la fracción parcial termina en 1/α₁
  // Paso UI k (k ≥ 1, backend paso.paso = k):
  //   - Racionaliza α_k (que fue introducido en el paso k-1)
  //   - Encuentra a_k = ⌊α_k⌋
  //   - La fracción parcial muestra:
  //     - la expansión con 1/α_{k+1} si no es el último paso
  //     - α_{k+1} = 1/(α_k - a_k) = d/(√p + m - a·d) con m,d,a del paso k
  //     - o cierra en a_k si es el último paso (sin α futuro)
  // ==========================================================================

  /** Paso 0: descomposición entera de √p */
  const renderPasoCeroDescomposicion = (p, a0) => {
    return `\\begin{aligned}
\\sqrt{${p}} &= ${a0} + \\bigl(\\sqrt{${p}} - ${a0}\\bigr)
\\end{aligned}`
  }

  /** Paso 0: primera fracción y definición de α₁ */
  const renderPasoCeroPrimeraFraccion = (p, a0) => {
    return `\\begin{aligned}
\\sqrt{${p}} &= ${a0} + \\cfrac{1}{\\alpha_1} \\\\[8pt]
\\alpha_1 &= \\frac{1}{\\sqrt{${p}} - ${a0}}
\\end{aligned}`
  }

  /** Paso 0: fracción continua parcial (solo α₁, sin α₂) */
  const generarFraccionParcialPasoCero = (p, a0) => {
    return `\\sqrt{${p}} = ${a0} + \\cfrac{1}{\\alpha_1}`
  }

  /**
   * Fracción continua parcial en el paso del algoritmo con índice pasoIndex.
   * - pasoIndex corresponde a pasos[pasoIndex] con paso.paso = k ≥ 1
   * - En el paso k, coeficientes mostrados: a₀, a₁, …, a_k
   * - Si no es el último paso de la lista, el último término es 1/α_{k+1}
   * - Si es el último paso, cerrar sin placeholder α
   */
  const generarFraccionParcial = (pasoIndex, a0, pasosArr, p) => {
    const k = pasosArr[pasoIndex].paso  // 1, 2, 3, ...
    const coefs = [a0, ...pasosArr.slice(0, pasoIndex + 1).map(s => s.a_i)]
    const esUltimo = pasoIndex === pasosArr.length - 1
    const build = (idx) => {
      if (idx === coefs.length - 1) {
        if (esUltimo) {
          return String(coefs[idx])
        }
        return `${coefs[idx]} + \\cfrac{1}{\\alpha_{${k + 1}}}`
      }
      return `${coefs[idx]} + \\cfrac{1}{${build(idx + 1)}}`
    }
    return `\\sqrt{${p}} = ${build(0)}`
  }

  /**
   * Definición explícita de α_{k+1} al cerrar el paso k (paso.paso = k).
   * Usa α_k = (√p+m)/d y a_k = paso.a_i ya obtenidos en la sección 1.
   * Devuelve '' si es el último paso (no hay α siguiente en la parcial).
   */
  const renderDefinicionAlphaSiguiente = (paso, pasoIndex, pasosArr, p) => {
    const esUltimo = pasoIndex === pasosArr.length - 1
    if (esUltimo) return ''
    const k = paso.paso
    const j = k + 1
    const m = paso.m
    const d = paso.d
    const a = paso.a_i
    const numeradorResto = m - a * d  // √p + m - a·d en el denominador

    const termM = m === 0 ? '' : ` + ${m}`
    const formatDenominador = (rad, resto) => {
      if (resto === 0) return `\\sqrt{${rad}}`
      if (resto < 0) return `\\sqrt{${rad}} - ${Math.abs(resto)}`
      return `\\sqrt{${rad}} + ${resto}`
    }
    const den = formatDenominador(p, numeradorResto)

    return `\\begin{aligned}
\\alpha_{${j}} &= \\frac{1}{\\alpha_{${k}} - ${a}}
= \\frac{1}{\\dfrac{\\sqrt{${p}}${termM}}{${d}} - ${a}} \\\\[8pt]
&= \\frac{${d}}{${den}}
\\end{aligned}`
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
    const pVal = input?.p ?? parseInt(p, 10)
    if (esCuadradoPerfecto(pVal)) {
      const n = Math.floor(Math.sqrt(pVal))
      return (
        <motion.div className="resultado-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="resumen-card">
            <h3>Resultado</h3>
            <p>
              <strong>{pVal}</strong> es un cuadrado perfecto ({n}² = {pVal}).
              La raíz es un entero exacto.
            </p>
          </div>
          <div className="fraccion-continua-card">
            <BlockMath math={`\\sqrt{${pVal}} = ${n}`} />
          </div>
          <motion.div className="mensaje-exito">
            √{pVal} = {n}
          </motion.div>
        </motion.div>
      )
    }
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
              {/* Paso 0 (Nuevo) */}
              <div className="paso-item paso-inicial">
                <button
                  type="button"
                  className="paso-header-btn"
                  onClick={() =>
                    setExpandedStep(expandedStep === 0 ? null : 0)
                  }
                >
                  <span>
                    Paso 0: a<sub>0</sub> = {coeficientes?.a0}
                  </span>
                  {expandedStep === 0 ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
                <AnimatePresence>
                  {expandedStep === 0 && (
                    <motion.div
                      className="paso-detalle"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="paso-explicacion">
                        <h4 style={{marginBottom: '0.5rem', color: '#6366f1'}}>0.1 Descomposición de &radic;p</h4>
                        <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem'}}>
                          Descomponemos &radic;{input?.p} en su parte entera a<sub>0</sub> = {coeficientes?.a0} y un residuo.
                        </p>
                        <BlockMath math={renderPasoCeroDescomposicion(input?.p, coeficientes?.a0)} />
                        
                        <h4 style={{marginBottom: '0.5rem', marginTop: '2rem', color: '#6366f1'}}>0.2 Primera fracción continua y &alpha;₁</h4>
                        <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem'}}>
                          El residuo &radic;{input?.p} &minus; {coeficientes?.a0} se invierte para obtener &alpha;₁.
                        </p>
                        <BlockMath math={renderPasoCeroPrimeraFraccion(input?.p, coeficientes?.a0)} />

                        <h4 style={{marginBottom: '0.5rem', marginTop: '2rem', color: '#6366f1'}}>0.3 Fracción continua parcial</h4>
                        <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem'}}>
                          Estado de la expansión; &alpha;₂ se definirá explícitamente al final del Paso 1.
                        </p>
                        <BlockMath math={generarFraccionParcialPasoCero(input?.p, coeficientes?.a0)} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pasos ≥ 1 */}
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
                          <h4 style={{marginBottom: '0.5rem', color: '#6366f1'}}>1. Racionalización de &alpha;<sub>{paso.paso}</sub> y cálculo de a<sub>{paso.paso}</sub></h4>
                          <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem'}}>
                            {pasoIndex === 0 ? (
                              <>Racionalizamos &alpha;<sub>1</sub>, definido en el Paso 0, para obtener a<sub>1</sub>.</>
                            ) : (
                              <>Racionalizamos &alpha;<sub>{paso.paso}</sub>, introducido en la fracción parcial del paso anterior.</>
                            )}
                          </p>
                          <BlockMath math={renderRationalization(paso, pasoIndex, input?.p, pasos)} />
                          
                          <h4 style={{marginBottom: '0.5rem', marginTop: '2rem', color: '#6366f1'}}>2. Fracción continua parcial</h4>
                          <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem'}}>
                            {pasoIndex < pasos.length - 1 ? (
                              <>Expansión hasta a<sub>{paso.paso}</sub>; &alpha;<sub>{paso.paso + 1}</sub> queda definido aquí (se racionalizará en el Paso {paso.paso + 1}).</>
                            ) : (
                              <>Expansión completa en este paso (sin &alpha; pendiente).</>
                            )}
                          </p>
                          <BlockMath math={generarFraccionParcial(pasoIndex, coeficientes.a0, pasos, input?.p)} />
                          {pasoIndex < pasos.length - 1 && (
                            <>
                              <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '1.5rem', marginBottom: '1rem' }}>
                                Definición explícita de &alpha;<sub>{paso.paso + 1}</sub> (inverso del residuo &alpha;<sub>{paso.paso}</sub> &minus; a<sub>{paso.paso}</sub>):
                              </p>
                              <BlockMath math={renderDefinicionAlphaSiguiente(paso, pasoIndex, pasos, input?.p)} />
                            </>
                          )}
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

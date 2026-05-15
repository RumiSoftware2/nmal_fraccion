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
  const [indice, setIndice] = useState('2')
  const [expandedStep, setExpandedStep] = useState(null)

  const { resultado, error, loading, calcular, limpiar } = useFraccionContinuaPeriodica()

  const validarEntrada = () => {
    const pNum = parseInt(p, 10)
    const indiceNum = parseInt(indice, 10)

    if (!p.trim() || Number.isNaN(pNum)) {
      return 'Ingresa un radicando p entero (ej: 7)'
    }
    if (pNum < 2) {
      return 'El radicando p debe ser mayor o igual a 2'
    }
    if (Number.isNaN(indiceNum) || indiceNum !== 2) {
      return 'Por ahora solo se soporta índice 2 (raíz cuadrada)'
    }
    return null
  }

  const enviarAlBackend = async () => {
    const errorValidacion = validarEntrada()
    await calcular(
      { p: parseInt(p, 10), indice: parseInt(indice, 10) },
      errorValidacion
    )
  }

  const resetear = () => {
    setP('')
    setIndice('2')
    setExpandedStep(null)
    limpiar()
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

        <div className="grupo-input">
          <label htmlFor="indice-raiz">Índice de la raíz</label>
          <input
            id="indice-raiz"
            type="number"
            min="2"
            max="2"
            value={indice}
            onChange={(e) => setIndice(e.target.value.replace(/[^0-9]/g, '') || '2')}
            onKeyDown={(e) => e.key === 'Enter' && enviarAlBackend()}
            disabled={loading}
            className="input-base"
          />
          <small>V1: solo raíz cuadrada (índice 2)</small>
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
            <h3>Pasos del algoritmo (m, d)</h3>
            <div className="pasos-lista">
              {pasos.map((paso) => (
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
                        <p>
                          m = {paso.m}, d = {paso.d}
                        </p>
                        <BlockMath math={paso.estado_latex} />
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

import { useState } from 'react'
import { motion } from 'framer-motion'
import '../componentes2Styles/SimplePeriodicResultPanel.css'
import CommonBaseFractionPanel from './CommonBaseFractionPanel'

function calculatePrimeProduct(factorsString) {
  if (!factorsString || factorsString === "Sin factores primos") {
    return { product: 1, factors: [] }
  }
  
  // Parse factors like "2, 3, 5"
  const factors = factorsString.split(', ').map(factor => parseInt(factor.trim())).filter(f => !isNaN(f))
  
  const product = factors.reduce((acc, curr) => acc * curr, 1)
  return { product, factors }
}

export default function SimplePeriodicResultPanel({ result1, result2, base1, base2, commonPrimeFactors }) {
  const { product, factors } = calculatePrimeProduct(commonPrimeFactors)
  const canTransform = product <= 36
  const curtainVariants = {
    hidden: { scaleY: 0, originY: 0 },
    visible: { 
      scaleY: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.5, duration: 0.6 }
    }
  }

  const [show1Fractions, setShow1Fractions] = useState(false)
  const [show2Fractions, setShow2Fractions] = useState(false)
  const [showCommon, setShowCommon] = useState(false)
  const [showCommonBasePanel, setShowCommonBasePanel] = useState(false)

  return (
    <div className="simple-periodic-result-panel">
      <motion.div 
        className="curtain-overlay"
        variants={curtainVariants}
        initial="hidden"
        animate="visible"
      />
      
      <motion.div 
        className="result-content"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <h2>Resultados de Conversión</h2>

        <div className="results-grid">
          {/* Número 1 */}
          <div className="result-card">
            <h3>Número 1 (Base {base1})</h3>
            <div className="button-row">
              <button onClick={() => setShow1Fractions(prev => !prev)}>
                {show1Fractions ? 'Ocultar fracciones' : 'Mostrar fracciones'}
              </button>
            </div>

            {show1Fractions && (
              <>
                <div className="fraction-display">
                  <p className="label">Fracción en base {base1}:</p>
                  <p className="fraction">{result1.fraccion_base_original}</p>
                </div>
                <div className="fraction-display">
                  <p className="label">Fracción decimal:</p>
                  <p className="fraction">{result1.fraccion_decimal}</p>
                </div>
              </>
            )}
          </div>

          {/* Número 2 */}
          <div className="result-card">
            <h3>Número 2 (Base {base2})</h3>
            <div className="button-row">
              <button onClick={() => setShow2Fractions(prev => !prev)}>
                {show2Fractions ? 'Ocultar fracciones' : 'Mostrar fracciones'}
              </button>
            </div>

            {show2Fractions && (
              <>
                <div className="fraction-display">
                  <p className="label">Fracción en base {base2}:</p>
                  <p className="fraction">{result2.fraccion_base_original}</p>
                </div>
                <div className="fraction-display">
                  <p className="label">Fracción decimal:</p>
                  <p className="fraction">{result2.fraccion_decimal}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Factores primos comunes */}
        {commonPrimeFactors && (
          <div className="common-factors-control">
            <button 
              onClick={() => setShowCommon(prev => !prev)}
            >
              {showCommon ? 'Ocultar factores primos comunes' : 'Mostrar factores primos comunes'}
            </button>
          </div>
        )}

        {commonPrimeFactors && showCommon && (
          <motion.div 
            className="common-factors-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h3>📊 Conjunto de Factores Primos Únicos</h3>
            <div className="common-factors-display">
              <p className="factors-result">
                {commonPrimeFactors}
              </p>
              <p className="product-result">
                Producto: {product}
              </p>
              <div className={`transformation-message ${canTransform ? 'success' : 'error'}`}>
                {canTransform ? (
                  <p>✅ La base común para el n-mal finito es: <strong>{product}</strong></p>
                ) : (
                  <p>❌ No se puede transformar computacionalmente (producto &gt; 36)</p>
                )}
              </div>
              <p className="description">
                Factores primos únicos de ambos denominadores (sin repeticiones)
              </p>
            </div>
          </motion.div>
        )}

        {/* Conversión a denominador/base común */}
        {commonPrimeFactors && (
          <div className="common-base-control">
            <button 
              className="go-to-common-base-btn"
              onClick={() => setShowCommonBasePanel(prev => !prev)}
            >
              {showCommonBasePanel ? '✕ Ocultar Conversión Base Común' : '→ Ir a Conversión Base Común'}
            </button>
          </div>
        )}

        {commonPrimeFactors && showCommonBasePanel && (
          <CommonBaseFractionPanel
            fraccion1={result1.fraccion_decimal}
            fraccion2={result2.fraccion_decimal}
            baseComun={product}
          />
        )}
      </motion.div>
    </div>
  )
}
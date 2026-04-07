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

        {/* Control Bar - Visible button options */}
        <div className="control-bar">
          <div className="control-buttons">
            <button 
              className={`control-btn ${show1Fractions ? 'active' : ''}`}
              onClick={() => setShow1Fractions(prev => !prev)}
            >
              <span className="btn-icon">1️⃣</span>
              <span className="btn-text">Número 1</span>
            </button>
            
            <button 
              className={`control-btn ${show2Fractions ? 'active' : ''}`}
              onClick={() => setShow2Fractions(prev => !prev)}
            >
              <span className="btn-icon">2️⃣</span>
              <span className="btn-text">Número 2</span>
            </button>
            
            {commonPrimeFactors && (
              <button 
                className={`control-btn ${showCommon ? 'active' : ''}`}
                onClick={() => setShowCommon(prev => !prev)}
              >
                <span className="btn-icon">🔢</span>
                <span className="btn-text">Factores Primos</span>
              </button>
            )}
            
            {commonPrimeFactors && (
              <button 
                className={`control-btn ${showCommonBasePanel ? 'active' : ''}`}
                onClick={() => setShowCommonBasePanel(prev => !prev)}
              >
                <span className="btn-icon">🔄</span>
                <span className="btn-text">Base Común</span>
              </button>
            )}
          </div>
        </div>

        <div className="results-grid">
          {/* Número 1 */}
          <div className="result-card">
            <h3>📍 Número 1 (Base {base1})</h3>

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

            {!show1Fractions && (
              <p className="placeholder-text">Haz clic en el botón "Número 1" para ver los detalles</p>
            )}
          </div>

          {/* Número 2 */}
          <div className="result-card">
            <h3>📍 Número 2 (Base {base2})</h3>

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

            {!show2Fractions && (
              <p className="placeholder-text">Haz clic en el botón "Número 2" para ver los detalles</p>
            )}
          </div>
        </div>

        {/* Factores primos comunes */}
        {commonPrimeFactors && showCommon && (
          <motion.div 
            className="common-factors-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h3>📊 Factores Primos Comunes</h3>
            <div className="common-factors-display">
              <p className="factors-result">
                {commonPrimeFactors}
              </p>
              <p className="product-result">
                Producto: {product}
              </p>
              <div className={`transformation-message ${canTransform ? 'success' : 'error'}`}>
                {canTransform ? (
                  <p>✅ La base común para el decimal finito es: <strong>{product}</strong></p>
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
        {commonPrimeFactors && showCommonBasePanel && (
          <motion.div
            className="common-base-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <CommonBaseFractionPanel
              fraccion1={result1.fraccion_decimal}
              fraccion2={result2.fraccion_decimal}
              fraccion1BaseOriginal={result1.fraccion_base_original}
              fraccion2BaseOriginal={result2.fraccion_base_original}
              base1={base1}
              base2={base2}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
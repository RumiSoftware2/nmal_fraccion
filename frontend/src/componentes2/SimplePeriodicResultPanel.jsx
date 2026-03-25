import { motion } from 'framer-motion'
import '../componentes2Styles/SimplePeriodicResultPanel.css'

export default function SimplePeriodicResultPanel({ result1, result2, base1, base2, commonPrimeFactors }) {
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
            <div className="fraction-display">
              <p className="label">Fracción en base {base1}:</p>
              <p className="fraction">{result1.fraccion_base_original}</p>
            </div>
            <div className="fraction-display">
              <p className="label">Fracción decimal:</p>
              <p className="fraction">{result1.fraccion_decimal}</p>
            </div>
            {result1.factores_primos && (
              <div className="prime-factors">
                <p className="label">Factores primos del denominador:</p>
                <p className="factors">{result1.factores_primos}</p>
              </div>
            )}
          </div>

          {/* Número 2 */}
          <div className="result-card">
            <h3>Número 2 (Base {base2})</h3>
            <div className="fraction-display">
              <p className="label">Fracción en base {base2}:</p>
              <p className="fraction">{result2.fraccion_base_original}</p>
            </div>
            <div className="fraction-display">
              <p className="label">Fracción decimal:</p>
              <p className="fraction">{result2.fraccion_decimal}</p>
            </div>
            {result2.factores_primos && (
              <div className="prime-factors">
                <p className="label">Factores primos del denominador:</p>
                <p className="factors">{result2.factores_primos}</p>
              </div>
            )}
          </div>
        </div>

        {/* Factores primos comunes */}
        {commonPrimeFactors && (
          <motion.div 
            className="common-factors-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h3>📊 Conjunto de Factores Primos Únicos</h3>
            <div className="common-factors-display">
              <p className="factors-result">
                {"{"}
                {commonPrimeFactors}
                {"}"}
              </p>
              <p className="description">
                Todos los factores primos únicos con su menor exponente de ambos denominadores
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../componentes2Styles/SimplePeriodicResultPanel.css'
import CommonBaseFractionPanel from './CommonBaseFractionPanel'
import Suma from './Suma'
import { convertirAFraccionBaseComun } from '../services/api'

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

  // Un solo estado para la pestaña activa (null = ninguna abierta)
  const [activeTab, setActiveTab] = useState(null)
  const [selectedOperation, setSelectedOperation] = useState(null)
  const [commonBaseResult, setCommonBaseResult] = useState(null)

  // Obtener resultado de conversión a base común
  useEffect(() => {
    if (!result1 || !result2) return

    convertirAFraccionBaseComun({
      fraccion1: result1.fraccion_decimal,
      fraccion2: result2.fraccion_decimal
    })
      .then((data) => setCommonBaseResult(data))
      .catch((err) => console.error('Error al obtener conversión:', err.message))
  }, [result1, result2])

  // Al hacer click en un botón: si ya está activo lo cierra, si no lo abre (cerrando el anterior)
  const handleTabClick = (tabName) => {
    setActiveTab(prev => prev === tabName ? null : tabName)
  }

  // Definir los tabs disponibles
  const tabs = [
    { id: 'numero1', icon: '1️⃣', label: 'Número 1' },
    { id: 'numero2', icon: '2️⃣', label: 'Número 2' },
    ...(commonPrimeFactors ? [{ id: 'factores', icon: '🔢', label: 'Factores Primos' }] : []),
    ...(commonPrimeFactors ? [{ id: 'basecomun', icon: '🔄', label: 'Base Común' }] : []),
    { id: 'operaciones', icon: '➕', label: 'Operaciones' },
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.35, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.96,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  }

  return (
    <div className="simple-periodic-result-panel">
      {/* Barra horizontal de botones */}
      <div className="tabs-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Área de contenido - solo 1 tarjeta a la vez */}
      <div className="tab-content-area">
        <AnimatePresence mode="wait">
          {/* Número 1 */}
          {activeTab === 'numero1' && (
            <motion.div 
              key="numero1"
              className="content-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h3>📍 Número 1 (Base {base1})</h3>
              <div className="fraction-display">
                <p className="label">Fracción en base {base1}:</p>
                <p className="fraction">{result1.fraccion_base_original}</p>
              </div>
              <div className="fraction-display">
                <p className="label">Fracción decimal:</p>
                <p className="fraction">{result1.fraccion_decimal}</p>
              </div>
            </motion.div>
          )}

          {/* Número 2 */}
          {activeTab === 'numero2' && (
            <motion.div 
              key="numero2"
              className="content-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h3>📍 Número 2 (Base {base2})</h3>
              <div className="fraction-display">
                <p className="label">Fracción en base {base2}:</p>
                <p className="fraction">{result2.fraccion_base_original}</p>
              </div>
              <div className="fraction-display">
                <p className="label">Fracción decimal:</p>
                <p className="fraction">{result2.fraccion_decimal}</p>
              </div>
            </motion.div>
          )}

          {/* Factores primos comunes */}
          {activeTab === 'factores' && (
            <motion.div 
              key="factores"
              className="content-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
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

          {/* Conversión a base común */}
          {activeTab === 'basecomun' && (
            <motion.div
              key="basecomun"
              className="content-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
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

          {/* Operaciones */}
          {activeTab === 'operaciones' && (
            <motion.div
              key="operaciones"
              className="content-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h3>➕ Elegir Operación</h3>
              <div className="operations-grid">
                <button 
                  className={`operation-card ${selectedOperation === 'suma' ? 'active' : ''}`}
                  onClick={() => setSelectedOperation('suma')}
                >
                  <span className="op-icon">➕</span>
                  <span className="op-name">Suma</span>
                </button>
                
                <button 
                  className={`operation-card ${selectedOperation === 'resta' ? 'active' : ''}`}
                  onClick={() => setSelectedOperation('resta')}
                >
                  <span className="op-icon">➖</span>
                  <span className="op-name">Resta</span>
                </button>
                
                <button 
                  className={`operation-card ${selectedOperation === 'multiplicacion' ? 'active' : ''}`}
                  onClick={() => setSelectedOperation('multiplicacion')}
                >
                  <span className="op-icon">✖️</span>
                  <span className="op-name">Multiplicación</span>
                </button>
                
                <button 
                  className={`operation-card ${selectedOperation === 'division' ? 'active' : ''}`}
                  onClick={() => setSelectedOperation('division')}
                >
                  <span className="op-icon">÷</span>
                  <span className="op-name">División</span>
                </button>
              </div>

              {/* Renderizar componentes según operación seleccionada */}
              {selectedOperation && (
                <div className="operation-result">
                  {/* Componentes de operaciones */}
                  {selectedOperation === 'suma' && commonBaseResult && (
                    <Suma 
                      result1={{ fraccion_base_original: commonBaseResult.fraccion1_base_cambio }} 
                      result2={{ fraccion_base_original: commonBaseResult.fraccion2_base_cambio }} 
                      base1={commonBaseResult.base_cambio} 
                      base2={commonBaseResult.base_cambio}
                    />
                  )}
                  
                  {selectedOperation === 'resta' && (
                    <p style={{ color: '#666', textAlign: 'center' }}>Componente para resta - A crear</p>
                  )}
                  
                  {selectedOperation === 'multiplicacion' && (
                    <p style={{ color: '#666', textAlign: 'center' }}>Componente para multiplicación - A crear</p>
                  )}
                  
                  {selectedOperation === 'division' && (
                    <p style={{ color: '#666', textAlign: 'center' }}>Componente para división - A crear</p>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Estado vacío - ninguna pestaña seleccionada */}
          {activeTab === null && (
            <motion.div 
              key="empty"
              className="empty-state"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="empty-content">
                <span className="empty-icon">👆</span>
                <p>Selecciona una opción para ver los detalles</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
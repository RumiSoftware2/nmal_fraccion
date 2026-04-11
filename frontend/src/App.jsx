import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Calculator, Brain, Trophy, Sparkles } from 'lucide-react'
import ConversionForm from './components/ConversionForm'
import SimpleConversionForm from './components/SimpleConversionForm'
import ResultPanel from './components/ResultPanel'
import NumberDisplay from './components/NumberDisplay'
import Menu from './components/Menu'
import PeriodicDecimalApp from './componentes2/PeriodicDecimalApp'
import ConversorBase from './componentes3/ConversorBase'
import { useConversion } from './hooks/useConversion'
import escudo from './assets/logoupn.png' // reemplaza con tu imagen de escudo subida a assets
import './components/App.css'

export default function App() {
  const { resultado, error, loading, convertir } = useConversion()
  const [showResult, setShowResult] = useState(false)
  const [currentView, setCurrentView] = useState('menu')

  const handleConvert = async (campos) => {
    setShowResult(false)
    await convertir(campos)
    setShowResult(true)
  }

  const handleSelectProgram = (programId) => {
    if (programId === 'math-tutor') {
      setCurrentView('app')
    } else if (programId === 'periodic-decimal') {
      setCurrentView('periodic-app')
    } else if (programId === 'base-converter') {
      setCurrentView('base-converter')
    }
  }

  if (currentView === 'menu') {
    return <Menu onSelectProgram={handleSelectProgram} />
  }

  if (currentView === 'periodic-app') {
    return (
      <div className="math-tutor-app">
        <motion.header 
          className="math-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <motion.div 
              className="logo-section"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={escudo}
                alt="Escudo Universidad Pedagógica"
                className="univ-logo"
                title="Escudo Universidad Pedagógica"
              />
              <div>
                <h1>📐 Conversor de Decimales</h1>
                <p>Convierte decimales periódicos y normales a fracciones</p>
              </div>
            </motion.div>

            <motion.button
              className="return-menu-btn"
              onClick={() => setCurrentView('menu')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              🏠 Menú Principal
            </motion.button>
          </div>
        </motion.header>

        <main className="math-main">
          <PeriodicDecimalApp />
        </main>
      </div>
    )
  }

  if (currentView === 'base-converter') {
    return (
      <div className="math-tutor-app">
        <motion.header 
          className="math-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <motion.div 
              className="logo-section"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={escudo}
                alt="Escudo Universidad Pedagógica"
                className="univ-logo"
                title="Escudo Universidad Pedagógica"
              />
              <div>
                <h1>🔄 Conversor de Bases</h1>
                <p>Convierte números n-mal entre diferentes bases numéricas</p>
              </div>
            </motion.div>

            <motion.button
              className="return-menu-btn"
              onClick={() => setCurrentView('menu')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              🏠 Menú Principal
            </motion.button>
          </div>
        </motion.header>

        <main className="math-main">
          <ConversorBase />
        </main>
      </div>
    )
  }

  // App content
  return (
    <div className="math-tutor-app">
      <motion.header 
        className="math-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <motion.div 
            className="logo-section"
            whileHover={{ scale: 1.05 }}
          >
            
            <img
              src={escudo}
              alt="Escudo Universidad Pedagógica"
              className="univ-logo"
              title="Escudo Universidad Pedagógica"
            />
            <div>
              <h1>📐 Math Tutor Pro</h1>
              <p>Convierte números periódicos a divisiones de números naturales</p>
            </div>
          </motion.div>

          <motion.button
            className="return-menu-btn"
            onClick={() => setCurrentView('menu')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            🏠 Menú Principal
          </motion.button>

        </div>
      </motion.header>

      <main className="math-main">
        <div className="container">
          {loading && (
            <div className="server-wake-message">
              ⚠️ Servidor gratuito: si está dormido, puede tomar unos minutos en  despertar.
            </div>
          )}
          <motion.div 
            className="content-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
              <AnimatePresence mode="wait">
                {!showResult ? (
                  <motion.div
                    className="form-section"
                    initial={{ opacity: 0, height: 0, y: 20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20, transition: { duration: 0.35 } }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                    key="form-section"
                  >
                    <div className="section-header">
                      <Sparkles size={24} />
                      <h2>🚀 Inicia Conversión</h2>
                    </div>
                    <SimpleConversionForm onSubmit={handleConvert} loading={loading} />
                  </motion.div>
                ) : (
                  <motion.div
                    className="result-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    key="result-section"
                  >
                    <div className="section-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trophy size={24} />
                        <h2>🎯 ¡Resultado Obtenido!</h2>
                      </div>
                      <button
                        className="math-btn btn-outline"
                        onClick={() => setShowResult(false)}
                        style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '8px' }}
                      >
                        ↩️ Volver a Calcular
                      </button>
                    </div>
                    <ResultPanel resultado={resultado} />
                  </motion.div>
                )}
              </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
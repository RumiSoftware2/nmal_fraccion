import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Calculator, Brain, Trophy, Sparkles } from 'lucide-react'
import ConversionForm from './components/ConversionForm'
import SimpleConversionForm from './components/SimpleConversionForm'
import ResultPanel from './components/ResultPanel'
import NumberDisplay from './components/NumberDisplay'
import Menu from './components/Menu'
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
    }
  }

  if (currentView === 'menu') {
    return <Menu onSelectProgram={handleSelectProgram} />
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

          <motion.a
            className="return-report-btn"
            href="https://sites.google.com/view/cursodesistemasnumericos/c%C3%B3digos"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            📄 Regresar a Sistemas Numéricos
          </motion.a>

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
                    style={{ overflow: 'hidden' }}
                    key="form-section"
                  >
                    <div className="section-header">
                      <Sparkles size={24} />
                      <h2>🚀 Inicia tu Conversión</h2>
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
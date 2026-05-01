import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Trophy, Sparkles } from 'lucide-react'
import ConversionForm from './components/ConversionForm'
import SimpleConversionForm from './components/SimpleConversionForm'
import ResultPanel from './components/ResultPanel'
import Menu from './components/Menu'
import PeriodicDecimalApp from './componentes2/PeriodicDecimalApp'
import ConversorBase from './componentes3/ConversorBase'
import AppHeader from './components/AppHeader'
import { useConversion } from './hooks/useConversion'
import escudo from './assets/logoupn.png'
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
        <AppHeader
          programId="periodic-decimal"
          onMenuClick={() => setCurrentView('menu')}
          escudo={escudo}
        />
        <main className="math-main">
          <PeriodicDecimalApp />
        </main>
      </div>
    )
  }

  if (currentView === 'base-converter') {
    return (
      <div className="math-tutor-app">
        <AppHeader
          programId="base-converter"
          onMenuClick={() => setCurrentView('menu')}
          escudo={escudo}
        />
        <main className="math-main">
          <ConversorBase />
        </main>
      </div>
    )
  }

  return (
    <div className="math-tutor-app">
      <AppHeader
        programId="math-tutor"
        onMenuClick={() => setCurrentView('menu')}
        escudo={escudo}
      />

      <main className="math-main">
        <div className="container">
          {loading && (
            <div className="server-wake-message">
              ⚠️ Servidor gratuito: si está dormido, puede tomar unos minutos en despertar.
            </div>
          )}
          <motion.div
            className="content-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
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
                    <h2>🚀 Ingresa tu N-mal</h2>
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

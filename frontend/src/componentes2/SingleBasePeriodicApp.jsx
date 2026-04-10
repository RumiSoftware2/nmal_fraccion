import { useState } from 'react'
import { convertirPeriodico } from '../services/api'
import '../componentes2Styles/SingleBasePeriodicApp.css'
import SimplePeriodicResultPanel from './SimplePeriodicResultPanel'

function parsePeriodicNumber(numberString) {
  // Parse a string like "0.1(6)" or "0.25" into { entero, noPeriodo, periodo }
  const parts = numberString.split('.')
  let entero = parts[0] || '0'
  let decimalPart = parts[1] || ''

  let noPeriodo = ''
  let periodo = ''

  if (decimalPart.includes('(') && decimalPart.includes(')')) {
    const match = decimalPart.match(/^([^()]*)\(([^()]*)\)$/)
    if (match) {
      noPeriodo = match[1]
      periodo = match[2]
    } else {
      // Invalid format, treat as noPeriodo
      noPeriodo = decimalPart
    }
  } else {
    noPeriodo = decimalPart
  }

  return { entero, noPeriodo, periodo }
}

export default function SingleBasePeriodicApp() {
  const [base, setBase] = useState('10')  // Solo una base para ambos números
  const [number1, setNumber1] = useState('')
  const [number2, setNumber2] = useState('')

  const [result1, setResult1] = useState(null)
  const [result2, setResult2] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [commonPrimeFactors, setCommonPrimeFactors] = useState(null)

  const handleConvert = async () => {
    if (!number1 || !number2 || !base) {
      setError('Por favor ingresa ambos números y la base')
      return
    }

    const baseNum = parseInt(base)
    if (isNaN(baseNum) || baseNum < 2) {
      setError('La base debe ser un número mayor a 1')
      return
    }

    // Parse numbers
    const parsed1 = parsePeriodicNumber(number1.trim())
    const parsed2 = parsePeriodicNumber(number2.trim())

    setLoading(true)
    setError('')
    setResult1(null)
    setResult2(null)
    setShowResult(false)
    setCommonPrimeFactors(null)

    try {
      // Usar la misma base para ambos números
      const data1 = {
        entero: parsed1.entero,
        no_periodo: parsed1.noPeriodo,
        periodo: parsed1.periodo,
        base: baseNum
      }
      const data2 = {
        entero: parsed2.entero,
        no_periodo: parsed2.noPeriodo,
        periodo: parsed2.periodo,
        base: baseNum
      }

      const res1 = await convertirPeriodico(data1)
      const res2 = await convertirPeriodico(data2)

      if (!res1 || !res2) {
        setError('Error: No se recibieron resultados del servidor')
        return
      }

      setResult1(res1)
      setResult2(res2)

      // Obtener factores primos comunes
      try {
        const denominators = {
          denominador1: res1.fraccion_decimal.split('/')[1],
          denominador2: res2.fraccion_decimal.split('/')[1]
        }
        
        const primeFactorsResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/common-prime-factors`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(denominators)
          }
        )

        if (primeFactorsResponse.ok) {
          const primeFactorsData = await primeFactorsResponse.json()
          setCommonPrimeFactors(primeFactorsData.common_factors)
        }
      } catch (primeErr) {
        console.warn('Advertencia: No se pudieron obtener los factores primos comunes', primeErr)
      }

      setShowResult(true)
    } catch (err) {
      console.error('Error en conversión:', err)
      setError(err.message || 'Error al convertir los números. Verifica que los valores sean válidos para la base especificada.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setShowResult(false)
    setResult1(null)
    setResult2(null)
    setCommonPrimeFactors(null)
    setError('')
  }

  return (
    <div className="periodic-decimal-app">
      {/* Sección de entrada - Se oculta cuando hay resultados */}
      {!showResult && (
        <div className="input-view">
          <div className="app-header">
            <h2>📊 Conversor de Números Periódicos</h2>
            <p className="subtitle">Convierte números periódicos a fracciones en una base única</p>
          </div>

          <div className="inputs-container">
            {/* Base única */}
            <div className="base-section">
              <h3>🔢 Base De Conversión</h3>
              <div className="input-group">
                <label>Base para ambos números:</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    value={base}
                    onChange={(e) => setBase(e.target.value)}
                    placeholder="Ej: 10"
                    min="2"
                    max="36"
                  />
                  <span className="input-hint">Entre 2 y 36</span>
                </div>
              </div>
            </div>

            {/* Números */}
            <div className="numbers-grid">
              <div className="number-section">
                <div className="section-header">
                  <span className="section-icon">1️⃣</span>
                  <h3>Número 1</h3>
                </div>
                <div className="input-group">
                  <label>Número (formato: entero.decimal(periodo)):</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      value={number1}
                      onChange={(e) => setNumber1(e.target.value)}
                      placeholder="Ej: 0.1(6)"
                    />
                    <span className="input-hint">Con o sin período</span>
                  </div>
                </div>
              </div>

              <div className="number-section">
                <div className="section-header">
                  <span className="section-icon">2️⃣</span>
                  <h3>Número 2</h3>
                </div>
                <div className="input-group">
                  <label>Número (formato: entero.decimal(periodo)):</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      value={number2}
                      onChange={(e) => setNumber2(e.target.value)}
                      placeholder="Ej: 0.1(6)"
                    />
                    <span className="input-hint">Con o sin período</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            className={`btn-convert ${loading ? 'loading' : ''}`}
            onClick={handleConvert} 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Convirtiendo...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span> Convertir
              </>
            )}
          </button>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Sección de resultados - Reemplaza los inputs */}
      {showResult && result1 && result2 && (
        <div className="results-view">
          <div className="results-header">
            <button className="btn-back" onClick={handleReset}>
              <span className="back-icon">←</span>
              Volver a ingresar números
            </button>
            <div className="results-summary">
              <span className="summary-badge">Base {base}</span>
              <span className="summary-number">N1: {number1}</span>
              <span className="summary-number">N2: {number2}</span>
            </div>
          </div>
          <SimplePeriodicResultPanel 
            result1={result1} 
            result2={result2} 
            base1={base}
            base2={base}
            commonPrimeFactors={commonPrimeFactors}
          />
        </div>
      )}
    </div>
  )
}
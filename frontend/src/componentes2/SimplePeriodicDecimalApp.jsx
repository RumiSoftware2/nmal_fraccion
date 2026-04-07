import { useState } from 'react'
import { convertirPeriodico } from '../services/api'
import '../componentes2Styles/SimplePeriodicDecimalApp.css'
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

export default function SimplePeriodicDecimalApp() {
  const [number1, setNumber1] = useState('')
  const [number2, setNumber2] = useState('')
  const [base, setBase] = useState('10')

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
    
    const baseNum1 = baseNum
    const baseNum2 = baseNum

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
      const data1 = {
        entero: parsed1.entero,
        no_periodo: parsed1.noPeriodo,
        periodo: parsed1.periodo,
        base: baseNum1
      }
      const data2 = {
        entero: parsed2.entero,
        no_periodo: parsed2.noPeriodo,
        periodo: parsed2.periodo,
        base: baseNum2
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

  return (
    <div className="simple-periodic-decimal-app">
      <h2>Conversor Simple de Números Periódicos</h2>
      <div className="inputs">
        <div className="base-group">
          <label>Base para ambos números:</label>
          <input
            type="number"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            placeholder="Ej: 10"
            min="2"
          />
        </div>
        <div className="numbers-row">
          <div className="number-section">
            <h3>Número 1</h3>
            <div className="input-group">
              <label>Número (formato: entero.decimal(periodo)):</label>
              <input
                type="text"
                value={number1}
                onChange={(e) => setNumber1(e.target.value)}
                placeholder="Ej: 0.1(6)"
              />
            </div>
          </div>
          <div className="number-section">
            <h3>Número 2</h3>
            <div className="input-group">
              <label>Número (formato: entero.decimal(periodo)):</label>
              <input
                type="text"
                value={number2}
                onChange={(e) => setNumber2(e.target.value)}
                placeholder="Ej: 0.1(6)"
              />
            </div>
          </div>
        </div>
      </div>
      <button onClick={handleConvert} disabled={loading}>
        {loading ? 'Convirtiendo...' : 'Convertir'}
      </button>
      {error && <p className="error">{error}</p>}
      {showResult && result1 && result2 && (
        <SimplePeriodicResultPanel 
          result1={result1} 
          result2={result2} 
          base1={base} 
          base2={base}
          commonPrimeFactors={commonPrimeFactors}
        />
      )}
    </div>
  )
}
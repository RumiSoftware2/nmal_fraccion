import { useState } from 'react'
import { convertirPeriodico } from '../services/api'
import '../componentes2Styles/PeriodicDecimalApp.css'

export default function PeriodicDecimalApp() {
  // Número 1
  const [entero1, setEntero1] = useState('')
  const [noPeriodo1, setNoPeriodo1] = useState('')
  const [periodo1, setPeriodo1] = useState('')
  const [base1, setBase1] = useState('10')
  
  // Número 2
  const [entero2, setEntero2] = useState('')
  const [noPeriodo2, setNoPeriodo2] = useState('')
  const [periodo2, setPeriodo2] = useState('')
  const [base2, setBase2] = useState('10')
  
  const [result1, setResult1] = useState(null)
  const [result2, setResult2] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConvert = async () => {
    if (!entero1 || !base1 || !entero2 || !base2) {
      setError('Por favor ingresa todos los campos requeridos')
      return
    }

    setLoading(true)
    setError('')
    setResult1(null)
    setResult2(null)

    try {
      const data1 = {
        entero: entero1,
        no_periodo: noPeriodo1,
        periodo: periodo1,
        base: parseInt(base1)
      }
      const data2 = {
        entero: entero2,
        no_periodo: noPeriodo2,
        periodo: periodo2,
        base: parseInt(base2)
      }

      const res1 = await convertirPeriodico(data1)
      const res2 = await convertirPeriodico(data2)

      setResult1(res1)
      setResult2(res2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="periodic-decimal-app">
      <h2>Conversor de Números Periódicos</h2>
      <div className="inputs">
        <div className="number-section">
          <h3>Número 1</h3>
          <div className="input-group">
            <label>Parte Entera:</label>
            <input
              type="text"
              value={entero1}
              onChange={(e) => setEntero1(e.target.value)}
              placeholder="Ej: 0"
            />
          </div>
          <div className="input-group">
            <label>Parte No Periódica:</label>
            <input
              type="text"
              value={noPeriodo1}
              onChange={(e) => setNoPeriodo1(e.target.value)}
              placeholder="Ej: 1"
            />
          </div>
          <div className="input-group">
            <label>Parte Periódica:</label>
            <input
              type="text"
              value={periodo1}
              onChange={(e) => setPeriodo1(e.target.value)}
              placeholder="Ej: 6"
            />
          </div>
          <div className="input-group">
            <label>Base:</label>
            <input
              type="number"
              value={base1}
              onChange={(e) => setBase1(e.target.value)}
              placeholder="Ej: 10"
              min="2"
            />
          </div>
        </div>
        <div className="number-section">
          <h3>Número 2</h3>
          <div className="input-group">
            <label>Parte Entera:</label>
            <input
              type="text"
              value={entero2}
              onChange={(e) => setEntero2(e.target.value)}
              placeholder="Ej: 0"
            />
          </div>
          <div className="input-group">
            <label>Parte No Periódica:</label>
            <input
              type="text"
              value={noPeriodo2}
              onChange={(e) => setNoPeriodo2(e.target.value)}
              placeholder="Ej: 1"
            />
          </div>
          <div className="input-group">
            <label>Parte Periódica:</label>
            <input
              type="text"
              value={periodo2}
              onChange={(e) => setPeriodo2(e.target.value)}
              placeholder="Ej: 6"
            />
          </div>
          <div className="input-group">
            <label>Base:</label>
            <input
              type="number"
              value={base2}
              onChange={(e) => setBase2(e.target.value)}
              placeholder="Ej: 10"
              min="2"
            />
          </div>
        </div>
      </div>
      <button onClick={handleConvert} disabled={loading}>
        {loading ? 'Convirtiendo...' : 'Convertir'}
      </button>
      {error && <p className="error">{error}</p>}
      {result1 && result2 && (
        <div className="results">
          <div className="result">
            <h3>Número 1</h3>
            <p>Fracción en base {base1}: {result1.fraccion_base_original}</p>
            <p>Fracción decimal: {result1.fraccion_decimal}</p>
          </div>
          <div className="result">
            <h3>Número 2</h3>
            <p>Fracción en base {base2}: {result2.fraccion_base_original}</p>
            <p>Fracción decimal: {result2.fraccion_decimal}</p>
          </div>
        </div>
      )}
    </div>
  )
}
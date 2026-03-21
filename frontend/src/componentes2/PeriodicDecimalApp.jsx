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
    // Validar que al menos la parte entera esté completa
    if (!entero1 || !base1 || !entero2 || !base2) {
      setError('Por favor ingresa la parte entera y la base de cada número')
      return
    }

    // Validar que la base sea válida (mayor a 1)
    const baseNum1 = parseInt(base1)
    const baseNum2 = parseInt(base2)
    if (isNaN(baseNum1) || isNaN(baseNum2) || baseNum1 < 2 || baseNum2 < 2) {
      setError('La base debe ser un número mayor a 1')
      return
    }

    setLoading(true)
    setError('')
    setResult1(null)
    setResult2(null)

    try {
      const data1 = {
        entero: entero1.trim(),
        no_periodo: noPeriodo1.trim(),
        periodo: periodo1.trim(),
        base: baseNum1
      }
      const data2 = {
        entero: entero2.trim(),
        no_periodo: noPeriodo2.trim(),
        periodo: periodo2.trim(),
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
    } catch (err) {
      console.error('Error en conversión:', err)
      setError(err.message || 'Error al convertir los números. Verifica que los valores sean válidos para la base especificada.')
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
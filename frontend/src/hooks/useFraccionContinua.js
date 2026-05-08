import { useState } from 'react'
import { calcularFraccionContinua } from '../services/api'

export function useFraccionContinua() {
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const calcular = async (datos, errorValidacion = null) => {
    if (errorValidacion) {
      setError(errorValidacion)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await calcularFraccionContinua(datos)
      setResultado(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const limpiarError = () => setError(null)

  return { resultado, error, loading, calcular, limpiarError }
}

import { useState } from 'react'
import { calcularFraccionContinuaPeriodica } from '../services/api'

export function useFraccionContinuaPeriodica() {
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
      const data = await calcularFraccionContinuaPeriodica(datos)
      setResultado(data)
    } catch (e) {
      setError(e.message)
      setResultado(null)
    } finally {
      setLoading(false)
    }
  }

  const limpiar = () => {
    setError(null)
    setResultado(null)
  }

  return { resultado, error, loading, calcular, limpiar }
}

import { useState } from 'react'
import { convertirPeriodico } from '../services/api'
import { validarEntrada } from '../utils/helpers'

export function useConversion() {
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const convertir = async (campos) => {
    const errorValidacion = validarEntrada(campos)
    if (errorValidacion) { setError(errorValidacion); return }

    setLoading(true)
    setError(null)
    try {
      const data = await convertirPeriodico(campos)
      setResultado(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { resultado, error, loading, convertir }
}
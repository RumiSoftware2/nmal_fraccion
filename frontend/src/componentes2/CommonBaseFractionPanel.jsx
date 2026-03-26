import { useEffect, useState } from 'react'
import { convertirAFraccionBaseComun } from '../services/api'
import '../componentes2Styles/CommonBaseFractionPanel.css'

export default function CommonBaseFractionPanel({ fraccion1, fraccion2, baseComun }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)

  useEffect(() => {
    if (!fraccion1 || !fraccion2) return

    setLoading(true)
    setError('')
    setResultado(null)

    convertirAFraccionBaseComun({
      fraccion1,
      fraccion2
    })
      .then((data) => setResultado(data))
      .catch((err) => setError(err.message || 'Error al obtener conversión'))
      .finally(() => setLoading(false))
  }, [fraccion1, fraccion2])

  if (loading) return <p>Cargando conversión de base común...</p>
  if (error) return <p className="error">{error}</p>
  if (!resultado) return null

  return (
    <div className="common-base-fraction-panel">
      <h4>Conversión a Base Común</h4>
      <div className="common-base-result">
        <p>Fracción 1 original: <strong>{fraccion1}</strong></p>
        <p>Fracción 1 en base cambio: <strong>{resultado.fraccion1_base_cambio}</strong></p>

        <p>Fracción 2 original: <strong>{fraccion2}</strong></p>
        <p>Fracción 2 en base cambio: <strong>{resultado.fraccion2_base_cambio}</strong></p>

        <p>Base de cambio: <strong>{resultado.base_cambio}</strong></p>
      </div>
    </div>
  )
}
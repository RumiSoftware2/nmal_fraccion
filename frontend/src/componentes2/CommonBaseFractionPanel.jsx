import { useEffect, useState } from 'react'
import { convertirAFraccionBaseComun } from '../services/api'
import './CommonBaseFractionPanel.css'

export default function CommonBaseFractionPanel({ fraccion1, fraccion2, baseComun }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)

  useEffect(() => {
    if (!fraccion1 || !fraccion2 || !baseComun) return

    setLoading(true)
    setError('')
    setResultado(null)

    convertirAFraccionBaseComun({
      fraccion1,
      fraccion2,
      base_comun: baseComun
    })
      .then((data) => setResultado(data))
      .catch((err) => setError(err.message || 'Error al obtener conversión'))
      .finally(() => setLoading(false))
  }, [fraccion1, fraccion2, baseComun])

  if (loading) return <p>Cargando conversión de base común...</p>
  if (error) return <p className="error">{error}</p>
  if (!resultado) return null

  return (
    <div className="common-base-fraction-panel">
      <h4>Conversión a Base Común ({baseComun})</h4>
      <div className="common-base-result">
        <p>Fracción 1 original: <strong>{fraccion1}</strong></p>
        <p>Fracción 1 en base común: <strong>{resultado.fraccion1_base_comun}</strong></p>

        <p>Fracción 2 original: <strong>{fraccion2}</strong></p>
        <p>Fracción 2 en base común: <strong>{resultado.fraccion2_base_comun}</strong></p>

        <p>Denominador común: <strong>{resultado.denominador_comun}</strong></p>
      </div>
      <small>
        Escala: n1×{resultado.factor1} = {resultado.numerador1}, n2×{resultado.factor2} = {resultado.numerador2}
      </small>
    </div>
  )
}
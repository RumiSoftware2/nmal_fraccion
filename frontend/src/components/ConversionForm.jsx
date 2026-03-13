import { useState } from 'react'

export default function ConversionForm({ onSubmit, loading }) {
  const [campos, setCampos] = useState({
    entero: '0', no_periodo: '1', periodo: '6', base: '7'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(campos)
  }

  const handleChange = (e) => {
    setCampos(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <input name="entero" value={campos.entero} onChange={handleChange} placeholder="Entero" />
        <input name="no_periodo" value={campos.no_periodo} onChange={handleChange} placeholder="No período" />
        <input name="periodo" value={campos.periodo} onChange={handleChange} placeholder="Período" />
        <input name="base" type="number" value={campos.base} onChange={handleChange} placeholder="Base" />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Calculando...' : 'Convertir a Fracción'}
      </button>
    </form>
  )
}
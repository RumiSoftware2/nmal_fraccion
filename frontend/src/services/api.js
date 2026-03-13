const BASE_URL = 'http://localhost:8000'

export async function convertirPeriodico(datos) {
  const response = await fetch(`${BASE_URL}/convertir-periodico`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.detail || 'Error en la conversión')
  }
  return response.json()
}
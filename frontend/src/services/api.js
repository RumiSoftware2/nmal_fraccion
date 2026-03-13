const BASE_URL = import.meta.env.VITE_API_URL

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
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

export async function convertirAFraccionBaseComun(datos) {
  const response = await fetch(`${BASE_URL}/convertir-base-comun`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.detail || 'Error al convertir a base común')
  }
  return response.json()
}

export async function dividirFracciones(datos) {
  const response = await fetch(`${BASE_URL}/dividir-fracciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.detail || 'Error al dividir fracciones')
  }
  return response.json()
}
import { BASE_MIN, BASE_MAX } from '../constants/constants'

export function validarEntrada({ entero, periodo, base }) {
  // La parte entera es obligatoria
  if (!entero || entero.trim() === '') {
    return 'La parte entera es obligatoria'
  }
  
  // Para solo entero (sin decimales) o con decimales, pero al menos uno debe tener contenido
  const tienePeriodo = periodo && periodo.trim() !== ''
  const tieneNoPerido = false // simplemente asumimos que no_periodo es opcional para esta validación
  
  // Si no hay período ni no-período, entonces es solo un número entero, lo cual está bien
  
  const b = parseInt(base)
  if (!b || b < BASE_MIN || b > BASE_MAX)
    return `La base debe ser un número entre ${BASE_MIN} y ${BASE_MAX}`
  
  return null
}
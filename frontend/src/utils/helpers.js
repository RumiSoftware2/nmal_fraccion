import { BASE_MIN, BASE_MAX } from '../constants/constants'

export function validarEntrada({ periodo, base }) {
  if (!periodo) return 'El período es obligatorio'
  const b = parseInt(base)
  if (!b || b < BASE_MIN || b > BASE_MAX)
    return `La base debe ser un número entre ${BASE_MIN} y ${BASE_MAX}`
  return null
}
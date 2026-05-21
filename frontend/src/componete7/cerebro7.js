/**
 * cerebro7.js - Lógica pura para reductas finitas (convergentes)
 * 
 * Implementa:
 *   1. parsearFraccionContinua(texto) - convierte "2;2,3,4" → [2, 2, 3, 4]
 *   2. calcularReductas(coeficientes) - calcula convergentes p_k/q_k
 *   3. procesarExpresionFC(texto) - orquestadora principal
 */

/**
 * Parsea string tipo "2;2,3,4" → array de coeficientes [2, 2, 3, 4]
 * Reglas:
 *   - Formato: a₀;a₁,a₂,... (el ; es obligatorio si hay más de un coeficiente después)
 *   - Sin ;: un solo número → [n]
 *   - Espacios opcionales
 *   - Todos los coeficientes deben ser enteros ≥ 0
 * 
 * Retorna:
 *   { ok: true, coeficientes: [...], notacion: '[a₀; a₁, ...]' }
 *   ó
 *   { ok: false, error: 'mensaje de error' }
 */
export function parsearFraccionContinua(texto) {
  if (!texto || typeof texto !== 'string') {
    return { ok: false, error: 'La entrada debe ser un texto no vacío' }
  }

  texto = texto.trim()

  if (texto === '') {
    return { ok: false, error: 'Ingresa una fracción continua (ej: 2;2,3,4 o 5)' }
  }

  // Verificar caracteres válidos (solo números, punto y coma, comas y espacios)
  if (!/^[\d;,\s]+$/.test(texto)) {
    return { ok: false, error: 'Solo se permiten números, punto y coma (;), comas (,) y espacios' }
  }

  let coeficientes = []

  if (texto.includes(';')) {
    // Formato: a₀;a₁,a₂,...
    const partes = texto.split(';')

    if (partes.length !== 2) {
      return { ok: false, error: 'Debe haber exactamente un punto y coma (;)' }
    }

    const [parte_a0, parte_resto] = partes

    // Parsear a₀
    const a0_str = parte_a0.trim()
    if (!a0_str) {
      return { ok: false, error: 'Falta el coeficiente a₀ antes del punto y coma' }
    }

    const a0 = parseInt(a0_str, 10)
    if (isNaN(a0) || a0 < 0) {
      return { ok: false, error: `a₀ debe ser un entero no negativo, recibí: ${a0_str}` }
    }

    coeficientes.push(a0)

    // Parsear a₁, a₂, ... (si hay)
    if (parte_resto.trim()) {
      const elementos = parte_resto.split(',').map(s => s.trim())

      for (const elem of elementos) {
        if (!elem) {
          return { ok: false, error: 'Comas mal colocadas o vacías' }
        }

        const val = parseInt(elem, 10)
        if (isNaN(val) || val < 0) {
          return { ok: false, error: `Coeficiente inválido o negativo: ${elem}` }
        }

        coeficientes.push(val)
      }
    }
  } else {
    // Formato: solo números (un coeficiente o lista sin ;)
    // Recomendación del plan: exigir ; si hay más de un elemento
    // Así que aquí permitimos solo un número o una lista
    const elementos = texto.split(',').map(s => s.trim())

    if (elementos.length === 1) {
      // Un solo coeficiente
      const val = parseInt(elementos[0], 10)
      if (isNaN(val) || val < 0) {
        return { ok: false, error: `Coeficiente inválido: ${elementos[0]}` }
      }
      coeficientes.push(val)
    } else {
      // Múltiples elementos sin ; - error
      return { ok: false, error: 'Si tienes más de un coeficiente, usa punto y coma (;): a₀;a₁,a₂,...' }
    }
  }

  if (coeficientes.length === 0) {
    return { ok: false, error: 'Se requiere al menos un coeficiente' }
  }

  // Construir notación [a₀; a₁, a₂, ...]
  let notacion = '['
  notacion += coeficientes[0]
  if (coeficientes.length > 1) {
    notacion += '; ' + coeficientes.slice(1).join(', ')
  }
  notacion += ']'

  return {
    ok: true,
    coeficientes,
    notacion
  }
}

/**
 * Calcula las reductas (convergentes) de una fracción continua
 * 
 * Fórmula recurrente (según Euclides):
 *   p₋₁ = 1,  q₋₁ = 0
 *   p₀  = a₀, q₀  = 1
 *   Para k = 1 … n:
 *     pₖ = aₖ·pₖ₋₁ + pₖ₋₂
 *     qₖ = aₖ·qₖ₋₁ + qₖ₋₂
 * 
 * Retorna objeto con:
 *   - coeficientes: array original
 *   - reductas: array de { paso, a_k, p, q, p_prev2, p_prev1, q_prev2, q_prev1, coeficientesHasta }
 *   - valorFinal: { p, q }
 */
export function calcularReductas(coeficientes) {
  if (!Array.isArray(coeficientes) || coeficientes.length === 0) {
    return {
      ok: false,
      error: 'Se requiere un array no vacío de coeficientes'
    }
  }

  // Validar que todos sean enteros no negativos
  for (let i = 0; i < coeficientes.length; i++) {
    const c = coeficientes[i]
    if (!Number.isInteger(c) || c < 0) {
      return {
        ok: false,
        error: `El coeficiente en posición ${i} debe ser un entero no negativo, recibí: ${c}`
      }
    }
  }

  const reductas = []

  // Inicialización: p₋₁, q₋₁, p₋₀, q₀
  let p_prev2 = 1    // p₋₁
  let q_prev2 = 0    // q₋₁
  let p_prev1 = coeficientes[0]  // p₀
  let q_prev1 = 1    // q₀

  // Paso 0 (a₀)
  reductas.push({
    paso: 0,
    a_k: coeficientes[0],
    p: p_prev1,
    q: q_prev1,
    p_prev2: 1,
    p_prev1: coeficientes[0],
    q_prev2: 0,
    q_prev1: 1,
    coeficientesHasta: [coeficientes[0]]
  })

  // Pasos 1 … n
  for (let k = 1; k < coeficientes.length; k++) {
    const a_k = coeficientes[k]
    const p_k = a_k * p_prev1 + p_prev2
    const q_k = a_k * q_prev1 + q_prev2

    reductas.push({
      paso: k,
      a_k,
      p: p_k,
      q: q_k,
      p_prev2: p_prev1,
      p_prev1: p_k,
      q_prev2: q_prev1,
      q_prev1: q_k,
      coeficientesHasta: coeficientes.slice(0, k + 1)
    })

    // Actualizar para siguiente iteración
    p_prev2 = p_prev1
    p_prev1 = p_k
    q_prev2 = q_prev1
    q_prev1 = q_k
  }

  return {
    ok: true,
    coeficientes,
    reductas,
    valorFinal: {
      p: reductas[reductas.length - 1].p,
      q: reductas[reductas.length - 1].q
    }
  }
}

/**
 * Función orquestadora: parsea + calcula reductas
 * Retorna objeto con ok, coeficientes, reductas, etc., o error
 */
export function procesarExpresionFC(texto) {
  const parsed = parsearFraccionContinua(texto)
  if (!parsed.ok) {
    return parsed
  }

  const resultado = calcularReductas(parsed.coeficientes)
  if (!resultado.ok) {
    return resultado
  }

  // Agregar notación al resultado final
  resultado.notacion = parsed.notacion

  return resultado
}

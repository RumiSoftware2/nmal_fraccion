/**
 * cerebro8.js
 * Procesamiento de fracciones continuas eventualmente periódicas
 * mediante matrices de Möbius → ecuación cuadrática irreducible
 */

// ============================================================
// 1. PARSEO
// ============================================================

/**
 * Parsea una FC eventualmente periódica: preperiodo;cola(periodo)
 * Ej: "1;2(34)" → preperiod: [1,2], period: [3,4]
 * Ej: "1234;12(323)" → se parsean dígitos individuales
 */
export function parsearFCPeriodica(texto) {
  if (!texto || typeof texto !== 'string') {
    return { ok: false, error: 'Entrada vacía o inválida' }
  }

  const trimmed = texto.trim()

  // Debe haber exactamente un ;
  const semicolonCount = (trimmed.match(/;/g) || []).length
  if (semicolonCount !== 1) {
    return { ok: false, error: 'Debe haber exactamente un ";"' }
  }

  // Extraer período con regex
  const periodMatch = trimmed.match(/\(([^)]+)\)/)
  if (!periodMatch) {
    return { ok: false, error: 'Debe haber un período entre paréntesis ()' }
  }
  const periodStr = periodMatch[1]

  // Dividir por ;
  const [leftPart, rightPart] = trimmed.split(';')

  // Parte derecha: texto antes de ( más período
  const rightBeforeParen = rightPart.substring(0, rightPart.indexOf('('))

  // Concatenar: preperíodo = leftPart + rightBeforeParen
  const preperiodStr = leftPart + rightBeforeParen

  // Parsear preperíodo
  let preperiod = []
  if (preperiodStr) {
    preperiod = parseCoeficientes(preperiodStr)
    if (!preperiod.ok) return preperiod
    preperiod = preperiod.coefs
  }

  // Parsear período
  const periodParsed = parseCoeficientes(periodStr)
  if (!periodParsed.ok) return periodParsed
  const period = periodParsed.coefs

  if (period.length === 0) {
    return { ok: false, error: 'Período debe tener al menos 1 coeficiente' }
  }

  // Validar que todos sean ≥ 1
  const allCoefs = [...preperiod, ...period]
  for (const c of allCoefs) {
    if (c < 1) {
      return { ok: false, error: 'Todos los coeficientes deben ser ≥ 1' }
    }
  }

  const coeficientesCompletos = [...preperiod, ...period]
  const indicePeriodo = preperiod.length

  // Construir notación
  const notacion = construirNotacion(preperiod, period)

  return {
    ok: true,
    preperiod,
    period,
    coeficientesCompletos,
    indicePeriodo,
    notacion
  }
}

/**
 * Parsea un string de coeficientes:
 * - Si tiene comas: "2,3" → [2, 3]
 * - Si solo dígitos: "1234" → [1, 2, 3, 4]
 */
function parseCoeficientes(str) {
  str = str.trim()
  if (!str) return { ok: true, coefs: [] }

  let coefs = []

  if (str.includes(',')) {
    // Formato con comas
    const parts = str.split(',')
    for (const part of parts) {
      const trimmed = part.trim()
      if (!trimmed) return { ok: false, error: `Coeficiente vacío: "${str}"` }
      const num = parseInt(trimmed, 10)
      if (isNaN(num) || num < 1) {
        return {
          ok: false,
          error: `Coeficiente inválido: "${trimmed}" (debe ser entero ≥ 1)`
        }
      }
      coefs.push(num)
    }
  } else {
    // Formato sin comas: cada dígito
    if (!/^\d+$/.test(str)) {
      return { ok: false, error: `Caracteres inválidos: "${str}"` }
    }
    for (const char of str) {
      const digit = parseInt(char, 10)
      if (digit === 0) {
        return {
          ok: false,
          error: `Dígito 0 no permitido en fracciones continuas (debe ser ≥ 1)`
        }
      }
      coefs.push(digit)
    }
  }

  return { ok: true, coefs }
}

/**
 * Construye la notación LaTeX: [a₀;a₁,...,a_{k-1}, \overline{a_k,...,a_n}]
 */
function construirNotacion(preperiod, period) {
  const preStr = preperiod.map(String).join(', ')
  const perStr = period.map(String).join(', ')

  if (preperiod.length === 0) {
    return `\\left[\\overline{${perStr}}\\right]`
  } else if (preperiod.length === 1) {
    return `\\left[${preperiod[0]};\\overline{${perStr}}\\right]`
  } else {
    const a0 = preperiod[0]
    const rest = preperiod.slice(1).map(String).join(', ')
    return `\\left[${a0};${rest},\\overline{${perStr}}\\right]`
  }
}

// ============================================================
// 2. MATRICES M(a) Y OPERACIONES
// ============================================================

/**
 * Matriz M(a) = [[a, 1], [1, 0]]
 */
export function matrizM(a) {
  return [
    [a, 1],
    [1, 0]
  ]
}

/**
 * Matriz identidad 2×2
 */
export function matrizIdentidad() {
  return [
    [1, 0],
    [0, 1]
  ]
}

/**
 * Multiplica dos matrices 2×2: A × B
 */
export function multiplicarMatrices(A, B) {
  const [[a, b], [c, d]] = A
  const [[e, f], [g, h]] = B

  return [
    [a * e + b * g, a * f + b * h],
    [c * e + d * g, c * f + d * h]
  ]
}

/**
 * Producto de una lista de matrices (vacío → identidad)
 */
export function productoMatrices(listaMatrices) {
  if (listaMatrices.length === 0) {
    return matrizIdentidad()
  }

  let resultado = listaMatrices[0]
  for (let i = 1; i < listaMatrices.length; i++) {
    resultado = multiplicarMatrices(resultado, listaMatrices[i])
  }

  return resultado
}

// ============================================================
// 3. MATRICES DEL PERÍODO Y ECUACIÓN EN y
// ============================================================

/**
 * Construye T = M(a_k) · M(a_{k+1}) · ... · M(a_n)
 * donde k = preperiod.length (inicio del período)
 */
export function construirMatrizPeriodo(period) {
  const matrices = period.map(matrizM)
  return productoMatrices(matrices)
}

/**
 * Extrae la ecuación cuadrática en y desde T
 * T = [[A, B], [C, D]] → Cy² + (D - A)y - B = 0
 */
export function ecuacionCuadraticaDesdeT(T) {
  const [[A, B], [C, D]] = T
  return {
    a: C,
    b: D - A,
    c: -B
  }
}

// ============================================================
// 4. MATRIZ DEL PREPERÍODO Y RELACIÓN x ↔ y
// ============================================================

/**
 * Construye P = M(a_0) · ... · M(a_{k-1})
 */
export function construirMatrizPreperiodo(preperiod) {
  if (!preperiod || preperiod.length === 0) {
    return matrizIdentidad()
  }
  const matrices = preperiod.map(matrizM)
  return productoMatrices(matrices)
}

/**
 * Extrae los componentes de P para la relación x ↔ y
 * P = [[E, F], [G, H]]
 * Convención Möbius: x = (E·y + F) / (G·y + H)
 * Inversa: y = (H·x - F) / (E - G·x)
 */
export function relacionXyDesdeP(P) {
  const [[E, F], [G, H]] = P
  return { E, F, G, H }
}

// ============================================================
// 5. SUSTITUCIÓN Y EXPANSIÓN
// ============================================================

/**
 * Sustituye y = (H*x - F) / (E - G*x) en la ecuación cuadrática de y
 * Cy² + (D-A)y - B = 0
 *
 * Cuando multiplicamos por (E - Gx)²:
 * C(Hx - F)² + (D-A)(Hx - F)(E - Gx) - B(E - Gx)² = 0
 *
 * Expandir y recopilar términos en x
 */
export function sustituirYenCuadratica(eqY, relacion) {
  const { a: C, b: DA, c: negB } = eqY // C, D-A, -B
  const { E, F, G, H } = relacion

  // Expandir término por término
  // T1 = C(Hx - F)²
  const t1_hx_f_sq = () => {
    // (Hx - F)² = H²x² - 2HFx + F²
    const h2 = H * H
    const f2 = F * F
    const hf2 = 2 * H * F
    return { coef_x2: C * h2, coef_x1: C * (-hf2), coef_x0: C * f2 }
  }
  const t1 = t1_hx_f_sq()

  // T2 = (D-A)(Hx - F)(E - Gx)
  // (Hx - F)(E - Gx) = HEx - HGx² - FE + FGx = -HG*x² + (HE + FG)*x - FE
  const t2_hx_f_e_gx = () => {
    const hg = H * G
    const he_fg = H * E + F * G
    const fe = F * E
    return { coef_x2: -hg, coef_x1: he_fg, coef_x0: -fe }
  }
  const t2_inner = t2_hx_f_e_gx()
  const t2 = {
    coef_x2: DA * t2_inner.coef_x2,
    coef_x1: DA * t2_inner.coef_x1,
    coef_x0: DA * t2_inner.coef_x0
  }

  // T3 = -B(E - Gx)²
  // (E - Gx)² = E² - 2EGx + G²x²
  const e2 = E * E
  const g2 = G * G
  const eg2 = 2 * E * G
  const t3 = {
    coef_x2: negB * g2,
    coef_x1: negB * (-eg2),
    coef_x0: negB * e2
  }

  // Sumar los tres términos
  const a_coef = t1.coef_x2 + t2.coef_x2 + t3.coef_x2
  const b_coef = t1.coef_x1 + t2.coef_x1 + t3.coef_x1
  const c_coef = t1.coef_x0 + t2.coef_x0 + t3.coef_x0

  return { a: a_coef, b: b_coef, c: c_coef }
}

// ============================================================
// 6. NORMALIZACIÓN Y VALIDACIÓN
// ============================================================

/**
 * Calcula el MCD de 3 números
 */
function mcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

function gcd3(a, b, c) {
  return mcd(mcd(Math.abs(a), Math.abs(b)), Math.abs(c))
}

/**
 * Normaliza la ecuación:
 * 1. Divide por el MCD
 * 2. Si a < 0, multiplica todo por -1
 */
export function normalizarEcuacion({ a, b, c }) {
  // Si todos son 0, caso especial (no debería ocurrir)
  if (a === 0 && b === 0 && c === 0) {
    return { a: 0, b: 0, c: 0, gcd: 1 }
  }

  // MCD de valores absolutos
  const g = gcd3(a, b, c)
  let a_norm = Math.round(a / g)
  let b_norm = Math.round(b / g)
  let c_norm = Math.round(c / g)

  // Si a < 0, invertir signos
  if (a_norm < 0) {
    a_norm = -a_norm
    b_norm = -b_norm
    c_norm = -c_norm
  }

  return { a: a_norm, b: b_norm, c: c_norm, gcd: g }
}

/**
 * Valida el resultado: calcula discriminante y raíces
 */
export function validarResultado(eqX) {
  const { a, b, c } = eqX

  if (a === 0) {
    // Ecuación lineal (no debería ocurrir en nuestro caso)
    return {
      discriminant: null,
      tieneRaicesReales: false,
      roots: [],
      error: 'Coeficiente a = 0 (ecuación no cuadrática)'
    }
  }

  const delta = b * b - 4 * a * c

  let roots = []
  let raizPositiva = null

  if (delta >= 0) {
    const sqrtDelta = Math.sqrt(delta)
    const r1 = (-b + sqrtDelta) / (2 * a)
    const r2 = (-b - sqrtDelta) / (2 * a)
    roots = [r1, r2].sort((x, y) => x - y)

    // La raíz positiva es la que corresponde a la FC
    raizPositiva = roots.find((r) => r > 0)
  }

  return {
    discriminant: delta,
    tieneRaicesReales: delta > 0,
    roots,
    raizPositiva,
    esIrreducible: gcd3(a, b, c) === 1
  }
}

// ============================================================
// 7. ORQUESTADOR PRINCIPAL
// ============================================================

/**
 * Procesa una FC eventualmente periódica de principio a fin
 */
export function procesarFCPeriodica(texto) {
  // Paso 1: Parseo
  const parsed = parsearFCPeriodica(texto)
  if (!parsed.ok) {
    return parsed
  }

  const { preperiod, period, notacion } = parsed

  // Paso 2-3: Matriz T y ecuación en y
  const matrix_T = construirMatrizPeriodo(period)
  const equation_y = ecuacionCuadraticaDesdeT(matrix_T)

  // Paso 4-5: Matriz P y relación x ↔ y
  const matrix_P = construirMatrizPreperiodo(preperiod)
  const relacion = relacionXyDesdeP(matrix_P)

  // Paso 6-7: Sustitución y expansión
  const equation_x_raw = sustituirYenCuadratica(equation_y, relacion)

  // Paso 8: Normalización
  const equation_x_norm = normalizarEcuacion(equation_x_raw)
  const { a, b, c, gcd } = equation_x_norm

  // Validación
  const validation = validarResultado({ a, b, c })

  // Solución como raíz
  const solucionComoRaiz = formatearSolucionComoRaiz(a, b, c, validation.discriminant)

  return {
    ok: true,
    continued_fraction: notacion,
    preperiod,
    period,
    coeficientesCompletos: parsed.coeficientesCompletos,
    indicePeriodo: parsed.indicePeriodo,
    matrix_T,
    matrix_P,
    equation_y,
    equation_x_raw,
    equation_x: { a, b, c },
    normalization_factor: gcd,
    minimal_polynomial: formatearPolinomio(a, b, c),
    solution_as_root: solucionComoRaiz,
    discriminant: validation.discriminant,
    roots: validation.roots,
    numerical_approximation: validation.raizPositiva,
    is_irreducible: validation.esIrreducible,
    // Para los pasos en LaTeX
    pasos: construirPasosParaUI({
      preperiod,
      period,
      matrix_T,
      matrix_P,
      equation_y,
      equation_x_raw,
      equation_x: { a, b, c },
      normalization_factor: gcd,
      relacion,
      validation,
      notacion,
      solucionComoRaiz
    })
  }
}

/**
 * Formatea un polinomio ax² + bx + c
 */
export function formatearPolinomio(a, b, c) {
  if (a === 0) return 'No es cuadrático'

  let result = ''

  if (a === 1) {
    result = 'x²'
  } else if (a === -1) {
    result = '-x²'
  } else {
    result = `${a}x²`
  }

  if (b !== 0) {
    if (b > 0) {
      result += ` + ${b}x`
    } else {
      result += ` - ${Math.abs(b)}x`
    }
  }

  if (c !== 0) {
    if (c > 0) {
      result += ` + ${c}`
    } else {
      result += ` - ${Math.abs(c)}`
    }
  }

  result += ' = 0'

  return result
}

/**
 * Genera la expresión de x como raíz (solución de la ecuación cuadrática)
 * Para ax² + bx + c = 0: x = (-b ± √Δ) / (2a)
 */
export function formatearSolucionComoRaiz(a, b, c, delta) {
  if (a === 0) return 'No es cuadrático'

  // x = (-b ± √Δ) / (2a)
  const numerador = b === 0 ? `\\sqrt{${delta}}` : `${-b} \\pm \\sqrt{${delta}}`
  const denominador = 2 * a

  return `x = \\frac{${numerador}}{${denominador}}`
}

// ============================================================
// 8. CONSTRUCCIÓN DE PASOS PARA UI
// ============================================================

/**
 * Construye la información de pasos para renderizar en la UI
 */
function construirPasosParaUI(datos) {
  const {
    preperiod,
    period,
    matrix_T,
    matrix_P,
    equation_y,
    equation_x_raw,
    equation_x,
    normalization_factor,
    relacion,
    validation,
    notacion,
    solucionComoRaiz
  } = datos

  const [[A, B], [C, D]] = matrix_T
  const [[E, F], [G, H]] = matrix_P

  return [
    {
      numero: 1,
      titulo: 'Matrices del período',
      descripcion: 'Construir M(aᵢ) para cada coeficiente del período',
      matrices: period.map((coef) => ({
        coef,
        matriz: matrizM(coef)
      }))
    },
    {
      numero: 2,
      titulo: 'Producto de matrices (Matriz T)',
      descripcion: 'T = M(aₖ) · M(aₖ₊₁) · ... · M(aₙ)',
      matriz: matrix_T,
      componentes: { A, B, C, D }
    },
    {
      numero: 3,
      titulo: 'Ecuación en y',
      descripcion: 'Cy² + (D-A)y - B = 0',
      ecuacion: equation_y,
      latex: `${C}y^{2} + ${equation_y.b}y + (${equation_y.c}) = 0`
    },
    {
      numero: 4,
      titulo: 'Matriz del preperíodo (P)',
      descripcion:
        preperiod.length === 0
          ? 'Preperíodo vacío, P = I (identidad)'
          : 'P = M(a₀) · M(a₁) · ... · M(aₖ₋₁)',
      matriz: matrix_P,
      es_identidad: preperiod.length === 0
    },
    {
      numero: 5,
      titulo: 'Relación x ↔ y',
      descripcion: 'x en función de y según P',
      relacion: {
        x_en_y: `x = (${E}y + ${F}) / (${G}y + ${H})`,
        y_en_x: `y = (${H}x - ${F}) / (${E} - ${G}x)`
      },
      coeficientes: { E, F, G, H }
    },
    {
      numero: 6,
      titulo: 'Sustitución',
      descripcion: 'Sustituir y en la ecuación cuadrática',
      sustitucion: `y = (${H}x - ${F}) / (${E} - ${G}x)`
    },
    {
      numero: 7,
      titulo: 'Expansión',
      descripcion: 'Expandir y simplificar términos',
      expansion: `${C}(${H}x - ${F})^{2} + ${equation_y.b}(${H}x - ${F})(${E} - ${G}x) + ${equation_y.c}(${E} - ${G}x)^{2} = 0`,
      ecuacion_expandida: equation_x_raw
    },
    {
      numero: 8,
      titulo: 'Normalización',
      descripcion: 'Dividir por MCD y hacer a > 0',
      ecuacion_raw: equation_x_raw,
      normalization_factor,
      ecuacion_final: equation_x,
      discriminant: validation.discriminant,
      raiz_positiva: validation.raizPositiva,
      solucion_como_raiz: solucionComoRaiz
    }
  ]
}

export default {
  parsearFCPeriodica,
  matrizM,
  matrizIdentidad,
  multiplicarMatrices,
  productoMatrices,
  construirMatrizPeriodo,
  ecuacionCuadraticaDesdeT,
  construirMatrizPreperiodo,
  relacionXyDesdeP,
  sustituirYenCuadratica,
  normalizarEcuacion,
  validarResultado,
  procesarFCPeriodica,
  formatearPolinomio
}

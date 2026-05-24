// Small gcd util (local fallback)
function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  if (a === 0) return b
  if (b === 0) return a
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

function gcd3(a, b, c) {
  return gcd(gcd(a, b), c)
}

// Extrae el mayor cuadrado perfecto divisor de n
export function simplificarRadical(n) {
  if (n <= 0) return { coef: 0, rad: 0 }
  let factor = 1
  let rest = n
  for (let k = Math.floor(Math.sqrt(n)); k >= 2; k--) {
    const sq = k * k
    if (n % sq === 0) {
      factor = k
      rest = n / sq
      return { coef: factor, rad: rest }
    }
  }
  return { coef: 1, rad: n }
}

// Reduce p + q*sqrt(r) sobre d: divide por gcd(p,q,d)
function reducirSurd(p, q, d) {
  const g = gcd3(p, q, d)
  return { p: p / g, q: q / g, d: d / g }
}

// Formatea una fracción (p + q sqrt(r)) / d en LaTeX
export function latexSurd(p, q, r, d) {
  let numer = ''
  numer += p !== 0 ? `${p}` : '0'
  if (q !== 0) {
    const sign = q > 0 ? ' + ' : ' - '
    numer += `${sign}${Math.abs(q)}\\sqrt{${r}}`
  }
  if (d === 1) return numer
  return `\\frac{${numer}}{${d}}`
}

// Dado ax^2 + bx + c = 0, devuelve la raíz positiva simplificada en forma (p + q sqrt(r)) / d
export function raizPositivaSimplificadaFromQuadratic(a, b, c) {
  const delta = b * b - 4 * a * c
  if (delta < 0) return null
  const { coef, rad } = simplificarRadical(delta)
  // sqrt(delta) = coef * sqrt(rad)
  const numerP = -b
  const numerQ = coef
  const den = 2 * a
  const reduced = reducirSurd(numerP, numerQ, den)
  // Asegurarse de que el rad no sea 1 (entonces numerQ*sqrt(1) se combina)
  const r = rad === 1 ? 1 : rad
  return { p: reduced.p, q: reduced.q, r, d: reduced.d, delta, coef }
}

// Construye los 8 pasos en papel usando información del parseo y resultado matricial
export function construirPasosPapel(parsed, result) {
  const { preperiod, period, continued_fraction } = parsed
  const { equation_y, equation_x, relation = null } = result

  const pasos = []

  // Paso 1: Interpretación
  pasos.push({
    numero: 1,
    titulo: 'Interpretación del input',
    lineasLatex: [
      `\\text{Notación: }${continued_fraction}`,
      `\\displaystyle x = ${construirLatexFraccionContinua(preperiod, period)}`
    ],
    destacado: false
  })

  // Paso 2: Período
  pasos.push({
    numero: 2,
    titulo: 'Período',
    lineasLatex: [
      `\\displaystyle y = ${construirLatexFraccionContinua([], period)}`
    ],
    destacado: false
  })

  // Paso 3: Resolviendo el período → ecuación en y
  pasos.push({
    numero: 3,
    titulo: 'Resolviendo el período',
    lineasLatex: [
      `\\text{Ecuación en }y:\; ${equation_y.a}y^{2} + ${equation_y.b}y + ${equation_y.c} = 0`
    ],
    destacado: false
  })

  // Paso 4: Raíz positiva de y
  const deltaY = equation_y.b * equation_y.b - 4 * equation_y.a * equation_y.c
  const simpY = simplificarRadical(Math.max(0, deltaY))
  const sqrtY = simpY.coef === 1 && simpY.rad === deltaY ? `\\sqrt{${deltaY}}` : `${simpY.coef}\\sqrt{${simpY.rad}}`
  const denY = 2 * equation_y.a
  const yLatex = `\\displaystyle y = \\frac{${-equation_y.b} + ${sqrtY}}{${denY}}` // positiva
  pasos.push({
    numero: 4,
    titulo: 'Cuadrática en y',
    lineasLatex: [
      `\\text{Discriminante }\\Delta = ${deltaY}`,
      yLatex
    ],
    destacado: false
  })

  // Paso 5: x en términos de y (relación desde P)
  // relation may be in result.relacion
  let relacionLatex = ''
  if (result && result.relacion) {
    const { E, F, G, H } = result.relacion
    relacionLatex = `\\displaystyle x = \\frac{${E}y + ${F}}{${G}y + ${H}}`
  } else {
    relacionLatex = '\\text{Relación }x\\text{ en términos de }y disponible en P.'
  }
  pasos.push({ numero: 5, titulo: 'Reescribiendo x en términos de y', lineasLatex: [relacionLatex], destacado: false })

  // Paso 6: Sustituyendo y en x (literal)
  pasos.push({ numero: 6, titulo: 'Reemplazando y en x', lineasLatex: ['\\text{Sustituir la raíz positiva de }y\\text{ en la relación de }x.'], destacado: false })

  // Paso 7: Racionalización y simplificación — calcular raíz positiva de equation_x
  const rx = raizPositivaSimplificadaFromQuadratic(equation_x.a, equation_x.b, equation_x.c)
  let solSimplLatex = ''
  if (rx) {
    const { p, q, r, d } = rx
    const latex = latexSurd(p, q, r, d)
    solSimplLatex = `\\displaystyle x = ${latex}`
  } else {
    solSimplLatex = '\\text{No hay raíz real positiva simplificable}'
  }
  pasos.push({ numero: 7, titulo: 'Racionalización', lineasLatex: ['\\text{Multiplicar por el conjugado y simplificar.}', solSimplLatex], destacado: true })

  // Paso 8: Polinomio mínimo de x
  pasos.push({ numero: 8, titulo: 'Polinomio mínimo de x', lineasLatex: [`\\text{Ecuación normalizada en }x: ${equation_x.a}x^{2} ${equation_x.b >= 0 ? '+' : '-'} ${Math.abs(equation_x.b)}x ${equation_x.c >= 0 ? '+' : '-'} ${Math.abs(equation_x.c)} = 0`], destacado: true })

  return pasos
}

function construirLatexFraccionContinua(pre, per) {
  // simple rendering: [a0; a1, a2, \overline{...}]
  if (!pre || pre.length === 0) {
    return `\\left[\\overline{${per.join(', ')}}\\right]`
  }
  if (pre.length === 1) {
    return `\\left[${pre[0]};\\overline{${per.join(', ')}}\\right]`
  }
  const a0 = pre[0]
  const rest = pre.slice(1).join(', ')
  return `\\left[${a0};${rest},\\overline{${per.join(', ')}}\\right]`
}

export default {
  simplificarRadical,
  latexSurd,
  raizPositivaSimplificadaFromQuadratic,
  construirPasosPapel
}

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

// ============================================================
// RADICALES Y FRACCIONES
// ============================================================

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

function reducirSurd(p, q, d) {
  const g = gcd3(p, q, d)
  return { p: p / g, q: q / g, d: d / g }
}

export function latexSurd(p, q, r, d) {
  let numer = ''
  if (p !== 0 || q === 0) numer += p !== 0 ? `${p}` : '0'
  if (q !== 0) {
    const sign = q > 0 ? ' + ' : ' - '
    numer += `${sign}${Math.abs(q)}\\sqrt{${r}}`
  }
  if (d === 1) return numer
  return `\\frac{${numer}}{${d}}`
}

export function raizPositivaSimplificadaFromQuadratic(a, b, c) {
  const delta = b * b - 4 * a * c
  if (delta < 0) return null
  const { coef, rad } = simplificarRadical(delta)
  const numerP = -b
  const numerQ = coef
  const den = 2 * a
  const reduced = reducirSurd(numerP, numerQ, den)
  const r = rad === 1 ? 1 : rad
  return { p: reduced.p, q: reduced.q, r, d: reduced.d, delta, coef, rad }
}

// ============================================================
// FRACCIONES CONTINUAS — HELPERS LaTeX
// ============================================================

// Genera [a0; a1, a2, ..., \overline{p1, p2, ...}]
function latexBracket(preperiod, period) {
  if (!preperiod || preperiod.length === 0) {
    return `\\left[\\overline{${period.join(', ')}}\\right]`
  }
  if (preperiod.length === 1) {
    return `\\left[${preperiod[0]};\\overline{${period.join(', ')}}\\right]`
  }
  const a0 = preperiod[0]
  const rest = preperiod.slice(1).join(', ')
  return `\\left[${a0};${rest},\\overline{${period.join(', ')}}\\right]`
}

// Genera: a0 + \cfrac{1}{a1 + \cfrac{1}{a2 + ...
function latexFCCfrac(coefs) {
  if (!coefs || coefs.length === 0) return '0'
  if (coefs.length === 1) return `${coefs[0]}`
  let result = `${coefs[coefs.length - 1]}`
  for (let i = coefs.length - 2; i >= 0; i--) {
    result = `${coefs[i]} + \\cfrac{1}{${result}}`
  }
  return result
}

// Genera: a0 + \cfrac{1}{a1 + \cfrac{1}{a2 + \cfrac{1}{y}}}
function latexFCConY(preCoefs) {
  if (!preCoefs || preCoefs.length === 0) return 'y'
  let result = 'y'
  for (let i = preCoefs.length - 1; i >= 0; i--) {
    result = `${preCoefs[i]} + \\cfrac{1}{${result}}`
  }
  return result
}

// Genera: p1 + \cfrac{1}{p2 + \cfrac{1}{\cdots + \cfrac{1}{y}}}
function latexFCPeriodoConY(periodCoefs) {
  if (!periodCoefs || periodCoefs.length === 0) return 'y'
  let result = 'y'
  for (let i = periodCoefs.length - 1; i >= 0; i--) {
    result = `${periodCoefs[i]} + \\cfrac{1}{${result}}`
  }
  return result
}

// ============================================================
// DESARROLLO ALGEBRAICO DEL PERÍODO
// ============================================================

// Para período [p1, p2, ..., pn], genera pasos algebraicos
function desarrolloAlgebraicoY(period, eqY) {
  const lines = []
  
  // Paso 1: FC del período
  if (period.length === 1) {
    lines.push(`y = ${period[0]} + \\cfrac{1}{y}`)
  } else {
    lines.push(`y = ${latexFCPeriodoConY(period)}`)
  }

  // Para período simple [p1, p2]:
  if (period.length === 2) {
    const p1 = period[0]
    const p2 = period[1]
    
    // Paso: invertir desde dentro
    lines.push(`\\displaystyle ${p2} + \\cfrac{1}{y} = \\frac{${p2}y + 1}{y}`)
    
    // Paso: numerador completo
    lines.push(`\\displaystyle y = ${p1} + \\cfrac{y}{${p2}y + 1} = \\frac{${p1}(${p2}y+1) + y}{${p2}y+1}`)
    
    // Simplificar: numerador = (p1*p2 + 1) * y + p1
    const sumCoef = p1 * p2 + 1
    const constCoef = p1
    lines.push(`\\displaystyle y = \\frac{${sumCoef}y + ${constCoef}}{${p2}y + 1}`)
    
    // Producto cruzado
    lines.push(`\\displaystyle y(${p2}y + 1) = ${sumCoef}y + ${constCoef}`)
    
    // Expansión
    lines.push(`\\displaystyle ${p2}y^{2} + y = ${sumCoef}y + ${constCoef}`)
    
    // Simplificar a forma estándar
    const coefB = 1 - sumCoef
    lines.push(`\\displaystyle ${p2}y^{2} + ${coefB}y - ${constCoef} = 0`)
  } else if (period.length === 1) {
    // Para período [p]:
    lines.push(`y = ${period[0]} + \\cfrac{1}{y}`)
    lines.push(`y^{2} - ${period[0]}y - 1 = 0`)
  } else {
    // Período general
    lines.push(`\\text{(Patrón: desarrollar FC de forma similar)}`)
    lines.push(`\\text{Resultado final: }${eqY.a}y^{2} + ${eqY.b}y + ${eqY.c} = 0`)
  }

  return lines
}

// ============================================================
// CONSTRUCCIÓN DE 8 PASOS
// ============================================================

export function construirPasosPapel(parsed, result) {
  const { preperiod, period, continued_fraction } = parsed
  const { equation_y, equation_x } = result

  const pasos = []

  // PASO 1: Interpretación inicial
  {
    const lineas = []
    lineas.push(`x = ${continued_fraction}`)
    
    // FC anidada
    const allCoefs = [...preperiod, ...period]
    if (allCoefs.length > 0) {
      lineas.push(`\\displaystyle x = ${latexFCCfrac(allCoefs.slice(0, Math.min(4, allCoefs.length)))}\\cdots`)
    }
    
    pasos.push({
      numero: 1,
      titulo: 'Interpretación del input',
      lineasLatex: lineas,
      destacado: false
    })
  }

  // PASO 2: Definición del período
  {
    const lineas = []
    lineas.push(`y = ${latexFCPeriodoConY(period)}`)
    
    if (preperiod.length > 0) {
      lineas.push(`x = ${latexFCConY(preperiod)}`)
    } else {
      lineas.push(`x = y \\quad\\text{(sin preperíodo)}`)
    }
    
    pasos.push({
      numero: 2,
      titulo: 'Período',
      lineasLatex: lineas,
      destacado: false
    })
  }

  // PASO 3: Resolviendo el período
  {
    const lineas = desarrolloAlgebraicoY(period, equation_y)
    pasos.push({
      numero: 3,
      titulo: 'Resolviendo el período',
      lineasLatex: lineas,
      destacado: false
    })
  }

  // PASO 4: Ecuación cuadrática en y con discriminante simplificado
  {
    const lineas = []
    lineas.push(`a = ${equation_y.a}, \\quad b = ${equation_y.b}, \\quad c = ${equation_y.c}`)
    lineas.push(`\\displaystyle y = \\frac{-${equation_y.b} \\pm \\sqrt{(${equation_y.b})^{2} - 4(${equation_y.a})(${equation_y.c})}}{2(${equation_y.a})}`)

    const delta = equation_y.b * equation_y.b - 4 * equation_y.a * equation_y.c
    lineas.push(`\\displaystyle y = \\frac{${-equation_y.b} \\pm \\sqrt{${delta}}}{${2 * equation_y.a}}`)

    const simp = simplificarRadical(delta)
    if (simp.coef !== 1) {
      lineas.push(`\\sqrt{${delta}} = ${simp.coef}\\sqrt{${simp.rad}}`)
    }
    const sqrtForm = simp.coef === 1 ? `\\sqrt{${delta}}` : `${simp.coef}\\sqrt{${simp.rad}}`
    lineas.push(`\\displaystyle y = \\frac{${-equation_y.b} \\pm ${sqrtForm}}{${2 * equation_y.a}}`)

    // Simplificar fracciones
    const g = gcd3(Math.abs(-equation_y.b), simp.coef, 2 * equation_y.a)
    if (g > 1) {
      lineas.push(`\\displaystyle y = \\frac{${(-equation_y.b) / g} \\pm ${simp.coef / g}\\sqrt{${simp.rad}}}{${(2 * equation_y.a) / g}}`)
    }

    lineas.push(`\\text{Raíz positiva:} \\quad y = \\frac{${-equation_y.b} + ${simp.coef}\\sqrt{${simp.rad}}}{${2 * equation_y.a}}`)

    pasos.push({
      numero: 4,
      titulo: 'Cuadrática en y',
      lineasLatex: lineas,
      destacado: false
    })
  }

  // PASO 5: Reescribiendo x en términos de y
  {
    const lineas = []
    if (preperiod.length > 0) {
      lineas.push(`x = ${latexFCConY(preperiod)}`)
    } else {
      lineas.push(`x = y`)
    }
    
    pasos.push({
      numero: 5,
      titulo: 'Reescribiendo x en términos de y',
      lineasLatex: lineas,
      destacado: false
    })
  }

  // PASO 6: Sustitución de y en x
  {
    const lineas = []
    
    const ry = raizPositivaSimplificadaFromQuadratic(equation_y.a, equation_y.b, equation_y.c)
    if (ry) {
      const yLatex = latexSurd(ry.p, ry.q, ry.r, ry.d)
      lineas.push(`y = ${yLatex}`)
    }
    
    if (preperiod.length > 0) {
      lineas.push(`x = ${latexFCConY(preperiod)}`)
      lineas.push(`\\text{Sustituir } y \\text{ en cada nivel de la fracción continua.}`)
    } else {
      lineas.push(`x = y = ${latexSurd(ry.p, ry.q, ry.r, ry.d)}`)
    }
    
    pasos.push({
      numero: 6,
      titulo: 'Reemplazando y en x',
      lineasLatex: lineas,
      destacado: false
    })
  }

  // PASO 7: Racionalización y resultado simplificado
  {
    const lineas = []
    
    const rx = raizPositivaSimplificadaFromQuadratic(equation_x.a, equation_x.b, equation_x.c)
    if (rx && rx.d > 1 && rx.q !== 0) {
      // Pasos de racionalización
      const conjugNum = `${rx.p} - ${rx.q}\\sqrt{${rx.r}}`
      lineas.push(`\\displaystyle \\frac{${rx.p} + ${rx.q}\\sqrt{${rx.r}}}{${rx.d}} \\cdot \\frac{${conjugNum}}{${conjugNum}}`)

      // Numerador
      const numResult = rx.p * rx.p - rx.q * rx.q * rx.r
      lineas.push(`\\text{Numerador: } ${numResult}`)

      // Denominador
      lineas.push(`\\text{Denominador: } ${rx.d}(${rx.p} - ${rx.q}\\sqrt{${rx.r}}) = ${rx.d * rx.p} - ${rx.d * rx.q}\\sqrt{${rx.r}}`)
    }
    
    if (rx) {
      lineas.push(`\\boxed{x = ${latexSurd(rx.p, rx.q, rx.r, rx.d)}}`)
    }
    
    pasos.push({
      numero: 7,
      titulo: 'Racionalización',
      lineasLatex: lineas,
      destacado: true
    })
  }

  // PASO 8: Polinomio mínimo de x
  {
    const lineas = []
    
    const rx = raizPositivaSimplificadaFromQuadratic(equation_x.a, equation_x.b, equation_x.c)
    if (rx) {
      lineas.push(`x = ${latexSurd(rx.p, rx.q, rx.r, rx.d)}`)
      
      // Despejando
      if (rx.d !== 1) {
        lineas.push(`${rx.d}x = ${rx.p} + ${rx.q}\\sqrt{${rx.r}}`)
        lineas.push(`${rx.d}x - ${rx.p} = ${rx.q}\\sqrt{${rx.r}}`)
      }
      
      // Elevar al cuadrado
      const lhsCoef = rx.d
      const lhsConst = -rx.p
      lineas.push(`(${lhsCoef}x + (${lhsConst}))^{2} = (${rx.q}\\sqrt{${rx.r}})^{2}`)
      lineas.push(`${lhsCoef}^2 x^2 + 2(${lhsCoef})(${lhsConst})x + ${lhsConst}^2 = ${rx.q * rx.q * rx.r}`)
      
      const a2 = lhsCoef * lhsCoef
      const b2 = 2 * lhsCoef * lhsConst
      const c2 = lhsConst * lhsConst - rx.q * rx.q * rx.r
      lineas.push(`${a2}x^2 + ${b2}x + ${c2} = 0`)
      
      // Normalizar
      const g = gcd3(a2, b2, c2)
      if (g > 1) {
        lineas.push(`\\frac{1}{${g}}(${a2}x^2 + ${b2}x + ${c2}) = 0`)
      }
      lineas.push(`\\boxed{${equation_x.a}x^2 + ${equation_x.b}x + ${equation_x.c} = 0}`)
    }
    
    pasos.push({
      numero: 8,
      titulo: 'Polinomio mínimo de x',
      lineasLatex: lineas,
      destacado: true
    })
  }

  return pasos
}

export default {
  simplificarRadical,
  latexSurd,
  raizPositivaSimplificadaFromQuadratic,
  construirPasosPapel
}

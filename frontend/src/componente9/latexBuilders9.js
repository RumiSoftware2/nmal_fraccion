// latexBuilders9.js
// Generadores de strings LaTeX para fracciones continuas generalizadas

export function buildLatexExpandida(filas) {
  if (!filas || filas.length === 0) return '0'
  const n = filas.length - 1
  if (n === 0) return `${filas[0].a}`

  function buildInner(i) {
    const ai = filas[i].a
    if (i === n) {
      // último nivel: a_n / b_{n-1}
      return `\\cfrac{${ai}}{${filas[i - 1].b}}`
    }
    // b_{i-1} + next
    return `\\cfrac{${ai}}{${filas[i - 1].b} + ${buildInner(i + 1)}}`
  }

  const a0 = filas[0].a
  return `${a0} + ${buildInner(1)}`
}

export function buildLatexPares(filas) {
  if (!filas || filas.length === 0) return ''
  return filas.map((r, i) => `(${r.a},${r.b})`).join('\\;')
}

export function buildLatexReductaAnidada(filas, k) {
  if (!filas || k < 0) return ''
  const sub = filas.slice(0, k + 1)
  return buildLatexExpandida(sub)
}

export function buildPasosDesarrollo(filas, k, { p, q, decimal } = {}) {
  const lines = []
  const pre = filas.slice(0, k + 1)
  lines.push(`\\displaystyle R_{${k}} = ${buildLatexPares(pre)}`)
  lines.push(`\\displaystyle R_{${k}} = ${buildLatexExpandida(pre)}`)
  if (typeof p === 'number' && typeof q === 'number') {
    lines.push(`\\displaystyle R_{${k}} = \\frac{${p}}{${q}}`)
    if (typeof decimal === 'number') lines.push(`\\displaystyle R_{${k}} \\approx ${decimal}`)
  }
  return lines
}

export default {
  buildLatexExpandida,
  buildLatexPares,
  buildLatexReductaAnidada,
  buildPasosDesarrollo
}

// cerebro9.js
// Lógica para Reductas de Fracciones Continuas Generalizadas Finitas

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

function gcd2(a, b) {
  return gcd(a, b)
}

export function validarEntrada(filas) {
  if (!Array.isArray(filas)) return { ok: false, error: 'Formato interno inválido' }
  if (filas.length === 0) return { ok: false, error: 'Se requieren al menos 1 nivel (a_0)' }

  for (let i = 0; i < filas.length; i++) {
    const row = filas[i]
    const ai = Number(row.a)
    const bi = Number(row.b)
    if (!Number.isFinite(ai) || !Number.isInteger(ai)) return { ok: false, error: `a_${i} inválido` }
    if (!Number.isFinite(bi) || !Number.isInteger(bi)) return { ok: false, error: `b_${i} inválido` }
    // b_i can be 0 only if it's the last row's b_n (not used) — but to be safe require b_i !== 0 for i < n
    if (i < filas.length - 1 && bi === 0) return { ok: false, error: `b_${i} no puede ser 0 (nivel ${i})` }
  }

  return { ok: true }
}

// Recurrencia: P_{-2}=0, P_{-1}=1, P_0=a0
// Q_{-2}=1, Q_{-1}=0, Q_0=1
// Para n>=1: P_n = b_{n-1} P_{n-1} + a_n P_{n-2}
//           Q_n = b_{n-1} Q_{n-1} + a_n Q_{n-2}
export function calcularReductasGeneralizadas(filas) {
  const n = filas.length - 1

  const P = []
  const Q = []

  // Iniciales extendidos
  const Pm2 = 0
  const Pm1 = 1
  const Qm2 = 1
  const Qm1 = 0

  // P0, Q0
  const a0 = Number(filas[0].a)
  P[0] = a0
  Q[0] = 1

  // Si solo hay nivel 0, devolver
  for (let k = 1; k <= n; k++) {
    const ak = Number(filas[k].a)
    const bkm1 = Number(filas[k - 1].b)

    const Pk = bkm1 * P[k - 1] + ak * (k - 2 >= -1 ? (k - 2 === -1 ? Pm1 : P[k - 2]) : Pm2)
    const Qk = bkm1 * Q[k - 1] + ak * (k - 2 >= -1 ? (k - 2 === -1 ? Qm1 : Q[k - 2]) : Qm2)

    P[k] = Pk
    Q[k] = Qk
  }

  // Construir array de reductas
  const reductas = []
  for (let k = 0; k <= n; k++) {
    const pRaw = P[k]
    const qRaw = Q[k]
    const g = gcd2(pRaw, qRaw) || 1
    const p = Math.round(pRaw / g)
    const q = Math.round(qRaw / g)
    const decimal = q === 0 ? null : (p / q)
    reductas.push({ k, P: pRaw, Q: qRaw, p, q, decimal })
  }

  return { ok: true, n, reductas }
}

export function simplificarFraccion(p, q) {
  if (q === 0) return { p, q }
  const g = gcd2(p, q) || 1
  return { p: Math.round(p / g), q: Math.round(q / g) }
}

import { buildLatexExpandida, buildLatexPares, buildPasosDesarrollo } from './latexBuilders9.js'

export function latexParesMatriciales(filas) {
  return filas.map((r) => `(${r.a},${r.b})`).join(' ')
}

export function generarDesarrolloReducta(filas, k) {
  // Genera líneas LaTeX simples que muestren la anidación hasta k
  if (!filas || k < 0 || k >= filas.length) return []
  const rec = calcularReductasGeneralizadas(filas.slice(0, k + 1))
  const last = rec.ok ? rec.reductas[rec.reductas.length - 1] : {}
  return buildPasosDesarrollo(filas, k, { p: last.p, q: last.q, decimal: last.decimal })
}

export function procesarFCGeneralizada(filasRaw) {
  // filasRaw: [{ a: string|number, b: string|number }, ...]
  const filas = filasRaw.map((r) => ({ a: Number(r.a), b: Number(r.b) }))
  const v = validarEntrada(filas)
  if (!v.ok) return v

  const calc = calcularReductasGeneralizadas(filas)
  if (!calc.ok) return calc

  const reductasUI = calc.reductas.map((r) => ({
    k: r.k,
    p: r.p,
    q: r.q,
    decimal: r.decimal,
    latexAnidada: buildLatexExpandida(filas.slice(0, r.k + 1)),
    lineasLatex: generarDesarrolloReducta(filas, r.k)
  }))

  return {
    ok: true,
    n: calc.n,
    filas,
    reductas: reductasUI,
    latexExpandida: buildLatexExpandida(filas),
    latexPares: buildLatexPares(filas),
    notacion: filas.map((r) => `(${r.a},${r.b})`).join(',')
  }
}

export default {
  validarEntrada,
  calcularReductasGeneralizadas,
  simplificarFraccion,
  buildLatexExpandida,
  buildLatexPares,
  generarDesarrolloReducta,
  procesarFCGeneralizada
}

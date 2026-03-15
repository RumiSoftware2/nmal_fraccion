import { motion } from 'framer-motion'
import 'katex/dist/katex.min.css'
import katex from 'katex'

const BlockMath = ({ math }) => {
  const html = katex.renderToString(math, { throwOnError: false, displayMode: true })
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

// Convierte dígito numérico → carácter (base > 10 usa A,B,C...)
const dChar = (d) => d < 10 ? String(d) : String.fromCharCode(55 + d)

// Resta en base `base`, de derecha a izquierda, retorna dígitos y borrows
function restaEnBase(aStr, bStr, base) {
  const len = Math.max(aStr.length, bStr.length)
  const a = aStr.padStart(len, '0').split('').map(d => parseInt(d, base))
  const b = bStr.padStart(len, '0').split('').map(d => parseInt(d, base))

  const result = []
  const borrow = new Array(len).fill(0) // borrow[i]=1 → columna i pidió prestado
  let carry = 0

  for (let i = len - 1; i >= 0; i--) {
    let diff = a[i] - b[i] - carry
    if (diff < 0) {
      diff += base
      borrow[i] = 1
      carry = 1
    } else {
      carry = 0
    }
    result[i] = diff
  }
  return { len, a, b, result, borrow }
}

// Arma el LaTeX de la resta en columnas estilo manual
function latexRestaColumnas(aStr, bStr, base) {
  const { len, a, b, result, borrow } = restaEnBase(aStr, bStr, base)
  const hasBorrow = borrow.some(v => v === 1)

  // Fila de minuendo con tachado+préstamo donde corresponde
  // Si columna i tiene borrow[i]=1, el dígito a[i] se muestra tachado y reducido
  const aRow = a.map((d, i) =>
    borrow[i] === 1
      ? `\\overset{\\scriptscriptstyle ${dChar(d - 1)}}{\\cancel{${dChar(d)}}}`
      : dChar(d)
  ).join(' & ')

  // Fila del sustraendo (con signo - solo al inicio)
  const bRow = b.map(dChar)
  const bLatex = bRow[0] + (bRow.length > 1 ? ' & ' + bRow.slice(1).join(' & ') : '')

  // Fila resultado
  const rRow = result.map(dChar).join(' & ')

  const colSpec = Array(len).fill('r').join('')

  return `
\\begin{array}{${colSpec}}
${aRow} \\\\
\\mathbf{-}\\, ${bLatex} \\\\
\\hline
${rRow}
\\end{array}
`
}

export default function Paso1Illustration({ input }) {
  const { entero, no_periodo, periodo, base } = input
  const m = no_periodo.length
  const n = periodo.length

  const xString = `${entero}${no_periodo ? '.' + no_periodo : ''}${periodo ? `(${periodo})` : ''}`

  const fullDigits  = `${entero}${no_periodo}${periodo}`
  const beforeDigits = `${entero}${no_periodo}`

  const fullValue10  = parseInt(fullDigits,  base)
  const beforeValue10 = parseInt(beforeDigits, base)
  const diffValue10  = fullValue10 - beforeValue10
  const diffInBase   = diffValue10.toString(base).toUpperCase()

  const latexX          = `x = ${entero}${no_periodo ? `.${no_periodo}` : ''}${periodo ? `\\overline{${periodo}}` : ''}`
  const latexAllDigits  = `${base}^{${m + n}} \\cdot x = ${fullDigits}_{${base}}`
  const latexBefore     = `${base}^{${m}} \\cdot x = ${beforeDigits}_{${base}}`
  const latexEcuacion   = `(${base}^{${m+n}} - ${base}^{${m}})\\,x = ${fullDigits}_{${base}} - ${beforeDigits}_{${base}}`
  const latexRestaB     = latexRestaColumnas(fullDigits, beforeDigits, base)
  const latexResultado  = `${fullDigits}_{${base}} - ${beforeDigits}_{${base}} = ${diffInBase}_{${base}} \\;=\\; ${diffValue10}_{10}`

  return (
    <motion.div
      className="math-step-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <h3>Paso 1: multiplicación en base {base} y resta</h3>

      <p>Definimos:</p>
      <BlockMath math={latexX} />

      <p>Multiplicamos para capturar todos los dígitos incluyendo el periodo:</p>
      <BlockMath math={latexAllDigits} />

      <p>Multiplicamos para capturar solo los dígitos antes del periodo (m = {m}):</p>
      <BlockMath math={latexBefore} />

      <p>Restamos para eliminar la parte periódica:</p>
      <BlockMath math={latexEcuacion} />

      <p>
        Operación columna por columna <strong>en base {base}</strong>{' '}
        (dígito tachado = se pidió prestado de la columna anterior):
      </p>
      <BlockMath math={latexRestaB} />

      <p>Resultado:</p>
      <BlockMath math={latexResultado} />

      <p>
        Número: <strong>{xString}</strong> (base {base})
      </p>
    </motion.div>
  )
}
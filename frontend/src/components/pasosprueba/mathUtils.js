// Convierte dígito numérico → carácter (base > 10 usa A,B,C...)
export const dChar = (d) => d < 10 ? String(d) : String.fromCharCode(55 + d)

// Resta en base `base`, de derecha a izquierda, retorna dígitos y borrows
export function restaEnBase(aStr, bStr, base) {
  const len = Math.max(aStr.length, bStr.length)
  const a = aStr.padStart(len, '0').split('').map(d => parseInt(d, base))
  const b = bStr.padStart(len, '0').split('').map(d => parseInt(d, base))

  const result = []
  const borrow = new Array(len).fill(0)
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
export function latexRestaColumnas(aStr, bStr, base) {
  const { len, a, b, result, borrow } = restaEnBase(aStr, bStr, base)

  const aRow = a.map((d, i) =>
    borrow[i] === 1
      ? `\\overset{\\scriptscriptstyle ${dChar(d - 1)}}{\\cancel{${dChar(d)}}}`
      : dChar(d)
  ).join(' & ')

  const bRow = b.map(dChar)
  const bLatex = bRow[0] + (bRow.length > 1 ? ' & ' + bRow.slice(1).join(' & ') : '')

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

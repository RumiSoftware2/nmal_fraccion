import { useMemo } from 'react'
import { motion } from 'framer-motion'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import '../componentes2Styles/PasosResta.css'

const BlockMath = ({ math }) => {
  const html = katex.renderToString(math, { throwOnError: false, displayMode: true })
  return <div className="katex-block" dangerouslySetInnerHTML={{ __html: html }} />
}

const InlineMath = ({ math }) => {
  const html = katex.renderToString(math, { throwOnError: false, displayMode: false })
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

function toBase(num, base) {
  if (num === 0) return '0'
  let result = ''
  let n = Math.abs(num)
  while (n > 0) {
    const digit = n % base
    result = (digit < 10 ? String(digit) : String.fromCharCode(55 + digit)) + result
    n = Math.floor(n / base)
  }
  return (num < 0 ? '-' : '') + result
}

function generarPasosDivisionLatex(numeradorStr, denominadorStr, base, maxPasos = 8) {
  const num = parseInt(numeradorStr, base)
  const den = parseInt(denominadorStr, base)

  if (den === 0) return { latex: '\\text{División por cero}', parteEntera: '0', decimales: '' }

  const toB = (n) => {
    if (n === 0) return '0'
    return toBase(Math.abs(n), base).toUpperCase()
  }

  const leftCol = []
  const cocienteDigitos = []
  let tieneDecimales = false
  let residuo = Math.abs(num)

  const q0 = Math.floor(residuo / den)
  const producto0 = q0 * den
  const resto0 = residuo - producto0

  cocienteDigitos.push(toB(q0))
  leftCol.push({ dividendo: toB(residuo), sustraendo: toB(producto0), resto: toB(resto0) })

  residuo = resto0
  const residuosVistos = new Set()
  let pasoDiv = 0

  while (residuo !== 0 && pasoDiv < maxPasos) {
    if (residuosVistos.has(residuo)) break
    residuosVistos.add(residuo)
    tieneDecimales = true

    const dividendoAmpliado = residuo * base
    const q = Math.floor(dividendoAmpliado / den)
    const producto = q * den
    const nuevoResiduo = dividendoAmpliado - producto

    cocienteDigitos.push(toB(q))
    leftCol.push({
      dividendo: toB(residuo) + '0',
      sustraendo: toB(producto),
      resto: toB(nuevoResiduo)
    })

    residuo = nuevoResiduo
    pasoDiv++
  }

  const parteEntera = cocienteDigitos[0]
  const decimales = tieneDecimales ? cocienteDigitos.slice(1).join('') : ''
  const cocienteStr = parteEntera + (tieneDecimales ? '.' + decimales : '')

  let latex = `\\begin{array}{r|l}\n`
  leftCol.forEach((step, i) => {
    if (i === 0) {
      latex += `  ${step.dividendo} & \\overline{)\\,${toB(den)}_{(${base})}} \\\\[4pt]\n`
      latex += `  {-}\\;${step.sustraendo} & ${cocienteStr}_{(${base})} \\\\[2pt]\n`
      latex += `  \\hline\n`
    } else {
      latex += `  ${step.dividendo} & \\\\[2pt]\n`
      latex += `  {-}\\;${step.sustraendo} & \\\\[2pt]\n`
      latex += `  \\hline\n`
    }
    if (i === leftCol.length - 1) {
      latex += `  ${step.resto} & \\\\[2pt]\n`
    }
  })
  latex += `\\end{array}`

  return { latex, parteEntera, decimales }
}

// Genera el LaTeX de resta en columna alineando el punto decimal
function generarRestaColumnaLatex(aStr, bStr, base) {
  // Separar parte entera y decimal de cada número
  const [aInt, aDec = ''] = aStr.split('.')
  const [bInt, bDec = ''] = bStr.split('.')

  // Longitud máxima de decimales para alinear
  const maxDec = Math.max(aDec.length, bDec.length)

  // Rellenar con ceros a la derecha para igualar decimales
  let aDecPad = aDec.padEnd(maxDec, '0')
  let bDecPad = bDec.padEnd(maxDec, '0')

  // Longitud máxima de parte entera para alinear a la izquierda
  const maxInt = Math.max(aInt.length, bInt.length)
  let aIntPad = aInt.padStart(maxInt, '0')
  let bIntPad = bInt.padStart(maxInt, '0')

  // Calcular la resta en base dada (digit a digit con préstamo)
  let aFull = aIntPad + aDecPad   // string de dígitos sin punto
  let bFull = bIntPad + bDecPad

  let isNegative = false;
  let calcAFull = aFull;
  let calcBFull = bFull;

  if (calcAFull < calcBFull) {
    isNegative = true;
    let tempStr = calcAFull;
    calcAFull = calcBFull;
    calcBFull = tempStr;
  }

  const totalLen = calcAFull.length
  const borrows = new Array(totalLen + 1).fill(0)
  const resultDigits = new Array(totalLen).fill(0)

  for (let i = totalLen - 1; i >= 0; i--) {
    const da = parseInt(calcAFull[i], base)
    const db = parseInt(calcBFull[i], base)
    let diff = da - db - borrows[i + 1]
    
    if (diff < 0) {
      diff += base
      borrows[i] = 1
    }
    resultDigits[i] = diff
  }

  // Convertir dígitos resultado a strings en la base
  const toB = (d) => (d < 10 ? String(d) : String.fromCharCode(55 + d)).toUpperCase()

  // Remover ceros a la izquierda para el string resultado
  let resIntDigits = ''
  let startIdx = 0
  for (let i = 0; i < maxInt; i++) {
    if (resultDigits[i] !== 0 || startIdx > 0 || i === maxInt - 1) { // Mantener al menos un '0'
      resIntDigits += toB(resultDigits[i])
      startIdx = 1
    }
  }

  const resDecDigits = maxDec > 0 ? resultDigits.slice(maxInt).map(toB).join('') : ''

  const resultStr = (isNegative ? '-' : '') + resIntDigits + (resDecDigits ? '.' + resDecDigits : '')

  // Total de columnas necesarias
  const totalCols = maxInt + (maxDec > 0 ? 1 : 0) + maxDec
  const colSpec = 'r'.repeat(totalCols)

  const aCells = []
  for (let i = 0; i < maxInt; i++) {
    aCells.push(aIntPad[i].toUpperCase())
  }
  if (maxDec > 0) {
    aCells.push('.')
    for (const ch of aDecPad) {
      aCells.push(ch.toUpperCase())
    }
  }
  const aRow = aCells.join(' & ')

  const bCells = []
  for (let i = 0; i < maxInt; i++) {
    bCells.push(bIntPad[i].toUpperCase())
  }
  if (maxDec > 0) {
    bCells.push('.')
    for (const ch of bDecPad) {
      bCells.push(ch.toUpperCase())
    }
  }
  const bRow = bCells.join(' & ')

  const resCells = []
  let resStarted = false
  for (let i = 0; i < maxInt; i++) {
    if (resultDigits[i] !== 0 || resStarted || i === maxInt - 1) {
      let val = toB(resultDigits[i])
      if (!resStarted && isNegative) {
        val = `{-}${val}`
      }
      resCells.push(val)
      resStarted = true
    } else {
      resCells.push('')
    }
  }
  if (maxDec > 0) {
    resCells.push('.')
    for (let i = maxInt; i < totalLen; i++) {
      resCells.push(toB(resultDigits[i]))
    }
  }
  const resRow = resCells.join(' & ')

  let latex = `\\begin{array}{${colSpec}}
${aRow} \\\\
{-}\\;${bRow} \\\\
\\hline
${resRow}
\\end{array}`

  return { latex, resultStr }
}

export default function PasosResta({ frac1, frac2, base }) {
  const baseNum = parseInt(base)

  const div1 = useMemo(
    () => generarPasosDivisionLatex(frac1.numerador, frac1.denominador, baseNum),
    [frac1.numerador, frac1.denominador, baseNum]
  )

  const div2 = useMemo(
    () => generarPasosDivisionLatex(frac2.numerador, frac2.denominador, baseNum),
    [frac2.numerador, frac2.denominador, baseNum]
  )

  const numDecFrac1 = `${div1.parteEntera}${div1.decimales ? '.' + div1.decimales : ''}`
  const numDecFrac2 = `${div2.parteEntera}${div2.decimales ? '.' + div2.decimales : ''}`

  const { latex: restaColumnaLatex, resultStr: resultadoResta } = useMemo(
    () => generarRestaColumnaLatex(numDecFrac1, numDecFrac2, baseNum),
    [numDecFrac1, numDecFrac2, baseNum]
  )

  return (
    <motion.div
      className="pasos-resta"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h4>📋 Pasos de la Resta en Base {base}</h4>

      {/* PASO 1 */}
      <div className="paso-card">
        <div className="paso-numero-badge">1</div>
        <h5>Fracciones a restar</h5>
        <BlockMath
          math={`\\frac{${frac1.numerador}}{${frac1.denominador}}_{(${base})} - \\frac{${frac2.numerador}}{${frac2.denominador}}_{(${base})}`}
        />
      </div>

      {/* PASO 2 */}
      <div className="paso-card">
        <div className="paso-numero-badge">2</div>
        <h5>
          División: <InlineMath math={`${frac1.numerador} \\div ${frac1.denominador}`} /> en base {base}
        </h5>
        <div className="division-pasos">
          <motion.div
            className="division-step entera"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BlockMath math={div1.latex} />
          </motion.div>
          <div className="division-resultado">
            <BlockMath math={`\\frac{${frac1.numerador}}{${frac1.denominador}}_{(${base})} = ${numDecFrac1}_{(${base})}`} />
          </div>
        </div>
      </div>

      {/* PASO 3 */}
      <div className="paso-card">
        <div className="paso-numero-badge">3</div>
        <h5>
          División: <InlineMath math={`${frac2.numerador} \\div ${frac2.denominador}`} /> en base {base}
        </h5>
        <div className="division-pasos">
          <motion.div
            className="division-step entera"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BlockMath math={div2.latex} />
          </motion.div>
          <div className="division-resultado">
            <BlockMath math={`\\frac{${frac2.numerador}}{${frac2.denominador}}_{(${base})} = ${numDecFrac2}_{(${base})}`} />
          </div>
        </div>
      </div>

      {/* PASO 4: Resta en columna */}
      <div className="paso-card">
        <div className="paso-numero-badge">4</div>
        <h5>Resta en columna en base {base}</h5>
        <div className="division-pasos">
          <BlockMath math={restaColumnaLatex} />
        </div>
      </div>

      {/* RESULTADO FINAL */}
      <div className="paso-card resultado-final">
        <div className="paso-numero-badge resultado-badge">✓</div>
        <h5>Resultado final</h5>
        <BlockMath
          math={`\\frac{${frac1.numerador}}{${frac1.denominador}}_{(${base})} - \\frac{${frac2.numerador}}{${frac2.denominador}}_{(${base})} = ${resultadoResta}_{(${base})}`}
        />
      </div>
    </motion.div>
  )
}

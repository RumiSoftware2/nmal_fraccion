import { useMemo } from 'react'
import { motion } from 'framer-motion'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import '../componentes2Styles/PasosMultiplicacion.css'

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

// Genera el LaTeX de multiplicación en columna
function generarMultiplicacionColumnaLatex(aStr, bStr, base) {
  // Separar parte entera y decimal de cada número
  const [aInt, aDec = ''] = aStr.split('.')
  const [bInt, bDec = ''] = bStr.split('.')

  const aFull = aInt + aDec
  const bFull = bInt + bDec
  
  const decPosA = aDec.length
  const decPosB = bDec.length
  const totalDecPos = decPosA + decPosB

  const baseNum = parseInt(base)
  const numA = aInt + aDec
  const numB = bInt + bDec

  // Convertir números a base decimal para cálculos
  const intA = parseInt(numA, baseNum)
  const intB = parseInt(numB, baseNum)

  // Multiplicar
  const result = intA * intB

  const toB = (d) => (d < 10 ? String(d) : String.fromCharCode(55 + d)).toUpperCase()

  // Convertir resultado a base
  const resultStr = toBase(result, baseNum).toUpperCase()
  
  // Posicionar el punto decimal
  let finalResult
  if (totalDecPos === 0) {
    finalResult = resultStr
  } else if (totalDecPos >= resultStr.length) {
    finalResult = '0.' + '0'.repeat(totalDecPos - resultStr.length) + resultStr
  } else {
    const dotPos = resultStr.length - totalDecPos
    finalResult = resultStr.slice(0, dotPos) + '.' + resultStr.slice(dotPos)
  }

  // Generar productos parciales
  const cleanNumB = numB.replace(/^0+/, '')
  const partialProducts = []
  if (cleanNumB.length > 1 && intA !== 0 && intB !== 0) {
    for (let i = cleanNumB.length - 1; i >= 0; i--) {
      const digitValue = parseInt(cleanNumB[i], baseNum)
      const partialProd = intA * digitValue
      const pStr = toBase(partialProd, baseNum).toUpperCase()
      const shift = cleanNumB.length - 1 - i
      
      const phantoms = '\\phantom{0}'.repeat(shift)
      partialProducts.push(pStr + phantoms)
    }
  }

  // Construir formato de tabla simple
  let latex = `\\begin{array}{r}\n`
  latex += `${aInt}${aDec ? '.' + aDec : ''}_{(${base})} \\\\\n`
  latex += `\\times \\; ${bInt}${bDec ? '.' + bDec : ''}_{(${base})} \\\\\n`
  latex += `\\hline\n`
  
  if (partialProducts.length > 0) {
    partialProducts.forEach((pp) => {
      latex += `${pp} \\\\\n`
    })
    latex += `\\hline\n`
  }
  
  latex += `${finalResult}_{(${base})}\n`
  latex += `\\end{array}`

  return { latex, resultStr: finalResult }
}

export default function PasosMultiplicacion({ frac1, frac2, base }) {
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

  const { latex: multiplicacionColumnaLatex, resultStr: resultadoMultiplicacion } = useMemo(
    () => generarMultiplicacionColumnaLatex(numDecFrac1, numDecFrac2, baseNum),
    [numDecFrac1, numDecFrac2, baseNum]
  )

  return (
    <motion.div
      className="pasos-multiplicacion"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h4>📋 Pasos de la Multiplicación en Base {base}</h4>

      {/* PASO 1 */}
      <div className="paso-card">
        <div className="paso-numero-badge">1</div>
        <h5>Fracciones a multiplicar</h5>
        <BlockMath
          math={`\\frac{${frac1.numerador}}{${frac1.denominador}}_{(${base})} \\times \\frac{${frac2.numerador}}{${frac2.denominador}}_{(${base})}`}
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

      {/* PASO 4: Multiplicación en columna */}
      <div className="paso-card">
        <div className="paso-numero-badge">4</div>
        <h5>Multiplicación en columna en base {base}</h5>
        <div className="division-pasos">
          <BlockMath math={multiplicacionColumnaLatex} />
        </div>
      </div>

      {/* RESULTADO FINAL */}
      <div className="paso-card resultado-final">
        <div className="paso-numero-badge resultado-badge">✓</div>
        <h5>Resultado final</h5>
        <BlockMath
          math={`\\frac{${frac1.numerador}}{${frac1.denominador}}_{(${base})} \\times \\frac{${frac2.numerador}}{${frac2.denominador}}_{(${base})} = ${resultadoMultiplicacion}_{(${base})}`}
        />
      </div>
    </motion.div>
  )
}

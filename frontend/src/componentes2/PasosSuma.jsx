import { useMemo } from 'react'
import { motion } from 'framer-motion'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import '../componentes2Styles/PasosSuma.css'

const BlockMath = ({ math }) => {
  const html = katex.renderToString(math, { throwOnError: false, displayMode: true })
  return <div className="katex-block" dangerouslySetInnerHTML={{ __html: html }} />
}

const InlineMath = ({ math }) => {
  const html = katex.renderToString(math, { throwOnError: false, displayMode: false })
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

// Convierte un número entero (base 10) a string en una base dada
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

// Genera el LaTeX de la división larga simulando papel
function generarPasosDivisionLatex(numeradorStr, denominadorStr, base, maxPasos = 8) {
  const num = parseInt(numeradorStr, base)
  const den = parseInt(denominadorStr, base)

  if (den === 0) return { latex: '', parteEntera: '0', decimales: '' }

  const toB = (n) => {
    if (n === 0) return '0'
    return Math.abs(n).toString(base).toUpperCase()
  }

  const cocienteStr = []
  const leftCol = []
  let isDecimal = false

  let residuo = num
  let pasoDiv = 0

  // Primer paso: parte entera
  let q = Math.floor(residuo / den)
  let producto = q * den
  cocienteStr.push(toB(q))

  leftCol.push({
    dividendo: residuo < 0 ? '-' + toB(Math.abs(residuo)) : toB(residuo),
    sustraendo: toB(producto),
    resto: toB(residuo - producto)
  })

  residuo = residuo - producto
  const residuosVistos = new Map()

  while (residuo > 0 && pasoDiv < maxPasos) {
    if (residuosVistos.has(residuo)) {
      break // Inicio de periodo
    }
    residuosVistos.set(residuo, pasoDiv)

    if (!isDecimal) {
      cocienteStr.push('.')
      isDecimal = true
    }

    let currentDividendoVal = residuo * base
    let currentDividendoStr = toB(residuo) + '0' // bajan un cero

    q = Math.floor(currentDividendoVal / den)
    producto = q * den
    cocienteStr.push(toB(q))

    let nuevoResiduo = currentDividendoVal - producto

    leftCol.push({
      dividendo: currentDividendoStr,
      sustraendo: toB(producto),
      resto: toB(nuevoResiduo)
    })

    residuo = nuevoResiduo
    pasoDiv++
  }

  // Si no se usó decimales pero sobró, o simplemente armar el string
  const parteEntera = cocienteStr[0]
  const decimales = isDecimal ? cocienteStr.slice(1).join('').replace('.', '') : ''

  // Armar el LaTeX estilo papel
  let latex = `\\begin{array}{r|l}\n`
  
  leftCol.forEach((step, i) => {
    if (i === 0) {
      latex += ` ${step.dividendo} & ${toB(den)}_{(${base})} \\\\\n`
      latex += `\\cline{2-2}\n`
      latex += `\\mathbf{-}\\,${step.sustraendo} & ${cocienteStr.join('')}_{(${base})} \\\\\n`
      latex += `\\hline\n`
    } else {
      latex += ` ${step.dividendo} & \\\\\n`
      latex += `\\mathbf{-}\\,${step.sustraendo} & \\\\\n`
      latex += `\\hline\n`
    }

    if (i === leftCol.length - 1) {
      // mostrar resto final
      latex += ` ${step.resto} & \\\\\n`
    }
  })
  
  latex += `\\end{array}`

  return {
    latex,
    parteEntera,
    decimales
  }
}

export default function PasosSuma({ frac1, frac2, base }) {
  const baseNum = parseInt(base)

  // Convertir fracciones a base 10 para las operaciones
  const num1_b10 = parseInt(frac1.numerador, baseNum)
  const den1_b10 = parseInt(frac1.denominador, baseNum)
  const num2_b10 = parseInt(frac2.numerador, baseNum)
  const den2_b10 = parseInt(frac2.denominador, baseNum)

  // Suma de fracciones: (a/b) + (c/d) = (a*d + c*b) / (b*d)
  const numSuma = num1_b10 * den2_b10 + num2_b10 * den1_b10
  const denSuma = den1_b10 * den2_b10

  const numSumaBase = toBase(numSuma, baseNum)
  const denSumaBase = toBase(denSuma, baseNum)

  // Pasos de división 1: frac1.numerador / frac1.denominador
  const div1 = useMemo(
    () => generarPasosDivisionLatex(frac1.numerador, frac1.denominador, baseNum),
    [frac1.numerador, frac1.denominador, baseNum]
  )

  // Pasos de división 2: frac2.numerador / frac2.denominador
  const div2 = useMemo(
    () => generarPasosDivisionLatex(frac2.numerador, frac2.denominador, baseNum),
    [frac2.numerador, frac2.denominador, baseNum]
  )

  // Pasos de la división final (suma)
  const divSuma = useMemo(
    () => generarPasosDivisionLatex(numSumaBase, denSumaBase, baseNum),
    [numSumaBase, denSumaBase, baseNum]
  )

  return (
    <motion.div
      className="pasos-suma"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h4>📋 Pasos de la Suma en Base {base}</h4>

      {/* PASO 1: Mostrar las fracciones */}
      <div className="paso-card">
        <div className="paso-numero-badge">1</div>
        <h5>Fracciones a sumar</h5>
        <BlockMath math={`\\frac{${frac1.numerador}}{${frac1.denominador}}_{(${base})} + \\frac{${frac2.numerador}}{${frac2.denominador}}_{(${base})}`} />
      </div>

      {/* PASO 2: División de fracción 1 */}
      <div className="paso-card">
        <div className="paso-numero-badge">2</div>
        <h5>División: <InlineMath math={`${frac1.numerador} \\div ${frac1.denominador}`} /> en base {base}</h5>
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
            <BlockMath math={`\\frac{${frac1.numerador}}{${frac1.denominador}}_{(${base})} = ${div1.parteEntera}${div1.decimales ? '.' + div1.decimales : ''}_{(${base})}`} />
          </div>
        </div>
      </div>

      {/* PASO 3: División de fracción 2 */}
      <div className="paso-card">
        <div className="paso-numero-badge">3</div>
        <h5>División: <InlineMath math={`${frac2.numerador} \\div ${frac2.denominador}`} /> en base {base}</h5>
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
            <BlockMath math={`\\frac{${frac2.numerador}}{${frac2.denominador}}_{(${base})} = ${div2.parteEntera}${div2.decimales ? '.' + div2.decimales : ''}_{(${base})}`} />
          </div>
        </div>
      </div>

      {/* PASO 4: Resta de los números obtenidos */}
      <div className="paso-card">
        <div className="paso-numero-badge">4</div>
        <h5>Resta de los números decimales</h5>
        <BlockMath math={`${div1.parteEntera}${div1.decimales ? '.' + div1.decimales : ''}_{(${base})} - ${div2.parteEntera}${div2.decimales ? '.' + div2.decimales : ''}_{(${base})}`} />
      </div>

      {/* RESULTADO FINAL */}
      <div className="paso-card resultado-final">
        <div className="paso-numero-badge resultado-badge">✓</div>
        <h5>Resultado final</h5>
        <BlockMath math={`\\frac{${frac1.numerador}}{${frac1.denominador}} + \\frac{${frac2.numerador}}{${frac2.denominador}} = \\frac{${numSumaBase}}{${denSumaBase}} = ${divSuma.parteEntera}${divSuma.decimales ? '.' + divSuma.decimales : ''}_{(${base})}`} />
      </div>
    </motion.div>
  )
}

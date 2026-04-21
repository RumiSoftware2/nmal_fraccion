import { useMemo } from 'react'
import { motion } from 'framer-motion'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import '../componentes2Styles/PasosDivision.css'

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

function generarPasosDivisionLatex(numeradorStr, denominadorStr, base, maxPasos = 15) {
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
  const residuosVistos = new Map()
  let pasoDiv = 0
  let esPeriodico = false
  let inicioPeriodo = -1

  while (residuo !== 0 && pasoDiv < maxPasos) {
    if (residuosVistos.has(residuo)) {
      esPeriodico = true
      inicioPeriodo = residuosVistos.get(residuo)
      break
    }
    residuosVistos.set(residuo, pasoDiv)
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
  let decimales = ''
  if (tieneDecimales) {
    const decList = cocienteDigitos.slice(1)
    if (esPeriodico) {
      const p1 = decList.slice(0, inicioPeriodo).join('')
      const p2 = decList.slice(inicioPeriodo).join('')
      decimales = `${p1}(${p2})`
    } else {
      decimales = decList.join('')
    }
  }
  const cocienteStr = parteEntera + (decimales ? '.' + decimales : '')

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

export default function PasosDivision({ frac1, frac2, base }) {
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

  const divisionFinal = useMemo(() => {
    // Calculo cruzado para dividir fracciones: (n1*d2) / (d1*n2)
    const n1 = parseInt(frac1.numerador, baseNum)
    const d1 = parseInt(frac1.denominador, baseNum)
    const n2 = parseInt(frac2.numerador, baseNum)
    const d2 = parseInt(frac2.denominador, baseNum)

    const numCruzado = n1 * d2
    const denCruzado = d1 * n2

    if (denCruzado === 0) {
      return { latex: '\\text{Indefinido}', parteEntera: '0', decimales: '' }
    }

    const numStr = toBase(numCruzado, baseNum).toUpperCase()
    const denStr = toBase(denCruzado, baseNum).toUpperCase()

    return generarPasosDivisionLatex(numStr, denStr, baseNum, 15) // 15 pasos para periodos más largos
  }, [frac1, frac2, baseNum])

  const resultadoDivision = `${divisionFinal.parteEntera}${divisionFinal.decimales ? '.' + divisionFinal.decimales : ''}`

  return (
    <motion.div
      className="pasos-division"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h4>📋 Pasos de la División en Base {base}</h4>

      {/* PASO 1 */}
      <div className="paso-card">
        <div className="paso-numero-badge">1</div>
        <h5>Fracciones a dividir</h5>
        <BlockMath
          math={`\\frac{${frac1.numerador}}{${frac1.denominador}}_{(${base})} \\div \\frac{${frac2.numerador}}{${frac2.denominador}}_{(${base})}`}
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

      {/* PASO 4: División de división */}
      <div className="paso-card">
        <div className="paso-numero-badge">4</div>
        <h5>División de operandos en base {base}</h5>
        <div className="division-pasos">
          <motion.div
            className="division-step entera"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BlockMath math={divisionFinal.latex} />
          </motion.div>
        </div>
      </div>

      {/* RESULTADO FINAL */}
      <div className="paso-card resultado-final">
        <div className="paso-numero-badge resultado-badge">✓</div>
        <h5>Resultado final</h5>
        <BlockMath
          math={`\\frac{${frac1.numerador}}{${frac1.denominador}}_{(${base})} \\div \\frac{${frac2.numerador}}{${frac2.denominador}}_{(${base})} = ${resultadoDivision}_{(${base})}`}
        />
      </div>
    </motion.div>
  )
}

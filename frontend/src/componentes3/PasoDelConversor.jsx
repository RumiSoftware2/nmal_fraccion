import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import katex from 'katex'
import 'katex/dist/katex.min.css'

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

function latexEscapeText(s) {
  return String(s)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/%/g, '\\%')
    .replace(/&/g, '\\&')
    .replace(/_/g, '\\_')
}

function parseNumeroConvertido(numeroConvertido) {
  if (!numeroConvertido || !String(numeroConvertido).includes('/')) {
    return { numerador: '0', denominador: '1' }
  }
  const [a, b] = String(numeroConvertido).split('/')
  return { numerador: a.trim().toUpperCase(), denominador: b.trim().toUpperCase() }
}

const PASOS = [
  { id: 0, titulo: 'Fracción en base 10' },
  { id: 1, titulo: 'Numerador y denominador en base destino' },
  { id: 2, titulo: 'División en la base de llegada' }
]

export default function PasoDelConversor({ resultado }) {
  const [pasoActivo, setPasoActivo] = useState(0)

  const baseOrigen = resultado.base_origen
  const baseDestino = resultado.base_destino
  const parsed = parseNumeroConvertido(resultado.numero_convertido)

  const n10 =
    resultado.numerador_base_10 !== undefined && resultado.numerador_base_10 !== null
      ? String(resultado.numerador_base_10)
      : null
  const d10 =
    resultado.denominador_base_10 !== undefined && resultado.denominador_base_10 !== null
      ? String(resultado.denominador_base_10)
      : null

  const numDest = (resultado.numerador_destino || parsed.numerador).toUpperCase()
  const denDest = (resultado.denominador_destino || parsed.denominador).toUpperCase()

  const divisionDestino = useMemo(
    () => generarPasosDivisionLatex(numDest, denDest, baseDestino, 18),
    [numDest, denDest, baseDestino]
  )

  const cocienteTeorico = `${divisionDestino.parteEntera}${
    divisionDestino.decimales ? '.' + divisionDestino.decimales : ''
  }`

  return (
    <div className="paso-conversor-root">
      <nav className="paso-conversor-nav" aria-label="Pasos de la conversión">
        {PASOS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`paso-conversor-nav-btn${pasoActivo === p.id ? ' is-active' : ''}`}
            onClick={() => setPasoActivo(p.id)}
          >
            <span className="paso-conversor-nav-num">{p.id + 1}</span>
            <span className="paso-conversor-nav-label">{p.titulo}</span>
          </button>
        ))}
      </nav>

      <div className="paso-conversor-panel">
        {pasoActivo === 0 && (
          <motion.div
            className="paso-conversor-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="paso-conversor-card-head">
              <span className="paso-conversor-badge">1</span>
              <h5>Paso 1 — Fracción exacta en base decimal</h5>
            </div>
            <p className="paso-conversor-texto">
              El número <code className="paso-conversor-code">{resultado.numero_original}</code> en base{' '}
              <strong>{baseOrigen}</strong> se expresa primero como cociente de dos enteros en base 10 (numerador y
              denominador exactos).
            </p>
            {n10 && d10 ? (
              <BlockMath math={`\\frac{${n10}}{${d10}}`} />
            ) : (
              <p className="paso-conversor-texto muted">
                Los valores en base 10 no están disponibles en la respuesta del servidor.
              </p>
            )}
            <p className="paso-conversor-texto">
              Valor decimal aproximado:{' '}
              <InlineMath math={`\\approx ${String(resultado.valor_base_10)}`} />
            </p>
          </motion.div>
        )}

        {pasoActivo === 1 && (
          <motion.div
            className="paso-conversor-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="paso-conversor-card-head">
              <span className="paso-conversor-badge">2</span>
              <h5>Paso 2 — Mismo cociente, numerador y denominador en base {baseDestino}</h5>
            </div>
            <p className="paso-conversor-texto">
              Se reescriben el numerador y el denominador (enteros en base 10) usando solo dígitos válidos en la base de
              llegada <strong>{baseDestino}</strong>.
            </p>
            {n10 && d10 && (
              <BlockMath
                math={`\\frac{${n10}}{${d10}} \\;=\\; \\frac{${numDest}}{${denDest}}_{(${baseDestino})}`}
              />
            )}
            {!n10 && <BlockMath math={`\\frac{${numDest}}{${denDest}}_{(${baseDestino})}`} />}
          </motion.div>
        )}

        {pasoActivo === 2 && (
          <motion.div
            className="paso-conversor-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="paso-conversor-card-head">
              <span className="paso-conversor-badge">3</span>
              <h5>Paso 3 — División en base {baseDestino}</h5>
            </div>
            <p className="paso-conversor-texto">
              En la base de llegada, el número n-mal se obtiene dividiendo (en esa base) el numerador entre el
              denominador:
            </p>
            <BlockMath math={`${numDest}_{(${baseDestino})} \\div ${denDest}_{(${baseDestino})}`} />
            <div className="paso-conversor-division-wrap">
              <BlockMath math={divisionDestino.latex} />
            </div>
            {resultado.resultado_nmal && (
              <div className="paso-conversor-resultado">
                <p className="paso-conversor-texto">
                  Resultado del algoritmo (misma representación que arriba en el cociente):
                </p>
                <BlockMath
                  math={`\\frac{${numDest}}{${denDest}}_{(${baseDestino})} = \\text{${latexEscapeText(
                    cocienteTeorico
                  )}}_{(${baseDestino})} = \\text{${latexEscapeText(String(resultado.resultado_nmal))}}_{(${baseDestino})}`}
                />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

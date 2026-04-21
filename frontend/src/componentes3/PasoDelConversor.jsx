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

/** Entero (BigInt) → numeral en `base` (2–36). */
function bigintToBaseString(n, base) {
  const B = BigInt(Math.floor(Number(base)))
  if (n === 0n) return '0'
  const neg = n < 0n
  let x = neg ? -n : n
  let result = ''
  while (x > 0n) {
    const digit = Number(x % B)
    const ch = digit < 10 ? String(digit) : String.fromCharCode(55 + digit)
    result = ch + result
    x /= B
  }
  return (neg ? '-' : '') + result.toUpperCase()
}

/** API / JSON → BigInt cuando sea posible. */
function toBigInt(v) {
  if (v === undefined || v === null) return null
  try {
    if (typeof v === 'bigint') return v
    if (typeof v === 'number') {
      if (!Number.isFinite(v)) return null
      if (Number.isSafeInteger(v)) return BigInt(v)
      return BigInt(Math.trunc(v))
    }
    const s = String(v).trim()
    if (s === '') return null
    return BigInt(s)
  } catch {
    return null
  }
}

/**
 * Un paso de división entera “de papel” en `baseDivision`:
 * dividendo ÷ divisor (ambos numerales en esa base), cociente y resto visibles.
 * Misma plantilla que la primera fila de `generarPasosDivisionLatex`.
 */
function latexDivisionEnteraPaso(dividendoStr, divisorStr, baseDivision, cocienteStr, productoStr, restoStr) {
  return `\\begin{array}{r|l}
  ${dividendoStr} & \\overline{)\\,${divisorStr}_{(${baseDivision})}} \\\\[4pt]
  {-}\\;${productoStr} & ${cocienteStr}_{(${baseDivision})} \\\\[2pt]
  \\hline
  ${restoStr} & \\\\[2pt]
\\end{array}`
}

/**
 * Método tradicional de pasar un entero positivo a la base de llegada:
 * divisiones enteras repetidas, aritmética escrita en `baseOrigen`.
 * El divisor en cada paso es el valor `baseDestino`, escrito con dígitos válidos en `baseOrigen`.
 */
function construirCadenaConversionRadixLatex(valor, baseOrigen, baseDestino, maxPasos = 72) {
  const B = BigInt(Math.floor(Number(baseDestino)))
  if (valor === null || valor === undefined) {
    return { pasos: [], resultadoDestino: '', divisorNumeral: '', truncado: false }
  }
  let n = valor
  if (n < 0n) {
    return { pasos: [], resultadoDestino: '', divisorNumeral: '', truncado: false }
  }
  const divisorNumeral = bigintToBaseString(B, baseOrigen).toUpperCase()
  const pasos = []
  const digitosMenosSignificativos = []

  if (n === 0n) {
    return { pasos: [], resultadoDestino: '0', divisorNumeral, truncado: false }
  }

  let iter = 0
  let truncado = false
  while (n > 0n && iter < maxPasos) {
    const dividendoStr = bigintToBaseString(n, baseOrigen).toUpperCase()
    const q = n / B
    const r = n % B
    const producto = q * B
    const productoStr = bigintToBaseString(producto, baseOrigen).toUpperCase()
    const qStr = bigintToBaseString(q, baseOrigen).toUpperCase()
    const restoStrOrigen = bigintToBaseString(r, baseOrigen).toUpperCase()
    const digitoDestino = bigintToBaseString(r, baseDestino).toUpperCase()
    digitosMenosSignificativos.push(digitoDestino)

    pasos.push({
      latex: latexDivisionEnteraPaso(dividendoStr, divisorNumeral, baseOrigen, qStr, productoStr, restoStrOrigen),
      digitoEnBaseDestino: digitoDestino,
      cocienteSiguiente: qStr
    })
    n = q
    iter++
  }

  if (n > 0n) {
    truncado = true
  }

  const resultadoDestino = digitosMenosSignificativos.reverse().join('')
  return { pasos, resultadoDestino, divisorNumeral, truncado }
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
  { id: 0, titulo: 'Divisiones (→ b destino)' },
  { id: 1, titulo: 'Misma fracción en ambas bases' },
  { id: 2, titulo: 'División en la base de llegada' }
]

export default function PasoDelConversor({ resultado }) {
  const [pasoActivo, setPasoActivo] = useState(0)

  const baseOrigen = resultado.base_origen
  const baseDestino = resultado.base_destino
  const parsed = parseNumeroConvertido(resultado.numero_convertido)

  const numDest = (resultado.numerador_destino || parsed.numerador).toUpperCase()
  const denDest = (resultado.denominador_destino || parsed.denominador).toUpperCase()

  const divisionDestino = useMemo(
    () => generarPasosDivisionLatex(numDest, denDest, baseDestino, 18),
    [numDest, denDest, baseDestino]
  )

  const cocienteTeorico = `${divisionDestino.parteEntera}${
    divisionDestino.decimales ? '.' + divisionDestino.decimales : ''
  }`

  const biNum = useMemo(() => toBigInt(resultado.numerador_base_10), [resultado.numerador_base_10])
  const biDen = useMemo(() => toBigInt(resultado.denominador_base_10), [resultado.denominador_base_10])

  const numOrigen = useMemo(() => {
    if (biNum === null) return null
    return bigintToBaseString(biNum, baseOrigen).toUpperCase()
  }, [biNum, baseOrigen])

  const denOrigen = useMemo(() => {
    if (biDen === null) return null
    return bigintToBaseString(biDen, baseOrigen).toUpperCase()
  }, [biDen, baseOrigen])

  const radixNumerador = useMemo(() => {
    if (biNum === null) return { pasos: [], resultadoDestino: '', divisorNumeral: '', truncado: false }
    return construirCadenaConversionRadixLatex(biNum, baseOrigen, baseDestino)
  }, [biNum, baseOrigen, baseDestino])

  const radixDenominador = useMemo(() => {
    if (biDen === null) return { pasos: [], resultadoDestino: '', divisorNumeral: '', truncado: false }
    return construirCadenaConversionRadixLatex(biDen, baseOrigen, baseDestino)
  }, [biDen, baseOrigen, baseDestino])

  const divisorEnOrigen =
    radixNumerador.divisorNumeral ||
    radixDenominador.divisorNumeral ||
    bigintToBaseString(BigInt(Math.floor(Number(baseDestino))), baseOrigen).toUpperCase()

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
              <h5>
                Paso 1 — Fracción en base {baseOrigen} y divisiones → base {baseDestino}
              </h5>
            </div>

            {numOrigen !== null && denOrigen !== null ? (
              <div className="paso-conversor-subseccion">
                <h6 className="paso-conversor-subtitulo">Fracción en base {baseOrigen}</h6>
                <BlockMath
                  math={`\\frac{\\text{${latexEscapeText(numOrigen)}}_{(${baseOrigen})}}{\\text{${latexEscapeText(
                    denOrigen
                  )}}_{(${baseOrigen})}}`}
                />
              </div>
            ) : null}

            {biNum !== null && biDen !== null ? (
              <>
                <div className="paso-conversor-subseccion">
                  <h6 className="paso-conversor-subtitulo">
                    Numerador ÷ base {baseDestino} (divisiones en base {baseOrigen})
                  </h6>
                  <div className="paso-conversor-radix-stack">
                    {radixNumerador.pasos.map((p, i) => (
                      <BlockMath key={`n-${i}`} math={p.latex} />
                    ))}
                  </div>
                  <BlockMath
                    math={`\\text{${latexEscapeText(
                      `Numerador en base ${baseDestino}: ${radixNumerador.resultadoDestino}`
                    )}}`}
                  />
                </div>

                <div className="paso-conversor-subseccion">
                  <h6 className="paso-conversor-subtitulo">
                    Denominador ÷ base {baseDestino} (divisiones en base {baseOrigen})
                  </h6>
                  <div className="paso-conversor-radix-stack">
                    {radixDenominador.pasos.map((p, i) => (
                      <BlockMath key={`d-${i}`} math={p.latex} />
                    ))}
                  </div>
                  <BlockMath
                    math={`\\text{${latexEscapeText(
                      `Denominador en base ${baseDestino}: ${radixDenominador.resultadoDestino}`
                    )}}`}
                  />
                </div>
              </>
            ) : null}
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
              <h5>Paso 2 — Mismo cociente, numerales en base {baseOrigen} y en base {baseDestino}</h5>
            </div>
            <p className="paso-conversor-texto">
              La fracción no cambia de valor: solo cambiamos la forma de escribir numerador y denominador usando
              dígitos permitidos en cada base.
            </p>
            {numOrigen !== null && denOrigen !== null ? (
              <BlockMath
                math={`\\frac{\\text{${latexEscapeText(numOrigen)}}_{(${baseOrigen})}}{\\text{${latexEscapeText(
                  denOrigen
                )}}_{(${baseOrigen})}} \\;=\\; \\left(\\frac{\\text{${latexEscapeText(numDest)}}}{\\text{${latexEscapeText(
                  denDest
                )}}}\\right)_{(${baseDestino})}`}
              />
            ) : (
              <BlockMath
                math={`\\left(\\frac{\\text{${latexEscapeText(numDest)}}}{\\text{${latexEscapeText(
                  denDest
                )}}}\\right)_{(${baseDestino})}`}
              />
            )}
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

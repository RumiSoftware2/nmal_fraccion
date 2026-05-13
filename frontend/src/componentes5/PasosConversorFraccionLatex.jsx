import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const BlockMath = ({ math }) => {
  const html = katex.renderToString(math, { throwOnError: false, displayMode: true })
  return <div className="katex-block" dangerouslySetInnerHTML={{ __html: html }} />
}

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

function latexDivisionEnteraPaso(dividendoStr, divisorStr, baseDivision, cocienteStr, productoStr, restoStr) {
  return `\\begin{array}{r|l}
  ${dividendoStr} & \\overline{)\\,${divisorStr}_{(${baseDivision})}} \\\\[4pt]
  {-}\\;${productoStr} & ${cocienteStr}_{(${baseDivision})} \\\\[2pt]
  \\hline
  ${restoStr} & \\\\[2pt]
\\end{array}`
}

function construirCadenaConversionRadixLatex(valor, baseOrigen, baseDestino, maxPasos = 72) {
  const B = BigInt(Math.floor(Number(baseDestino)))
  if (valor === null || valor === undefined) return { pasos: [], resultadoDestino: '', divisorNumeral: '', truncado: false }
  let n = valor
  if (n < 0n) return { pasos: [], resultadoDestino: '', divisorNumeral: '', truncado: false }

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
      latex: latexDivisionEnteraPaso(dividendoStr, divisorNumeral, baseOrigen, qStr, productoStr, restoStrOrigen)
    })
    n = q
    iter++
  }

  if (n > 0n) truncado = true
  const resultadoDestino = digitosMenosSignificativos.reverse().join('')
  return { pasos, resultadoDestino, divisorNumeral, truncado }
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

const PASOS = [
  { id: 0, titulo: 'Divisiones en Origen' },
  { id: 1, titulo: 'Equivalencia Fraccional' }
]

export default function PasosConversorFraccionLatex({ resultado }) {
  const [pasoActivo, setPasoActivo] = useState(0)

  const baseOrigen = resultado.base_origen
  const baseDestino = resultado.base_destino

  const numDest = resultado.numerador_destino.toUpperCase()
  const denDest = resultado.denominador_destino.toUpperCase()
  const numOrigen = resultado.numerador_origen.toUpperCase()
  const denOrigen = resultado.denominador_origen.toUpperCase()

  const biNum = useMemo(() => toBigInt(resultado.numerador_base_10), [resultado.numerador_base_10])
  const biDen = useMemo(() => toBigInt(resultado.denominador_base_10), [resultado.denominador_base_10])

  const radixNumerador = useMemo(() => {
    return construirCadenaConversionRadixLatex(biNum, baseOrigen, baseDestino)
  }, [biNum, baseOrigen, baseDestino])

  const radixDenominador = useMemo(() => {
    return construirCadenaConversionRadixLatex(biDen, baseOrigen, baseDestino)
  }, [biDen, baseOrigen, baseDestino])

  return (
    <div className="paso-conversor-root" style={{ marginTop: '30px' }}>



      {/* 📌 NAVEGACIÓN DE PASOS (PESTAÑAS HORIZONTALES) */}
      <nav aria-label="Pasos de la conversión" style={{
        display: 'flex',
        background: '#f1f5f9',
        padding: '8px',
        borderRadius: '12px',
        marginBottom: '25px',
        border: '1px solid #e2e8f0'
      }}>
        {PASOS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPasoActivo(p.id)}
            style={{
              flex: 1,
              padding: '12px 16px',
              cursor: 'pointer',
              background: pasoActivo === p.id ? 'white' : 'transparent',
              color: pasoActivo === p.id ? '#db2777' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '1rem',
              boxShadow: pasoActivo === p.id ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
          >
            {p.id + 1}. {p.titulo}
          </button>
        ))}
      </nav>

      {/* 📄 PANEL DE PASOS */}
      <div className="paso-conversor-panel" style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', minHeight: '300px' }}>
        <AnimatePresence mode="wait">

          {pasoActivo === 0 && (
            <motion.div key="paso0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <h5 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '1.2rem', fontWeight: '800', textAlign: 'center' }}>Fracción en base {baseOrigen} y divisiones hacia la base {baseDestino}</h5>

              <div style={{ marginBottom: '30px', padding: '20px', background: '#f8fafc', borderRadius: '12px', borderLeft: '5px solid #3b82f6', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h6 style={{ marginBottom: '15px', color: '#475569', fontWeight: 'bold' }}>Fracción a convertir:</h6>
                <BlockMath math={`\\frac{\\text{${latexEscapeText(numOrigen)}}_{(${baseOrigen})}}{\\text{${latexEscapeText(denOrigen)}}_{(${baseOrigen})}}`} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'start' }}>

                {/* NUMERADOR */}
                <div style={{ padding: '25px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <h6 style={{ marginBottom: '15px', color: '#db2777', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                    1. Numerador ÷ {baseDestino}
                  </h6>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px', textAlign: 'center' }}>
                    Divisiones de <strong style={{ color: '#1e293b' }}>{numOrigen}</strong> en base {baseOrigen}:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px dashed #cbd5e1', overflowX: 'auto' }}>
                    {radixNumerador.pasos.map((p, i) => (
                      <BlockMath key={`n-${i}`} math={p.latex} />
                    ))}
                  </div>

                  <div style={{ marginTop: '20px', padding: '15px', background: '#fdf2f8', borderRadius: '8px', color: '#be185d', fontWeight: '700', textAlign: 'center', border: '1px solid #fbcfe8' }}>
                    <BlockMath math={`\\text{Nuevo Num:} \\quad \\mathbf{${radixNumerador.resultadoDestino}}`} />
                  </div>
                </div>

                {/* DENOMINADOR */}
                <div style={{ padding: '25px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <h6 style={{ marginBottom: '15px', color: '#db2777', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                    2. Denominador ÷ {baseDestino}
                  </h6>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px', textAlign: 'center' }}>
                    Divisiones de <strong style={{ color: '#1e293b' }}>{denOrigen}</strong> en base {baseOrigen}:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px dashed #cbd5e1', overflowX: 'auto' }}>
                    {radixDenominador.pasos.map((p, i) => (
                      <BlockMath key={`d-${i}`} math={p.latex} />
                    ))}
                  </div>

                  <div style={{ marginTop: '20px', padding: '15px', background: '#fdf2f8', borderRadius: '8px', color: '#be185d', fontWeight: '700', textAlign: 'center', border: '1px solid #fbcfe8' }}>
                    <BlockMath math={`\\text{Nuevo Den:} \\quad \\mathbf{${radixDenominador.resultadoDestino}}`} />
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {pasoActivo === 1 && (
            <motion.div key="paso1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <h5 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '1.3rem', fontWeight: '800', textAlign: 'center' }}>Equivalencia Fraccional Final</h5>
              <p style={{ marginBottom: '30px', color: '#64748b', lineHeight: '1.7', fontSize: '1.05rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto 30px auto' }}>
                La fracción conserva exactamente el mismo valor matemático. Simplemente hemos traducido los caracteres del numerador y del denominador para que estén escritos en la <strong>base {baseDestino}</strong>.
              </p>

              <div style={{ padding: '3rem 1rem', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1', display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
                <BlockMath
                  math={`\\frac{\\text{${latexEscapeText(numOrigen)}}_{(${baseOrigen})}}{\\text{${latexEscapeText(denOrigen)}}_{(${baseOrigen})}} \\;=\\; \\left(\\frac{\\text{${latexEscapeText(numDest)}}}{\\text{${latexEscapeText(denDest)}}}\\right)_{(${baseDestino})}`}
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

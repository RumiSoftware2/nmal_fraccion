import React from 'react'
import BlockMath from '../components/pasosprueba/BlockMath'
import 'katex/dist/katex.min.css'

export function LatexBlock({ math, className }) {
  return (
    <div className={className || 'latex-bloque'}>
      <BlockMath math={math} />
    </div>
  )
}

export function RepresentacionFC({ latexExpandida, latexPares }) {
  return (
    <div className="representacion-fc">
      <div className="representacion-row">
        <BlockMath math={latexExpandida} />
      </div>
      <div className="representacion-row small muted">
        <BlockMath math={latexPares} />
      </div>
    </div>
  )
}

export function TablaReductaFila({ k, p, q, decimal }) {
  const frac = `\\frac{${p}}{${q}}`
  return (
    <div className="reducta-fila">
      <div className="reducta-k">{k}</div>
      <div className="reducta-frac"><BlockMath math={frac} /></div>
      <div className="reducta-dec">{decimal}</div>
    </div>
  )
}

export function AcordeonDesarrolloReducta({ lineasLatex = [], expanded }) {
  return (
    <div className={`acordeon-desarrollo ${expanded ? 'expanded' : ''}`}>
      {lineasLatex.map((l, i) => (
        <div key={i} className="linea-latex"><BlockMath math={l} /></div>
      ))}
    </div>
  )
}

export function ListaReductasCompacta({ reductas, selectedK, onSelect }) {
  return (
    <div className="reductas-compactas">
      {reductas.map((r) => (
        <button
          key={r.k}
          type="button"
          className={`reducta-badge ${selectedK === r.k ? 'selected' : ''}`}
          onClick={() => onSelect(r.k)}
          title={`Nivel k=${r.k}`}
        >
          {r.p}/{r.q}
        </button>
      ))}
    </div>
  )
}

export default {
  LatexBlock,
  RepresentacionFC,
  TablaReductaFila,
  AcordeonDesarrolloReducta
}

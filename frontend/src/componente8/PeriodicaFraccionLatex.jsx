import React, { useState } from 'react'
import BlockMath from '../components/pasosprueba/BlockMath'
import './ReductasPeriodicas.css'

export function PasoPapelFC({ paso }) {
  return (
    <div className={`paso-acordeon ${paso.destacado ? 'paso-papel-destacado' : ''}`}>
      <button className={`paso-boton`}>
        <span className="paso-numero">Paso {paso.numero}</span>
        <span className="paso-titulo">{paso.titulo}</span>
      </button>
      <div className="paso-contenido">
        {paso.lineasLatex.map((l, i) => (
          <div key={i} style={{ marginBottom: '0.6rem' }}>
            <BlockMath math={l} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PasosPapelFC({ pasos }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="acordeon">
      {pasos.map((paso) => (
        <div key={paso.numero} className="paso-acordeon">
          <button
            className={`paso-boton ${expanded === paso.numero ? 'expanded' : ''}`}
            onClick={() => setExpanded(expanded === paso.numero ? null : paso.numero)}
          >
            <span className="paso-numero">Paso {paso.numero}</span>
            <span className="paso-titulo">{paso.titulo}</span>
            <span className="paso-toggle">{expanded === paso.numero ? '▼' : '▶'}</span>
          </button>

          {expanded === paso.numero && (
            <div className={`paso-contenido ${paso.destacado ? 'paso-papel-destacado' : ''}`}>
              {paso.lineasLatex.map((l, i) => (
                <div key={i} style={{ marginBottom: '0.6rem' }}>
                  <BlockMath math={l} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

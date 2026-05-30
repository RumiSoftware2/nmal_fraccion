import { useState } from 'react'
import { procesarFCGeneralizada } from './cerebro9.js'
import {
  RepresentacionFC,
  TablaReductaFila,
  AcordeonDesarrolloReducta,
  ListaReductasCompacta
} from './ReductasFCGeneralizadasLatex'
import './ReductasFCGeneralizadas.css'

export default function ReductasFCGeneralizadas() {
  const [niveles, setNiveles] = useState(2)
  const [filas, setFilas] = useState(() => {
    return Array.from({ length: niveles + 1 }, (_, i) => ({ a: '', b: '' }))
  })
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedK, setSelectedK] = useState(null)

  const ajustarNiveles = (n) => {
    const nn = Math.max(0, Math.min(15, Number(n)))
    setNiveles(nn)
    setResultado(null)
    setError(null)
    // preservar valores existentes cuando sea posible
    const old = filas || []
    if (nn + 1 === old.length) return
    if (nn + 1 > old.length) {
      const copy = old.slice()
      for (let i = old.length; i < nn + 1; i++) copy.push({ a: '', b: '' })
      setFilas(copy)
    } else {
      setFilas(old.slice(0, nn + 1))
    }
  }

  const handleChangeFila = (idx, key, value) => {
    const copy = filas.slice()
    copy[idx] = { ...copy[idx], [key]: value }
    setFilas(copy)
  }

  const calcular = () => {
    setError(null)
    setLoading(true)
    setResultado(null)
    // pequeño delay para UX
    setTimeout(() => {
      const parsed = filas.map((r) => ({ a: Number(r.a), b: Number(r.b) }))
      const res = procesarFCGeneralizada(parsed)
      if (!res.ok) {
        setResultado(null)
        setError(res.error)
      } else {
        setResultado(res)
        setError(null)
        setSelectedK(null)
      }
      setLoading(false)
    }, 250)
  }

  const resetear = () => {
    setFilas(Array.from({ length: niveles + 1 }, (_, i) => ({ a: '', b: '' })))
    setResultado(null)
    setError(null)
    setSelectedK(null)
  }

  return (
    <div className="reductas-generalizadas-wrapper">
      <h2><span className="module-badge-small">Módulo 9</span> Reductas FC Generalizadas</h2>

      <div className="controls entrada-section">
        <label>Niveles (n):</label>
        <input type="number" value={niveles} min={0} max={15} onChange={(e) => ajustarNiveles(e.target.value)} />
      </div>

      <div className="tabla-filas">
        <table>
          <thead>
            <tr><th>Nivel</th><th>a</th><th>b</th></tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={i}>
                <td>{i}</td>
                <td><input value={f.a} onChange={(e) => handleChangeFila(i, 'a', e.target.value)} /></td>
                <td><input value={f.b} onChange={(e) => handleChangeFila(i, 'b', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions botones-grupo">
        <button className="boton-calcular" onClick={calcular} disabled={loading}>{loading ? 'Calculando...' : 'Calcular'}</button>
        <button className="boton-limpiar" onClick={resetear} disabled={loading}>Limpiar</button>
      </div>

      {error && <div className="error">⚠️ {error}</div>}

      {resultado && (
        <div className="resultados-section">
          <div className="bloque-resultado">
            <h3>Representación</h3>
            <RepresentacionFC latexExpandida={resultado.latexExpandida} latexPares={resultado.latexPares} />
          </div>

          <div className="bloque-resultado lista-reductas-card">
            <h3>Reductas</h3>
            <p className="lista-reductas-hint">Clic en una fracción para ver el desarrollo paso a paso.</p>
            <ListaReductasCompacta
              reductas={resultado.reductas}
              selectedK={selectedK}
              onSelect={setSelectedK}
            />
          </div>

          <div className="bloque-resultado">
            <h3>Detalle reducta</h3>
            {resultado.reductas.map(r => (
              <div key={r.k} className="detalle">
                <div className="detalle-header">
                  <h4>k={r.k}</h4>
                  <button onClick={() => setSelectedK(selectedK === r.k ? null : r.k)} className="paso-toggle">{selectedK === r.k ? 'Ocultar' : 'Ver'}</button>
                </div>
                <div style={{ display: selectedK === r.k ? 'block' : 'none' }}>
                  <AcordeonDesarrolloReducta lineasLatex={r.lineasLatex} expanded={selectedK === r.k} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

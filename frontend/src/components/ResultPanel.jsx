import Paso1prueba from './pasosprueba/Paso1prueba'
import './ResultPanel.css'

export default function ResultPanel({ resultado }) {
  const fraccionBase = resultado.fraccion_base_original || ''
  const [numerBase, denomBase] = fraccionBase.split('/')

  return (
    <div className="resultado">
      <div className="resultado-header">
        <h2>Resultado</h2>
        <div className="fraccion-display">
          <div className="fraccion-part numerador">{numerBase}</div>
          <div className="fraccion-barra"></div>
          <div className="fraccion-part denominador">{denomBase }</div>
        </div>
        <div className="fraccion-subtext">
          <span className="fraccion-usuario">{resultado.fraccion_base_original} (base {resultado.input.base})</span>
          <span className="fraccion-decimal">{resultado.fraccion_decimal} (base 10)</span>
        </div>
      </div>

      
      <Paso1prueba input={resultado.input} />

      
    </div>
  )
}
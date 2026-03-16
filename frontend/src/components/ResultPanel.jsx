import Paso1Illustration from './Paso1Illustration'
import Paso1prueba from './pasosprueba/Paso1prueba'

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

      <Paso1Illustration input={resultado.input} />
      <Paso1prueba input={resultado.input} />

      <h3>Pasos del cálculo:</h3>
      <div className="pasos">
        {resultado.pasos.map(paso => (
          <div key={paso.paso} className="paso">
            <span className="paso-numero">{paso.paso}</span>
            <strong>{paso.descripcion}</strong>
            <div className="paso-resultado">{paso.resultado}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
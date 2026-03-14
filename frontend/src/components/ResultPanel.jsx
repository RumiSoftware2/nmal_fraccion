import Paso1Illustration from './Paso1Illustration'

export default function ResultPanel({ resultado }) {
  return (
    <div className="resultado">
      <div className="resultado-header">
        <h2>Resultado</h2>
        <div className="fraccion-display">
          <div className="fraccion-part numerador">{resultado.numerador}</div>
          <div className="fraccion-barra"></div>
          <div className="fraccion-part denominador">{resultado.denominador}</div>
        </div>
        <div className="fraccion-subtext">
          <span>{resultado.fraccion_decimal} (base 10)</span>
          <span>{resultado.fraccion_base_original} (base {resultado.input.base})</span>
        </div>
      </div>

      <Paso1Illustration input={resultado.input} />

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
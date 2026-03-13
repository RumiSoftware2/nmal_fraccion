export default function ResultPanel({ resultado }) {
  return (
    <div className="resultado">
      <div className="resultado-header">
        <h2>Resultado</h2>
        <p className="fraccion">{resultado.fraccion_decimal}</p>
        <p className="fraccion">{resultado.fraccion_base_original}</p>
      </div>
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
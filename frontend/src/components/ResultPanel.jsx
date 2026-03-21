import Paso1prueba from './pasosprueba/Paso1prueba'
import NumberDisplay from './NumberDisplay'
import './ResultPanel.css'

export default function ResultPanel({ resultado }) {
  // Validar que resultado exista
  if (!resultado) {
    return (
      <div className="resultado">
        <p style={{ color: '#ef4444', textAlign: 'center' }}>Error: No hay resultados disponibles</p>
      </div>
    )
  }

  const fraccionBase = resultado.fraccion_base_original || ''
  const [numerBase, denomBase] = fraccionBase.split('/')

  return (
    <div className="resultado">
      <NumberDisplay input={resultado.input} />

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

      
      {resultado.input.periodo && (
        <Paso1prueba input={resultado.input} />
      )}
      {!resultado.input.periodo && (
        <div className="paso-info" style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.95rem', marginTop: '20px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <p>✓ Número decimal sin período: conversión directa a fracción completada.</p>
        </div>
      )}

      
    </div>
  )
}
import BlockMath from '../components/pasosprueba/BlockMath'

/**
 * ReductasFinitasLatex
 * 
 * Componente auxiliar que contiene funciones LaTeX para reductas finitas.
 * Exporta funciones que son usadas por ReductasFinitas.jsx
 */

/**
 * Escapa texto para LaTeX (mismo patrón que otros componentes)
 */
export const latexEscapeText = (s) => {
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

/**
 * Genera LaTeX para una fracción continua anidada hasta un índice dado
 * Ej: coeficientes [2, 2, 3] → "2 + \cfrac{1}{2 + \cfrac{1}{3}}"
 */
export const generarLatexFraccionContinuaParcial = (coeficientes) => {
  if (!coeficientes || coeficientes.length === 0) {
    return '\\text{No hay coeficientes}'
  }

  if (coeficientes.length === 1) {
    return String(coeficientes[0])
  }

  // Recursiva para construir fracciones anidadas
  const construir = (coefs, idx = 0) => {
    if (idx === coefs.length - 1) {
      return String(coefs[idx])
    }
    const actual = coefs[idx]
    const resto = construir(coefs, idx + 1)
    return `${actual} + \\cfrac{1}{${resto}}`
  }

  return construir(coeficientes)
}

/**
 * Componente que renderiza un paso de la construcción de reductas
 * Muestra: recurrencia, reducta, y fracción parcial
 */
export function PasoReducta({ paso, indice }) {
  if (!paso) return null

  const {
    a_k,
    p,
    q,
    p_prev2,
    p_prev1,
    q_prev2,
    q_prev1,
    coeficientesHasta
  } = paso

  // Detectar si es paso 0
  const isPaso0 = indice === 0

  return (
    <div className="paso-reducta-card">
      <div className="paso-reducta-header">
        <span className="paso-numero">Paso {indice}</span>
        <span className="paso-descripcion">
          {isPaso0 ? `Coeficiente inicial a₀ = ${a_k}` : `Coeficiente a₍${indice}₎ = ${a_k}`}
        </span>
      </div>

      <div className="paso-reducta-contenido">
        {/* A. Recurrencia */}
        {!isPaso0 && (
          <div className="subseccion-reducta">
            <h4>A. Fórmula de recurrencia</h4>
            <BlockMath
              math={`p_{${indice}} = ${a_k} \\cdot ${p_prev1} + ${p_prev2} = ${p},\\quad q_{${indice}} = ${a_k} \\cdot ${q_prev1} + ${q_prev2} = ${q}`}
            />
          </div>
        )}

        {/* B. Reducta (convergente) */}
        <div className="subseccion-reducta">
          <h4>B. Reducta (convergente)</h4>
          <BlockMath math={`\\frac{p_{${indice}}}{q_{${indice}}} = \\frac{${p}}{${q}}`} />
        </div>

        {/* C. Fracción continua parcial */}
        <div className="subseccion-reducta">
          <h4>C. Fracción continua parcial</h4>
          <div className="fraccion-continua-partial-label">
            {`[${coeficientesHasta.join(';')}] =`}
          </div>
          <BlockMath math={generarLatexFraccionContinuaParcial(coeficientesHasta)} />
        </div>
      </div>
    </div>
  )
}

/**
 * Componente que muestra la expansión completa de la fracción continua
 */
export function ExpansionFraccionContinua({ coeficientes, valorFinal }) {
  if (!coeficientes || coeficientes.length === 0) return null

  const latexFraccion = generarLatexFraccionContinuaParcial(coeficientes)

  return (
    <div className="expansion-fraccion-continua-card">
      <h3>🔗 Fracción continua completa</h3>

      <div className="notacion-brackets">
        <span className="bracket">[</span>
        <span className="coefs-inline">{coeficientes.join('; ')}</span>
        <span className="bracket">]</span>
      </div>

      <div className="expansion-latex">
        <BlockMath math={latexFraccion} />
      </div>

      {valorFinal && (
        <div className="valor-final-display">
          <span className="valor-label">Valor exacto:</span>
          <span className="valor-fraccion">
            {valorFinal.p}/{valorFinal.q}
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Componente que renderiza la lista compacta de todas las reductas
 */
export function ListaCompactaReductas({ reductas }) {
  if (!reductas || reductas.length === 0) return null

  return (
    <div className="lista-compacta-reductas">
      <h3>📊 Reductas</h3>
      <div className="reductas-inline">
        {reductas.map((red, idx) => (
          <span key={idx} className="reducta-item">
            {idx > 0 && <span className="separador">,</span>}
            {red.p}/{red.q}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * ReductasPeriodicasLatex.jsx
 * Componentes para renderizar cada paso del algoritmo en LaTeX
 */

import BlockMath from '../components/pasosprueba/BlockMath'

/**
 * Paso 1: Matrices del período
 */
export function PasoMatricesPeriodo({ paso }) {
  if (!paso || paso.numero !== 1) return null

  const latexMatrices = paso.matrices.map(({ coef, matriz }) => {
    const [[a, b], [c, d]] = matriz
    return `M(${coef}) = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`
  })

  return (
    <div className="paso-latex">
      <p>{paso.descripcion}</p>
      {latexMatrices.map((latex, i) => (
        <div key={i} className="latex-ecuacion">
          <BlockMath math={latex} />
        </div>
      ))}
    </div>
  )
}

/**
 * Paso 2: Producto de matrices (Matriz T)
 */
export function PasoMatrizT({ paso }) {
  if (!paso || paso.numero !== 2) return null

  const [[A, B], [C, D]] = paso.matriz
  const latex = `T = M(a_k) \\cdot M(a_{k+1}) \\cdot \\ldots \\cdot M(a_n) = \\begin{pmatrix} ${A} & ${B} \\\\ ${C} & ${D} \\end{pmatrix}`

  return (
    <div className="paso-latex">
      <p>{paso.descripcion}</p>
      <div className="latex-ecuacion">
        <BlockMath math={latex} />
      </div>
      <p className="componentes-matriz">
        donde: <code>A = {A}, B = {B}, C = {C}, D = {D}</code>
      </p>
    </div>
  )
}

/**
 * Paso 3: Ecuación en y
 */
export function PasoEcuacionY({ paso }) {
  if (!paso || paso.numero !== 3) return null

  const { a: C, b: DA, c: negB } = paso.ecuacion
  const B_coef = -negB
  const latex = `${C}y^2 + (${DA})y - ${B_coef} = 0`

  return (
    <div className="paso-latex">
      <p>{paso.descripcion}</p>
      <div className="latex-ecuacion">
        <BlockMath math={latex} />
      </div>
    </div>
  )
}

/**
 * Paso 4: Matriz P del preperíodo
 */
export function PasoMatrizP({ paso }) {
  if (!paso || paso.numero !== 4) return null

  const [[E, F], [G, H]] = paso.matriz

  const latex = paso.es_identidad
    ? `P = I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}`
    : `P = M(a_0) \\cdot M(a_1) \\cdot \\ldots \\cdot M(a_{k-1}) = \\begin{pmatrix} ${E} & ${F} \\\\ ${G} & ${H} \\end{pmatrix}`

  return (
    <div className="paso-latex">
      <p>{paso.descripcion}</p>
      <div className="latex-ecuacion">
        <BlockMath math={latex} />
      </div>
      <p className="componentes-matriz">
        donde: <code>E = {E}, F = {F}, G = {G}, H = {H}</code>
      </p>
    </div>
  )
}

/**
 * Paso 5: Relación x ↔ y
 */
export function PasoRelacionXY({ paso }) {
  if (!paso || paso.numero !== 5) return null

  const { E, F, G, H } = paso.coeficientes || {}

  if (E === undefined || F === undefined || G === undefined || H === undefined) {
    return (
      <div className="paso-latex">
        <p>{paso.descripcion}</p>
        <p className="error-paso">Error: coeficientes no disponibles</p>
      </div>
    )
  }

  return (
    <div className="paso-latex">
      <p>{paso.descripcion}</p>
      <p>Transformación de Möbius según M(a) = [[a,1],[1,0]]:</p>
      <div className="latex-ecuacion">
        <BlockMath math={`x = \\frac{${E}y + ${F}}{${G}y + ${H}}`} />
      </div>
      <p>Inversa:</p>
      <div className="latex-ecuacion">
        <BlockMath math={`y = \\frac{${H}x - ${F}}{${E} - ${G}x}`} />
      </div>
    </div>
  )
}

/**
 * Paso 6: Sustitución
 */
export function PasoSustitucion({ paso }) {
  if (!paso || paso.numero !== 6) return null

  const latex = `y = ${paso.sustitucion}`

  return (
    <div className="paso-latex">
      <p>{paso.descripcion}</p>
      <p>Sustituir esta expresión en la ecuación de <strong>y</strong>:</p>
      <div className="latex-ecuacion">
        <BlockMath math={latex} />
      </div>
    </div>
  )
}

/**
 * Paso 7: Expansión
 */
export function PasoExpansion({ paso }) {
  if (!paso || paso.numero !== 7) return null

  const { a: a_coef, b: b_coef, c: c_coef } = paso.ecuacion_expandida

  const latex = `${a_coef}x^2 + ${b_coef}x + ${c_coef} = 0`

  return (
    <div className="paso-latex">
      <p>{paso.descripcion}</p>
      <p>Después de expandir los términos:</p>
      <div className="latex-ecuacion">
        <BlockMath math={paso.expansion} />
      </div>
      <p>Simplificando:</p>
      <div className="latex-ecuacion">
        <BlockMath math={latex} />
      </div>
    </div>
  )
}

/**
 * Paso 8: Normalización
 */
export function PasoNormalizacion({ paso }) {
  if (!paso || paso.numero !== 8) return null

  const { a, b, c } = paso.ecuacion_final
  const { a: raw_a, b: raw_b, c: raw_c } = paso.ecuacion_raw || {}
  const discText =
    paso.discriminant === null
      ? 'no calculable (a=0)'
      : paso.discriminant > 0
        ? `> 0 (raíces reales)`
        : paso.discriminant === 0
          ? '= 0 (raíz doble)'
          : '< 0 (sin raíces reales)'

  const latex_final = `${a}x^{2} ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c} = 0`
  const latex_raw = raw_a !== undefined 
    ? `${raw_a}x^{2} ${raw_b >= 0 ? '+' : ''} ${raw_b}x ${raw_c >= 0 ? '+' : ''} ${raw_c} = 0`
    : null

  return (
    <div className="paso-latex">
      <p>{paso.descripcion}</p>
      
      {latex_raw && paso.normalization_factor > 1 && (
        <>
          <p><strong>Ecuación sin normalizar:</strong></p>
          <div className="latex-ecuacion">
            <BlockMath math={latex_raw} />
          </div>
          <p className="componentes-matriz">
            MCD de coeficientes: {paso.normalization_factor}
          </p>
        </>
      )}
      
      <p><strong>Ecuación normalizada:</strong></p>
      <div className="latex-ecuacion">
        <BlockMath math={latex_final} />
      </div>
      <div className="resultado-paso">
        <p>
          <strong>Discriminante:</strong> Δ = b² - 4ac = {paso.discriminant}
        </p>
        <p>
          <strong>Naturaleza:</strong> {discText}
        </p>
        {paso.raiz_positiva !== null && (
          <p>
            <strong>Raíz positiva:</strong> {paso.raiz_positiva.toFixed(10)}
          </p>
        )}
      </div>
      <div className="solucion-como-raiz">
        <p style={{ marginTop: '15px', fontWeight: '600', fontSize: '14px' }}>
          <strong>Solución general:</strong>
        </p>
        <div className="latex-ecuacion" style={{ marginTop: '10px' }}>
          <BlockMath math={paso.solucion_como_raiz} />
        </div>
      </div>
    </div>
  )
}

/**
 * Componente contenedor que renderiza el paso correcto
 */
export function PasoReducta({ paso }) {
  if (!paso) return null

  switch (paso.numero) {
    case 1:
      return <PasoMatricesPeriodo paso={paso} />
    case 2:
      return <PasoMatrizT paso={paso} />
    case 3:
      return <PasoEcuacionY paso={paso} />
    case 4:
      return <PasoMatrizP paso={paso} />
    case 5:
      return <PasoRelacionXY paso={paso} />
    case 6:
      return <PasoSustitucion paso={paso} />
    case 7:
      return <PasoExpansion paso={paso} />
    case 8:
      return <PasoNormalizacion paso={paso} />
    default:
      return null
  }
}

import { motion } from 'framer-motion'
import BlockMath from '../components/pasosprueba/BlockMath'

export default function PasoFraccionContinuaLatex({ pasos, numeradorOriginal, denominadorOriginal, base }) {
  if (!pasos || pasos.length === 0) return null

  // Función para escapar texto LaTeX
  const latexEscapeText = (s) => {
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

  // Construye la fracción continua parcial hasta el índice `limit`
  // `modoTransformacion`: si es true, el último paso muestra 1 / (divisor / residuo)
  const construirFraccionParcial = (limit, modoTransformacion = false) => {
    const construirNivel = (idx) => {
      const p = pasos[idx]
      const q = p.cociente_base
      const r = p.residuo_base
      const d = p.divisor_base

      // Último nivel a mostrar
      if (idx === limit) {
        if (r === '0') {
          return `\\text{${q}}`
        }
        if (modoTransformacion) {
          return `\\text{${q}} + \\cfrac{1}{\\frac{\\text{${d}}}{\\text{${r}}}}`
        } else {
          return `\\text{${q}} + \\frac{\\text{${r}}}{\\text{${d}}}`
        }
      }

      // Niveles intermedios
      return `\\text{${q}} + \\cfrac{1}{${construirNivel(idx + 1)}}`
    }

    return construirNivel(0)
  }

  const fracOriginal = `\\frac{\\text{${latexEscapeText(numeradorOriginal)}}}{\\text{${latexEscapeText(denominadorOriginal)}}}_{(${base})}`

  return (
    <div className="pasos-fraccion-continua">
      <h3 className="pasos-titulo">🛠️ Pasos de Construcción</h3>
      <div className="pasos-lista">
        {pasos.map((paso, i) => {
          const div = paso.dividendo_base
          const divisor = paso.divisor_base
          const q = paso.cociente_base
          const r = paso.residuo_base
          
          const isLast = (r === '0')

          return (
            <motion.div 
              key={i}
              className="paso-construccion-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="paso-construccion-header">
                <span className="paso-construccion-numero">Paso {i + 1}</span>
                <span className="paso-construccion-desc">División de {div} ÷ {divisor} en base {base}</span>
              </div>
              
              <div className="paso-construccion-contenido">
                <div className="paso-construccion-subseccion">
                  <h4>1. División y expresión</h4>
                  <BlockMath math={`\\frac{\\text{${div}}}{\\text{${divisor}}} = \\text{${q}} ${isLast ? '' : `+ \\frac{\\text{${r}}}{\\text{${divisor}}}`}`} />
                </div>

                {!isLast && (
                  <div className="paso-construccion-subseccion">
                    <h4>2. Transformación (invirtiendo el residuo)</h4>
                    <BlockMath math={`\\text{${q}} + \\frac{\\text{${r}}}{\\text{${divisor}}} \\quad \\Rightarrow \\quad \\text{${q}} + \\cfrac{1}{\\frac{\\text{${divisor}}}{\\text{${r}}}}`} />
                  </div>
                )}

                <div className="paso-construccion-subseccion">
                  <h4>3. Construcción parcial</h4>
                  <BlockMath 
                    math={`${fracOriginal} = ${construirFraccionParcial(i, !isLast)}`} 
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

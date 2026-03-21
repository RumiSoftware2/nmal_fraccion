import { motion } from 'framer-motion'
import { Eye, Calculator } from 'lucide-react'
import './NumberDisplay.css'

export default function NumberDisplay({ input }) {
  const { entero, no_periodo, periodo, base } = input

  return (
    <motion.div 
      className="number-display-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="display-header">
        <Eye size={20} />
        <h3>Vista del Número</h3>
      </div>
      
      <motion.div 
        className="numero-visual"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <p className="display-label">Representación con x en base {base}:</p>
        <div className="math-expression">
          <span className="math-inline">x =</span>
          <span className="math-value">{entero}{no_periodo ? `.${no_periodo}` : ''}{periodo ? `(${periodo})` : ''}</span>
          <span className="subscript">base {base}</span>
        </div>
        <motion.div 
          className="numero-display"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <motion.span 
            className="entero-parte"
            whileHover={{ scale: 1.1, color: "#6366f1" }}
            transition={{ type: "spring" }}
          >
            {entero}
          </motion.span>
          {(no_periodo || periodo) && (
            <span className="punto">.</span>
          )}
          {no_periodo && (
            <motion.span 
              className="no-periodo-parte"
              whileHover={{ scale: 1.1, color: "#8b5cf6" }}
              transition={{ type: "spring" }}
            >
              {no_periodo}
            </motion.span>
          )}
          {periodo && (
            <motion.span 
              className="periodo-parte"
              whileHover={{ scale: 1.1, color: "#ec4899" }}
              transition={{ type: "spring" }}
            >
              {periodo}
              <motion.div 
                className="periodo-underline"
                initial={{ width: 0, top: 0 }}
                animate={{ width: "100%", top: -6 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              />
            </motion.span>
          )}
          <sub className="base-subscript">{base}</sub>
        </motion.div>
      </motion.div>

      <motion.div 
        className="number-legend"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <div className="legend-item">
          <div className="legend-color entero-color"></div>
          <span>Parte Entera</span>
        </div>
        {no_periodo && (
          <div className="legend-item">
            <div className="legend-color no-periodo-color"></div>
            <span>No Período</span>
          </div>
        )}
        {periodo && (
          <div className="legend-item">
            <div className="legend-color periodo-color"></div>
            <span>Período (se repite)</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
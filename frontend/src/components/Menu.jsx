import { motion } from 'framer-motion'
import { Calculator, Brain, Sparkles } from 'lucide-react'
import './Menu.css'

const programs = [
  {
    id: 'math-tutor',
    title: 'n-mal como división de dos naturales',
    description: 'Convierte n-males a división de dos naturales',
    icon: Calculator,
    iconColor: 'linear-gradient(135deg, #7fb3d5 0%, #a8c8e8 100%)'
  },
  {
    id: 'periodic-decimal',
    title: 'Operaciones de n-males',
    description: 'Opera (sumas, restas, multiplicación y división) un n.mal con otro n.mal en la misma base',
    icon: Brain,
    iconColor: 'linear-gradient(135deg, #c8b8e6 0%, #ddd4f0 100%)'
  },
  {
    id: 'base-converter',
    title: 'Cambio de Base',
    description: 'Convierte números n-mal entre diferentes bases',
    icon: Sparkles,
    iconColor: 'linear-gradient(135deg, #82c4a5 0%, #a8dcc0 100%)',
    disabled: false
  }
]

export default function Menu({ onSelectProgram }) {
  return (
    <div className="menu-container">
      <motion.a
        className="return-report-btn"
        href="https://sites.google.com/view/cursodesistemasnumericos/c%C3%B3digos"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        📄 Regresar
      </motion.a>

      <motion.div
        className="menu-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>🧮 Centro de Programas Matemáticos</h1>
        <p>Selecciona una herramienta para comenzar</p>
      </motion.div>

      <motion.div
        className="programs-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        {programs.map((program, index) => (
          <motion.div
            key={program.id}
            className={`program-card ${program.disabled ? 'disabled' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.35 }}
            whileHover={!program.disabled ? { scale: 1.03 } : {}}
            whileTap={!program.disabled ? { scale: 0.97 } : {}}
            onClick={() => !program.disabled && onSelectProgram(program.id)}
          >
            <div className="program-icon" style={{ background: program.iconColor }}>
              <program.icon size={28} />
            </div>
            <h3>{program.title}</h3>
            <p>{program.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

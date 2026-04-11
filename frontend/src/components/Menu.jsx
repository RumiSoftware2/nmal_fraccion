import { motion } from 'framer-motion'
import { Calculator, Brain, Trophy, Sparkles, BookOpen, Code } from 'lucide-react'
import './Menu.css'

const programs = [
  {
    id: 'math-tutor',
    title: 'n-mal como división de dos naturales',
    description: 'Convierte números periódicos a fracciones',
    icon: Calculator,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'periodic-decimal',
    title: 'Operaciones de n-males',
    description: 'Convierte decimales periódicos y normales a fracciones',
    icon: Brain,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'base-converter',
    title: 'Cambio de Base',
    description: 'Convierte números n-mal entre diferentes bases',
    icon: Sparkles,
    gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
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
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        📄 Regresar a Sistemas Numéricos
      </motion.a>

      <motion.div
        className="menu-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>🧮 Centro de Programas Matemáticos</h1>
        <p>Selecciona una herramienta para comenzar</p>
      </motion.div>

      <motion.div
        className="programs-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {programs.map((program, index) => (
          <motion.div
            key={program.id}
            className={`program-card ${program.disabled ? 'disabled' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            whileHover={!program.disabled ? { scale: 1.05 } : {}}
            whileTap={!program.disabled ? { scale: 0.95 } : {}}
            onClick={() => !program.disabled && onSelectProgram(program.id)}
          >
            <div className="program-icon" style={{ background: program.gradient }}>
              <program.icon size={32} />
            </div>
            <h3>{program.title}</h3>
            <p>{program.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
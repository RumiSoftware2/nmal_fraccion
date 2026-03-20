import { motion } from 'framer-motion'
import { Calculator, Brain, Trophy, Sparkles, BookOpen, Code } from 'lucide-react'
import './Menu.css'

const programs = [
  {
    id: 'math-tutor',
    title: 'Math Tutor Pro',
    description: 'Convierte números periódicos a fracciones',
    icon: Calculator,
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'coming-soon',
    title: 'Próximamente',
    description: 'Más herramientas matemáticas',
    icon: Sparkles,
    color: 'from-green-500 to-teal-600',
    disabled: true
  }
]

export default function Menu({ onSelectProgram }) {
  return (
    <div className="menu-container">
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
            <div className={`program-icon bg-gradient-to-br ${program.color}`}>
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
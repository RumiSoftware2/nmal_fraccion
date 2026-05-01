import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import './AppHeader.css'

const PROGRAM_CONFIG = {
  'math-tutor': {
    title: 'N-mal como División de dos Naturales',
    description: 'Convierte decimales periódicos y normales a fracciones',
    emoji: '📐'
  },
  'periodic-decimal': {
    title: 'Operaciones de N-males',
    description: 'Opera (sumas, restas, multiplicación y división) n-males en la misma base',
    emoji: '📊'
  },
  'base-converter': {
    title: 'Conversor de Bases',
    description: 'Convierte números n-mal entre diferentes bases numéricas',
    emoji: '🔄'
  }
}

export default function AppHeader({ programId, onMenuClick, escudo }) {
  const config = PROGRAM_CONFIG[programId]

  return (
    <motion.header
      className="app-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="app-header-inner">
        <div className="app-header-brand">
          <motion.img
            src={escudo}
            alt="Escudo Universidad Pedagógica"
            className="app-header-logo"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.2 }}
          />
          <div className="app-header-text">
            <h1>{config.emoji} {config.title}</h1>
            <p>{config.description}</p>
          </div>
        </div>

        <motion.button
          className="app-header-menu-btn"
          onClick={onMenuClick}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <ArrowLeft size={16} />
          <span>Menú Principal</span>
        </motion.button>
      </div>
    </motion.header>
  )
}

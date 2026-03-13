import { motion } from 'framer-motion'
import { Calculator, BookOpen, Lightbulb } from 'lucide-react'

export default function MathCard({ children, title, icon = 'calculator', color = 'primary' }) {
  const getIcon = () => {
    switch(icon) {
      case 'book': return <BookOpen size={24} />
      case 'lightbulb': return <Lightbulb size={24} />
      default: return <Calculator size={24} />
    }
  }

  const getColorClass = () => {
    switch(color) {
      case 'secondary': return 'card-secondary'
      case 'accent': return 'card-accent'
      default: return 'card-primary'
    }
  }

  return (
    <motion.div
      className={`math-card ${getColorClass()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="card-header">
        <div className="card-icon">
          {getIcon()}
        </div>
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-content">
        {children}
      </div>
    </motion.div>
  )
}

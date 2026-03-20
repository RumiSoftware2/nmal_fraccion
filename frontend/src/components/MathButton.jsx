import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import './MathButton.css'

export default function MathButton({ 
  children, 
  onClick, 
  loading = false, 
  disabled = false,
  variant = 'primary',
  size = 'medium',
  icon = null 
}) {
  const getVariantClass = () => {
    switch(variant) {
      case 'secondary': return 'btn-secondary'
      case 'outline': return 'btn-outline'
      default: return 'btn-primary'
    }
  }

  const getSizeClass = () => {
    switch(size) {
      case 'small': return 'btn-small'
      case 'large': return 'btn-large'
      default: return 'btn-medium'
    }
  }

  return (
    <motion.button
      className={`math-btn ${getVariantClass()} ${getSizeClass()}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="loading-spinner"
        >
          <Loader2 size={20} />
        </motion.div>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  )
}

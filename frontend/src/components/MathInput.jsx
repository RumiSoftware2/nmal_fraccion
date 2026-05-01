import { motion } from 'framer-motion'
import { useState } from 'react'
import './MathInput.css'

export default function MathInput({ 
  label, 
  name,
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  icon = null,
  helpText = null,
  min,
  step,
  max,
  required,
  pattern,
  error 
}) {
  const [focused, setFocused] = useState(false)

  return (
    <motion.div 
      className={`math-input-group ${error ? 'has-error' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label className="math-label">
          {icon && <span className="label-icon">{icon}</span>}
          {label}
        </label>
      )}
      <div className={`input-wrapper ${focused ? 'focused' : ''}`}>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="math-input"
          min={min}
          step={step}
          max={max}
          required={required}
          pattern={pattern}
        />
        <div className="input-border"></div>
      </div>
      {error && (
        <motion.p 
          className="input-error-msg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
      {!error && helpText && (
        <motion.p 
          className="input-help"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          {helpText}
        </motion.p>
      )}
    </motion.div>
  )
}

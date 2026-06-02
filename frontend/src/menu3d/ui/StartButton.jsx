import React from 'react'
import { motion } from 'framer-motion'
import './StartButton.css'

export default function StartButton({ onClick, delay = 0.75 }) {
  return (
    <motion.button
      className="mt-start-btn"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      Empezar
    </motion.button>
  )
}

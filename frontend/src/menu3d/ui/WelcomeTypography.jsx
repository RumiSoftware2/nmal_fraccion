import React from 'react'
import { motion } from 'framer-motion'
import './WelcomeTypography.css'

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function WelcomeTypography({ isStatic = false }) {
  // Do not destructure context here to avoid crashes when provider is absent.
  // Parallax uses CSS vars set on the container by WelcomePointerProvider.

  const title = 'Bienvenidos Apps Matemáticas'
  const subtitle = 'Sistemas Numéricos'
  const upn = 'Universidad Pedagógica Nacional'

  const words = title.split(' ')

  return (
    <div className={"welcome-typography" + (isStatic ? ' welcome-typography--static' : '')} aria-hidden>
      <motion.h1 className="wm-title" initial="hidden" animate="visible" variants={{}}>
        {words.map((w, i) => (
          <motion.span className="wm-word" key={i} variants={wordVariants} transition={{ delay: i * 0.06, duration: 0.45 }}>
            {w}&nbsp;
          </motion.span>
        ))}
      </motion.h1>

      <motion.p className="wm-subtitle" initial={{ opacity: 0, letterSpacing: '6px' }} animate={{ opacity: 1, letterSpacing: '2px' }} transition={{ delay: 0.35, duration: 0.45 }}>
        {subtitle}
      </motion.p>

      <motion.p className="wm-upn" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.45 }}>
        {upn}
      </motion.p>
    </div>
  )
}

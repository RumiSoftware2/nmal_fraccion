import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import './ContinuedFractionDecor.css'

const bottomSteps = ['\\sqrt{2}', '=', '[1;', '\\overline{2}', ']']

export default function ContinuedFractionDecor() {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    function onResize() {
      setCompact(window.innerWidth <= 480)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const bottomHtml = useMemo(() => bottomSteps.map(s => {
    try { return katex.renderToString(s, { throwOnError: false }) } catch (e) { return s }
  }), [])

  const topExpr = compact ? '[1;\\overline{2}]' : '1 + \\cfrac{1}{2 + \\cfrac{1}{2 + \\cfrac{1}{2}}}'
  const topHtml = useMemo(() => {
    try { return katex.renderToString(topExpr, { throwOnError: false }) } catch (e) { return topExpr }
  }, [topExpr])

  return (
    <div className="cf-decor" aria-hidden>
      <div className="cf-badge cf-badge--bl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: compact ? 0.45 : 0.55 }} transition={{ delay: 0.9, duration: 0.6 }} className="cf-badge-inner">
          {bottomHtml.map((h, i) => (
            <motion.span key={i} className="cf-step" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 + i * 0.35, duration: 0.32 }} dangerouslySetInnerHTML={{ __html: h }} />
          ))}
        </motion.div>
      </div>

      <div className="cf-badge cf-badge--tr">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: compact ? 0.45 : 0.55 }} transition={{ delay: 1.4, duration: 0.6 }} className="cf-badge-inner">
          <div dangerouslySetInnerHTML={{ __html: topHtml }} />
        </motion.div>
      </div>
    </div>
  )
}

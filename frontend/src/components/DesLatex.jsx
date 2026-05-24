import React from 'react'
import BlockMath from './pasosprueba/BlockMath'

export default function DesLatex({ math, compact = true, className = '' }) {
  if (!math) return null
  const classes = [`des-latex`, compact ? 'des-latex--compact' : '', className].filter(Boolean).join(' ')
  return (
    <div className={classes}>
      <BlockMath math={math} />
    </div>
  )
}

export const MENU_NOTATIONS = {
  mathTutor: '[a_0;a_1,\\ldots,a_k,\\overline{a_{k+1},\\ldots,a_n}] = \\frac{n}{m}',
}

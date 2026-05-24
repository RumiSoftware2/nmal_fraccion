import React from 'react'
import DesLatex from './DesLatex'

export default function MenuProgramCard({ program, onClick, moduleTheme = '' }) {
  const cls = `program-card ${program.disabled ? 'disabled' : ''} ${moduleTheme ? `program-card--${moduleTheme}` : ''}`.trim()
  return (
    <div className={cls} onClick={() => !program.disabled && onClick(program.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && !program.disabled && onClick(program.id)}>
      <div className="program-icon" style={{ background: program.iconColor }}>
        <program.icon size={28} />
      </div>
      <h3>{program.title}</h3>
      {program.notationLatex && (
        <DesLatex math={program.notationLatex} compact variant={moduleTheme === 'nmales' ? 'card' : 'inline'} scroll={moduleTheme === 'nmales'} />
      )}
      <p>{program.description}</p>
    </div>
  )
}

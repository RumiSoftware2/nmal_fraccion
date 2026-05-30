import React from 'react'
import DesLatex from './DesLatex'

export default function MenuProgramCard({ program, onClick, moduleTheme = '' }) {
  const cls = `program-card ${program.disabled ? 'disabled' : ''} ${moduleTheme ? `program-card--${moduleTheme}` : ''}`.trim()
  return (
    <div className={cls} onClick={() => !program.disabled && onClick(program.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && !program.disabled && onClick(program.id)}>
      {program.moduleIndex != null && (
        <span className="program-module-badge" title={program.folder}>
          Módulo {program.moduleIndex}
        </span>
      )}
      <div className="program-icon" style={{ background: program.iconColor }}>
        <program.icon size={28} />
      </div>
      <h3>{program.title}</h3>
      {program.folder && <div className="program-folder muted" style={{ fontFamily: 'monospace', fontSize: '0.8rem', marginTop: 6 }}>{program.folder}</div>}
      {program.notationLatex && (
        <DesLatex math={program.notationLatex} compact variant={moduleTheme === 'nmales' ? 'card' : 'inline'} scroll={moduleTheme === 'nmales'} />
      )}
      <p>{program.description}</p>
    </div>
  )
}

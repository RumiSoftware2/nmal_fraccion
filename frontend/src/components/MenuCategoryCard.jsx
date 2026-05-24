import React from 'react'
import DesLatex from './DesLatex'

export default function MenuCategoryCard({ category, onClick }) {
  const cls = `category-card category-card--${category.id}`
  return (
    <div className={cls} onClick={() => onClick(category.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick(category.id)}>
      <div className="program-icon" style={{ background: category.iconColor }}>
        <category.icon size={48} />
      </div>
      <h3>{category.title}</h3>
      {category.notationLatex && <DesLatex math={category.notationLatex} compact variant="card" />}
      <p>{category.description}</p>
      {category.programCount && <div className="category-badge">{category.programCount} herramientas</div>}
    </div>
  )
}

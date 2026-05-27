import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Calculator, Brain, Sparkles, Link2, ArrowRightLeft, Repeat, Layers, Infinity } from 'lucide-react'
import './Menu.css'
import DesLatex from './DesLatex'
import MenuCategoryCard from './MenuCategoryCard'
import MenuProgramCard from './MenuProgramCard'

const programs = [
  {
    id: 'math-tutor',
    title: 'n-mal como división de dos naturales',
    description: 'Convierte n-males a división de dos naturales',
    notationLatex: "a_0.a_1 \\ldots a_k \\overline {a_{k+1} \\ldots a_n} = \\frac{n}{m}",
    category: 'nmales',
    icon: Calculator,
    iconColor: 'linear-gradient(135deg, #7fb3d5 0%, #a8c8e8 100%)'
  },
  {
    id: 'periodic-decimal',
    title: 'Operaciones de n-males',
    description: 'Opera (sumas, restas, multiplicación y división) un n.mal con otro n.mal en la misma base',
    notationLatex: "a_0.a_1 \\ldots a_k \\overline {a_{k+1} \\ldots a_n} \\pm b_0.b_1 \\ldots b_k \\overline {b_{k+1} \\ldots b_n}",
    category: 'nmales',
    icon: Brain,
    iconColor: 'linear-gradient(135deg, #c8b8e6 0%, #ddd4f0 100%)'
  },
  {
    id: 'base-converter',
    title: 'Cambio de Base',
    description: 'Convierte números n-mal entre diferentes bases',
    notationLatex: "a_0.a_1 \\ldots a_k \\overline {a_{k+1} \\ldots a_n}_{(B_1)} \\Longleftrightarrow c_0.c_1 \\ldots c_k \\overline {c_{k+1} \\ldots c_n}_{(B_2)}",
    category: 'nmales',
    icon: Sparkles,
    iconColor: 'linear-gradient(135deg, #82c4a5 0%, #a8dcc0 100%)',
    disabled: false
  },
  {
    id: 'fraccion-continua',
    title: 'Fracción Continua Simple finita',
    description: 'Descompone una fracción c/d en su representación como fracción continua [a₁, a₂, ..., aₙ] usando el algoritmo de Euclides',
    notationLatex: "\\frac{c}{d} = [a_0;a_1,\\ldots,a_n]",
    category: 'fracciones-continuas',
    icon: Link2,
    iconColor: 'linear-gradient(135deg, #f5a623 0%, #f7b731 100%)'
  },
  {
    id: 'fraccion-continua-periodica',
    title: 'Fracción Continua  simple Periódica infinita',
    description: 'Calcula la expansión periódica de √p en fracción continua simple (ej: √7 = [2; 1, 1, 1, 4, ...])',
    notationLatex: "\\sqrt{7} = [2;\\overline{1,1,1,4}]",
    category: 'fracciones-continuas',
    icon: Repeat,
    iconColor: 'linear-gradient(135deg, #5e72e4 0%, #825ee4 100%)'
  },
  {
    id: 'conversor-fraccion-bases',
    title: 'Convertir fracción a otra base',
    description: 'Ingresa una fracción en cualquier base de partida y transfórmala a otra base de llegada con pasos detallados',
    notationLatex: "{\\frac{c}{d}}_{(B_2)} \\Longleftrightarrow {\\frac{a}{b}}_{(B_1)}",
    category: 'nmales',
    icon: ArrowRightLeft,
    iconColor: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
  },
  {
    id: 'reductas-finitas',
    title: 'Reductas Finitas',
    description: 'Ingresa [a₀; a₁, a₂, …] y obtén las reductas (convergentes) con paso a paso en LaTeX',
    notationLatex: "[a_0;a_1,a_2,\\ldots] \\Rightarrow \\frac{p}{q},\\frac{r}{s},\\ldots",
    category: 'fracciones-continuas',
    icon: Layers,
    iconColor: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)'
  },
  {
    id: 'reductas-periodicas',
    title: 'Fracción continua a irracional cuadrático',
    description: 'Fracción continua eventualmente periódica → ecuación cuadrática (sin backend)',
    notationLatex: "[a_0;a_1,\\ldots,a_k,\\overline{a_{k+1},\\ldots,a_n}] = \\frac{a \\pm \\sqrt{p}}{b}",
    category: 'fracciones-continuas',
    icon: Infinity,
    iconColor: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
  }
]

const categories = [
  {
    id: 'nmales',
    title: 'Números n-males',
    description: 'Representación, operaciones y cambio de base',
    notationLatex: "a_0.a_1 \\ldots a_k \\overline{a_{k+1} \\ldots a_n}_{(b)}",
    icon: Calculator,
    iconColor: 'linear-gradient(135deg, #7fb3d5 0%, #a8c8e8 100%)',
    programCount: 4
  },
  {
    id: 'fracciones-continuas',
    title: 'Fracciones continuas',
    description: 'Simples, periódicas y reductas',
    notationLatex: "\\frac{c}{d} = [a_0;a_1,\\ldots] \\quad ; \\quad \\frac{a \\pm \\sqrt{p}}{b}",
    icon: Infinity,
    iconColor: 'linear-gradient(135deg, #5e72e4 0%, #8b5cf6 100%)',
    programCount: 4
  }
]

export default function Menu({ onSelectProgram }) {
  const [view, setView] = useState('home')
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 })
  }

  const goToCategory = (catId) => { setDirection(1); setView(catId) }
  const goHome = () => { setDirection(-1); setView('home') }

  const currentCategory = categories.find(c => c.id === view)

  return (
    <div className="menu-container" data-theme={view === 'home' ? 'home' : view}>
      <motion.a
        className="return-report-btn"
        href="https://sites.google.com/view/cursodesistemasnumericos/aplicativos"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        📄 Regresar sistemas númericos
      </motion.a>

      <motion.div
        className="menu-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>🧮 Centro de Programas Matemáticos</h1>
        <p>Selecciona una herramienta para comenzar</p>
      </motion.div>

      <div className="menu-stage">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          {view === 'home' && (
            <motion.div key="home" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <motion.div className="categories-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                {categories.map((cat) => (
                  <MenuCategoryCard key={cat.id} category={cat} onClick={(id) => goToCategory(id)} />
                ))}
              </motion.div>
            </motion.div>
          )}

          {view !== 'home' && (
            <motion.div key={view} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <header className="menu-module-banner">
                <button type="button" className="menu-back-btn" onClick={goHome}>
                  <span className="menu-back-icon" aria-hidden>←</span>
                  <span>Volver al menú</span>
                </button>
                <div className="menu-module-header">
                  <h2 className="menu-module-title">{currentCategory ? currentCategory.title : 'Módulo'}</h2>
                  <p className="menu-module-subtitle">{currentCategory ? currentCategory.description : ''}</p>
                </div>
              </header>

              <div className={`programs-grid programs-grid--sub ${view === 'nmales' ? 'programs-grid--nmales' : ''}`}>
                {programs.filter(p => p.category === view).map((program, index) => (
                  <motion.div key={program.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * index, duration: 0.35 }}>
                    <MenuProgramCard program={program} onClick={onSelectProgram} moduleTheme={view} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

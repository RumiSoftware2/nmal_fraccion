import { motion } from 'framer-motion'
import PasoDefinimos from './PasoDefinimos'
import PasoMultiplicaTodo from './PasoMultiplicaTodo'
import PasoMultiplicaAntes from './PasoMultiplicaAntes'
import PasoRestaColumnas from './PasoRestaColumnas'
import PasoResultado from './PasoResultado'

import { useMemo, useState } from 'react'

export default function Paso1prueba({ input }) {
  const { entero, no_periodo, periodo, base } = input
  const [activeStep, setActiveStep] = useState(0)

  const xString = `${entero}${no_periodo ? '.' + no_periodo : ''}${periodo ? `(${periodo})` : ''}`

  const steps = useMemo(
    () => [
      {
        label: 'Definimos',
        component: (
          <PasoDefinimos
            entero={entero}
            no_periodo={no_periodo}
            periodo={periodo}
            base={base}
          />
        ),
      },
      {
        label: 'Multiplica todo',
        component: (
          <PasoMultiplicaTodo
            entero={entero}
            no_periodo={no_periodo}
            periodo={periodo}
            base={base}
          />
        ),
      },
      {
        label: 'Multiplica antes',
        component: (
          <PasoMultiplicaAntes entero={entero} no_periodo={no_periodo} base={base} />
        ),
      },
      {
        label: 'Resta columnas',
        component: (
          <PasoRestaColumnas
            entero={entero}
            no_periodo={no_periodo}
            periodo={periodo}
            base={base}
          />
        ),
      },
      {
        label: 'Resultado',
        component: (
          <PasoResultado
            entero={entero}
            no_periodo={no_periodo}
            periodo={periodo}
            base={base}
          />
        ),
      },
    ],
    [entero, no_periodo, periodo, base]
  )

  return (
    <motion.div
      className="math-step-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <h3>Paso prueba: multiplicación en base {base} y resta</h3>

      <div className="step-tabs">
        {steps.map((step, index) => (
          <button
            key={step.label}
            className={`step-tab ${index === activeStep ? 'active' : ''}`}
            onClick={() => setActiveStep(index)}
            type="button"
          >
            <strong>{index + 1}</strong>. {step.label}
          </button>
        ))}
      </div>

      <div className="step-content">{steps[activeStep].component}</div>

      <p>
        Número: <strong>{xString}</strong> (base {base})
      </p>
    </motion.div>
  )
}

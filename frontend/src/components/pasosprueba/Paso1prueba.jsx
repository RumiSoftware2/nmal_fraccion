import { motion } from 'framer-motion'
import PasoDefinimos       from './PasoDefinimos'
import PasoMultiplicaTodo  from './PasoMultiplicaTodo'
import PasoMultiplicaAntes from './PasoMultiplicaAntes'
import PasoRestaColumnas   from './PasoRestaColumnas'
import PasoResultado       from './PasoResultado'

export default function Paso1prueba({ input }) {
  const { entero, no_periodo, periodo, base } = input

  const xString = `${entero}${no_periodo ? '.' + no_periodo : ''}${periodo ? `(${periodo})` : ''}`

  return (
    <motion.div
      className="math-step-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <h3>Paso 1: multiplicación en base {base} y resta</h3>

      <PasoDefinimos
        entero={entero}
        no_periodo={no_periodo}
        periodo={periodo}
        base={base}
      />

      <PasoMultiplicaTodo
        entero={entero}
        no_periodo={no_periodo}
        periodo={periodo}
        base={base}
      />

      <PasoMultiplicaAntes
        entero={entero}
        no_periodo={no_periodo}
        base={base}
      />

      <PasoRestaColumnas
        entero={entero}
        no_periodo={no_periodo}
        periodo={periodo}
        base={base}
      />

      <PasoResultado
        entero={entero}
        no_periodo={no_periodo}
        periodo={periodo}
        base={base}
      />

      <p>
        Número: <strong>{xString}</strong> (base {base})
      </p>
    </motion.div>
  )
}

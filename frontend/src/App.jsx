import ConversionForm from './components/ConversionForm'
import ResultPanel from './components/ResultPanel'
import NumberDisplay from './components/NumberDisplay'
import { useConversion } from './hooks/useConversion'

export default function App() {
  const { resultado, error, loading, convertir } = useConversion()

  return (
    <div className="container">
      <header className="header">
        <h1>📐 Math Tutor</h1>
        <p>Convertidor de números periódicos a fracciones</p>
      </header>
      <main className="content">
        <ConversionForm onSubmit={convertir} loading={loading} />
        {error && <p className="error">{error}</p>}
        {resultado && (
          <>
            <NumberDisplay input={resultado.input} />
            <ResultPanel resultado={resultado} />
          </>
        )}
      </main>
    </div>
  )
}
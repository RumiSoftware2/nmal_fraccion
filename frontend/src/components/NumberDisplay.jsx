export default function NumberDisplay({ input }) {
  const { entero, no_periodo, periodo, base } = input
  return (
    <div className="numero-visual">
      <p>Número periódico en base {base}:</p>
      <div className="numero-display">
        <span className="entero-parte">{entero}</span>
        <span className="punto">,</span>
        {no_periodo && <span className="no-periodo-parte">{no_periodo}</span>}
        <span className="periodo-parte">{periodo}</span>
        <sub>{base}</sub>
      </div>
    </div>
  )
}
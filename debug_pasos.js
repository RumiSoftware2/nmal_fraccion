import { procesarFCPeriodica } from './frontend/src/componente8/cerebro8.js'

const res = procesarFCPeriodica('1;3,(1,4)')

console.log('Validación de pasos del papel para 1;3,(1,4):')
console.log('Número de pasos:', res.pasos_papel.length)

if (res.pasos_papel && res.pasos_papel.length === 8) {
  // Paso 1
  const p1 = res.pasos_papel[0]
  console.log('\nPaso 1 - Interpretación:')
  p1.lineasLatex.forEach(l => console.log('  ' + l))
  console.log('  ✓ Contiene cfrac:', p1.lineasLatex.some(l => l.includes('\\cfrac')))

  // Paso 3
  const p3 = res.pasos_papel[2]
  console.log('\nPaso 3 - Resolviendo período (' + p3.lineasLatex.length + ' líneas):')
  p3.lineasLatex.forEach((l, i) => console.log('  [' + (i+1) + '] ' + l))

  // Paso 7
  const p7 = res.pasos_papel[6]
  console.log('\nPaso 7 - Racionalización (destacado:', p7.destacado + '):')
  p7.lineasLatex.forEach(l => console.log('  ' + l))

  // Paso 8
  const p8 = res.pasos_papel[7]
  console.log('\nPaso 8 - Polinomio (destacado:', p8.destacado + '):')
  p8.lineasLatex.forEach(l => console.log('  ' + l))
}

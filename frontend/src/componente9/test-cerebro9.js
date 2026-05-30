import { procesarFCGeneralizada, calcularReductasGeneralizadas } from './cerebro9.js'

console.log('TESTS cerebro9 - Reductas FC Generalizadas')

function approxEqual(a, b, tol = 1e-9) {
  return Math.abs(a - b) < tol
}

// Test 1: caso simple b_i = 1 debe coincidir con recurrencia de fracciones continuas simples
const filasSimple = [
  { a: 2, b: 1 },
  { a: 1, b: 1 },
  { a: 2, b: 1 },
  { a: 3, b: 1 }
]

const resSimple = procesarFCGeneralizada(filasSimple)
if (!resSimple.ok) {
  console.log('✗ Error:', resSimple.error)
} else {
  console.log('✓ procesarFCGeneralizada OK (simple)')
  console.log('  Notación pares:', resSimple.latexPares)
  console.log('  Reductas:')
  resSimple.reductas.forEach(r => console.log(`   k=${r.k}: ${r.p}/${r.q} ≈ ${r.decimal}`))
}

// Test 2: verificar recurrencia manualmente en un ejemplo
const filas = [
  { a: 2, b: 1 },
  { a: 1, b: 3 },
  { a: 2, b: 2 },
  { a: 3, b: 1 }
]

const calc = calcularReductasGeneralizadas(filas)
if (!calc.ok) {
  console.log('✗ Error en cálculo:', calc.error)
} else {
  console.log('✓ calcularReductasGeneralizadas OK')
  calc.reductas.forEach(r => console.log(`  k=${r.k}: P=${r.P}, Q=${r.Q}, simpl=${r.p}/${r.q}, dec=${r.decimal}`))
}

console.log('FIN tests cerebro9')

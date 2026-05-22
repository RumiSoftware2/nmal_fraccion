/**
 * test-cerebro8.js
 * Pruebas manuales para el módulo de reductas periódicas
 */

import {
  parsearFCPeriodica,
  procesarFCPeriodica,
  matrizM,
  multiplicarMatrices,
  productoMatrices,
  construirMatrizPeriodo,
  ecuacionCuadraticaDesdeT,
  construirMatrizPreperiodo,
  normalizarEcuacion,
  sustituirYenCuadratica,
  relacionXyDesdeP
} from './cerebro8.js'

console.log('='.repeat(60))
console.log('TESTS DE CEREBRO8.JS')
console.log('='.repeat(60))

// ============================================================
// TEST 1: Parseo
// ============================================================
console.log('\nTEST 1: Parseo')
console.log('-'.repeat(60))

const testParseos = [
  { input: '1;2(34)', expected: { preperiod: [1, 2], period: [3, 4] } },
  { input: '5;(12)', expected: { preperiod: [5], period: [1, 2] } },
  { input: ';(3,4)', expected: { preperiod: [], period: [3, 4] } },
  { input: '1234;12(323)', expected: { preperiod: [1, 2, 3, 4, 1, 2], period: [3, 2, 3] } },
  { input: '1;2,3(3,4)', expected: { preperiod: [1, 2, 3], period: [3, 4] } }
]

testParseos.forEach(({ input, expected }) => {
  const result = parsearFCPeriodica(input)
  const pass =
    result.ok &&
    JSON.stringify(result.preperiod) === JSON.stringify(expected.preperiod) &&
    JSON.stringify(result.period) === JSON.stringify(expected.period)
  console.log(
    `${pass ? '✓' : '✗'} "${input}" → pre: [${result.preperiod.join(',')}], per: [${result.period.join(',')}]`
  )
  if (!pass && result.ok) {
    console.log(`  Esperado: pre: [${expected.preperiod.join(',')}], per: [${expected.period.join(',')}]`)
  }
})

// ============================================================
// TEST 2: Matrices
// ============================================================
console.log('\nTEST 2: Matrices')
console.log('-'.repeat(60))

const m3 = matrizM(3)
console.log(`M(3) = ${JSON.stringify(m3)} (expected [[3,1],[1,0]])`)

const m4 = matrizM(4)
console.log(`M(4) = ${JSON.stringify(m4)} (expected [[4,1],[1,0]])`)

const m3m4 = multiplicarMatrices(m3, m4)
console.log(`M(3) · M(4) = ${JSON.stringify(m3m4)}`)
// M(3) = [[3,1],[1,0]], M(4) = [[4,1],[1,0]]
// [[3*4 + 1*1, 3*1 + 1*0], [1*4 + 0*1, 1*1 + 0*0]] = [[13, 3], [4, 1]]
const expectedM3M4 = JSON.stringify([[13, 3], [4, 1]])
const passM3M4 = JSON.stringify(m3m4) === expectedM3M4
console.log(`✓ Correcta` + (passM3M4 ? '' : ' (EXPECTED ' + expectedM3M4 + ')'))

// ============================================================
// TEST 3: Caso de referencia: 1;2(34)
// ============================================================
console.log('\nTEST 3: Referencia [1;2(34)] → 8x² - 10x - 11 = 0')
console.log('-'.repeat(60))

const result = procesarFCPeriodica('1;2(34)')

if (!result.ok) {
  console.log('✗ Error en parseo:', result.error)
} else {
  console.log(`✓ Parseo OK`)
  console.log(`  Notación: ${result.continued_fraction}`)
  console.log(`  Preperíodo: [${result.preperiod.join(',')}]`)
  console.log(`  Período: [${result.period.join(',')}]`)

  console.log(`\n  Matriz T:`, result.matrix_T)
  console.log(`    A=${result.matrix_T[0][0]}, B=${result.matrix_T[0][1]}`)
  console.log(`    C=${result.matrix_T[1][0]}, D=${result.matrix_T[1][1]}`)

  console.log(`\n  Ecuación en y:`)
  const { a: Cy, b: Da_y, c: negB } = result.equation_y
  console.log(`    ${Cy}y² + ${Da_y}y - ${-negB} = 0`)

  console.log(`\n  Matriz P:`, result.matrix_P)
  console.log(`    E=${result.matrix_P[0][0]}, F=${result.matrix_P[0][1]}`)
  console.log(`    G=${result.matrix_P[1][0]}, H=${result.matrix_P[1][1]}`)

  console.log(`\n  Ecuación en x (raw):`, result.equation_x_raw)

  console.log(`\n  Ecuación en x (normalizada):`, result.equation_x)
  console.log(`    ${result.equation_x.a}x² + ${result.equation_x.b}x + ${result.equation_x.c} = 0`)

  console.log(`\n  Polinomio mínimo: ${result.minimal_polynomial}`)

  const expectedEq = '8x² - 10x - 11 = 0'
  const actualEq = `${result.equation_x.a}x² ${result.equation_x.b >= 0 ? '+' : ''} ${result.equation_x.b}x ${result.equation_x.c >= 0 ? '+' : ''} ${result.equation_x.c} = 0`
    .replace('+ -', '- ')
    .replace(/ \+ 0 =/, ' =')
    .replace(/ - 0 =/, ' =')

  const passEquation =
    result.equation_x.a === 8 &&
    result.equation_x.b === -10 &&
    result.equation_x.c === -11
  console.log(`\n  ${passEquation ? '✓' : '✗'} Ecuación: ${result.minimal_polynomial}`)
  if (!passEquation) {
    console.log(`    Esperada: ${expectedEq}`)
  }

  console.log(`\n  Discriminante: ${result.discriminant}`)
  console.log(`  Raíces: [${result.roots.map((r) => r.toFixed(10)).join(', ')}]`)
  console.log(`  Raíz positiva (aprox): ${result.numerical_approximation?.toFixed(10)}`)
  console.log(`  Irreducible: ${result.is_irreducible}`)
}

// ============================================================
// TEST 4: Caso sin preperíodo
// ============================================================
console.log('\nTEST 4: Sin preperíodo `;(2,3)`')
console.log('-'.repeat(60))

const result2 = procesarFCPeriodica(';(2,3)')
if (!result2.ok) {
  console.log('✗ Error:', result2.error)
} else {
  console.log(`✓ Parseo OK`)
  console.log(`  Notación: ${result2.continued_fraction}`)
  console.log(`  Preperíodo: [${result2.preperiod.join(',')}]`)
  console.log(`  Período: [${result2.period.join(',')}]`)
  console.log(`  Ecuación: ${result2.minimal_polynomial}`)
}

// ============================================================
// TEST 5: Errores
// ============================================================
console.log('\nTEST 5: Validación de errores')
console.log('-'.repeat(60))

const testErrors = [
  { input: '1;2', error: 'sin período' },
  { input: '1;2()', error: 'período vacío' },
  { input: '1;;2(34)', error: 'dos puntos y coma' },
  { input: '1;2(0)', error: '0 en período' }
]

testErrors.forEach(({ input, error }) => {
  const res = procesarFCPeriodica(input)
  const pass = !res.ok
  console.log(`${pass ? '✓' : '✗'} "${input}" → ${error}${!pass ? ' (NO detectado)' : ''}`)
  if (!pass) {
    console.log(`  Resultado inesperado: ${JSON.stringify(res)}`)
  }
})

// ============================================================
// TEST 6: Formatos de entrada alternativos
// ============================================================
console.log('\nTEST 6: Formatos alternativos')
console.log('-'.repeat(60))

const alternativas = [
  { input: '1;2(34)', desc: 'sin comas' },
  { input: '1;2(3,4)', desc: 'período con comas' },
  { input: '1,2;3,4(5,6)', desc: 'todo con comas' },
  { input: '123;4(567)', desc: 'preperíodo sin comas, período sin comas' }
]

alternativas.forEach(({ input, desc }) => {
  const res = procesarFCPeriodica(input)
  if (res.ok) {
    console.log(`✓ ${desc}: pre=[${res.preperiod.join(',')}], per=[${res.period.join(',')}]`)
  } else {
    console.log(`✗ ${desc}: ${res.error}`)
  }
})

console.log('\n' + '='.repeat(60))
console.log('FIN DE TESTS')
console.log('='.repeat(60))

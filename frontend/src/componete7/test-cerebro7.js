/**
 * Archivo de prueba para cerebro7.js
 * Ejecutar con: node test-cerebro7.js
 */

// Importar las funciones (usando ES6 modules)
import { parsearFraccionContinua, calcularReductas, procesarExpresionFC } from './cerebro7.js'

console.log('🧪 PRUEBAS DE CEREBRO7.JS\n')
console.log('='.repeat(60))

// Test 1: Parseo correcto "2;2,3,4"
console.log('\n✓ Test 1: Parseo correcto "2;2,3,4"')
const test1 = parsearFraccionContinua('2;2,3,4')
console.log('  Resultado:', test1)
console.log('  ✓ Esperado: coeficientes [2, 2, 3, 4]')
console.log('  ✓ OK:', JSON.stringify(test1.coeficientes) === JSON.stringify([2, 2, 3, 4]))

// Test 2: Un solo número
console.log('\n✓ Test 2: Un solo número "5"')
const test2 = parsearFraccionContinua('5')
console.log('  Resultado:', test2)
console.log('  ✓ Esperado: coeficientes [5]')
console.log('  ✓ OK:', JSON.stringify(test2.coeficientes) === JSON.stringify([5]))

// Test 3: Con espacios
console.log('\n✓ Test 3: Con espacios "2; 2, 3 , 4"')
const test3 = parsearFraccionContinua('2; 2, 3 , 4')
console.log('  Resultado:', test3)
console.log('  ✓ OK:', JSON.stringify(test3.coeficientes) === JSON.stringify([2, 2, 3, 4]))

// Test 4: Error - múltiples elementos sin ;
console.log('\n✓ Test 4: Error - múltiples elementos sin ; "2,3,4"')
const test4 = parsearFraccionContinua('2,3,4')
console.log('  Resultado:', test4)
console.log('  ✓ OK:', test4.ok === false)

// Test 5: Calcular reductas para 2;2,3,4
console.log('\n✓ Test 5: Calcular reductas para "2;2,3,4"')
const test5 = procesarExpresionFC('2;2,3,4')
console.log('  Notación:', test5.notacion)
console.log('  Reductas:')
test5.reductas.forEach((r, i) => {
  console.log(`    Paso ${i}: a_${i} = ${r.a_k}, p = ${r.p}, q = ${r.q} → ${r.p}/${r.q}`)
})
console.log('  Valor final:', `${test5.valorFinal.p}/${test5.valorFinal.q}`)
console.log('  ✓ OK (valor final 73/30):', test5.valorFinal.p === 73 && test5.valorFinal.q === 30)

// Test 6: Caso especial 0;3,2
console.log('\n✓ Test 6: Caso "0;3,2"')
const test6 = procesarExpresionFC('0;3,2')
console.log('  Reductas:')
test6.reductas.forEach((r, i) => {
  console.log(`    Paso ${i}: ${r.p}/${r.q}`)
})
console.log('  Valor final:', `${test6.valorFinal.p}/${test6.valorFinal.q}`)

// Test 7: Entrada vacía
console.log('\n✓ Test 7: Entrada vacía ""')
const test7 = parsearFraccionContinua('')
console.log('  Resultado:', test7)
console.log('  ✓ OK (error esperado):', test7.ok === false)

// Test 8: Caracteres inválidos
console.log('\n✓ Test 8: Caracteres inválidos "2;a,3"')
const test8 = parsearFraccionContinua('2;a,3')
console.log('  Resultado:', test8)
console.log('  ✓ OK (error esperado):', test8.ok === false)

// Test 9: Comprobación matemática manual para 2;2,3,4
console.log('\n✓ Test 9: Comprobación matemática manual')
console.log('  Coeficientes: [2, 2, 3, 4]')
console.log('  Paso 0: p_0 = 2, q_0 = 1')
console.log('  Paso 1: p_1 = 2*2 + 1 = 5, q_1 = 2*1 + 0 = 2')
console.log('  Paso 2: p_2 = 3*5 + 2 = 17, q_2 = 3*2 + 1 = 7')
console.log('  Paso 3: p_3 = 4*17 + 5 = 73, q_3 = 4*7 + 2 = 30')
const manualCalc = [
  { p: 2, q: 1 },
  { p: 5, q: 2 },
  { p: 17, q: 7 },
  { p: 73, q: 30 }
]
console.log('  Reductas calculadas vs esperadas:')
test5.reductas.forEach((r, i) => {
  const expected = manualCalc[i]
  console.log(`    Paso ${i}: calc(${r.p}/${r.q}) vs exp(${expected.p}/${expected.q}) ✓ ${r.p === expected.p && r.q === expected.q}`)
})

console.log('\n' + '='.repeat(60))
console.log('✅ TODAS LAS PRUEBAS COMPLETADAS\n')

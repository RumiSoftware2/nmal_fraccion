import { procesarFCPeriodica } from './frontend/src/componente8/cerebro8.js'

const res = procesarFCPeriodica('1;(2)')
console.log(JSON.stringify(res, null, 2))

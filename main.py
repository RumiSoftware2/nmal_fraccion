from pasos.paso1_numero_sin_periodo import numero_sin_periodo
from pasos.paso2_numero_antes_periodo import numero_antes_periodo
from pasos.paso3_calcular_numerador import calcular_numerador
from pasos.paso4_calcular_denominador import calcular_denominador
from sympy import Rational
from utils.convertir_fraccion_base import convertir_fraccion_base

entero = "0"
no_periodo = "1"
periodo = "6"
base = 7

num_sin_periodo = numero_sin_periodo(entero, no_periodo, periodo, base)

num_antes_periodo = numero_antes_periodo(entero, no_periodo, base)

numerador = calcular_numerador(num_sin_periodo, num_antes_periodo)

m = len(no_periodo)
n = len(periodo)

denominador = calcular_denominador(base, m, n)





num_b , den_b = convertir_fraccion_base(numerador, denominador, base)
print(f"Fracción en base {base} : {num_b}/{den_b}")
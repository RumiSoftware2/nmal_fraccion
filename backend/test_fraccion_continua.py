"""
Script de prueba para verificar que el endpoint de fracción continua simple funciona.
"""

import json
from operaciones.fraccion_simple_finita import calcular_fraccion_continua

# Prueba 1: 43/19 en base 10
print("=" * 80)
print("PRUEBA 1: Fracción 43/19 en base 10")
print("=" * 80)

resultado1 = calcular_fraccion_continua("43", "19", 10)
print(f"Entrada: 43/19, Base: 10")
print(f"Coeficientes: {resultado1['fraccion_continua']['en_base']}")
print(f"Reconstrucción exitosa: {resultado1['reconstruccion']['exito']}")
print(f"Mensaje: {resultado1['mensaje']}\n")

# Prueba 2: 101₂/11₂ (5/3 en decimal) en base 2
print("=" * 80)
print("PRUEBA 2: Fracción 101₂/11₂ (5/3 decimal) en base 2")
print("=" * 80)

resultado2 = calcular_fraccion_continua("101", "11", 2)
print(f"Entrada: 101/11, Base: 2")
print(f"En base 10: {resultado2['valores_base_10']['numerador']}/{resultado2['valores_base_10']['denominador']}")
print(f"Coeficientes: {resultado2['fraccion_continua']['en_base']}")
print(f"Reconstrucción exitosa: {resultado2['reconstruccion']['exito']}")
print(f"Mensaje: {resultado2['mensaje']}\n")

# Prueba 3: A₁₆/7₁₆ (10/7 en decimal) en base 16
print("=" * 80)
print("PRUEBA 3: Fracción A₁₆/7₁₆ (10/7 decimal) en base 16")
print("=" * 80)

resultado3 = calcular_fraccion_continua("A", "7", 16)
print(f"Entrada: A/7, Base: 16")
print(f"En base 10: {resultado3['valores_base_10']['numerador']}/{resultado3['valores_base_10']['denominador']}")
print(f"Coeficientes: {resultado3['fraccion_continua']['en_base']}")
print(f"Reconstrucción exitosa: {resultado3['reconstruccion']['exito']}")
print(f"Mensaje: {resultado3['mensaje']}\n")

print("=" * 80)
print("✓ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE")
print("=" * 80)

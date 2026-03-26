from typing import Tuple
from prime_factors import get_common_prime_factors


def _parse_fraction(fraccion: str) -> Tuple[int, int]:
    parts = fraccion.split('/')
    if len(parts) != 2:
        raise ValueError(f"Fracción inválida: {fraccion}. Formato esperado 'numerador/denominador'.")

    try:
        numerador = int(parts[0].strip())
        denominador = int(parts[1].strip())
    except ValueError as e:
        raise ValueError(f"Componentes de fracción no son enteros: {fraccion}") from e

    if denominador == 0:
        raise ValueError("Denominador no puede ser 0")

    return numerador, denominador


def convertir_fracciones_a_base_comun(fraccion1: str, fraccion2: str, base_comun: int = None):
    numerador1, denominador1 = _parse_fraction(fraccion1)
    numerador2, denominador2 = _parse_fraction(fraccion2)

    # Si no se proporciona base_comun, calcularla multiplicando los factores primos comunes
    if base_comun is None:
        factores_comunes, _ = get_common_prime_factors(denominador1, denominador2)
        
        if not factores_comunes:
            raise ValueError("No hay factores primos comunes disponibles")
        
        # Multiplicar los factores primos para obtener la base común
        base_comun = 1
        for factor in factores_comunes:
            base_comun *= factor
    
    if base_comun <= 0:
        raise ValueError("La base común debe ser un entero positivo")

    if base_comun % denominador1 != 0 or base_comun % denominador2 != 0:
        raise ValueError("La base común debe ser múltiplo de ambos denominadores")

    factor1 = base_comun // denominador1
    factor2 = base_comun // denominador2

    nuevo_num1 = numerador1 * factor1
    nuevo_num2 = numerador2 * factor2

    return {
        'fraccion1_base_comun': f'{nuevo_num1}/{base_comun}',
        'fraccion2_base_comun': f'{nuevo_num2}/{base_comun}',
        'numerador1': nuevo_num1,
        'numerador2': nuevo_num2,
        'denominador_comun': base_comun,
        'factor1': factor1,
        'factor2': factor2
    }
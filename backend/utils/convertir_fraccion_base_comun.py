from typing import Tuple
from .prime_factors import get_common_prime_factors


def _parse_fraction(fraccion: str) -> Tuple[int, int]:
    parts = fraccion.split('/')
    
    numerador = int(parts[0].strip())
    denominador = int(parts[1].strip())
    
    return numerador, denominador


def convertir_fracciones_a_base_comun(fraccion1: str, fraccion2: str):
    """
    Convierte dos fracciones a una base común multiplicando los factores primos comunes.
    
    Args:
        fraccion1: Primera fracción como string "numerador/denominador"
        fraccion2: Segunda fracción como string "numerador/denominador"
    
    Returns:
        Diccionario con las fracciones convertidas a base común
    """
    numerador1, denominador1 = _parse_fraction(fraccion1)
    numerador2, denominador2 = _parse_fraction(fraccion2)
    
    # Obtener factores primos comunes de los denominadores
    factores_comunes, _ = get_common_prime_factors(denominador1, denominador2)
    
    # Multiplicar los factores para obtener la base común
    base_comun = 1
    for factor in factores_comunes:
        base_comun *= factor
    
    # Validación única: base debe ser menor a 36
    if base_comun >= 36:
        raise ValueError(f"La base común {base_comun} debe ser menor a 36")
    
    # Calcular los factores de escala y nuevos numeradores
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
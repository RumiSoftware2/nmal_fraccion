from .prime_factors import get_common_prime_factors
from .convertir_fraccion_base import convertir_fraccion_base


def convertir_fracciones_a_base_comun(fraccion1: str, fraccion2: str):
    """
    Toma dos fracciones, obtiene factores primos comunes, los multiplica para obtener base,
    y convierte las fracciones a esa base usando convertir_fraccion_base.
    """
    # Parsear fracciones
    num1, den1 = map(int, fraccion1.split('/'))
    num2, den2 = map(int, fraccion2.split('/'))
    
    # Obtener factores primos comunes y multiplicarlos
    factores, _ = get_common_prime_factors(den1, den2)
    base_cambio = 1
    for factor in factores:
        base_cambio *= factor
    
    # Validar base < 36
    if base_cambio >= 36:
        raise ValueError(f"Base {base_cambio} debe ser menor a 36")
    
    # Convertir fracciones a la base calculada
    num1_base, den1_base = convertir_fraccion_base(num1, den1, base_cambio)
    num2_base, den2_base = convertir_fraccion_base(num2, den2, base_cambio)
    
    return {
        'fraccion1_base_cambio': f'{num1_base}/{den1_base}',
        'fraccion2_base_cambio': f'{num2_base}/{den2_base}',
        'base_cambio': base_cambio
    }
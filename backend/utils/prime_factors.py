from sympy import factorint

def get_prime_factors(n):
    """
    Obtiene los factores primos de un número entero
    
    Args:
        n: número entero
    
    Returns:
        Diccionario donde las claves son factores primos y los valores son sus exponentes
    """
    try:
        n = int(n)
        if n <= 1:
            return {}
        return factorint(n)
    except (ValueError, TypeError):
        return {}


def get_common_prime_factors(denominador1, denominador2):
    """
    Obtiene el conjunto de factores primos únicos de ambos denominadores (sin exponentes)
    
    Args:
        denominador1: primer denominador (int o str)
        denominador2: segundo denominador (int o str)
    
    Returns:
        Lista de factores primos únicos (sin exponentes)
        Cadena formateada con los factores separados por comas
    """
    factors1 = get_prime_factors(denominador1)
    factors2 = get_prime_factors(denominador2)
    
    # Obtener la unión de todos los factores primos (únicos, sin exponentes)
    all_primes = sorted(list(set(factors1.keys()) | set(factors2.keys())))
    
    # Formatear resultado como conjunto
    if not all_primes:
        return [], "Sin factores primos"
    
    # Crear cadena legible: "2, 3, 5"
    common_factors_string = ", ".join(map(str, all_primes))
    
    return all_primes, common_factors_string

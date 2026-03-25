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
    Obtiene todos los factores primos únicos de ambos denominadores con su menor exponente
    
    Args:
        denominador1: primer denominador (int o str)
        denominador2: segundo denominador (int o str)
    
    Returns:
        Diccionario con todos los factores primos únicos y sus menores exponentes
        Cadena formateada con los factores
    """
    factors1 = get_prime_factors(denominador1)
    factors2 = get_prime_factors(denominador2)
    
    # Obtener la unión de todos los factores primos (únicos)
    all_primes = set(factors1.keys()) | set(factors2.keys())
    
    # Crear diccionario con todos los factores primos únicos
    # Tomar el menor exponente (si existe en ambos, tomar el menor; si existe en uno, tomar ese)
    all_factors_dict = {}
    for prime in all_primes:
        exp1 = factors1.get(prime, 1)  # Si no existe, consideramos exponente 1
        exp2 = factors2.get(prime, 1)  # Si no existe, consideramos exponente 1
        all_factors_dict[prime] = min(exp1, exp2)
    
    # Formatear resultado
    if not all_factors_dict:
        return all_factors_dict, "Sin factores primos"
    
    # Crear cadena legible: "2 × 3² × 5"
    factor_strings = []
    for prime in sorted(all_factors_dict.keys()):
        exp = all_factors_dict[prime]
        if exp == 1:
            factor_strings.append(str(prime))
        else:
            factor_strings.append(f"{prime}^{exp}")
    
    common_factors_string = " × ".join(factor_strings)
    
    return all_factors_dict, common_factors_string

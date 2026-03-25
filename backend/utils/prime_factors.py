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
    Obtiene los factores primos comunes entre dos denominadores (sin importar exponente)
    
    Args:
        denominador1: primer denominador (int o str)
        denominador2: segundo denominador (int o str)
    
    Returns:
        Diccionario con los factores primos comunes y sus exponentes
        Cadena formateada con los factores comunes
    """
    factors1 = get_prime_factors(denominador1)
    factors2 = get_prime_factors(denominador2)
    
    # Encontrar la intersección de los factores primos
    common_primes = set(factors1.keys()) & set(factors2.keys())
    
    # Crear diccionario con los factores primos comunes
    # Tomar el menor exponente entre los dos
    common_factors_dict = {}
    for prime in common_primes:
        common_factors_dict[prime] = min(factors1[prime], factors2[prime])
    
    # Formatear resultado
    if not common_factors_dict:
        return common_factors_dict, "Sin factores primos comunes"
    
    # Crear cadena legible: "2² × 3 × 5"
    factor_strings = []
    for prime in sorted(common_factors_dict.keys()):
        exp = common_factors_dict[prime]
        if exp == 1:
            factor_strings.append(str(prime))
        else:
            factor_strings.append(f"{prime}^{exp}")
    
    common_factors_string = " × ".join(factor_strings)
    
    return common_factors_dict, common_factors_string

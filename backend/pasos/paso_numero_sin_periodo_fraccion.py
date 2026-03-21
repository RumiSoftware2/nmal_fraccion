def calcular_fraccion_sin_periodo(entero, no_periodo, base):
    """
    Convierte un número sin período a fracción.
    
    Para un número como 2.5 en base 8:
    - Numerador: 25 (concatenar entero + no_periodo, convertir a base 10)
    - Denominador: base^(cantidad de decimales)
    
    Args:
        entero: Parte entera como string
        no_periodo: Parte decimal como string
        base: Base del número
        
    Returns:
        Tupla (numerador, denominador) en base 10
    """
    # Construir el número sin la coma (2.5 -> 25)
    numero_sin_coma = entero + no_periodo
    
    # Convertir a base 10
    numerador = int(numero_sin_coma, base)
    
    # Denominador es base^(cantidad de posiciones decimales)
    cantidad_decimales = len(no_periodo)
    denominador = base ** cantidad_decimales
    
    return numerador, denominador

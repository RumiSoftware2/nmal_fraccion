import numpy as np
from fractions import Fraction
from math import gcd


def dividir_fraccion_en_base(numerador_str: str, denominador_str: str, base: int):
    """
    Divide una fracción en cualquier base y devuelve el resultado en la misma base.
    
    Args:
        numerador_str: numerador de la fracción en la base especificada (ej: "A" en base 16, o "-5")
        denominador_str: denominador de la fracción en la base especificada
        base: base numérica (2-36)
    
    Returns:
        dict con:
            - 'resultado_entero': parte entera del resultado en la base original
            - 'resultado_decimal': parte decimal del resultado en la base original
            - 'resultado_completo': número completo en la base original
            - 'es_periodico': booleano indicando si es periódico
            - 'decimal_base10': resultado en base 10 como decimal
    """
    
    # Validar base
    if base < 2 or base > 36:
        raise ValueError(f"La base debe estar entre 2 y 36, recibida: {base}")
    
    try:
        # Detectar signos
        es_negativo_num = numerador_str.startswith('-')
        es_negativo_den = denominador_str.startswith('-')
        
        # Limpiar signos para conversión
        numerador_limpio = numerador_str.lstrip('-')
        denominador_limpio = denominador_str.lstrip('-')
        
        # Convertir de la base especificada a base 10
        numerador_base10 = int(numerador_limpio, base)
        denominador_base10 = int(denominador_limpio, base)
        
        if denominador_base10 == 0:
            raise ValueError("El denominador no puede ser cero")
        
        # Aplicar signos
        if es_negativo_num:
            numerador_base10 = -numerador_base10
        if es_negativo_den:
            denominador_base10 = -denominador_base10
        
        # Determinar si el resultado será negativo
        resultado_es_negativo = (numerador_base10 < 0) != (denominador_base10 < 0)
        
        # Trabajar con valores absolutos
        numerador_base10 = abs(numerador_base10)
        denominador_base10 = abs(denominador_base10)
        
        # Hacer la división en base 10
        resultado_base10 = numerador_base10 / denominador_base10
        
        # Obtener parte entera y fraccionaria
        parte_entera = int(resultado_base10)
        parte_fraccionaria = resultado_base10 - parte_entera
        
        # Convertir parte entera a la base original
        if parte_entera == 0:
            entero_en_base = "0"
        else:
            entero_en_base = np.base_repr(parte_entera, base).upper()
        
        # Aplicar signo a la parte entera si es necesario
        if resultado_es_negativo and parte_entera > 0:
            entero_en_base = "-" + entero_en_base
        
        # Calcular la parte decimal en la base original
        decimal_en_base = calcular_decimal_en_base(parte_fraccionaria, base, max_digitos=20)
        
        # Armar resultado completo
        if decimal_en_base:
            resultado_completo = f"{entero_en_base}.{decimal_en_base}"
        else:
            resultado_completo = entero_en_base
        
        # Detectar si es periódico analizando la fracción
        es_periodico = detectar_periodico(numerador_base10, denominador_base10)
        
        # Ajustar el resultado en base 10 con el signo
        resultado_base10_final = resultado_base10 if not resultado_es_negativo else -resultado_base10
        
        return {
            'numerador': numerador_str,
            'denominador': denominador_str,
            'base': base,
            'resultado_entero': entero_en_base,
            'resultado_decimal': decimal_en_base,
            'resultado_completo': resultado_completo,
            'decimal_base10': round(resultado_base10_final, 10),
            'es_periodico': es_periodico,
            'numerador_base10': numerador_base10,
            'denominador_base10': denominador_base10
        }
    
    except ValueError as e:
        raise ValueError(f"Error al procesar la fracción: {str(e)}")


def calcular_decimal_en_base(fraccion_decimal: float, base: int, max_digitos: int = 20):
    """
    Convierte la parte decimal de un número a otra base.
    
    Args:
        fraccion_decimal: parte decimal (0 < x < 1)
        base: base numérica objetivo
        max_digitos: máximo de dígitos decimales a calcular
    
    Returns:
        string con los dígitos decimales en la base especificada
    """
    if fraccion_decimal == 0:
        return ""
    
    digitos = []
    visto = {}  # Para detectar ciclos periódicos
    posicion = 0
    
    while fraccion_decimal > 0 and len(digitos) < max_digitos:
        # Detectar si ya hemos visto este residuo (ciclo periódico)
        if fraccion_decimal in visto:
            # Aquí podríamos marcar donde comienza el período
            break
        
        visto[fraccion_decimal] = posicion
        
        # Multiplicar por la base
        fraccion_decimal *= base
        
        # Obtener el dígito
        digito = int(fraccion_decimal)
        digitos.append(str(digito) if digito < 10 else chr(ord('A') + digito - 10))
        
        # Obtener el nuevo residuo
        fraccion_decimal -= digito
        posicion += 1
    
    return "".join(digitos)


def detectar_periodico(numerador: int, denominador: int) -> bool:
    """
    Detecta si una fracción en base 10 genera un decimal periódico.
    
    Una fracción es periódica si después de simplificar, el denominador
    tiene factores primos distintos de 2 y 5 (para base 10).
    
    Args:
        numerador: numerador de la fracción
        denominador: denominador de la fracción
    
    Returns:
        True si es periódico, False si es exacto o termina
    """
    # Simplificar la fracción
    g = gcd(numerador, denominador)
    denominador_simplificado = denominador // g
    
    # Eliminar factores 2 y 5
    while denominador_simplificado % 2 == 0:
        denominador_simplificado //= 2
    while denominador_simplificado % 5 == 0:
        denominador_simplificado //= 5
    
    # Si queda algo, es periódico
    return denominador_simplificado > 1


def obtener_fraccion_simplificada(numerador: int, denominador: int):
    """
    Simplifica una fracción.
    
    Args:
        numerador: numerador
        denominador: denominador
    
    Returns:
        tupla (numerador_simplificado, denominador_simplificado)
    """
    g = gcd(numerador, denominador)
    return numerador // g, denominador // g


# Ejemplo de uso
if __name__ == "__main__":
    # Ejemplo 1: 1/2 en base 10
    resultado1 = dividir_fraccion_en_base("1", "2", 10)
    print("Ejemplo 1 - 1/2 en base 10:")
    print(f"  Resultado: {resultado1['resultado_completo']}")
    print(f"  Periódico: {resultado1['es_periodico']}")
    print()
    
    # Ejemplo 2: 1/3 en base 10 (periódico)
    resultado2 = dividir_fraccion_en_base("1", "3", 10)
    print("Ejemplo 2 - 1/3 en base 10:")
    print(f"  Resultado: {resultado2['resultado_completo']}")
    print(f"  Periódico: {resultado2['es_periodico']}")
    print()
    
    # Ejemplo 3: A/2 en base 16 (10/2 = 5)
    resultado3 = dividir_fraccion_en_base("A", "2", 16)
    print("Ejemplo 3 - A/2 en base 16:")
    print(f"  Resultado: {resultado3['resultado_completo']}")
    print(f"  Periódico: {resultado3['es_periodico']}")
    print()
    
    # Ejemplo 4: 1/3 en base 2
    resultado4 = dividir_fraccion_en_base("1", "11", 2)
    print("Ejemplo 4 - 1/11 en base 2 (1/3 en base 10):")
    print(f"  Resultado: {resultado4['resultado_completo']}")
    print(f"  Periódico: {resultado4['es_periodico']}")

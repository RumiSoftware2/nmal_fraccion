import numpy as np
from fractions import Fraction
from math import gcd


def operar_fracciones_en_base(num1_str, den1_str, num2_str, den2_str, base, operacion):
    """
    Realiza operaciones aritméticas entre dos fracciones en cualquier base.
    
    Args:
        num1_str: numerador de la primera fracción en la base especificada
        den1_str: denominador de la primera fracción en la base especificada
        num2_str: numerador de la segunda fracción en la base especificada
        den2_str: denominador de la segunda fracción en la base especificada
        base: base numérica (2-36)
        operacion: 'suma', 'resta', 'multiplicacion', 'division'
    
    Returns:
        Tupla (numerador_resultado, denominador_resultado, es_negativo)
    """
    
    # Convertir de la base especificada a base 10
    try:
        num1_base10 = int(num1_str, base)
        den1_base10 = int(den1_str, base)
        num2_base10 = int(num2_str, base)
        den2_base10 = int(den2_str, base)
    except ValueError as e:
        raise ValueError(f"Error al convertir valores a base {base}: {str(e)}")
    
    if den1_base10 == 0 or den2_base10 == 0:
        raise ValueError("Los denominadores no pueden ser cero")
    
    # Realizar la operación según el tipo
    if operacion.lower() == "suma":
        # (a/b) + (c/d) = (a*d + c*b) / (b*d)
        numerador_resultado = (num1_base10 * den2_base10) + (num2_base10 * den1_base10)
        denominador_resultado = den1_base10 * den2_base10
        
    elif operacion.lower() == "resta":
        # (a/b) - (c/d) = (a*d - c*b) / (b*d)
        numerador_resultado = (num1_base10 * den2_base10) - (num2_base10 * den1_base10)
        denominador_resultado = den1_base10 * den2_base10
        
    elif operacion.lower() == "multiplicacion":
        # (a/b) * (c/d) = (a*c) / (b*d)
        numerador_resultado = num1_base10 * num2_base10
        denominador_resultado = den1_base10 * den2_base10
        
    elif operacion.lower() == "division":
        # (a/b) / (c/d) = (a*d) / (b*c)
        if num2_base10 == 0:
            raise ValueError("No se puede dividir por cero")
        numerador_resultado = num1_base10 * den2_base10
        denominador_resultado = den1_base10 * num2_base10
        
    else:
        raise ValueError(f"Operación no reconocida: {operacion}")
    
    # Detectar si el resultado es negativo
    es_negativo = numerador_resultado < 0
    
    # Simplificar la fracción usando MCD
    numerador_resultado = abs(numerador_resultado)
    common_divisor = gcd(numerador_resultado, denominador_resultado)
    numerador_resultado = numerador_resultado // common_divisor
    denominador_resultado = denominador_resultado // common_divisor
    
    return numerador_resultado, denominador_resultado, es_negativo


def convertir_a_base_con_signo(numero, base, es_negativo=False):
    """
    Convierte un número decimal a otra base, manejando el signo por separado.
    
    Args:
        numero: número entero positivo
        base: base numérica (2-36)
        es_negativo: si el número debe ser negativo
    
    Returns:
        string con el número en la base especificada (con - si es negativo)
    """
    
    if numero == 0:
        return "0"
    
    resultado_str = np.base_repr(numero, base).upper()
    
    if es_negativo:
        resultado_str = "-" + resultado_str
    
    return resultado_str


def validar_base(base):
    """Valida que la base esté en el rango permitido"""
    if not isinstance(base, int) or base < 2 or base > 36:
        raise ValueError(f"La base debe ser un entero entre 2 y 36, recibida: {base}")

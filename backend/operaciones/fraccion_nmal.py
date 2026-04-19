import numpy as np
from fractions import Fraction
from math import gcd

def int_to_base_char(digito: int) -> str:
    """Convierte un dígito entero (0-35) a su representación en carácter (0-9, A-Z)"""
    if 0 <= digito <= 9:
        return str(digito)
    return chr(ord('A') + digito - 10)

def dividir_fraccion_en_base(numerador_str: str, denominador_str: str, base: int):
    """
    Divide una fracción en cualquier base y devuelve el resultado en la misma base.
    Trabaja estrictamente con división entera y residuos para evitar pérdida de 
    precisión y detectar periodos infinitos con exactitud determinística.
    
    Args:
        numerador_str: numerador de la fracción en la base especificada (ej: "A" en base 16, o "-5")
        denominador_str: denominador de la fracción en la base especificada
        base: base numérica (2-36)
    
    Returns:
        dict con:
            - 'resultado_entero': parte entera del resultado en la base original
            - 'resultado_decimal': parte decimal del resultado (ej. "1(6)" si es periódico)
            - 'resultado_completo': número completo en la base original formatedo
            - 'es_periodico': booleano indicando si es periódico
            - 'decimal_base10': aproximación del resultado en base 10 como float
            - 'numerador_base10': numerador en decimal con signo
            - 'denominador_base10': denominador en decimal con signo
    """
    
    # Validar que la base esté en el rango permitido
    if base < 2 or base > 36:
        raise ValueError(f"La base debe estar entre 2 y 36, recibida: {base}")
    
    try:
        # Detectar la negatividad de cada componente
        es_negativo_num = numerador_str.startswith('-')
        es_negativo_den = denominador_str.startswith('-')
        
        # Limpiar los signos antes de parsear la base para evitar confusiones
        numerador_limpio = numerador_str.lstrip('-')
        denominador_limpio = denominador_str.lstrip('-')
        
        # Parsear a valores absolutos decimales (base 10) usando la base de origen
        num_abs_base10 = int(numerador_limpio, base)
        den_abs_base10 = int(denominador_limpio, base)
        
        if den_abs_base10 == 0:
            raise ValueError("El denominador no puede ser cero")
        
        # Determinar el signo final
        resultado_es_negativo = es_negativo_num ^ es_negativo_den
        if num_abs_base10 == 0:
            resultado_es_negativo = False
            
        # 1. Calcular Parte Entera (usando división modular para exactitud matemática)
        parte_entera_val = num_abs_base10 // den_abs_base10
        resto = num_abs_base10 % den_abs_base10
        
        # 2. Calcular Parte Decimal analizando el residuo (loop de división larga)
        decimal_digits = []
        visto = {}
        es_periodico = False
        posicion_periodo = -1
        posicion = 0
        
        # Max digitos es un cortafuegos para evitar OOM si el hardware es limitado 
        # y el denominador genera un periodo masivo (ej: primos grandes Q generan periodo Q-1).
        max_digitos = 5000 
        
        while resto != 0 and posicion < max_digitos:
            # Si vemos el mismo residuo, detectamos un ciclo idéntico: es periódico
            if resto in visto:
                es_periodico = True
                posicion_periodo = visto[resto]
                break
            
            # Registrar posición del residuo actual
            visto[resto] = posicion
            
            # "Bajar un 0" en la base indicada, multiplicando el residuo
            resto *= base
            
            # El dígito que tocará en esta posición fraccionaria es la división entera
            digito = resto // den_abs_base10
            decimal_digits.append(int_to_base_char(digito))
            
            # Actualizamos el sobrante (residuo) para continuar el ciclo
            resto = resto % den_abs_base10
            posicion += 1
            
        # Formatear el resultado decimal según si fue periódico o no
        if es_periodico:
            no_periodo = "".join(decimal_digits[:posicion_periodo])
            periodo = "".join(decimal_digits[posicion_periodo:])
            decimal_en_base = f"{no_periodo}({periodo})"
        else:
            decimal_en_base = "".join(decimal_digits)
            
        # Convertir y dar formato al ente principal (Parte Entera)
        entero_en_base = "0" if parte_entera_val == 0 else np.base_repr(parte_entera_val, base).upper()
        
        # Acoplar el signo al output (importante: incluso en -0)
        if resultado_es_negativo:
            entero_en_base = "-" + entero_en_base
            
        # Armar string legible total
        if decimal_en_base:
            resultado_completo = f"{entero_en_base}.{decimal_en_base}"
        else:
            resultado_completo = entero_en_base
            
        # Calculamos num_base10 y den_base10 con los signos correctos originales para el frontend
        num_final_base10 = -num_abs_base10 if es_negativo_num else num_abs_base10
        den_final_base10 = -den_abs_base10 if es_negativo_den else den_abs_base10
        
        # Base 10 aproximado para usos de compatibilidad
        decimal_base10_float = round(num_final_base10 / den_final_base10, 10)
        
        return {
            'numerador': numerador_str,
            'denominador': denominador_str,
            'base': base,
            'resultado_entero': entero_en_base,
            'resultado_decimal': decimal_en_base,
            'resultado_completo': resultado_completo,
            'decimal_base10': decimal_base10_float,
            'es_periodico': es_periodico,
            'numerador_base10': num_final_base10,
            'denominador_base10': den_final_base10
        }
        
    except ValueError as e:
        raise ValueError(f"Error al procesar la fracción: {str(e)}")

# Ejemplo de uso/test
if __name__ == "__main__":
    def print_resultado(titulo, res):
        print(f"--- {titulo} ---")
        print(f"Resultado completo: {res['resultado_completo']}")
        print(f"Periódico: {res['es_periodico']}")
        print(f"Decimal (aprox 10): {res['decimal_base10']}")
        print()

    # Ejemplo 1: 1/3 en base 10 (periódico, 0.(3))
    print_resultado("Ejemplo 1 - 1/3 en base 10", dividir_fraccion_en_base("1", "3", 10))
    
    # Ejemplo 2: 1/11 en base 2 (1/3 en base 10, periódico en base 2: 0.(01))
    print_resultado("Ejemplo 2 - 1/11 en base 2 (1/3 en base 10)", dividir_fraccion_en_base("1", "11", 2))
    
    # Ejemplo 3: 5/2 en base 10 (2.5) exacto y negativo
    print_resultado("Ejemplo 3 - -5/2 en base 10", dividir_fraccion_en_base("-5", "2", 10))

    # Ejemplo 4: Fracción inexacta mixta: 1/6 en base 10 (0.1(6))
    print_resultado("Ejemplo 4 - 1/6 en base 10", dividir_fraccion_en_base("1", "6", 10))

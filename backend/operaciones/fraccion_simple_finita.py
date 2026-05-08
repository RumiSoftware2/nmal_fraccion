"""
Módulo para calcular fracciones continuas simples usando el algoritmo de Euclides.

Una fracción continua simple tiene la forma:
    [a₁, a₂, a₃, ..., aₙ] = a₁ + 1/(a₂ + 1/(a₃ + ... + 1/aₙ))

Cualquier número racional c/d puede representarse así usando el algoritmo de Euclides
con divisiones sucesivas:
    c = d·a₁ + r₁  (donde 0 ≤ r₁ < d)
    d = r₁·a₂ + r₂ (donde 0 ≤ r₂ < r₁)
    r₁ = r₂·a₃ + r₃
    ... hasta que el residuo sea cero

Los cocientes a₁, a₂, a₃, ..., aₙ son los coeficientes de la fracción continua.

El módulo soporta cálculos en cualquier base de 2 a 36, manteniendo precisión
mediante aritmética de enteros en la base especificada.
"""

from typing import List, Tuple, Dict


# ============================================================================
# FUNCIONES AUXILIARES DE CONVERSIÓN ENTRE BASES
# ============================================================================

def int_to_base_char(digito: int) -> str:
    """
    Convierte un dígito entero (0-35) a su representación en carácter.
    
    Args:
        digito: Número entero entre 0 y 35
        
    Returns:
        str: '0'-'9' para 0-9, 'A'-'Z' para 10-35
        
    Ejemplos:
        int_to_base_char(0) -> '0'
        int_to_base_char(10) -> 'A'
        int_to_base_char(15) -> 'F'
        int_to_base_char(35) -> 'Z'
    """
    if 0 <= digito <= 9:
        return str(digito)
    elif 10 <= digito <= 35:
        return chr(ord('A') + digito - 10)
    else:
        raise ValueError(f"Dígito {digito} fuera de rango [0-35]")


def char_to_int(caracter: str) -> int:
    """
    Convierte un carácter ('0'-'9', 'A'-'Z', 'a'-'z') a su valor entero.
    
    Args:
        caracter: Carácter numérico en base n
        
    Returns:
        int: Valor del dígito (0-35)
        
    Ejemplos:
        char_to_int('0') -> 0
        char_to_int('9') -> 9
        char_to_int('A') -> 10
        char_to_int('F') -> 15
        char_to_int('Z') -> 35
    """
    if '0' <= caracter <= '9':
        return int(caracter)
    elif 'A' <= caracter <= 'Z':
        return ord(caracter) - ord('A') + 10
    elif 'a' <= caracter <= 'z':
        return ord(caracter) - ord('a') + 10
    else:
        raise ValueError(f"Carácter '{caracter}' no es válido en base-n")


def base_to_decimal(numero_str: str, base: int) -> int:
    """
    Convierte un número de cualquier base (2-36) a decimal (base 10).
    
    Implementación usando Horner para eficiencia:
        resultado = (...((d₀·base + d₁)·base + d₂)·base + ...)
    
    Args:
        numero_str: String con el número en la base especificada
        base: Base numérica (2-36)
        
    Returns:
        int: Valor en base 10
        
    Ejemplos:
        base_to_decimal('101', 2) -> 5
        base_to_decimal('A', 16) -> 10
        base_to_decimal('43', 10) -> 43
    """
    resultado = 0
    numero_str = numero_str.upper().strip()
    
    for caracter in numero_str:
        digito = char_to_int(caracter)
        if digito >= base:
            raise ValueError(f"Dígito '{caracter}' ({digito}) es inválido en base {base}")
        resultado = resultado * base + digito
    
    return resultado


def decimal_to_base(numero: int, base: int) -> str:
    """
    Convierte un número decimal (base 10) a cualquier base (2-36).
    
    Args:
        numero: Número entero en base 10
        base: Base numérica destino (2-36)
        
    Returns:
        str: Representación del número en la base especificada
        
    Ejemplos:
        decimal_to_base(5, 2) -> '101'
        decimal_to_base(10, 16) -> 'A'
        decimal_to_base(43, 10) -> '43'
    """
    if numero == 0:
        return '0'
    
    if numero < 0:
        return '-' + decimal_to_base(-numero, base)
    
    digitos = []
    while numero > 0:
        digitos.append(int_to_base_char(numero % base))
        numero //= base
    
    return ''.join(reversed(digitos))


# ============================================================================
# ALGORITMO DE EUCLIDES PARA FRACCIÓN CONTINUA
# ============================================================================

def algoritmo_euclides_continua(
    numerador: int,
    denominador: int,
    base: int
) -> Tuple[List[int], List[Dict]]:
    """
    Aplica el algoritmo de Euclides para obtener los coeficientes de una
    fracción continua simple [a₁, a₂, ..., aₙ].
    
    Realiza divisiones sucesivas:
        c = d·a₁ + r₁
        d = r₁·a₂ + r₂
        r₁ = r₂·a₃ + r₃
        ... hasta que rₙ = 0
    
    Args:
        numerador: Numerador c en base 10
        denominador: Denominador d en base 10
        base: Base numérica para operaciones y representación
        
    Returns:
        Tupla (coeficientes, pasos) donde:
            - coeficientes: List[int] con [a₁, a₂, ..., aₙ]
            - pasos: List[Dict] con detalles de cada división
            
    Raises:
        ValueError: Si denominador es 0 o negativo
    """
    if denominador == 0:
        raise ValueError("El denominador no puede ser cero")
    if denominador < 0:
        denominador = -denominador
        numerador = -numerador
    
    coeficientes = []
    pasos = []
    
    dividendo = numerador
    divisor = denominador
    paso_num = 1
    
    # Aplicar divisiones sucesivas hasta que el residuo sea 0
    while divisor != 0:
        # División entera: dividendo = divisor * cociente + residuo
        cociente = dividendo // divisor
        residuo = dividendo % divisor
        
        coeficientes.append(cociente)
        
        # Registrar el paso
        paso_info = {
            'paso': paso_num,
            'dividendo': dividendo,
            'dividendo_base': decimal_to_base(dividendo, base),
            'divisor': divisor,
            'divisor_base': decimal_to_base(divisor, base),
            'cociente': cociente,
            'cociente_base': decimal_to_base(cociente, base),
            'residuo': residuo,
            'residuo_base': decimal_to_base(residuo, base),
            'ecuacion': f"{decimal_to_base(dividendo, base)}₍{base}₎ = "
                       f"{decimal_to_base(divisor, base)}₍{base}₎ × "
                       f"{decimal_to_base(cociente, base)}₍{base}₎ + "
                       f"{decimal_to_base(residuo, base)}₍{base}₎"
        }
        pasos.append(paso_info)
        
        # Siguiente iteración: dividendo = divisor, divisor = residuo
        dividendo = divisor
        divisor = residuo
        paso_num += 1
    
    return coeficientes, pasos


# ============================================================================
# RECONSTRUCCIÓN DE FRACCIÓN A PARTIR DE COEFICIENTES
# ============================================================================

def reconstruir_fraccion_desde_coeficientes(coeficientes: List[int]) -> Tuple[int, int]:
    """
    Reconstruye la fracción original c/d a partir de los coeficientes
    de la fracción continua [a₁, a₂, ..., aₙ].
    
    Utiliza la relación recurrente:
        p₋₁ = 1,    p₀ = a₁
        q₋₁ = 0,    q₀ = 1
        pₖ = aₖ·pₖ₋₁ + pₖ₋₂
        qₖ = aₖ·qₖ₋₁ + qₖ₋₂
    
    El convergente final es pₙ₋₁/qₙ₋₁ = c/d.
    
    Args:
        coeficientes: List[int] con los coeficientes [a₁, a₂, ..., aₙ]
        
    Returns:
        Tupla (numerador, denominador) de la fracción reconstruida
        
    Ejemplos:
        reconstruir_fraccion_desde_coeficientes([2, 3, 1, 4]) -> (43, 19)
    """
    if not coeficientes:
        raise ValueError("La lista de coeficientes no puede estar vacía")
    
    # Inicializar con valores base
    p_prev2 = 1      # p₋₁
    p_prev1 = coeficientes[0]  # p₀ = a₁
    
    q_prev2 = 0      # q₋₁
    q_prev1 = 1      # q₀ = 1
    
    # Si solo hay un coeficiente, retornar a₁/1
    if len(coeficientes) == 1:
        return p_prev1, q_prev1
    
    # Aplicar relación recurrente para k = 1, 2, ..., n-1
    for k in range(1, len(coeficientes)):
        a_k = coeficientes[k]
        
        # pₖ = aₖ·pₖ₋₁ + pₖ₋₂
        p_curr = a_k * p_prev1 + p_prev2
        
        # qₖ = aₖ·qₖ₋₁ + qₖ₋₂
        q_curr = a_k * q_prev1 + q_prev2
        
        # Desplazar para siguiente iteración
        p_prev2, p_prev1 = p_prev1, p_curr
        q_prev2, q_prev1 = q_prev1, q_curr
    
    return p_prev1, q_prev1


# ============================================================================
# FUNCIÓN PRINCIPAL
# ============================================================================

def calcular_fraccion_continua(
    numerador_str: str,
    denominador_str: str,
    base: int
) -> Dict:
    """
    Calcula la fracción continua simple de una fracción racional c/d
    en una base numérica especificada.
    
    Proceso:
    1. Convierte los inputs a base 10
    2. Aplica el algoritmo de Euclides
    3. Reconstruye la fracción desde los coeficientes
    4. Retorna resultado completo con todos los pasos
    
    Args:
        numerador_str: Numerador en la base especificada (ej: "43" para base 10)
        denominador_str: Denominador en la base especificada (ej: "19" para base 10)
        base: Base numérica (2-36)
        
    Returns:
        Dict con:
            - 'exito': bool indicando si el cálculo fue exitoso
            - 'base': Base numérica usada
            - 'numerador': Numerador en base 10
            - 'denominador': Denominador en base 10
            - 'numerador_base': Numerador en la base especificada
            - 'denominador_base': Denominador en la base especificada
            - 'coeficientes': Lista de coeficientes [a₁, a₂, ..., aₙ]
            - 'coeficientes_base': Coeficientes representados en la base especificada
            - 'fraccion_continua': String con formato [a₁, a₂, ..., aₙ]
            - 'fraccion_continua_base': Mismo formato en la base especificada
            - 'pasos_euclides': Lista de pasos del algoritmo de Euclides
            - 'reconstruccion': Fracción reconstruida verificación
            - 'reconstruccion_base': Fracción reconstruida en la base especificada
            - 'mensaje': Mensajes informativos
            
    Raises:
        ValueError: Si hay errores en los inputs
    """
    try:
        # Validar base
        if base < 2 or base > 36:
            raise ValueError(f"La base debe estar entre 2 y 36, se recibió: {base}")
        
        # Convertir inputs a base 10
        numerador_10 = base_to_decimal(numerador_str, base)
        denominador_10 = base_to_decimal(denominador_str, base)
        
        if denominador_10 == 0:
            raise ValueError("El denominador no puede ser cero")
        
        # Aplicar algoritmo de Euclides
        coeficientes, pasos_euclides = algoritmo_euclides_continua(
            numerador_10, denominador_10, base
        )
        
        # Convertir coeficientes a la base especificada
        coeficientes_base = [decimal_to_base(a, base) for a in coeficientes]
        
        # Reconstruir la fracción
        num_reconstructed, den_reconstructed = reconstruir_fraccion_desde_coeficientes(coeficientes)
        
        # Verificar que la reconstrucción sea correcta
        verificacion_ok = (num_reconstructed == numerador_10 and 
                          den_reconstructed == denominador_10)
        
        # Construir respuesta
        resultado = {
            'exito': True,
            'base': base,
            'input': {
                'numerador_str': numerador_str,
                'denominador_str': denominador_str,
                'fraccion_str': f"{numerador_str}/{denominador_str}"
            },
            'valores_base_10': {
                'numerador': numerador_10,
                'denominador': denominador_10,
            },
            'valores_en_base': {
                'numerador': decimal_to_base(numerador_10, base),
                'denominador': decimal_to_base(denominador_10, base),
            },
            'coeficientes': {
                'base_10': coeficientes,
                'en_base': coeficientes_base,
                'cantidad': len(coeficientes)
            },
            'fraccion_continua': {
                'base_10': f"[{','.join(map(str, coeficientes))}]",
                'en_base': f"[{','.join(coeficientes_base)}]",
                'notacion_matematica': f"[a₁, a₂, ..., a_{len(coeficientes)}]"
            },
            'pasos_euclides': pasos_euclides,
            'reconstruccion': {
                'exito': verificacion_ok,
                'numerador': num_reconstructed,
                'denominador': den_reconstructed,
                'numerador_base': decimal_to_base(num_reconstructed, base),
                'denominador_base': decimal_to_base(den_reconstructed, base),
                'fraccion_base_10': f"{num_reconstructed}/{den_reconstructed}",
                'fraccion_en_base': f"{decimal_to_base(num_reconstructed, base)}/{decimal_to_base(den_reconstructed, base)}"
            },
            'mensaje': f"Fracción continua simple de {numerador_str}/{denominador_str} en base {base} "
                      f"calculada exitosamente: {coeficientes_base}"
        }
        
        return resultado
    
    except ValueError as e:
        return {
            'exito': False,
            'error': str(e),
            'mensaje': f"Error al calcular la fracción continua: {str(e)}"
        }
    except Exception as e:
        return {
            'exito': False,
            'error': str(e),
            'mensaje': f"Error inesperado: {str(e)}"
        }


# ============================================================================
# EJEMPLO DE USO
# ============================================================================

if __name__ == "__main__":
    # Ejemplo 1: Fracción 43/19 en base 10
    print("=" * 80)
    print("EJEMPLO 1: Fracción 43/19 en base 10")
    print("=" * 80)
    resultado1 = calcular_fraccion_continua("43", "19", 10)
    
    print(f"Fracción: {resultado1['input']['fraccion_str']}")
    print(f"Coeficientes: {resultado1['fraccion_continua']['en_base']}")
    print(f"\nPasos del algoritmo de Euclides:")
    for paso in resultado1['pasos_euclides']:
        print(f"  Paso {paso['paso']}: {paso['ecuacion']}")
    print(f"\nReconstrucción: {resultado1['reconstruccion']['fraccion_en_base']} ✓" 
          if resultado1['reconstruccion']['exito'] else " ✗")
    
    # Ejemplo 2: Fracción 101/11 en base 2 (binario)
    print("\n" + "=" * 80)
    print("EJEMPLO 2: Fracción 101₂/11₂ (5/3 en decimal) en base 2")
    print("=" * 80)
    resultado2 = calcular_fraccion_continua("101", "11", 2)
    
    print(f"Fracción: {resultado2['input']['fraccion_str']} (en base 2)")
    print(f"  = {resultado2['valores_base_10']['numerador']}/{resultado2['valores_base_10']['denominador']} (en base 10)")
    print(f"Coeficientes: {resultado2['fraccion_continua']['en_base']}")
    print(f"\nPasos del algoritmo de Euclides:")
    for paso in resultado2['pasos_euclides']:
        print(f"  Paso {paso['paso']}: {paso['ecuacion']}")
    print(f"\nReconstrucción: {resultado2['reconstruccion']['fraccion_en_base']} ✓" 
          if resultado2['reconstruccion']['exito'] else " ✗")
    
    # Ejemplo 3: Fracción A/7 en base 16 (hexadecimal)
    print("\n" + "=" * 80)
    print("EJEMPLO 3: Fracción A₁₆/7₁₆ (10/7 en decimal) en base 16")
    print("=" * 80)
    resultado3 = calcular_fraccion_continua("A", "7", 16)
    
    print(f"Fracción: {resultado3['input']['fraccion_str']} (en base 16)")
    print(f"  = {resultado3['valores_base_10']['numerador']}/{resultado3['valores_base_10']['denominador']} (en base 10)")
    print(f"Coeficientes: {resultado3['fraccion_continua']['en_base']}")
    print(f"\nPasos del algoritmo de Euclides:")
    for paso in resultado3['pasos_euclides']:
        print(f"  Paso {paso['paso']}: {paso['ecuacion']}")
    print(f"\nReconstrucción: {resultado3['reconstruccion']['fraccion_en_base']} ✓" 
          if resultado3['reconstruccion']['exito'] else " ✗")

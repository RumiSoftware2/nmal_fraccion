"""
Módulo para convertir números n-mal entre diferentes bases numéricas.
Utiliza numpy para manejar conversiones entre bases.
"""

import numpy as np
from typing import Tuple


def convertir_numero_en_base(numero: int, base_origen: int, base_destino: int) -> str:
    """
    Convierte un número entero de una base a otra.
    
    Args:
        numero: Número entero a convertir
        base_origen: Base numérica de origen
        base_destino: Base numérica de destino
    
    Returns:
        String con el número convertido en base_destino
    """
    # Primero convertir a base 10 si no está en base 10
    if base_origen != 10:
        numero_base_10 = int(str(numero), base_origen)
    else:
        numero_base_10 = numero
    
    # Luego convertir a la base destino
    return np.base_repr(numero_base_10, base_destino)


def convertir_fraccion_completa(numerador: int, denominador: int, base_destino: int) -> Tuple[str, str]:
    """
    Convierte una fracción de base 10 a otra base.
    
    Args:
        numerador: Numerador en base 10
        denominador: Denominador en base 10
        base_destino: Base numérica de destino
    
    Returns:
        Tupla (numerador_convertido, denominador_convertido) ambos en base_destino
    """
    numerador_convertido = np.base_repr(numerador, base_destino)
    denominador_convertido = np.base_repr(denominador, base_destino)
    
    return numerador_convertido, denominador_convertido

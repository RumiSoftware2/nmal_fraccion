r"""
Módulo para calcular fracciones continuas simples periódicas de raíces cuadradas √p.

Una fracción continua simple periódica tiene la forma:
    [a₀; a₁, a₂, ..., aₖ, \overline{aₖ₊₁, ..., aₖ₊ₙ}]
    
Donde la parte bajo la línea se repite infinitamente. Por el teorema de Lagrange,
un número irracional tiene fracción continua simple periódica si y solo si es
irracional cuadrático (raíz de polinomio cuadrático con coeficientes enteros).

Este módulo implementa el algoritmo clásico usando pares (m, d) para representar
el estado de cada iteración, evitando completamente el uso de floats.

El algoritmo usa la recurrencia:
    x₀ = √S
    a₀ = ⌊√S⌋
    xᵢ = (mᵢ + √S) / dᵢ
    aᵢ = ⌊(a₀ + mᵢ) / dᵢ⌋
    mᵢ₊₁ = dᵢ · aᵢ - mᵢ
    dᵢ₊₁ = (S - mᵢ₊₁²) / dᵢ

El período se detecta cuando el par (m, d) se repite.
"""

from typing import List, Dict, Tuple
from dataclasses import dataclass
import math



# ============================================================================
# CLASES DE DATOS
# ============================================================================

@dataclass(frozen=True)
class EstadoCuadratico:
    """
    Representa el estado (m, d) en el algoritmo de fracción continua cuadrática.
    
    El estado es inmutable (frozen) para poder usarse como clave en diccionarios
    y detectar ciclos mediante hashing.
    
    Attributes:
        m: Componente m del estado (entero)
        d: Componente d del estado (entero positivo)
    """
    m: int
    d: int


# ============================================================================
# FUNCIONES DE VALIDACIÓN
# ============================================================================

def validar_entrada_raiz(p: int, indice: int) -> None:
    """
    Valida los parámetros de entrada para el cálculo de fracción continua periódica.
    
    Args:
        p: Radicando (entero ≥ 2)
        indice: Índice de la raíz (V1 solo acepta 2)
        
    Raises:
        ValueError: Si p < 2 o si indice ≠ 2
    """
    if p < 2:
        raise ValueError(f"El radicando p debe ser ≥ 2, se recibió: {p}")
    
    if indice != 2:
        raise ValueError(
            f"V1 solo soporta índice = 2 (raíz cuadrada). "
            f"Por el teorema de Lagrange, solo los irracionales cuadráticos "
            f"tienen fracción continua simple periódica. Se recibió índice: {indice}"
        )


def es_cuadrado_perfecto(n: int) -> bool:
    """
    Determina si un entero es un cuadrado perfecto.
    
    Usa math.isqrt para cálculo exacto sin floats.
    
    Args:
        n: Entero a verificar
        
    Returns:
        bool: True si n es un cuadrado perfecto, False en caso contrario
        
    Ejemplos:
        es_cuadrado_perfecto(4) -> True
        es_cuadrado_perfecto(7) -> False
        es_cuadrado_perfecto(16) -> True
    """
    raiz = math.isqrt(n)
    return raiz * raiz == n


# ============================================================================
# FUNCIONES DE PREPROCESAMIENTO
# ============================================================================

def simplificar_radicando(p: int) -> Tuple[int, int]:
    """
    Descompone p = q² · s con s libre de cuadrados (√p = q·√s).
    """
    if p <= 1:
        return 1, max(p, 1)

    q = 1
    s = 1
    n = p
    d = 2
    while d * d <= n:
        exp = 0
        while n % d == 0:
            n //= d
            exp += 1
        if exp:
            q *= d ** (exp // 2)
            if exp % 2 == 1:
                s *= d
        d = 3 if d == 2 else d + 2
    if n > 1:
        s *= n
    return q, s


def preprocesar_raiz_cuadrada(p: int) -> Dict:
    """
    Preprocesa el radicando p para detectar casos especiales.
    """
    q, s = simplificar_radicando(p)

    if es_cuadrado_perfecto(p):
        return {
            'es_racional': True,
            'valor_entero': q,
            'radicando_simplificado': s,
            'factor_entero': q,
        }

    return {
        'es_racional': False,
        'valor_entero': None,
        'radicando_simplificado': s,
        'factor_entero': q,
    }


# ============================================================================
# ALGORITMO DE EXPANSIÓN
# ============================================================================

def expandir_fraccion_continua_cuadratica(p: int) -> Tuple[List[int], List[int], List[Dict]]:
    """
    Expande √p en fracción continua simple periódica usando el algoritmo (m, d).

    Convención: preperiodo[0] = a₀; periodo = bloque tras ';' en [a₀; overline{...}].
    """
    a0 = math.isqrt(p)
    if a0 * a0 == p:
        return [a0], [], []

    coefs = [a0]
    pasos: List[Dict] = []
    visto: Dict[EstadoCuadratico, int] = {}

    m, d = 0, 1
    a = a0
    paso_num = 1

    while True:
        m = d * a - m
        numerador_d = p - m * m
        assert numerador_d % d == 0, (
            f"Error de implementación: (p - m²) = {numerador_d} no es divisible por d = {d}"
        )
        d = numerador_d // d
        a = (a0 + m) // d

        estado = EstadoCuadratico(m, d)
        if estado in visto:
            inicio_periodo = visto[estado]
            for paso in pasos:
                if paso.get('indice_coeficiente') == inicio_periodo:
                    paso['es_inicio_periodo'] = True
                    break
            return coefs[:inicio_periodo], coefs[inicio_periodo:], pasos

        pasos.append({
            'paso': paso_num,
            'a_i': a,
            'm': m,
            'd': d,
            'indice_coeficiente': len(coefs),
            'estado_latex': f"\\frac{{{m} + \\sqrt{{{p}}}}}{{{d}}}",
            'es_inicio_periodo': False,
        })
        coefs.append(a)
        visto[estado] = len(coefs) - 1
        paso_num += 1


# ============================================================================
# GENERACIÓN DE NOTACIÓN LATEX
# ============================================================================

def generar_notacion_latex_periodica(
    p: int, 
    preperiodo: List[int], 
    periodo: List[int]
) -> Dict:
    """
    Genera strings LaTeX para la notación de fracción continua periódica.
    
    Args:
        p: Radicando original
        preperiodo: Lista de coeficientes antes del ciclo (incluye a₀)
        periodo: Lista de coeficientes que se repiten
        
    Returns:
        Dict con:
            - 'notacion_lista': String como "[2; 1, 1, 1, 4, ...]"
            - 'notacion_periodica': String como "[2; \\overline{1,1,1,4}]"
            - 'latex': String como "\\sqrt{7} = [2;\\overline{1,1,1,4}]"
            
    Ejemplos:
        generar_notacion_latex_periodica(7, [2], [1,1,1,4]) -> 
            {'notacion_lista': '[2; 1, 1, 1, 4, ...]', 
             'notacion_periodica': '[2; \\overline{1,1,1,4}]',
             'latex': '\\sqrt{7} = [2;\\overline{1,1,1,4}]'}
    """
    if not preperiodo:
        notacion_lista = "[]"
        notacion_periodica = "[]"
        latex = f"\\sqrt{{{p}}} = []"
    elif not periodo:
        notacion_lista = f"[{','.join(map(str, preperiodo))}]"
        notacion_periodica = notacion_lista
        latex = f"\\sqrt{{{p}}} = {notacion_periodica}"
    else:
        a0 = preperiodo[0]
        cola_pre = preperiodo[1:]
        per_str = ','.join(map(str, periodo))

        if cola_pre:
            prefijo = f"{a0},{','.join(map(str, cola_pre))}"
        else:
            prefijo = str(a0)

        notacion_lista = f"[{prefijo}; {per_str}, ...]"
        notacion_periodica = f"[{prefijo}; \\overline{{{per_str}}}]"
        latex = f"\\sqrt{{{p}}} = {notacion_periodica}"
    
    return {
        'notacion_lista': notacion_lista,
        'notacion_periodica': notacion_periodica,
        'latex': latex
    }


# ============================================================================
# FUNCIÓN PRINCIPAL (ORQUESTADOR)
# ============================================================================

def calcular_fraccion_continua_periodica_raiz(p: int, indice: int) -> Dict:
    """
    Calcula la fracción continua simple periódica de √p.
    
    Proceso:
    1. Valida entrada (p ≥ 2, indice = 2)
    2. Preprocesa para detectar cuadrados perfectos
    3. Si es racional, retorna fracción finita
    4. Si es irracional, expande usando algoritmo (m, d)
    5. Genera notación LaTeX
    6. Retorna dict completo con exito/mensaje
    
    Args:
        p: Radicando (entero ≥ 2)
        indice: Índice de la raíz (V1 solo acepta 2)
        
    Returns:
        Dict con:
            - 'exito': bool
            - 'input': Dict con p, indice, radicando_simplificado
            - 'es_racional': bool
            - 'es_periodico': bool
            - 'coeficientes': Dict con preperiodo, periodo, a0, longitudes
            - 'fraccion_continua': Dict con notaciones LaTeX
            - 'pasos': List[Dict] con detalles del algoritmo
            - 'mensaje': str informativo
            - 'error': str (solo si exito=False)
            
    Ejemplos:
        calcular_fraccion_continua_periodica_raiz(7, 2) -> 
            {'exito': True, 'es_racional': False, 'es_periodico': True, ...}
            
        calcular_fraccion_continua_periodica_raiz(4, 2) -> 
            {'exito': True, 'es_racional': True, 'es_periodico': False, ...}
            
        calcular_fraccion_continua_periodica_raiz(7, 3) -> 
            {'exito': False, 'error': 'V1 solo soporta índice = 2...', ...}
    """
    try:
        # Validar entrada
        validar_entrada_raiz(p, indice)
        
        # Preprocesar
        preproceso = preprocesar_raiz_cuadrada(p)
        
        # Caso racional (cuadrado perfecto)
        if preproceso['es_racional']:
            valor = preproceso['valor_entero']
            preperiodo = [valor]
            periodo = []
            pasos = []
            
            notacion = generar_notacion_latex_periodica(p, preperiodo, periodo)
            
            return {
                'exito': True,
                'input': {
                    'p': p,
                    'indice': indice,
                    'radicando_simplificado': preproceso['radicando_simplificado'],
                    'factor_entero': preproceso['factor_entero'],
                },
                'es_racional': True,
                'es_periodico': False,
                'coeficientes': {
                    'preperiodo': preperiodo,
                    'periodo': periodo,
                    'a0': valor,
                    'longitud_preperiodo': 1,
                    'longitud_periodo': 0
                },
                'fraccion_continua': notacion,
                'pasos': pasos,
                'mensaje': f"√{p} = {valor} es racional (cuadrado perfecto). "
                          f"Fracción continua finita: {notacion['notacion_periodica']}"
            }
        
        # Caso irracional: expandir sobre el radicando original p
        preperiodo, periodo, pasos = expandir_fraccion_continua_cuadratica(p)
        
        notacion = generar_notacion_latex_periodica(p, preperiodo, periodo)
        
        return {
            'exito': True,
            'input': {
                'p': p,
                'indice': indice,
                'radicando_simplificado': preproceso['radicando_simplificado'],
                'factor_entero': preproceso['factor_entero'],
            },
            'es_racional': False,
            'es_periodico': True,
            'coeficientes': {
                'preperiodo': preperiodo,
                'periodo': periodo,
                'a0': preperiodo[0] if preperiodo else 0,
                'longitud_preperiodo': len(preperiodo),
                'longitud_periodo': len(periodo)
            },
            'fraccion_continua': notacion,
            'pasos': pasos,
            'mensaje': f"Fracción continua periódica de √{p} calculada: "
                      f"{notacion['notacion_periodica']}"
        }
    
    except ValueError as e:
        return {
            'exito': False,
            'error': str(e),
            'mensaje': f"Error al calcular fracción continua periódica: {str(e)}"
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
    # Ejemplo 1: √2
    print("=" * 80)
    print("EJEMPLO 1: √2")
    print("=" * 80)
    resultado1 = calcular_fraccion_continua_periodica_raiz(2, 2)
    print(f"Exito: {resultado1['exito']}")
    print(f"Es racional: {resultado1['es_racional']}")
    print(f"Es periódico: {resultado1['es_periodico']}")
    print(f"Preperíodo: {resultado1['coeficientes']['preperiodo']}")
    print(f"Período: {resultado1['coeficientes']['periodo']}")
    print(f"LaTeX: {resultado1['fraccion_continua']['latex']}")
    print(f"Mensaje: {resultado1['mensaje']}")
    
    # Ejemplo 2: √6
    print("\n" + "=" * 80)
    print("EJEMPLO 2: √6")
    print("=" * 80)
    resultado6 = calcular_fraccion_continua_periodica_raiz(6, 2)
    print(f"Preperíodo: {resultado6['coeficientes']['preperiodo']}")
    print(f"Período: {resultado6['coeficientes']['periodo']}")
    print(f"LaTeX: {resultado6['fraccion_continua']['latex']}")

    # Ejemplo 3: √7
    print("\n" + "=" * 80)
    print("EJEMPLO 3: √7")
    print("=" * 80)
    resultado2 = calcular_fraccion_continua_periodica_raiz(7, 2)
    print(f"Exito: {resultado2['exito']}")
    print(f"Es racional: {resultado2['es_racional']}")
    print(f"Es periódico: {resultado2['es_periodico']}")
    print(f"Preperíodo: {resultado2['coeficientes']['preperiodo']}")
    print(f"Período: {resultado2['coeficientes']['periodo']}")
    print(f"LaTeX: {resultado2['fraccion_continua']['latex']}")
    print(f"Mensaje: {resultado2['mensaje']}")
    
    # Ejemplo 4: √4 (cuadrado perfecto)
    print("\n" + "=" * 80)
    print("EJEMPLO 4: √4 (cuadrado perfecto)")
    print("=" * 80)
    resultado3 = calcular_fraccion_continua_periodica_raiz(4, 2)
    print(f"Exito: {resultado3['exito']}")
    print(f"Es racional: {resultado3['es_racional']}")
    print(f"Es periódico: {resultado3['es_periodico']}")
    print(f"Preperíodo: {resultado3['coeficientes']['preperiodo']}")
    print(f"Período: {resultado3['coeficientes']['periodo']}")
    print(f"LaTeX: {resultado3['fraccion_continua']['latex']}")
    print(f"Mensaje: {resultado3['mensaje']}")
    
    # Ejemplo 5: √7 con índice 3 (error)
    print("\n" + "=" * 80)
    print("EJEMPLO 5: √7 con índice 3 (debe fallar)")
    print("=" * 80)
    resultado4 = calcular_fraccion_continua_periodica_raiz(7, 3)
    print(f"Exito: {resultado4['exito']}")
    print(f"Error: {resultado4.get('error', 'N/A')}")
    print(f"Mensaje: {resultado4['mensaje']}")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import numpy as np
from pasos.paso1_numero_sin_periodo import numero_sin_periodo
from pasos.paso2_numero_antes_periodo import numero_antes_periodo
from pasos.paso3_calcular_numerador import calcular_numerador
from pasos.paso4_calcular_denominador import calcular_denominador
from pasos.paso_numero_sin_periodo_fraccion import calcular_fraccion_sin_periodo
from utils.convertir_fraccion_base import convertir_fraccion_base
from utils.prime_factors import get_common_prime_factors
from utils.convertir_fraccion_base_comun import convertir_fracciones_a_base_comun
from operaciones.fraccion_nmal import dividir_fraccion_en_base
from operaciones.operaciones_fracciones import operar_fracciones_en_base, convertir_a_base_con_signo

app = FastAPI(title="Math Tutor - Convertidor de Periódicos", version="1.0")

# Configurar CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nmal-fraccion.vercel.app",
        "https://nmal-fraccion.onrender.com",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PeriodicoInput(BaseModel):
    """Modelo de entrada para convertir un número periódico a fracción"""
    entero: str
    no_periodo: str
    periodo: str
    base: int

class PasoResponse(BaseModel):
    """Respuesta con detalles de cada paso"""
    paso: int
    descripcion: str
    resultado: str
    valor: Optional[int] = None

class FraccionResponse(BaseModel):
    """Respuesta final con el resultado completo"""
    input: PeriodicoInput
    pasos: list[PasoResponse]
    fraccion_decimal: str
    numerador: int
    denominador: int
    fraccion_base_original: str

class CommonPrimeFactorsInput(BaseModel):
    """Modelo de entrada para obtener factores primos comunes"""
    denominador1: str
    denominador2: str

class CommonPrimeFactorsResponse(BaseModel):
    """Respuesta con factores primos comunes"""
    denominador1: str
    denominador2: str
    common_factors: str
    factores_list: list

class CommonBaseConversionInput(BaseModel):
    fraccion1: str
    fraccion2: str

class CommonBaseConversionResponse(BaseModel):
    fraccion1_base_cambio: str
    fraccion2_base_cambio: str
    base_cambio: int

class DividirFraccionInput(BaseModel):
    """Modelo para operar con fracciones en cualquier base"""
    numerador1: str
    denominador1: str
    numerador2: str
    denominador2: str
    base: int
    operacion: str = "suma"  # suma, resta, multiplicacion, division

class DividirFraccionResponse(BaseModel):
    """Respuesta de la división de fracciones"""
    operacion: str
    base: int
    resultado_entero: str
    resultado_decimal: str
    resultado_completo: str
    es_periodico: bool
    decimal_base10: float

class ConvertirBaseInput(BaseModel):
    """Modelo de entrada para convertir un número n-mal entre bases"""
    entero: str
    no_periodo: str
    periodo: str
    base_origen: int
    base_destino: int

class ConvertirBaseResponse(BaseModel):
    """Respuesta de conversión entre bases"""
    numero_original: str
    numero_convertido: str
    resultado_nmal: Optional[str] = None
    valor_base_10: float
    base_origen: int
    base_destino: int
    numerador_base_10: int
    denominador_base_10: int
    numerador_origen: str
    denominador_origen: str
    numerador_destino: str
    denominador_destino: str
    detalles: str

class ConvertirFraccionANmalInput(BaseModel):
    """Modelo de entrada para convertir fracción a n-mal"""
    numerador: str
    denominador: str
    base: int

class ConvertirFraccionANmalResponse(BaseModel):
    """Respuesta de conversión de fracción a n-mal"""
    numerador: str
    denominador: str
    base: int
    resultado_entero: str
    resultado_decimal: str
    resultado_completo: str
    es_periodico: bool
    decimal_base10: float
    numerador_base10: int
    denominador_base10: int

@app.get("/")
def root():
    return {
        "mensaje": "Bienvenido a Math Tutor Backend",
        "version": "1.0",
        "descripcion": "Convierte números periódicos en cualquier base a fracciones",
        "endpoint": "/convertir-periodico"
    }

@app.post("/convertir-periodico", response_model=FraccionResponse)
def convertir_periodico(input_data: PeriodicoInput):
    """
    Convierte un número periódico o sin período en una base dada a una fracción.
    
    Para periódicos:
    {
        "entero": "0",
        "no_periodo": "1",
        "periodo": "6",
        "base": 7
    }
    
    Para números sin período:
    {
        "entero": "2",
        "no_periodo": "5",
        "periodo": "",
        "base": 8
    }
    """
    try:
        pasos = []
        numerador = None
        denominador = None
        
        # Detectar si es número sin período o periódico
        es_sin_periodo = not input_data.periodo or input_data.periodo == ""
        
        if es_sin_periodo:
            # CASO: NÚMERO SIN PERÍODO (ej: 2.5 en base 8)
            try:
                numerador, denominador = calcular_fraccion_sin_periodo(
                    input_data.entero, 
                    input_data.no_periodo, 
                    input_data.base
                )
                
                # Descripción del proceso
                numero_display = f"{input_data.entero}.{input_data.no_periodo}"
                pasos.append(PasoResponse(
                    paso=1,
                    descripcion=f"Número sin período: {numero_display} en base {input_data.base}",
                    resultado=f"{numero_display} (base {input_data.base})",
                    valor=None
                ))
                
                pasos.append(PasoResponse(
                    paso=2,
                    descripcion="Calcular numerador (número sin la coma)",
                    resultado=f"{input_data.entero}{input_data.no_periodo} (base {input_data.base}) = {numerador} (base 10)",
                    valor=numerador
                ))
                
                cantidad_decimales = len(input_data.no_periodo)
                pasos.append(PasoResponse(
                    paso=3,
                    descripcion="Calcular denominador (base^cantidad_decimales)",
                    resultado=f"{input_data.base}^{cantidad_decimales} = {denominador}",
                    valor=denominador
                ))
                
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error procesando número sin período: {str(e)}")
        
        else:
            # CASO: NÚMERO PERIÓDICO (lógica original)
            try:
                num_sin_periodo = numero_sin_periodo(input_data.entero, input_data.no_periodo, input_data.periodo, input_data.base)
                pasos.append(PasoResponse(
                    paso=1,
                    descripcion="Convertir número completo (entero + no período + período) a base 10",
                    resultado=f"{input_data.entero}{input_data.no_periodo}{input_data.periodo} (base {input_data.base}) = {num_sin_periodo} (base 10)",
                    valor=num_sin_periodo
                ))
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error en Paso 1: {str(e)}")
            
            try:
                num_antes_periodo = numero_antes_periodo(input_data.entero, input_data.no_periodo, input_data.base)
                pasos.append(PasoResponse(
                    paso=2,
                    descripcion="Convertir número sin período (entero + no período) a base 10",
                    resultado=f"{input_data.entero}{input_data.no_periodo} (base {input_data.base}) = {num_antes_periodo} (base 10)",
                    valor=num_antes_periodo
                ))
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error en Paso 2: {str(e)}")
            
            try:
                numerador = calcular_numerador(num_sin_periodo, num_antes_periodo)
                pasos.append(PasoResponse(
                    paso=3,
                    descripcion="Calcular numerador restando número sin período del número completo",
                    resultado=f"{num_sin_periodo} - {num_antes_periodo} = {numerador}",
                    valor=numerador
                ))
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error en Paso 3: {str(e)}")
            
            m = len(input_data.no_periodo)
            n = len(input_data.periodo)
            
            try:
                denominador = calcular_denominador(input_data.base, m, n)
                formula = f"{input_data.base}^{m} × ({input_data.base}^{n} - 1) = {denominador}"
                pasos.append(PasoResponse(
                    paso=4,
                    descripcion="Calcular denominador con la fórmula: base^m × (base^n - 1)",
                    resultado=formula,
                    valor=denominador
                ))
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error en Paso 4: {str(e)}")
        
        # VALIDAR que se calcularon numerador y denominador
        if numerador is None or denominador is None:
            raise HTTPException(status_code=400, detail="Error: No se pudieron calcular numerador y denominador")
        
        # PASO FINAL: Convertir fracción a la base original (para ambos casos)
        try:
            num_base, den_base = convertir_fraccion_base(numerador, denominador, input_data.base)
            paso_final = 4 if es_sin_periodo else 5
            pasos.append(PasoResponse(
                paso=paso_final,
                descripcion=f"Convertir fracción a base {input_data.base}",
                resultado=f"{numerador} (base 10) = {num_base} (base {input_data.base}), {denominador} (base 10) = {den_base} (base {input_data.base})",
                valor=None
            ))
            fraccion_base = f"{num_base}/{den_base}"
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error en paso final: {str(e)}")
        
        # Retornar respuesta completa
        return FraccionResponse(
            input=input_data,
            pasos=pasos,
            fraccion_decimal=f"{numerador}/{denominador}",
            numerador=numerador,
            denominador=denominador,
            fraccion_base_original=fraccion_base
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")

@app.post("/convertir-periodico-simple")
def convertir_periodico_simple(entero: str, no_periodo: str, periodo: str, base: int):
    """
    Versión simplificada con parámetros en query string.
    
    Ejemplo: /convertir-periodico-simple?entero=0&no_periodo=1&periodo=6&base=7
    """
    input_data = PeriodicoInput(
        entero=entero,
        no_periodo=no_periodo,
        periodo=periodo,
        base=base
    )
    return convertir_periodico(input_data)

@app.post("/common-prime-factors", response_model=CommonPrimeFactorsResponse)
def common_prime_factors(input_data: CommonPrimeFactorsInput):
    """
    Calcula el conjunto de todos los factores primos únicos entre dos denominadores.
    
    Retorna todos los factores primos de ambos denominadores como un conjunto único,
    sin repeticiones ni exponentes.
    
    Ejemplo:
    {
        "denominador1": "12",
        "denominador2": "18"
    }
    
    Respuesta:
    {
        "denominador1": "12",
        "denominador2": "18",
        "common_factors": "2, 3",
        "factores_list": [2, 3]
    }
    """
    try:
        denom1 = input_data.denominador1
        denom2 = input_data.denominador2
        
        factores_list, common_factors_string = get_common_prime_factors(denom1, denom2)
        
        return CommonPrimeFactorsResponse(
            denominador1=denom1,
            denominador2=denom2,
            common_factors=common_factors_string,
            factores_list=factores_list
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al calcular factores primos: {str(e)}")

@app.post("/convertir-base-comun", response_model=CommonBaseConversionResponse)
def convertir_base_comun(input_data: CommonBaseConversionInput):
    try:
        # Convertir fracciones - base_comun se calcula internamente usando factores primos
        resultado = convertir_fracciones_a_base_comun(
            input_data.fraccion1,
            input_data.fraccion2
        )

        return CommonBaseConversionResponse(
            fraccion1_base_cambio=resultado['fraccion1_base_cambio'],
            fraccion2_base_cambio=resultado['fraccion2_base_cambio'],
            base_cambio=resultado['base_cambio']
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al convertir a base común: {str(e)}")

@app.post("/dividir-fracciones", response_model=DividirFraccionResponse)
def operar_fracciones_endpoint(input_data: DividirFraccionInput):
    """
    Suma, resta, multiplica o divide dos fracciones en cualquier base y retorna el resultado en esa base.
    
    Operaciones soportadas:
    - suma: (a/b) + (c/d) = (a*d + c*b) / (b*d)
    - resta: (a/b) - (c/d) = (a*d - c*b) / (b*d)
    - multiplicacion: (a/b) * (c/d) = (a*c) / (b*d)
    - division: (a/b) / (c/d) = (a*d) / (b*c)
    
    Ejemplo:
    {
        "numerador1": "1",
        "denominador1": "2",
        "numerador2": "1",
        "denominador2": "2",
        "base": 10,
        "operacion": "suma"
    }
    """
    try:
        operacion = input_data.operacion.lower().strip()
        
        # Usar la función mejorada para realizar la operación
        numerador_resultado, denominador_resultado, es_negativo = operar_fracciones_en_base(
            input_data.numerador1,
            input_data.denominador1,
            input_data.numerador2,
            input_data.denominador2,
            input_data.base,
            operacion
        )
        
        # Convertir resultado a la base especificada, manejando signo correctamente
        numerador_resultado_str = convertir_a_base_con_signo(numerador_resultado, input_data.base, es_negativo)
        denominador_resultado_str = convertir_a_base_con_signo(denominador_resultado, input_data.base, False)
        
        # Usar la función fraccion_nmal para obtener el resultado decimal en la base original
        resultado = dividir_fraccion_en_base(
            numerador_resultado_str,
            denominador_resultado_str,
            input_data.base
        )
        
        return DividirFraccionResponse(
            operacion=operacion,
            base=input_data.base,
            resultado_entero=resultado['resultado_entero'],
            resultado_decimal=resultado['resultado_decimal'],
            resultado_completo=resultado['resultado_completo'],
            es_periodico=resultado['es_periodico'],
            decimal_base10=resultado['decimal_base10']
        )
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al operar fracciones: {str(e)}")

@app.post("/convertir-base", response_model=ConvertirBaseResponse)
def convertir_base(input_data: ConvertirBaseInput):
    """
    Convierte un número n-mal de una base a otra.
    
    Ejemplo:
    {
        "entero": "3",
        "no_periodo": "25",
        "periodo": "3",
        "base_origen": 10,
        "base_destino": 2
    }
    """
    try:
        # Validar bases
        if input_data.base_origen < 2 or input_data.base_origen > 36:
            raise HTTPException(status_code=400, detail="Base origen debe estar entre 2 y 36")
        
        if input_data.base_destino < 2 or input_data.base_destino > 36:
            raise HTTPException(status_code=400, detail="Base destino debe estar entre 2 y 36")
        
        if input_data.base_origen == input_data.base_destino:
            raise HTTPException(status_code=400, detail="Las bases origen y destino deben ser diferentes")
        
        # Convertir la fracción n-mal a una fracción en base 10
        numero_input = PeriodicoInput(
            entero=input_data.entero,
            no_periodo=input_data.no_periodo,
            periodo=input_data.periodo,
            base=input_data.base_origen
        )
        
        respuesta_base_10 = convertir_periodico(numero_input)
        numerador_base_10 = respuesta_base_10.numerador
        denominador_base_10 = respuesta_base_10.denominador
        
        # Calcular el valor decimal en base 10
        valor_base_10 = numerador_base_10 / denominador_base_10
        
        # Convertir la fracción a la base origen
        numerador_origen, denominador_origen = convertir_fraccion_base(
            numerador_base_10, 
            denominador_base_10, 
            input_data.base_origen
        )
        numerador_origen = str(numerador_origen).upper()
        denominador_origen = str(denominador_origen).upper()
        
        # Convertir la fracción a la base destino
        numerador_destino, denominador_destino = convertir_fraccion_base(
            numerador_base_10, 
            denominador_base_10, 
            input_data.base_destino
        )
        numerador_destino = str(numerador_destino).upper()
        denominador_destino = str(denominador_destino).upper()
        
        # Construir el número original y convertido como strings
        if input_data.periodo and input_data.periodo != "":
            numero_original = f"{input_data.entero}.{input_data.no_periodo}({input_data.periodo})"
        else:
            numero_original = f"{input_data.entero}.{input_data.no_periodo}"
        
        numero_convertido = f"{numerador_destino}/{denominador_destino}"
        
        # Calcular el resultado n-mal en la base destino
        resultado_div = dividir_fraccion_en_base(
            numerador_destino, 
            denominador_destino, 
            input_data.base_destino
        )
        resultado_nmal = resultado_div['resultado_completo']
        
        detalles = f"Conversión de base {input_data.base_origen} a base {input_data.base_destino}. " \
                   f"Numerador: {numerador_base_10} (base 10) = {numerador_origen} (base {input_data.base_origen}) = {numerador_destino} (base {input_data.base_destino}). " \
                   f"Denominador: {denominador_base_10} (base 10) = {denominador_origen} (base {input_data.base_origen}) = {denominador_destino} (base {input_data.base_destino})."
        
        return ConvertirBaseResponse(
            numero_original=numero_original,
            numero_convertido=numero_convertido,
            resultado_nmal=resultado_nmal,
            valor_base_10=valor_base_10,
            base_origen=input_data.base_origen,
            base_destino=input_data.base_destino,
            numerador_base_10=numerador_base_10,
            denominador_base_10=denominador_base_10,
            numerador_origen=numerador_origen,
            denominador_origen=denominador_origen,
            numerador_destino=numerador_destino,
            denominador_destino=denominador_destino,
            detalles=detalles
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al convertir entre bases: {str(e)}")

@app.post("/fraccion-a-nmal", response_model=ConvertirFraccionANmalResponse)
def fraccion_a_nmal(input_data: ConvertirFraccionANmalInput):
    """
    Toma una fracción (numerador y denominador) en una base específica y devuelve 
    su equivalente como número de coma flotante (n-mal), incluyendo notación periódica.
    """
    try:
        resultado = dividir_fraccion_en_base(
            input_data.numerador,
            input_data.denominador,
            input_data.base
        )
        return ConvertirFraccionANmalResponse(**resultado)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al convertir fracción a n-mal: {str(e)}")

if __name__ == "__main__":

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

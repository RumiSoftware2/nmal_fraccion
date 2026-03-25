from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from pasos.paso1_numero_sin_periodo import numero_sin_periodo
from pasos.paso2_numero_antes_periodo import numero_antes_periodo
from pasos.paso3_calcular_numerador import calcular_numerador
from pasos.paso4_calcular_denominador import calcular_denominador
from pasos.paso_numero_sin_periodo_fraccion import calcular_fraccion_sin_periodo
from utils.convertir_fraccion_base import convertir_fraccion_base
from utils.prime_factors import get_common_prime_factors

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
    factores_dict: dict

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
    Calcula los factores primos comunes entre dos denominadores.
    
    Los factores comunes son aquellos que aparecen en ambos denominadores,
    sin importar el exponente (se toma el menor exponente).
    
    Ejemplo:
    {
        "denominador1": "12",
        "denominador2": "18"
    }
    
    Respuesta:
    {
        "denominador1": "12",
        "denominador2": "18",
        "common_factors": "2 × 3",
        "factores_dict": {"2": 1, "3": 1}
    }
    """
    try:
        denom1 = input_data.denominador1
        denom2 = input_data.denominador2
        
        factores_dict, common_factors_string = get_common_prime_factors(denom1, denom2)
        
        return CommonPrimeFactorsResponse(
            denominador1=denom1,
            denominador2=denom2,
            common_factors=common_factors_string,
            factores_dict={str(k): v for k, v in factores_dict.items()}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al calcular factores primos: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from pasos.paso1_numero_sin_periodo import numero_sin_periodo
from pasos.paso2_numero_antes_periodo import numero_antes_periodo
from pasos.paso3_calcular_numerador import calcular_numerador
from pasos.paso4_calcular_denominador import calcular_denominador
from utils.convertir_fraccion_base import convertir_fraccion_base

app = FastAPI(title="Math Tutor - Convertidor de Periódicos", version="1.0")

# Configurar CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite solicitudes de cualquier origen
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los headers
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
    Convierte un número periódico en una base dada a una fracción.
    
    Ejemplo:
    {
        "entero": "0",
        "no_periodo": "1",
        "periodo": "6",
        "base": 7
    }
    """
    try:
        pasos = []
        
        # PASO 1: Número sin período convertido a base 10
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
        
        # PASO 2: Número antes del período convertido a base 10
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
        
        # PASO 3: Calcular numerador
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
        
        # Obtener longitudes de no período y período
        m = len(input_data.no_periodo)
        n = len(input_data.periodo)
        
        # PASO 4: Calcular denominador
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
        
        # PASO 5: Convertir fracción a la base original
        try:
            num_base, den_base = convertir_fraccion_base(numerador, denominador, input_data.base)
            pasos.append(PasoResponse(
                paso=5,
                descripcion=f"Convertir fracción a base {input_data.base}",
                resultado=f"{numerador} (base 10) = {num_base} (base {input_data.base}), {denominador} (base 10) = {den_base} (base {input_data.base})",
                valor=None
            ))
            fraccion_base = f"{num_base}/{den_base}"
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error en Paso 5: {str(e)}")
        
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

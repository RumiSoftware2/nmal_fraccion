# Math Tutor - Backend de Conversión de Periódicos a Fracciones

Un backend FastAPI que convierte números periódicos en cualquier base numérica a fracciones.

## Instalación

```bash
# Instalar dependencias
pip install -r requirements.txt
```

## Uso

### Iniciar el servidor

```bash
python app.py
```

El servidor estará disponible en: `http://localhost:8000`

### Acceder a la documentación interactiva

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Endpoints

### 1. Convertidor de Periódicos (JSON)

**POST** `/convertir-periodico`

Envía los parámetros en formato JSON:

```json
{
    "entero": "0",
    "no_periodo": "1",
    "periodo": "6",
    "base": 7
}
```

**Respuesta:**
```json
{
    "input": {
        "entero": "0",
        "no_periodo": "1",
        "periodo": "6",
        "base": 7
    },
    "pasos": [
        {
            "paso": 1,
            "descripcion": "Convertir número completo (entero + no período + período) a base 10",
            "resultado": "0166 (base 7) = 83 (base 10)",
            "valor": 83
        },
        {
            "paso": 2,
            "descripcion": "Convertir número sin período (entero + no período) a base 10",
            "resultado": "01 (base 7) = 1 (base 10)",
            "valor": 1
        },
        {
            "paso": 3,
            "descripcion": "Calcular numerador restando número sin período del número completo",
            "resultado": "83 - 1 = 82",
            "valor": 82
        },
        {
            "paso": 4,
            "descripcion": "Calcular denominador con la fórmula: base^m × (base^n - 1)",
            "resultado": "7^1 × (7^1 - 1) = 42",
            "valor": 42
        },
        {
            "paso": 5,
            "descripcion": "Convertir fracción a base 7",
            "resultado": "82 (base 10) = 116 (base 7), 42 (base 10) = 60 (base 7)",
            "valor": null
        }
    ],
    "fraccion_decimal": "82/42",
    "numerador": 82,
    "denominador": 42,
    "fraccion_base_original": "116/60"
}
```

### 2. Convertidor de Periódicos (Query Parameters)

**POST** `/convertir-periodico-simple?entero=0&no_periodo=1&periodo=6&base=7`

**Parámetros:**
- `entero`: Parte entera (string)
- `no_periodo`: Parte no periódica (string)
- `periodo`: Parte periódica (string)
- `base`: Base numérica (entero)

## Ejemplo de uso con cURL

```bash
# Con JSON
curl -X POST "http://localhost:8000/convertir-periodico" \
  -H "Content-Type: application/json" \
  -d '{"entero":"0", "no_periodo":"1", "periodo":"6", "base":7}'

# Con query parameters
curl -X POST "http://localhost:8000/convertir-periodico-simple?entero=0&no_periodo=1&periodo=6&base=7"
```

## Ejemplo de uso con Python

```python
import requests

url = "http://localhost:8000/convertir-periodico"
data = {
    "entero": "0",
    "no_periodo": "1",
    "periodo": "6",
    "base": 7
}

response = requests.post(url, json=data)
resultado = response.json()

print(f"Fracción decimal: {resultado['fraccion_decimal']}")
print(f"Fracción en base {resultado['input']['base']}: {resultado['fraccion_base_original']}")

print("\nPasos:")
for paso in resultado['pasos']:
    print(f"  Paso {paso['paso']}: {paso['descripcion']}")
    print(f"    → {paso['resultado']}")
```

## Ejemplo de uso con JavaScript/Fetch

```javascript
const data = {
    entero: "0",
    no_periodo: "1",
    periodo: "6",
    base: 7
};

fetch('http://localhost:8000/convertir-periodico', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(resultado => {
    console.log(`Fracción decimal: ${resultado.fraccion_decimal}`);
    console.log(`Fracción en base ${resultado.input.base}: ${resultado.fraccion_base_original}`);
    
    console.log('\nPasos:');
    resultado.pasos.forEach(paso => {
        console.log(`  Paso ${paso.paso}: ${paso.descripcion}`);
        console.log(`    → ${paso.resultado}`);
    });
});
```

## Estructura del Proyecto

```
math-tutor/
├── app.py                      # Backend FastAPI
├── main.py                     # Script original (referencia)
├── requirements.txt            # Dependencias
├── pasos/                      # Módulos de cálculo
│   ├── paso1_numero_sin_periodo.py
│   ├── paso2_numero_antes_periodo.py
│   ├── paso3_calcular_numerador.py
│   ├── paso4_calcular_denominador.py
│   └── paso5_construir_fraccion.py
└── utils/                      # Utilidades
    └── convertir_fraccion_base.py
```

## Flujo de Cálculo

1. **Paso 1**: Convierte el número completo (entero + no período + período) en la base dada a decimal
2. **Paso 2**: Convierte el número sin período (entero + no período) en la base dada a decimal
3. **Paso 3**: Calcula el numerador: número_completo - número_sin_período
4. **Paso 4**: Calcula el denominador: base^m × (base^n - 1)
   - m = longitud de la parte no periódica
   - n = longitud de la parte periódica
5. **Paso 5**: Convierte resultado a la base original

## Notas

- El resultado es una **fracción no simplificada**
- Los pasos se muestran en formato decimal y convertidos a la base original
- Válido para cualquier base numérica (2, 7, 10, 16, etc.)

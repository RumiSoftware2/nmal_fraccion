# 🚀 Inicio Rápido - Math Tutor Backend

## ¿Qué es esto?

Un backend FastAPI interactivo que convierte números periódicos en cualquier base numérica a fracciones. Muestra cada paso del cálculo.

## Requisitos

- Python 3.7+
- pip
- Dependencias instaladas (ver instalación)

## 📦 Instalación

```bash
# 1. Navega a la carpeta del proyecto
cd c:\Users\smend\math-tutor

# 2. Instala las dependencias
python -m pip install -r requirements.txt
```

## 🏃 Uso Rápido

### Opción 1: CLI (Línea de comandos)

```bash
# Inicia el servidor
python app.py
```

El servidor estará disponible en `http://localhost:8000`

#### Accede a la documentación interactiva:
- **Swagger UI (recomendado)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Opción 2: Interfaz Web

1. Inicia el servidor: `python app.py`
2. Abre `index.html` en tu navegador (o arrastra el archivo a tu navegador)
3. Completa el formulario y presiona "Convertir a Fracción"

### Opción 3: Python (Programáticamente)

```bash
# En otra terminal, ejecuta el script de prueba
python test_backend.py
```

## 📌 Ejemplos de Entrada

| Descripción | Entero | No período | Período | Base |
|-------------|--------|-----------|---------|------|
| 0.1̄6̄ en base 7 | 0 | 1 | 6 | 7 |
| 0.3̄ en base 10 (1/3) | 0 | (vacío) | 3 | 10 |
| 1.2̄1̄ en base 8 | 1 | 2 | 1 | 8 |
| 0.4̄2̄ en base 10 (14/33) | 0 | (vacío) | 42 | 10 |
| 2.1̄ en base 5 | 2 | (vacío) | 1 | 5 |

## 🔌 Endpoints del API

### POST `/convertir-periodico`
Envía JSON con los parámetros

**Ejemplo con cURL:**
```bash
curl -X POST "http://localhost:8000/convertir-periodico" \
  -H "Content-Type: application/json" \
  -d '{"entero":"0", "no_periodo":"1", "periodo":"6", "base":7}'
```

**Ejemplo con curl simple:**
```bash
curl -d '{"entero":"0", "no_periodo":"", "periodo":"3", "base":10}' \
  -H "Content-Type: application/json" \
  http://localhost:8000/convertir-periodico
```

### POST `/convertir-periodico-simple?entero=0&no_periodo=1&periodo=6&base=7`
Usa query parameters

## 📊 Estructura de Respuesta

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
            "descripcion": "Convertir número completo...",
            "resultado": "0166 (base 7) = 83 (base 10)",
            "valor": 83
        },
        ...
    ],
    "fraccion_decimal": "82/42",
    "numerador": 82,
    "denominador": 42,
    "fraccion_base_original": "116/60"
}
```

## 🐛 Solución de Problemas

### "Connection refused" (http://localhost:8000)
- ¿Ejecutaste `python app.py`? 
- ¿Está corriendo en otra terminal?
- Intenta abrir http://localhost:8000 en tu navegador

### Error al instalar dependencias
```bash
# Asegúrate de usar la versión correcta de Python
python --version

# Intenta con pip3
pip3 install -r requirements.txt
```

### El frontend en HTML no funciona
- Asegúrate que el servidor FastAPI está corriendo
- Abre la consola del navegador (F12) para ver errores
- Verifica que el puerto 8000 es accesible

## 📁 Archivos Principales

| Archivo | Propósito |
|---------|-----------|
| `app.py` | Backend FastAPI principal |
| `index.html` | Interfaz web |
| `test_backend.py` | Script de pruebas |
| `main.py` | Script original de referencia |
| `README.md` | Documentación completa |

## 🧮 Matemática Detrás

Si tienes un número periódico como **0.1̄6̄** en base 7:

1. Convierte **0.1̄6̄** a decimal basado en la base: **83₁₀**
2. Convierte **0.1** a decimal: **1₁₀**
3. Numerador = 83 - 1 = **82**
4. Número de dígitos sin período (m) = 1
5. Número de dígitos periódicos (n) = 1
6. Denominador = 7¹ × (7¹ - 1) = 7 × 6 = **42**
7. **Fracción = 82/42 (base 10) = 116/60 (base 7)**

## 💡 Consejos

- Para probar rápido, usa la documentación Swagger en `/docs`
- Los valores en "no_periodo" pueden estar vacíos
- La base puede ser cualquier número entre 2 y 36
- El resultado es una **fracción no simplificada**

---

¿Necesitas ayuda? Revisa el [README.md](README.md) para más detalles.

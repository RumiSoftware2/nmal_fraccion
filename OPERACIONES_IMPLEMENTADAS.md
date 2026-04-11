# Operaciones Aritméticas de Fracciones en Múltiples Bases

## 📋 Resumen de Implementación

Se ha implementado el soporte para **suma, resta, multiplicación y división** de fracciones en cualquier base (2-36).

---

## 🔧 Componentes Backend

### 1. **app.py** - Endpoint Principal
**Ruta:** `POST /dividir-fracciones`

**Parámetros:**
```json
{
  "numerador1": "1",
  "denominador1": "2",
  "numerador2": "1",
  "denominador2": "4",
  "base": 10,
  "operacion": "suma"  // suma, resta, multiplicacion, division
}
```

**Operaciones Soportadas:**
- `suma`: (a/b) + (c/d) = (a*d + c*b) / (b*d)
- `resta`: (a/b) - (c/d) = (a*d - c*b) / (b*d)
- `multiplicacion`: (a/b) * (c/d) = (a*c) / (b*d)
- `division`: (a/b) / (c/d) = (a*d) / (b*c)

**Respuesta:**
```json
{
  "operacion": "suma",
  "base": 10,
  "resultado_entero": "0",
  "resultado_decimal": "75",
  "resultado_completo": "0.75",
  "es_periodico": false,
  "decimal_base10": 0.75
}
```

---

### 2. **operaciones/operaciones_fracciones.py** - Lógica de Operaciones

**Funciones principales:**

- **`operar_fracciones_en_base()`**
  - Realiza la operación aritmética especificada
  - Convierte valores entre bases
  - Simplifica la fracción resultante
  - Maneja números negativos correctamente
  
- **`convertir_a_base_con_signo()`**
  - Convierte números a la base especificada
  - Preserva el signo para números negativos

### 3. **operaciones/fraccion_nmal.py** - Conversión de Decimales

**Funciones principales:**

- **`dividir_fraccion_en_base()`**
  - Divide una fracción en cualquier base
  - Detecta decimales periódicos
  - Maneja números negativos
  - Convierte el resultado a la base original

- **`calcular_decimal_en_base()`**
  - Convierte la parte decimal a la base especificada
  - Detecta ciclos periódicos

- **`detectar_periodico()`**
  - Determina si el resultado es un decimal periódico

---

## 🎨 Componentes Frontend

### Componentes React

| Componente | Archivo | Estilos |
|------------|---------|---------|
| **Suma** | `Suma.jsx` | `Suma.css` (azul) |
| **Resta** | `Resta.jsx` | `Resta.css` (naranja) |
| **Multiplicación** | `Multiplicacion.jsx` | `Multiplicacion.css` (amarillo) |
| **División** | `Division.jsx` | `Division.css` (púrpura) |

### Componentes de Pasos

| Componente | Archivo | Estilos |
|------------|---------|---------|
| Pasos Suma | `PasosSuma.jsx` | `PasosSuma.css` |
| Pasos Resta | `PasosResta.jsx` | `PasosResta.css` |
| Pasos Multiplicación | `PasosMultiplicacion.jsx` | `PasosMultiplicacion.css` |
| Pasos División | `PasosDivision.jsx` | `PasosDivision.css` |

### Integración

**Archivo:** `SimplePeriodicResultPanel.jsx`
- Importa todos los componentes de operaciones
- Pasa el parámetro `operacion` al backend
- Renderiza el componente adecuado según la operación seleccionada

---

## 🔄 Flujo de Datos

```
Frontend (SimplePeriodicResultPanel)
    ↓
Usuario selecciona operación (suma/resta/multiplicacion/division)
    ↓
Componente React (Suma/Resta/Multiplicacion/Division)
    ↓
API (/dividir-fracciones) con parámetro "operacion"
    ↓
Backend - operar_fracciones_en_base()
    ├─ Convierte a base 10
    ├─ Realiza operación según tipo
    ├─ Simplifica fracción
    └─ Maneja números negativos
    ↓
Backend - dividir_fraccion_en_base()
    ├─ Convierte resultado a base original
    ├─ Calcula decimales
    └─ Detecta si es periódico
    ↓
Frontend - Muestra resultado en componente
```

---

## ✅ Validaciones Implementadas

- ✓ Base debe estar entre 2 y 36
- ✓ Denominadores no pueden ser cero
- ✓ En división: numerador2 no puede ser cero
- ✓ Manejo correcto de números negativos en resta
- ✓ Simplificación automática de fracciones
- ✓ Detección de decimales periódicos

---

## 📝 Ejemplos de Uso

### Suma (Base 10)
```
1/2 + 1/4 = (1*4 + 1*2)/(2*4) = 6/8 = 3/4 = 0.75
```

### Resta (Base 10)
```
1/2 - 1/4 = (1*4 - 1*2)/(2*4) = 2/8 = 1/4 = 0.25
```

### Multiplicación (Base 10)
```
1/2 * 1/4 = (1*1)/(2*4) = 1/8 = 0.125
```

### División (Base 10)
```
1/2 ÷ 1/4 = (1*4)/(2*1) = 4/2 = 2
```

### Resta con Resultado Negativo (Base 10)
```
1/4 - 1/2 = (1*2 - 1*4)/(4*2) = -2/8 = -1/4 = -0.25
```

---

## 🚀 Funcionalidades Adicionales

### Detección de Periódicos
- Automática según la base
- Ejemplo: 1/3 en base 10 es periódico (0.333...)
- Ejemplo: 1/2 en base 10 es exacto (0.5)

### Manejo de Bases
- Bases 2-36 soportadas
- Letras A-Z para dígitos >9 en bases >10
- Ejemplo: "A" = 10 en base 16

### Pasos Detallados
- Cada operación muestra pasos intermedios
- Visualización con LaTeX/KaTeX
- Cálculos en columna para suma/resta
- Animaciones suaves

---

## 🔧 Archivos Afectados

**Backend:**
- `backend/app.py` - Endpoint actualizado
- `backend/operaciones/operaciones_fracciones.py` - NUEVO
- `backend/operaciones/fraccion_nmal.py` - Actualizado para negativos

**Frontend:**
- `frontend/src/componentes2/Suma.jsx` - Parámetro 'operacion' agregado
- `frontend/src/componentes2/Resta.jsx` - NUEVO
- `frontend/src/componentes2/Multiplicacion.jsx` - NUEVO
- `frontend/src/componentes2/Division.jsx` - NUEVO
- `frontend/src/componentes2/PasosResta.jsx` - NUEVO
- `frontend/src/componentes2/PasosMultiplicacion.jsx` - NUEVO
- `frontend/src/componentes2/PasosDivision.jsx` - NUEVO
- `frontend/src/componentes2Styles/*.css` - Estilos para nuevos componentes
- `frontend/src/componentes2/SimplePeriodicResultPanel.jsx` - Integración

---

## ✨ Estado

✅ **Implementación Completa**
- Backend soporta todas las operaciones
- Frontend integrado y funcional
- Manejo robusto de casos especiales
- Estilos visuales diferenciados por operación

# Math Tutor - Conversor de Base y Aritmética de Fracciones

## Resumen del Proyecto

Math Tutor es una aplicación web completa que permite:
1. **Convertir números n-mal** entre cualquier base numérica (2-36)
2. **Convertir números periódicos** en cualquier base a fracciones
3. **Realizar operaciones aritméticas** (suma, resta, multiplicación, división) con fracciones en múltiples bases
4. **Visualizar los pasos** del proceso de conversión y cálculo

---

## Arquitectura

### Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite |
| Backend | FastAPI + Python |
| UI Animations | Framer Motion |
| Renderizado Math | KaTeX |
| Deployment | Vercel (frontend) + Render (backend) |

### Estructura General

```
math-tutor/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── componentes3/   # ConversorBase, PasoDelConversor
│   │   ├── componentes2/     # Operaciones aritméticas
│   │   └── components/      # Componentes compartidos
│   └── package.json
│
├── backend/                  # API FastAPI
│   ├── app.py              # Endpoints principales
│   ├── operaciones/        # Lógica de conversión y operaciones
│   ├── pasos/              # Pasos de conversión de periódicos
│   └── utils/              # Utilidades
│
├── CONVERSOR_BASE_IMPLEMENTACION.md
└── OPERACIONES_IMPLEMENTADAS.md
```

---

## 1. Conversor de Base N-mal

### API Endpoint

**POST** `/convertir-base`

#### Input
```json
{
  "entero": "1",
  "no_periodo": "3",
  "periodo": "4",
  "base_origen": 10,
  "base_destino": 2
}
```

#### Output
```json
{
  "numero_original": "1.3(4)",
  "numero_convertido": "10/11",
  "resultado_nmal": "1.010101(10)",
  "valor_base_10": 1.333333,
  "base_origen": 10,
  "base_destino": 2,
  "numerador_base_10": 40,
  "denominador_base_10": 30,
  "numerador_origen": "28",
  "denominador_origen": "1E",
  "numerador_destino": "101000",
  "denominador_destino": "11110",
  "detalles": "Conversión de base 10 a base 2..."
}
```

### Algoritmo Matemático

#### Paso 1: N-mal → Fracción en Base 10

Dado un número n-mal en base $b$:
$$x = d_0.d_1d_2\ldots d_m(d_{m+1}\ldots d_{m+n})$$

Donde:
- $d_0$ = parte entera
- $d_1\ldots d_m$ = parte no periódica
- $d_{m+1}\ldots d_{m+n}$ = parte periódica

**Fórmula:**
$$x = \frac{N_{completo} - N_{sin\_periodo}}{b^m(b^n - 1)}$$

Donde:
- $N_{completo}$ = valor del número completo en base 10
- $N_{sin\_periodo}$ = valor del número sin período en base 10
- $m$ = longitud de parte no periódica
- $n$ = longitud del período

#### Paso 2: Fracción → Base Destino

El numerador y denominador se convierten individualmente a la base destino usando **divisiones enteras** o **expansión en potencias**.

##### Método A: Base origen < Base destino (Divisiones)
Se divide el número por la base destino repetidamente, leyendo los restos de abajo hacia arriba.

##### Método B: Base origen > Base destino (Potencias)
Se expresa cada posición del resultado como potencia de la base destino.

#### Ejemplo Completo

**Input:** `1.3(4)` de base 10 a base 2

1. **Convertir a fracción en base 10:**
   - $1.3(4) = \frac{40}{30} = \frac{4}{3}$

2. **Numerador en base 2:** `101000`
3. **Denominador en base 2:** `11110`
4. **Resultado n-mal:** `1.010101(10)`

---

## 2. Conversor de Periódicos a Fracción

### API Endpoint

**POST** `/convertir-periodico`

#### Input
```json
{
  "entero": "0",
  "no_periodo": "1",
  "periodo": "6",
  "base": 7
}
```

#### Output
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
      "descripcion": "Convertir número completo a base 10",
      "resultado": "0166 (base 7) = 83 (base 10)",
      "valor": 83
    },
    {
      "paso": 2,
      "descripcion": "Convertir número sin período a base 10",
      "resultado": "01 (base 7) = 1 (base 10)",
      "valor": 1
    },
    {
      "paso": 3,
      "descripcion": "Calcular numerador",
      "resultado": "83 - 1 = 82",
      "valor": 82
    },
    {
      "paso": 4,
      "descripcion": "Calcular denominador",
      "resultado": "7^1 × (7^1 - 1) = 42",
      "valor": 42
    }
  ],
  "fraccion_decimal": "82/42",
  "numerador": 82,
  "denominador": 42,
  "fraccion_base_original": "116/60"
}
```

### Algoritmo Matemático

Para un número periódico en base $b$:

$$x = d_0.d_1d_2\ldots d_m(d_{m+1}\ldots d_{m+n})$$

**Paso 1:** Valor completo en base 10
$$N_{completo} = \sum_{i=0}^{m+n} d_i \cdot b^{m+n-i}$$

**Paso 2:** Valor sin período en base 10
$$N_{sin\_periodo} = \sum_{i=0}^{m} d_i \cdot b^{m-i}$$

**Paso 3:** Numerador
$$numerador = N_{completo} - N_{sin\_periodo}$$

**Paso 4:** Denominador
$$denominador = b^m(b^n - 1)$$

---

## 3. Operaciones Aritméticas con Fracciones

### API Endpoint

**POST** `/dividir-fracciones`

#### Input
```json
{
  "numerador1": "1",
  "denominador1": "2",
  "numerador2": "1",
  "denominador2": "4",
  "base": 10,
  "operacion": "suma"
}
```

#### Operaciones Soportadas

| Operación | Fórmula |
|------------|---------|
| `suma` | $\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}$ |
| `resta` | $\frac{a}{b} - \frac{c}{d} = \frac{ad - bc}{bd}$ |
| `multiplicacion` | $\frac{a}{b} \times \frac{c}{d} = \frac{ac}{bd}$ |
| `division` | $\frac{a}{b} \div \frac{c}{d} = \frac{ad}{bc}$ |

---

## 4. Componente Visual de Pasos

El componente `PasoDelConversor.jsx` muestra el proceso de conversión con:

### Paso 1: Serie de Potencias + Conversión

- **Serie de potencias:** Desarrollo del n-mal en la base origen
- **Conversión numérica:** Método de divisiones o potencias según las bases

```
usarDivisiones = (baseOrigen < baseDestino)
usarPotencias = (baseOrigen > baseDestino)
```

### Paso 2: Fracción Equivalente

Se muestra la misma fracción escrita con dígitos de cada base:
$$\frac{numero_{b_o}}{denominador_{b_o}} = \left(\frac{numero_{b_d}}{denominador_{b_d}}\right)_{(b_d)}$$

### Paso 3: División en Base Destino

Visualización de la división completa con el algoritmo de "papel y lápiz".

---

## Códigos de Dígitos por Base

| Base | Dígitos |
|------|---------|
| 2 | 0, 1 |
| 8 | 0-7 |
| 10 | 0-9 |
| 16 | 0-9, A-F |
| 36 | 0-9, A-Z |

---

## Ejecución del Proyecto

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

El servidor estará disponible en `http://localhost:8000`

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## Archivos Principales

### Backend

| Archivo | Función |
|---------|---------|
| `app.py` | Endpoints FastAPI |
| `operaciones/conversor_base.py` | Conversión entre bases |
| `operaciones/fraccion_nmal.py` | División de fracciones en n-mal |
| `operaciones/operaciones_fracciones.py` | Operaciones aritméticas |
| `pasos/paso*.py` | Pasos de conversión de periódicos |

### Frontend

| Archivo | Función |
|---------|---------|
| `src/componentes3/ConversorBase.jsx` | Formulario de conversión |
| `src/componentes3/PasoDelConversor.jsx` | Visualización de pasos |
| `src/componentes2/Suma.jsx` | Componente de suma |
| `src/componentes2/Resta.jsx` | Componente de resta |

---

## Detalles Técnicos

### Validaciones

- Bases deben estar entre 2 y 36
- Bases origen y destino deben ser diferentes
- Dígitos deben ser válidos para la base utilizada
- Denominador no puede ser cero
- Período no puede estar vacío

### Detección de Números Periódicos

El algoritmo detecta automáticamente cuándo un resultado decimal es periódico basado en el residuo repetido durante la división.

### Manejo de BigInt

Se utiliza BigInt para manejar números grandes que exceden los límites de Number en JavaScript.
# 📚 Guía de Configuración del Ambiente - Math Tutor

Esta guía te ayudará a configurar tu computadora para clonar y ejecutar el proyecto Math Tutor (Frontend en React + Backend en FastAPI).

---

## 📋 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

### 1. Git
- **Windows**: Descarga desde [git-scm.com](https://git-scm.com/download/win)
- **macOS**: `brew install git`
- **Linux**: `sudo apt-get install git` (Ubuntu/Debian)

**Verificar instalación:**
```bash
git --version
```

### 2. Python (3.9+)
- **Windows**: Descarga desde [python.org](https://www.python.org/downloads/)
  - **IMPORTANTE**: Durante la instalación, marca la opción "Add Python to PATH"
- **macOS**: `brew install python@3.9`
- **Linux**: `sudo apt-get install python3.9 python3.9-venv`

**Verificar instalación:**
```bash
python --version
# o
python3 --version
```

### 3. Node.js (v18+) y npm
- **Windows/macOS/Linux**: Descarga desde [nodejs.org](https://nodejs.org/)
  - Se instala automáticamente con npm
- **macOS**: `brew install node`
- **Linux**: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`

**Verificar instalación:**
```bash
node --version
npm --version
```

---

## 🔧 Paso 1: Clonar el Repositorio

### Opción A: Usando Git (Recomendado)

1. Abre la terminal/PowerShell en la carpeta donde deseas clonar el proyecto
2. Ejecuta el siguiente comando:

```bash
git clone https://github.com/[usuario]/math-tutor.git
cd math-tutor
```

3. Reemplaza `[usuario]` con el usuario del repositorio de GitHub

### Opción B: Descargar como ZIP

1. Ve al repositorio en GitHub
2. Haz clic en el botón **Code** → **Download ZIP**
3. Extrae el archivo ZIP en tu computadora
4. Abre la terminal en la carpeta `math-tutor`

---

## 🐍 Paso 2: Configurar el Backend (Python + FastAPI)

### 2.1 Navegar a la carpeta del backend

```bash
cd backend
```

### 2.2 Crear un entorno virtual (Recomendado)

Un entorno virtual aísla las dependencias de Python para este proyecto.

**En Windows (PowerShell):**
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Si obtienes un error de permisos, ejecuta PowerShell como administrador o usa:
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**En macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Deberías ver `(venv)` al inicio de tu línea de comandos.

### 2.3 Instalar dependencias del backend

```bash
pip install -r requirements.txt
```

**Dependencias principales instaladas:**
- `fastapi` - Framework web asincrónico
- `uvicorn` - Servidor ASGI para FastAPI
- `pydantic` - Validación de datos
- `numpy` - Operaciones matemáticas
- `sympy` - Cálculos simbólicos
- `contourpy` - Generación de contornos (visualización)
- `cycler` - Utilidades de iteración

### 2.4 Verificar instalación del backend

```bash
python app.py
```

Deberías ver algo como:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
Press CTRL+C to quit
```

Abre tu navegador en [http://localhost:8000/docs](http://localhost:8000/docs) para ver la documentación de la API.

**Para detener el servidor:** Presiona `CTRL+C` en la terminal.

---

## ⚛️ Paso 3: Configurar el Frontend (React + Vite)

### 3.1 Abrir una NUEVA terminal y navegar al frontend

**IMPORTANTE**: No cierres la terminal del backend; abre una nueva pestaña o ventana de terminal.

```bash
cd frontend
```

### 3.2 Instalar dependencias del frontend

```bash
npm install
```

Este comando:
- Lee el archivo `package.json`
- Descarga todas las dependencias necesarias (React, Vite, KaTeX, Framer Motion, etc.)
- Las instala en la carpeta `node_modules/`

**Dependencias principales:**
- `react` - Biblioteca de interfaz de usuario
- `react-dom` - DOM de React
- `vite` - Empaquetador y servidor de desarrollo
- `katex` & `react-katex` - Renderizado matemático
- `framer-motion` - Animaciones
- `lucide-react` - Iconos

### 3.3 Ejecutar el servidor de desarrollo

```bash
npm run dev
```

Deberías ver algo como:
```
  VITE v8.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la aplicación.

---

## ✅ Verificación Final

Si ambos servidores están corriendo correctamente, deberías tener:

1. **Backend (FastAPI)**: http://localhost:8000
   - Documentación Swagger: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

2. **Frontend (React)**: http://localhost:5173
   - Aplicación completa con todas las funcionalidades

3. **Verificar comunicación Frontend-Backend**:
   - Abre la aplicación React en el navegador
   - Intenta usar cualquier funcionalidad (convertidor, operaciones, etc.)
   - Si funciona sin errores, la comunicación entre frontend y backend es correcta

---

## 🛠️ Troubleshooting (Solución de Problemas)

### Problema: "python is not recognized"
**Solución**: Python no está en el PATH
- Reinstala Python y marca la opción "Add Python to PATH"
- O usa `python3` en lugar de `python`

### Problema: "No module named 'fastapi'"
**Solución**: Las dependencias no se instalaron correctamente
```bash
pip install -r requirements.txt
```

### Problema: El frontend no se conecta al backend
**Solución**: Verifica que:
1. El backend esté corriendo en http://localhost:8000
2. El archivo `frontend/src/services/api.js` tenga la URL correcta:
```javascript
const API_URL = 'http://localhost:8000';
```

### Problema: "npm: command not found"
**Solución**: Node.js no está instalado
- Descarga e instala desde [nodejs.org](https://nodejs.org/)
- Reinicia la terminal después de instalar

### Problema: Puerto 8000 o 5173 ya está en uso
**Solución**: Otra aplicación está usando el puerto
```bash
# Para backend en otro puerto
uvicorn app:app --port 8001 --reload

# Para frontend (automático con Vite)
npm run dev -- --port 5174
```

### Problema: "Permission denied" al activar venv (macOS/Linux)
**Solución**:
```bash
chmod +x venv/bin/activate
source venv/bin/activate
```

---

## 📝 Estructura de Carpetas

Después de seguir esta guía, tu proyecto tendrá esta estructura:

```
math-tutor/
├── backend/
│   ├── venv/                    # Entorno virtual Python (creado)
│   ├── app.py                   # API principal
│   ├── requirements.txt          # Dependencias Python
│   ├── operaciones/             # Módulos de conversión
│   ├── pasos/                   # Pasos de cálculo
│   └── utils/                   # Utilidades
│
├── frontend/
│   ├── node_modules/            # Dependencias Node (creadas)
│   ├── src/
│   │   ├── componentes2/        # Componentes principales
│   │   ├── componentes3/        # Convertidor de base
│   │   ├── services/
│   │   │   └── api.js           # Llamadas a la API
│   │   └── App.jsx
│   ├── package.json             # Dependencias Node
│   └── vite.config.js
│
├── SETUP_AMBIENTE.md            # Este archivo
└── DEPLOYMENT_GUIDE.md          # Guía de deployment
```

---

## 🔄 Workflow Diario

Una vez configurado, para trabajar en el proyecto:

### Terminal 1 (Backend)
```bash
cd backend
source venv/bin/activate  # o .\venv\Scripts\Activate.ps1 en Windows
python app.py
```

### Terminal 2 (Frontend)
```bash
cd frontend
npm run dev
```

Luego abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📚 Recursos Adicionales

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **React Documentation**: https://react.dev/
- **Vite Documentation**: https://vitejs.dev/
- **Python Virtual Environments**: https://docs.python.org/3/tutorial/venv.html

---

## ❓ Preguntas Frecuentes

**P: ¿Necesito estar conectado a internet después de instalar?**
R: No. Después de instalar las dependencias, puedes trabajar offline (excepto para git operations).

**P: ¿Puedo usar un IDE en lugar de la terminal?**
R: Sí. VS Code, PyCharm, WebStorm, etc. tienen terminales integrados.

**P: ¿Qué hago si tengo una versión antigua de Python?**
R: Necesitas Python 3.9+. Descarga la versión actual desde [python.org](https://www.python.org/downloads/).

**P: ¿Cómo actualizo npm sin actualizar Node?**
R: `npm install -g npm@latest`

---

## 📞 Soporte

Si encuentras problemas:
1. Verifica que todos los requisitos previos están instalados
2. Consulta la sección de Troubleshooting
3. Abre un issue en el repositorio de GitHub

¡Listo! Ya puedes empezar a desarrollar. 🚀

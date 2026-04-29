# 🚀 Guía de Deployment - Math Tutor en Render y Vercel

Esta guía te ayudará a desplegar tu aplicación Math Tutor en producción:
- **Backend** en [Render](https://render.com)
- **Frontend** en [Vercel](https://vercel.com)

---

## 📌 Requisitos Previos

1. Cuenta en GitHub con tu repositorio actualizado
2. Cuenta en [Render.com](https://render.com) (gratuita)
3. Cuenta en [Vercel.com](https://vercel.com) (gratuita)
4. Tener clonado y configurado localmente siguiendo [SETUP_AMBIENTE.md](./SETUP_AMBIENTE.md)

---

## 🔵 Parte 1: Desplegar Backend en Render

### 1.1 Preparar el Backend para Render

Antes de desplegar, asegúrate de que el backend está listo:

#### 1.1.1 Actualizar requirements.txt

El archivo `requirements.txt` debe incluir `gunicorn` para producción:

```
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
numpy==1.24.3
sympy==1.12
contourpy==1.3.3
cycler==0.12.1
gunicorn==21.2.0
python-multipart==0.0.6
```

Si falta `gunicorn`, agrégalo:
```bash
pip install gunicorn
pip freeze > requirements.txt
```

#### 1.1.2 Crear archivo `Procfile` en la carpeta `backend/`

El archivo `Procfile` le dice a Render cómo ejecutar tu aplicación:

```
web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app
```

**Ubicación**: `backend/Procfile`

#### 1.1.3 Actualizar configuración CORS en `app.py`

Agrega tu URL de Vercel a los orígenes permitidos (la obtendrás después de desplegar el frontend):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tu-app.vercel.app",  # URL de Vercel (cambiar después de deploy)
        "https://nmal-fraccion.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 1.1.4 Crear archivo `.env` (si usas variables de entorno)

En la carpeta `backend/`, crea un archivo `.env`:

```env
# No es obligatorio para este proyecto, pero lo dejamos como referencia
ENVIRONMENT=production
LOG_LEVEL=info
```

**Nota**: Agrega `.env` a tu `.gitignore` para que no se suba a GitHub:

```bash
# En backend/.gitignore
.env
.env.local
*.pyc
__pycache__/
venv/
```

### 1.2 Hacer Push a GitHub

Asegúrate de que todos los cambios estén en GitHub:

```bash
git add .
git commit -m "Preparar backend para deployment en Render"
git push origin main
```

### 1.3 Crear Servicio en Render

1. Ve a [render.com](https://render.com) e inicia sesión con tu cuenta de GitHub
2. Haz clic en **New +** → **Web Service**
3. Selecciona tu repositorio `math-tutor`
4. Configura:
   - **Name**: `math-tutor-backend` (o el nombre que prefieras)
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```bash
     gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app --chdir backend
     ```
   - **Root Directory**: Déjalo vacío
   - **Branch**: `main`

5. En la sección **Environment**, agrega variables de entorno si las necesitas:
   - Key: `ENVIRONMENT`
   - Value: `production`

6. Haz clic en **Create Web Service**

Render comenzará a compilar y desplegar automáticamente.

### 1.4 Obtener URL del Backend

Una vez desplegado, obtendrás una URL como:
```
https://math-tutor-backend.onrender.com
```

**Guarda esta URL**, la necesitarás para el frontend.

---

## 🟢 Parte 2: Desplegar Frontend en Vercel

### 2.1 Preparar el Frontend para Vercel

#### 2.1.1 Crear archivo `.env.production` en la carpeta `frontend/`

Este archivo contiene las variables para producción:

```env
VITE_API_URL=https://math-tutor-backend.onrender.com
```

**IMPORTANTE**: Reemplaza con tu URL real de Render.

#### 2.1.2 Actualizar `frontend/src/services/api.js`

Asegúrate de que el archivo usa la variable de entorno:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  convertirPeriodico: async (data) => {
    const response = await fetch(`${API_URL}/convertir-periodico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  // ... otros endpoints
};
```

#### 2.1.3 Crear archivo `vercel.json` en la carpeta `frontend/`

Este archivo configura el build de Vercel:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

#### 2.1.4 Actualizar `vite.config.js` si es necesario

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
  },
})
```

### 2.2 Hacer Push a GitHub

```bash
git add .
git commit -m "Preparar frontend para deployment en Vercel"
git push origin main
```

### 2.3 Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en **Add New** → **Project**
3. Selecciona tu repositorio `math-tutor`
4. Configura:
   - **Project Name**: `math-tutor` (o el nombre que prefieras)
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend/` (muy importante)
   - **Build Command**: `npm run build` (debería estar pre-llenado)
   - **Output Directory**: `dist` (debería estar pre-llenado)

5. En **Environment Variables**, agrega:
   - Key: `VITE_API_URL`
   - Value: `https://math-tutor-backend.onrender.com` (tu URL de Render)

6. Haz clic en **Deploy**

Vercel comenzará a compilar y desplegar.

### 2.4 Obtener URL del Frontend

Una vez desplegado, obtendrás una URL como:
```
https://math-tutor-xxxxx.vercel.app
```

---

## 🔄 Paso 3: Actualizar CORS en el Backend

Ahora que tienes la URL de Vercel, actualiza el CORS en `app.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://math-tutor-xxxxx.vercel.app",  # Tu URL exacta de Vercel
        "https://nmal-fraccion.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Luego haz push a GitHub:

```bash
git add app.py
git commit -m "Actualizar CORS con URL de Vercel"
git push origin main
```

Render redesplegará automáticamente con los cambios.

---

## 📋 Checklist de Deployment

### Backend (Render)
- [ ] `requirements.txt` incluye todas las dependencias
- [ ] `Procfile` está en la carpeta `backend/`
- [ ] `app.py` tiene CORS configurado correctamente
- [ ] Cambios pusheados a GitHub
- [ ] Render está desplegando correctamente
- [ ] URL de Render obtenida

### Frontend (Vercel)
- [ ] `frontend/src/services/api.js` usa `import.meta.env.VITE_API_URL`
- [ ] `.env.production` tiene la URL correcta de Render
- [ ] `vite.config.js` está configurado
- [ ] `vercel.json` está en `frontend/`
- [ ] Cambios pusheados a GitHub
- [ ] Vercel está desplegando correctamente
- [ ] URL de Vercel obtenida

### Integración
- [ ] CORS actualizado en `app.py` con URL de Vercel
- [ ] Cambios de CORS pusheados a GitHub
- [ ] Backend redesplegado (automático en Render)
- [ ] Frontend funciona correctamente con backend en producción

---

## 🧪 Verificar Que Todo Funciona

### 1. Verificar Backend

Abre en tu navegador:
```
https://math-tutor-backend.onrender.com/docs
```

Deberías ver la documentación Swagger del API.

### 2. Verificar Frontend

Abre en tu navegador:
```
https://math-tutor-xxxxx.vercel.app
```

Deberías ver la aplicación React.

### 3. Probar Comunicación

En el frontend:
1. Usa cualquier funcionalidad (convertidor, operaciones, etc.)
2. Abre la consola del navegador (F12)
3. Verifica que no haya errores CORS
4. Comprueba que los resultados se muestran correctamente

---

## 🌐 Variables de Entorno

### Backend (Render)

**En Render Dashboard:**
1. Ve a tu servicio de backend
2. **Settings** → **Environment**
3. Agrega variables según necesites:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `ENVIRONMENT` | `production` | Ambiente de ejecución |
| `LOG_LEVEL` | `info` | Nivel de logging |

### Frontend (Vercel)

**En Vercel Dashboard:**
1. Ve a tu proyecto
2. **Settings** → **Environment Variables**
3. Variables necesarias:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_API_URL` | `https://math-tutor-backend.onrender.com` | URL del backend |

**Nota**: Las variables de Vite deben empezar con `VITE_` para ser accesibles en el navegador.

---

## 🔧 Troubleshooting

### El frontend no se conecta al backend

**Síntomas**: Errores CORS en la consola del navegador

**Soluciones**:
1. Verifica que `VITE_API_URL` esté correcta en Vercel
2. Verifica que CORS esté configurado en `app.py` con tu URL de Vercel
3. Redespliega el backend:
   - Ve a Render dashboard
   - Haz clic en el servicio
   - Click en **Manual Deploy** → **Deploy latest commit**

### El backend devuelve error 500

**Síntomas**: Error de servidor interno

**Soluciones**:
1. Ve a Render dashboard
2. Haz clic en **Logs** para ver los errores
3. Verifica `requirements.txt` tenga todas las dependencias
4. Verifica que el comando de inicio sea correcto

### Vercel muestra página en blanco

**Síntomas**: El sitio carga pero no muestra contenido

**Soluciones**:
1. Abre la consola del navegador (F12)
2. Busca errores de JavaScript
3. Verifica que `VITE_API_URL` esté configurada correctamente
4. Redespliega en Vercel:
   - Ve a Vercel dashboard
   - Click en **Deployments**
   - Redeploy the latest commit

### Error "Cannot find module" en Render

**Síntomas**: `ModuleNotFoundError` en los logs de Render

**Soluciones**:
1. Asegúrate de que todas las dependencias estén en `requirements.txt`
2. Ejecuta localmente:
   ```bash
   pip install -r requirements.txt
   python app.py
   ```
3. Si funciona localmente, regenera `requirements.txt`:
   ```bash
   pip freeze > requirements.txt
   git push
   ```

### El puerto está bloqueado

**No aplica a Render y Vercel**, que asignan puertos automáticamente.

---

## 📝 Después de Deployment

### Monitorear en Producción

**Render:**
- Visita tu dashboard
- Ve a **Logs** para ver errores
- Ve a **Events** para ver deployments

**Vercel:**
- Visita tu dashboard
- Ve a **Deployments** para ver historial
- Ve a **Settings** → **Logs** para ver errores

### Realizar Cambios en Producción

1. Realiza cambios localmente
2. Haz commits y push a GitHub:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push origin main
   ```
3. **Render** y **Vercel** redespliegan automáticamente

### Rollback a versión anterior

**Render:**
1. Ve a **Deployments**
2. Haz clic en el commit que quieras
3. Click en **Redeploy**

**Vercel:**
1. Ve a **Deployments**
2. Busca el deploy anterior
3. Haz clic en sus 3 puntitos → **Promote to Production**

---

## 🔐 Seguridad

### Consideraciones Importantes

1. **Nunca commitear `.env` con datos sensibles**
   - Usa variables de entorno en Render y Vercel en lugar de archivos

2. **Validar entrada de datos**
   - El backend ya valida con Pydantic ✅

3. **HTTPS está habilitado**
   - Tanto Render como Vercel usan HTTPS automáticamente ✅

4. **CORS está configurado**
   - Solo permite origen de tu dominio ✅

5. **Rate limiting (Opcional)**
   - Para proyectos en producción, considera agregar:
   ```bash
   pip install slowapi
   ```

---

## 📊 Costos

### Render (Backend)

- **Free Tier**: 
  - 0.5 CPU compartido
  - 512 MB RAM
  - Spin down después de 15 min de inactividad
  - **Perfecto para desarrollo/testing**

- **Paid Plans**: Desde $12/mes

### Vercel (Frontend)

- **Free Tier**:
  - Unlimited deployments
  - Hosting ilimitado
  - Custom domains
  - SSL/TLS automático
  - **Perfecto para producción**

- **Paid Plans**: Desde $20/mes

---

## 🚀 Próximos Pasos

1. ✅ Backend desplegado en Render
2. ✅ Frontend desplegado en Vercel
3. ✅ Comunicación funcionando
4. 📈 Considera agregar:
   - Logging mejorado
   - Monitoreo de errores (Sentry)
   - Base de datos (si lo necesitas)
   - Autenticación de usuario

---

## 📞 Recursos

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Deploy**: https://fastapi.tiangolo.com/deployment/
- **Vite Deploy**: https://vitejs.dev/guide/build.html

¡Tu aplicación está en producción! 🎉

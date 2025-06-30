# FillItUp — Rastreador Visual de Metas de Ahorro

## Idea del Proyecto

**FillItUp** es una aplicación web que permite a los usuarios crear metas de ahorro personales con una representación visual del progreso. Cada meta tiene una imagen que se va “llenando” a medida que el usuario registra aportes, haciendo del proceso de ahorrar una experiencia más motivadora, visual y satisfactoria.

---

## ¿Qué problema resuelve?

Muchas personas abandonan sus metas de ahorro por falta de motivación visual. Ver solo un número no genera un sentido emocional de avance. FillItUp permite a los usuarios visualizar cómo se acercan a su meta, incrementando el compromiso y la constancia en el ahorro.

---

## Público Objetivo

- Jóvenes adultos que quieren ahorrar para metas personales (tecnología, viajes, etc.).
- Estudiantes universitarios que inician su vida financiera.
- Personas visuales que responden mejor a estímulos gráficos que a datos numéricos.

---

## Tecnologías Utilizadas

### Frontend
- **React + Vite + TypeScript**
- **TailwindCSS** para estilos y animaciones
- **shadcn/ui** para componentes accesibles
- **React Router DOM** para navegación
- **Toast** para manejo de mensajes y validaciones
- **Cloudinary** para subida y gestión de imágenes desde el frontend
- **Hooks usados**: `useState`, `useEffect`, `useCallback`

### Backend
- **Node.js**
- **Express.js**
- **MongoDB Atlas** como base de datos en la nube
- **Mongoose** para modelado de datos
- **dotenv** para variables de entorno
- **cors** para manejo de orígenes cruzados

---

## Deploy

- **Frontend (Vercel):** [https://fillitup.vercel.app](https://fillitup-app.vercel.app/)
- **Backend (Render):** [https://fillitup-api.onrender.com](https://fillitup-app.onrender.com)

---

## Uso de Inteligencia Artificial

Se utilizó IA de las siguientes maneras:
- **ChatGPT** para:
  - Generar ideas y validarlas
  - Redactar contenido técnico y explicativo
  - Solicitar ayuda con estructuras de código y lógica
- **Vercel V0 (IA)** para:
  - Diseñar la interfaz inicial de la landing page

No se integró una API de IA directamente en esta versión, pero se planea para futuras versiones.

---

## Funcionalidades Principales

- Crear metas de ahorro con nombre, monto e imagen representativa
- Registrar aportes a metas existentes
- Visualizar avance en una imagen que se va llenando según el progreso
- CRUD completo de metas y aportes
- Landing page explicativa y atractiva

---

## Esquema de Base de Datos (MongoDB Atlas)

### `goals` (metas de ahorro)
```json
{
  "_id": "ObjectId",
  "title": "Viaje a Japón", 
  "targetAmount": 3000,
  "imageUrl": "https://res.cloudinary.com/...",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### `contributions` (aportes)
```json
{
  "_id": "ObjectId",
  "goalId": "ObjectId",
  "amount": 200,
  "note": "Ahorro semanal",
  "date": "ISODate"
}
```

---

## Estructura del Proyecto

```
fillitup/
├── backend/
│   ├── models/           # Esquemas de Mongoose
│   ├── routes/           # Rutas de la API con Express
│   └── server.js         # Punto de entrada del servidor
│
├── front/
│   ├── public/           # Recursos estáticos
│   └── src/
│       ├── components/   # Componentes reutilizables
│       ├── lib/          
│       ├── pages/        # Vistas principales
│       ├── animations.css
│       ├── app.tsx
│       ├── index.css
│       ├── main.tsx
│       └── types.ts
│
├── README.md
└── .gitignore
```

---
## Instrucciones para Ejecutar Localmente

### 1. Clonar el repositorio
```bash
git clone https://github.com/angeles1107/fillitup-app.git
cd fillitup
```

---

### 2. Configurar MongoDB Atlas

Debes tener una cuenta gratuita en [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)  
Crea un clúster, habilita acceso desde tu IP y crea una base de datos.

Copia la cadena de conexión y colócala en un archivo `.env` dentro de `backend/`:

```
MONGODB_URI=mongodb+srv://<usuario>:<clave>@cluster.mongodb.net/fillitup
PORT=3001
```

En `front/`, primero debes tenes una cuenta en Cloudinary para subir imagenes, desde alli puedes obtener las credenciales necesarias y crea otro `.env` con las siguientes variables:

```
VITE_API_URL=https:/tubackend.com
VITE_CLOUDINARY_UPLOAD_PRESET=<tu_upload_preset>
VITE_CLOUDINARY_CLOUD_NAME=<tu_nombre_de_cloud>
```

---

### 3. Ejecutar el Backend
```bash
cd backend
npm install
npm run dev
```

---

### 4. Ejecutar el Frontend
```bash
cd frontend
npm install
npm run dev
```

Accede en tu navegador a:  
 `http://localhost:5173`

---

## Instrucciones para Despliegue Básico

### Frontend (Vercel)
1. Crea un nuevo proyecto y sube tu repositorio a [Vercel](https://vercel.com/)
2. En root directory coloca tu carpeta `frontend/` para que sepa que esos son los archivos que se van a desplegar
2. Vercel detectará Vite automáticamente
3. Configura las variables de entorno en el dashboard de Vercel

### Backend (Render)
1. Crea un nuevo servicio en [Render](https://render.com/)
2. Apunta a la carpeta `backend/`
3. Agrega las variables de entorno: `MONGODB_URI`, `PORT`
4. Render detecta Express automáticamente y lanza tu servidor

---

## Retos Técnicos
- Conexión con MongoDB Atlas: Inicialmente hubo dificultades al conectar el backend con la base de datos remota por configuración de IP y variables de entorno. Se solucionó revisando la URI y los permisos de acceso en el clúster.

- Visualización progresiva de imágenes: Otro desafío fue cómo simular el "llenado" visual de una imagen. Se solucionó usando capas, transparencias y animaciones con CSS y Tailwind.

---

## Manejo de Errores y Validaciones

  Se logro implementar: 
- Validaciones básicas en los formularios del frontend
- Manejo de errores del servidor con respuestas claras
- Feedback visual con toasts para éxito o error en acciones
- Control de rutas protegidas para evitar acciones incompletas

---

## Limitaciones

- Actualmente no se implementa autenticación de usuarios, por lo tanto, todas las metas están disponibles sin control de acceso.
- La subida de imágenes depende de Cloudinary pero no incluye validación de tamaño o tipo de archivo.
- No hay control de sesión o historial por usuario (todas las metas están en la misma base de datos).
- La visualización progresiva de la imagen se basa en un efecto visual simplificado.
- El backend no incluye paginación ni filtros avanzados para los datos.

## Mejoras Futuras

- Crear un login y autenticación de usuarios
- Integración de IA para sugerencias automáticas de ahorro según hábitos y mensajes motivacionales
- Gráficas de progreso más detalladas
- Compartir metas o hacer metas colaborativas

---

## Estado del Proyecto

Este proyecto es un MVP funcional creado como parte de una **prueba técnica de desarrollo web** para demostrar habilidades en:

- Frontend (React + Tailwind)
- Backend (Node.js + Express)
- Base de datos (MongoDB Atlas)
- Organización y documentación técnica
- Integración creativa de herramientas de IA

---
# Autor

**Mariannis Garcia** 

Usuario de Github: @angeles1107

Contacto: [mariannisgarcia11@gmail.com]

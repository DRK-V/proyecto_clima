# proyecto_clima

Proyecto web fullstack para consultar el clima actual y el pronóstico de cualquier ciudad, con registro e inicio de sesión de usuarios, visualización de mapas interactivos, chat de ayuda y panel de usuario. Incluye backend en Node.js/Express y frontend en React + Vite + TailwindCSS, con autenticación JWT y despliegue listo para Docker.

**Demo desplegado:** [https://front-clima-latest.onrender.com/](https://front-clima-latest.onrender.com/)

## Estructura del proyecto

- **backend/**: Servidor Express para la API REST, autenticación, conexión a base de datos y lógica de negocio.
  - `dockerfile`: Dockerfile para el backend.
  - `index.js`: Punto de entrada del backend.
  - `package.json`: Dependencias y scripts del backend.
  - `controllers/`: Controladores de rutas.
  - `db/`: Conexión a la base de datos.
  - `middleware/`: Middlewares personalizados.
  - `routes/`: Definición de rutas.

- **frontend/**: Aplicación React + Vite + TailwindCSS.
  - `Dockerfile`: Dockerfile para el frontend.
  - `docker-compose.yml`: Orquestación de frontend y backend.
  - `index.html`: HTML principal.
  - `package.json`: Dependencias y scripts del frontend.
  - `public/`: Archivos estáticos e imágenes.
  - `src/`: Código fuente React.
    - `components/`: Componentes reutilizables (ChatModal, ForecastModal, etc).
    - `layouts/`: Layouts principales.
    - `pages/`: Páginas principales (Login, Dashboard, Registro, etc).
    - `styles/`: Archivos CSS globales.

## Instalación y ejecución local

### Backend
```bash
cd backend
npm install
node index.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Dockerización

Para levantar todo con Docker:
```bash
docker-compose up --build
```

## Scripts útiles
- `npm run dev` (frontend): Inicia el servidor de desarrollo React.
- `node index.js` (backend): Inicia el backend Express.

## Notas
- El frontend consume la API del backend para login, registro y datos de clima.
- El backend usa Express, JWT, bcrypt, dotenv, y supabase-js.
- El frontend usa React, Vite, TailwindCSS, Chart.js, Leaflet, y más.

## Autenticación
- El login y registro muestran popups de error o éxito.
- El token JWT se guarda en cookies.

## Contacto
- Para dudas o soporte, contactar al autor del repositorio.
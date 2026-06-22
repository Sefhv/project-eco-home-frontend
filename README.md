# EcoHome Store - Frontend React

Aplicación web para EcoHome Store. Catálogo de productos + Chat en tiempo real.

## Stack

- **Framework:** React 19
- **Build:** Vite 5
- **Tiempo real:** socket.io-client
- **Estilos:** CSS plano

## Funcionalidades

- Login con JWT (almacenamiento en localStorage)
- Catálogo de productos con información del creador (trazabilidad)
- Creación de productos (solo admin) con actualización dinámica del contador
- Chat en tiempo real con Socket.IO
- Contador dinámico "Nombre (N)" que refleja productos creados por el usuario
- Navegación entre Catálogo y Chat

## Instalación

```bash
# Clonar
git clone https://github.com/Sefhv/project-eco-home-frontend.git
cd project-eco-home-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno (.env ya incluido)
# VITE_API_URL=http://localhost:3000
# VITE_CHAT_URL=http://localhost:3001
```

## Ejecución

```bash
# Desarrollo
npm run dev

# Abrir en navegador
http://localhost:5173
```

## Build para producción

```bash
npm run build
# Los archivos estáticos quedan en ./dist
```

## Docker (producción)

```bash
docker build \
  --build-arg VITE_API_URL=https://tu-backend.onrender.com \
  --build-arg VITE_CHAT_URL=https://tu-backend.onrender.com \
  -t ecohome-frontend .

docker run -p 3000:3000 ecohome-frontend
```

## Estructura

```
project-eco-home-frontend/
├── src/
│   ├── App.jsx               # Raíz: navegación + contador dinámico
│   ├── main.jsx
│   ├── index.css             # Estilos navegación
│   └── components/
│       ├── Login.jsx         # Login con JWT
│       ├── Login.css
│       ├── Products.jsx      # Catálogo + crear + creador
│       ├── Products.css
│       ├── ChatRoom.jsx      # Chat Socket.IO
│       └── ChatRoom.css
├── Dockerfile
├── vite.config.js
└── package.json
```

## Requisitos

- Backend corriendo en puerto 3000 (API) y 3001 (Chat)
- Credenciales: `admin@ecohome.com` / `admin123`

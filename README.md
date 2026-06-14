# EcoHome Store - Frontend Chat Interno

Frontend React para el modulo de chat interno corporativo de EcoHome Store.

Se conecta al backend API (puerto 3000) para autenticacion y al servidor de chat (puerto 3001) para mensajeria en tiempo real via Socket.IO.

## Requisitos previos

- Node.js v18 o superior
- Backend API corriendo en http://localhost:3000 (project-eco-home)
- Servidor de chat corriendo en http://localhost:3001 (project-eco-home)

## Instalacion

```bash
git clone https://github.com/Sefhv/project-eco-home-frontend.git
cd project-eco-home-frontend
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:5173 en el navegador.

## Build para produccion

```bash
npm run build
```

Los archivos se generan en la carpeta `dist/`.

## Estructura

```
project-eco-home-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # Punto de entrada
    ├── App.jsx               # Componente raiz (maneja estado de autenticacion)
    ├── index.css             # Estilos globales
    └── components/
        ├── Login.jsx         # Formulario de login con JWT
        ├── Login.css         # Estilos del login
        ├── ChatRoom.jsx      # Sala de chat (Socket.IO client)
        └── ChatRoom.css      # Estilos del chat
```

## Flujo de uso

1. El usuario ingresa email y contrasena en el formulario de Login.
2. Se autentica contra `POST http://localhost:3000/api/v1/auth/login`.
3. Al obtener el JWT, se almacena en localStorage.
4. Se conecta al servidor de chat (puerto 3001) via Socket.IO enviando el token.
5. Recibe los ultimos 10 mensajes del historial.
6. Puede enviar y recibir mensajes en tiempo real.
7. Al cerrar sesion, se limpia localStorage y se desconecta el socket.

## Credenciales de prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@ecohome.com | admin123 |
| Cliente | juan@test.com | password123 |

Para probar en tiempo real, abrir dos ventanas (una normal y una incognito) con usuarios diferentes.

## Arquitectura de puertos

| Servicio | Puerto | Repositorio |
|----------|--------|-------------|
| API REST (auth + productos) | 3000 | project-eco-home |
| Chat (Socket.IO) | 3001 | project-eco-home |
| Frontend React (Vite) | 5173 | project-eco-home-frontend |

## Tecnologias

- React 19
- Vite 8
- socket.io-client 4.7
- ESLint

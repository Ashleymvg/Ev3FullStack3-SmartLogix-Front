# Evaluacion 3 - SmartLogix - Frontend 

Interfaz de usuario para la plataforma de gestión logística de PYMEs eCommerce. Consume servicios del backend vía API Gateway y sigue una arquitectura modular para asegurar escalabilidad y limpieza de código.

- React 19
- Vite 8
- JavaScript (ES Modules)
- Docker + Nginx
- Autenticación JWT

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite 8 |
| Lenguaje | JavaScript (ES Modules) |
| Estilos | CSS nativo (arquitectura modular) |
| Contenedor | Docker + Nginx (servidor de producción) |
| Gestión de sesión | JWT almacenado en `localStorage` |

---

## Arquitectura del proyecto

El proyecto implementa una **arquitectura por capas** para separar responsabilidades y facilitar el mantenimiento:

```
src/
├── api/          → Definición de endpoints y peticiones HTTP
├── service/      → Reglas de negocio y lógica de sesión
├── pages/        → Vistas de la aplicación (UI)
├── components/   → Componentes reutilizables
├── hooks/        → Hooks personalizados para estado y lógica
└── router/       → Gestión de navegación
```

---

## Requisitos previos

> ⚠️ El backend de SmartLogix debe estar corriendo en `http://localhost:8080` antes de iniciar el frontend.

- **Node.js:** versión `18` o superior (recomendado `20+`)
- **Backend:** servicio corriendo en `http://localhost:8080`

---

## Ejecución en desarrollo

**1. Instalar dependencias:**

```bash
npm install
```

**2. Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

**3.** Acceder a la URL que aparece en la terminal (usualmente `http://localhost:5173`).

---

## Ejecución con Docker (producción)

Este proyecto utiliza un **build multi-stage** para generar una imagen optimizada con Nginx.

**Construir y levantar el contenedor:**

```bash
docker compose up --build -d
```

El frontend estará disponible en: `http://localhost:5173`

**Detener el contenedor:**

```bash
docker compose down
```

---

## Usuarios de prueba (seeds)

Puedes iniciar sesión con cualquiera de estos perfiles precargados en el backend:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | `ROLE_ADMIN` |
| `usuario` | `user123` | `ROLE_USER` |
| `bodeguero` | `bodega123` | `ROLE_WAREHOUSE_MANAGER` |
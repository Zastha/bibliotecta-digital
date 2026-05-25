# Módulo de Biblioteca Digital

Sistema de gestión de biblioteca digital para la Universidad Tecnológica del Centro de Culiacán.

## Tecnologías

- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL (Supabase)
- **Frontend**: React

## Requisitos previos

- Node.js v18 o superior
- Git

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/biblioteca-digital.git
cd biblioteca-digital
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend` con las credenciales que te compartió el equipo:

PORT=3001
NODE_ENV=development
DB_HOST=
DB_PORT=5432
DB_NAME=postgres
DB_USER=
DB_PASSWORD=


### 3. Correr el backend

```bash
npm run dev
```

El servidor correrá en `http://localhost:3001`

### 4. Configurar el frontend

```bash
cd ../frontend
npm install
npm start
```

El frontend correrá en `http://localhost:3000`

## Documentación de la API

Con el servidor corriendo visita:

http://localhost:3001/api/docs


## Pruebas

```bash
cd backend
npm test
```

## Autenticación

Todos los endpoints requieren el header `auth-id` con el ID del usuario autenticado.

## Roles

| Rol | Permisos |
|---|---|
| `alumno` | Ver catálogo, solicitar préstamos, ver historial |
| `maestro` | Ver catálogo, solicitar préstamos, ver historial |
| `administrador` | Acceso completo al sistema |
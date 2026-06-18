# 🗳️ Sistema de Gestión Electoral — OATI Universidad Distrital

Sistema web full stack para la administración del proceso electoral universitario: partidos, candidatos y votos.

---

## 🧱 Stack Tecnológico

| Capa       | Tecnología                                    |
|------------|-----------------------------------------------|
| Backend    | Node.js · Express.js · Sequelize ORM          |
| Base Datos | PostgreSQL 16                                 |
| Frontend   | React 18 · Material UI v5 · React Router DOM  |
| HTTP       | Axios                                         |
| Docs       | Swagger / OpenAPI 3.0                         |
| Docker     | Docker · Docker Compose                       |
| Calidad    | ESLint · Prettier                             |

---

## 🏗️ Arquitectura

El proyecto implementa **arquitectura en capas** con el **Repository Pattern**:

```
HTTP Request
    ↓
Controller   ← Recibe la petición, delega al Service, retorna respuesta HTTP
    ↓
Service      ← Contiene la lógica de negocio y validaciones de dominio
    ↓
Repository   ← Abstrae el acceso a datos (ÚNICO punto de contacto con Sequelize/PostgreSQL)
    ↓
PostgreSQL
```

### Repository Pattern
Los repositorios se encuentran en `/backend/src/repositories/`. Cada entidad tiene su propio repositorio:
- `partidoRepository.js` — CRUD + búsquedas de partido
- `candidatoRepository.js` — CRUD + búsquedas de candidato
- `votoRepository.js` — Creación, consulta y estadísticas de votos

**Beneficio:** El servicio nunca importa Sequelize directamente. Si se cambia la base de datos, solo se modifican los repositorios.

---

## Estructura del Proyecto

```
electoral/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # Conexión Sequelize + PostgreSQL
│   │   │   └── swagger.js        # Configuración OpenAPI 3.0
│   │   ├── models/
│   │   │   ├── Partido.js
│   │   │   ├── Candidato.js
│   │   │   ├── Voto.js
│   │   │   └── index.js          # Asociaciones entre modelos
│   │   ├── repositories/         # ★ Repository Pattern aquí
│   │   │   ├── partidoRepository.js
│   │   │   ├── candidatoRepository.js
│   │   │   └── votoRepository.js
│   │   ├── services/
│   │   │   ├── partidoService.js
│   │   │   ├── candidatoService.js
│   │   │   ├── votoService.js
│   │   │   └── dashboardService.js
│   │   ├── controllers/
│   │   │   ├── partidoController.js
│   │   │   ├── candidatoController.js
│   │   │   ├── votoController.js
│   │   │   └── dashboardController.js
│   │   ├── routes/
│   │   │   ├── partidoRoutes.js   # Con anotaciones Swagger
│   │   │   ├── candidatoRoutes.js
│   │   │   ├── votoRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js   # Manejo centralizado de errores
│   │   │   └── validate.js       # Middleware express-validator
│   │   ├── validations/
│   │   │   ├── partidoValidations.js
│   │   │   ├── candidatoValidations.js
│   │   │   └── votoValidations.js
│   ├── app.js                # Configuración Express
│   ├── index.js              # Entry point + sync DB
│   ├── .env.example
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── theme/
│   │   │   └── theme.js          # Tema institucional MUI
│   │   ├── services/
│   │   │   └── api.js            # Axios + servicios por entidad
│   │   ├── hooks/
│   │   │   └── useNotification.js
│   │   ├── components/
│   │   │   ├── common/           # Notification, ConfirmDialog, PageHeader, Loading
│   │   │   └── layout/           # Layout.jsx, Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── GestionPartidos.jsx
│   │   │   ├── GestionCandidatos.jsx
│   │   │   ├── RegistrarVoto.jsx
│   │   │   ├── ConsultaVotos.jsx
│   │   │   └── Estadisticas.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Modelo de Datos

```
┌─────────────────┐       ┌──────────────────────┐       ┌─────────────────┐
│    partidos     │       │      candidatos       │       │     votos       │
├─────────────────┤       ├──────────────────────┤       ├─────────────────┤
│ id (PK)         │◄──┐   │ id (PK)              │◄──┐   │ id (PK)         │
│ nombre (UNIQUE) │   └───│ id_partido (FK)       │   └───│ id_candidato(FK)│
│ sigla (UNIQUE)  │       │ nombre               │       │ id_partido (FK) │
│ descripcion     │       │ apellido             │       │ fecha_voto      │
│ created_at      │       │ documento (UNIQUE)   │       └─────────────────┘
│ updated_at      │       │ correo (UNIQUE)      │
└─────────────────┘       │ created_at           │
                          │ updated_at           │
                          └──────────────────────┘
```

**Relaciones:**
- Un `Partido` → muchos `Candidatos`
- Un `Candidato` → un solo `Partido`
- Un `Candidato` → muchos `Votos`
- Un `Voto` almacena `id_candidato`, `id_partido` y `fecha_voto`

---

## Endpoints de la API

### Partidos
| Método | Ruta                  | Descripción             |
|--------|-----------------------|-------------------------|
| GET    | `/api/partidos`       | Listar todos            |
| GET    | `/api/partidos/:id`   | Obtener por ID          |
| POST   | `/api/partidos`       | Crear partido           |
| PUT    | `/api/partidos/:id`   | Actualizar partido      |
| DELETE | `/api/partidos/:id`   | Eliminar partido        |

### Candidatos
| Método | Ruta                    | Descripción              |
|--------|-------------------------|--------------------------|
| GET    | `/api/candidatos`       | Listar todos             |
| GET    | `/api/candidatos/:id`   | Obtener por ID           |
| POST   | `/api/candidatos`       | Crear candidato          |
| PUT    | `/api/candidatos/:id`   | Actualizar candidato     |
| DELETE | `/api/candidatos/:id`   | Eliminar candidato       |

### Votos
| Método | Ruta                        | Descripción                       |
|--------|-----------------------------|-----------------------------------|
| GET    | `/api/votos`                | Consultar todos los votos         |
| POST   | `/api/votos`                | Registrar un voto                 |
| GET    | `/api/votos/estadisticas`   | Estadísticas por candidato/partido|

### Dashboard
| Método | Ruta             | Descripción                          |
|--------|------------------|--------------------------------------|
| GET    | `/api/dashboard` | Totales de partidos, candidatos, votos |

---

## Swagger

Disponible en: **`http://localhost:3001/api/docs`**

Documenta todos los endpoints con esquemas de request/response, ejemplos y códigos de estado.

---

## Variables de Entorno

Crea un archivo `.env` en `/backend` copiando `.env.example`:

```bash
cp backend/.env.example backend/.env
```

| Variable       | Descripción                  | Default       |
|----------------|------------------------------|---------------|
| `NODE_ENV`     | Entorno de ejecución         | `development` |
| `PORT`         | Puerto del servidor backend  | `3001`        |
| `DB_HOST`      | Host de PostgreSQL           | `localhost`   |
| `DB_PORT`      | Puerto de PostgreSQL         | `5432`        |
| `DB_NAME`      | Nombre de la base de datos   | `electoral_db`|
| `DB_USER`      | Usuario de PostgreSQL        | `postgres`    |
| `DB_PASSWORD`  | Contraseña de PostgreSQL     | `postgres123` |
| `CORS_ORIGIN`  | Origen permitido por CORS    | `*`           |

---

## Instalación con Docker (recomendado)

> Requiere Docker Desktop instalado.

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd electoral

# 2. Levantar todos los servicios
docker compose up --build

# La aplicación estará disponible en:
# Frontend:  http://localhost
# Backend:   http://localhost:3001
# Swagger:   http://localhost:3001/api/docs
```

Para detener:
```bash
docker compose down
# Con limpieza de volúmenes (borra la BD):
docker compose down -v
```

---

## Instalación Local (sin Docker)

### Pre-requisitos
- Node.js >= 18
- PostgreSQL 14+

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de PostgreSQL

# Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE electoral_db;"

# Iniciar servidor (Sequelize sincroniza las tablas automáticamente)
npm run dev
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# La app estará en http://localhost:3000
# (El proxy de Vite redirige /api → http://localhost:3001)
```

---

## Calidad de Código

```bash
# Lint backend
cd backend && npm run lint

# Formatear backend
cd backend && npm run format

# Lint frontend
cd frontend && npm run lint

# Formatear frontend
cd frontend && npm run format
```

---

## Diseño

Tema institucional moderno con colores de la Universidad Distrital:

| Token             | Valor     | Uso                        |
|-------------------|-----------|----------------------------|
| Azul marino       | `#0F172A` | Fondo sidebar, primario    |
| Azul celeste      | `#38BDF8` | Acento, secundario         |
| Blanco            | `#FFFFFF` | Fondo cards, paper         |
| Gris claro        | `#F8FAFC` | Fondo general              |

---

## Páginas del Frontend

| Ruta               | Página             | Descripción                             |
|--------------------|--------------------|-----------------------------------------|
| `/`                | Dashboard          | Totales y accesos rápidos               |
| `/partidos`        | Gestión Partidos   | CRUD con DataGrid MUI                   |
| `/candidatos`      | Gestión Candidatos | CRUD con selección de partido           |
| `/votos/registrar` | Registrar Voto     | Papeleta de votación interactiva        |
| `/votos`           | Consulta Votos     | Tabla con búsqueda                      |
| `/estadisticas`    | Estadísticas       | Gráficas de barras y torta (Recharts)   |

---

## Autor

Karen Daniela Garzon Gordillo
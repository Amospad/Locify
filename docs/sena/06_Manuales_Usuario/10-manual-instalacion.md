---
sidebar_position: 10
title: 10. Manual de Instalación y Despliegue
---

# Manual de Instalación y Despliegue — LOCIFY

> **Audiencia:** Desarrolladores, DevOps e Ingenieros de Despliegue.
> **Alcance:** Configuración de entorno local, migraciones de base de datos, variables de entorno, pruebas y despliegue a producción (Vercel + Railway/Supabase).

---

## 1. Requisitos del Entorno (Prerrequisitos)

Asegúrate de tener instalado en tu máquina de desarrollo o servidor:
- **Node.js:** Versión `20.x` o superior (`24.x` recomendado).
- **pnpm:** Versión `9.x` o superior (`npm install -g pnpm`).
- **Git:** Versión `2.x` o superior.
- **Supabase CLI:** Opcional pero recomendado para gestión de migraciones (`npm install -g supabase`).
- **PostgreSQL 15+:** (Si no usas Supabase Cloud local/remoto).

---

## 2. Estructura del Repositorio

LOCIFY es un **Monolito Modular** organizado de la siguiente manera:
```
/
├── app/                  # Frontend Next.js 14+ (App Router, PWA, Tailwind, Lucide)
├── backend/              # Módulos de negocio (Fastify, Prisma ORM, Arquitectura Hexagonal)
├── prisma/               # Schema único de base de datos y migraciones
├── docs/                 # Documentación Docusaurus (Estructura SENA)
├── specs/                # Especificaciones técnicas (Spec-Driven Development)
├── scripts/              # Herramientas de sincronización y exportación
└── init.sh               # Script de verificación y salud del entorno
```

---

## 3. Instalación Local (Paso a Paso)

### 3.1 Clonar el repositorio
```bash
git clone https://github.com/Amospad/Locify.git
cd Locify
```

### 3.2 Instalar dependencias
```bash
pnpm install
```

### 3.3 Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto (basado en `.env.example`):
```env
# Base de Datos (Supabase PostgreSQL / Connection Pooling)
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres?schema=public&pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@db.supabase.co:5432/postgres?schema=public"

# Supabase Auth y Cliente
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key"
SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key"

# Pasarela de Pagos (Wompi Colombia - Sandbox)
WOMPI_PUBLIC_KEY="pub_test_..."
WOMPI_PRIVATE_KEY="prv_test_..."
WOMPI_EVENTS_SECRET="prod_events_..."

# Configuración del Servidor
PORT=3000
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3.4 Configurar la Base de Datos con Prisma
```bash
# Generar Prisma Client
pnpm prisma generate

# Aplicar migraciones en desarrollo
pnpm prisma migrate dev

# (Opcional) Abrir Prisma Studio para inspeccionar datos
pnpm prisma studio
```

### 3.5 Ejecutar la Suite de Verificación
Antes de iniciar el servidor, comprueba que todo el entorno esté verde:
```bash
./init.sh
```

---

## 4. Ejecución en Modo Desarrollo

Levanta el entorno de desarrollo local:
```bash
pnpm dev
```
- **Frontend (Next.js):** `http://localhost:3000`
- **Documentación Docusaurus:** Entrar a `docs/` y ejecutar `pnpm start` (`http://localhost:3000`)

---

## 5. Pruebas Automatizadas

LOCIFY exige cumplir con la pirámide de pruebas:
```bash
# Pruebas unitarias e integración (Vitest)
pnpm test

# Modo watch para desarrollo guiado por pruebas
pnpm test:watch

# Cobertura de código (≥80% requerido)
pnpm test:coverage

# Pruebas End-to-End (Playwright)
pnpm playwright test
```

---

## 6. Despliegue a Producción

### 6.1 Frontend (Vercel)
1. Conecta el repositorio GitHub a **Vercel**.
2. Configura el directorio raíz: `./` (o `./app` según configuración).
3. Configura las **Variables de Entorno** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.).
4. Build Command: `pnpm build` (o comando configurado en Vercel).
5. Despliegue automático en cada `git push main`.

### 6.2 Base de Datos (Supabase Cloud)
1. Crea un proyecto en [Supabase](https://supabase.com).
2. Vincula tu CLI local: `supabase link --project-ref tu-ref`.
3. Aplica migraciones a producción: `supabase db push`.
4. Habilita **Row Level Security (RLS)** en todas las tablas y verifica las políticas definidas en `modelo-datos.md`.

### 6.3 Backend de Negocio / Fastify (Railway / Render / AWS)
1. Conecta el servicio backend en **Railway** o **Render**.
2. Define el comando de inicio: `pnpm start` o `node backend/index.js`.
3. Inyecta `DATABASE_URL` (con Connection Pooling) y llaves de Wompi.

---

## 7. Verificación Post-Despliegue

- [ ] `pnpm typecheck` pasa sin errores.
- [ ] `pnpm lint` sin advertencias críticas.
- [ ] Healthcheck HTTP responde `200 OK` en `/api/health`.
- [ ] Conexión Supabase Realtime activa para celdas y reservas.
- [ ] Webhook de Wompi configurado y respondiendo en producción.

---

*Versión: 1.0 | Noviembre 2026 | LOCIFY ADSO Ficha 3314811*
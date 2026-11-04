---
sidebar_position: 1
title: Modelo de Datos
---

# Modelo de Datos (Supabase + RLS)

:::info Decisión vigente
El **ADR-003** (Monolito Modular) y el **ADR-005** (Arquitectura Dual Next.js + Fastify) establecen la arquitectura actual:
- **Frontend & API Pública:** Next.js 14+ (App Router, Server Actions) consume Supabase directamente (PostgREST + Realtime + Auth).
- **Backend de Negocio Complejo:** Fastify orquesta lógica pesada (QR, Wompi, Cron Jobs) y se conecta a la **misma** base de datos Supabase (PostgreSQL) mediante Prisma ORM.
- **Seguridad de Datos:** **Row Level Security (RLS)** es la única fuente de verdad para el control de acceso multi-tenant. No hay `database-per-service`; es un único cluster PostgreSQL gestionado por Supabase con esquemas lógicos por dominio.
:::

## 1. Diagrama Entidad-Relación (ER) Global

```mermaid
erDiagram
    %% DOMINIO: IDENTIDAD Y ACCESO (Supabase Auth + Tablas Públicas)
    USUARIO {
        uuid id PK "Referencia a auth.users.id"
        string email UK "Sincronizado desde Supabase Auth"
        enum rol "CONDUCTOR, OPERADOR, ADMIN"
        enum estado "PENDIENTE, ACTIVO, SUSPENDIDO"
        uuid operador_id FK "NULL si no es OPERADOR"
        timestamp created_at
        timestamp updated_at
    }

    TICKET_KYB {
        uuid id PK
        uuid operador_id FK
        enum estado "EN_REVISION, APROBADO, RECHAZADO"
        jsonb documentos "URLs o metadatos de archivos"
        string motivo_rechazo
        timestamp created_at
        timestamp updated_at
    }

    %% DOMINIO: OPERADOR (Sedes, Capacidad, Ocupación)
    SEDE {
        uuid id PK
        uuid operador_id FK "Dueño lógico (OPERADOR)"
        string nombre
        string direccion
        decimal latitud
        decimal longitud
        int capacidad_total
        boolean activa
        time horario_apertura
        time horario_cierre
        timestamp created_at
    }

    CELDA {
        uuid id PK
        uuid sede_id FK
        enum tipo_vehiculo "AUTO, MOTO, BICICLETA, DISCAPACITADOS"
        enum estado "DISPONIBLE, OCUPADA, MANTENIMIENTO, RESERVADA_MANUAL"
        timestamp created_at
    }

    %% DOMINIO: CLIENTE (Conductores, Vehículos, Reservas)
    VEHICULO {
        uuid id PK
        uuid conductor_id FK "Referencia a USUARIO (rol=CONDUCTOR)"
        string placa UK
        string marca
        string modelo
        string color
        timestamp created_at
    }

    RESERVA {
        uuid id PK
        uuid conductor_id FK "Referencia a USUARIO (rol=CONDUCTOR)"
        uuid sede_id FK
        uuid vehiculo_id FK
        uuid celda_id FK "NULL hasta check-in"
        enum modalidad "GARANTIZADA, EXPRES"
        enum estado "PENDIENTE_PAGO, ACTIVA, EN_USO, EN_SOBRETIEMPO, COMPLETADA, CANCELADA, EXPIRADA"
        timestamp hora_entrada_est
        timestamp hora_checkin_real
        timestamp hora_checkout_real
        string codigo_qr "Hash único inmutable"
        boolean sincronizado "Para modo offline"
        timestamp created_at
        timestamp updated_at
    }

    %% DOMINIO: PAGOS Y FINANZAS (Integración Wompi)
    TRANSACCION {
        uuid id PK
        uuid reserva_id FK
        uuid operador_id FK
        string referencia_wompi UK "ID de transacción en Wompi"
        decimal monto
        enum estado "PENDIENTE, APROBADA, RECHAZADA, REEMBOLSADA"
        enum metodo "CARD, NEQUI, BANCOLOMBIA, PSE"
        jsonb datos_wompi "Respuesta cruda de la pasarela"
        timestamp created_at
        timestamp updated_at
    }

    %% DOMINIO: SOPORTE Y AUDITORÍA
    TICKET_SOPORTE {
        uuid id PK
        uuid usuario_id FK
        uuid reserva_id FK "Opcional"
        enum estado "ABIERTO, EN_PROGRESO, CERRADO"
        string asunto
        text descripcion
        timestamp created_at
    }

    ADJUNTO {
        uuid id PK
        uuid ticket_id FK
        string url
        string tipo_mime
        timestamp created_at
    }

    REGLA_NEGOCIO {
        uuid id PK
        string clave UK "ej: COMISION_PLATAFORMA, TIEMPO_TOLERANCIA_MIN"
        jsonb valor "Configuración tipada"
        string descripcion
        timestamp updated_at
    }

    EVENTO_AUDITORIA {
        bigint id PK "Append-only, BigSerial"
        uuid usuario_id "NULL si acción de sistema"
        string accion "ej: RESERVA_CREADA, CHECKIN_FALLIDO"
        jsonb metadata "Contexto estructurado"
        timestamp creado_en "DEFAULT now()"
    }

    %% Relaciones
    USUARIO ||--o{ TICKET_KYB : "solicita"
    USUARIO ||--o{ SEDE : "administra (OPERADOR)"
    SEDE ||--|{ CELDA : "contiene"
    USUARIO ||--o{ VEHICULO : "registra (CONDUCTOR)"
    VEHICULO ||--o{ RESERVA : "usa"
    SEDE ||--o{ RESERVA : "recibe"
    CELDA ||--o{ RESERVA : "asigna (en check-in)"
    RESERVA ||--|| TRANSACCION : "genera"
    USUARIO ||--o{ TICKET_SOPORTE : "crea"
    TICKET_SOPORTE ||--o{ ADJUNTO : "tiene"
```

## 2. Políticas de Seguridad (Row Level Security - RLS)

> **Principio Constitucional:** Supabase RLS es la primera línea de defensa. Todas las tablas habilitan RLS. Las políticas se definen en migraciones SQL y se versionan con el código.

| Tabla | Política | Expresión SQL (Resumen) |
|-------|----------|-------------------------|
| `USUARIO` | `select_own` | `auth.uid() = id` |
| `USUARIO` | `select_operador_sedes` | `EXISTS (SELECT 1 FROM SEDE s WHERE s.operador_id = auth.uid() AND s.id = USUARIO.operador_id)` |
| `SEDE` | `select_public_active` | `activa = true` (para búsqueda pública) |
| `SEDE` | `crud_operador` | `operador_id = auth.uid()` |
| `CELDA` | `select_sede_operador` | `EXISTS (SELECT 1 FROM SEDE s WHERE s.id = sede_id AND s.operador_id = auth.uid())` |
| `VEHICULO` | `crud_conductor` | `conductor_id = auth.uid()` |
| `RESERVA` | `select_conductor` | `conductor_id = auth.uid()` |
| `RESERVA` | `select_operador_sede` | `EXISTS (SELECT 1 FROM SEDE s WHERE s.id = sede_id AND s.operador_id = auth.uid())` |
| `RESERVA` | `insert_conductor` | `conductor_id = auth.uid() AND modalidad IN ('GARANTIZADA','EXPRES')` |
| `TRANSACCION` | `select_participantes` | `conductor_id = auth.uid() OR operador_id = auth.uid()` |
| `TICKET_SOPORTE` | `select_own` | `usuario_id = auth.uid()` |
| `TICKET_KYB` | `select_operador` | `operador_id = auth.uid()` |
| `TICKET_KYB` | `insert_operador` | `operador_id = auth.uid() AND estado = 'EN_REVISION'` |

## 3. Migraciones y Versionado

- **Herramienta:** Supabase CLI (`supabase migration new`, `supabase db push`).
- **Estrategia:** Migraciones **aditivas y reversibles** siempre que sea posible.
- **Índices:** Creados `CONCURRENTLY` en producción para tablas grandes (`RESERVA`, `EVENTO_AUDITORIA`).
- **RLS:** Las políticas se crean en la misma migración que la tabla (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY; CREATE POLICY ...`).

## 4. Máquina de Estados de una Reserva (Actualizada)

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE_PAGO : Usuario elige Reserva Garantizada
    [*] --> ACTIVA : Usuario elige Reserva Exprés (QR generado)
    
    PENDIENTE_PAGO --> ACTIVA : Pago exitoso en Wompi (Webhook)
    PENDIENTE_PAGO --> CANCELADA : Pago fallido o tiempo agotado (15 min)
    
    ACTIVA --> EN_USO : Check-in (Escaneo QR válido + celda asignada)
    ACTIVA --> EXPIRADA : Pasan 5 min sin check-in (Solo Exprés)
    
    EN_USO --> EN_SOBRETIEMPO : Excede hora_entrada_est + duracion
    EN_SOBRETIEMPO --> COMPLETADA : Check-out (Cobro penalidad vía Wompi)
    
    EN_USO --> COMPLETADA : Check-out a tiempo
    COMPLETADA --> [*]
    CANCELADA --> [*]
    EXPIRADA --> [*]
```

## 5. Integración Next.js ↔ Supabase ↔ Fastify

| Capa | Responsabilidad | Acceso a Datos |
|------|-----------------|----------------|
| **Next.js (Server Actions / API Routes)** | UI, Búsqueda pública, Autenticación (Supabase Auth), Reservas Exprés | Cliente Supabase JS (`createServerClient`) — respeta RLS automáticamente via JWT del usuario |
| **Fastify (Servicios Internos)** | Lógica de QR, Webhooks Wompi, Jobs Cron (expiración, cierres de caja), Disputas | Prisma ORM (connection pooling PgBouncer) — **Bypasa RLS** usando `service_role_key` solo en operaciones de sistema auditadas (`EVENTO_AUDITORIA`) |
| **Supabase Realtime** | Ocupación en vivo (`CELDA.estado`), Notificaciones push | Canales filtrados por `sede_id` (Operador) o `conductor_id` (Cliente) |

## 6. Estado de Implementación (Checklist)

| Entidad | Migración SQL | RLS Policies | Prisma Schema | Next.js Types | Estado |
|---------|---------------|--------------|---------------|---------------|--------|
| `USUARIO` (perfil) | ✅ | ✅ | ✅ | ✅ | **Done** |
| `TICKET_KYB` | ✅ | ✅ | ✅ | ✅ | **Done** |
| `SEDE` | ✅ | ✅ | ✅ | ✅ | **Done** |
| `CELDA` | ✅ | ✅ | ✅ | ✅ | **Done** |
| `VEHICULO` | ✅ | ✅ | ✅ | ✅ | **Done** |
| `RESERVA` | ✅ | ✅ | ✅ | ✅ | **Done** |
| `TRANSACCION` | 🟡 Parcial | 🟡 Parcial | 🟡 Parcial | 🟡 Parcial | **WIP (Wompi)** |
| `TICKET_SOPORTE` / `ADJUNTO` | ⏳ Pendiente | ⏳ Pendiente | ⏳ Pendiente | ⏳ Pendiente | **Backlog** |
| `REGLA_NEGOCIO` | ✅ | ✅ (solo ADMIN) | ✅ | ✅ | **Done** |
| `EVENTO_AUDITORIA` | ✅ | ❌ (Solo service_role) | ✅ | ❌ | **Done** |

---

> **Nota para auditores SENA:** Este documento refleja la arquitectura **implementada y desplegada** (no solo teórica). La base de datos única en Supabase con RLS garantiza aislamiento multi-tenant sin complejidad operativa de múltiples clusters.
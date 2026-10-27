---
sidebar_position: 1
title: Modelo de Datos
---

# Modelo de Datos (Database-per-Service)

Para garantizar el desacoplamiento, LOCIFY utiliza el patrón **Database-per-service**. Cada microservicio tiene su propia base de datos PostgreSQL y es el único dueño de su esquema.

## 1. Diagrama Entidad-Relación (ER) Global

```mermaid
erDiagram
    %% MICROSERVICIO: ADMIN (KYB y Usuarios)
    USUARIO {
        uuid id PK
        string email
        string password_hash
        enum rol "CONDUCTOR, OPERADOR, ADMIN"
        enum estado "PENDIENTE, ACTIVO, SUSPENDIDO"
        string token_invitacion
        timestamp token_expiracion
    }
    
    TICKET_KYB {
        uuid id PK
        uuid operador_id FK
        string estado "EN_REVISION, APROBADO, RECHAZADO"
        string url_documentos
        string motivo_rechazo
    }

    %% MICROSERVICIO: OPERADOR (Sedes y Ocupación)
    SEDE {
        uuid id PK
        uuid operador_id FK
        string nombre
        string direccion
        float latitud
        float longitud
        int capacidad_total
        boolean activa
        string horario_apertura
        string horario_cierre
    }

    CELDA {
        uuid id PK
        uuid sede_id FK
        string tipo_vehiculo
        enum estado "DISPONIBLE, OCUPADA, MANTENIMIENTO, RESERVADA_MANUAL"
    }

    %% MICROSERVICIO: CLIENTE (Reservas y Vehículos)
    VEHICULO {
        uuid id PK
        uuid cliente_id FK
        string placa
        string marca
    }

    RESERVA {
        uuid id PK
        uuid cliente_id FK
        uuid sede_id FK
        uuid vehiculo_id FK
        enum modalidad "GARANTIZADA, EXPRES"
        enum estado "PENDIENTE_PAGO, ACTIVA, EN_USO, EN_SOBRETIEMPO, COMPLETADA, CANCELADA, EXPIRADA"
        timestamp hora_entrada_est
        timestamp hora_checkin_real
        timestamp hora_checkout_real
        string codigo_qr
        boolean sincronizado
    }

    %% Relaciones Lógicas
    USUARIO ||--o{ TICKET_KYB : "solicita"
    USUARIO ||--o{ SEDE : "administra"
    SEDE ||--|{ CELDA : "contiene"
    USUARIO ||--o{ VEHICULO : "registra"
    VEHICULO ||--o{ RESERVA : "tiene"
    SEDE ||--o{ RESERVA : "recibe"

## 2. Diccionario de Datos (Con ajustes de auditoría)

### 2.1 `admin-api` (Identidad y KYB)

| Tabla | Campo | Tipo | Descripción |
|---|---|---|---|
| **USUARIO** | `id` | UUID | Llave primaria. |
| | `email` | VARCHAR(255) | Único en el sistema. |
| | `rol` | ENUM | Define los permisos (RBAC). |

### 2.2 `operador-api` (Sedes y Capacidad)

| Tabla | Campo | Tipo | Descripción |
|---|---|---|---|
| **SEDE** | `operador_id` | UUID | ID lógico del usuario en `admin-api`. |
| | `latitud` / `longitud` | DECIMAL | Para el mapa interactivo. |
| | `horario_apertura` / `horario_cierre` | VARCHAR | **NUEVO:** Evita reservas fuera de horario. |
| **CELDA** | `estado` | ENUM | Cambia a OCUPADA, pero permite `RESERVADA_MANUAL` (El 5% del buffer operativo). |

### 2.3 `cliente-api` (Reservas y Conductores)

| Tabla | Campo | Tipo | Descripción |
|---|---|---|---|
| **RESERVA** | `sede_id` | UUID | ID lógico de la sede en `operador-api`. |
| | `estado` | ENUM | **NUEVO ESTADO:** `EN_SOBRETIEMPO` (si el cliente excede el tiempo). |
| | `codigo_qr` | VARCHAR(255) | Hash único generado para el acceso. |
| | `sincronizado` | BOOLEAN | **NUEVO:** Permite el modo offline (Check-in manual). |

---

## 3. Máquina de Estados de una Reserva (Actualizada)

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE_PAGO : Usuario elige Reserva Garantizada
    [*] --> ACTIVA : Usuario elige Reserva Exprés (QR generado)
    
    PENDIENTE_PAGO --> ACTIVA : Pago exitoso en Pasarela
    PENDIENTE_PAGO --> CANCELADA : Pago fallido o tiempo agotado
    
    ACTIVA --> EN_USO : Check-in (Escaneo de QR exitoso)
    ACTIVA --> EXPIRADA : Pasan 5 min sin check-in (Solo Exprés)
    
    EN_USO --> EN_SOBRETIEMPO : El cliente excede su tiempo límite
    EN_SOBRETIEMPO --> COMPLETADA : Check-out (Paga la penalidad)
    
    EN_USO --> COMPLETADA : Check-out a tiempo
    
    COMPLETADA --> [*]
    CANCELADA --> [*]
    EXPIRADA --> [*]
    
## 4. Estrategia de IDs Lógicos (Cross-Service)

Como cada microservicio tiene su propia base de datos, no usamos llaves foráneas (`FOREIGN KEY`) entre servicios. Usamos UUIDs como IDs lógicos.

- El `cliente-api` guarda el `sede_id` (un UUID).
- Si necesita validar que la sede existe, hace una petición HTTP al `operador-api` (`GET /api/sedes/{id}`).

Esto mantiene las bases de datos aisladas y escalables.
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
    }

    CELDA {
        uuid id PK
        uuid sede_id FK
        string tipo_vehiculo
        enum estado "DISPONIBLE, OCUPADA, MANTENIMIENTO"
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
        enum estado "PENDIENTE_PAGO, ACTIVA, EN_USO, COMPLETADA, CANCELADA, EXPIRADA"
        timestamp hora_entrada_est
        timestamp hora_checkin_real
        timestamp hora_checkout_real
        string codigo_qr
    }

    %% Relaciones Lógicas
    USUARIO ||--o{ TICKET_KYB : "solicita"
    USUARIO ||--o{ SEDE : "administra"
    SEDE ||--|{ CELDA : "contiene"
    USUARIO ||--o{ VEHICULO : "registra"
    VEHICULO ||--o{ RESERVA : "tiene"
    SEDE ||--o{ RESERVA : "recibe"
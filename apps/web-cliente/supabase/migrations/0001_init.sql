-- Prisma migration generated from schema.prisma
-- From empty to schema

-- Create enums
CREATE TYPE "RolUsuario" AS ENUM ('CONDUCTOR', 'OPERADOR', 'ADMIN');
CREATE TYPE "EstadoUsuario" AS ENUM ('PENDIENTE', 'ACTIVO', 'SUSPENDIDO');
CREATE TYPE "ModalidadReserva" AS ENUM ('GARANTIZADA', 'EXPRES');
CREATE TYPE "EstadoReserva" AS ENUM ('ACTIVA', 'FINALIZADA', 'CANCELADA', 'EXPIRADA');
CREATE TYPE "EstadoSede" AS ENUM ('ACTIVA', 'PENDIENTE_KYB', 'RECHAZADA');
CREATE TYPE "EstadoKYB" AS ENUM ('EN_REVISION', 'APROBADO', 'RECHAZADO');

-- Tables
CREATE TABLE "usuario" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "estado" "EstadoUsuario" NOT NULL,
    "token_invitacion" TEXT,
    "token_expiracion" TIMESTAMPTZ
);

CREATE TABLE "sede" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "latitud" REAL NOT NULL,
    "longitud" REAL NOT NULL,
    "capacidad_total" INTEGER NOT NULL,
    "precio_hora" INTEGER NOT NULL,
    "estado" "EstadoSede" NOT NULL DEFAULT 'PENDIENTE_KYB',
    "operador_id" TEXT NOT NULL
);

CREATE TABLE "ticket_kyb" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "sede_id" TEXT NOT NULL UNIQUE,
    "operador_id" TEXT NOT NULL,
    "estado" "EstadoKYB" NOT NULL DEFAULT 'EN_REVISION',
    "url_rut" TEXT NOT NULL,
    "url_camara_comercio" TEXT NOT NULL,
    "motivo_rechazo" TEXT,
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "fecha_actualizacion" TIMESTAMPTZ,
    CONSTRAINT "ticket_kyb_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "sede"("id")
);

CREATE TABLE "reserva" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "usuario_id" TEXT NOT NULL,
    "sede_id" TEXT NOT NULL,
    "modalidad" "ModalidadReserva" NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'ACTIVA',
    "codigo_qr" TEXT NOT NULL UNIQUE,
    "fecha_entrada" TIMESTAMPTZ NOT NULL,
    "fecha_salida" TIMESTAMPTZ,
    CONSTRAINT "reserva_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id"),
    CONSTRAINT "reserva_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "sede"("id")
);

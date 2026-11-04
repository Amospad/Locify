-- Create enums
CREATE TYPE "public"."EstadoKYB" AS ENUM ('EN_REVISION', 'APROBADO', 'RECHAZADO');
CREATE TYPE "public"."EstadoReserva" AS ENUM ('ACTIVA', 'FINALIZADA', 'CANCELADA', 'EXPIRADA', 'PAGADA');
CREATE TYPE "public"."EstadoSede" AS ENUM ('ACTIVA', 'PENDIENTE_KYB', 'RECHAZADA');
CREATE TYPE "public"."EstadoUsuario" AS ENUM ('PENDIENTE', 'ACTIVO', 'SUSPENDIDO');
CREATE TYPE "public"."ModalidadReserva" AS ENUM ('GARANTIZADA', 'EXPRES');
CREATE TYPE "public"."RolUsuario" AS ENUM ('CONDUCTOR', 'OPERADOR', 'ADMIN');

-- Create tables
CREATE TABLE "public"."usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "rol" "public"."RolUsuario" NOT NULL,
    "estado" "public"."EstadoUsuario" NOT NULL,
    "token_invitacion" TEXT,
    "token_expiracion" TIMESTAMPTZ
);

CREATE TABLE "public"."sede" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "capacidad_total" INTEGER NOT NULL,
    "precio_hora" INTEGER NOT NULL,
    "estado" "public"."EstadoSede" NOT NULL DEFAULT 'PENDIENTE_KYB',
    "operador_id" TEXT NOT NULL
);

CREATE TABLE "public"."ticket_kyb" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sede_id" TEXT NOT NULL UNIQUE,
    "operador_id" TEXT NOT NULL,
    "estado" "public"."EstadoKYB" NOT NULL DEFAULT 'EN_REVISION',
    "url_rut" TEXT NOT NULL,
    "url_camara_comercio" TEXT NOT NULL,
    "motivo_rechazo" TEXT,
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "fecha_actualizacion" TIMESTAMPTZ,
    CONSTRAINT "ticket_kyb_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "public"."sede"("id") ON DELETE CASCADE
);

CREATE TABLE "public"."reserva" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuario_id" TEXT NOT NULL,
    "sede_id" TEXT NOT NULL,
    "modalidad" "public"."ModalidadReserva" NOT NULL,
    "estado" "public"."EstadoReserva" NOT NULL DEFAULT 'ACTIVA',
    "codigo_qr" TEXT NOT NULL UNIQUE,
    "fecha_entrada" TIMESTAMPTZ NOT NULL,
    "fecha_salida" TIMESTAMPTZ,
    CONSTRAINT "reserva_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuario"("id") ON DELETE CASCADE,
    CONSTRAINT "reserva_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "public"."sede"("id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX "reserva_usuario_id_idx" ON "public"."reserva"("usuario_id");
CREATE INDEX "reserva_sede_id_idx" ON "public"."reserva"("sede_id");
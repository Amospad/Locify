---
sidebar_position: 2
title: Glosario de Términos
---

# Glosario de LOCIFY

Este documento define los términos de negocio y técnicos utilizados en el proyecto para evitar ambigüedades.

## Términos de Negocio

| Término | Definición |
| :--- | :--- |
| **KYB (Know Your Business)** | Proceso de verificación legal de un operador de parqueadero (revisión de RUT, Cámara de Comercio) antes de permitirle operar en la plataforma. |
| **Reserva Exprés** | Modalidad de reserva sin pago anticipado, sujeta a una tolerancia estricta de 5 minutos. Si el usuario no llega, el sistema libera el cupo. |
| **Reserva Garantizada** | Modalidad de reserva que requiere pago del 100% por adelantado, bloqueando el cupo permanentemente. |
| **Sede** | Establecimiento físico de parqueo operado por un cliente B2B (Operador). |
| **Celda** | Espacio físico individual dentro de una sede donde se estaciona un vehículo. |
| **Check-in** | Acción de registrar el ingreso físico de un vehículo a la sede escaneando el código QR. |
| **Check-out** | Acción de registrar la salida del vehículo y calcular el cobro final. |
| **Motor de Reglas** | Componente del sistema que permite al Administrador configurar parámetros globales (tarifas, penalidades) sin necesidad de programar. |

## Términos Técnicos (Arquitectura Hexagonal)

| Término | Definición |
| :--- | :--- |
| **Dominio** | El núcleo del software. Contiene las reglas de negocio puras (ej. entidad `Usuario`) y no depende de frameworks ni bases de datos. |
| **Puerto** | Una interfaz (contrato) que define qué necesita el dominio para comunicarse con el exterior (ej. `UsuarioRepository`). |
| **Adaptador** | La implementación concreta de un puerto (ej. `PostgresUsuarioRepository` que usa Prisma para guardar en la base de datos). |
| **Caso de Uso** | Una acción específica del sistema (ej. `RegistrarOperador`). Orquesta las entidades del dominio para cumplir un objetivo. |
| **Microservicio** | Un servicio independiente (ej. `admin-api`, `cliente-api`) con su propia base de datos. |
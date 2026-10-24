---
sidebar_position: 9
title: 09. Modelo de Negocio y Resiliencia
---

# Modelo de Negocio, Ocupación y Resiliencia

Este documento define las reglas económicas de LOCIFY, la estrategia de gestión física de celdas (para evitar sobreventa) y la matriz de contingencia ante fallos técnicos u operativos.

## 1. Modelo de Negocio (Monetización)

LOCIFY opera bajo un modelo **B2B2C** (Business to Business to Consumer), generando ingresos por dos vías principales:

1. **Fee por Transacción (Cliente B2C):** Se aplica una tarifa de servicio fija por cada reserva realizada en la plataforma (ej. $500 COP). Este monto se suma al valor del parqueadero y cubre los costos de la pasarela de pagos y el mantenimiento de la infraestructura en la nube.
2. **Suscripción SaaS (Operador B2B):** Los operadores acceden al panel de administración, reportes financieros y gestión de sedes mediante un plan mensual o un porcentaje de comisión sobre las reservas (a definir en la fase comercial).

## 2. Gestión de Disponibilidad y Ocupación Física

El mayor riesgo de un sistema de reservas es el **Overbooking físico** (vender un cupo digital cuando la celda física está bloqueada por un vehículo en sobretiempo).

### 2.1 Buffer de Seguridad del 95%
El algoritmo de LOCIFY nunca expondrá el 100% de las celdas físicas en el mapa interactivo. Si una sede tiene 100 celdas, el sistema solo permitirá **95 reservas digitales simultáneas**. 

*   **El 5% restante** queda como "colchón" (Buffer) para uso exclusivo del operador en el parqueadero. Esto permite manejar manualmente a los clientes que llegan sin reserva (walk-ins), vehículos en sobretiempo o fallos de conectividad.

### 2.2 Ciclo de Vida de una Reserva y el Sobretiempo
1. **Check-in:** El cronómetro inicia.
2. **Alerta de Vencimiento:** 15 minutos antes de que expire el tiempo reservado, el sistema envía un push al cliente: *"Tu tiempo está por vencer, pulsa aquí para extender"*.
3. **Sobretiempo:** Si el cliente excede el tiempo, el sistema cambia el estado a `EN_SOBRETIEMPO` y comienza a cobrar por fracciones de hora (tarifa dinámica).
4. **Acción del Operador:** Si el vehículo lleva más de 2 horas en sobretiempo sin pagar, el operador recibe una alerta en su dashboard para tomar acciones físicas (ej. inmovilizar el vehículo).

## 3. Matriz de Resiliencia (¿Qué pasa si...?)

Esta tabla define cómo responde el sistema (y el equipo) ante los 7 escenarios de error más críticos.

| N° | Escenario de Error | Impacto | Solución / Respuesta del Sistema |
| :--- | :--- | :--- | :--- |
| **1** | El parqueadero se queda sin internet. | El operador no puede escanear QRs. | **Check-in Manual:** El operador digita la placa. El sistema registra la reserva en estado `SINCRONIZANDO` y la procesa cuando vuelva la red. |
| **2** | El cliente no tiene señal en su celular al llegar. | No puede mostrar el QR. | El operador busca la reserva por placa o cédula desde su panel. |
| **3** | La pasarela de pagos rechaza la tarjeta. | La reserva queda en el limbo. | El sistema bloquea el cupo por 10 minutos mientras el cliente intenta con otro medio de pago. Pasado el tiempo, cancela y libera. |
| **4** | Un cliente intenta reservar la misma placa para la misma hora. | Duplicidad de reservas. | El backend rechaza la petición mediante un índice `UNIQUE` en la base de datos (validación de doble reserva). |
| **5** | El parqueadero cierra antes de que el cliente salga. | El cliente queda encerrado. | El modelo de datos de la `SEDE` incluye `horario_cierre`. La app bloquea reservas cuya hora de fin supere ese horario. |
| **6** | Un operador vende más cupos físicos de los que tiene. | Caos en la sede. | El sistema bloquea el acceso a la sede y el Admin (App Admin) recibe una alerta roja. |
| **7** | El servidor de la nube se cae (Downtime). | Toda la plataforma se cae. | El proveedor de nube debe tener alta disponibilidad (RNF-05). Los datos críticos tienen respaldo diario (Backups). |
| **8** | El cliente cancela después del tiempo límite. | Pérdida de dinero para el operador. | El sistema aplica la penalidad automática. El dinero se divide: el operador recupera su cupo y LOCIFY retiene el Fee por gestión. |

## 4. Actualización del Modelo de Datos

Para soportar este modelo, se requieren los siguientes ajustes en la base de datos (a implementar en Prisma):

1.  **Entidad `Sede`:** Agregar campos `horarioApertura` (String) y `horarioCierre` (String).
2.  **Entidad `Reserva`:** Agregar campo `estadoSincronizacion` (Boolean, por defecto true) para el modo offline.
3.  **Entidad `Reserva`:** Agregar campo `enSobretiempo` (Boolean, por defecto false).
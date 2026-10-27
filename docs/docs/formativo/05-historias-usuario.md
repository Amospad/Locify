---
sidebar_position: 5
title: 05. Historias de Usuario (Product Backlog)
---

# Historias de Usuario y Product Backlog

Este documento contiene el Product Backlog completo del proyecto LOCIFY, organizado por épicas. Cada historia sigue el formato estándar y tiene sus criterios de aceptación.

## Épica 1: Onboarding y Seguridad (Autenticación)

| ID | Historia de Usuario | Prioridad | Estimación |
| :--- | :--- | :--- | :--- |
| **HU-01** | Como usuario, quiero registrarme con mi correo y contraseña para acceder al sistema. | Alta | 3 |
| **HU-02** | Como usuario, quiero recibir un correo de activación para validar mi cuenta. | Alta | 2 |
| **HU-03** | Como usuario, quiero recuperar mi contraseña en caso de olvido para no perder mi cuenta. | Media | 2 |
| **HU-04** | Como administrador, quiero asignar roles (RBAC) para controlar qué puede hacer cada usuario. | Alta | 3 |
| **HU-05** | Como sistema, quiero bloquear el acceso a dashboards si el usuario no ha activado su cuenta. | Alta | 1 |

## Épica 2: Gestión de Operadores (KYB)

| ID | Historia de Usuario | Prioridad | Estimación |
| :--- | :--- | :--- | :--- |
| **HU-06** | Como operador, quiero subir mis documentos legales (RUT, Cámara de Comercio) para solicitar verificación. | Alta | 3 |
| **HU-07** | Como administrador, quiero auditar los documentos de los operadores para aprobar o rechazar su sede. | Alta | 3 |
| **HU-08** | Como sistema, quiero ocultar las sedes no aprobadas en el mapa público para evitar fraudes. | Alta | 2 |
| **HU-09** | Como operador, quiero configurar la capacidad de mi sede (número de celdas y tipos de vehículo). | Alta | 3 |

## Épica 3: Reservas y Búsqueda (Cliente)

| ID | Historia de Usuario | Prioridad | Estimación |
| :--- | :--- | :--- | :--- |
| **HU-10** | Como cliente, quiero buscar parqueaderos en un mapa interactivo para ver disponibilidad en tiempo real. | Alta | 5 |
| **HU-11** | Como cliente, quiero filtrar los parqueaderos por precio y tipo de vehículo para encontrar el que se ajuste a mi necesidad. | Media | 2 |
| **HU-12** | Como cliente, quiero elegir entre Pago Anticipado o Reserva Exprés para tener flexibilidad al reservar. | Alta | 5 |
| **HU-13** | Como cliente, quiero recibir un código QR único tras mi reserva para poder ingresar al parqueadero. | Alta | 3 |
| **HU-14** | Como cliente, quiero cancelar mi reserva (con o sin reembolso) para no perder mi dinero si mis planes cambian. | Media | 3 |
| **HU-15** | Como cliente, quiero registrar múltiples vehículos (placas) para poder reservar con cualquiera de ellos. | Media | 2 |
| **HU-16** | Como sistema, quiero validar que un vehículo no tenga una reserva activa para evitar doble reserva. | Alta | 2 |

> **Criterio transversal de la épica:** HU-10 a HU-15 deben cumplirse en móvil y en escritorio. El mapa, los filtros y el QR no pueden depender de sensores del teléfono; en escritorio se usan con ratón y teclado, y el QR se puede ver, descargar e imprimir ([03. Alcance §2.2](./03-alcance-requerimientos.md)).

## Épica 4: Acceso y Uso (Check-in / Check-out)

| ID | Historia de Usuario | Prioridad | Estimación |
| :--- | :--- | :--- | :--- |
| **HU-17** | Como operador, quiero escanear el QR del cliente para registrar su ingreso (Check-in) y arrancar el cronómetro. | Alta | 5 |
| **HU-18** | Como sistema, quiero rechazar QRs expirados o ya usados para garantizar la seguridad del acceso. | Alta | 3 |
| **HU-19** | Como cliente, quiero ver un cronómetro en tiempo real de mi tiempo de uso para saber cuánto voy a pagar. | Alta | 2 |
| **HU-20** | Como operador, quiero registrar salidas (Check-out) y que el sistema cobre automáticamente al cliente. | Alta | 5 |
| **HU-21** | Como operador, quiero poder hacer Check-in/out manual (por placa) si el sistema o el internet fallan (contingencia). | Alta | 3 |
| **HU-26** | Como conductor, quiero poder acceder a mi cuenta y ver mi QR desde el navegador de mi computador o desde mi celular, para tener flexibilidad según el dispositivo que esté usando. | Alta | 2 |

## Épica 5: Administración y Soporte

| ID | Historia de Usuario | Prioridad | Estimación |
| :--- | :--- | :--- | :--- |
| **HU-22** | Como administrador, quiero modificar las reglas del negocio (multas, tiempos de gracia) sin afectar las reservas en curso. | Alta | 5 |
| **HU-23** | Como cliente, quiero abrir un ticket de soporte si el QR no funciona o si hay un cobro indebido. | Alta | 3 |
| **HU-24** | Como administrador, quiero gestionar los tickets escalados y resolver disputas con evidencia. | Alta | 3 |
| **HU-25** | Como operador, quiero ver reportes financieros (ingresos, multas) de mi sede para conciliar mis cuentas. | Media | 5 |

## Formato de Criterios de Aceptación (Ejemplo HU-12)
- **Dado** que estoy en la pantalla de reserva,
- **Cuando** selecciono "Reserva Exprés",
- **Entonces** el sistema me muestra un QR con un temporizador de 5 minutos.
- **Dado** que la reserva expira a los 5 minutos,
- **Cuando** el sistema evalúa el tiempo,
- **Entonces** cancela la reserva y libera el cupo.

## Formato de Criterios de Aceptación (Ejemplo HU-26)

- **Dado** que inicié sesión en el navegador de mi computador,
- **Cuando** entro a "Mis reservas",
- **Entonces** veo mi reserva activa y el QR en formato descargable, sin volver a autenticarme.
- **Dado** que abro la misma cuenta desde mi celular,
- **Cuando** toco "Ver QR",
- **Entonces** el código se muestra a pantalla completa, con un área de toque mínima de 44 × 44 px y sin depender de notificaciones push.
- **Dado** que uso un lector de pantalla o navego con teclado en escritorio,
- **Cuando** recorro la tarjeta de la reserva,
- **Entonces** el QR tiene texto alternativo con el código y el botón de descarga es alcanzable con `Tab`.
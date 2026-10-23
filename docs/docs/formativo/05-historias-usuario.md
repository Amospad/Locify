---
sidebar_position: 5
title: 05. Historias de Usuario
---

# Historias de Usuario y Mapa AS-IS / TO-BE

Este documento representa las necesidades funcionales desde la perspectiva del usuario y compara el proceso actual (AS-IS) con el proceso propuesto (TO-BE).

## 1. Estructura de las Historias
**Como** [Rol], **Quiero** [Acción], **Para** [Beneficio].

## 2. Product Backlog Principal

| ID | Historia de Usuario | Módulo | Prioridad |
|---|---|---|---|
| **HU-001** | Como usuario, quiero completar el formulario de onboarding para registrarme en el sistema. | Autenticación | Alta |
| **HU-P01** | Como operador, quiero cargar mis documentos legales para iniciar mi proceso de verificación KYB. | KYB | Alta |
| **HU-A04** | Como administrador, quiero revisar los documentos legales para aprobar o rechazar el ticket de la sede. | KYB | Alta |
| **HU-C04** | Como cliente, quiero elegir entre realizar pago anticipado o reservar sin pago, para asegurar mi celda bajo diferentes condiciones de tolerancia horaria. | Reservas | Alta |
| **HU-C05** | Como cliente, quiero que el sistema valide mi tiempo por ingreso directo mediante QR para calcular mi tarifa. | Check-in | Alta |
| **HU-P03** | Como operador, quiero ver un dashboard operativo en tiempo real para visualizar cupos totales, ocupados y disponibles. | Dashboard | Alta |

## 3. Criterios de Aceptación (Gherkin) - Ejemplos Clave

### HU-C04: Reserva Híbrida
- **Escenario 1 (Pago Anticipado):**
  - **Dado** que estoy en la pantalla de reserva,
  - **Cuando** selecciono "Pago Anticipado" y completo el pago en la pasarela,
  - **Entonces** el sistema me muestra un QR garantizado y bloquea el cupo permanentemente.
- **Escenario 2 (Reserva Exprés):**
  - **Dado** que estoy en la pantalla de reserva,
  - **Cuando** selecciono "Sin Pago",
  - **Entonces** el sistema me muestra un QR con un temporizador visible de 5 minutos.

### HU-A04: Validación Administrativa
- **Escenario 1 (Aprobación):**
  - **Dado** que reviso un ticket en estado "En Revisión",
  - **Cuando** hago clic en "Aprobar",
  - **Entonces** el sistema cambia el estado de la sede a "Activo" y la hace visible en el mapa.
- **Escenario 2 (Rechazo):**
  - **Dado** que hago clic en "Rechazar",
  - **Cuando** intento guardar sin escribir un motivo,
  - **Entonces** el sistema bloquea la acción y me exige una justificación.

## 4. Mapa AS-IS / TO-BE

**Proceso Seleccionado:** Búsqueda, Reserva, Check-in y Check-out.

| Paso | Proceso AS-IS (Actual y Manual) | Proceso TO-BE (LOCIFY Digital) |
|---|---|---|
| **1** | Búsqueda visual en la calle (dando vueltas). | Búsqueda en mapa interactivo con inventario en tiempo real. |
| **2** | Incertidumbre de disponibilidad (llegar y no encontrar cupo). | Reserva garantizada (Híbrida: Pago 100% o 5 min de tolerancia). |
| **3** | Emisión de ticket físico en papel térmico. | Generación de Código QR cifrado y dinámico. |
| **4** | Fila en taquilla presencial para pagar en efectivo. | Cobro automatizado o prepago. Check-out sin contacto. |
| **5** | Salida manual con validación del tiquete. | Validación de QR de salida y facturación digital. |
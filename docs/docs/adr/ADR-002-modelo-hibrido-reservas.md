---
sidebar_position: 2
title: ADR-002 - Modelo Híbrido de Reservas
---

# ADR-002: Implementar Modelo Híbrido de Reservas

- **Estado:** Aceptado
- **Fecha:** Junio de 2026
- **Decisores:** Andrés Mosquera, Lilia Torres, Denis Cuervo

## Contexto
Obligar al 100% de los usuarios a pagar por anticipado generaba una barrera de entrada muy alta. Los conductores querían asegurar el cupo, pero no siempre estaban dispuestos a pagar de inmediato si no conocían la sede.

## Decisión
Implementar un modelo dual:
1. **Reserva Garantizada:** Pago del 100% anticipado vía pasarela. Bloquea el cupo permanentemente.
2. **Reserva Exprés:** Sin pago inicial. Sujeta a una tolerancia estricta de 5 minutos después de la hora de entrada estipulada.

Si el conductor no llega en 5 minutos, un CRON job (worker) cancela la reserva, invalida el QR y libera el cupo.

## Alternativas consideradas
- **Solo Pago Anticipado:** Genera mucha fricción y abandono de usuarios.
- **Solo Reserva Gratis:** Genera sobreventa y bloqueo de cupos por usuarios que no llegan.

## Consecuencias
- ✅ Equilibrio entre flexibilidad para el usuario y rotación para el operador.
- ⚠️ Requiere un worker (CRON job) asíncrono muy preciso para no bloquear la API principal.
- ⚠️ Requiere reglas claras en el motor de penalidades para usuarios recurrentes que dejan caducar reservas.
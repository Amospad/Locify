---
sidebar_position: 1
title: Plan de Calidad y Pruebas
---

# Plan de Calidad y Pruebas del Ecosistema LOCIFY

## 1. Introducción
Este documento establece la estrategia de aseguramiento de la calidad (QA) y pruebas automatizadas para el ecosistema LOCIFY, garantizando que el software cumpla con los requerimientos funcionales, de seguridad y rendimiento antes de cualquier despliegue a producción.

## 2. Estrategia de Pruebas
El proyecto adopta una pirámide de pruebas estricta:
1. **Pruebas Unitarias (Vitest):** Validación de funciones puras, lógica de dominio en adaptadores y casos de uso aislados.
2. **Pruebas de Integración:** Verificación de contratos API en el backend Fastify y la correcta aplicación de políticas de seguridad en Supabase (RLS).
3. **Pruebas End-to-End (Playwright):** Simulación de flujos completos de usuario (Autenticación, Búsqueda de Parqueadero, Reserva, Check-in con QR).

## 3. Métricas y Cobertura
- **Cobertura mínima:** $\ge 80\%$ en código crítico de dominio.
- **Ejecución obligatoria:** Toda integración de código requiere pasar la suite completa de pruebas locales y el pipeline de CI/CD.

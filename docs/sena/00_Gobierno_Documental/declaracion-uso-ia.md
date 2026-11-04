---
sidebar_position: 1
title: Declaración de Uso de Inteligencia Artificial
---

# Declaración de Uso de Herramientas de Inteligencia Artificial

**Proyecto:** LOCIFY — Ecosistema Digital para la Gestión de Parqueaderos Urbanos  
**Programa:** Análisis y Desarrollo de Software (ADSO) — SENA  
**Fecha:** Noviembre 2026  

## 1. Propósito y Transparencia
En el desarrollo del proyecto LOCIFY, se han empleado herramientas de Inteligencia Artificial Generativa (en adelante, OpenCode, Agentes Autónomos y Modelos de Lenguaje de Gran Escala) como soporte de ingeniería, optimización de flujos de trabajo bajo principios de Desarrollo Guiado por Pruebas (TDD) y asistencia en la redacción documental.

El equipo de desarrollo asume la **responsabilidad total y exclusiva** sobre la autoría, veracidad, seguridad y correcta ejecución de todo el código fuente, especificaciones técnicas y documentación entregada. La IA actúa como un copiloto técnico bajo supervisión humana estricta (Human-in-the-Loop).

## 2. Ámbitos de Aplicación de la IA
Las herramientas de IA se han utilizado exclusivamente en las siguientes actividades:
1. **Generación de Esqueletos y Estructuración Documental:** Conversión de notas de arquitectura y flujos a formato Markdown estructurado según los lineamientos de la guía SENA.
2. **Refactorización y Reducción de Deuda Técnica:** Sugerencias de optimización de código TypeScript, aplicación de patrones de diseño (Arquitectura Hexagonal) y verificación de tipos estrictos.
3. **Automatización de Pruebas Unitarias:** Generación inicial de casos de prueba con Vitest y Playwright, validados y ejecutados localmente mediante la suite de verificación del proyecto.
4. **Gobierno y Trazabilidad:** Estructuración de matrices de trazabilidad y generación de scripts de sincronización documental.

## 3. Limitaciones y Restricciones
- **No se permite la toma de decisiones autónomas de negocio:** Las reglas de dominio, los cálculos tarifarios, las políticas de seguridad (Supabase RLS) y las integraciones con pasarelas de pago (Wompi) han sido diseñadas y aprobadas por el equipo humano.
- **Validación obligatoria:** Todo artefacto generado por IA pasa por un filtro estricto de compilación (pnpm build), typecheck (pnpm typecheck) y pruebas automatizadas (pnpm test). Si falla alguna verificación, el contenido es descartado o corregido manualmente.

## 4. Compromiso Ético
El uso de estas tecnologías en LOCIFY busca potenciar la productividad y garantizar estándares de calidad de nivel industrial, cumpliendo con los principios éticos de honestidad académica, transparencia y propiedad intelectual exigidos por el Servicio Nacional de Aprendizaje (SENA).

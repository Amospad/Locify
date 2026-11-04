# Constitución de LOCIFY
> Provenance: L-RULE | Versión 1.0.0 | Autor: Architect Subagent

Esta Constitución define los principios fundamentales e innegociables que rigen el desarrollo de LOCIFY. Todo colaborador, humano o agente, debe cumplir con estos preceptos para garantizar la mantenibilidad, seguridad y calidad del ecosistema.

---

## 1. Simplicidad y Reutilización (Pragmatismo)
**Principio:** Evitar la sobre-ingeniería a toda costa.
- Se priorizará el uso de servicios gestionados y librerías con alta adopción y madurez (Supabase para backend/auth, Wompi para pagos, Radix UI y Shadcn/ui para componentes).
- No se desarrollará internamente aquello que ya esté resuelto de manera eficiente por la industria, permitiendo que el esfuerzo se concentre en el valor diferencial del negocio.

## 2. Relación entre Spec y Código (SDD)
**Principio:** La especificación es la única fuente de verdad.
- Todo cambio en el código fuente debe estar precedido por un archivo `spec.md` aprobado (o la actualización de uno existente).
- El desarrollo sigue el flujo: **Especificar → Validar Spec → Implementar**.
- El código es tratado como una consecuencia técnica de la especificación; si no está en la spec, no existe en el código.

## 3. Arquitectura Hexagonal (Puntualidad de Dominio)
**Principio:** El corazón del negocio debe ser agnóstico a la tecnología.
- El núcleo de dominio (entidades, casos de uso y reglas de negocio) debe ser puro y libre de dependencias externas.
- Las tecnologías como Prisma, Supabase, Next.js o APIs de terceros se tratan como detalles de implementación que se inyectan a través de **Puertos (Interfaces)** y **Adaptadores**.
- Esto garantiza que el negocio sea testeable de forma aislada y fácil de evolucionar.

## 4. Separación de Lógica y UI
**Principio:** Desacoplamiento total entre presentación y negocio.
- **Backend (Fastify):** Es el único responsable de orquestar el dominio, las validaciones complejas y las reglas de negocio.
- **Frontend (Next.js):** Se encarga exclusivamente de la capa de presentación, la gestión del estado de la UI y la experiencia de usuario (UX).
- La comunicación entre ambos se realizará mediante contratos de API estrictamente definidos.

## 5. Política de Tests (TDD)
**Principio:** Ninguna funcionalidad está completa sin su verificación automática.
- Se adopta obligatoriamente la metodología **Test-Driven Development (TDD)** (Red -> Green -> Refactor).
- Las funcionalidades se consideran "Terminadas" (Done) solo cuando pasan los tests de unidad, integración o E2E definidos en la especificación.
- Se prohíbe explícitamente debilitar tests existentes para hacer que una build pase.

## 6. Persistencia y Seguridad (Cero Confianza)
**Principio:** Integridad de datos nativa y seguridad en profundidad.
- Se utilizará **Supabase con Row Level Security (RLS)** como primera línea de defensa para garantizar que cada usuario solo acceda a sus datos.
- Los tokens **JWT** se reservan para la autenticación y la lógica interna necesaria.
- La validación de esquemas (Zod) es obligatoria en todos los puntos de entrada de datos.

## 7. Diseño UI/UX (Estética y Ética)
**Principio:** Respeto al sistema visual y accesibilidad universal.
- Se seguirá estrictamente el sistema de diseño definido, utilizando **OKLCH** para una gestión de color moderna y el efecto **Liquid Glass** para la profundidad visual.
- La accesibilidad no es un extra: es obligatorio el soporte nativo para `prefers-reduced-motion` y el cumplimiento de las normas WCAG para navegación por teclado y lectores de pantalla.

## 8. Convención Lingüística (Dualidad Estratégica)
**Principio:** Inglés para la máquina, Español para el humano.
- **Código Fuente:** Todos los nombres de variables, funciones, clases, tablas de base de datos y comentarios técnicos se escriben en **inglés**.
- **Documentación y UI:** Todo lo que lee el usuario final o el equipo de producto (documentos `spec.md`, mensajes de error, etiquetas de interfaz, logs de negocio) se realiza en **español (es-CO)**.

---
*Fin de la Constitución. El incumplimiento de estos principios invalida cualquier contribución al repositorio.*

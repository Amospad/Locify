# LOCIFY — Documentación SENA

**Proyecto:** LOCIFY — Ecosistema Digital para la Gestión de Parqueaderos Urbanos  
**Programa:** Análisis y Desarrollo de Software ADSO — SENA  
**Estructura:** Híbrida Docusaurus → SENA

Esta carpeta contiene la entrega oficial SENA sincronizada desde `docs/docs/`.

## Navegación Rápida

### 00_Gobierno_Documental
Gobierno, ética y entrega final.
- [Declaración Uso IA](00_Gobierno_Documental/declaracion-uso-ia.md)
- [Checklist Entrega Final](00_Gobierno_Documental/entrega-final.md)

### 01_Formulacion
Formulación del proyecto, casos de uso y trazabilidad.
- [Índice Casos de Uso](01_Formulacion/00-indice-casos-uso.md)
- [Formulación y Constitución](01_Formulacion/01-formulacion-constitucion.md)
- [Stakeholders](01_Formulacion/02.stakeholders.md)
- [Alcance y Requerimientos](01_Formulacion/03-alcance-requerimientos.md)
- [Casos de Uso](01_Formulacion/04-casos-uso.md)
- [Historias de Usuario](01_Formulacion/05-historias-usuario.md)
- [Antecedentes y Justificación](01_Formulacion/06-antecedentes-justificacion.md)
- [Matriz de Trazabilidad](01_Formulacion/07-matriz-trazabilidad.md)

### 02_Diseno_Arquitectura
Arquitectura hexagonal, ADRs y guías de diseño.
- [Arquitectura Hexagonal](02_Diseno_Arquitectura/arquitectura-hexagonal.md)
- [Arquitectura Agentes](02_Diseno_Arquitectura/arquitectura-agentes.md)
- [Guía Diseño UI](02_Diseno_Arquitectura/guia-diseno-ui.md)
- [Modelo de Datos](02_Diseno_Arquitectura/modelo-datos.md)
- [ADR 001-005](02_Diseno_Arquitectura/ADR/)

### 03_Desarrollo
Flujos técnicos y desarrollo.
- [Índice Flujos](03_Desarrollo/Flujos_Tecnicos/00-indice-flujos.md)
- [Flujo 01 - Autenticación](03_Desarrollo/Flujos_Tecnicos/flujo-01-autenticacion.md)
- [Flujo 03 - Acceso y Uso](03_Desarrollo/Flujos_Tecnicos/flujo-03-acceso-uso.md)
- [Flujo 05 - Historial](03_Desarrollo/Flujos_Tecnicos/flujo-05-historial.md)
- [...] Flujos 02,04,06-14

### 04_Gestion_Proyecto
Gestión, despliegue y roadmap.
- [Gestión Interesados](04_Gestion_Proyecto/02-gestion-interesados-proyecto.md)
- [Despliegue](04_Gestion_Proyecto/despliegue.md)
- [Roadmap Sprints](04_Gestion_Proyecto/roadmap-sprints.md)

### 05_Plan_Pruebas
Calidad y pruebas.
- [Plan Calidad](05_Plan_Pruebas/plan-calidad.md)

### 06_Manuales_Usuario
Manuales de usuario final.
- [Manual Usuario](06_Manuales_Usuario/08-manual-usuario.md)
- [Manual Operador](06_Manuales_Usuario/09-manual-operador.md)
- [Manual Instalación](06_Manuales_Usuario/10-manual-instalacion.md)

### 07_Evaluacion_Cierre
Cierre del proyecto.
- [Informe Cierre](07_Evaluacion_Cierre/informe-cierre.md)

### 08_Repositorio_Proyecto
Entregables de repositorio.
- [Matriz Trazabilidad CSV](08_Repositorio_Proyecto/matriz-trazabilidad.csv)

### 09_Transversales
Especificaciones y constitución.
- [Constitución](09_Transversales/constitution/constitution.md)
- [Specs 003-008](09_Transversales/specs/)

## Sincronización

Los documentos se mantienen sincronizados desde `docs/docs/` mediante:
```bash
node scripts/sync-docs.js
node scripts/export-trazabilidad.js
```

## Estado

- ✅ Sincronización completada
- ✅ Diagramas Mermaid validados
- ✅ Checklist de entrega generado

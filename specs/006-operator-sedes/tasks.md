# Plan de Tareas: Gestión de Operadores y Sedes (006-operator-sedes)

## Resumen del Proyecto
Implementación del sistema completo de gestión de sedes de parqueaderos por parte de Operadores (administradores de sedes). Este módulo permite a los operadores crear, configurar, monitorear y gestionar múltiples sedes de forma independiente, mientras mantienen el control corporativo central.

## Objetivo Principal
- Implementar sistema completo de creación y gestión de sedes
- Desarrollar editor visual de configuración de celdas y capacidad
- Implementar monitoría en tiempo real de ocupación y métricas
- Integrar check-in/check-out manual con cálculo de tarifas
- Gestionar configuraciones operativas por sede

## Funcionalidades Clave

### 1. Registro y Configuración de Sede
- [ ] Implementar `/api/operador/sedes` para crear nueva sede
- [ ] Formulario con validación: nombre, dirección, horarios, capacidad
- [ ] Geoposición con búsqueda automática en mapa
- [ ] Validación de formato E.164 para teléfonos
- [ ] Asignación automática de operator_id de sesión

### 2. Editor Visual de Celdas
- [ ] Implementar `/api/operador/sedes/:id/celdas/configurar`
- [ ] Editor visual drag-and-drop de grilla de celdas
- [ ] Subida masiva de CSV con validación
- [ ] Tipos de vehículo predefinidos con colores
- [ ] Cálculo automático de capacidad y ocupación

### 3. Monitoría en Tiempo Real
- [ ] Implementar `/api/operador/sedes/:id/ocupacion`
- [ ] Canvas de mapa en tiempo real con color coding
- [ ] Tarjetas de métricas (total/ocupadas/disponibles)
- [ ] Gráfica de tendencia de ocupación (últimas 24h)
- [ ] Tabla de vehículos activos con tiempo transcurrido

### 4. Check-in y Check-out Manual
- [ ] Implementar `/api/operador/vehiculos/check-in`
- [ ] Validación de QR y asignación de celda
- [ ] Implementar `/api/operador/vehiculos/check-out`
- [ ] Cálculo de tarifa con recargos:
  - Base * tiempo
  - Sobretiempo: +50% por minuto extra
  - Exprés: tarifa completa si tiempo > 5 min
- [ ] Generación de recibos PDF

### 5. Gestión de Mantenimiento
- [ ] Implementar `/api/operador/celdas/:id/mantenimiento`
- [ ] Cambio de estado de celda a MANTENIMIENTO
- [ ] Notificación al cliente si asignado
- [ ] Reactivación automática tras expirar período

### 6. Reportes y Caja
- [ ] Implementar `/api/operador/sedes/:id/reportes`
- [ ] Cierre diario con filtros de fecha y sede
- [ ] Resumen de ingresos por modalidad, tipo vehículo, recargos
- [ ] Exportación PDF y CSV
- [ ] Cálculo de comisión LOCIFY (10%)

### 7. Gestión de Equipo
- [ ] Implementar `/api/operador/equipo/invitar`
- [ ] Invitación por correo con link de registro
- [ ] Gestión de roles: OPERADOR_SEDE
- [ ] Suspensión/reactivación de usuarios

### 8. Motor de Reglas
- [ ] Implementar `/api/operador/configuracion`
- [ ] Clave/valor JSON editable en tiempo real
- [ ] Cache distribuido para reglas
- [ ] Validación de tipos (string, number, boolean)

## Arquitectura de Implementación

### Componentes Frontend
- `SedeManagementPage` - Lista y creación de sedes
- `CellEditor` - Editor visual de grilla
- `OcupationDashboard` - Monitoría en tiempo real
- `CheckInOutPanel` - Check-in/checkout manual
- `MantenimientoPanel` - Gestión de mantenimiento
- `ReportesView` - Reportes y exportación

### Servicios Backend
- `SedeService` - CRUD y configuración
- `CellService` - Editor de celdas y ocupación
- `CheckInOutService` - Lógica de check-in/checkout
- `ReportService` - Reportes y cálculos
- `RuleService` - Motor de reglas
- `TeamService` - Gestión de equipo

### Base de Datos y Políticas
- Tabla `sedes` con campos de configuración
- Tabla `celdas` con estado y tipos
- Tabla `ocupacion` con historial temporal
- Tabla `operador_equipo` para roles
- Tabla `regla_negocio` para configuración
- Políticas RLS: operador puede solo gestionar sus sedes

## Diagrama de Flujo de Implementación

```
1. Operador crea sede
   ↓
2. Configura celdas (manual/CSV)
   ↓
3. Monitoría en tiempo real activada
   ↓
4. Clientes reservan y check-in/out
   ↓
5. Operador gestiona ocupación
   ↓
6. Genera reportes y cajas
```

## Dependencias Técnicas

### Backend (Node.js/TypeScript)
- Fastify con autenticación JWT
- Supabase (PostgreSQL + Realtime)
- Redis para cache de reglas
- PDF-lib para generación de recibos

### Frontend (React/Vercel)
- Next.js con App Router
- Tailwind CSS + OKLCH
- Leaflet para mapas interactivos
- Recharts para gráficas

### DevOps y CI/CD
- Vercel para despliegue
- GitHub Actions para CI
- Redis Cloud para cache
- Monitoreo con Sentry

## Criterios de Éxito

### Funcionales
- [ ] Operador puede crear sede con datos válidos
- [ ] Editor de celdas permite upload CSV
- [ ] Estado de ocupación actualiza en tiempo real
- [ ] Check-in manual registra correctamente
- [ ] Calcular tarifa con recargos aplicados
- [ ] Mantenimiento excluye celdas
- [ ] Reportes exportan PDF y CSV
- [ ] Motor de reglas aplica en caliente

### No Funcionales
- [ ] Tiempo de respuesta < 200ms para operaciones críticas
- [ ] Actualización de estado en tiempo real < 1s
- [ ] Soporta 1000+ celdas por sede
- [ ] Soporta 50+ operadores simultáneos
- [ ] Interfaces accesibles WCAG 2.1 AA
- [ ] Logging completo de auditoría

## Riesgos y Mitigaciones

### Riesgo 1: Superposición de celdas
- **Mitigación**: Validación en tiempo real, colores de feedback visual

### Riesgo 2: Cálculos de tarifa incorrectos
- **Mitigación**: Tests exhaustivos, revisión manual de reglas

### Riesgo 3: Red fallida para tiempo real
- **Mitigación**: Cache local de ocupación, reintento con backoff exponencial

### Riesgo 4: Performance con muchas celdas
- **Mitigación**: Paginar visualization, lazy load

### Riesgo 5: Mantenimiento de celdas con vehículos asignados
- **Mitigación**: Dialogos de confirmación con alternativas

## Cronograma de Implementación

### Fase 1: Core de Gestión de Sedes (3-4 días)
- Modelos de sede y celdas
- CRUD básico
- Autenticación y RBAC

### Fase 2: Editor de Celdas (2-3 días)
- Editor visual drag-and-drop
- Upload CSV
- Validaciones

### Fase 3: Monitoría en Tiempo Real (2-3 días)
- Suscripción a Supabase Realtime
- Tarjetas de métricas
- Lista de vehículos activos

### Fase 4: Check-in/Checkout (2-3 días)
- Validación de QR
- Cálculo de tarifas
- Generación de recibos

### Fase 5: Reportes y Motor de Reglas (2 días)
- Cierre de caja diario
- Configuración del motor de reglas
- Exportación de datos

### Fase 6: Optimización y Pruebas (1 día)
- Pruebas de carga y performance
- Optimización de queries
- Documentación

## Checklist de Verificación

### Funcional
- [ ] Operador puede crear sede con datos válidos
- [ ] Editor de celdas permite upload CSV
- [ ] Estado de ocupación actualiza en tiempo real
- [ ] Check-in manual registra correctamente
- [ ] Calcular tarifa con recargos aplicados
- [ ] Mantenimiento excluye celdas
- [ ] Reportes exportan PDF y CSV
- [ ] Motor de reglas aplica en caliente

### Técnico
- [ ] Autenticación JWT y RBAC implementados
- [ ] Políticas RLS aplicadas correctamente
- [ ] Queries optimizadas para gráfico de ocupación
- [ ] Cache distribuido para reglas
- [ ] Generación de recibos PDF
- [ ] Flujo completo: Sede → Celdas → Ocupación

### Calidad
- [ ] Pruebas unitarias para todos los servicios
- [ ] Pruebas de integración E2E completas
- [ ] Pruebas de performance con simulaciones
- [ ] Accesibilidad implementada
- [ ] Logging de auditoría completo
- [ ] Documentación técnica completa

## Escalabilidad y Mantenimiento

### Preparación para Escalar
- [ ] Particionamiento por sede optimizado
- [ ] Cache distribuido de ocupación
- [ ] Workers asíncronos para cálculos
- [ ] Análisis y alertas para uso de recursos

### Mantenimiento Continuo
- [ ] Monitoreo de ocupación en tiempo real
- [ ] Actualización automática de reglas de negocio
- [ formas flexibles de finalizar ||

- 

## 6. Configuración Avanzada (Motor de Reglas)

### 6.1 Management de Reglas
- **Panel de Control**: `Configuración → Motor de Reglas`
- **Claves**: `COMISION_PLATAFORMA`, `TIEMPO_TOLERANCIA_MIN`, etc.
- **Valor**: String/JSON según tipo (usar JSON para complexos)

### 6.2 Lógica de Aplicación
- **Aplicación Instantánea**: Las actualizaciones aplican en caliente (no requiere restart)
- **Cache Distribuido**: Redis TTL 5 minutos
- **Validación**: Ejemplo JSON schema para evitar valores corruptos

### 6.3 Script de Testing de Reglas
```python
# Validación de reglas de negocio
# Test 1: Colisión de horarios
# Test 2: Calificaciones de tarifas
# Test 3: Comisiones incorrectas
# Test 4: Violaciones de capacidad
```

### 6.4 Versionado de Reglas
- **Historial**: Tabla `rule_history` con `rule_id`, `value`, `changed_by`
- **Rollback**: Ruta API para restaurar versión previa
- **Documentación**: Markdown en `docs/rulemotor/`

---

## 7. Preguntas Frecuentes (FAQ Operador)

**P: ¿Puedo tener varias sedes bajo un mismo usuario?**
R: Sí. Cada sede es independiente en ocupación y reportes, pero comparten la cuenta bancaria y comisión.

**P: ¿Qué pasa si un cliente no hace check-out?**
R: El sistema detecta ocupación > horario cierre → **cierre forzado automático** a medianoche, cobra hasta hora_cierre + penalidad si configurado.

**P: ¿Cómo cambio la cuenta bancaria para pagos?**
R: Menú → **Configuración → Datos Bancarios** (requiere 2FA). Cambio aplica al siguiente cierre de caja.

**P: ¿El operador ve los datos de tarjeta del cliente?**
R: **Nunca.** Wompi tokeniza todo. Solo ves: "Tarjeta terminada en 4242", "Nequi", "PSE".

---

## 8. Contacto de Emergencia

| Situación | Contacto | SLA |
|-----------|----------|-----|
| Caída total sistema (check-in/out no funciona) | WhatsApp +57 3XX XXX XXXX / soporte@locify.co | < 15 min |
| Error de cobro duplicado | Ticket CRÍTICA en app | < 30 min |
| KYB urgente (nueva sede) | Email admin@locify.co | < 2 h hábiles |

---

*Versión: 1.0 | Noviembre 2026 | LOCIFY ADSO Ficha 3314811*
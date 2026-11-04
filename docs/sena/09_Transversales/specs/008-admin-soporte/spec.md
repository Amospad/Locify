# Especificación: Administración y Soporte - LOCIFY

## 1. Visión General
Especificación de la funcionalidad completa de administración del sistema LOCIFY y módulos de soporte al cliente. Incluye gestión de usuarios (Conductores y Operadores), control de KYB, configuración del sistema, reportes avanzados, tickets de soporte y mantenimiento del sistema. Este es el pilar de control administrativo para garantizar calidad de servicio y seguridad operativa.

---

## 2. Requisitos Funcionales

### 2.1 Autenticación y Autorización de Administradores
- **Flujo de Login**:
  1. Redirección desde sitio público a `/admin/login`
  2. Formulario: Email + Password + Token MFA (TOTP)
  3. Redirección a `/admin/dashboard` si éxito
  4. Timeout de sesión: 30 min de inactividad

- **Roles y Permisos**:
  - **SUPER_ADMIN**:
    - Gestión completa de usuarios
    - Configuración del sistema
    - Auditoría completa
    - Soporte técnico
  - **ADMIN_SEDE**:
    - Gestión de operadores de su sede
    - Reportes propios
    - Monitoría de ocupación
  - **SOPORTE**:
    - Tickets de soporte
    - Responder tickets
    - Escalación a técnico

### 2.2 Gestión de Usuarios (Conductores y Operadores)
- **Gestión de Conductores**:
  1. Panel → "Usuarios" → Filtro: "Conductores"
  2. Tabla con columnas: Email, Placa(s), Teléfono, Estado (Activo/Inactivo), Último acceso
  3. Acciones por fila:
     - **Ver**: Detalles, historial reservas, reportes
     - **Activar/Desactivar**: Suspender cuenta temporalmente
     - **Resetear Password**: Enviar email con nuevo enlace
     - **Eliminar**: Archivo suave (retener datos por compliance)

- **Gestión de Operadores**:
  1. Panel → "Operadores" → Lista paginada
  2. Columnas: Email, Sede, Estado KYB, Contacto, Fecha Registro
  3. Acciones:
     - **Editar**: Actualizar información personal
     - **Ver KYB**: Documentos, estado, comentarios
     - **Aprobar/Rechazar**: Flujo de aprobación KYB
     - **Asignar Sede**: Agregar/quitar acceso a sedes

### 2.3 Control de KYB (Know Your Business)
- **Vista de Tickets KYB**:
  1. Panel → "Verificación KYB" → Filtro por estado (Pendiente/Revision/Aprobado/Rechazado)
  2. Tarjeta por operador con:
     - Nombre del parqueadero
     - Documentos subidos (contador)
     - Tiempo en revisión (si aplica)
  3. Acciones rápidas:
     - **Revisionar**: Abrir modal con documentos, comentarios
     - **Aprobar**: Cambiar a estado `APROBADO`, activar sede automáticamente
     - **Rechazar**: Modal con motivos obligatorios, notificar operador

### 2.4 Configuración del Sistema
- **Configuración General**:
  1. Panel → "Configuración" → Pestañas:
     - **General**: Nombre empresa, contacto, dirección
     - **Pagos**: Monedas, umbrales, sobretiempo, comisiones
     - **Notificaciones**: Canales email/push, plantillas
     - **Seguridad**: Intentos de login, MFA obligatorio, retención de datos
  2. Campos editables con validación y guardado automático (debounce 2s)

- **Motor de Reglas**:
  1. Tablas de configuración:
     - `COMISION_PLATAFORMA` (0.1 - 0.3)
     - `TIEMPO_TOLERANCIA_MIN` (0 - 60)
     - `MULTIPLICADOR_SOBRETIEMPO` (1.0 - 3.0)
     - `VENTANA_CANCELACION_GRATIS_HORAS` (0 - 72)
  2. Solo SUPER_ADMIN puede editar
  3. Aplicación instantánea en caliente (no requiere reinicio)

---

## 3. Casos Límite

### 3.1 Super Admin con Mixta de Roles
- **Error**: Super Admin intenta cambiar su propio rol
- **Flujo**: Mostrar advertencia y requerir confirmación adicional (dos pasos)

### 3.2 Rechazo de KYB sin Motivo
- **Error**: Admin rechaza sin seleccionar motivo
- **Flujo**: Campo obligatorio -> mostrar alerta roja, bloqueo de envío

### 3.3 Conductor Sin Reservas Activas
- **Error**: Intentar suspender conductor que nunca tuvo reservas
- **Flujo**: Bloquear acción, mostrar advertencia, solicitar confirmación "Desactivar a pesar de no actividad"

### 3.4 Ticket de Soporte sin Asignación
- **Error**: Soporte ve ticket sin asignar por > 24 horas
- **Flujo**: Auto-escalación a canal técnico con mensaje "Ticket estancado"

---

## 4. Arquitectura de Soluciones

### 4.1 Arquitectura de Componentes
- **KYBTable**:
  - Lista paginada con estados coloreados
  - Filtros avanzados (por sede, fecha, estado)
  - Columna de acciones con tooltips

- **ConfigForm**:
  - Formulario con validaciones en tiempo real
  - Guardado automático con undo
  - Modo edición vs vista

- **UserManagement**:
  - Tabla con jerarquía de roles visual
  - Búsqueda unificada (email, nombre, placa)
  - Bulk actions (activar/desactivar, cambiar rol)

### 4.2 Arquitectura de Servicios
- **Frontend** → **Admin Gateway** → **Admin Service**
- **Admin Service** → **Supabase**:
  - `perfiles`: Usuarios extendidos con roles
  - `sedes`: Información de sedes + estado de KYB
  - `configuracion`: Clave/valor JSON
  - `auditoria`: Logs de acciones administrativas
- **Tickets de Soporte**:
  - Tabla `tickets` con estado (ABIERTO/EN_PROGRESO/CERRADO)
  - Notificaciones en tiempo real por Supabase

### 4.3 Arquitectura de Cache
- **Admin API**: Cache de 5 min para gestión de usuarios
- **Tickets**: Poll por 30 seg para cambios en tiempo real
- **Configuración**: Configuración global en memoria (no cacheada)

---

## 5. Experiencia de Usuario (UX)

### 5.1 Diseño UI (OKLCH Liquid Glass)
- **Pestañas de Admin**:
  - Hover con difuminado sutil
  - Indicador de conteo (ej: "Pendientes 15")
  - Focus visible con ring color primario
- **Tablas de Administración**:
  - Z striped con hover
  - Ordenamiento por columna
  - Resaltado de filas en hover
- **Modales de Confirmación**:
  - Diálogo modal con advertencia
  - Botones prominentes (Cancelar, Confirmar)
  - Verificación de doble paso si afecta seguridad

### 5.2 Microcopy y Mensajes
- **Estados de Cargando**: "Cargando usuarios..."
- **Estados Vacios**: "No hay operadores pendientes de KYB"
- **Estados de Error**: "No se pudo actualizar la configuración"
- **Feedback de Éxito**: "Sede activada correctamente"

---

## 6. Seguridad y Privacidad

### 6.1 Control de Acceso a Niveles
- **SUPER_ADMIN**:
  - Acceso a todas las sedes y operadores
  - Modificación de configuración del sistema
  - Acceso a logs de auditoría completos
- **ADMIN_SEDE**:
  - Solo sedes asignadas
  - Sin acceso a configuración del sistema
  - Sin modificar roles de otros administradores

### 6.2 Auditoría y Compliance
- **Logs de Auditoría**:
  - Por cada cambio de rol de usuario
  - Por cada cambio de estado KYB (A/R)
  - Por cada modificación de configuración
  - Por cada acción de soporte
- **Seguridad de Datos**:
  - Encriptación de emails para admin
  - Retención de 6 años para logs administrativos
  - Respaldo diario a encrypted storage

### 6.3 Protección contra Abuso
- **Límite de acciones**:
  - Máx 10 activaciones de cuenta por hora
  - Máx 50 cambios de rol por día por admin
  - SPF/DKIM para correos administrativos

---

## 7. Pruebas y Calidad

### 7.1 Cobertura de Pruebas
- **Componentes**:
  - KYBTable: 95% (filtro, paginación, acciones)
  - ConfigForm: 90% (validación, guardado)
  - UserManagement: 85% (bulk actions)
- **Servicios**: 80% (manejadores de error, RBAC)

### 7.2 Casos de Prueba Específicos
- **Test 1**: Gestión de usuarios: activar/desactivar
- **Test 2**: Management KYB: aprobar con documentos válidos
- **Test 3**: Rechazo KYB: validar motivo obligatorio
- **Test 4**: Configuración: edición y persistencia
- **Test 5**: Tickets de soporte: asignar y responder
- **Test 6**: Escalación de seguridad: detección de abuso

### 7.3 Criterios de Aceptación
- [ ] Super Admin puede gestionar todos los usuarios
- [ ] Admin Sede puede solo ver su sede
- [ ] Proceso de aprobación KYB incluye comentarios obligatorios
- [ ] Rechazo KYB notifica operador inmediatamente
- [ ] Configuración del sistema se guarda automáticamente
- [ ] Motor de reglas aplica en caliente
- [ ] Auditoría registra todas las acciones
- [ ] Seguridad previene: cambio de rol abusivo, acceso indebido

---

## 8. Documentación Técnica

### 8.1 Diagrama de Arquitectura
1. **Frontend** (Panel Admin):
   - UI Components → AdminContext → AdminGateway
2. **Admin Gateway**:
   - Auth → Users Service → KYB Service → Config Service
3. **Servicios**:
   - Users Service: CRUD + RBAC + logs
   - KYB Service: Aprobación/Rechazo + notificaciones
   - Config Service: Clave/valor + validación
4. **Base de Datos** (Supabase):
   - Tablas: `perfiles`, `sedes`, `configuracion`, `auditoria`
5. **Soporte**:
   - Tabla `tickets` con asignación de agentes

### 8.2 API Endpoints
```
GET /api/admin/usuarios?rol=&sede=                 # Listar usuarios filtrados
PUT /api/admin/usuarios/:id/estado               # Activar/Desactivar
PATCH /api/admin/usuarios/:id/rol                # Cambiar rol
GET /api/admin/kyb?estado=pending               # Tickets KYB
PUT /api/admin/kyb/:id/aprobar                   # Aprobar KYB
PUT /api/admin/kyb/:id/rechazar                  # Rechazar KYB
PUT /api/admin/configuracion/:clave              # Actualizar config
GET /api/admin/tickets                          # Tickets de soporte
PATCH /api/admin/tickets/:id/asignar             # Asignar agente
PATCH /api/admin/tickets/:id/responder           # Agregar respuesta
```

### 8.3 Patrones de Arquitectura
- **Event-Driven**: Por cada acción administrativa se genera evento
- **Policy Engine**: Decisiones basadas en reglas (ej: Rechazo KYB necesita motivo)
- **Command Pattern**: Para operaciones complejas con validación

---

*Versión: 1.0 | Noviembre 2026 | LOCIFY ADSO Ficha 3314811*
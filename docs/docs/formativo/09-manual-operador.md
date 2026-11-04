---
sidebar_position: 9
title: 09. Manual del Operador (Parqueadero)
---

# Manual del Operador — LOCIFY

> **Audiencia:** Dueños y administradores de sedes de parqueadero (rol `OPERADOR`).
> **Alcance:** Gestión completa de sedes, celdas, ocupación, reportes y cobros.

---

## 1. Primer Acceso y KYB (Know Your Business)

### 1.1 Registro de Operador
1. Recibe invitación por correo del administrador LOCIFY (token válido 24 h).
2. Haz clic en el enlace → completa formulario (Nombre, Correo, Contraseña segura ≥ 12 caracteres).
3. El sistema crea tu cuenta en estado `PENDIENTE`.

### 1.2 Carga de Documentos KYB
1. Inicia sesión en `operador.locify.app`.
2. Menú lateral → **Configuración → Verificación KYB**.
3. Sube los siguientes documentos (PDF/JPG/PNG, máx. 5 MB c/u):
   - **RUT** actualizado (vigencia ≤ 3 meses).
   - **Certificado Cámara de Comercio** (vigencia ≤ 3 meses).
   - **Foto fachada** del parqueadero (referencia visual).
   - **Plano de celdas** (opcional, para auto-configuración).
4. Envía para revisión. Estado: `EN_REVISION`.

> ⚠️ **Importante:** La sede **no aparecerá en el mapa público** hasta que el administrador apruebe el KYB (estado `APROBADO`).

### 1.3 Rechazo de KYB
- Si el admin rechaza, recibirás correo con **motivo detallado**.
- Corrige los documentos y reenvía desde la misma pantalla (nuevo estado `EN_REVISION`).

---

## 2. Configuración de Sede y Celdas

### 2.1 Datos Básicos de la Sede
Menú → **Sedes → Nueva Sede** (o editar existente):
| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| Nombre comercial | Sí | Ej: "LOCIFY Centro - Parqueadero La 70" |
| Dirección completa | Sí | Calle, número, barrio, ciudad |
| Coordenadas (Lat/Lng) | Sí | Click en mapa o GPS móvil |
| Horario apertura/cierre | Sí | Formato 24 h (ej: 06:00 – 22:00) |
| Teléfono de contacto | No | Visible para clientes |
| Activa | Sí | Desactiva para mantenimiento |

### 2.2 Definición de Celdas (Capacidad)
1. Dentro de la sede → pestaña **Celdas → Configurar**.
2. Usa el **editor visual de grilla** o **carga masiva CSV**:
   - Columnas CSV: `codigo, tipo_vehiculo, nivel, zona`
   - `tipo_vehiculo`: `AUTO`, `MOTO`, `BICICLETA`, `DISCAPACITADOS`
3. Guarda → el sistema calcula `capacidad_total` automáticamente.

> 💡 **Tip:** Marca celdas `DISCAPACITADOS` cerca a la entrada. El sistema las prioriza para vehículos con tarjeta de discapacidad.

---

## 3. Operación Diaria: Dashboard de Ocupación

### 3.1 Vista Principal (Tiempo Real)
Acceso: **Dashboard → Ocupación en Vivo**
- **Tarjetas resumen:** Total / Ocupadas / Disponibles / Mantenimiento / Reservadas.
- **Mapa de calor:** Celdas coloreadas (Verde=Libre, Rojo=Ocupada, Gris=Mantenimiento, Azul=Reservada).
- **Actualización:** Tiempo real vía Supabase Realtime (≤ 1 s latencia).

### 3.2 Búsqueda por Placa
1. Barra superior → **Buscar por placa** (ej: `ABC123`).
2. Resultado: Ubicación exacta (nivel, zona, código celda), hora de entrada, tiempo transcurrido, modalidad (Garantizada/Exprés).

### 3.3 Check-in Manual (Sin QR del Cliente)
Para clientes que llegan sin reserva o falla de QR:
1. Botón **Check-in Manual** (header derecho).
2. Ingresa placa → selecciona tipo vehículo → elige celda disponible sugerida.
3. Confirmar → genera registro `RESERVA` con `modalidad=EXPRES`, `estado=EN_USO`.

### 3.4 Check-out y Cobro Automático
1. En lista de ocupadas o búsqueda por placa → botón **Check-out**.
2. Sistema calcula:
   - Tiempo real transcurrido.
   - Tarifa base (configurada en Motor de Reglas).
   - **Sobretiempo** (si aplica): multiplicador 1.5× por minuto extra.
3. Si modalidad **Garantizada**: ya pagado → solo registra salida.
4. Si modalidad **Exprés**: cobro automático vía **Wompi** (tarjeta guardada o enlace de pago).
5. Comprobante PDF generado y enviado por correo/WhatsApp (configurable).

### 3.5 Celdas en Mantenimiento
1. Click en celda en mapa → **Marcar Mantenimiento**.
2. Ingresa motivo (ej: "Pintura señalización", "Sensor dañado").
3. La celda sale del pool de disponibles (no contabiliza en ocupación).
4. Para reactivar: mismo proceso → **Disponible**.

---

## 4. Reportes y Caja

### 4.1 Cierre de Caja Diario
Menú → **Reportes → Cierre de Caja** (fecha automática = hoy):
- **Ingresos totales:** Separados por modalidad (Garantizada / Exprés).
- **Penalidades cobradas:** Sobretiempo, cancelaciones tardías.
- **Comisión LOCIFY:** % configurado (default 10%) — neto a recibir.
- **Métodos de pago:** Desglose Tarjeta / Nequi / Bancolombia / PSE.
- **Exportar:** PDF (oficial) + CSV (contabilidad).

### 4.2 Reporte de Ocupación Histórica
- Filtros: Rango de fechas, sede, tipo vehículo.
- Métricas: % ocupación por hora, pico máximo, rotación celdas/hora.
- Gráficos: Barras (horas), Línea (días), Mapa de calor semanal.

### 4.3 Reporte de Vehículos Frecuentes
- Top 20 placas por frecuencia de visita.
- Útil para: Fidelización, convenios empresariales, detección de uso indebido.

---

## 5. Gestión de Usuarios de la Sede (Sub-operadores)

### 5.1 Invitar Colaborador
Menú → **Equipo → Invitar**:
1. Correo del colaborador.
2. Rol: `OPERADOR_SEDE` (puede hacer check-in/out, ver ocupación, NO configurar sede ni ver reportes financieros).
3. Envía invitación (token 24 h, igual que KYB).

### 5.2 Suspender/Reactivar
- Click en usuario → **Suspender** (motivo obligatorio).
- Usuario suspendido **no puede iniciar sesión** ni recibir notificaciones push.

---

## 6. Soporte e Incidencias

### 6.1 Crear Ticket de Soporte
Menú → **Ayuda → Nuevo Ticket**:
- Categorías: `TÉCNICO`, `FACTURACIÓN`, `KYB`, `CLIENTE`, `OTRO`.
- Prioridad: `BAJA` / `MEDIA` / `ALTA` / `CRÍTICA` (caída de sistema).
- Adjuntar capturas/logs si es técnico.

### 6.2 Seguimiento
- Vista Kanban: `ABIERTO` → `EN_PROGRESO` → `CERRADO`.
- Notificaciones push/email en cada cambio de estado.

---

## 7. Configuración Avanzada (Motor de Reglas)

> Solo visible si el admin te dio permiso `MANAGE_RULES`.

Menú → **Configuración → Motor de Reglas** (clave/valor JSON):
| Clave | Default | Descripción |
|-------|---------|-------------|
| `COMISION_PLATAFORMA` | `0.10` | 10% de cada transacción |
| `TIEMPO_TOLERANCIA_MIN` | `5` | Minutos gracia antes de cobrar sobretiempo |
| `MULTIPLICADOR_SOBRETIEMPO` | `1.5` | Factor por minuto extra |
| `TIEMPO_EXPIRACION_EXPRES_MIN` | `5` | Vida útil QR Exprés |
| `VENTANA_CANCELACION_GRATIS_HORAS` | `3` | Horas antes para cancelar sin cargo |

**Cambios se aplican en caliente** (sin reinicio) vía Supabase Realtime en tabla `REGLA_NEGOCIO`.

---

## 8. Notificaciones y Alertas

| Evento | Canal | Destinatario |
|--------|-------|--------------|
| Nueva reserva Exprés (sin check-in 3 min) | Push + Email | Operador de sede |
| Celda en mantenimiento > 24 h | Email | Operador + Admin |
| KYB aprobado/rechazado | Email + Push | Operador |
| Cierre de caja generado | Email | Operador (adjunto PDF) |
| Ticket soporte nuevo | Push | Admin LOCIFY |

Configura tus preferencias en **Perfil → Notificaciones**.

---

## 9. Preguntas Frecuentes (FAQ Operador)

**P: ¿Puedo tener varias sedes bajo un mismo usuario?**
R: Sí. Cada sede es independiente en ocupación y reportes, pero comparten la cuenta bancaria y comisión.

**P: ¿Qué pasa si un cliente no hace check-out?**
R: El sistema detecta ocupación > horario cierre → **cierre forzado automático** a medianoche, cobra hasta hora_cierre + penalidad si configurado.

**P: ¿Cómo cambio la cuenta bancaria para pagos?**
R: Menú → **Configuración → Datos Bancarios** (requiere 2FA). Cambio aplica al siguiente cierre de caja.

**P: ¿El operador ve los datos de tarjeta del cliente?**
R: **Nunca.** Wompi tokeniza todo. Solo ves: "Tarjeta terminada en 4242", "Nequi", "PSE".

---

## 10. Contacto de Emergencia

| Situación | Contacto | SLA |
|-----------|----------|-----|
| Caída total sistema (check-in/out no funciona) | WhatsApp +57 3XX XXX XXXX / soporte@locify.co | < 15 min |
| Error de cobro duplicado | Ticket CRÍTICA en app | < 30 min |
| KYB urgente (nueva sede) | Email admin@locify.co | < 2 h hábiles |

---

*Versión: 1.0 | Noviembre 2026 | LOCIFY ADSO Ficha 3314811*
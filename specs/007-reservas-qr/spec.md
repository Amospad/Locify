# Especificación: Reservas y QR - LOCIFY

## 1. Visión General
Especificación del flujo completo de reserva de parqueaderos desde la perspectiva del Cliente (Conductor). Incluye discovery de sedes, selección de modalidad (Garantizada vs Exprés), generación de QR, check-in/check-out, y gestión de reservas existentes. Este es el núcleo del valor de mercado para Conductores que buscan estacionamiento confiable y seguro.

---

## 2. Requisitos Funcionales

### 2.1 Discovery de Sedes Cercanas
- **Experiencia Principal**:
  1. App Launch → Splash screen (2s) → Login requerido
  2. Ingresar a tab "Buscar" (icono de mapa)
  3. Geoposición automática (habilita si disponible)
  4. Mostrar "SearchBar" con input tipo placa (opcional) y filtros
  5. Tarjetas "SedeCard" animadas que aparecen:
     - Imagen de fachada (si existe)
     - Nombre comercial
     - Rango de tarifa
     - Disponibilidad actual (emoji verde/amarilla/roja)
     - Rating (si existe)
  6. Scroll infinito hacia afuera → nuevas sedes cercanas (radio 5km)
  7. Click en "SedeCard" → Abrir bottom sheet con:
     - Imagen ampliada
     - Dirección completa
     - Horarios de operación
     - Botón "Reservar" destacado

### 2.2 Proceso de Reserva (Modalidad Garantizada)
- **Flujo Detallado**:
  1. En bottom sheet, click "Reservar" → Abrir modal "ReservaModal"
  2. Seleccionar modalidad:
     - **Garantizada**: Pagar ahora con método de pago
     - **Exprés**: Esperar validación en tiempo real (5 min max)
  3. Formulario condicional:
     - **Garantizada**: Formulario de pago con Wompi (tarjeta/guardada) + campos datos vehículo
     - **Exprés**: Solo datos vehículo (opcional para agilizar)
  4. Validaciones:
     - Tipo vehículo debe coincidir con celdas disponibles
     - Para Garantizada: tarjeta debe tener saldo suficiente
     - Placa única (no puede estar activa en otra sede)
  5. Enviar reserva → Estado: `CREADA`
  6. Generar QR Code único con:
     - QR: `{reserva_id}-{token}` (válido 24h)
     - URL de escaneo: `https://locify.app/qr/{reserva_id}`
     - Descarga inmediata PDF como respaldo
  7. Notificar por push: "Reserva creada exitosamente"

### 2.3 Check-in Manual (Escaneo de QR)
- **Modo Manual**:
  1. Click "Reservas" → Seleccionar reserva activa `CREADA`
  2. Click botón "Escanear QR" (icono cámara) o abrir cámara nativa
  3. Sistema escanea QR (con cámara o manual)
  4. Validar token → Si válido:
     - Cambiar estado reserva: `CREADA` → `EN_USO`
     - Registrar timestamp de entrada
     - Mostrar Toast verde: "Check-in registrado"
     - Auto-scroll a mapa (celda asignada)
  5. Si inválido/vencido: Mensaje de error con sugerencia de Check-in Manual

### 2.4 Check-out Automático y Manual
- **Check-out Automático**:
  1. Sistema detecta:
     - Cliente salió de zona de sede (GPS)
     - Hora de cierre de sede alcanzada
     - Cliente abandona mapa por > 30 min (misión)
  2. Cambiar estado reserva: `EN_USO` → `PAGADA`
  3. Calcular tarifa:
     - Tiempo transcurrido * tarifa base
     - Sobretiempo: +50% por minuto extra
     - Recargo especial (navidad, eventos)
  4. Procesar pago si no pagado en Garantizada
  5. Enviar recibo PDF + Toast

- **Check-out Manual**:
  1. Click reserva activa `EN_USO` → Botón "Finalizar"
  2. Confirmación modal con detalles de tarifa
  3. Si paga ahora: Modalidad de pago (Wompi)
  4. Si ya pagado: Confirmación directa

### 2.5 Gestión de Reservas (Historial)
- **Vista Principal**:
  1. App → Tab "Reservas" (icono historial)
  2. Lista `ReservaCard` ordenada por fecha (reciente primero)
  3. Filtros: Activas/Pasadas/Canceladas
  4. Búsqueda por placa

- **Detalle de Reserva**:
  1. Click ReservaCard → Pantalla de detalles
  2. Información mostrada:
     - Sede (nombre + dirección)
     - Fecha/Hora de reserva
     - Estado actual (QR, Pagado, Check-in, etc.)
     - Botones de acción contextuales
  3. Acciones por estado:
     - `CREADA` → "Generar QR", "Cancelar Reserva", "Ver QR"
     - `EN_USO` → "Finalizar", "Ver Mapa"
     - `PAGADA` → "Descargar Recibo", "Generar nuevo QR"
     - `CANCELADA` → Mostrar motivo, "Renovar"

### 2.6 Cancelación y Reembolso
- **Cancelación por Cliente**:
  1. Click "Cancelar Reserva" (solo si estado `CREADA`)
  2. Motivo obligatorio (opciones: Error, Lugar mejor, Otro)
  3. Confirmar → Cambiar estado a `CANCELADA`
  4. Refundear si ya pagado (15 min -> 100%, 15-60 min -> 50%, >60 min -> 0%)

- **Cancelación por Sistema**:
  1. Reserva no reclamada > 60 min (Exprés) o > 120 min (Garantizada)
  2. Cambiar a `CANCELADA` con motivo "No reclamada"
  3. Usuario notificado por push/email

---

## 3. Casos Límite

### 3.1 Geoposición No Disponible
- **Error**: GPS no habilitado o sin señal
- **Flujo**: Mostrar modal: "Habilitar geolocalización para mejores resultados"
- **Alternativa**: Búsqueda manual por dirección/calle

### 3.2 Búsqueda de Sede Vacia
- **Error**: No hay sedes en radio de búsqueda (5km)
- **Flujo**: Mostrar empty state con:
  - "Ampliar radio a 10km"
  - "Ver sedes más cercanas"
  - "Buscar en otra ciudad"

### 3.3 No Hay Celdas Disponibles
- **Error**: Sedes cercanas pero todas ocupadas
- **Flujo**: Sugerir:
  - "Reservar Exprés" (5 min sin check-in)
  - "Agregar a lista de espera"
  - "Buscar sedes abiertas"

### 3.4 Escaneo de QR Inválido
- **Error**: QR malformado, truncado, o de otra reserva
- **Flujo**: Mensaje de error + opción "Check-in Manual" (ingresar placa)

### 3.5 Sobretiempo sin Pago
- **Error**: Reserva activa > 2h sin check-out
- **Flujo**: Auto-check-out con sobretiempo (1.5x) + notificación

---

## 4. Arquitectura de Soluciones

### 4.1 Arquitectura de Componentes
- **QRDisplay**:
  - Canvas nativo para QR (web + mobile)
  - Compartir (WhatsApp/Email)
  - Descargar PDF con bordes marca

- **ReservaModal**:
  - Conditional Formulario según modalidad
  - Wizard de progreso (step número/total)
  - Validación en tiempo real de placa (API externa)

- **OcupacionMap**:
  - Leaflet/Mapbox con capas personalizables
  - Click en sede expande info (fija en pantalla)
  - Zoom y arrastre optimizado (requestAnimationFrame)

### 4.2 Arquitectura de Servicios
- **Frontend** → **Gateway** → **Reserva Service**
- **Reserva Service** → **Supabase**:
  - `reservas`: Flujo completo de reserva
  - `pagos`: Historial de pagos y reembolsos
  - `qr_codes`: Códigos generados y validaciones
  - `auditoria`: Logs de cambios de estado
- **Tiempo Real**: Notificaciones Supabase para cambios de estado

### 4.3 Arquitectura de Cache
- **Reserva Service**: Cache de QR por 10 min (evitar re-generación)
- **Frontend**: Estados de reservas por 30 seg (para UI en tiempo real)
- **QL**: Indexación por `cliente_id`, `placa`, `fecha_entrada`

---

## 5. Experiencia de Usuario (UX)

### 5.1 Diseño UI (OKLCH Liquid Glass)
- **Modales**: Glass morphism con backdrop-blur (0.3s ease)
- **Tarjetas**: Hover con elevación sutil (transform: translateY(-2px))
- **QR Code**: Contenedor con sombreado inset, borde redondeado
- **Timeline**: Línea vertical con puntos de estado conectados

### 5.2 Animaciones y Transiciones
- **Bottom Sheet**: Deslizar hacia arriba (0.3s cubic-bezier(0.2,0.8,0.2,1))
- **Modales**: Fade + scale (0.2s)
- **Tarjetas**: Stagger animation en carga (0.1s delay por índice)
- **QR**: Efecto de escaneo (movimiento de línea)

### 5.3 Microcopy y Mensajes
- **Estados de Cargando**: "Buscando sedes cercanas..."
- **Estados Vacios**: "No hay sedes disponibles en este radio"
- **Estados de Error**: "Falló el escaneo del QR. Intentar de nuevo"
- **Feedback de Éxito**: "QR generado - Puedes descargar PDF"

---

## 6. Seguridad y Privacidad

### 6.1 Validación de Permisos
- **Conductor puede**:
  - Ver solo reservas propias
  - Check-in/checkout de sus reservas
  - Cancelar antes de Check-in
- **Restricciones**:
  - No acceder a datos de otras sedes
  - No modificar detalles de reservas pagadas

### 6.2 Seguridad de QR
- **Código QR**:
  - Token único por reserva
  - Caducidad de 24h (puede renovarse)
  - Invalidación después de check-out
- **Validación**: Hash doble (SHA-256) para prevenir manipulación

### 6.3 Protección de Pagos
- **Wompi**: Tokenización de tarjetas, no guardar información sensible
- **Auditoría**: Loggear todos los intentos de pago, montos, resultados
- **Reembolsos**: Política clara de cancelación con tiempos definidos

---

## 7. Pruebas y Calidad

### 7.1 Cobertura de Pruebas
- **Componentes**:
  - ReservaModal: 95% (pruebas de flujo condicional)
  - QRDisplay: 90% (generación, descargas)
  - OcupacionMap: 85% (interacciones clic)
- **Servicios**: 80% (validaciones de negocio)

### 7.2 Casos de Prueba Específicos
- **Test 1**: Reserva Garantizada → Pago → QR
- **Test 2**: Reserva Exprés → QR inmediato sin pago
- **Test 3**: Escaneo de QR válido/inválido
- **Test 4**: Sobretiempo sin check-out
- **Test 5**: Cancelación en diferentes estados
- **Test 6**: Flujo completo: Buscar → Reservar → Check-in → Check-out

### 7.3 Criterios de Aceptación
- [ ] Conductor puede buscar sedes cercanas
- [ ] Tarjetas Sede muestran disponibilidad actual
- [ ] Modalidad Garantizada funciona con pago Wompi
- [ ] Modalidad Exprés genera QR sin pago
- [ ] Escaneo de QR registra Check-in correctamente
- [ ] Check-out automático calcula tarifas con recargos
- [ ] Lista de reservas filtra por estado y fecha
- [ ] Cancelación aplica reembolso según política
- [ ] Seguridad: JWT para validación, RLs para autorización

---

## 8. Documentación Técnica

### 8.1 Diagrama de Arquitectura
1. **Frontend** (PWA):
   - UI Components → ReserveContext (React) → API Gateway
2. **API Gateway**:
   - Auth → Reservas Service → Pagos Service
3. **Servicios**:
   - Reservas Service: CRUD + reglas de negocio
   - Pagos Service: Integración Wompi + reembolsos
   - QR Service: Generación, validación, renovación
4. **Base de Datos** (Supabase):
   - Tablas: `reservas`, `pagos`, `qr_codes`, `auditoria`
5. **Tiempo Real**: Supabase Realtime para eventos de estado

### 8.2 API Endpoints
```
GET /api/reservas?lat=&lng=&radius=5km          # Buscar sedes cercanas
POST /api/reservas                           # Crear reserva (Garantizada/Exprés)
GET /api/qr/:token                          # Validar QR
POST /api/reservas/:id/check-in              # Check-in manual
POST /api/reservas/:id/check-out             # Check-out manual
PUT /api/reservas/:id/cancelar               # Cancelar reserva
GET /api/reservas/mis-reservas               # Listar reservas del usuario
POST /api/payments/create-intent            # Crear intención de pago Wompi
```

### 8.3 Patrones de Arquitectura
- **Command Query Responsibility Segregation (CQRS)**: Leer/Writes separados
- **Event Sourcing**: Por cada cambio de estado de reserva
- **Circuit Breaker**: Protección contra fallos externos (Wompi)

---

*Versión: 1.0 | Noviembre 2026 | LOCIFY ADSO Ficha 3314811*
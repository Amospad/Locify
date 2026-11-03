# Especificación de Frontend: Flujos de Usuario - LOCIFY

## 1. Visión General
Especificación de flujos de UI para LOCIFY, SaaS PWA multi-tenant de parqueaderos en Medellín. Tres roles: Conductor, Operador, Admin. Integración con Supabase Auth/RLS, Wompi Mock y backend de Reservas/Sedes.

---

## 2. Flujo Conductor

### Vistas y Rutas
- `/buscar`: descubrimiento de sedes cercanas
- `/dashboard`: reserva activa, cronómetro, historial
- `/reservas`: historial/paginación
- `/perfil`: vehículos y datos

### Componentes clave
- `MapWidget`: mapa interactivo con pines
- `SedeCard`: tarjeta sede con precio/estado
- `SearchBar`: filtros por zona, precio
- `ReservaModal`: selección modalidad Garantizada/Exprés
- `PaymentForm`: Wompi Mock
- `QRDisplay`: QR de reserva activa
- `ReservaCard`: estado de reserva
- `VehicleList`: gestión de placas

### Estados UI
- **Loading**: Skeleton en mapa y lista de sedes
- **Empty**: *Cuando el conductor busca y no hay sedes activas en radio, el sistema debe mostrar empty state con botón ampliar radio*. *Cuando no hay reservas activas, el sistema debe mostrar empty state en dashboard.*
- **Error**: Falla de pago Wompi, sede no disponible al confirmar
- **Success**: QR generado y visible en dashboard

### Transiciones
- `/buscar` → seleccionar `SedeCard` → bottom sheet → `Reservar`
- `ReservaModal`: elegir Garantizada → `PaymentForm` Wompi → éxito → `QRDisplay` → `/dashboard`
- `ReservaModal`: elegir Exprés → generar QR inmediato → `/dashboard`

### Integración API
- `GET /api/sedes`
- `POST /api/reservas`
- `POST /api/payments/create-intent`
- `GET /api/reservas/activa`
- `GET /api/reservas/mis-reservas`
- `POST /api/reservas/:id/cancelar`

### Requisitos EARS
- *Cuando el conductor busca un parqueadero, el sistema debe mostrar las sedes activas en el mapa con pines verdes.*
- *Cuando el conductor selecciona una sede, el sistema debe abrir un bottom sheet con los detalles y el botón "Reservar".*
- *Cuando el conductor elige "Garantizada", el sistema debe mostrar el formulario de pago de Wompi antes de generar el QR.*
- *Cuando el pago Wompi es aprobado, el sistema debe generar el QR y mostrarlo en el dashboard.*

---

## 3. Flujo Operador

### Vistas y Rutas
- `/operador/dashboard`
- `/operador/kyb`
- `/operador/ocupacion`

### Componentes clave
- `OcupacionChart`: Recharts barras/líneas últimas 24h
- `VehiculosActivosTable`: tabla con placas y acciones
- `QRScanner`: modal flotante escáner
- `KYBUploadForm`: subida documentos
- `MetricCard`: métricas rápidas

### Estados UI
- **Loading**: Skeleton en chart y tabla
- **Empty**: *Cuando no hay vehículos activos, el sistema debe mostrar empty state en tabla.*
- **Error**: QR inválido o red fallida
- **Success**: Check-in/Check-out con Toast

### Transiciones
- `/operador/dashboard` → abrir `QRScanner` → escanear QR válido → registrar Check-in → vehículo aparece en `VehiculosActivosTable`
- Click Check-out → liberar cupo → actualizar chart

### Integración API
- `POST /api/operador/check-in`
- `POST /api/operador/check-out`
- `GET /api/operador/reservas-activas`
- `POST /api/kyb/subir-documentos`

### Requisitos EARS
- *Cuando el operador escanea un QR válido, el sistema debe registrar el Check-in y mostrar el vehículo en la tabla de "Vehículos Activos".*
- *Cuando el operador ejecuta Check-out, el sistema debe liberar el cupo y actualizar la ocupación en tiempo real.*

---

## 4. Flujo Admin

### Vistas y Rutas
- `/admin/dashboard`
- `/admin/kyb`
- `/admin/operadores`
- `/admin/configuracion`

### Componentes clave
- `GlobalMetrics`
- `KYBTable` con badges Aprobado/Rechazado/Pendiente
- `OperatorTable`
- `MotorReglasForm`

### Estados UI
- **Loading**: Skeleton tablas
- **Empty**: *Cuando no hay tickets KYB pendientes, el sistema debe mostrar empty state.*
- **Error**: Fallo al actualizar estado
- **Success**: Toast al aprobar/rechazar

### Transiciones
- `/admin/kyb` → ver ticket → modal documentos → Aprobar/Rechazar → tabla actualizada

### Integración API
- `GET /api/admin/kyb/pendientes`
- `PATCH /api/admin/kyb/:id/estado`
- `GET /api/admin/operadores`
- `PUT /api/admin/configuracion`

### Requisitos EARS
- *Cuando el administrador rechaza un ticket KYB, el sistema debe exigir un motivo y notificar al operador.*
- *Cuando el administrador aprueba un ticket KYB, el sistema debe cambiar el estado a Aprobado y activar la sede.*

---

## 5. Principios transversales
- Estados Loading/Empty/Error/Success en todas las vistas
- Design system OKLCH y Liquid Glass
- Accesibilidad `prefers-reduced-motion`
- Supabase RLS para datos sensibles
- Idioma UI en español es-CO

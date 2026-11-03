# Tareas de Implementación Frontend - Flujos LOCIFY

## Layout y Navegación Base

- [x] **T1. Crear estructura App Router y layouts por rol**
  - Requisito: Estructura de rutas conductor/operador/admin, spec.md §2-4
  - Hecho cuando: `app/(conductor)/layout.tsx`, `app/(operador)/layout.tsx`, `app/(admin)/layout.tsx` existen y renderizan Shell base

- [x] **T2. Navbar y BottomNav responsive**
  - Requisito: Navegación transversal
  - Hecho cuando: Navbar muestra logo, usuario y menú por rol; BottomNav visible en móvil en rutas conductor

- [x] **T3. Providers Supabase Auth y Tenant Context**
  - Requisito: Autenticación Supabase, spec.md §5
  - Hecho cuando: `AuthProvider` y `TenantProvider` montados en `app/layout.tsx` y sesión disponible en cliente

- [ ] **T4. Middleware de protección de rutas por rol**
  - Requisito: Protección rutas, spec.md §5 Supabase RLS
  - Hecho cuando: Acceso a `/operador/*` sin rol redirige a `/login`; test manual confirma

## Flujo Conductor

- [ ] **C1. Página /buscar con SearchBar y lista SedeCard**
  - Requisito: *Cuando el conductor busca un parqueadero, el sistema debe mostrar las sedes activas en el mapa con pines verdes.* spec.md línea 46
  - Hecho cuando: `/buscar` renderiza SearchBar y grid de SedeCard con datos mock de `/api/sedes`

- [ ] **C2. MapWidget interactivo con pines**
  - Requisito: Componente clave MapWidget, spec.md línea 17
  - Hecho cuando: Mapa muestra pines verdes en sedes activas y click abre bottom sheet

- [ ] **C3. Bottom sheet detalles sede con botón Reservar**
  - Requisito: *Cuando el conductor selecciona una sede, el sistema debe abrir un bottom sheet con los detalles y el botón "Reservar".* spec.md línea 47
  - Hecho cuando: Seleccionar SedeCard abre sheet con precio/estado y botón Reservar habilitado

- [ ] **C4. ReservaModal modalidad Garantizada / Exprés**
  - Requisito: Componente ReservaModal, spec.md línea 18
  - Hecho cuando: Modal permite elegir Garantizada o Exprés y pasa estado al siguiente paso

- [ ] **C5. PaymentForm Wompi Mock**
  - Requisito: *Cuando el conductor elige "Garantizada", el sistema debe mostrar el formulario de pago de Wompi antes de generar el QR.* spec.md línea 48
  - Hecho cuando: Elegir Garantizada muestra PaymentForm y submit dispara `/api/payments/create-intent`

- [ ] **C6. Manejo checkoutUrl y mock de aprobación**
  - Requisito: Integración Wompi, spec.md §2
  - Hecho cuando: Mock devuelve aprobación y app navega a dashboard con QR

- [ ] **C7. QRDisplay y Reserva activa en /dashboard**
  - Requisito: *Cuando el pago Wompi es aprobado, el sistema debe generar el QR y mostrarlo en el dashboard.* spec.md línea 49
  - Hecho cuando: `/dashboard` muestra QRDisplay cuando existe reserva activa

- [ ] **C8. Estados Loading/Empty/Error/Success conductor**
  - Requisito: Estados UI, spec.md líneas 27-30
  - Hecho cuando: Skeleton en mapa, Empty state sin sedes, Error en pago, Success QR visibles

- [ ] **C9. Historial reservas /reservas**
  - Requisito: Vista `/reservas`, spec.md línea 13
  - Hecho cuando: Página lista reservas con paginación y filtros

- [ ] **C10. Perfil vehículos VehicleList**
  - Requisito: Componente VehicleList, spec.md línea 24
  - Hecho cuando: `/perfil` permite agregar/editar placas y selección por defecto

## Flujo Operador

- [ ] **O1. Dashboard operador con MetricCard y OcupacionChart**
  - Requisito: Vistas `/operador/dashboard`, spec.md línea 56
  - Hecho cuando: Dashboard renderiza métricas rápidas y chart últimas 24h

- [ ] **O2. Tabla VehiculosActivosTable**
  - Requisito: Componente clave, spec.md línea 62
  - Hecho cuando: Tabla muestra placas activas con acciones Check-out

- [ ] **O3. QRScanner modal flotante**
  - Requisito: Componente QRScanner, spec.md línea 63
  - Hecho cuando: Botón escanear abre modal y simula escaneo de QR de prueba

- [ ] **O4. Check-in al escanear QR válido**
  - Requisito: *Cuando el operador escanea un QR válido, el sistema debe registrar el Check-in y mostrar el vehículo en la tabla.* spec.md línea 84
  - Hecho cuando: Escaneo válido llama `POST /api/operador/check-in` y fila aparece en tabla

- [ ] **O5. Check-out y actualización ocupación**
  - Requisito: *Cuando el operador ejecuta Check-out, el sistema debe liberar el cupo y actualizar la ocupación en tiempo real.* spec.md línea 85
  - Hecho cuando: Click Check-out elimina fila y chart se actualiza

- [ ] **O6. Estados Loading/Empty/Error operador**
  - Requisito: Estados UI, spec.md líneas 68-71
  - Hecho cuando: Skeleton en chart/tabla, Empty state sin vehículos, Toast éxito/error visible

- [ ] **O7. KYBUploadForm operador**
  - Requisito: Vista `/operador/kyb`, spec.md línea 57
  - Hecho cuando: Formulario permite subir documentos y envía `POST /api/kyb/subir-documentos`

## Flujo Admin

- [ ] **A1. Dashboard admin con GlobalMetrics**
  - Requisito: Vista `/admin/dashboard`, spec.md línea 92
  - Hecho cuando: Página muestra KPIs globales por tenant

- [ ] **A2. KYBTable con badges estado**
  - Requisito: Componente KYBTable, spec.md línea 99
  - Hecho cuando: Tabla lista tickets con badges Aprobado/Rechazado/Pendiente

- [ ] **A3. Modal revisión KYB aprobar/rechazar**
  - Requisito: Transición admin KYB, spec.md línea 110
  - Hecho cuando: Click ticket abre modal documentos y permite aprobar/rechazar

- [ ] **A4. Validación motivo al rechazar**
  - Requisito: *Cuando el administrador rechaza un ticket KYB, el sistema debe exigir un motivo y notificar al operador.* spec.md línea 119
  - Hecho cuando: Rechazar sin motivo bloquea acción; con motivo actualiza estado

- [ ] **A5. Activar sede al aprobar KYB**
  - Requisito: *Cuando el administrador aprueba un ticket KYB, el sistema debe cambiar el estado a Aprobado y activar la sede.* spec.md línea 120
  - Hecho cuando: Aprobar cambia estado a Aprobado y tabla se refresca

- [ ] **A6. OperatorTable y gestión operadores**
  - Requisito: Vista `/admin/operadores`, spec.md línea 94
  - Hecho cuando: Tabla lista operadores con acciones editar/deshabilitar

- [ ] **A7. Configuración MotorReglasForm**
  - Requisito: Vista `/admin/configuracion`, spec.md línea 95
  - Hecho cuando: Formulario guarda cambios vía `PUT /api/admin/configuracion`

- [ ] **A8. Estados UI admin**
  - Requisito: Estados UI, spec.md líneas 104-107
  - Hecho cuando: Skeleton tablas, Empty state sin tickets KYB, Toast éxito visible

## Testing E2E

- [ ] **E1. Configurar Playwright y fixtures Supabase**
  - Requisito: Estrategia testing E2E, plan.md §6
  - Hecho cuando: `playwright.config.ts` existe y test de login pasa en CI local

- [ ] **E2. Test E2E flujo conductor reserva Garantizada**
  - Requisito: Flujo completo conductor
  - Hecho cuando: Test Playwright navega `/buscar` → reserva → pago mock → QR visible

- [ ] **E3. Test E2E operador check-in/out**
  - Requisito: Flujo operador
  - Hecho cuando: Test escanea QR mock, verifica tabla actualizada y check-out

- [ ] **E4. Test E2E admin KYB aprobar**
  - Requisito: Flujo admin
  - Hecho cuando: Test abre ticket KYB, aprueba y verifica estado Aprobado

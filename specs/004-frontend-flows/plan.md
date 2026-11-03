# Plan de Arquitectura Frontend - Flujos LOCIFY

## 1. Estructura de carpetas Next.js App Router

```
app/
  (public)/
    buscar/page.tsx
    layout.tsx
  (auth)/
    login/page.tsx
    callback/page.tsx
  (conductor)/
    dashboard/page.tsx
    reservas/page.tsx
    perfil/page.tsx
    layout.tsx
  (operador)/
    dashboard/page.tsx
    kyb/page.tsx
    ocupacion/page.tsx
    layout.tsx
  (admin)/
    dashboard/page.tsx
    kyb/page.tsx
    operadores/page.tsx
    configuracion/page.tsx
    layout.tsx
  api/
    sedes/route.ts
    reservas/route.ts
    payments/create-intent/route.ts
    operador/check-in/route.ts
    ...
  layout.tsx
  middleware.ts

components/
  ui/               # shadcn/ui primitives
  layout/
    Navbar.tsx
    BottomNav.tsx
    Shell.tsx
  features/
    conductor/
      MapWidget.tsx
      SedeCard.tsx
      SearchBar.tsx
      ReservaModal.tsx
      PaymentForm.tsx
      QRDisplay.tsx
      ReservaCard.tsx
      VehicleList.tsx
    operador/
      OcupacionChart.tsx
      VehiculosActivosTable.tsx
      QRScanner.tsx
      KYBUploadForm.tsx
      MetricCard.tsx
    admin/
      GlobalMetrics.tsx
      KYBTable.tsx
      OperatorTable.tsx
      MotorReglasForm.tsx
  shared/
    EmptyState.tsx
    ErrorState.tsx
    Skeleton.tsx
    Toast.tsx

lib/
  supabase/
    client.ts
    server.ts
    middleware.ts
  auth/
    session.ts
    guards.ts
  wompi/
    client.ts
    mock.ts
  state/
    store.ts        # Zustand stores UI
    context/        # React Context para tenant
  api/
    client.ts
    endpoints.ts
  utils.ts

public/
  manifest.json
  icons/
styles/
  globals.css
```

**Principios**
- App Router con Server Components por defecto. Client Components solo donde se requiere interactividad.
- Grupos de rutas `(conductor)/(operador)/(admin)` para layouts y protección.
- `middleware.ts` resuelve tenant vía subdomain/header y protege rutas por rol.

## 2. Estrategia manejo de estado

- **Server Components**: Datos de sedes, reservas, métricas se cargan en servidor con `async` components + React Cache.
- **React Context**: `TenantProvider` y `AuthProvider` para sesión Supabase y tenant actual. Proveído en root layout.
- **Zustand**: Stores ligeros para estado UI cliente:
  - `useMapStore` filtros de búsqueda, radio.
  - `useReservaStore` paso de modal de reserva.
  - `useUIStore` toasts, bottom sheet abierto.
- **Server Actions / Route Handlers**: Mutaciones `POST /api/...`. Form submissions con `useActionState` donde aplica.
- **Optimistic updates**: Check-in/out operador con actualización local y revalidación `revalidatePath`.

## 3. Estrategia autenticación Supabase y protección de rutas

- **Supabase Auth**: `supabase.auth` en cliente para login/logout, `supabase.auth.getUser()` en server.
- **Middleware**:
  - Redirección `/login` si no hay sesión.
  - Validación de rol desde `user_metadata.role` o tabla `profiles`.
  - Protección por grupo: `(conductor)` requiere role `conductor`, `(operador)` role `operador`, `(admin)` role `admin`.
- **RLS**: Todas las consultas de datos pasan por Supabase con políticas RLS por `tenant_id` y rol.
- **Sesión segura**: Tokens httpOnly vía Supabase, refresh silencioso en cliente.
- **Guards de página**: Componente `RequireRole` en layouts de grupo para fallback rápido.

## 4. Integración Wompi

- **PaymentForm**: Componente client `components/features/conductor/PaymentForm.tsx` usando SDK Wompi o formulario mock.
- **Flujo Garantizada**:
  1. `POST /api/payments/create-intent` → backend crea transacción Wompi y retorna `checkoutUrl` o `publicKey`.
  2. Si modo mock: simular `checkoutUrl`/respuesta aprobada tras 2s.
  3. Éxito → `POST /api/reservas` → genera QR → muestra `QRDisplay` en `/dashboard`.
- **Manejo estados**: Loading en formulario, Error si Wompi falla, Success toast + navegación.
- **Ambientes**: `NEXT_PUBLIC_WOMPI_ENV` y `WOMPI_MOCK=true` habilita mock para pruebas E2E sin tarjeta real.

## 5. Librería UI

- **Tailwind CSS v4** con tokens OKLCH para color semántico.
- **shadcn/ui** mantenido como base. Componentes customizados con Liquid Glass:
  - Efectos `backdrop-blur`, `bg-white/10`, gradientes sutiles.
  - Tokens: `--primary`, `--glass`, `--radius`, `--shadow-soft`.
- **Accesibilidad**: `prefers-reduced-motion`, foco visible, labels ARIA.
- **Responsive**: Mobile-first, bottom sheets para modales en conductor.
- **i18n**: Español es-CO fijo en UI, textos centralizados en `lib/i18n/messages.ts`.

## 6. Estrategia testing E2E con Playwright

- **Estructura**:
  ```
  tests/
    e2e/
      conductor/
        buscar-reserva.spec.ts
        pago-wompi.spec.ts
        qr-dashboard.spec.ts
      operador/
        check-in-out.spec.ts
        kyb-upload.spec.ts
      admin/
        kyb-aprobar.spec.ts
        configuracion.spec.ts
    fixtures/
      auth.ts
      supabase-mock.ts
  ```
- **Config**: `playwright.config.ts` con proyectos `chromium`, `mobile`.
- **Auth fixture**: Login vía Supabase test user, set cookie `sb-access-token`.
- **Mocks**: `wompi` mock interceptor para `/api/payments/create-intent` devolviendo `checkoutUrl` fijo.
- **Checks**:
  - Flujo completo Conductor: buscar → reservar Garantizada → pago mock → QR visible.
  - Operador: escaneo QR → check-in → tabla actualizada → check-out.
  - Admin: KYB pendiente → aprobar → sede activada.
- **CI**: Ejecución en pipeline tras build, reporte HTML.

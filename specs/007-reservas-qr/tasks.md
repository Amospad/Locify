# Plan de Tareas: Reservas y Gestión de QR - LOCIFY (007-reservas-qr)

## Resumen del Proyecto
Implementación del sistema completo de reservas de parqueaderos y gestión de códigos QR para Conductores. Este módulo incluye discovery de sedes cercanas, creación de reservas (Garantizada vs Exprés), generación de QR, check-in/check-out, y gestión de reservas existentes. Es el núcleo del valor de mercado que conecta Conductores con sedes disponibles.

## Objetivo Principal
- Implementar flujo completo de discovery de sedes cercanas
- Desarrollar sistema de reservas con modalidades Garantizada (pago) y Exprés (sin pago)
- Generar y gestionar códigos QR únicos para cada reserva
- Implementar check-in/check-out manual y automático
- Integrar gestión de reservas (historial, cancelación, renovación)

## Funcionalidades Clave

### 1. Discovery de Sedes Cercanas
- [ ] Implementar `/api/sedes?lat=&lng=&radius=5` - Buscar sedes cercanas
- [ ] Usar Supabase Function `nearby_sedes` con filtro geo
- [ ] Calcular distancia y mostrar en km
- [ ] Mostrar estado de ocupación actual con colores
- [ ] Implementar scroll infinito hacia afuera
- [ ] Cachear resultados por 5 min

### 2. Proceso de Reserva (Modalidad Garantizada)
- [ ] Implementar `/api/reservas` - Crear reserva Garantizada
- [ ] Validar disponibilidad de celdas (tipo vehículo)
- [ ] Procesar pago vía Wompi (integración con `PaymentGateway`)
- [ ] Generar intent de pago para Wompi
- [ ] Esperar webhook de Wompi para confirmar pago
- [ ] Solo mostrar QR post-pago exitoso

### 3. Proceso de Reserva (Modalidad Exprés)
- [ ] Opción alternativa en modal `ReservaModal`
- [ ] Implementar `/api/reservas/exprés` - Reservar sin pago
- [ ] Validar solo tipo de vehículo (sin check-in inmediato)
- [ ] Generar QR inmediato con validez de 24h
- [ ] Enviar notificación push con QR
- [ ] Timeout automático si no check-in en 5 min

### 4. Validación y Escaneo de QR
- [ ] Implementar `/api/qr/:token/validate` - Validar token QR
- [ ] Generar QR único por reserva: `{reserva_id}-{uuid}`
- [ ] Implementar `/api/qr/:token/check-in` - Escaneo exitoso
- [ ] Detectar QRs inválidos, malformados o vencidos
- [ ] Control de intentos de escaneo (máx 3 por QR)

### 5. Check-in y Check-out (Manual y Automático)
- [ ] Implementar `/api/reservas/:id/check-in` - Registro manual
- [ ] Validar QR, asignar celda (auto o manual)
- [ ] Implementar `/api/reservas/:id/check-out` - Checkout manual
- [ ] Calcular tarifa con reglas de negocio:
  - Base * tiempo transcurrido
  - Sobretiempo: +50% por minuto extra
  - Exprés: tarifa completa si tiempo > 5 min
- [ ] Auto-checkout por hora de cierre
- [ ] Auto-checkout por abandono (>30 min sin actividad)

### 6. Gestión de Reservas (Historial)
- [ ] Implementar `/api/reservas/mis-reservas` - Listar reservas del usuario
- [ ] Filtrar por estado: activas, pagadas, canceladas
- [ ] Implementar `/api/reservas/:id` - Detalles de reserva específica
- [ ] Cargar QR y recibo si disponible
- [ ] Mostrar tiempo restante hasta check-in

### 7. Cancelación y Reembolso
- [ ] Implementar `/api/reservas/:id/cancelar` - Cancelar reserva
- [ ] Validar solo si estado es `CREADA`
- [ ] Calcular reembolso según política:
  - ≤15 min: 100% reembolso
  - 15-60 min: 50% reembolso
  - >60 min: 0% reembolso
- [ ] Procesar reembolso vía Wompi si pagado
- [ ] Generar recibo de cancelación

### 8. Renovación y Extensión
- [ ] Implementar `/api/reservas/:id/renovar` - Extender reserva
- [ ] Validar sin check-in previo
- [ ] Calcular nueva tarifa con recargos
- [ ] Generar nuevo QR (invalidar el anterior)

### 9. Notificaciones en Tiempo Real
- [ ] Implementar webhook de Supabase para cambios de estado
- [ ] Enviar push por cambio de estado (CREADA→EN_USO)
- [ ] Alertas por timeout de QR inválido
- [ ] Recordatorios 5 min antes de check-in Exprés

### 10. Reportes por Reserva
- [ ] Implementar `/api/reservas/:id/reportes` - Historial de actividad
- [ ] Mostrar timeline completo: creación, check-in, check-out
- [ ] Detalles de pago y reembolso
- [ ] Exportar PDF con QR y recibos

## Arquitectura de Implementación

### Componentes Frontend
- `SearchPage` - Discovery de sedes cercanas
- `SedeCard` - Tarjeta de sede con estado y precio
- `ReservaModal` - Modal de reserva con selección de modalidad
- `QRDisplay` - Visualización y gestión de QR
- `ReservaDetailPage` - Página de detalles de reserva
- `CheckInOutPanel` - Check-in/checkout manual
- `ReservaHistory` - Lista de reservas pasadas

### Servicios Backend
- `SedeService` - Búsqueda de sedes cercanas
- `ReservaService` - CRUD completo de reservas
- `QRService` - Generación y validación de QR
- `PaymentService` - Integración con Wompi
- `NotificationService` - Mensajería en tiempo real
- `ReportService` - Reportes y exports

### Base de Datos y Políticas
- Tabla `reservas` - Estado, fechas, montos
- Tabla `pagos` - Historial de pagos y reembolsos
- Tabla `qr_codes` - Códigos generados y su validez
- Tabla `auditoria_reserva` - Logs de cambios de estado
- Políticas RLS: usuarios solo acceden a sus reservas
- Índices: `cliente_id`, `placa`, `fecha_entrada`

## Diagrama de Flujo de Implementación

```
1. Conductor busca sedes cercanas
   ↓
2. Selecciona sede y elige modalidad
   ↓
3. (Garantizada) Pagos → QR
   ↓
4. (Exprés) QR inmediato sin pago
   ↓
5. Escanea QR → Check-in
   ↓
6. Uso normal del parqueadero
   ↓
7. Auto o manual check-out
   ↓
8. Gestión de historial y cancelación
```

## Dependencias Técnicas

### Backend (Node.js/TypeScript)
- Fastify con middleware JWT
- Supabase (PostgreSQL + Realtime + Functions)
- Wompi SDK para procesamiento de pagos
- QR Code Generator (qrcode.js)
- PDF-lib para recibos

### Frontend (React/Vercel)
- Next.js con App Router
- Mapbox GL JS para mapas interactivos
- React Query para gestión de estado
- QR Code Scanner (html5-qrcode)
- Tailwind CSS + OKLCH

### DevOps y CI/CD
- Vercel para despliegue PWA
- GitHub Actions para CI/CD
- Redis Cloud para cache de reservas
- Sentry para monitoreo de errores

## Criterios de Éxito

### Funcionales
- [ ] Conductores pueden buscar sedes cercanas
- [ ] Tarjetas de sedes muestran disponibilidad actual
- [ ] Modalidad Garantizada funciona con pago Wompi
- [ ] Modalidad Exprés genera QR sin pago
- [ ] Escaneo de QR registra Check-in correctamente
- [ ] Check-out automático calcula tarifas con recargos
- [ ] Lista de reservas filtra por estado y fecha
- [ ] Cancelación aplica reembolso según política

### No Funcionales
- [ ] Latencia de búsqueda de sedes < 500ms
- [ ] Estados de reserva actualizan en tiempo real
- [ ] Soporta 1000+ reservas simultáneas
- [ ] QR válido por mínimo 24h
- [ ] Interfaces accesibles WCAG 2.1 AA
- [ ] Logging de auditoría completo
- [ ] Performance bajo carga (>100 reservas/min)

## Riesgos y Mitigaciones

### Riesgo 1: Generación de QR duplicados
- **Mitigación**: UUID único por reserva, invalidar anterior

### Riesgo 2: Expiration de QR no detectada
- **Mitigación**: Validación en tiempo real, notificación de renovación

### Riesgo 3: Pagos fallidos
- **Mitigación**: Reintentos con backoff, múltiples métodos de pago

### Riesgo 4: Conflictos de check-in
- **Mitigación**: Optimistic locking, detección automática de colisión

### Riesgo 5: Escaneo de QR inválido
- **Mitigación**: Validación robusta, intentos limitados, seguridad anti-phishing

## Cronograma de Implementación

### Fase 1: Core de Discovery y Reserva (4-5 días)
- Modelos de búsqueda de sedes
- Componente de tarjeta de sede
- Flujo de creación de reserva
- Validaciones y middlewares

### Fase 2: Sistema de QR (3-4 días)
- Generación y validación de QR
- Escaneo con cámara nativa
- Gestión de intentos y rate limiting
- Validación de expira y renovación

### Fase 3: Check-in/Checkout (3-4 días)
- Lógica de check-in/checkout manual
- Cálculos automáticos de tarifas
- Auto-checkout por timeout/abandono
- Generación de recibos PDF

### Fase 4: Gestión y Reportes (2-3 días)
- Historial de reservas con filtros
- Lógica de cancelación y reembolso
- Renovación y extensión
- Exportación de reportes PDF

### Fase 5: Optimización y Pruebas (1 día)
- Pruebas de carga con simulaciones
- Optimización de queries
- Monitoreo de errores
- Documentación final

## Checklist de Verificación

### Funcional
- [ ] Conductores pueden buscar sedes cercanas
- [ ] Tarjetas de sedes muestran disponibilidad actual
- [ ] Modalidad Garantizada funciona con pago Wompi
- [ ] Modalidad Exprés genera QR sin pago
- [ ] Escaneo de QR registra Check-in correctamente
- [ ] Check-out automático calcula tarifas con recargos
- [ ] Lista de reservas filtra por estado y fecha
- [ ] Cancelación aplica reembolso según política

### Técnico
- [ ] Autenticación JWT y autorización RBAC implementados
- [ ] Políticas RLS aplicadas correctamente
- [ ] Cache distribuido para búsqueda de sedes
- [ ] Integración con Wompi implementada
- [ ] Generación de QR segura y única
- [ ] Flujo completo: Search → Reserva → QR → Check-in → Checkout

### Calidad
- [ ] Pruebas unitarias para todos los servicios
- [ ] Pruebas de integración E2E completas
- [ ] Pruebas de seguridad para QR y pagos
- [ ] Pruebas de performance con simulaciones
- [ ] Accesibilidad implementada
- [ ] Logging de auditoría completo
- [ ] Documentación técnica completa

## Escalabilidad y Mantenimiento

### Preparación para Escalar
- [ ] Base de datos optimizada para búsquedas geo
- [ ] Cache distribuido de reservas activas
- [ ] Workers asíncronos para cálculos de tarifas
- [ ] Detección de anomalías y alertas
- [ ] Balanceo de carga para picos de reservas

### Mantenimiento Continuo
- [ ] Monitoreo de intentos fallidos de check-in
- [ ] Actualización automática de detección de fraudes QR
- [ ] Revisiones periódicas de seguridad (redes, pagos)
- [ ] Optimización continua de performance

Este plan de tareas proporciona una guía detallada para implementar la especificación de Reservas y QR, asegurando una experiencia de usuario fluida, transacciones seguras y un sistema escalable para la gestión de reservas de parqueaderos.
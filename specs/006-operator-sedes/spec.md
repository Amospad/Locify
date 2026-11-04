# Especificación: Gestión de Sedes por Operador - LOCIFY

## 1. Visión General
Especificación de la gestión completa de sedes de parqueaderos por parte de Operadores (dueños de sedes). Incluye creación, configuración, ocupación, monitoría en tiempo real y gestión de celdas de vehículos. Este flujo es fundamental para la escalabilidad de LOCIFY y permite a operadores gestionar múltiples ubicaciones de forma independiente.

---

## 2. Requisitos Funcionales

### 2.1 Registro y Configuración de Sede
- **Para Operadores con KYB APROBADO**:
  1. Login en panel operador → Click "Nueva Sede" o "Agregar Sede"
  2. Formulario de datos básicos:
     - Nombre comercial (máx. 100 chars)
     - Dirección completa (Calle, número, barrio, ciudad)
     - Coordenadas (lat/lng) o permiso geolocalización móvil
     - Horarios de operación (formato 24h: HH:MM – HH:MM)
     - Teléfonos de contacto (mínimo 1)
     - Capacidad máxima (calculada desde celdas o manual)
     - Tarifas base (por hora, día, tipo vehículo)
  3. Validaciones:
     - Campos requeridos deben ser completados
     - Coordenadas deben estar dentro de Medellín (radio opcional)
     - Teléfono formato E.164 (+57)
  4. Previsualización en mapa con punto de inserción

### 2.2 Configuración de Celdas (Espacio Físico)
- **Editor Visual de Grilla**:
  1. Click en sede → Pestaña "Celdas"
  2. Click en botón "Configurar" → Abrir editor de grilla visual
  3. Opciones disponibles:
     - **Modo Manual**: Click en celdas vacías para crear
     - **Modo CSV**: Subir archivo con columnas: `codigo, tipo_vehiculo, nivel, zona, precio_base`
     - **Modo Plantilla**: Cargar plantillas predefinidas para tipos de sede
  4. Tipos de vehículo:
     - `AUTO`: Vehículo particular (carro)
     - `MOTO`: Motocicleta
     - `BICICLETA`: Bicicleta/Bicimoto
     - `DISCAPACITADOS`: Espacio preferencial
  5. Campos calculados:
     - `capacidad_total`
     - `disponibles_actual`
     - `ocupados_actual`
     - `nivel` (PISO, ZONA, etc.)

### 2.3 Gestión de Ocupación en Tiempo Real
- **Dashboard de Ocupación**:
  1. Login → Panel Operador → "Dashboard"
  2. Tarjetas resumen:
     - Total capacidad / Ocupadas / Disponibles
     - Ocupación por tipo de vehículo
     - Ingresos hoy / Meta diaria
  3. Visualización principal:
     - Mapa con celdas coloreadas (Verde=Libre, Rojo=Ocupada, Gris=Mantenimiento)
     - Gráfica de ocupación últimos 24h (lineal)
     - Lista de vehículos activos (placa, tipo, tiempo de ocupación)

### 2.4 Check-in y Check-out Manual
- **Para Operador**:
  1. Buscar vehículo por placa (barra de búsqueda superior)
  2. Seleccionar vehículo de la lista (o escanear QR del cliente)
  3. Click "Check-in" → Ingresar celda manual (opcional)
  4. Sistema registra:
     - Timestamp de entrada
     - Celda asignada (auto o manual)
     - Tiempo transcurrido para cálculo de tarifa
  5. Check-out:
     - Click "Check-out" → Calcular tarifa basada en tarifas
     - Aplicar recargos (sobretiempo, modo exprés)
     - Generar recibo con QR de descarga

### 2.5 Modo Mantenimiento de Celdas
- **Para Operador**:
  1. Click en celda en mapa → "Marcar Mantenimiento"
  2. Ingresar motivo (opcional, máximo 255 chars)
  3. Seleccionar fecha de fin (opcional, por defecto indefinido)
  4. Celda sale del pool de disponibles
  5. Notificar automáticamente al cliente (si está asignado) via push/email

### 2.6 Reportes y Caja
- **Cierre de Caja Diario**:
  1. Menú → "Reportes" → "Cierre de Caja"
  2. Filtros: Fecha, Celdas (opcional)
  3. Resumen de ingresos:
     - Por modalidad (Garantizada/Exprés)
     - Por tipo de vehículo
     - Recargos (sobretiempo, etc.)
     - Comisiones LOCIFY
     - Métodos de pago (Tarjeta, Nequi, Bancolombia, PSE)
  4. Exportar:
     - PDF para soporte legal
     - CSV para contabilidad

---

## 3. Casos Límite

### 3.1 Sobresuscripción de Sede
- **Error**: No hay celdas libres o tipo de vehículo no disponible
- **Flujo**: Mostrar mensaje con opciones:
  - "Ampliar radio de búsqueda" (buscar en sedes cercanas)
  - "Reservar Exprés" (sin check-in inmediato)
  - "Esperar lista" (notificar cuando celda se libere)

### 3.2 Check-in con QR Inválido
- **Error**: QR no legible o vencido (> 5 min para Exprés)
- **Flujo**: Auto-registrar Check-in Manual con aviso "QR inválido"
- **Alerta**: Notificar al cliente por medio de su app

### 3.3 Cambio de Estado de Celda a Mantenimiento
- **Error**: Si celda en mantenimiento tiene vehículo asignado
- **Flujo**: Mostrar diálogo de confirmación con posibles acciones:
  - "Liberar vehículo ahora"
  - "Posponer mantenimiento"
  - "Ignorar"

### 3.4 Oficina de Operador Sin Celdas Configuradas
- **Error**: Nueva sede sin celdas asignadas después de 24h
- **Flujo**: Auto-configurar con plantillas predefinidas:
  - AUTO: 10 celdas
  - MOTO: 5 celdas  
  - BICICLETA: 3 celdas
  - DISCAPACITADOS: 1 celda

---

## 4. Arquitectura de Soluciones

### 4.1 Diseños de Componentes
- **MapWidget**:
  - Re-renderiza al cambiar estado de celdas (React Hook)
  - Click en celda abre bottom sheet con detalles
  - Dbx para drawing personalizado de celdas

- **OcupacionChart**:
  - Recharts con modo oscuro
  - Zoom en timeline (último día/semanas)
  - Animación de tendencias de ocupación

- **VehiculosActivosTable**:
  - Columna de acciones: Check-in, Check-out, QR
  - Filtro por tipo de vehículo
  - Ordenamiento por tiempo de ocupación

### 4.2 Integración de Servicios
- **Frontend** → **API Gateway** → **Operador Service**
- **Operador Service** → **Supabase**:
  - Tabla `sedes`: información de sede
  - Tabla `celdas`: espacio físico con estado
  - Tabla `vehiculos`: vehículos activos
  - Tabla `ocupacion`: histórico de ocupación
- **Tiempo Real**: Supabase Realtime para actualizaciones de estado

### 4.3 Estrategia de Cache
- **Frontend**: Cache de estados de celdas por 30 segundos
- **API**: Cache de gráficos de ocupación por 5 minutos
- **QL**: Queries optimizadas para filtro por `sede_id`

---

## 5. Experiencia de Usuario (UX)

### 5.1 Diseño UI (OKLCH Liquid Glass)
- **Paleta de Colores**:
  - Énfasis verde para celdas disponibles
  - Advertencia roja para celdas ocupadas
  - Secundario azul para mantenimiento
- **Spacings**: Tailwind con 8px base, escalable
- **Tipografía**: Inter + variable font para métricas
- **Sombra y Difuminado**: Efectos Glass-morphism en overlays

### 5.2 Iconografía y Símbolos
- **Lucide React**: Iconos interactivos en celdas
- **Símbolos personalizados**: QR, Check-in, Check-out
- **Animaciones**: Swipe en bottom sheets, pulse en nuevas notificaciones

### 5.3 Accesibilidad (WCAG 2.1 AA)
- **Enfoque teclado**: Tab, flechas, Enter, Escape
- **Lector de pantalla**: Semántica ARIA en todos los componentes
- **Reduced Motion**: Desactiva animaciones si `prefers-reduced-motion`
- **Contrast**: Mínimo 4.5:1 para texto sobre fondo

---

## 6. Seguridad y Privacidad

### 6.1 Control de Acceso a Niveles
- **RBAC por Sede**:
  - Operador puede solo gestionar sedes bajo su cuenta
  - Suscriptor puede asignar sub-operadores (con menos permisos)
  - Cliente puede solo ver reservas propias (celdas ocultas)

### 6.2 Auditoría y Seguros
- **Logs de Auditoría**:
  - Cambios en estado de celdas (LIBRE → OCUPADA)
  - Check-in/out manual por operador
  - Configuración de mantenimiento
  - Exportación de reportes
- **Encriptación**: TLS 1.3 en tránsito, AES-256 en reposo
- **Retención de Datos**: 7 años para logs, 3 años para documentos KYB

### 6.3 Control de Integridad
- **Validación de Datos**:
  - Precios positivos, horarios válidos
  - Capacidad máxima <= 500 (política empresarial)
  - Celdas no duplicadas en misma sede

---

## 7. Pruebas y Calidad

### 7.1 Cobertura de Pruebas
- **Componentes**:
  - MapWidget: 90% (simulado con @testing-library/react)
  - VehiculosActivosTable: 85% (ordenamiento, filtrado)
  - OcupacionChart: 95% (diseño responsive)
- **Servicios**: 80% (manejadores de error)

### 7.2 Casos de Prueba Específicos
- **Test 1**: Configuración de celdas (manual → grilla visual)
- **Test 2**: Ocupación temporal (check-in/out calculado correctamente)
- **Test 3**: Reporte de caja (validación de comisiones)
- **Test 4**: Mantenimiento de celdas (retirada de vehículos asignados)
- **Test 5**: Gestión de errores (QR inválido, red offline)

### 7.3 Criterios de Aceptación
- [ ] Operador puede crear sede con datos válidos
- [ ] Editor de celdas permite upload CSV
- [ ] Estado de ocupación actualiza en tiempo real
- [ ] Check-in manual registra correctamente
- [ ] Calcular tarifa con recargos aplicados
- [ ] Mantenimiento excluye celdas
- [ ] Reportes exportan PDF y CSV
- [ ] Seguridad prevé: CRUD por sede, logs de auditoría

---

## 8. Documentación Técnica

### 8.1 Diagrama de Flujo
1. Usuario → Configuración de Sede (Formularios + Geoposición)
2. Editor de Grilla → Celdas creadas (estado LIBRE)
3. Dashboard → Visualización de Ocupación (Realtime)
4. Check-in/Out Manual → Logs y cálculos
5. Caja → Reportes y exportación

### 8.2 API Endpoints
```
GET /api/operador/sedes                    # Listar sedes del operador
POST /api/operador/sedes                   # Crear sede
PUT /api/operador/sedes/:id                # Actualizar sede
DELETE /api/operador/sedes/:id             # Eliminar sede
POST /api/operador/sedes/:id/celdas       # Configurar celdas
GET /api/operador/sedes/:id/ocupacion      # Ocupación en tiempo real
POST /api/operador/vehiculos/check-in      # Check-in manual
POST /api/operador/vehiculos/check-out     # Check-out manual
GET /api/operador/sedes/:id/reportes       # Reportes de caja
```

### 8.3 Patrones de Arquitectura
- **Event Sourcing**: Por cada cambio de estado se registra evento
- **CQRS**: Queries optimizadas para dashboard
- **Command Pattern**: Operaciones atómicas (Check-in + cálculo de tarifa)

---

## 9. Escalabilidad y Rendimiento

### 9.1 Optimización de Base de Datos
- **Indices**:
  - `sedes.operator_id`
  - `celdas.sede_id`
  - `celdas.estado`
  - `ocupacion.sede_id`
  - `ocupacion.fecha_entrada`

### 9.2 Límite de Concurrencia
- **Lotes de Updates**: Máximo 50 celdas por operación
- **Versionamiento de Optimista**: Detecta sobrescritura en edits concurrentes
- **Colas de Trabajo**: Procesamiento asíncrono de reportes

### 9.3 Overhead de Memoria
- **React Memo**: Componentes de celda memoizados por ID
- **Virtualización de Listas**: Tabla de vehículos solo renderiza visibles
- **Debounce**: Búsqueda por placa (300ms)

---

*Versión: 1.0 | Noviembre 2026 | LOCIFY ADSO Ficha 3314811*
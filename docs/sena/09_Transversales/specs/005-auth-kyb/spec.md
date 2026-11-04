# Especificación: Autenticación y KYB (Know Your Business) - LOCIFY

## 1. Visión General
Especificación del flujo de onboarding completo para nuevos Usuarios (Conductores) y Operadores (administradores de sedes), incluyendo registro, verificación KYC/KYB, invitaciones y activación de cuentas. Este es el pilar fundamental para la seguridad y cumplimiento normativo de LOCIFY en Colombia.

---

## 2. Requisitos Funcionales

### 2.1 Registro de Usuario (Conductor)
- **Flujo Completo**:
  1. Ingresar a `locify.app` → Click "Registrarse"
  2. Completar formulario: Nombre completo, Email, Password (≥ 12 caracteres), Número celular
  3. Aceptar términos: Política de Tratamiento de Datos (Ley 1581), Términos de Servicio, Mapa de Procesamiento de Datos
  4. Recibir código de verificación OTP al celular/email
  5. Verificar código → Cuenta creada → Estado `INCOMPLETO` (pendiente de KYB para operadores)

### 2.2 Flujo de Invitación y Registro de Operador
- **Para nuevos Operadores**:
  1. Admin actual envía invitación por correo con enlace de registro
  2. Invitado completa mismo formulario de registro
  3. Recibir OTP → Verificar → Cuenta en estado `PENDIENTE_KYB`
  4. Operador debe completar verificación KYB antes de acceder a panel

### 2.3 Flujo KYB (Know Your Business)
- **Documentos Requeridos**:
  - RUT (Registro Único Tributario) actualizado (vigencia ≤ 3 meses)
  - Certificado Cámara de Comercio (vigencia ≤ 3 meses)
  - Foto fachada del parqueadero
  - Plano de celdas (opcional, para auto-configuración)

- **Proceso**:
  1. Login → Menú `Configuración → Verificación KYB`
  2. Subir documentos (PDF/JPG/PNG, máximo 5MB cada uno)
  3. Sistema procesa manualmente en ≤ 48 horas hábiles
  4. Notificar por email: APROBADO/RECHAZADO con detalles

### 2.4 Activación de Sede
- **Post-APROBADO**:
  1. Estado `APROBADO` → botón `Activar Sede`
  2. Ingresar nombre comercial, dirección, horarios, capacidad
  3. Geoposición opcional (click en mapa)
  4. Confirmar → sede visible en mapa público → estado `ACTIVA`

### 2.5 Login y Sesión Segura
- **Autenticación**:
  - JWT Bearer para API (sin cookies httpOnly para API externa)
  - Refresh tokens para frontend PWA
  - 2FA opcional: OTP por WhatsApp/SMS
  - GDPR/European Privacy Shield compliant

---

## 3. Casos Límite

### 3.1 Documentos KYB Rejechados
- **Error**: Formato incorrecto, ilegibles, no coinciden con RUT
- **Flujo**: Mostrar motivo específico, permitir reintento desde misma pantalla
- **Límite de reintentos**: 3 por solicitud (después suspender automáticamente)

### 3.2 Invitación Expirada o Inválida
- **Error**: Token inválido, usado previamente, o expirado (> 24 horas)
- **Flujo**: Mostrar mensaje con opción "Reenviar invitación"
- **Auditoría**: Loggear intento fallido para análisis de seguridad

### 3.3 Email de Verificación Duplicado
- **Error**: Usuario ya registrado con mismo email
- **Flujo**: Redirigir a login con mensaje "Email ya registrado"
- **Soporte**: Opción "¿Olvidó su contraseña?" para reset

---

## 4. Seguridad y Cumplimiento

### 4.1 Validación KYC/KYB
- **KYC (Usuario)**: Verificar identidad mediante OTP y datos básicos
- **KYB (Operador)**: Validar documentos legales Colombianos mediante:
  - OCR de texto en documentos para extraer RUC/Código de negocio
  - Validación de vigencia mediante fecha de emisión
  - Comparación visual con templates autorizados

### 4.2 Control de Acceso Basado en Roles (RBAC)
- **Roles Disponibles**:
  - `CONDUCTOR`: Reserva y uso de parqueadero
  - `OPERADOR_SEDE`: Gestión sede, check-in/out, reportes
  - `OPERADOR`: Full admin sede + KYB
  - `ADMIN`: Superusuario, gestión de operadores, configuración global

### 4.3 Logging de Seguridad
- **Eventos Críticos**:
  - Intentos fallidos de login (> 5 en 15 min)
  - Cambios de estado de documento KYB (PENDIENTE → APROBADO/RECHAZADO)
  - Activación/desactivación de sedes
  - Upload de documentos

---

## 5. Integración Técnica

### 5.1 Arquitectura
- **Autenticación**: Supabase Auth (JWT) con RLS basado en roles
- **Document Store**: Almacenamiento seguro de PDFs en S3/GCS con cifrado en tránsito
- **Validación**: Schema validation con Zod para todos los endpoints

### 5.2 API Endpoints
```
POST /api/auth/register                    # Registro usuario/operador
POST /api/auth/login                      # Autenticación
POST /api/auth/verify-otp                # Verificación OTP
POST /api/kyb/upload                     # Subida documentos KYB
GET /api/kyb/status/:operatorId          # Estado verificación
PUT /api/kyb/:id/aprobar                 # Aprobar KYB
PUT /api/kyb/:id/rechazar                # Rechazar KYB
POST /api/operators/invitacion           # Enviar invitación
```

### 5.3 Dependencias Externas
- **Validación de Documentos**: OCR (Azure/AWS Textract) para extracción automática
- **Verificación de RUT**: API DIAN para validación en tiempo real
- **Trazabilidad**: Audit logs a Elasticsearch

---

## 6. Experiencia de Usuario (UX)

### 6.1 Progreso Visual
- Wizard de 4 pasos: Datos → Documentos → Confirmación → Verificación
- Indicadore de estado en cada paso (activo/completado/pendiente)
- Timeline de verificación con tiempos estimados

### 6.2 Mensajería y Notificaciones
- **Email**: Bienvenida, verificación OTP, KYB aprobado/rechazado
- **Push**: Alertas de cambio de estado en tiempo real
- **In-App**: Banner informativo sobre progreso KYB

### 6.3 Retroalimentación de Error
- **Formatear**: "El RUT debe estar en formato XX.XXX.XXX-X"
- **Expiración**: "El RUT está vencido, por favor suba uno nuevo"
- **No Coincide**: "El nombre en el certificado no coincide con el RUT"

---

## 7. Pruebas y Calidad

### 7.1 Cobertura de Pruebas
- **Unitarias**: Validación de esquemas, servicios de dominio
- **Integración**: Flujos completos de registro KYB
- **End-to-End**: Escenarios completos usuario a operador

### 7.2 Casos de Prueba de Borde
- **Archivo > 5MB** → Mensaje de error antes de subida
- **Formato inválido** (PNG en vez de PDF) → Rechazo inmediato con sugerencia
- **Token OTP inválido** → Reintento (máximo 3) + re-enviar

### 7.3 Criterios de Aceptación
- [ ] Usuarios pueden registrarse con email y contraseña válidos
- [ ] Invitaciones funcionan con token único por correo
- [ ] Documentos KYB se almacenan encriptados
- [ ] Estados de verificación se reflejan en UI en tiempo real
- [ ] Rechazo KYB muestra motivo específico para corrección
- [ ] Operador no puede acceder hasta KYB aprobado
- [ ] Todas las acciones de seguridad están loggeadas

---

## 8. Documentación y Guía de Implementación

### 8.1 Flujo Técnico
1. Frontend PWA → API Gateway → Auth Service
2. Auth Service → Supabase Auth (crear usuario)
3. API Gateway → KYB Service (verificación documentos)
4. Supabase Auth → JWT a cliente
5. Frontend almacena JWT, refresh tokens

### 8.2 Aviso Legal
- **Compromiso**: "Todas las verificaciones KYB se realizan bajo normativas Colombianas (Ley 1581, Decreto 1377 de 2013)"
- **Almacenamiento**: Documentos se guardan en almacen seguro con retención mínima de 5 años
- **Transparencia**: Política de datos explícita en español es-CO

---

## 9. Mantenimiento y Evolución

### 9.1 Monitoreo
- **Métricas**: Tasa de aprobación KYB, tiempo de procesamiento, intentos fallidos
- **Alertas**: Tickets KYB pendientes > 72h, rechazos > 30% en semana

### 9.2 Capacidades Futuras
- **Verificación automática**: Integración con API DIAN para validación RUT en tiempo real
- **Biometría**: Validación facial para Conductores (opcional)
- **Inteligencia**: Machine learning para detectar documentos falsificados

---

*Versión: 1.0 | Noviembre 2026 | LOCIFY ADSO Ficha 3314811*
---
sidebar_position: 3
title: 03. Alcance y Requerimientos
---

# Documento de Alcance y Requerimientos — LOCIFY

Este documento establece la línea base técnica del proyecto, definiendo qué se va a construir y bajo qué estándares de calidad.

## 1. Alcance General

### 1.1 Sí incluye
- Registro y verificación legal de operadores mediante Onboarding (KYB).
- App del Cliente multiplataforma: una sola base de código **mobile-first** que se usa desde el celular y desde el navegador de escritorio, instalable como PWA sin pasar por las tiendas de aplicaciones en esta fase.
- Búsqueda de parqueaderos por ubicación con mapa interactivo y disponibilidad en tiempo real.
- Sistema de reservas bajo un modelo híbrido (Garantizada con pago anticipado o Exprés sujeta a 5 minutos de tolerancia).
- Check-in/Check-out mediante códigos QR dinámicos.
- Panel de administración global para auditoría y motor de reglas.

### 1.2 No incluye (Exclusiones)
- Administración del espacio físico ni control automatizado de hardware (talanqueras).
- Sistemas automáticos de reconocimiento de placas por cámaras (LPR).
- Servicios adicionales para vehículos (lavado, mecánica, etc.).

---

## 2. Requerimientos Funcionales (RF)

Los requerimientos funcionales describen el comportamiento obligatorio del sistema.

### 2.1 Módulo de Onboarding Universal
- **RF-01 (Registro):** El sistema debe permitir que cualquier usuario complete un formulario capturando campos mínimos según su rol. *(Prioridad: Alta)*
- **RF-02 (Validación Estricta):** Validar formato de correo y llenado obligatorio antes de persistir. *(Prioridad: Alta)*
- **RF-03 (Token de Invitación):** Al registrar operadores/admins, generar invitación con token de expiración de 24 horas. *(Prioridad: Alta)*
- **RF-04 (Correo Automatizado):** Despachar correo con enlace único de activación. *(Prioridad: Alta)*
- **RF-05 (Validación Temporal):** Validar en tiempo real que el token no haya expirado ni sido usado. *(Prioridad: Alta)*
- **RF-06 (Creación de Contraseña):** Obligar al usuario a definir contraseña segura bajo políticas de complejidad. *(Prioridad: Alta)*
- **RF-07 (Activación):** Almacenar contraseña cifrada, cambiar estado a "Activo" y habilitar login. *(Prioridad: Alta)*
- **RF-08 (Restricción de Acceso):** Bloquear acceso a dashboards si la cuenta no está activa o está suspendida. *(Prioridad: Alta)*

### 2.2 App del Cliente (Ecosistema Web/Móvil)

**Plataforma objetivo:** la App del Cliente es una **PWA** (*Progressive Web App*) construida con un único código fuente *mobile-first* (Next.js/React, o app híbrida React Native / Expo Web si se requiere acceso a hardware nativo). Es la misma aplicación en todos los dispositivos; no existe una "versión web reducida".

| Entorno | Soporte mínimo | Instalación |
| :--- | :--- | :--- |
| **Móvil** | iOS Safari 16.4+ · Android Chrome 110+ | "Añadir a pantalla de inicio" desde el navegador (sin App Store ni Play Store en esta fase) |
| **Escritorio** | Chrome, Edge y Firefox actuales · Safari 16.4+ | Uso directo en el navegador; ventana instalable en Chrome/Edge |

La sesión es la misma en ambos entornos (cookie `httpOnly` emitida por el backend), de modo que un conductor puede reservar en el computador y abrir el QR en el celular sin volver a autenticarse.

**Aclaraciones por requerimiento** (los RF que podrían leerse como exclusivos de móvil):

| RF | Supuesto móvil | Comportamiento en escritorio / navegador |
| :--- | :--- | :--- |
| **RF-09 / RF-10** | Dashboard y cronómetro en pantalla de teléfono | Misma información en una columna en móvil y en dos columnas desde 1024 px; el cronómetro se actualiza igual (no depende de notificaciones) |
| **RF-13 / RF-19** | Pago y cobro desde la app | Misma pasarela; en escritorio la autenticación 3-D Secure abre en una pestaña, en móvil en el navegador del sistema |
| **RF-15** | QR en pantalla para mostrar en la talanquera | QR renderizado como SVG, visible a pantalla completa y descargable/imprimible en A4 desde escritorio |
| **RF-18** | Escaneo del QR con la cámara | La cámara es una comodidad, no un requisito: el operador puede escribir el código en el dashboard (RF-27) |
| **RF-20 / RF-21** | Gestión de placas e historial | Mismas pantallas; en escritorio el historial usa tabla, en móvil tarjetas apiladas |
| **RF-22** | Evidencias con la cámara | Selector de archivos en escritorio y cámara en móvil (mismo `input[type=file][accept=image/*]`) |

**Notificaciones:** todavía no existe un RF que las exija. Cuando se implementen (aviso de vencimiento de una reserva exprés y de fin de tiempo de uso), el canal será **Web Push** con *Service Worker* y claves VAPID, complementado con correo electrónico. iOS 16.4+ sólo soporta Web Push en PWA instalada en la pantalla de inicio; en escritorio funciona en Chrome, Edge y Firefox. Si el usuario no concede el permiso, el aviso sigue visible dentro de la app (RF-10) y por correo.

- **RF-09 (Dashboard Dinámico):** Mostrar si el cliente tiene reserva activa o check-in en curso. *(Prioridad: Alta)*
- **RF-10 (Cronómetro):** Renderizar contador en tiempo real de horas/minutos desde el check-in. *(Prioridad: Alta)*
- **RF-11 (Mapa Interactivo):** Mostrar ubicación geográfica real de sedes disponibles. *(Prioridad: Alta)*
- **RF-12 (Filtros):** Filtrar por precio, horario, tipo de vehículo y disponibilidad. *(Prioridad: Media)*
- **RF-13 (Cálculo Anticipado):** Calcular y mostrar valor estimado antes del pago. *(Prioridad: Alta)*
- **RF-14 (Modelo Híbrido):** Permitir elegir entre "Reserva Garantizada" (pago 100%) o "Reserva Exprés" (sin pago, con caducidad). *(Prioridad: Alta)*
- **RF-15 (Generación QR):** Emitir QR único. Si es exprés, asignar temporizador de caducidad de 5 min. *(Prioridad: Alta)*
- **RF-16 (Cancelación):** Permitir cancelar gratis en los primeros 5 min o con 30 min de antelación. *(Prioridad: Alta)*
- **RF-17 (Abono):** Recalcular tarifa y abonar créditos si el uso real fue menor al reservado. *(Prioridad: Media)*
- **RF-18 (Validación QR):** Validar vigencia al escanear. Si es exprés y excede 5 min, cancelar y liberar cupo. *(Prioridad: Alta)*
- **RF-19 (Cobro Automático):** Ejecutar cobro al registrar check-out. *(Prioridad: Alta)*
- **RF-20 (Multi-Placa):** Registrar, modificar o inactivar placas vehiculares asociadas. *(Prioridad: Alta)*
- **RF-21 (Historial):** Listar histórico con fechas, horas, estados y desgloses económicos. *(Prioridad: Media)*
- **RF-22 (Soporte):** Permitir crear tickets de soporte con evidencias multimedia. *(Prioridad: Alta)*

### 2.3 App Parqueadero (Operador)
- **RF-23 (Carga KYB):** Exigir documentos jurídicos y fotos de sede, generando Ticket "En Revisión". *(Prioridad: Alta)*
- **RF-24 (Bloqueo por KYB):** Bloquear visibilidad en mapa y recepción de reservas hasta aprobación del Ticket. *(Prioridad: Alta)*
- **RF-25 (Parametrización):** Dar de alta sedes registrando capacidad, cupos por vehículo y fotos. *(Prioridad: Alta)*
- **RF-26 (Dashboard Ocupación):** Mostrar cupos totales, ocupados, disponibles y alertas de sobretiempo. *(Prioridad: Alta)*
- **RF-27 (Control Manual):** Buscar vehículos por placa, validar QR y registrar entradas/salidas manuales. *(Prioridad: Alta)*
- **RF-28 (Reportes):** Generar reportes de ingresos, penalidades y cierres de caja. *(Prioridad: Alta)*

### 2.4 App Admin
- **RF-29 (Auditoría KYB):** Visualizar tickets pendientes, auditar documentos y aprobar/rechazar. *(Prioridad: Alta)*
- **RF-30 (Disputas):** Proveer vista de casos escalados con línea de tiempo y evidencias. *(Prioridad: Alta)*
- **RF-31 (Motor de Reglas):** Reconfigurar porcentajes de penalidades, minutos de gracia y tarifas base. *(Prioridad: Alta)*
- **RF-32 (RBAC):** Crear personal interno y asignar permisos por roles (Superadmin, Financiero, Soporte). *(Prioridad: Alta)*
- **RF-33 (Moderación):** Suspender y reactivar la cuenta de un operador con motivo obligatorio; al suspender, la sede deja de aparecer en el mapa y el operador pierde el acceso (coherente con RF-08 y RF-24). Derivado de HU-A08. *(Prioridad: Alta)*
- **RF-34 (Métricas Globales):** Dashboard administrativo con reservas totales, ingresos por ciudad y tasa de disputas, con rango de fechas y sobre datos **agregados** que no exponen datos personales (RNF-03); las consultas pesadas se sirven de una réplica de lectura (RNF-10). Derivado de HU-A10. *(Prioridad: Media)*

> **Nota (2026-10-28):** RF-33 y RF-34 se agregaron al formalizar el backlog del Administrador (HU-A05…HU-A11).
> Antes eran capacidades implícitas; al escribillas como historias quedó claro que no había RF que las cubriera.
> El reenvío de invitación (HU-A11) ya está cubierto por RF-04 y no pide un RF nuevo.

---

## 3. Requerimientos No Funcionales (RNF)

Los RNF establecen los atributos de calidad y restricciones técnicas.

### 3.1 Seguridad y Trazabilidad
- **RNF-01 (Cifrado):** Comunicación vía HTTPS (TLS 1.3). Contraseñas con hashing seguro (BCrypt/Argon2). *(Prioridad: Alta)*
- **RNF-02 (Logs Inmutables):** Registrar traza de auditoría inmutable de eventos transaccionales. *(Prioridad: Alta)*
- **RNF-03 (Ley 1581):** Impedir persistencia si el usuario no acepta políticas de tratamiento de datos. *(Prioridad: Alta)*

### 3.2 Rendimiento y Disponibilidad
- **RNF-04 (Tiempos de Respuesta):** Peticiones críticas (pagos, check-in/out) ≤ 3 segundos. *(Prioridad: Alta)*
- **RNF-05 (Disponibilidad):** Garantizar disponibilidad continua ≥ 99.5% mensual. *(Prioridad: Alta)*
- **RNF-06 (ACID):** Garantizar propiedades ACID para prevenir sobreventa de cupos. *(Prioridad: Alta)*

### 3.3 Continuidad y Sincronización
- **RNF-07 (Latencia):** Sincronización de cupos ≤ 500 ms entre ocupación física y app. *(Prioridad: Alta)*
- **RNF-08 (Persistencia Offline):** Manejar pérdida de señal manteniendo tokens en caché seguro. *(Prioridad: Alta)*
- **RNF-09 (CRON Jobs):** Tarea programada concurrente para liberar reservas exprés > 5 min sin degradar la API. *(Prioridad: Alta)*

### 3.4 Robustez y Gobierno de Datos
- **RNF-10 (Segregación):** Consultas de reportes masivos sobre réplicas de lectura para no afectar producción. *(Prioridad: Alta)*

---

## 4. Matriz de Trazabilidad (Resumen)

| Criterio de Aceptación | Módulo | RF Asociados | RNF Asociados |
|---|---|---|---|
| **CA-01** Interoperabilidad y Sincronización | Todos | RF-01 a RF-04, RF-09 a RF-11, RF-26 a RF-28 | RNF-01, RNF-04, RNF-05, RNF-07, RNF-08 |
| **CA-02** Validación de Roles y Seguridad | Onboarding/Admin | RF-05 a RF-08, RF-18, RF-24, RF-29, RF-32, RF-33 | RNF-01, RNF-02 |
| **CA-03** Exactitud del Motor de Reservas | Cliente/Operador | RF-13 a RF-19, RF-31 | RNF-06, RNF-09 |
| **CA-04** Trazabilidad y Cumplimiento | Onboarding/Admin | RF-01, RF-02, RF-21, RF-23, RF-30, RF-34 | RNF-02, RNF-03, RNF-10 |

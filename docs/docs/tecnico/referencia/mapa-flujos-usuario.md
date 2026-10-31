---
sidebar_position: 5
title: Mapa de Flujos de Usuario
---

# Mapa Completo de Flujos de Usuario

Este documento detalla los 10 flujos (User Journeys) que componen el ecosistema LOCIFY, garantizando que todos los actores (Conductor, Operador y Administrador) tengan un camino claro y sin fricciones.

## 1. Flujo del Conductor: Autenticación
*   **Actor:** Conductor
*   **Objetivo:** Registrarse y acceder al sistema de forma segura.

```mermaid
flowchart TD
    A[Usuario ingresa a la App] --> B{¿Tiene cuenta?}
    B -->|No| C[Formulario de Registro]
    C --> D[Recibe correo con token]
    D --> E[Activa cuenta y define contraseña]
    E --> F[Inicia sesión con JWT]
    B -->|Sí| F
    F --> G[Redirige a /buscar]
```

## 2. Flujo del Conductor: Búsqueda y Reserva (Crítico)
*   **Actor:** Conductor
*   **Objetivo:** Encontrar un parqueadero y asegurar el cupo.

```mermaid
flowchart TD
    A[Conductor en /buscar] --> B[Visualiza mapa y lista de sedes]
    B --> C[Selecciona sede]
    C --> D[Ver cupos disponibles]
    D --> E[Selecciona cupo]
    E --> F[Agrega datos de vehículo]
    F --> G[Previsualiza tarifa]
    G --> H[Paga con pasarela]
    H --> I{¿Pago exitoso?}
    I -->|Sí| J[Reserva confirmada y QR generado]
    I -->|No| K[Notifica error de pago]
```

## 3. Flujo del Conductor: Acceso y Uso (Crítico)
*   **Actor:** Conductor / Operador
*   **Objetivo:** Ingresar al parqueadero y salir pagando lo justo.

```mermaid
flowchart TD
    A[Conductor llega a sede] --> B[Muestra QR al operador]
    B --> C[Operador escanea QR]
    C --> D{¿Reserva válida?}
    D -->|Sí| E[Check-in registrado]
    D -->|No| F[Rechaza acceso]
    E --> G[Parqueo activo]
    G --> H[Conductor sale]
    H --> I[Operador escanea QR salida]
    I --> J[Check-out registrado y cierre de tarifa]
```

## 4. Flujo del Conductor: Cancelación y Reembolso (Crítico)
*   **Actor:** Conductor
*   **Objetivo:** Cancelar una reserva y recibir su dinero de vuelta si aplica.

```mermaid
flowchart TD
    A[Conductor en /dashboard] --> B[Selecciona reserva activa]
    B --> C[Solicita cancelación]
    C --> D{¿Dentro de ventana de cancelación?}
    D -->|Sí| E[Reembolso automático]
    D -->|No| F[Aplica penalización]
    E --> G[Reserva cancelada y notificación]
    F --> G
```

## 5. Flujo del Conductor: Historial y Vehículos
*   **Actor:** Conductor
*   **Objetivo:** Consultar reservas pasadas y gestionar placas.

```mermaid
flowchart TD
    A[Conductor abre /dashboard] --> B[Ver Historial de reservas]
    B --> C[Filtrar por fecha/estado]
    C --> D[Ver detalle de reserva]
    A --> E[Gestionar vehículos]
    E --> F[Agregar/Editar placa]
    F --> G[Actualizar perfil]
```

## 6. Flujo del Operador: Onboarding KYB (Crítico)
*   **Actor:** Operador / Administrador
*   **Objetivo:** Validar legalmente la sede para operar.

```mermaid
flowchart TD
    A[Operador ingresa a /operador/kyb] --> B[Formulario de datos de empresa]
    B --> C[Sube documentos y certificados]
    C --> D[Envío para revisión]
    D --> E[Admin revisa KYC/KYB]
    E --> F{¿Aprobado?}
    F -->|Sí| G[Parqueadero activo]
    F -->|No| H[Rechazo y notificación]
```

## 7. Flujo del Operador: Gestión de Ocupación
*   **Actor:** Operador
*   **Objetivo:** Monitorear los cupos en tiempo real.

```mermaid
flowchart TD
    A[Operador en dashboard] --> B[Ver mapa de ocupación]
    B --> C[Actualiza estado de cupos]
    C --> D[Motor sincroniza disponibilidad]
    D --> E[Notifica a conductores]
```

## 8. Flujo del Operador: Contingencia (Check-in Manual)
*   **Actor:** Operador
*   **Objetivo:** Operar cuando falla la red o el escáner.

```mermaid
flowchart TD
    A[Escaneo falla] --> B[Activar modo manual]
    B --> C[Ingresa placa o ID de reserva]
    C --> D[Valida en sistema offline/cache]
    D --> E{¿Válido?}
    E -->|Sí| F[Registra check-in/out manual]
    E -->|No| G[Solicita verificación]
    F --> H[Sincroniza al recuperar red]
```

## 9. Flujo del Administrador: Auditoría y Moderación
*   **Actor:** Administrador
*   **Objetivo:** Mantener la calidad de la red.

```mermaid
flowchart TD
    A[Admin en panel] --> B[Revisión de solicitudes KYB]
    B --> C[Auditoría de usuarios/conductores]
    C --> D{¿Cumple normas?}
    D -->|Sí| E[Aprobar]
    D -->|No| F[Suspender / Rechazar]
    E --> G[Notifica al actor]
    F --> G
```

## 10. Flujo del Administrador: Motor de Reglas (Crítico)
*   **Actor:** Administrador
*   **Objetivo:** Ajustar el negocio sin programar.

```mermaid
flowchart TD
    A[Admin accede a motor de reglas] --> B[Edita parámetros de precio/cancelación/cupos]
    B --> C[Simula escenario]
    C --> D{¿Validado?}
    D -->|Sí| E[Publica reglas]
    D -->|No| F[Ajusta y re-simula]
    F --> C
```

Este mapa de 10 flujos garantiza cobertura completa de los actores y operaciones críticas del negocio.

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

## 2. Flujo del Conductor: Búsqueda y Reserva de Cupo
*   **Actor:** Conductor
*   **Objetivo:** Encontrar un parqueadero y reservar un cupo.
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

## 3. Flujo del Conductor: Check-in y Check-out
*   **Actor:** Conductor
*   **Objetivo:** Ingresar y salir del parqueadero usando la reserva.
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

## 4. Flujo del Conductor: Cancelación y Reembolso
*   **Actor:** Conductor
*   **Objetivo:** Cancelar una reserva antes del inicio.
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

## 5. Flujo del Operador: Onboarding KYB
*   **Actor:** Operador / Admin Parqueadero
*   **Objetivo:** Registrar el nuevo parqueadero y validarlo.
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

## 6. Flujo del Operador: Gestión de Sedes y Cupos
*   **Actor:** Operador
*   **Objetivo:** Configurar sedes, precios y disponibilidad.
```mermaid
flowchart TD
    A[Operador en dashboard] --> B[Crear/Editar sede]
    B --> C[Configurar horarios y precios]
    C --> D[Definir cupos por zona]
    D --> E[Publicar disponibilidad]
    E --> F[Sincronización con motor de reglas]
```

## 7. Flujo del Operador: Check-in/Check-out y Pagos
*   **Actor:** Operador / Personal
*   **Objetivo:** Controlar acceso y registrar operaciones.
```mermaid
flowchart TD
    A[Operador escanea QR] --> B{¿Check-in o Check-out?}
    B -->|Check-in| C[Valida reserva]
    B -->|Check-out| D[Cierra tarifa]
    C --> E[Marca cupo ocupado]
    D --> F[Genera recibo]
    E --> G[Actualiza Ocupación]
    F --> G
```

## 8. Flujo del Operador: Reportes y Finanzas
*   **Actor:** Operador
*   **Objetivo:** Consultar ingresos y ocupación.
```mermaid
flowchart TD
    A[Operador abre Reportes] --> B[Selecciona rango de fechas]
    B --> C[Motor genera KPIs]
    C --> D[Visualiza ingresos y ocupación]
    D --> E[Exporta a CSV/PDF]
```

## 9. Flujo de Administrador: Moderación de Usuarios y Parqueaderos
*   **Actor:** Administrador
*   **Objetivo:** Aprobar parqueaderos y moderar usuarios.
```mermaid
flowchart TD
    A[Admin en panel] --> B[Revisión de solicitudes KYB]
    B --> C{Aprobación/Rechazo}
    C --> D[Actualiza estado]
    D --> E[Notifica a operador]
```

## 10. Flujo de Administrador: Configuración del Motor de Reglas
*   **Actor:** Administrador
*   **Objetivo:** Parametrizar reglas de precios, cancelación y cupos.
```mermaid
flowchart TD
    A[Admin accede a motor de reglas] --> B[Edita parámetros]
    B --> C[Simula escenario]
    C --> D{¿Validado?}
    D -->|Sí| E[Publica reglas]
    D -->|No| F[Ajusta y re-simula]
```

Este mapa de 10 flujos garantiza cobertura completa de los actores y operaciones críticas del negocio.

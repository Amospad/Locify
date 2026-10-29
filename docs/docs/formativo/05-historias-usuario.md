---
sidebar_position: 5
title: 05. Historias de Usuario (Product Backlog)
---

# Historias de Usuario y Product Backlog

Este documento contiene el Product Backlog completo del proyecto LOCIFY, organizado por épicas. Cada historia sigue el formato estándar y tiene sus criterios de aceptación.

## Épica 1: Onboarding y Seguridad (Autenticación)

| ID | Historia de Usuario | Prioridad | Estimación |
| :--- | :--- | :--- | :--- |
| **HU-01** | Como usuario, quiero registrarme con mi correo y contraseña para acceder al sistema. | Alta | 3 |
| **HU-02** | Como usuario, quiero recibir un correo de activación para validar mi cuenta. | Alta | 2 |
| **HU-03** | Como usuario, quiero recuperar mi contraseña en caso de olvido para no perder mi cuenta. | Media | 2 |
| **HU-04** | Como administrador, quiero asignar roles (RBAC) para controlar qué puede hacer cada usuario. | Alta | 3 |
| **HU-05** | Como sistema, quiero bloquear el acceso a dashboards si el usuario no ha activado su cuenta. | Alta | 1 |

## Épica 2: Gestión de Operadores (KYB)

| ID | Historia de Usuario | Prioridad | Estimación |
| :--- | :--- | :--- | :--- |
| **HU-06** | Como operador, quiero subir mis documentos legales (RUT, Cámara de Comercio) para solicitar verificación. | Alta | 3 |
| **HU-07** | Como administrador, quiero auditar los documentos de los operadores para aprobar o rechazar su sede. | Alta | 3 |
| **HU-08** | Como sistema, quiero ocultar las sedes no aprobadas en el mapa público para evitar fraudes. | Alta | 2 |
| **HU-09** | Como operador, quiero configurar la capacidad de mi sede (número de celdas y tipos de vehículo). | Alta | 3 |
| **HU-30** | Como operador, quiero ver en un solo panel los cupos totales, ocupados y disponibles de mi sede, junto con alertas de vehículos en sobretiempo, para decidir si acepto más reservas y cuándo intervenir la sede. | Alta | 5 |

## Épica 3: Reservas y Búsqueda (Cliente)

| ID | Historia de Usuario | Prioridad | Estimación |
| :--- | :--- | :--- | :--- |
| **HU-10** | Como cliente, quiero buscar parqueaderos en un mapa interactivo para ver disponibilidad en tiempo real. | Alta | 5 |
| **HU-11** | Como cliente, quiero filtrar los parqueaderos por precio y tipo de vehículo para encontrar el que se ajuste a mi necesidad. | Media | 2 |
| **HU-12** | Como cliente, quiero elegir entre Pago Anticipado o Reserva Exprés para tener flexibilidad al reservar. | Alta | 5 |
| **HU-13** | Como cliente, quiero recibir un código QR único tras mi reserva para poder ingresar al parqueadero. | Alta | 3 |
| **HU-14** | Como cliente, quiero cancelar mi reserva (con o sin reembolso) para no perder mi dinero si mis planes cambian. | Media | 3 |
| **HU-15** | Como cliente, quiero registrar múltiples vehículos (placas) para poder reservar con cualquiera de ellos. | Media | 2 |
| **HU-16** | Como sistema, quiero validar que un vehículo no tenga una reserva activa para evitar doble reserva. | Alta | 2 |
| **HU-27** | Como cliente, quiero que mi panel me muestre si tengo una reserva activa o un check-in en curso, con la sede, la placa y el tiempo restante, para saber de un vistazo qué está pasando con mi vehículo sin buscar entre pantallas. | Alta | 3 |
| **HU-28** | Como cliente, quiero consultar el historial de mis reservas y pagos con fecha, hora, estado y desglose económico, para controlar en qué se gastó mi dinero y reclamar cobros incorrectos. | Media | 3 |

> **Criterio transversal de la épica:** HU-10 a HU-15 deben cumplirse en móvil y en escritorio. El mapa, los filtros y el QR no pueden depender de sensores del teléfono; en escritorio se usan con ratón y teclado, y el QR se puede ver, descargar e imprimir ([03. Alcance §2.2](./03-alcance-requerimientos.md)).

## Épica 4: Acceso y Uso (Check-in / Check-out)

| ID | Historia de Usuario | Prioridad | Estimación |
| :--- | :--- | :--- | :--- |
| **HU-17** | Como operador, quiero escanear el QR del cliente para registrar su ingreso (Check-in) y arrancar el cronómetro. | Alta | 5 |
| **HU-18** | Como sistema, quiero rechazar QRs expirados o ya usados para garantizar la seguridad del acceso. | Alta | 3 |
| **HU-19** | Como cliente, quiero ver un cronómetro en tiempo real de mi tiempo de uso para saber cuánto voy a pagar. | Alta | 2 |
| **HU-20** | Como operador, quiero registrar salidas (Check-out) y que el sistema cobre automáticamente al cliente. | Alta | 5 |
| **HU-21** | Como operador, quiero poder hacer Check-in/out manual (por placa) si el sistema o el internet fallan (contingencia). | Alta | 3 |
| **HU-26** | Como conductor, quiero poder acceder a mi cuenta y ver mi QR desde el navegador de mi computador o desde mi celular, para tener flexibilidad según el dispositivo que esté usando. | Alta | 2 |
| **HU-29** | Como cliente, quiero que al hacer check-out se recalcule el valor según el tiempo real de uso y se me abone la diferencia como crédito, para no pagar por un tiempo que no utilicé. | Media | 3 |

## Épica 5: Administración y Soporte

| ID | Historia de Usuario | Prioridad | Estimación |
| :--- | :--- | :--- | :--- |
| **HU-22** | Como administrador, quiero modificar las reglas del negocio (multas, tiempos de gracia) sin afectar las reservas en curso. | Alta | 5 |
| **HU-23** | Como cliente, quiero abrir un ticket de soporte si el QR no funciona o si hay un cobro indebido. | Alta | 3 |
| **HU-24** | Como administrador, quiero gestionar los tickets escalados y resolver disputas con evidencia. | Alta | 3 |
| **HU-25** | Como operador, quiero ver reportes financieros (ingresos, multas) de mi sede para conciliar mis cuentas. | Media | 5 |

## Épica 6: Administrador (LOCIFY) — Operación del SaaS

Necesidad declarada: el rol **Administrador de LOCIFY** (dueño de la plataforma, distinto del operador de sede)
tiene pocas historias en el backlog. Esta épica le da funcionalidad propia de un SaaS: configuración del
negocio, RBAC interno, disputas, moderación, auditoría y métricas globales. El este y el oeste de la
trazabilidad está en [07. Matriz de Trazabilidad](./07-matriz-trazabilidad.md).

> **Convención de IDs:** los identificadores `HU-A05…HU-A11` se unen a la serie `HU-A` reservada en el
> backlog (las posiciones A01–A04 quedan disponibles para historias de administración propuesta si se abren).

| ID | Historia de Usuario | RF asociado | Prioridad | Estimación |
| :--- | :--- | :--- | :--- | :--- |
| **HU-A05** | Como administrador, quiero configurar los minutos de gracia y las tarifas base desde un panel, para ajustar la estrategia del negocio sin tocar código. | RF-31 | Alta | 3 |
| **HU-A06** | Como administrador, quiero crear cuentas para mi equipo de soporte y asignarles roles limitados, para que no todos tengan acceso total al sistema. | RF-32 | Alta | 5 |
| **HU-A07** | Como administrador, quiero ver la línea de tiempo de una reserva (check-in, check-out, pagos) para resolver disputas y emitir reembolsos si es necesario. | RF-30 | Alta | 5 |
| **HU-A08** | Como administrador, quiero suspender la cuenta de un operador si recibe muchas quejas, para garantizar la calidad del servicio. | *(sin RF propio; se ancla en RF-08)* | Alta | 3 |
| **HU-A09** | Como administrador, quiero consultar un log inmutable de acciones críticas (ej. cambios de tarifas), para auditar el sistema en caso de fraude. | RNF-02 | Alta | 3 |
| **HU-A10** | Como administrador, quiero ver métricas globales (reservas totales, ingresos por ciudad), para tomar decisiones estratégicas sobre la plataforma. | *(sin RF propio; se ancla en RF-28)* | Media | 5 |
| **HU-A11** | Como administrador, quiero reenviar el correo de activación a un operador que lo haya perdido, para agilizar su proceso de Onboarding. | RF-04 | Alta | 2 |

### Criterios de Aceptación de las HU-A05 a HU-A11

### HU-A05 — Configuración de reglas del negocio (RF-31)

- **Dado** que soy administrador con sesión activa (JWT con `rol=ADMIN`),
- **Cuando** abro el panel de reglas y edito los minutos de gracia de 5 a 10 y la tarifa base,
- **Entonces** el sistema guarda los valores y las reservas **nuevas** ya los aplican, sin afectar las
  reservas en curso (coherente con [HU-22](#épica-5-administración-y-soporte)).
- **Dado** que intento guardar un valor inválido (gracia negativa, tarifa 0, fracción mínima mayor a una hora),
- **Cuando** envío el formulario,
- **Entonces** el sistema lo rechaza con 400 y un mensaje accionable, sin alterar la configuración vigente.
- **Dado** que guardo un cambio efectivo,
- **Cuando** consulto el log de auditoría (HU-A09),
- **Entonces** aparece el evento con actor, fecha, valor anterior y valor nuevo.

### HU-A06 — RBAC para el equipo de soporte (RF-32)

- **Dado** que soy administrador,
- **Cuando** creo una cuenta con el rol SOPORTE y su informo el correo,
- **Entonces** la cuenta queda en PENDIENTE y recibe el correo de activación con el mismo flujo del onboarding (HU-02).
- **Dado** que un usuario con rol SOPORTE inicia sesión,
- **Cuando** intenta cambiar las tarifas del motor de reglas (HU-A05) o suspender un operador (HU-A08),
- **Entonces** el sistema devuelve 403 y la acción no se ejecuta.
- **Dado** que una cuenta de soporte queda comprometida o sobra,
- **Cuando** el administrador la suspende,
- **Entonces** sus tokens dejan de tener efecto en la siguiente petición (la autorización por rol se evalúa en cada request, no solo en el login).

### HU-A07 — Línea de tiempo de la reserva y reembolsos (RF-30)

- **Dado** que soy administrador y abro una reserva desde la lista de disputas (HU-24),
- **Cuando** veo el detalle,
- **Entonces** aparece una línea de tiempo con los eventos: reserva creada, check-in, check-out, cobros y abonos, cada uno con fuente (operador/sistema), placa y hora.
- **Dado** que la evidencia de la disputa confirma un cobro indebido,
- **Cuando** el administrador emite el reembolso (total o parcial)
- **Entonces** el abono queda registrado en la línea de tiempo, no suma como ingreso en los reportes (RF-28) y el cliente ve el crédito en su historial (HU-28).
- **Dado** que la disputa se resuelve a favor del operador,
- **Cuando** cierro el ticket,
- **Entonces** la línea de tiempo queda como evidencia consultable y la reserva mantiene su estado económico original.

### HU-A08 — Suspensión de operadores (moderación)

- **Dado** que un operador acumula quejas soportadas por tickets (HU-23, HU-24),
- **Cuando** el administrador marca su cuenta como SUSPENDIDO con un motivo obligatorio,
- **Entonces** la sede deja de aparecer en el mapa (HU-08), su login devuelve 403 (RF-08) y su dashboard queda bloqueado (RF-24).
- **Dado** que el operador corrige la causa,
- **Cuando** el administrador reactiva la cuenta,
- **Entonces** la sede vuelve a ser visible y el operador recupera el acceso, y el ciclo suspensión/reactivación queda registrado en el historial de la cuenta.

### HU-A09 — Log de auditoría inmutable (RNF-02)

- **Dado** que soy administrador con sesión activa,
- **Cuando** consulto el log de acciones críticas (cambios de tarifas, suspensiones, emisión de reembolsos, aprobaciones KYB),
- **Entonces** veo actor, rol, acción, fecha/hora, objeto afectado y detalle antes/después, con filtrado por actor y rango de fechas.
- **Dado** que un evento crítico ya fue escrito en el log,
- **Cuando** cualquier rol (incluso ADMIN) intenta modificarlo o eliminarlo,
- **Entonces** la operación se rechaza: el log es *append-only*; solo se agregan eventos nuevos.
- **Dado** que se sospecha de un fraude,
- **Cuando** se solicita la reconstrucción de la secuencia de acciones de un objeto (ej. la tarifa de una sede),
- **Entonces** se puede presentar la lista ordenada de eventos sin huecos ni duplicados.

### HU-A10 — Dashboard global de la plataforma

- **Dado** que soy administrador,
- **Cuando** abro el dashboard global,
- **Entonces** veo reservas totales, ingresos, tasa de disputas y sedes activas, con un rango de fechas seleccionable.
- **Dado** que elijo un desglose,
- **Cuando** selecciono "por ciudad",
- **Entonces** obtengo reservas e ingresos por ciudad, ordenados de mayor a menor, con datos **agregados**: ninguna métrica expone datos personales de clientes u operadores (RNF-03).
- **Dado** que el volumen de la plataforma crece,
- **Cuando** el dashboard se consulta mientras ocurren operaciones en otros módulos,
- **Entonces** las consultas pesadas se sirven de una réplica de lectura (RNF-10) y no degradan el check-out de las sedes.

### HU-A11 — Reenvío de invitación de activación (RF-04)

- **Dado** que un operador está PENDIENTE y afirmó no recibir el correo,
- **Cuando** el administrador usa la reinvitación,
- **Entonces** se genera un token nuevo con vigencia de 24 h, se reenvía el correo y **el token anterior deja de ser válido**.
- **Dado** que la cuenta ya está ACTIVA o SUSPENDIDA,
- **Cuando** se solicita la reinvitación,
- **Entonces** el sistema responde 400 sin enviar correo (solo cuentas PENDIENTE pueden reinvitar).
- **Dado** que el correo falla por el proveedor SMTP,
- **Cuando** termina la petición,
- **Entonces** el sistema responde 502, muestra el estado del contacto y la cuenta sigue PENDIENTE con token vigente, para reintentar sin duplicar registros (409).

> **Estado en el código de HU-A11:** el caso de uso y `POST /api/operadores/:id/reinvitar` existen y están
> probados (RBAC: solo ADMIN). Ver [07. Matriz de trazabilidad](./07-matriz-trazabilidad.md), fila RF-04.

## Formato de Criterios de Aceptación (Ejemplo HU-12)
- **Dado** que estoy en la pantalla de reserva,
- **Cuando** selecciono "Reserva Exprés",
- **Entonces** el sistema me muestra un QR con un temporizador de 5 minutos.
- **Dado** que la reserva expira a los 5 minutos,
- **Cuando** el sistema evalúa el tiempo,
- **Entonces** cancela la reserva y libera el cupo.

## Formato de Criterios de Aceptación (Ejemplo HU-26)

- **Dado** que inicié sesión en el navegador de mi computador,
- **Cuando** entro a "Mis reservas",
- **Entonces** veo mi reserva activa y el QR en formato descargable, sin volver a autenticarme.
- **Dado** que abro la misma cuenta desde mi celular,
- **Cuando** toco "Ver QR",
- **Entonces** el código se muestra a pantalla completa, con un área de toque mínima de 44 × 44 px y sin depender de notificaciones push.
- **Dado** que uso un lector de pantalla o navego con teclado en escritorio,
- **Cuando** recorro la tarjeta de la reserva,
- **Entonces** el QR tiene texto alternativo con el código y el botón de descarga es alcanzable con `Tab`.

## Criterios de Aceptación de las Historias de Cierre de Trazabilidad (HU-27 a HU-30)

### HU-27 — Panel con reserva o check-in activo (RF-09)

- **Dado** que soy un cliente sin actividad,
- **Cuando** abro el panel,
- **Entonces** veo un estado vacío con la acción "Buscar parqueadero" y ninguna tarjeta de reserva.
- **Dado** que tengo una reserva garantizada vigente,
- **Cuando** abro el panel,
- **Entonces** veo sede, placa, hora de inicio y tiempo restante, con las acciones "Ver QR" y "Cancelar".
- **Dado** que ya hice check-in,
- **Cuando** abro el panel,
- **Entonces** el estado cambia a "En curso" y el tiempo restante se recalcula desde el check-in, no desde la reserva.
- **Dado** que la reserva expiró (exprés mayor a 5 min),
- **Cuando** abro el panel,
- **Entonces** la reserva ya no aparece como activa y el estado muestra "Expirada" con el motivo.

### HU-28 — Historial con desglose económico (RF-21)

- **Dado** que tengo reservas cerradas,
- **Cuando** entro a "Historial",
- **Entonces** veo una lista paginada por fecha descendente con sede, placa, inicio, fin, estado y total.
- **Dado** que una reserva tuvo abono por uso menor,
- **Cuando** abro su detalle,
- **Entonces** veo el desglose: valor reservado, valor consumido, diferencia abonada y saldo resultante.
- **Dado** que una reserva fue cancelada con reembolso,
- **Cuando** abro su detalle,
- **Entonces** el desglose indica el monto reembolsado y el estado "Cancelada", sin sumarlo como ingreso.
- **Dado** que no tengo historial,
- **Cuando** entro a la sección,
- **Entonces** veo un estado vacío explicativo, no una tabla vacía.

### HU-29 — Recalculo y abono por uso menor (RF-17)

- **Dado** que reservé 3 horas y usé 1 hora 40 minutos,
- **Cuando** el operador registra el check-out,
- **Entonces** el sistema cobra 1 hora 40 minutos y abona la diferencia como crédito del cliente.
- **Dado** que el uso real superó el tiempo reservado,
- **Cuando** se registra el check-out,
- **Entonces** se cobra el excedente según la tarifa vigente y **no** se genera abono.
- **Dado** que el cliente tenía un crédito previo,
- **Cuando** se aplica el nuevo abono,
- **Entonces** el saldo se acumula y queda registrado en el historial con su fecha.
- **Dado** que el check-out ocurre en el mismo minuto que el check-in,
- **Cuando** se calcula el cobro,
- **Entonces** se aplica la fracción mínima definida en el motor de reglas (RF-31), no cero.

### HU-30 — Dashboard de ocupación con alertas (RF-26)

- **Dado** que mi sede tiene capacidad 40 y 32 celdas ocupadas,
- **Cuando** abro el dashboard,
- **Entonces** veo 40 totales, 32 ocupadas, 8 disponibles y el porcentaje, con datos de la última sincronización.
- **Dado** que un vehículo lleva más de 2 horas en sobretiempo,
- **Cuando** abro el dashboard,
- **Entonces** aparece una alerta con placa, celda y tiempo excedido, ordenada por antigüedad.
- **Dado** que se libera una celda,
- **Cuando** el operador registra el check-out,
- **Entonces** los contadores se actualizan sin recargar la página en ≤ 500 ms (RNF-07).
- **Dado** que el operador no tiene sesión activa o su sede no está aprobada,
- **Cuando** intenta abrir el dashboard,
- **Entonces** el sistema lo bloquea (RF-08, RF-24).
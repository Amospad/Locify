## Reglas de Negocio para Gestión de Estacionamiento y Excedencias

### RN-015: Gestión de Tiempos de Excedencia
El sistema permitirá que un conductor exceda el tiempo de reserva originalmente pactado sin incurrir en penalizaciones o bloqueos. El uso del espacio más allá del tiempo reservado se considerará **Tiempo de Excedencia**.
- **Liquidación:** Todo tiempo excedido se liquidará al momento del *Checkout*.
- **Tarifa:** El cobro por tiempo excedido se calculará de forma proporcional a la tarifa definida por el operador de la sede (tarifa por minuto o fracción).
- **Comunicación:** El sistema notificará al usuario:
    - **T-15 min:** Notificación preventiva de finalización.
    - **T+0 min:** Aviso de inicio de cobro por tiempo adicional.
    - **T+X min:** Recordatorios periódicos para mantener al usuario informado del cargo acumulado.

### RN-016: Estrategia de Derivación Inteligente (Proximidad)
Cuando una sede alcance el 100% de su capacidad de cupos (cupos disponibles = 0), el sistema activará automáticamente el motor de búsqueda de sedes aliadas.
- **Radio de Búsqueda:** El sistema consultará la disponibilidad de sedes en un radio máximo de **500 metros** desde la ubicación del parqueadero solicitado inicialmente.
- **Acción:** Si el sistema encuentra sedes con cupos disponibles, presentará al usuario una alerta informativa: *"Sede [Nombre] llena. Disponemos de parqueaderos con cupos a menos de 500m"*.
- **Flujo:** Si el usuario elige una sede alternativa, el sistema le redirigirá al flujo de reserva de dicha sede (siendo este un proceso de reserva nuevo e independiente).

### RN-017: Gestión de Conflictos por Excedencia
Para garantizar la continuidad operativa cuando una celda ha sido reservada por un usuario entrante pero está siendo ocupada por un usuario en estado de excedencia:
- **Prioridad:** La reserva entrante tiene la prioridad de uso sobre la celda.
- **Notificación:** El sistema notificará al usuario en excedencia que su celda ha sido requerida por una reserva programada, solicitándole liberar el espacio a la mayor brevedad posible para evitar cargos por gestión de desocupación tardía (si la política de la sede así lo establece).
- **Dashboard:** El panel del operador marcará dicha celda con un estado de alerta (`CONFLICT_RISK`) para permitir la gestión manual o asistencia física si fuera necesaria.

### RN-018: Maximización de Ingresos por Ocupación
LOCIFY promueve la ocupación extendida como modelo de negocio legítimo. 
- La arquitectura del sistema favorece la flexibilidad operativa antes que la sanción, considerando que la permanencia prolongada de un vehículo en la celda genera un incremento directo en el retorno económico tanto para el operador del parqueadero como para la plataforma, siempre que no afecte el flujo de otras reservas confirmadas.

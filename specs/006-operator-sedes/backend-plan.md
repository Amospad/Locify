# Plan de Implementación Backend - Gestión de Sedes por Operador
**Especificación:** 006-operator-sedes  
**Modo:** SSD - Spec-Driven Development  
**Fecha:** 2026-11-04  
**Estado:** APROBADO - Listo para implementación

## 1. Objetivo del Plan
Definir de forma exhaustiva los artefactos, contratos y criterios de aceptación del backend para la gestión de sedes por operador, antes de cualquier implementación de código.

## 2. Alcance Backend
- CRUD de sedes para operador autenticado y autorizado
- RBAC por operador: operador solo accede a sedes propias
- Validaciones de dominio y reglas de negocio
- Contratos de API REST
- Mapeo a arquitectura hexagonal
- Pruebas unitarias y de contrato

## 3. Arquitectura de Referencia
- **Hexagonal Clean Architecture**
  - Domain: Entidades, Value Objects, Use Cases, Puertos
  - Application: Servicios de aplicación, orchestration
  - Infrastructure: Repositorio Prisma, Supabase RLS, JWT
  - Interfaces: Fastify routes, DTOs, validación Zod

## 4. Modelos de Dominio
### 4.1 Entidad Sede
- id: UUID
- operatorId: UUID
- nombre: string 1-100 chars
- direccion: string
- latitud: float
- longitud: float
- capacidadTotal: int >=0
- precioHora: decimal >=0
- estado: ACTIVE|INACTIVE|MAINTENANCE
- createdAt, updatedAt

### 4.2 Reglas de Negocio
- Un operador puede tener múltiples sedes
- Solo operadores con KYB APROBADO pueden crear sedes
- Nombre único por operador
- Coordenadas dentro de Medellín (validación opcional)
- Eliminación lógica o física con verificación de dependencias

## 5. Use Cases
1. **CrearSedeUseCase**
   - Input: CrearSedeDTO
   - Output: SedeCreada
   - Reglas: Validar KYB, nombre único, coordenadas

2. **ListarSedesOperadorUseCase**
   - Input: operatorId
   - Output: Sede[] 

3. **ObtenerSedeUseCase**
   - Input: sedeId, operatorId
   - Output: Sede
   - Regla: Verificar ownership

4. **ActualizarSedeUseCase**
   - Input: sedeId, operatorId, ActualizarSedeDTO
   - Output: SedeActualizada

5. **EliminarSedeUseCase**
   - Input: sedeId, operatorId
   - Output: void
   - Regla: Sin celdas activas o reservas pendientes

## 6. Contratos de API
### 6.1 POST /api/operador/sedes
- Auth: Bearer JWT rol OPERADOR
- Body: CrearSedeDTO
- Response 201: { sedeId, nombre }
- Errors: 400 validación, 403 KYB no aprobado, 409 nombre duplicado

### 6.2 GET /api/operador/sedes
- Auth: Bearer JWT rol OPERADOR
- Response 200: SedeOperador[]
- Query params opcionales: estado, page, limit

### 6.3 GET /api/operador/sedes/:id
- Response 200: SedeDetalle

### 6.4 PUT /api/operador/sedes/:id
- Auth: Bearer JWT
- Body: ActualizarSedeDTO parcial
- Response 200: { sedeId, nombre }

### 6.5 DELETE /api/operador/sedes/:id
- Response 204

## 7. Puertos y Adaptadores
- `SedeRepository`: crear, listarPorOperador, obtener, actualizar, eliminar
- `GeneradorId`: UUID v4
- `AutorizadorOperador`: verificar ownership y KYB

## 8. Validaciones y DTOs
- Zod schemas para request/response
- Validación de coordenadas, teléfono E.164, precios positivos

## 9. Seguridad
- JWT interno solo
- Supabase RLS: policy por operator_id
- No exponer datos de otros operadores
- Auditoría: log de creación/actualización/eliminación

## 10. Criterios de Aceptación
- [ ] Todos los use cases definidos con puertos
- [ ] Contratos de API documentados con ejemplos
- [ ] Esquemas Zod validados
- [ ] Políticas RLS definidas
- [ ] Plan de pruebas unitarias con casos de borde
- [ ] Sin código implementado hasta aprobación de plan

## 11. Dependencias
- Spec 005-auth-kyb debe estar passing
- Seed de operadores y sedes disponible
- Repositorio Prisma con modelo Sede

## 12. Próximos Pasos post-aprobación
1. Implementar puertos y entidades de dominio
2. Implementar use cases con inyección de dependencias
3. Adaptador Prisma SedeRepository
4. Rutas Fastify con validación Zod
5. Tests unitarios 100% de use cases
6. Tests de contrato API

---
**Nota:** Este plan es el artefacto de diseño SSD previo a implementación. No se escribirá código hasta aprobación explícita.

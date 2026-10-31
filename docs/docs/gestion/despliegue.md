---
sidebar_position: 3
title: Despliegue
---

# Despliegue LOCIFY

## Supabase

1. Crear proyecto en Supabase y copiar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Vincular proyecto local:
   ```bash
   supabase link
   ```
3. Subir esquema y políticas RLS:
   ```bash
   supabase db push
   ```
   El esquema está en `apps/web-cliente/supabase/migrations/0000_init.sql` con RLS habilitado para `usuario`, `reserva` y `sede`.

## Vercel

1. Conectar repositorio GitHub en Vercel.
2. Añadir variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automático en push a `main`. Revisar build logs y logs de Edge Middleware para protección de rutas.

## Validación

```bash
cd apps/web-cliente
npm run build
```

Build debe finalizar con rutas estáticas prerenderizadas.

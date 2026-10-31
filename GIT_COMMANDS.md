# Comandos Git para Reingeniería LOCIFY

```bash
# Asegurar rama actual
git status

# Añadir cambios
git add docs/docs/formativo/09-modelo-negocio-y-resiliencia.md docs/docs/tecnico/flujos/flujo-04-cancelacion.md docs/docs/formativo/07-matriz-trazabilidad.md docs/docs/gestion/roadmap-sprints.md docs/sidebars.ts apps/web-cliente/src/app/globals.css docs/docs/tecnico/referencia/guia-diseno-ui.md PROJECT_STATE.md

# Commit
git commit -m "feat(reengineering): lógica de negocio edge cases, roadmap sprints 1-8 y diseño premium OKLCH"

# Push a docs/hu-admin
git push origin docs/hu-admin

# Opcional: preparar merge a main
git checkout main
git merge docs/hu-admin
git push origin main
```

## Supabase + Velora UI

```bash
# Añadir cambios migración Supabase y landing Velora
git add apps/web-cliente/src/lib/supabase apps/web-cliente/src/middleware.ts apps/web-cliente/supabase/migrations apps/web-cliente/src/components/landing apps/web-cliente/src/app/page.tsx apps/web-cliente/prisma/schema.prisma apps/web-cliente/.env.example docs/docs/gestion/despliegue.md

git commit -m "feat(supabase+ui): migración real DB Prisma a Supabase con RLS y landing Velora UI glassmorphism OKLCH"

git push origin docs/hu-admin
```

# Dashboards + Stripe

```bash
# Añadir dashboards premium y Stripe
git add apps/web-cliente/src/app/dashboard apps/web-cliente/src/app/operador/dashboard apps/web-cliente/src/app/admin/kyb apps/web-cliente/src/components/StripePaymentModal.tsx apps/web-cliente/package.json services/admin-api/src/interfaces/http/routes/payments.ts services/admin-api/src/interfaces/http/routes/webhooks.ts docs/docs/tecnico/referencia/integraciones.md PROJECT_STATE.md

git commit -m "feat(dashboard+stripe): dashboards premium Apex style + integración Stripe pagos reales"

git push origin docs/hu-admin
```


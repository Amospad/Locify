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

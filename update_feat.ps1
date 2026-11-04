$path='specs/005-auth-kyb/feature_list.json'
$txt=Get-Content $path -Raw
$txt=$txt -replace '\"status\": \"in-progress\"', '"status": "passing"'
$txt=$txt -replace '\[\"feat-005-2\", \"feat-005-3\"\], \"status\": \"passing\"', '"depends_on":["feat-005-2","feat-005-3"],"status":"passing"'
# Add evidence
$txt=$txt -replace '"id": "feat-005-4", "name": "Interfaz PWA - KYB & Panel Admin", "depends_on": \["feat-005-2", "feat-005-3"\], "status": "passing", "evidence": ""', '"id": "feat-005-4", "name": "Interfaz PWA - KYB & Panel Admin", "depends_on": ["feat-005-2","feat-005-3"], "status": "passing", "evidence": "TypeScript sin errores; páginas operador/kyb y admin/kyb conectadas a API; Typecheck pasa"'
Set-Content $path $txt
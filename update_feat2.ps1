$json=Get-Content specs/005-auth-kyb/feature_list.json -Raw | ConvertFrom-Json
foreach ($f in $json.features) {
    if ($f.id -eq 'feat-005-4') {
        $f.status='passing'
        $f.evidence='TypeScript sin errores; páginas operador/kyb y admin/kyb conectadas a API; Typecheck pasa'
    }
}
$json | ConvertTo-Json -Depth 10 | Set-Content specs/005-auth-kyb/feature_list.json
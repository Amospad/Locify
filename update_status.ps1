$path='specs/005-auth-kyb/feature_list.json'
$txt=Get-Content $path -Raw
$txt=$txt -replace '"status": "not-started"', '"status": "in-progress"'
Set-Content $path $txt
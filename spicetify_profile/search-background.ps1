# Wyszukaj --background-base i --section-background-base w plikach xpui
Write-Host "Szukam w plikach JavaScript..." -ForegroundColor Green

$results = Select-String -Pattern "--background-base|--section-background-base" -Path "Extracted\Raw\xpui\*.js" | Select-Object -First 50

if ($results) {
    Write-Host "`nZNALEZIONO W:" -ForegroundColor Yellow
    foreach ($result in $results) {
        Write-Host "`nPlik: $($result.Filename)" -ForegroundColor Cyan
        Write-Host "Linia $($result.LineNumber): $($result.Line.Trim())" -ForegroundColor White
    }
} else {
    Write-Host "Nie znaleziono." -ForegroundColor Red
}

Write-Host "`n`nSzukam 'background-base' bez -- (może być w zmiennej)..." -ForegroundColor Green
$results2 = Select-String -Pattern "background-base|backgroundBase" -Path "Extracted\Raw\xpui\*.js" | Select-Object -First 50

if ($results2) {
    Write-Host "`nZNALEZIONO:" -ForegroundColor Yellow
    foreach ($result in $results2) {
        Write-Host "`nPlik: $($result.Filename)" -ForegroundColor Cyan
        Write-Host "Linia $($result.LineNumber): $($result.Line.Trim())" -ForegroundColor White
    }
}

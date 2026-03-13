# DynamicGlow Theme - Szybka instalacja dla Windows
# Autor: Custom Theme
# Wersja: 1.0.0

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   DynamicGlow Theme - Instalator" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Sprawdź czy Spicetify jest zainstalowane
$checkSpice = Get-Command spicetify -ErrorAction Silent
if ($null -eq $checkSpice) {
    Write-Host "❌ Spicetify nie jest zainstalowane!" -ForegroundColor Red
    Write-Host "Zainstaluj Spicetify z: https://spicetify.app" -ForegroundColor Yellow
    exit
}

Write-Host "✓ Spicetify znalezione" -ForegroundColor Green

# Pobierz ścieżkę do Spicetify
$spicePath = spicetify -c | Split-Path
$themesPath = "$spicePath\Themes\DynamicGlow"
$extensionsPath = "$spicePath\Extensions"

Write-Host "📁 Instalacja w: $spicePath" -ForegroundColor Cyan
Write-Host ""

# Utwórz folder motywu
Write-Host "📂 Tworzenie folderu motywu..." -NoNewline
if (-not (Test-Path $themesPath)) {
    New-Item -Path $themesPath -ItemType Directory | Out-Null
}
Write-Host " ✓" -ForegroundColor Green

# Skopiuj pliki
Write-Host "📋 Kopiowanie plików motywu..." -NoNewline
$sourceTheme = "$PSScriptRoot"
Copy-Item "$sourceTheme\color.ini" -Destination $themesPath -Force
Copy-Item "$sourceTheme\user.css" -Destination $themesPath -Force
Write-Host " ✓" -ForegroundColor Green

Write-Host "📋 Kopiowanie rozszerzeń..." -NoNewline
Copy-Item "$sourceTheme\Extensions\dynamic-glow.js" -Destination $extensionsPath -Force
Copy-Item "$sourceTheme\Extensions\Vibrant.min.js" -Destination $extensionsPath -Force
Write-Host " ✓" -ForegroundColor Green

# Konfiguracja Spicetify
Write-Host ""
Write-Host "⚙️  Konfiguracja Spicetify..." -ForegroundColor Cyan

spicetify config current_theme DynamicGlow
spicetify config color_scheme Dark-Base
spicetify config extensions dynamic-glow.js
spicetify config extensions Vibrant.min.js
spicetify config inject_css 1 replace_colors 1

Write-Host ""
Write-Host "🎨 Stosowanie motywu..." -NoNewline
spicetify apply
Write-Host " ✓" -ForegroundColor Green

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   ✨ Instalacja zakończona pomyślnie! ✨" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Spotify zostanie uruchomione z nowym motywem." -ForegroundColor Yellow
Write-Host ""
Write-Host "Aby zmienić schemat kolorów:" -ForegroundColor Cyan
Write-Host "  spicetify config color_scheme <Dark-Base|Light-Base|Dark-Animated|Light-Animated>" -ForegroundColor White
Write-Host "  spicetify apply" -ForegroundColor White
Write-Host ""
Write-Host "Naciśnij dowolny klawisz aby zakończyć..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

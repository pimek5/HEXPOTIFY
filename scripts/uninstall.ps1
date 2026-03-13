$ErrorActionPreference = "Stop"

$spicetifyRoot = Join-Path $env:APPDATA "spicetify"
$extensionsDir = Join-Path $spicetifyRoot "Extensions"
$configPath = Join-Path $spicetifyRoot "config-xpui.ini"

$targets = @('hexpotify.js', 'hexpotify-profile-bootstrap.js')
foreach ($name in $targets) {
    $filePath = Join-Path $extensionsDir $name
    if (Test-Path $filePath) {
        Remove-Item -Path $filePath -Force
    }
}

if (Test-Path $configPath) {
    $config = Get-Content -Path $configPath -Raw
    $linePattern = '(?m)^extensions\s*=\s*(.*)$'
    $match = [regex]::Match($config, $linePattern)
    if ($match.Success) {
        $items = @()
        if ($match.Groups[1].Value.Trim().Length -gt 0) {
            $items = $match.Groups[1].Value.Split('|') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
        }

        $items = $items | Where-Object { $_ -notin @('hexpotify.js', 'hexpotify-profile-bootstrap.js') }
        $newLine = "extensions            = " + ($items -join '|')
        $config = [regex]::Replace($config, $linePattern, $newLine)
        Set-Content -Path $configPath -Value $config -NoNewline
    }
}

Write-Host "Uninstalled HEXpotify from Spicetify config"
Write-Host "Run: spicetify apply"

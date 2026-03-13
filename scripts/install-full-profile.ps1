$ErrorActionPreference = "Stop"

$packageRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$profileRoot = Join-Path $packageRoot "spicetify_profile"
$targetRoot = Join-Path $env:APPDATA "spicetify"

if (-not (Test-Path $profileRoot)) {
    throw "Cannot find packaged profile: $profileRoot"
}

if (-not (Test-Path $targetRoot)) {
    New-Item -ItemType Directory -Path $targetRoot -Force | Out-Null
}

# 1:1 profile copy (without Backup/Extracted, which are intentionally not bundled)
Get-ChildItem -Path $profileRoot -Force | ForEach-Object {
    $dest = Join-Path $targetRoot $_.Name
    if ($_.PSIsContainer) {
        Copy-Item -Path $_.FullName -Destination $dest -Recurse -Force
    } else {
        Copy-Item -Path $_.FullName -Destination $dest -Force
    }
}

# Ensure required HEXpotify files are present from package extensions too
$extensionsDir = Join-Path $targetRoot "Extensions"
if (-not (Test-Path $extensionsDir)) {
    New-Item -ItemType Directory -Path $extensionsDir -Force | Out-Null
}

Get-ChildItem -Path (Join-Path $packageRoot "extensions") -File | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $extensionsDir $_.Name) -Force
}

# Apply profile localStorage bootstrap at runtime via extension
$configPath = Join-Path $targetRoot "config-xpui.ini"
if (-not (Test-Path $configPath)) {
    throw "Cannot find config file after copy: $configPath"
}

$config = Get-Content -Path $configPath -Raw
$linePattern = '(?m)^extensions\s*=\s*(.*)$'
$match = [regex]::Match($config, $linePattern)
if ($match.Success) {
    $items = @()
    if ($match.Groups[1].Value.Trim().Length -gt 0) {
        $items = $match.Groups[1].Value.Split('|') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    }

    foreach ($needed in @('hexpotify.js', 'hexpotify-profile-bootstrap.js', 'dynamic-glow-config.js')) {
        if ($items -notcontains $needed) {
            $items += $needed
        }
    }

    $newLine = "extensions            = " + ($items -join '|')
    $config = [regex]::Replace($config, $linePattern, $newLine)
    Set-Content -Path $configPath -Value $config -NoNewline
}

# Apply in one step
& spicetify apply

Write-Host "HEXpotify full profile installed and applied." -ForegroundColor Green

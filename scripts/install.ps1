$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$spicetifyRoot = Join-Path $env:APPDATA "spicetify"
$extensionsDir = Join-Path $spicetifyRoot "Extensions"
$customAppsDir = Join-Path $spicetifyRoot "CustomApps"
$themesDir = Join-Path $spicetifyRoot "Themes"
$configPath = Join-Path $spicetifyRoot "config-xpui.ini"

if (-not (Test-Path $extensionsDir)) {
    New-Item -ItemType Directory -Path $extensionsDir -Force | Out-Null
}
if (-not (Test-Path $customAppsDir)) {
    New-Item -ItemType Directory -Path $customAppsDir -Force | Out-Null
}
if (-not (Test-Path $themesDir)) {
    New-Item -ItemType Directory -Path $themesDir -Force | Out-Null
}

# Copy all bundled extensions (1:1 profile pack)
Get-ChildItem -Path (Join-Path $repoRoot "extensions") -File | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $extensionsDir $_.Name) -Force
}

# Copy bundled custom apps and themes for 1:1 profile.
Get-ChildItem -Path (Join-Path $repoRoot "custom_apps") -Directory | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $customAppsDir $_.Name) -Recurse -Force
}
Get-ChildItem -Path (Join-Path $repoRoot "themes") -Directory | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $themesDir $_.Name) -Recurse -Force
}

if (-not (Test-Path $configPath)) {
    throw "Cannot find config file: $configPath"
}

$config = Get-Content -Path $configPath -Raw

function Set-IniLine([string]$text, [string]$key, [string]$value) {
    $pattern = "(?m)^$([regex]::Escape($key))\s*=\s*.*$"
    $line = "{0,-20} = {1}" -f $key, $value
    if ([regex]::IsMatch($text, $pattern)) {
        return [regex]::Replace($text, $pattern, $line)
    }
    return $text + "`r`n" + $line
}

$extensionsExact = @(
    'Vibrant.min.js',
    'dynamicglow-features.js',
    'default-dynamic.js',
    'progress-bar-glow.js',
    'innovative-effects.js',
    'force-bloom.js',
    'listPlaylistsWithSong.js',
    'dom-inspector.js',
    'enhanced-effects.js',
    'dynamic-glow-config.js',
    'live-wrapped.js',
    'hexpotify.js',
    'hexpotify-profile-bootstrap.js'
)

$config = Set-IniLine $config 'current_theme' 'DynamicGlow'
$config = Set-IniLine $config 'color_scheme' 'Dark-Base'
$config = Set-IniLine $config 'inject_theme_js' '1'
$config = Set-IniLine $config 'inject_css' '1'
$config = Set-IniLine $config 'replace_colors' '1'
$config = Set-IniLine $config 'always_enable_devtools' '1'
$config = Set-IniLine $config 'experimental_features' '1'
$config = Set-IniLine $config 'extensions' ($extensionsExact -join '|')
$config = Set-IniLine $config 'custom_apps' 'Lyrixed|spicetify-history|marketplace|genius-annotations|history-in-sidebar|Enhancify'

Set-Content -Path $configPath -Value $config -NoNewline

Write-Host "Installed HEXpotify profile pack and enforced 1:1 config: $configPath"
Write-Host "Run: spicetify apply"

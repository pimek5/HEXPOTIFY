$ErrorActionPreference = "Stop"

$packageRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$cmdPath = Join-Path $packageRoot "INSTALL-HEXpotify.cmd"
$outExe = Join-Path $packageRoot "INSTALL-HEXpotify.exe"

if (-not (Test-Path $cmdPath)) {
    throw "Cannot find launcher: $cmdPath"
}

# Optional path: build EXE wrapper with PS2EXE if available.
if (-not (Get-Module -ListAvailable -Name ps2exe)) {
    Write-Host "PS2EXE module not found. Installing for current user..."
    Install-Module -Name ps2exe -Scope CurrentUser -Force
}

$wrapper = Join-Path $PSScriptRoot "_hexpotify-exe-wrapper.ps1"
@"
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c """$cmdPath"""' -Verb RunAs
"@ | Set-Content -Path $wrapper

Invoke-ps2exe -inputFile $wrapper -outputFile $outExe -noConsole
Remove-Item $wrapper -Force

Write-Host "Created installer EXE: $outExe"

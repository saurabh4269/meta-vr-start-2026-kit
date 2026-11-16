# Thin helpers around the adb commands documented by Meta:
#   https://developers.meta.com/horizon/documentation/unity/ts-adb/
#   https://developers.meta.com/horizon/essentials/metavr-devices-and-apps
# PowerShell counterpart of scripts/quest-adb.sh.
# Usage:
#   .\scripts\quest-adb.ps1 devices                 # adb devices
#   .\scripts\quest-adb.ps1 install app.apk         # adb install -r app.apk (reinstall keeps data)
#   .\scripts\quest-adb.ps1 logcat [TAG]            # clear, then stream logcat (optionally only TAG, e.g. Unity)
#   .\scripts\quest-adb.ps1 wifi [PORT]             # USB-connected: adb tcpip PORT, then adb connect <headset-ip>:PORT
#   .\scripts\quest-adb.ps1 disconnect              # adb disconnect
#   .\scripts\quest-adb.ps1 perf PACKAGE [MS]       # metavr perf capture --app PACKAGE --mode vr --duration MS (needs Meta VR CLI)
# Set ANDROID_SERIAL=<device id> to target one device when several are connected (same as adb -s).
#
# ⚠ Untested on a real Windows machine in this kit. Ported from scripts/quest-adb.sh.
# If execution is blocked:  Set-ExecutionPolicy -Scope Process Bypass
# then rerun this script.

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Command = "help",

    [Parameter(Position = 1)]
    [string]$Arg1,

    [Parameter(Position = 2)]
    [string]$Arg2
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-AdbPrefix {
    $prefix = @()
    if ($env:ANDROID_SERIAL -and $env:ANDROID_SERIAL.Trim() -ne "") {
        $prefix += @("-s", $env:ANDROID_SERIAL.Trim())
    }
    return ,$prefix
}

function Assert-CommandOnPath {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        Write-Error "missing '$Name' on PATH" -ErrorAction Stop
    }
}

function Invoke-Adb {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$AdbArgs)
    Assert-CommandOnPath adb
    $all = @(Get-AdbPrefix) + @($AdbArgs)
    & adb @all
    if ($LASTEXITCODE -ne 0) {
        throw "adb exited with code $LASTEXITCODE"
    }
}

function Show-Help {
    Get-Content -Path $PSCommandPath -TotalCount 17 | Select-Object -Skip 1
}

function Get-HeadsetIp {
    $route = & adb @(Get-AdbPrefix) shell ip route 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $route) {
        throw "couldn't read headset IP from 'adb shell ip route' (is it on Wi-Fi and USB-connected?)"
    }
    $text = ($route | Out-String)
    $match = [regex]::Match($text, '\bsrc\s+(\S+)')
    if (-not $match.Success) {
        throw "couldn't read headset IP from 'adb shell ip route' (is it on Wi-Fi and USB-connected?)"
    }
    return $match.Groups[1].Value
}

switch ($Command.ToLowerInvariant()) {
    "devices" {
        Invoke-Adb @('devices')
    }
    "install" {
        if (-not $Arg1) { throw "usage: install path/to/app.apk" }
        Invoke-Adb @('install', '-r', $Arg1)
    }
    "logcat" {
        Invoke-Adb @('logcat', '-c')
        if ($Arg1) {
            Invoke-Adb @('logcat', '-s', $Arg1)
        } else {
            Invoke-Adb @('logcat')
        }
    }
    "wifi" {
        $port = if ($Arg1) { $Arg1 } else { "5555" }
        Assert-CommandOnPath adb
        $ip = Get-HeadsetIp
        Invoke-Adb @('tcpip', $port)
        Start-Sleep -Seconds 2
        # After tcpip, connect by address; do not pass -s ANDROID_SERIAL here.
        & adb connect "${ip}:${port}"
        if ($LASTEXITCODE -ne 0) {
            throw "adb connect ${ip}:${port} exited with code $LASTEXITCODE"
        }
        Write-Host "Unplug USB; 'adb devices' should show ${ip}:${port}"
    }
    "disconnect" {
        Invoke-Adb @('disconnect')
    }
    "perf" {
        if (-not $Arg1) { throw "usage: perf com.your.package [duration_ms]" }
        Assert-CommandOnPath metavr
        $duration = if ($Arg2) { $Arg2 } else { "10000" }
        $metaArgs = @("perf", "capture", "--app", $Arg1, "--mode", "vr", "--duration", $duration)
        if ($env:ANDROID_SERIAL -and $env:ANDROID_SERIAL.Trim() -ne "") {
            $metaArgs += @("--device", $env:ANDROID_SERIAL.Trim())
        }
        & metavr @metaArgs
        if ($LASTEXITCODE -ne 0) {
            throw "metavr exited with code $LASTEXITCODE"
        }
    }
    default {
        Show-Help
    }
}

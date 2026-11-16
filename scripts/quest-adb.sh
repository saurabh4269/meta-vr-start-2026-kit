#!/usr/bin/env bash
# Thin helpers around the adb commands documented by Meta:
#   https://developers.meta.com/horizon/documentation/unity/ts-adb/
#   https://developers.meta.com/horizon/essentials/metavr-devices-and-apps
# Usage:
#   scripts/quest-adb.sh devices                 # adb devices
#   scripts/quest-adb.sh install app.apk         # adb install -r app.apk (reinstall keeps data)
#   scripts/quest-adb.sh logcat [TAG]            # clear, then stream logcat (optionally only TAG, e.g. Unity)
#   scripts/quest-adb.sh wifi [PORT]             # USB-connected: adb tcpip PORT, then adb connect <headset-ip>:PORT
#   scripts/quest-adb.sh disconnect              # adb disconnect
#   scripts/quest-adb.sh perf PACKAGE [MS]       # metavr perf capture --app PACKAGE --mode vr --duration MS (needs Meta VR CLI)
# Set ANDROID_SERIAL=<device id> to target one device when several are connected (same as adb -s).
set -euo pipefail
need() { command -v "$1" >/dev/null || { echo "missing '$1' on PATH" >&2; exit 1; }; }
cmd="${1:-help}"; shift || true
case "$cmd" in
  devices) need adb; adb devices ;;
  install)
    need adb; apk="${1:?usage: install path/to/app.apk}"
    adb install -r "$apk" ;;
  logcat)
    need adb; adb logcat -c
    if [[ -n "${1:-}" ]]; then adb logcat -s "$1"; else adb logcat; fi ;;
  wifi)
    need adb; port="${1:-5555}"
    ip="$(adb shell ip route | awk '{for(i=1;i<=NF;i++) if($i=="src"){print $(i+1); exit}}')"
    [[ -n "$ip" ]] || { echo "couldn't read headset IP from 'adb shell ip route' (is it on Wi-Fi and USB-connected?)" >&2; exit 1; }
    adb tcpip "$port"; sleep 2
    adb connect "$ip:$port"
    echo "Unplug USB; 'adb devices' should show $ip:$port" ;;
  disconnect) need adb; adb disconnect ;;
  perf)
    need metavr; pkg="${1:?usage: perf com.your.package [duration_ms]}"
    metavr perf capture --app "$pkg" --mode vr --duration "${2:-10000}" ;;
  *) sed -n '2,13p' "$0" ;;
esac

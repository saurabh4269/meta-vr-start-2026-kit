# Work with devices and apps | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/essentials/metavr-devices-and-apps
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Essentials

Updated: Aug 28, 2026

This guide shows you how to connect a Meta VR device to Meta VR CLI (`metavr`), install and manage apps, move files, read logs, and automate the interface. Use these tasks to set up a device for development or testing.

- Meta VR CLI installed. See [Install Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-install).
- Developer Mode enabled on the device.
- A USB-C data cable. Charge-only cables do not carry data.
- USB debugging authorized on the device.

`adb` install. The CLI has its own embedded device-communication library and uses it by default.
Plug in the device with a USB-C data cable, then put it on. The first time the CLI talks to it, the device shows a USB debugging prompt. Accept it and choose “Always allow from this computer”.

Confirm the connection:

metavr device list

The output lists the ID of each attached device. You use that ID with other commands.

To work over Wi-Fi, turn on Android Debug Bridge (ADB) over Wi-Fi and connect by address:

metavr device wifi enable
metavr device connect 192.168.1.10

The port defaults to 5555 when you leave it off. Disconnect with `metavr device disconnect <ADDRESS>`, or leave the address off to disconnect every device.

metavr device info \<DEVICE\_ID>

`<DEVICE_ID>` is required. Take it from Other status commands:

- `metavr device battery` shows the battery state.
- `metavr device os` shows the version, build, branch, and lock state.
- `metavr device health-check` checks connectivity, battery, storage, and the interface.
- `metavr device boundary` shows the boundary status. Add `--enable` or `--disable` to change it.

Pick one with `-d` on any command:

metavr device battery -d \<DEVICE>

Or set a default once:

metavr config set default-device \<SERIAL>

The `HZDB_DEVICE` environment variable also selects a device.

`metavr files` commands skip the default. Pass `-d` to those whenever more than one device is attached.
metavr app install my-app.apk

Useful flags:

- `-r`/`--replace` reinstalls and keeps app data. There is no `--reinstall` flag.
- `-g`/`--grant-permissions` grants runtime permissions on install.
- `-t`/`--allow-test` allows test packages.
- `--downgrade` allows installing an older version over a newer one.

Launch it:

metavr app launch com.example.myapp

- `--cold-start` forces a fresh process.
- `--wait-for-idle` waits for the app to settle before returning.
- `--verify` checks the logs for a launch crash afterward, and exits non-zero if it finds one.

List what is installed with `metavr app list`, narrowing by package-name substring with `-f`/`--filter <SUBSTR>`. Get detail on one package with `metavr app info <PACKAGE>`.

metavr app stop com.example.myapp
metavr app clear com.example.myapp -y
metavr app uninstall com.example.myapp -y

`-y`/`--yes` is required when `stdin` is not a terminal, which covers continuous integration jobs. Add `-k`/`--keep-data` to uninstall but leave app data in place.
metavr files ls /sdcard/
metavr files pull /sdcard/report.txt
metavr files push report.txt /sdcard/report.txt

`ls` defaults to `/sdcard/`, and `-a`/`--all` shows hidden files. `pull` defaults to the current directory. Create directories with `metavr files mkdir <PATH>`, where `-p`/`--parents` defaults to true. Remove with `metavr files rm <PATH> -y`, adding `--recursive` for a directory.
Read device logs:

metavr log -n 200 -l E

- `-n`/`--lines <N>` defaults to 100.
- `-t`/`--tag <TAG>` filters by tag.
- `-l`/`--level <V|D|I|W|E|F>` filters by level.
- `-c`/`--clear` clears the buffer.

Run a single command on the device:

metavr shell pwd

An interactive shell is not supported, so each call runs one command. For anything the shortcuts leave out, drop to the full ADB surface:

metavr adb logcat --pid \<PID> --follow

metavr capture screenshot -o screenshot.png

The default size is 1024x1024. Change it with `--width` and `--height`. Without `-o`/`--output`, the file saves as `screenshot_<timestamp>.png`.

Read the interface hierarchy, then act on it:

metavr ui dump
metavr ui tap --text "Continue"

`--id`, `--text`, and `--content-desc` match a case-insensitive substring. Add `--exact` to match the whole string. `:id/`. Add `--index <N>` to choose among several matches. Coordinates are screen pixels, so a center read from `ui dump` feeds straight into `--coords`.
metavr ui type "hello" --submit
metavr ui wait --text "Loading" --absent --timeout 5000
metavr ui exists --id my\_button

`ui type` takes `--clear` to empty the field first. `ui wait` uses milliseconds and defaults to 10000, and `--absent` waits for the element to go away. `ui exists` exits with code 1 when the element is missing, so scripts can branch on it.
Other interface commands: `metavr ui actions`, `metavr ui list`, `metavr ui select`, `metavr ui swipe`, and `metavr ui scroll-to-find`.

metavr device wake
metavr device reboot
metavr audio set 8
metavr input key back

Volume runs from 0 to 15. `metavr audio mute`, `metavr audio unmute`, and `metavr audio status` cover the rest. `input key` takes a friendly name such as `home`, `enter`, `volume_up`, or `power`, or a raw Android key code, and `--count <N>` repeats it.

List windows with `metavr window list`, and see which one has focus with `metavr window focus`.

To prepare a device for automated testing:

metavr device configure-testing setup

This adjusts the device for test runs, for example by turning off animations and keeping the screen awake. Put it back with `metavr device configure-testing restore`.

Add `--json` to any command:

metavr device battery --json

`-d <DEVICE>` to pick one, or set a default with `metavr app clear` or `metavr files rm` fails inside a script or a continuous integration job.
- [Install Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-install): install the CLI and connect it to your AI agent.
- [Meta VR CLI overview](https://developers.meta.com/vr/essentials/metavr-overview): how the command line and the Model Context Protocol (MCP) server relate.

Support and legal

English (US)

© 2026 Meta
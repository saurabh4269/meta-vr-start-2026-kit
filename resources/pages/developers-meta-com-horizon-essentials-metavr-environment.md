# Set up your environment and tools | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/essentials/metavr-environment
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Essentials

Updated: Oct 21, 2026

Meta VR CLI (`metavr`) sets up and manages your development environment for Meta VR devices. Use it to check what you have installed, add developer tools and a simulator, and configure the CLI itself. This guide also covers sign-in and telemetry.

- Meta VR CLI installed. See [Install Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-install).
- A terminal on macOS or Linux, or PowerShell on Windows.
- A Meta account, if you plan to sign in. Nothing else here needs one.

metavr doctor

The command is read-only and takes no flags. It reports installed software in five groups:

- Meta developer tools
- Android Studio and the Meta Horizon plugin
- The Android software development kit (SDK)
- Java
- Installed Unity editors

It does not test device connections, sign-in, or agent setup. It ends by pointing you at `metavr init` or at a specific `metavr tools install` command for anything missing.

metavr tools list

The list reflects your operating system and your account access, so treat what you see on your own machine as authoritative over any printed table.

metavr tools info spatialsim
metavr tools install spatialsim

`install` takes these flags:
- `--connections <N>` sets parallel download connections, from 1 to 16.
- `--elevate` requests elevation on Windows.
- `--status` reports install progress instead of installing.

To manage what you have:

metavr tools update \<TOOL>
metavr tools update --all
metavr tools uninstall \<TOOL>
metavr tools launch \<TOOL>

`uninstall` and `launch` only handle installs that metavr created. A copy you installed yourself is detected but left alone. `--` through to the tool.
Tools available on a public build include:

| Tool | What it is | Platforms | 
|---|---|---|
| `spatialsim` (alias `ssim`) | Meta Spatial Simulator, an Android emulator for spatial computing development | macOS arm64, Windows | 
| `xrsim` | Meta XR Simulator | macOS arm64, Windows | 
| `renderdoc` | Meta’s fork of the RenderDoc graphics debugger | macOS arm64, Windows | 
| `perfetto` | Perfetto trace processor, used by the performance commands | all | 
| `platform-utils` (alias `ovr-platform-util`) | Submits builds to the Meta Horizon Store | macOS, Windows, Linux | 
| `haptics-studio` | Meta Haptics Studio, for designing controller haptics | macOS arm64, Windows | 
| `spatial-editor` | Meta Spatial Editor, a 3D scene editor | macOS, Windows, Linux | 

Meta VR CLI drives two different simulators. Choose the one that matches your app:

- **Meta Spatial Simulator** runs 2D panel apps. Use `metavr ssim`.
- **Meta XR Simulator** runs immersive OpenXR apps on macOS and Windows. Use `metavr xrsim`.

`metavr ssim` (alias `emu`) drives Meta Spatial Simulator:
metavr ssim download
metavr ssim start
metavr ssim status
metavr ssim stop

Spatial Simulator renders 2D panel apps. It has no VR (OpenXR) runtime, so a fully immersive app cannot run on it. Test immersive apps on a device, or with Meta XR Simulator. To build the 2D apps it does run, see [Android apps](https://developers.meta.com/vr/develop/android-apps/).

`download` takes `--force` to re-download and reinstall over an existing install.`start` takes `--name <N>`, `--release-build`, `--force-sync`, and `--wipe-data`. Keep it current with `metavr ssim check-update` and `metavr ssim update`. `update` takes `-y`/`--yes` to skip the confirmation prompt, for plugin and other non-interactive use.`--developer-platform <PLATFORM>` and `--developer-platform-session-id <ID>`. Both attribute telemetry to the calling platform.
To manage the simulated account inside the emulator:

metavr ssim auth login
metavr ssim auth status
metavr ssim auth logout

All three take `-s`/`--serial` to name a target when more than one simulator is running. `ssim auth login` also takes `--access-token`, `--user-id`, `--profile-token`, and `--profile-id`.

`metavr xrsim` drives Meta XR Simulator on macOS and Windows, so you can test
immersive OpenXR apps without a device. Connection flags: `--port` (default 33794), `--runtime-addr`, and `--timeout` (default 5.0). The root-level `--format table|json|plain` option selects the output form, as it does for every `metavr` command.
Its subcommands group by what they control:

| Group | Subcommands | 
|---|---|
| `runtime` | `activate`, `deactivate`, `ping`, `status`, `info`, `fps`, `logs`, `list` | 
| `app` | `launch`, `quit`, `ensure-running` | 
| `device` | `set`, `ipd`, `refresh-rate`, `list`, `refresh-rates` | 
| `env` | `set`, `list` | 
| `input` | `source`, `controller`, `headset`, `point-and-click`, `follow`, `speed`, `compatibility-mode`, `sync`, `sources` | 
| `layer` | `toggle`, `list` | 

metavr xrsim runtime activate
metavr xrsim runtime status
metavr xrsim device list
metavr xrsim runtime logs --tail 50

What each command needs:

- `runtime logs` reads local log files. Nothing has to be running. It takes `--tail <N>` to print the last N lines of each log.
- `runtime activate`, `runtime deactivate`, `runtime list`, and the `app` and `env` groups act on the frontend or the system.
- `runtime ping`, `status`, `info`, `fps`, and the `device`, `input`, and `layer` groups need the frontend running with your application connected. They
report a no-runtime or no-app state when it is not.

`runtime activate` and `runtime deactivate` set the system-wide OpenXR runtime, so they can prompt for administrator access.
metavr config list
metavr config get output-format
metavr config set output-format json
metavr config reset output-format

There are four settable keys:

| Key | Meaning | Values | Default | 
|---|---|---|---|
| `adb-path` | Path to the Android Debug Bridge (ADB) executable. `set` verifies the path and refuses a broken one. `reset` returns to auto-detect. | a path | auto-detect | 
| `default-device` | Device serial used when you omit `--device` | non-empty string | not set | 
| `output-format` | Default output format | `table`, `json`, `plain` | `table` | 
| `color` | Colored output | `true`, `false` | `true` | 

`metavr config get` also reports where a value came from. `metavr config path` prints the settings file, and `metavr config path --auth` prints the credential file.
Config lives in `~/.config/metavr/` on Linux, `~/Library/Application Support/metavr/` on macOS, and `%APPDATA%\metavr\` on Windows. Override it with `METAVR_CONFIG_DIR`. If you used the CLI under its former name, your settings and credentials are copied forward once, automatically.

metavr unity editors list
metavr unity editors releases
metavr unity editors install \<VERSION> --modules android
metavr unity editors add-modules \<VERSION> --modules android

`--modules` takes a comma-separated list. Add `--cm` to include child modules. Module names include `android`, `android-sdk-ndk-tools`, `android-open-jdk`, `ios`, `linux`, `webgl`, and `visualstudio`.
metavr unity projects list
metavr unity projects status
metavr unity projects open \<PROJECT\_PATH>
metavr unity projects close

`projects list` takes an optional search path, and `--depth` defaults to 3. `projects open` uses the editor version the project already targets, and waits up to 30 seconds unless you pass `--no-wait`.
metavr auth status
metavr auth login
metavr auth logout

`auth status` takes `--quick` to skip the network check, or `--validate` to probe the API. `auth login` opens your browser. `auth logout` takes `--local-only` to clear this machine while leaving the Meta-side session alone.
Tokens live in your operating system credential store under the service name `Meta VR CLI`. Only Meta Horizon Store commands require signing in.

metavr telemetry status
metavr telemetry enable
metavr telemetry disable
metavr telemetry about

There are two tiers. `enable` opts in to additional analytical telemetry, and `disable` returns to essential only. Essential data is collected either way, and `disable` says so.

When you are signed in, your preference syncs to your Meta account. When you are signed out it applies to this machine, and the CLI tells you it did not sync.

TapeDeck is an OpenXR API layer. It records a session on a device, then replays it into a later run of the same app. Use it for repeatable performance runs, and to reproduce input-dependent bugs without wearing the device.

metavr tapedeck doctor
metavr tapedeck bundle-apk --in app.apk --out app-tapedeck.apk
metavr tapedeck record -p com.example.myapp
metavr tapedeck stop
metavr tapedeck replay -p com.example.myapp
metavr tapedeck list
metavr tapedeck pull

`tapedeck doctor` checks the host tools it needs. `record` takes `--duration-ms`, which defaults to five minutes.`metavr tapedeck install` and `metavr tapedeck uninstall` appear in the help output but need access that is off by default. Use `bundle-apk` instead, which needs none.
metavr store dist apps --org \<ORG\_ID>
metavr store dist channels --app-id \<APP\_ID>
metavr store dist upload --app-id \<APP\_ID> --channel BETA --apk app.apk --notes "Build notes"
metavr store dist copy-build --binary-id \<BINARY\_ID> --to-channel \<CHANNEL\_ID>

`--channel` takes `ALPHA`, `BETA`, `RC`, or `LIVE`. Add `--obb <PATH>` for an expansion file. Uploads create a draft; add `--publish` to publish straight away.
metavr store test-user list --org \<ORG\_ID>
metavr store test-user create --org \<ORG\_ID> --username-prefix testuser --email-prefix testuser --password \<PASSWORD>

Every `metavr store` command requires signing in. `upload` also needs the `platform-utils` tool from step 2.

`metavr xroperator` connects the CLI to the Agentic XR layer running on a device. The aliases `meta-xr-operator` and `agentic-xr` resolve to the same command.
metavr xroperator status
metavr xroperator detect
metavr xroperator enable
metavr xroperator disable
metavr xroperator readme

`status` reports whether it is installed, whether the server is running, and the federation state. `detect` sets up a port forward to the on-device layer, connects to its server, and lists the tools it publishes, including whether live input control is available. `readme` prints the path to the bundled getting-started document. To call one tool directly, run `metavr xroperator call <TOOL_NAME>`.`metavr tools launch <TOOL>` does nothing for a tool you know is on the machine.`metavr tools install` to manage it here.`metavr store` command fails and tells you to sign in.`metavr auth login`, then run the command again.
- [Install Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-install): install the CLI and connect it to your AI agent.
- [Meta VR CLI overview](https://developers.meta.com/vr/essentials/metavr-overview): how the command line and the MCP server relate.
- [Work with devices and apps](https://developers.meta.com/vr/essentials/metavr-devices-and-apps): connect a device and manage builds.
- [Profile and debug performance](https://developers.meta.com/vr/essentials/metavr-performance): capture and analyze a trace.
- [Troubleshoot Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-troubleshooting): agent connection, sign-in, and update problems.

Support and legal

English (US)

© 2026 Meta
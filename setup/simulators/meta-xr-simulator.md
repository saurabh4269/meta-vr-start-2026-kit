# Meta XR Simulator (Unity + Unreal)

Lightweight **OpenXR runtime** that simulates Meta VR devices on your computer. Current: **v207.1** for Windows and Mac ARM (adds AMD GPU support and grab/pinch from camera hand tracking) — [Windows pkg](https://developers.meta.com/horizon/downloads/package/meta-xr-simulator-windows/), [Mac ARM pkg](https://developers.meta.com/horizon/downloads/package/meta-xr-simulator-mac-arm/). Docs: [intro](https://developers.meta.com/horizon/documentation/unity/xrsim-intro/), [Unity getting started](https://developers.meta.com/horizon/documentation/unity/xrsim-getting-started), [Unreal getting started](https://developers.meta.com/horizon/documentation/unreal/xrsim-getting-started).

## OS support
| OS | Status | Source |
|---|---|---|
| Windows 10+ 64-bit | ✅ Unity + Unreal editor integration | [Unity GS](https://developers.meta.com/horizon/documentation/unity/xrsim-getting-started), [Unreal GS](https://developers.meta.com/horizon/documentation/unreal/xrsim-getting-started) |
| macOS (Apple Silicon) | ✅ Unity (needs **Unity OpenXR Plugin ≥ 1.13.0**); Unreal editor integration is Windows-only | same |
| Linux | ⚠ A "Meta XR Simulator (Linux)" entry appears on the [downloads index](https://developers.meta.com/horizon/downloads/unity/), but its package page returned 404 / "make sure you're signed in" on 16 Nov 2026. Treat as unavailable unless you can open it while signed in. | — |

Graphics APIs: Vulkan; D3D11/D3D12 on Windows; Metal on macOS; **no OpenGL** ([intro](https://developers.meta.com/horizon/documentation/unity/xrsim-intro/)).

## Install / activate — Unity
From [Unity getting started](https://developers.meta.com/horizon/documentation/unity/xrsim-getting-started):
1. Use Meta XR Core SDK v207+ (current 209.0). The simulator is now **standalone** — the old `com.meta.xr.simulator` UPM package is deprecated; remove it if present.
2. Activate via the XR Simulator icon next to the Play button, or **Window → Meta → Meta XR Simulator → Activate**. Console shows `[Meta XR Simulator is activated]`.
3. Press **Play**; the simulator window opens.
4. Pick a **Device** profile (Quest 2 / Pro / 3 / 3S, Rift S, Meta VR Glasses). Stop and re-enter Play mode after changing it — the profile binds when the app creates its OpenXR instance.

CLI alternative (macOS/Windows): `metavr xrsim runtime activate|status|fps|logs`, `metavr xrsim device set …`, `metavr xrsim env set …`, `metavr xrsim input source …` ([Meta VR CLI environment](https://developers.meta.com/horizon/essentials/metavr-environment)).

## Install / activate — Unreal (Windows)
From [Unreal getting started](https://developers.meta.com/horizon/documentation/unreal/xrsim-getting-started):
1. VR project (VR Template is fine).
2. **Project Settings → Plugins → Meta XR → XR API = Epic Native OpenXR** (default).
3. Main toolbar → **Meta XR Simulator** dropdown → tick the **Meta XR Simulator** toggle → let the editor restart itself (**OK**; a manual restart doesn't apply it).
4. Click **VR Preview**.

## Simulating hands (the competition's core input)
From [input & keyboard](https://developers.meta.com/horizon/documentation/unity/xrsim-input-keyboard/), [camera tracking](https://developers.meta.com/horizon/documentation/unity/xrsim-camera-tracking/):
- **Inputs → Left input / Right input → Hand** (Controller / Hand / None; *Look and Pinch* on the Meta VR Glasses profile sets both sides).
- Keyboard + mouse: WASD to move, hold right mouse to look; gesture/hand-action keys are listed under **Input bindings → Hand actions**. An Xbox controller can't trigger hand gestures (and only works on Windows).
- **Camera tracking (v207+)**: Inputs → **Camera tracking → Enable camera**; when status reads `Streaming`, your real hands in front of the webcam drive the simulated hands (Windows or macOS webcam). Limits: hands outside the frame have no pose; depth is approximate; not equivalent to headset tracking.
- Quest controller **data forwarding** is also available ([data forwarding](https://developers.meta.com/horizon/documentation/unity/xrsim-data-forwarding/)).

## Synthetic environments (MR / MRUK testing)
From [synthetic environments](https://developers.meta.com/horizon/documentation/unity/xrsim-heroscenes/), [Synthetic Environment Builder](https://developers.meta.com/horizon/documentation/unity/xrsim-synthetic-environment-builder/):
- Toolbar → **Choose environment**: game room, living room, bedroom + six feature rooms, each with scene data (walls, floors, furniture, doors, windows) and spatial anchors.
- **Environment depth** queries work on Windows only.
- Build your own rooms with the **Synthetic Environment Builder** (package v60 — [pkg](https://developers.meta.com/horizon/downloads/package/meta-xr-simulator-synthetic-environment-builder/)). Testing multiple rooms is the cheapest way to approach the judging line "holding up in rooms the developer never tested".

## Session capture (repeatable test runs)
[Session capture](https://developers.meta.com/horizon/documentation/unity/xrsim-session-capture/): header → **Record session** → save `.vrs` → interact → **Stop recording**; replay with the **Upload VRS file** button. Automate with a `session_capture` block in `persistent_data.json` (`%APPDATA%\MetaXR\MetaXrSimulator\` on Windows, `~/Library/Application Support/MetaXR/MetaXrSimulator/` on macOS); remove the block afterwards or it replays again. This records *inputs*, not video.

Multiplayer: run several simulator instances ([multiplayer](https://developers.meta.com/horizon/documentation/unity/xrsim-multiplayer/)).

## Recording demo footage
Rules allow footage "via XR Simulator or another equivalent emulator" ([rules §4.9](https://start-developer-competition-26.devpost.com/rules)). Meta's simulator docs don't describe a built-in video recorder — ⚠ unverified suggestion: screen-record the simulator window with OBS / Xbox Game Bar (Windows) / ⇧⌘5 (macOS), using a Session Capture replay so takes are repeatable. Judges want "real gameplay that honestly represents the experience" ([rules §6](https://start-developer-competition-26.devpost.com/rules)), so mix in headset footage once you have the Quest.

## Limits
- No true Quest performance numbers (desktop GPU); the simulator's FPS readout (`metavr xrsim runtime fps`) is your PC's, not the headset's.
- Simulated hands ≠ real hand tracking (no real jitter/occlusion behaviour); webcam tracking is approximate.
- No real passthrough camera feed; synthetic rooms only.
- Unreal integration Windows-only; macOS Apple Silicon only; Linux unconfirmed.

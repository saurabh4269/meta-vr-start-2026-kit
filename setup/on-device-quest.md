# On-device setup & testing (Meta Quest 3 / 3S)

Judges review on **Quest 3 or Quest 3S** ([FAQ](https://start-developer-competition-26.devpost.com/details/faqs)). Simulators are fine for iteration, but hand-tracking feel, passthrough/MRUK and the 60 fps bar can only be truly verified on the headset.

## One-time headset setup
Follow §3 of [00-prerequisites.md](00-prerequisites.md) (developer mode via the Meta Horizon app, USB debugging, MTP notification). Then check:

```bash
adb devices            # should list your headset with status "device"
```
Source: [Software Setup](https://developers.meta.com/horizon/documentation/unity/unity-software-setup), [ADB guide](https://developers.meta.com/horizon/documentation/unity/ts-adb/).

Wireless ADB (from the ADB guide): with USB connected run `adb tcpip <port>`, find the headset IP (`adb shell ip route`), then `adb connect <ip>:<port>`. Helper: `scripts/quest-adb.sh wifi` (Windows: `scripts/quest-adb.ps1 wifi`). Full Windows device + Link setup: [windows.md](windows.md).

Turn on hand tracking in the headset settings and put controllers down so the hands-only path is what you test. ⚠ unverified menu path (not in a fetched doc): Settings → Movement tracking → Hand and body tracking.

## Install, run, debug
| Task | Command | Source |
|---|---|---|
| Install / reinstall APK | `adb install -r app.apk` (or `metavr app install app.apk`) | [ADB](https://developers.meta.com/horizon/documentation/unity/ts-adb/), [Spatial Sim/CLI](https://developers.meta.com/horizon/documentation/android-apps/spatial-sim-overview/) |
| Launch | `metavr app launch com.your.package` | same |
| Logs | `adb logcat -c` then `adb logcat` (filter `-s Unity` for Unity) | [ADB](https://developers.meta.com/horizon/documentation/unity/ts-adb/) |
| Screenshot | `metavr capture screenshot -o shot.png` | [Spatial Sim](https://developers.meta.com/horizon/documentation/android-apps/spatial-sim-overview/) |
| Perf trace | `metavr perf capture --app com.your.package --mode vr --duration 10000` then `metavr perf analyze-trace` | [Meta VR CLI performance](https://developers.meta.com/horizon/essentials/metavr-performance) |
| FPS overlay / logging | OVR Metrics Tool (in-headset) | [OVR Metrics Tool](https://developers.meta.com/horizon/documentation/unity/ts-ovrmetricstool) |
| WebXR on Quest | Open the dev-server **Network** URL in Meta Quest Browser (same Wi-Fi) and accept the cert, or forward the port via `chrome://inspect/#devices` | [IWSDK ch.2](https://iwsdk.dev/guides/02-testing-experience.html), [MQDH for Browser](https://developers.meta.com/horizon/documentation/web/browser-mqdh) |

All wrapped in [`scripts/quest-adb.sh`](../scripts/quest-adb.sh) and [`scripts/quest-adb.ps1`](../scripts/quest-adb.ps1).

## Verifying the 60 fps requirement
Judging requires **min 60 fps** on Quest hardware ([rules §6](https://start-developer-competition-26.devpost.com/rules) → [VRC.Quest.Performance.1](https://developers.meta.com/horizon/resources/vrc-quest-performance-1/)). VRC test: use the app for its full length (or 45 min, whichever is shorter), open the OVR Metrics Tool log and check for no extended periods under 60 fps (30 fps allowed when using Application SpaceWarp). Interactive apps must run at 72/80/90/120 Hz refresh. Loading screens/fades are exempt.

Method from [Test your app](https://developers.meta.com/vr/essentials/test-your-app/): turn dynamic resolution off, fix foveation at one level, run one repeatable scene + interaction sequence, change one thing, re-run; decide CPU- vs GPU-bound from the trace.

## FoV-aware check (judged under Experience Design)
Meta VR Glasses have a narrower FoV (simulator profile: 37° temporal/nasal, 34° up/down per eye). On a Quest 3S/3, use the Meta VR CLI FoV simulation workflow or Unity's in-headset FoV simulation toggle: [FOV simulation](https://developers.meta.com/horizon/documentation/unity/in-headset-fov-simulation/), [Test your app](https://developers.meta.com/vr/essentials/test-your-app/).

## Hands-only acceptance test (rules: "can someone complete the entire experience without ever pairing a controller?")
From [Test your app → without controllers](https://developers.meta.com/vr/essentials/test-your-app/):
1. Turn controllers off. 2. Start the app — no controller prompt should appear. 3. Complete **every** flow with hands (and eyes on Glasses): navigation, dialogs, scrolling, pause/resume, exit. 4. Repeat on a fresh install.

## Mixed-reality / MRUK
Scene data (walls, tables, global mesh) comes from the headset's room scan; your app must request the **Scene** permission (Unity: OVRManager → Permission Requests On Startup → Scene; then Meta → Tools → Update AndroidManifest.xml) — [MRUK getting started](https://developers.meta.com/horizon/documentation/unity/unity-mr-utility-kit-gs). MRUK can also be tested in-Editor with simulated rooms or live device data over Link (same page). ⚠ unverified (community reports, see [research/accessibility-and-pitfalls.md](../research/accessibility-and-pitfalls.md)): the room scan itself must be done on the headset (Settings → Environment/Space Setup), not over Link. Judges' rooms differ from yours — the rules ask that MR content "hold up in rooms the developer never tested", so test in at least 2 real rooms and in the simulator's synthetic rooms ([simulators/meta-xr-simulator.md](simulators/meta-xr-simulator.md)). If no scan exists, fall back gracefully (e.g. [Environment Raycasting](https://developers.meta.com/vr/documentation/unity/unity-mr-utility-kit-environment-raycast)).

## Recording demo footage on the device
The rules allow footage "as viewed on a Meta Quest device or via XR Simulator or another equivalent emulator" ([rules §4.9](https://start-developer-competition-26.devpost.com/rules)). Rules also note apps may drop slightly below their frame rate while recording ([VRC.Quest.Performance.1](https://developers.meta.com/horizon/resources/vrc-quest-performance-1/)). ⚠ unverified (not in a fetched doc): in-headset recording via the Camera/Quick Settings record button. Documented Windows capture paths (MQDH Record, MQDH Cast, OBS, simulator window) are in [windows.md §10](windows.md#10-recording-the-under-3-minute-demo-video-on-windows).

# Windows setup (Quest 3 / 3S, hands-only, all six ideas)

This is the Windows-specific companion to the engine guides. Use it when you are developing on a **Windows 10 or 11** PC with a real **Quest 3 / 3S**. Linux and macOS notes stay in [00-prerequisites.md](00-prerequisites.md).

**Status of this guide.** Steps and version numbers were checked against official Meta, Unity, Google, Microsoft and (where fetchable) Epic pages on **16 Nov 2026**. This kit lives on a Linux box, so **none of the Windows installers, Quest Link, MQDH, or Unity-on-Windows flows were run here**. Treat every install step as **⚠ untested on a real Windows machine in this kit**, even when the wording comes from an official doc. Re-check download pages before you rely on a version number.

Items marked **⚠ unverified** are inference, community practice, or a fact I could not re-fetch live. They are not a sourced official requirement.

Name note: newer Meta docs call the desktop hub **Meta VR Developer Hub (MVDH)**. The Windows package and older pages still say **Meta Quest Developer Hub (MQDH)**. This guide uses **MQDH / MVDH** for the same app.

---

## Per-idea toolchain

These are the six ideas in [research/idea-shortlist.md](../research/idea-shortlist.md), mapped to the engine and Windows tools this kit recommends. You can still submit only one entry as the representative; the table is a build map, not a submission plan.

| Idea | Recommended engine | Why this engine | Windows toolchain |
|---|---|---|---|
| **Hands of a Master** | Unity + Meta XR All-in-One / Interaction SDK | Believable hand physics (path matching, pinch, overlay on a real page) is what Unity's Interaction SDK is for | Unity Hub + Editor 6000.0.66f2+ (6.1+ recommended) with Android modules; MQDH; Meta Horizon Link for Play-in-Editor; Meta XR Simulator for off-headset takes; `adb` / `scripts/quest-adb.ps1` to install and log; OVR Metrics Tool for the 60 fps check |
| **Mahabharat Chausar** | IWSDK / WebXR | Hand throws, pinch-grabs and a hosted URL are a natural WebXR loop; the kit starter already builds | Node.js (see §9); Chrome + Immersive Web Emulator / IWER; Quest Browser over LAN HTTPS or `adb reverse`; `chrome://inspect`; MQDH Browser / Cast for the demo video |
| **Artemis Flyby Chair** | Unity + Meta XR All-in-One | A large seated space scene at 60 fps is easier to profile and ship as an APK in Unity | Same Unity + Link + MQDH + XR Simulator + OVR Metrics path as Hands of a Master |
| **Code as Architecture (Repo City)** | Either (IWSDK first; Unity if the city gets heavy) | A readable repo-city can start on the web path; move to Unity if mesh density or hand physics outgrows the browser | IWSDK stack above, *or* the Unity + Link stack if you switch |
| **Sadak VR** | IWSDK / WebXR | Sadak is already a web / three.js app; a WebXR port stays in one stack | Same IWSDK + Quest Browser + `adb reverse` / LAN path as Chausar. Do not start the port until you say so; notes are in [research/sadak-vr-port.md](../research/sadak-vr-port.md) |
| **Giants & Hiders** | IWSDK / WebXR | Social, photo/zone clues and low join friction fit a hosted WebXR URL | Same IWSDK path; test two browsers / two headsets on one LAN. Multiplayer over Link is not required |

After this page: [unity.md](unity.md), [iwsdk-webxr.md](iwsdk-webxr.md), [unreal.md](unreal.md), [on-device-quest.md](on-device-quest.md), [simulators/](simulators/README.md), [submission-checklist.md](submission-checklist.md).

---

## 1. Windows version and GPU requirements (Link / Air Link)

Meta Horizon Link (wired **Link** or wireless **Air Link**) is **Windows-only**. It is the way you press Play in Unity or Unreal and see the scene on the headset without building an APK each time. Link is for iteration, not for proving the competition's 60 fps bar — that check is on-device ([Hardware Setup](https://developers.meta.com/horizon/documentation/unity/unity-env-device-setup), [Use Link for App Development](https://developers.meta.com/horizon/documentation/unity/unity-link)).

Official PC requirements ([Windows PC requirements for Meta Horizon Link](https://www.meta.com/help/quest/140991407990979), also linked from Meta as [requirements-quest-link](https://www.meta.com/help/quest/articles/headsets-and-accessories/oculus-link/requirements-quest-link/)):

| Component | Minimum | Recommended |
|---|---|---|
| Operating system | Windows 10 or Windows 11 | Windows 10 or Windows 11 |
| Processor | Intel i5-4590 / AMD Ryzen 5 1500X or greater | Intel i7 / AMD Ryzen 7 |
| Memory | 8 GB+ RAM | 16 GB DDR4 RAM |
| Graphics | A GPU on Meta's supported list (below) | Nvidia RTX 20 Series* / AMD Radeon RX 6000 Series |
| USB | 1× USB port | 1× USB-C port |

**NVIDIA, supported:** Titan X; GTX 970; GTX 1060 Desktop 6GB (not the 3GB or 1060M); GTX 1070 / 1080 (all); GTX 1650 Super (not the plain 1650); GTX 1660 / 1660 Ti; RTX 20-series except 2050; RTX 30 / 40 / 50-series. Meta does **not recommend** the RTX 3050 laptop or 3050 Ti for Link, and **does not support** RTX 2050.

**AMD, supported:** 400 / 500 / 5000 / 7000 series; Vega; Radeon 6600XT, 6700XT, 6800XT, 6900XT, 7700XT, 7800XT, 7900XT, 7900XTX; RX 9070 / 9070 XT. 200 and 300 series are not supported. Meta does **not recommend** the Radeon RX 6500.

**Not supported:** Intel Arc (Meta says support may come later), workstation cards, GTX 1050 Ti, Radeon RX 560. Check the live table before you buy or assume a laptop GPU works.

**Cable (wired Link):** a high-quality USB cable that carries **data and power**; Meta asks for **USB-C 3.2, at least 5 Gbps**, and suggests **at least 3 metres (10 feet)** so you can sit comfortably ([cable requirements](https://www.meta.com/help/quest/140991407990979), [set up Link and Air Link](https://www.meta.com/help/quest/articles/headsets-and-accessories/oculus-link/connect-with-air-link/)). Charge-only cables will not work. The branded [Meta Horizon Link Cable](https://www.meta.com/quest/accessories/link-cable/) is the known-good option. For colour passthrough over Link, Meta wants an effective USB bandwidth of **at least 2 Gbps** — use the in-app cable test (§2).

**Air Link:** same PC app and same PC requirements, plus a **Wi-Fi network (preferably 5 GHz)** with the PC and headset on the same network.

**Disk space for the PC app:** the getting-started page asks for **at least 4 GB** to install ([Getting started with Meta Horizon Link](https://www.meta.com/help/quest/1517439565442928/)); troubleshooting says the app **needs at least 9 GB available** if the installer fails ([troubleshoot Meta Horizon Link](https://www.meta.com/help/quest/articles/fix-a-problem/troubleshooting-oculus-link/troubleshooting-tips-oculus-link/)). Keep 9 GB free.

---

## 2. Install Meta Horizon Link and connect the headset

### Install the PC app

1. On the Windows PC, open [Getting started with Meta Horizon Link](https://www.meta.com/help/quest/1517439565442928/) and download the app (Meta also hosts the installer at [meta.com/quest/setup](https://www.meta.com/quest/setup) and, from the Unity Link docs, [oculus.com/download_app/?id=1582076955407037](https://www.oculus.com/download_app/?id=1582076955407037)).
2. Run the installer. Sign in with the same Meta account you use on the headset.
3. Keep the app and the headset OS up to date.

If the installer crashes, Meta's [troubleshooting page](https://www.meta.com/help/quest/articles/fix-a-problem/troubleshooting-oculus-link/troubleshooting-tips-oculus-link/) covers a clean reinstall (end Oculus/Meta processes, uninstall, delete leftover `C:\Program Files\Meta\` and `C:\Program Files\Oculus\` folders, temporarily disable antivirus/firewall, run the installer as Administrator, then re-enable security software).

### Wired Link

From [How to set up Meta Horizon Link and Air Link](https://www.meta.com/help/quest/articles/headsets-and-accessories/oculus-link/connect-with-air-link/):

1. Plug the USB-C 3.2 cable into a **USB 3.2 port** on the PC, then into the headset.
2. Press the Meta / Oculus button to open the Navigator.
3. Select the status bar at the top to open **Quick controls**.
4. Select **Link**, then the computer the headset is plugged into.
5. Select **Launch**.

Menu names have moved over time. The Unity developer page still says **Settings → Quest Link → toggle on → Launch Quest Link** ([unity-link](https://developers.meta.com/horizon/documentation/unity/unity-link)). Use whichever labels your current Horizon OS shows; the result should be a Link session to this PC.

The headset can use **only one** of Link or Air Link at a time. Turn Air Link off when you use the cable ([troubleshooting](https://www.meta.com/help/quest/articles/fix-a-problem/troubleshooting-oculus-link/troubleshooting-tips-oculus-link/)).

### Air Link (Wi-Fi)

Same help page:

1. Open the Meta Horizon Link app on the PC.
2. On the headset: Navigator → Quick controls → **Link** → turn on **Use Air Link**.
3. Select your PC → **Pair**. Confirm that the pairing code in the headset matches the one on the PC, then click **Confirm** in the PC app.
4. Select **Launch**.

Link and Air Link are on by default on a headset with current Horizon OS. To check or turn them off: Quick controls → **Settings** → **Link** → the Link toggle.

### Developer settings in the PC app (needed for Play-in-Editor)

From [Use Link for App Development](https://developers.meta.com/horizon/documentation/unity/unity-link):

1. **Settings → General → OpenXR Runtime → Set Meta Horizon Link as active.** Once it is active, the button greys out.
2. **Settings → Developer → Developer Runtime Features** on.
3. If you will test passthrough, the Passthrough Camera API, eye tracking, or natural face expressions over Link, turn those matching toggles on (they appear only after Developer Runtime Features is on). Accept the consent dialogs. **Restart Unity or Unreal** if the editor was already open.

### Test the cable

In the Meta Horizon Link app: **Devices** → your headset → **Device Setup** → **Link Cable** → **Test Connection**. You want a **Compatible connection**. For colour passthrough, effective bandwidth should be at least 2 Gbps. An **Incompatible connection** or low bandwidth usually means a different cable or a USB 2 / charge-only port ([unity-link](https://developers.meta.com/horizon/documentation/unity/unity-link)). You can re-run this later via **Devices** → **USB Test**.

**Reminder:** an app over Link is rendered on the PC. Looks and frame time will differ from a standalone Quest build. Always do a final **Build and Run** (or hosted WebXR on the headset) before you treat 60 fps as proven. Store builds do not get Link's developer/experimental features.

---

## 3. Developer mode (Meta Horizon mobile app)

Same official flow as [00-prerequisites.md §3](00-prerequisites.md), from [Software Setup](https://developers.meta.com/horizon/documentation/unity/unity-software-setup) and [Get Started with Meta VR Developer Hub](https://developers.meta.com/horizon/documentation/unity/ts-mqdh-getting-started/):

Prerequisites: verified Meta developer account, age 18+, no device-level restriction on developer mode.

1. Install the [Meta Horizon mobile app](https://www.meta.com/help/quest/articles/getting-started/getting-started-with-quest-2/install-meta-horizon-mobile-app/) on your phone and pair the headset.
2. Headset icon → your headset → **Headset Settings** → **Developer Mode** → toggle on.
3. Connect the headset to the Windows PC with a **data-capable USB-C cable**.
4. On the headset: Quick Control → Settings (gear) → **Developer** tab → turn **MTP Notification** on.
5. When the headset asks to **Allow USB debugging**, choose **Always allow from this computer**.
6. In MQDH / MVDH → **Device Manager**, the headset should show a green **Active** status.

Developer Mode is for development only; Meta warns that other uses can lead to account limits.

---

## 4. Meta Quest Developer Hub (MQDH / MVDH)

MQDH is the Windows (and macOS) companion for device management, APK install, logs, casting, recording, and Store uploads. There is **no Linux build**. Windows package seen 16 Nov 2026: **6.5.2** ([Windows package](https://developers.meta.com/horizon/downloads/package/oculus-developer-hub-win), [getting started](https://developers.meta.com/horizon/documentation/unity/ts-mqdh-getting-started/)).

### Install

1. Download [MQDH for Windows](https://developers.meta.com/horizon/downloads/package/oculus-developer-hub-win/).
2. Install, open it, and log in with the **same** Meta developer credentials used on the headset.
3. After developer mode and USB debugging (§3), open **Device Manager**. The active headset shows a green **Active** designator. If several headsets are connected, pick one from the drop-down.

A first-run USB driver prompt is common on Windows; if the device never appears, install the Oculus ADB driver (§5) and see [Troubleshooting MVDH](https://developers.meta.com/horizon/documentation/unity/ts-mqdh-troubleshooting/).

Useful Device Manager actions, from [Manage your device with MVDH](https://developers.meta.com/horizon/documentation/unity/ts-mqdh-basic-usage/) and [Debugging Tools (media)](https://developers.meta.com/horizon/documentation/unity/ts-mqdh-media/):

| Task | Where |
|---|---|
| Deploy an APK, launch / stop an app | Device Manager → Apps, or drag-and-drop install |
| Device logs | Device Manager / logs view |
| File transfer (screenshots, videos, metric CSVs) | **File Manager** → **On Device** or **Meta VR Developer Hub Local** |
| Turn off Guardian / boundary while you debug at the desk | Device Actions → **Boundary** (or `Ctrl+Shift+G`). Turn it back on when you are done |
| Keep the headset awake (proximity sensor off) | Device Actions → **Proximity Sensor** (or `Ctrl+Shift+P`). It turns itself back on about 10 minutes after you disconnect from MQDH |
| ADB over Wi-Fi | Device Actions → **ADB over Wi-Fi**, same Wi-Fi as the PC, then unplug USB |
| Start Link / Air Link from the hub | Device Actions → **Meta Quest Link** → Cable or Air Link |
| Open a URL in Quest Browser (handy for WebXR) | Device Actions → **Browser** → paste URL → **Open** ([Use MVDH with browser](https://developers.meta.com/horizon/documentation/web/browser-mqdh)) |
| Screenshots / recordings / cast | see §10 |

MQDH also has a **Performance Analyzer** (trace capture; recent Windows builds use Perfetto presets) and can surface OVR Metrics sessions in its file/trace UI. The on-headset **performance HUD** itself is **OVR Metrics Tool** (§6 and [OVR Metrics Tool](https://developers.meta.com/horizon/documentation/unity/ts-ovrmetricstool)), not a separate MQDH overlay. Pull recorded CSVs with File Manager from `/sdcard/Android/data/com.oculus.ovrmonitormetricsservice/files/CapturedMetrics/`.

---

## 5. adb on Windows, and scrcpy

You need `adb` on your **user PATH** for a terminal workflow. Installing MQDH is not enough: MQDH uses its own copy and does **not** add it to the PATH your PowerShell or Command Prompt uses ([Manage your device with MVDH](https://developers.meta.com/horizon/documentation/unity/ts-mqdh-basic-usage/)).

### Option A — Android SDK Platform-Tools (recommended if you are not in Unity yet)

Google's standalone package is [SDK Platform-Tools](https://developer.android.com/tools/releases/platform-tools) (Windows zip: `platform-tools-latest-windows.zip` on that page). Extract it, then add the `platform-tools` folder to your user Path:

1. Start → "environment variables" → **Environment Variables**.
2. Under your user variables, edit **Path** → **New** → the folder that contains `adb.exe` (for example `C:\platform-tools`).
3. Open a **new** PowerShell window and run `adb version`, then `adb devices`.

### Option B — Unity's bundled platform-tools

If Unity with Android modules is installed, `adb` is already at ([Software Setup](https://developers.meta.com/horizon/documentation/unity/unity-software-setup)):

```text
C:\Program Files\Unity\Hub\Editor\{version}\Editor\Data\PlaybackEngines\AndroidPlayer\SDK\platform-tools
```

Add that folder to Path instead of downloading a second copy.

### Option C — MQDH's bundled `adb.exe`

On Windows it lives in the `resources\bin` folder of the MQDH install. In MQDH: **Settings → General → ADB location → Edit**; the dialog shows the default folder. You can call `adb.exe` by that full path, or add the folder to Path for the current session only. **Use one adb everywhere.** If MQDH and your terminal run different versions, you get the **Another ADB instance found** warning; point MQDH's ADB location at the same `adb.exe` you use in the terminal ([same MVDH page](https://developers.meta.com/horizon/documentation/unity/ts-mqdh-basic-usage/)).

### Oculus ADB driver (Windows only)

If `adb devices` is empty after developer mode and a data cable, install Meta's OEM USB driver ([Software Setup](https://developers.meta.com/horizon/documentation/unity/unity-software-setup), [ADB guide](https://developers.meta.com/horizon/documentation/unity/ts-adb/), [driver package](https://developers.meta.com/horizon/downloads/package/oculus-adb-drivers/)):

1. Download and extract `oculus-adb-driver-2.0`.
2. Open `usb_driver\`, right-click `android_winusb.inf` → **Install**.
3. Replug the headset, accept **Always allow** USB debugging, run `adb devices` again. You want the status `device`. `unauthorized` means the in-headset prompt was dismissed; unplug, replug, and accept it.

Other USB tips from the ADB guide: try another cable or port; stop a running VR app and `adb kill-server` if the device was connected mid-session.

### Wireless adb

USB-connected, same Wi-Fi: `adb tcpip 5555`, read the headset IP from `adb shell ip route` (the address after `src`), then `adb connect <ip>:5555`. Or toggle **ADB over Wi-Fi** in MQDH. Helper: `scripts/quest-adb.ps1 wifi`.

### scrcpy (optional mirror / record)

[scrcpy](https://github.com/Genymobile/scrcpy) is a third-party tool (not a Meta product) that mirrors and can record the Android display over adb. Official Windows install ([scrcpy Windows doc](https://github.com/Genymobile/scrcpy/blob/master/doc/windows.md), v5.0.1 seen 16 Nov 2026):

- Download the [latest official zip](https://github.com/Genymobile/scrcpy/releases/latest) (`scrcpy-win64-….zip` on a 64-bit PC) and extract it, or
- `winget install --exact Genymobile.scrcpy`

Then, with the headset authorised in `adb devices`:

```powershell
scrcpy
scrcpy --no-audio --record=demo.mkv
```

For the competition demo video, prefer MQDH's own record/cast path (§10): it is encoded from the headset compositor, includes guidance on audio, and is what Meta documents for Quest footage. scrcpy is a useful fallback when you want a raw Android display mirror. ⚠ whether scrcpy's picture is a clean stereo/compositor view or a 2D Android surface depends on what the OS is showing; verify a test clip on your headset before you use it as submission footage.

### Helper script

[`scripts/quest-adb.ps1`](../scripts/quest-adb.ps1) is the PowerShell counterpart of `scripts/quest-adb.sh` (`devices`, `install`, `logcat`, `wifi`, `disconnect`, `perf`). ⚠ It has not been run on a Windows machine in this kit.

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\quest-adb.ps1 devices
.\scripts\quest-adb.ps1 install .\app.apk
.\scripts\quest-adb.ps1 logcat Unity
.\scripts\quest-adb.ps1 wifi          # default port 5555
```

Set `ANDROID_SERIAL` to pick one device when several are listed, same as `adb -s`.

### Meta VR CLI on Windows (optional)

In PowerShell ([Install Meta VR CLI](https://developers.meta.com/horizon/essentials/metavr-install)):

```powershell
iwr -useb https://developers.meta.com/horizon/install-cli/windows/ | iex
metavr --version
metavr doctor
```

The installer defaults to `%USERPROFILE%\.metavr\bin` and updates your user Path; open a new terminal afterwards. Or: `npx metavr@latest init` (needs Node.js 18+).

---

## 6. Unity on Windows

Engine detail lives in [unity.md](unity.md). This section is the Windows-shaped path.

### Editor version and modules

From [Software Setup](https://developers.meta.com/horizon/documentation/unity/unity-software-setup), [Set up Unity for VR development](https://developers.meta.com/horizon/documentation/unity/unity-project-setup/), and [Hardware and software requirements](https://developers.meta.com/horizon/documentation/unity/unity-development-requirements/):

1. Create a [Unity ID](https://id.unity.com/) if you do not have one.
2. Install [Unity Hub](https://unity.com/download).
3. Install **Unity Editor 6000.0.66f2 or later**, with:
   - **Android Build Support**
   - **OpenJDK**
   - **Android SDK & NDK Tools**
4. Meta's project-setup page **recommends 6.1 or later**. **6000.0** is the Unity 6 LTS line; 6.1 / 6.3 may also be LTS depending on the date you install. The All-in-One SDK page (209.0 as of 16 Nov 2026) lists a **minimum of 6000.0.66f2**. Install at least that, prefer a current 6.x LTS that still meets the SDK minimum, and re-check [the All-in-One package page](https://developers.meta.com/horizon/downloads/package/meta-xr-sdk-all-in-one-upm/) before you commit.

If the editor is already installed without Android modules: Hub → **Installs** → gear → **Add Modules**.

Development OS: **Windows 10+ 64-bit** is listed for building standalone Meta VR apps ([unity-development-requirements](https://developers.meta.com/horizon/documentation/unity/unity-development-requirements/)).

### Project, SDK, Project Setup Tool

Follow [unity.md](unity.md): create the project from MQDH **XR Projects** or manually; add **Meta XR All-in-One SDK** (209.0 as of 16 Nov 2026) plus Interaction SDK as needed; delete the default Main Camera; run **Meta → Tools → Project Setup Tool** on the Standalone and Android tabs; enable the **Meta XR** OpenXR feature group for Standalone **and** Android.

For Play-over-Link, also enable a Plug-in Provider (OpenXR) under **Edit → Project Settings → XR Plug-in Management → Windows, Linux and Mac** ([unity-link](https://developers.meta.com/horizon/documentation/unity/unity-link)). Set **Hand Tracking Support** to **Hands Only** (or Controllers and Hands if you keep an optional controller path — then you must still pass a hands-only playthrough).

### Play in the editor via Link

1. Start a Link or Air Link session (§2).
2. Confirm Meta Horizon Link is the active OpenXR runtime and Developer Runtime Features are on.
3. In Unity, press **Play**. Tracking (including hands) comes from the headset; you will see the scene in the headset and on the PC monitor.

This is the fast loop for Hands of a Master and the Artemis flyby. It does **not** replace an on-device APK for performance, passthrough quality, or Store-feature checks.

### Build and Run to the Quest

USB-connected, developer mode on, `adb devices` shows `device`:

**File → Build Profiles → Meta Quest** (Unity 6.1+; on earlier 6.0 use **Android**) → **Enable / Switch Platform** → **Build and Run** ([Build Configuration](https://developers.meta.com/horizon/documentation/unity/unity-build), [Unity Meta Quest build profile](https://docs.unity3d.com/6000.3/Documentation/Manual/xr-meta-quest-build-profile.html)). Output is an APK. You can also `.\scripts\quest-adb.ps1 install app.apk`.

Then check 60 fps with **OVR Metrics Tool** (install from the [Meta Horizon Store](https://www.meta.com/experiences/ovr-metrics-tool/2372625889463779/) *before* launching your app): enable the persistent overlay / CSV recording, run a repeatable hands-only sequence, and confirm you do not sit under 60 fps ([OVR Metrics Tool](https://developers.meta.com/horizon/documentation/unity/ts-ovrmetricstool), [VRC.Quest.Performance.1](https://developers.meta.com/horizon/resources/vrc-quest-performance-1/)). Upload goes to a **new** release channel named **Competition** — [unity.md §7](unity.md#7-upload-to-a-release-channel-named-competition--invite-url).

---

## 7. Meta XR Simulator on Windows

Windows is a first-class host: **Windows 10+ 64-bit**, Vulkan or D3D11/D3D12 (no OpenGL). Current standalone package seen 16 Nov 2026: **207.1** ([Windows package](https://developers.meta.com/horizon/downloads/package/meta-xr-simulator-windows/), [Unity getting started](https://developers.meta.com/horizon/documentation/unity/xrsim-getting-started), fuller notes in [simulators/meta-xr-simulator.md](simulators/meta-xr-simulator.md)).

**Unity:** use Meta XR Core / All-in-One v207+. The old `com.meta.xr.simulator` UPM package is deprecated — remove it if it is still in the project. Activate with the XR Simulator icon next to Play, or **Window → Meta → Meta XR Simulator → Activate**, then press Play. Pick a **Quest 3 / 3S** device profile; stop and re-enter Play after changing it.

**Hands in the simulator (useful for demo footage without wearing the headset):**

- Inputs → Left / Right input → **Hand**. Keyboard/mouse gesture bindings are under **Input bindings → Hand actions** ([input & keyboard](https://developers.meta.com/horizon/documentation/unity/xrsim-input-keyboard/)).
- **Camera tracking (v207+):** Inputs → **Camera tracking → Enable camera**. When the status is `Streaming`, your real hands in the webcam drive the simulated hands. Depth is approximate; hands leave tracking when they leave the frame. Meta is explicit: this is not a substitute for headset tracking ([camera tracking](https://developers.meta.com/horizon/documentation/unity/xrsim-camera-tracking/)).

**Synthetic environments** (MR / MRUK): toolbar → **Choose environment** (game room, living room, bedroom, feature rooms with scene data and anchors). **Environment depth** queries are **Windows-only**. Custom rooms: [Synthetic Environment Builder](https://developers.meta.com/horizon/documentation/unity/xrsim-synthetic-environment-builder/).

**Session capture** records *inputs* to a `.vrs` file (not video), stored under `%APPDATA%\MetaXR\MetaXrSimulator\` on Windows. Replay a take, then screen-record the simulator window (§10).

CLI: `metavr xrsim runtime activate|status|fps|logs`, `metavr xrsim device set …`, `metavr xrsim env set …`.

The simulator runs on your PC GPU. Its FPS number is not a Quest 3/3S figure.

---

## 8. Unreal on Windows (brief)

Windows is the most complete Unreal + Meta path: the editor, the Meta XR plugin, **Meta XR Simulator editor integration**, and Link all work here. macOS has no XR Simulator editor integration; Linux is a poor fit for Meta's Unreal Quest workflow. Details: [unreal.md](unreal.md).

From [Install the Meta XR plugin](https://developers.meta.com/horizon/documentation/unreal/unreal-quick-start-install-metaxr-plugin/) and [prerequisites](https://developers.meta.com/horizon/documentation/unreal/unreal-quick-start-install-prerequisites/):

1. Meta developer account, verified, in an org; Epic Games account linked to GitHub if you use the fork.
2. **Recommended by Meta:** build Unreal from the [Oculus-VR fork](https://github.com/Oculus-VR/UnrealEngine) (plugin + extra XR fixes).
3. **Or** install **UE 5.8** from the Epic Games Launcher and drop the [Unreal Meta XR plugin](https://developers.meta.com/horizon/downloads/package/unreal-engine-5-integration/) (209.0, targets UE 5.8.0 as of 16 Nov 2026) into `<UE>\Engine\Plugins\Marketplace`, then enable **Meta XR** under **Edit → Plugins**.
4. Create a project from the **Games → Virtual Reality** template. Set **Hand Tracking Support** to Hands Only (or Controllers and Hands) and **Hand Tracking Frequency** to **High**.

**Android toolchain (Windows):** Meta's Unreal pages linked from Devpost do not pin Android Studio / NDK / JDK versions. Use Epic's current docs for the engine you installed, and prefer Epic's automated installer:

- [Android development requirements](https://dev.epicgames.com/documentation/en-us/unreal-engine/android-development-requirements)
- [Setting up Android SDK and NDK](https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-android-sdk-and-ndk-for-your-unreal-engine-development-environment)
- In a recent editor: **Platforms → SDK Management → Android → Install SDK** (Turnkey). That flow is described in Epic's Android setup docs; ⚠ the exact Android Studio / NDK / JDK numbers should be read from those pages for **UE 5.8**, because the live Epic docs are scripted pages and could not be extracted in this pass.

Package with **Android (ASTC)** and run the generated `Install_*.bat` in the output folder, or use **Project Launcher** ([Unreal Android IDE guide](https://developers.meta.com/horizon/documentation/unreal/unreal-ide-guide-android/)). Upload via the **Meta XR Platform Window**, channel name **Competition**.

None of the six priority ideas *require* Unreal. Use it only if you already prefer that engine.

---

## 9. IWSDK / WebXR on Windows

Engine detail: [iwsdk-webxr.md](iwsdk-webxr.md). The web path is fully supported on Windows (and is the recommended path for Chausar, Sadak VR, and Giants & Hiders).

### Node.js and the starter

IWSDK needs **Node 20.19+**, **22.12+**, or **24+** ([IWSDK project setup](https://developers.meta.com/horizon/documentation/iwsdk/guides/01-project-setup/)). Install a current [Node.js LTS](https://nodejs.org/) that meets that floor (the LTS line on 16 Nov 2026 is fine if it is 20.19+, 22.12+, or 24+). Confirm with `node -v` and `npm -v`.

```powershell
cd templates\iwsdk-starter
npm ci
npm run dev     # HTTPS dev server + built-in IWER emulator
npm run build   # dist\ for GitHub Pages or Vercel
```

WebXR requires **HTTPS**. The IWSDK dev server uses a locally generated certificate ([testing guide](https://developers.meta.com/horizon/documentation/iwsdk/guides/02-testing-experience/)).

### Desktop: Chrome + Immersive Web Emulator

- IWER is injected automatically on localhost when you `npm run dev`. Toolbar → **Toggle input mode** for hands. See [immersive-web-emulator.md](simulators/immersive-web-emulator.md).
- For any WebXR page, add the [Immersive Web Emulator](https://chromewebstore.google.com/detail/immersive-web-emulator/cgffilbpcibhmcfbgggfhfolhkfbhmik) Chrome extension (2.0.0 as of 16 Nov 2026).

### On the Quest: LAN HTTPS (preferred)

Headset and PC on the **same Wi-Fi** ([testing guide](https://developers.meta.com/horizon/documentation/iwsdk/guides/02-testing-experience/)):

1. `npm run dev` and copy the **Network** URL (`https://192.168.x.x:5173/` or whatever Vite printed).
2. If Windows Firewall prompts, allow Node / Vite on **private** networks. If the headset cannot reach the PC, that firewall is the first thing to check; Meta also lists corporate-network firewalls as a reason to fall back to port forwarding.
3. In **Meta Quest Browser**, open the Network URL, accept the self-signed certificate warning, then **Enter XR**.
4. Or paste the URL in MQDH → Device Manager → **Browser** → **Open** ([browser + MVDH](https://developers.meta.com/horizon/documentation/web/browser-mqdh)).

### On the Quest: `adb reverse` or Chrome port forwarding

Two official fallbacks when LAN HTTPS is blocked.

**`adb reverse`** (Meta's Browser debugging page; example port is theirs, swap in yours — Vite is often `5173`, some servers use `8081`) ([Debug Browser content](https://developers.meta.com/horizon/documentation/web/browser-remote-debugging/)):

```powershell
adb devices
adb reverse tcp:8081 tcp:8081    # headset localhost:8081 -> PC localhost:8081
# or, for the default IWSDK / Vite port:
adb reverse tcp:5173 tcp:5173
```

Then in Quest Browser open `https://localhost:8081` or `https://localhost:5173` (use the scheme and port your dev server actually printed) and accept the certificate.

**Chrome port forwarding**, which the IWSDK testing guide documents as Method 2:

1. USB-connect the headset, developer mode on.
2. On the PC, Chrome → `chrome://inspect/#devices`.
3. Confirm the headset appears under Remote Target. Open **Port forwarding…** and forward the Local URL's port.
4. On the headset, open `https://localhost:<port>`, accept the cert, Enter XR.

### Remote DevTools

With the site already open in Quest Browser, go to `chrome://inspect/#devices` on the PC, find the Browser tab, and click **inspect** ([Debug Browser content](https://developers.meta.com/horizon/documentation/web/browser-remote-debugging/), [Chrome remote debugging](https://developer.chrome.com/docs/devtools/remote-debugging/)). This works for 2D pages and for WebXR sessions on the headset.

Submission for this path is a **public HTTPS URL**, not an APK ([iwsdk-webxr.md](iwsdk-webxr.md)).

---

## 10. Recording the under-3-minute demo video on Windows

Rules allow footage "as viewed on a Meta Quest device or via XR Simulator or another equivalent emulator", public on YouTube or Vimeo, under 3 minutes ([rules §4.9](https://start-developer-competition-26.devpost.com/rules)). Prefer real gameplay. A slight fps drop while recording is expected ([VRC.Quest.Performance.1](https://developers.meta.com/horizon/resources/vrc-quest-performance-1/)).

### Best quality: MQDH Cast, then record inside the cast window

From [Debugging Tools](https://developers.meta.com/horizon/documentation/unity/ts-mqdh-media/):

1. Connect the headset in MQDH Device Manager (USB or ADB over Wi-Fi for wireless cast).
2. **Device Actions → Cast**. The proximity sensor turns off for the session and back on when you stop.
3. In the cast window, unmute the speaker icon if you want system and gameplay audio (microphone audio is not supported).
4. Click the camcorder button to start and stop. Footage is encoded at the **source** resolution — Meta says this has a higher bitrate and smoother pacing than capturing the cast window with OBS.
5. Videos land on the headset; copy them out via **File Manager → On Device → Videos**, then delete them on-device to free space.
6. For a stable 60 fps recording, set Cast's target framerate to 60 and consider enabling **Pause When Recording**. **MAX** capture format is near-lossless (Meta quotes about 600 MB/min for VR and 1.2 GB/min for MR).

Pick the same eye as your dominant hand so hand close-ups are framed well. Aspect ratios: Original (1:1), Cropped 16:9, or Cinematic 16:9 (the last restarts the immersive app and can cost a little in-headset performance).

### Quick takes: MQDH Device Actions → Record

Same page: **Record** or `Ctrl+Shift+R`, maximum **three minutes**. This path **does not record audio**. Files go to `%APPDATA%\odh\captures` on Windows (`C:\Users\<you>\AppData\Roaming\odh\captures`). Default is monoscopic; open the gear to switch eyes, resolution, and bitrate (5–40 Mbps).

Screenshots: **Capture** or `Ctrl+Shift+S`, same folder.

### OBS (or another desktop recorder)

Meta mentions OBS as the weaker alternative to in-cast recording. Use it when you need a longer take, a voice-over on the PC, or a recording of the **Meta XR Simulator** / IWER window (the simulator has no built-in video recorder).

- [OBS Studio](https://obsproject.com/) on Windows: display or window capture of the MQDH cast window, the Unity Game view, the XR Simulator, or the Chrome / IWER tab.
- Xbox Game Bar (`Win+G`) is a built-in fallback. ⚠ neither OBS nor Game Bar is a Meta-documented submission tool; check a test export before you rely on it.

For simulator footage, record a Session Capture (`.vrs`) first, replay it, and screen-record the replay so takes are repeatable ([session capture](https://developers.meta.com/horizon/documentation/unity/xrsim-session-capture/)). Mix in real headset footage once you have the Quest.

### On-device recording

⚠ The exact in-headset Record / Camera control is not in the official pages fetched for this kit. If your Horizon OS build still has a Quick Settings record button, you can use it and pull the file with MQDH File Manager. Prefer the documented MQDH Cast recorder when you can.

---

## 11. Common Windows pitfalls

| Pitfall | What to do | Source |
|---|---|---|
| Headset never appears in `adb devices` or MQDH | Developer mode on; data-capable cable; install the **Oculus ADB driver**; accept **Always allow** USB debugging; try another port or cable; `adb kill-server` | [Software Setup](https://developers.meta.com/horizon/documentation/unity/unity-software-setup), [ADB](https://developers.meta.com/horizon/documentation/unity/ts-adb/) |
| Cable charges but does not Link / shows USB 2 | You need USB-C **3.2 / ≥ 5 Gbps**, a USB 3.2 port, and a data cable — not a charger. Reseat USB-C (orientation can matter). Adapters must be USB 3 in both directions. Run the in-app **Test Connection** | [Link requirements](https://www.meta.com/help/quest/140991407990979), [troubleshooting](https://www.meta.com/help/quest/articles/fix-a-problem/troubleshooting-oculus-link/troubleshooting-tips-oculus-link/) |
| Link and Air Link fight each other | The headset uses only one at a time. Turn Air Link off for a cable session, and vice versa | [troubleshooting](https://www.meta.com/help/quest/articles/fix-a-problem/troubleshooting-oculus-link/troubleshooting-tips-oculus-link/) |
| Air Link cannot find the PC | Same Wi-Fi, preferably **5 GHz**; Link app open; firewall/antivirus may be blocking discovery — Meta's first-steps include temporarily disabling firewall or antivirus that interferes, then re-enabling it | [set up Air Link](https://www.meta.com/help/quest/articles/headsets-and-accessories/oculus-link/connect-with-air-link/), [troubleshooting](https://www.meta.com/help/quest/articles/fix-a-problem/troubleshooting-oculus-link/troubleshooting-tips-oculus-link/) |
| Vite / IWSDK Network URL unreachable from Quest Browser | Allow Node in **Windows Defender Firewall** on a private network, or skip LAN and use `adb reverse` / `chrome://inspect` port forwarding | [IWSDK testing](https://developers.meta.com/horizon/documentation/iwsdk/guides/02-testing-experience/), [Browser debugging](https://developers.meta.com/horizon/documentation/web/browser-remote-debugging/) |
| `adb` works in MQDH but not in PowerShell (or the reverse) | One `adb` version only. Point MQDH **Settings → ADB location** at the Platform-Tools or Unity copy, and put that same folder on your Path | [MVDH basic usage](https://developers.meta.com/horizon/documentation/unity/ts-mqdh-basic-usage/) |
| Paths longer than 260 characters (Unity `Library\`, deep git clones) | Enable Win32 long paths (Group Policy **Computer Configuration → Administrative Templates → System → Filesystem → Enable Win32 long paths**, or `LongPathsEnabled = 1` under `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem`), then reboot. Also keep the project close to the drive root, e.g. `C:\dev\…`. ⚠ the policy only helps apps that opt in via their manifest; the short path always helps | [Microsoft: Maximum Path Length Limitation](https://learn.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation) |
| Microsoft Defender makes Unity imports / builds crawl | Defender real-time scanning of large `Library\` and Hub editor folders is a known class of slowdown. You *may* add a narrow exclusion for a trusted project or the Unity Editor path ([Microsoft Defender exclusions](https://learn.microsoft.com/en-us/defender-endpoint/microsoft-defender-antivirus-exclusions-configure)). ⚠ this is a trade-off against antivirus coverage, not a Meta or Unity requirement. Do not exclude your whole user profile. Unity Support also mentions excluding Package Manager from antivirus when the editor cannot start ([Unity Support article](https://support.unity.com/hc/en-us/articles/360044381032)) | Microsoft + Unity Support; mark the exact folders as a judgement call |
| WSL | You do **not** need WSL for this kit. Link, MQDH, Unity, and USB Quest access are native Windows apps. Running `adb` or a dev server only inside WSL often misses USB devices or fights the Windows adb server. ⚠ practical advice, not a Meta doc. A Windows-native Node / Unity / `adb` install is the path this guide describes | — |
| Public Test Channel (PTC) on the headset | Meta says Link may not work while the headset is on PTC. Leave PTC if Link will not start | [troubleshooting](https://www.meta.com/help/quest/articles/fix-a-problem/troubleshooting-oculus-link/troubleshooting-tips-oculus-link/) |
| Play in Unity does nothing in the headset | Link session running; Horizon Link set as the **active OpenXR runtime**; OpenXR provider enabled for the **Windows** desktop target, not only Android; Developer Runtime Features on; restart the editor after toggling Link feature flags | [unity-link](https://developers.meta.com/horizon/documentation/unity/unity-link) |
| Laptop GPU is "supported" but Link is poor | A listed minimum GPU can still miss recommended specs (RTX 20 / RX 6000, 16 GB RAM). Lower Link refresh rate / render resolution in the PC app under Devices → Graphics preferences, and do real perf work on-device | [requirements](https://www.meta.com/help/quest/140991407990979), [troubleshooting](https://www.meta.com/help/quest/articles/fix-a-problem/troubleshooting-oculus-link/troubleshooting-tips-oculus-link/) |

---

## Related pages in this kit

- [00-prerequisites.md](00-prerequisites.md) — accounts, eligibility, OS matrix
- [on-device-quest.md](on-device-quest.md) — hands-only and 60 fps acceptance tests
- [unity.md](unity.md) · [unreal.md](unreal.md) · [iwsdk-webxr.md](iwsdk-webxr.md)
- [simulators/](simulators/README.md)
- [submission-checklist.md](submission-checklist.md)
- [scripts/quest-adb.ps1](../scripts/quest-adb.ps1) · [scripts/quest-adb.sh](../scripts/quest-adb.sh)

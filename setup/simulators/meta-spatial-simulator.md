# Meta Spatial Simulator (2D Android apps)

Source: [Spatial Simulator overview](https://developers.meta.com/horizon/documentation/android-apps/spatial-sim-overview/), [Look and Pinch](https://developers.meta.com/horizon/documentation/android-apps/spatial-sim-look-and-pinch/). Only relevant if you build an **Android (Compose / Expo) panel app** — it does **not** run Unity/Unreal immersive apps (use [Meta XR Simulator](meta-xr-simulator.md)) or WebXR (use [IWE](immersive-web-emulator.md)).

## Requirements
| | |
|---|---|
| macOS | Apple Silicon (M1+), macOS 12+, Xcode Command Line Tools (`xcode-select --install`) |
| Windows | Windows 10+ 64-bit, 8+ CPU cores, hardware virtualization enabled in BIOS |
| Linux | not listed |
| Hardware | Vulkan-capable GPU, ~8 GB disk, 4 GB RAM for the simulator |
| App | targets **API 34 (Android 14)+**; no Google Play services (GMS apps won't run) |

## Install & run
- Android Studio: via the [Meta VR Plugin](https://developers.meta.com/horizon/documentation/android-apps/meta-horizon-android-studio-plugin).
- CLI ([overview](https://developers.meta.com/horizon/documentation/android-apps/spatial-sim-overview/)):
  ```bash
  metavr tools install spatialsim
  metavr ssim start
  metavr ssim status
  metavr app install app.apk
  metavr app launch com.your.package
  metavr capture screenshot -o shot.png
  metavr ssim stop
  ```

## Hands
**Look and Pinch** (gaze + pinch) is on by default; see the [Look and Pinch page](https://developers.meta.com/horizon/documentation/android-apps/spatial-sim-look-and-pinch/) for mouse mappings.

## Limits
Emulates a Horizon OS Android device for 2D panels; no immersive OpenXR, no Quest performance numbers, simulated input only.

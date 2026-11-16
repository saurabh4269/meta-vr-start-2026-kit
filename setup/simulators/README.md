# Simulators & emulators (no-headset testing)

The competition FAQ says a headset isn't required and points to Meta's no-hardware testing page, which lists the simulator for each build path ([FAQ](https://start-developer-competition-26.devpost.com/details/faqs), [Test your app](https://developers.meta.com/vr/essentials/test-your-app/)). Demo videos may use simulator/emulator footage ([rules §4.9](https://start-developer-competition-26.devpost.com/rules)).

| Tool | Build path | Windows | macOS | Linux | Guide |
|---|---|---|---|---|---|
| **Meta XR Simulator** 207.1 (standalone OpenXR runtime) | Unity, Unreal (Windows editor integration), native OpenXR | ✅ Win 10+ x64 | ✅ Apple Silicon | ⚠ listing exists, package page needs sign-in/404 | [meta-xr-simulator.md](meta-xr-simulator.md) |
| **Meta Spatial Simulator** | 2D Android apps (Compose / Expo) | ✅ Win 10+ x64, 8+ cores, virtualization | ✅ Apple Silicon, macOS 12+ | ❌ | [meta-spatial-simulator.md](meta-spatial-simulator.md) |
| **Immersive Web Emulator** 2.0.0 (extension) + **IWER** (built into IWSDK dev server) | IWSDK / WebXR | ✅ | ✅ | ✅ (Chromium browsers) | [immersive-web-emulator.md](immersive-web-emulator.md) |

## What simulators can't prove (test on a Quest before you submit)
- **60 fps on Quest 3/3S** — a desktop simulator runs on your PC's CPU/GPU; it can't verify [VRC.Quest.Performance.1](https://developers.meta.com/horizon/resources/vrc-quest-performance-1/). Meta: "Testing with a simulator doesn't replace final on-device validation" ([Test your app](https://developers.meta.com/vr/essentials/test-your-app/)).
- **Real hand-tracking feel** — simulated hands are keyboard/mouse driven; webcam camera tracking (XR Simulator v207+) has approximate depth and only works inside the webcam frame. "A single webcam does not reproduce headset tracking. Validate interaction quality on a headset." ([camera tracking](https://developers.meta.com/horizon/documentation/unity/xrsim-camera-tracking/)).
- **Your real room / passthrough** — synthetic rooms are useful for MRUK coverage but aren't a camera feed of a real room.
- **Store delivery** — release-channel install, invite URL, versionCode checks.

On-device guide: [../on-device-quest.md](../on-device-quest.md). Windows (Link, MQDH, XR Simulator install, recording the simulator window): [../windows.md](../windows.md).

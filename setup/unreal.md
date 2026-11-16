# Unreal Engine setup (Meta XR plugin, hands-first, Quest 3/3S)

| Item | Value (checked 16 Nov 2026) | Source |
|---|---|---|
| Competition-suggested | "Unreal Engine 5.8 with Oculus Integration SDK v207+" | [overview](https://start-developer-competition-26.devpost.com/) |
| Unreal Engine 5 Integration (Meta XR plugin) | **209.0**, targets **UE 5.8.0** | [UE5 Integration pkg](https://developers.meta.com/horizon/downloads/package/unreal-engine-5-integration/) |
| Meta XR Interaction SDK (Unreal) | 207.0 | [ISDK Unreal pkg](https://developers.meta.com/horizon/downloads/package/meta-xr-interaction-sdk-unreal/) |
| MR Utility Kit (Unreal) package page | 67.0 (page's latest listed version) | [MRUK Unreal pkg](https://developers.meta.com/horizon/downloads/package/meta-xr-mr-utility-kit-unreal/) |
| Host OS | Windows, macOS, Linux; ~50 GB free disk | [prerequisites](https://developers.meta.com/horizon/documentation/unreal/unreal-quick-start-install-prerequisites/) |

## 1. Accounts (once)
From [Unreal prerequisites](https://developers.meta.com/horizon/documentation/unreal/unreal-quick-start-install-prerequisites/):
1. Meta developer account → verify (SMS or card) → Developer Dashboard → **Org Manager → Select Team → Create** (legal team name; accept the Developer NDA).
2. Epic Games account + GitHub account, linked at <https://www.unrealengine.com/en-US/ue-on-github> (needed for the Oculus-VR fork).
3. Headset developer mode: [00-prerequisites.md §3](00-prerequisites.md).

## 2. Engine + Meta XR plugin
From [Install the Meta XR plugin](https://developers.meta.com/horizon/documentation/unreal/unreal-quick-start-install-metaxr-plugin/):
- **Recommended by Meta:** use Unreal Engine built from the [Oculus-VR fork](https://github.com/Oculus-VR/UnrealEngine) (includes the plugin + extra XR fixes). Requires the verified Meta account and linked Epic/GitHub.
- **Or** (stock UE 5.8 from the Epic Games Launcher): download **Unreal Meta XR plugin** from the [UE5 Integration page](https://developers.meta.com/horizon/downloads/package/unreal-engine-5-integration/), extract into `<UE>\Engine\Plugins\Marketplace` (create `Marketplace` if missing), then **Edit → Plugins** → search *Meta XR* → enable.
- Android toolchain (Android Studio / SDK / NDK / JDK for UE 5.8): ⚠ not covered by the Meta pages linked from Devpost — follow Epic's "Setting up Unreal Engine for Android" docs for your UE version.

## 3. New project
From [Create and configure a new project](https://developers.meta.com/horizon/documentation/unreal/unreal-create-and-configure-new-project/) (the page's example uses UE 5.4.4; same flow on 5.8 ⚠ unverified):
1. Epic Games Launcher → Library → Launch the engine.
2. Project Browser → **Games → Virtual Reality** template → clear **Starter Content** → set location/name → **Create**.
3. **Edit → Project Settings** → fill in project info; run Meta's settings recommendations ([Setting up the Meta XR plugin](https://developers.meta.com/horizon/documentation/unreal/unreal-setting-up-metaxr-plugin/)).

## 4. Hands
- **Project Settings → Plugins → Meta XR → Hand Tracking Support**: *Controllers and Hands* or *Hands Only* ("a user must have hand tracking enabled"); **Hand Tracking Frequency → High** ([Unreal hand tracking](https://developers.meta.com/horizon/documentation/unreal/unreal-hand-tracking/)).
- Interaction SDK: enable **Meta XR** + **Meta XR Interaction SDK** plugins; Pawn with `IsdkHandRigComponentLeft/Right` under MotionController components; Set Tracking Origin = Local Floor ([ISDK Unreal getting started](https://developers.meta.com/horizon/documentation/unreal/unreal-isdk-getting-started/), [overview](https://developers.meta.com/horizon/documentation/unreal/unreal-isdk-overview/)). Note from the ISDK overview: OpenXR has no direct binding for index pinch — use `PinchGrabStarted` / `PinchGrabFinished` delegates.
- [Microgestures](https://developers.meta.com/horizon/documentation/unreal/unreal-microgestures). Samples: [Unreal-InteractionSDK-Sample](https://github.com/oculus-samples/Unreal-InteractionSDK-Sample), [Unreal-HandPoseShowcase](https://github.com/oculus-samples/Unreal-HandPoseShowcase); more in [resources/sample-repos.md](../resources/sample-repos.md).

## 5. Test loop
- No headset (Windows only): Meta XR Simulator editor integration → [simulators/meta-xr-simulator.md](simulators/meta-xr-simulator.md). Windows Link, MQDH, and the Android toolchain notes: [windows.md](windows.md).
- On device, from [Unreal Android IDE guide](https://developers.meta.com/horizon/documentation/unreal/unreal-ide-guide-android/):
  1. USB-connect, `adb devices`.
  2. **Platforms → Android → Package Project**, flavor **Android (ASTC)**, choose output folder.
  3. Run `Install_*.bat` (Windows) or the `.sh` (macOS/Linux) in the output folder. Or **Platforms → Project Launcher** to build + launch directly.
- Faster iteration: [iteration-time best practices](https://developers.meta.com/horizon/documentation/unreal/unreal-iteration-time-best-practices) (iterative cooking, deploy only modified content).
- Perf: [OVR Metrics Tool](https://developers.meta.com/horizon/documentation/unreal/ts-ovrmetricstool), [Unreal Insights](https://developers.meta.com/horizon/documentation/unreal/ts-unreal-insights-ue5), [Meta VR CLI perf](https://developers.meta.com/horizon/essentials/metavr-performance). Target ≥60 fps ([VRC.Quest.Performance.1](https://developers.meta.com/horizon/resources/vrc-quest-performance-1/)).

## 6. Upload to the "Competition" release channel
From [Meta XR Platform Window](https://developers.meta.com/horizon/documentation/unreal/unreal-platform-tool):
1. Register the app in the [Developer Dashboard](https://developers.meta.com/vr/manage/) and create a release channel named **Competition** (Distribution → Release Channels → Create Release Channel — [custom channels](https://developers.meta.com/horizon/resources/publish-release-channels-add-custom/)).
2. Sign the APK; **Project Settings → Platforms → Android**: *Android Package Name* = dashboard package name; increment *Store Version* for every upload.
3. **Meta XR Tools** toolbar dropdown → **Meta XR Platform Window** (or Project Settings → Plugins → Meta XR → Launch Meta XR Platform Window). Target Platform **Quest**, App ID + App Token (app's **API** tab), Release Channel = Competition, APK path → **Upload** (uses `ovr-platform-util`, auto-downloaded on first upload).
4. Enable **Grant access to users by URL** in Channel Settings and copy the invite URL ([add users](https://developers.meta.com/horizon/resources/publish-release-channels-add-users/)) — details in [unity.md §7](unity.md#7-upload-to-a-release-channel-named-competition--invite-url) (same dashboard steps).

Checklist: [scripts/unreal-project-checklist.md](../scripts/unreal-project-checklist.md). Then [submission-checklist.md](submission-checklist.md).

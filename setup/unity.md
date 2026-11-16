# Unity setup (Meta XR SDK, hands-first, Quest 3/3S)

Versions checked 16 Nov 2026 (local copies in `resources/pages/`):

| Item | Value | Source |
|---|---|---|
| Competition-suggested SDK | "Meta XR SDKs v81+ (v207) All-in-One XR"; judging mentions **ISDK v207+** for gaze interactions | [overview](https://start-developer-competition-26.devpost.com/), [rules §6](https://start-developer-competition-26.devpost.com/rules) |
| Meta XR All-in-One SDK (`com.meta.xr.sdk.all`) latest | **209.0** (updated 9 Nov 2026), **minimum Unity 6000.0.66f2** | [All-in-One pkg](https://developers.meta.com/horizon/downloads/package/meta-xr-sdk-all-in-one-upm/) |
| v81.0 page linked from Devpost | 81.0, min Unity 2022.3.15f1 (older — prefer current) | [All-in-One 81.0](https://developers.meta.com/horizon/downloads/package/meta-xr-sdk-all-in-one-upm/81.0) |
| Meta XR Core SDK / Interaction SDK / MRUK (UPM) | 209.0 / 209.0 / 209.0 | [Core](https://developers.meta.com/horizon/downloads/package/meta-xr-core-sdk/), [ISDK](https://developers.meta.com/horizon/downloads/package/meta-xr-interaction-sdk/), [MRUK](https://developers.meta.com/horizon/downloads/package/meta-xr-mr-utility-kit-upm/) |
| Unity Editor | **6000.0.66f2 or higher** with Android Build Support, OpenJDK, Android SDK & NDK Tools | [Software Setup](https://developers.meta.com/horizon/documentation/unity/unity-software-setup) |
| Meta XR Simulator (standalone) | 207.1 (Windows, Mac ARM) | [Win](https://developers.meta.com/horizon/downloads/package/meta-xr-simulator-windows/), [Mac](https://developers.meta.com/horizon/downloads/package/meta-xr-simulator-mac-arm/) |

Do **not** commit SDK binaries. Install them through Unity Package Manager / Asset Store (recommended) or Meta's NPM registry tarballs ([UPM packages](https://developers.meta.com/horizon/documentation/unity/unity-package-manager)).

## 1. Install
1. Accounts + developer mode: [00-prerequisites.md](00-prerequisites.md).
2. Unity Hub → Unity **6000.0.66f2+** with **Android Build Support + OpenJDK + Android SDK & NDK Tools** ([Software Setup](https://developers.meta.com/horizon/documentation/unity/unity-software-setup)).
3. Install MQDH/MVDH and sign in with your Meta developer account (same page).

## 2. Create the project
**Option A — MQDH (Meta's documented path)** ([Project Setup](https://developers.meta.com/horizon/documentation/unity/unity-project-setup)): MQDH → **XR Projects** → **Create project**, choose settings (SDKs etc.).

**Option B — manual**: follow [Manual Project Setup Appendix](https://developers.meta.com/horizon/documentation/unity/unity-tutorial-hello-world-manual-steps) and add `Meta XR All-in-One SDK` via Asset Store → **Add to My Assets** → **Open in Unity** → Package Manager → **Install**; restart if prompted to update OVRPlugin ([UPM packages](https://developers.meta.com/horizon/documentation/unity/unity-package-manager)).

Then ([Project Setup](https://developers.meta.com/horizon/documentation/unity/unity-project-setup)):
1. Delete the default **Main Camera** (Interaction setup adds an `OVRCameraRig`).
2. Open the **Project Setup Tool** (Meta → Tools → Project Setup Tool) and fix all required issues on **Standalone** and **Android** tabs ([UPST](https://developers.meta.com/horizon/documentation/unity/unity-upst-overview)).
3. **Edit → Project Settings → XR Plug-in Management → OpenXR**: enable the **Meta XR** feature group for Standalone and Android ([XR plugin mgmt](https://developers.meta.com/horizon/documentation/unity/unity-xr-plugin/)).
4. If you chose SDKs = All / use URP: create a URP asset and assign it in Graphics + every Quality level, then re-run the Project Setup Tool.
5. Optional AI tooling: install the `meta-vr` plugin from [meta-quest/agentic-tools](https://github.com/meta-quest/agentic-tools); `unity pipeline install` / `unity pipeline list` per Unity's CLI docs ([Unity CLI](https://docs.unity.com/en-us/unity-cli/use-unity-cli)); [Meta XR Operator](https://developers.meta.com/horizon/documentation/unity/meta-xr-operator/).

## 3. Hands-first configuration
- Add the Interaction rig with Building Blocks or the [Interaction Setup](https://developers.meta.com/horizon/documentation/unity/unity-hands-tutorial/) / [ISDK getting started](https://developers.meta.com/horizon/documentation/unity/unity-isdk-getting-started/) flow.
- `OVRCameraRig` → **OVR Manager** → **Quest Features → General → Hand Tracking Support**: choose **Hands Only** (user must have hand tracking on) or **Controllers And Hands** ([ISDK getting started](https://developers.meta.com/horizon/documentation/unity/unity-isdk-getting-started/)). Competition only requires that the whole experience is completable with hands; "Hands Only" enforces that, "Controllers and Hands" keeps controllers optional — then you must also pass VRC.Quest.Input.7 (input switching) per [Test your app](https://developers.meta.com/vr/essentials/test-your-app/).
- Interactions: [ISDK overview](https://developers.meta.com/horizon/documentation/unity/unity-isdk-interaction-sdk-overview), [hand grab best practices](https://developers.meta.com/horizon/documentation/unity/unity-isdk-hand-grab-best-practices), [custom hand poses](https://developers.meta.com/horizon/documentation/unity/unity-isdk-building-hand-pose-recognizer), [microgestures](https://developers.meta.com/horizon/documentation/unity/unity-microgestures). Samples: [Unity-InteractionSDK-Samples](https://github.com/oculus-samples/Unity-InteractionSDK-Samples).
- Design: [hands best practices](https://developers.meta.com/horizon/design/hands-best-practices), [limitations & mitigations](https://developers.meta.com/horizon/design/hands-limitations-mitigations/), [adapting from controllers](https://developers.meta.com/horizon/design/hands-adapting-from-controllers/), [device readiness](https://developers.meta.com/horizon/documentation/unity/device-readiness/).

## 4. Passthrough + MRUK (if mixed reality)
From [Get Started with Passthrough](https://developers.meta.com/horizon/documentation/unity/unity-passthrough-gs/):
- `OVRManager` → Quest Features → General → **Passthrough Support**: Required or Supported; under **Insight Passthrough** tick **Enable Passthrough** (or set `OVRManager.isInsightPassthroughEnabled` at runtime).
- Add an **OVR Passthrough Layer** component; set **Skybox Material = None** (Window → Rendering → Lighting → Environment).
- Use one `OVRPassthroughLayer` across scenes (`DontDestroyOnLoad`).
- MRUK: [MR Utility Kit getting started](https://developers.meta.com/horizon/documentation/unity/unity-mr-utility-kit-gs); sample [Unity-MRUtilityKitSample](https://github.com/oculus-samples/Unity-MRUtilityKitSample). Setup per that page: OVRManager → **Permission Requests On Startup → Scene**, **Enable Passthrough**, then **Meta → Tools → Update AndroidManifest.xml**; test in Editor with simulated rooms or live device data over Link. Scene data comes from the user's room scan (see [research/accessibility-and-pitfalls.md](../research/accessibility-and-pitfalls.md) for known MRUK quirks).

## 5. Performance (min 60 fps on Quest 3/3S)
- Requirement: [VRC.Quest.Performance.1](https://developers.meta.com/horizon/resources/vrc-quest-performance-1/) (≥60 fps rendering, 72/80/90/120 Hz refresh; 30 fps allowed with AppSW).
- Tools: [Meta VR CLI perf](https://developers.meta.com/horizon/essentials/metavr-performance), [Runtime Optimizer](https://developers.meta.com/horizon/documentation/unity/unity-quest-runtime-optimizer), [OVR Metrics Tool](https://developers.meta.com/horizon/documentation/unity/ts-ovrmetricstool), [Immersive Debugger](https://developers.meta.com/horizon/documentation/unity/immersivedebugger-overview).
- Build-time savers from [Build Configuration](https://developers.meta.com/horizon/documentation/unity/unity-build): OVRManager **Skip Unneeded Shaders**, **OVR Build APK**, **OVR Quick Scene Preview**.
- Checklist: [scripts/unity-project-checklist.md](../scripts/unity-project-checklist.md).

## 6. Test loop
- No headset: [Meta XR Simulator](simulators/meta-xr-simulator.md) (Window → Meta → Meta XR Simulator → Activate, then Play).
- Windows + headset: Quest Link → press Play ([Link](https://developers.meta.com/horizon/documentation/unity/unity-link)). Step-by-step (Horizon Link app, OpenXR runtime, cable test, pitfalls): [windows.md](windows.md).
- On device: File → **Build Profiles** → platform **Meta Quest** (Unity < 6.1: **Android**) → **Enable/Switch Platform** → Run Device → **Build and Run** ([Build Configuration](https://developers.meta.com/horizon/documentation/unity/unity-build)). Output is an `.apk`.

## 7. Upload to a release channel named "Competition" + invite URL
Rules: APK "uploaded to the Meta VR Developer Dashboard under a **new** release channel named "Competition"", submit its Invite URL ([rules §4](https://start-developer-competition-26.devpost.com/rules); FAQ recommends a new channel even if you used one last year).

1. Create an app in the [Developer Dashboard](https://developers.meta.com/vr/manage/) (Platform SDK App ID/secret are on the app's **API** page).
2. **Distribution → Release Channels → Create Release Channel** → Name **Competition** (names are permanent) ([custom channels](https://developers.meta.com/horizon/resources/publish-release-channels-add-custom/)).
3. Upload the APK to that channel — any of:
   - Unity: build, then **Window → Meta → Tools → Oculus Platform Tool** → App ID + App Token (secret) → **Release Channel List** = `Competition` → Upload ([Upload from Unity](https://developers.meta.com/horizon/documentation/unity/unity-platform-tool)).
   - MQDH upload, or the [Oculus Platform Utility CLI](https://developers.meta.com/horizon/resources/publish-reference-platform-command-line-utility/).
   - Meta VR CLI: `metavr store dist upload --app-id <APP_ID> --channel <CHANNEL> --apk app.apk --notes "..."` ([Meta VR CLI environment](https://developers.meta.com/horizon/essentials/metavr-environment)) ⚠ passing a custom channel name like `Competition` is my reading of the flag, not shown verbatim in the docs.
4. Channel → **Channel Settings** → **Channel Invite** → tick **Grant access to users by URL** → choose Automatic approval (recommended for judges ⚠ my recommendation) → **Save Changes**. Copy the URL ([add users](https://developers.meta.com/horizon/resources/publish-release-channels-add-users/)).
5. Gotchas from that page: invitees must be 18+; default channel limit 200 users; the invite page **disables 90 days after the latest build upload** (judging ends ~11 Dec, so a mid-Nov upload is fine); changing the URL breaks old links; add a header image + description under **App Submission → App Metadata** so the invite page looks finished.
6. Every new upload needs a higher `versionCode`, same signing key, APK Signature Scheme v2, arm64-v8a libs ([share builds](https://developers.meta.com/horizon/essentials/metavr-share-builds), [Test your app](https://developers.meta.com/vr/essentials/test-your-app/)).

Shortcut (creates its own channel called `shared-link`, **not** "Competition" — so not sufficient on its own for the rules): `metavr store share app.apk` ([share builds](https://developers.meta.com/horizon/essentials/metavr-share-builds)).

Then go to [submission-checklist.md](submission-checklist.md).

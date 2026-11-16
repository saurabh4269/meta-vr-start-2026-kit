# Unity project settings checklist (Meta Quest 3/3S, hands-first)

Tick through before every competition build. Each line links to its source; ⚠ = my recommendation, not a documented requirement. Full walkthrough: [setup/unity.md](../setup/unity.md).

## Editor & packages
- [ ] Unity **6000.0.66f2+** with Android Build Support, OpenJDK, Android SDK & NDK ([software setup](https://developers.meta.com/horizon/documentation/unity/unity-software-setup))
- [ ] `Meta XR All-in-One SDK` (or Core + Interaction + MRUK) **v207+** installed via Package Manager — current 209.0 ([pkg](https://developers.meta.com/horizon/downloads/package/meta-xr-sdk-all-in-one-upm/))
- [ ] Old `com.meta.xr.simulator` package removed (simulator is standalone now) ([XR Sim](https://developers.meta.com/horizon/documentation/unity/xrsim-getting-started))
- [ ] All SDK packages on the **same version** ⚠

## Project setup
- [ ] **Project Setup Tool**: no outstanding required issues on Standalone **and** Android tabs ([UPST](https://developers.meta.com/horizon/documentation/unity/unity-upst-overview))
- [ ] XR Plug-in Management → **OpenXR** → **Meta XR** feature group enabled for Android ([project setup](https://developers.meta.com/horizon/documentation/unity/unity-project-setup))
- [ ] Default Main Camera removed; one `OVRCameraRig` / Interaction rig in the scene (same)
- [ ] Build profile = **Meta Quest** (Unity < 6.1: Android) ([build](https://developers.meta.com/horizon/documentation/unity/unity-build))
- [ ] Unique package name; **versionCode** bumped every upload; release signing key kept safe ([share builds](https://developers.meta.com/horizon/essentials/metavr-share-builds))
- [ ] Only **arm64-v8a** native libs ([Test your app](https://developers.meta.com/vr/essentials/test-your-app/))

## Hands
- [ ] OVRManager → Quest Features → **Hand Tracking Support** = Hands Only or Controllers And Hands ([ISDK GS](https://developers.meta.com/horizon/documentation/unity/unity-isdk-getting-started/))
- [ ] Every flow (menus, pause, settings, exit, recentre) completable with controllers **off** ([rules](https://start-developer-competition-26.devpost.com/rules))
- [ ] Hand-loss handling: UI/objects behave when tracking drops ([limitations](https://developers.meta.com/horizon/design/hands-limitations-mitigations/))
- [ ] Interactable targets big enough / near enough, seated reach (see [research/accessibility-and-pitfalls.md](../research/accessibility-and-pitfalls.md))

## Mixed reality (if used)
- [ ] Passthrough Support Required/Supported + Enable Passthrough + `OVRPassthroughLayer`; camera clear / skybox none ([passthrough](https://developers.meta.com/horizon/documentation/unity/unity-passthrough-gs/))
- [ ] **Scene** permission requested on startup; *Meta → Tools → Update AndroidManifest.xml* run ([MRUK GS](https://developers.meta.com/horizon/documentation/unity/unity-mr-utility-kit-gs))
- [ ] Graceful path when no room scan exists ⚠; tested in ≥2 rooms or synthetic rooms

## Performance (min 60 fps)
- [ ] Measured on device with OVR Metrics Tool / `metavr perf capture` across the busiest scene ([VRC.Quest.Performance.1](https://developers.meta.com/horizon/resources/vrc-quest-performance-1/))
- [ ] Development Build / Script Debugging **off** for the uploaded build ⚠
- [ ] Runtime Optimizer pass ([optimizer](https://developers.meta.com/horizon/documentation/unity/unity-quest-runtime-optimizer))

## Content rules
- [ ] No logos/brands/branded products, no real identifiable people, English text or subtitles ([rules §4](https://start-developer-competition-26.devpost.com/rules))
- [ ] Playable without audio, or subtitles provided ([VRC.Quest.Accessibility.1](https://developers.meta.com/horizon/resources/vrc-quest-accessibility-1/)) ⚠ VRC guidance, not a competition rule

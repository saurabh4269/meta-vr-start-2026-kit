# Unreal project settings checklist (Meta Quest 3/3S, hands-first)

Full walkthrough: [setup/unreal.md](../setup/unreal.md). ⚠ = my recommendation.

## Engine & plugins
- [ ] UE **5.8** (Epic launcher + Meta XR plugin 209.0 in `Engine/Plugins/Marketplace`) **or** the Oculus-VR fork (Meta's recommendation) ([install plugin](https://developers.meta.com/horizon/documentation/unreal/unreal-quick-start-install-metaxr-plugin/))
- [ ] Plugins enabled: **Meta XR**, **Meta XR Interaction SDK** (v207) ([ISDK GS](https://developers.meta.com/horizon/documentation/unreal/unreal-isdk-getting-started/)); MRUK if MR
- [ ] Android SDK/NDK/JDK configured per Epic's docs for your UE version ⚠ (not covered by Meta's linked pages)

## Project settings
- [ ] VR template, Starter Content off ([new project](https://developers.meta.com/horizon/documentation/unreal/unreal-create-and-configure-new-project/))
- [ ] Meta XR project-settings recommendations applied ([setting up](https://developers.meta.com/horizon/documentation/unreal/unreal-setting-up-metaxr-plugin/))
- [ ] Plugins → Meta XR → **Hand Tracking Support** = Hands Only or Controllers and Hands; **Hand Tracking Frequency = High** ([hand tracking](https://developers.meta.com/horizon/documentation/unreal/unreal-hand-tracking/))
- [ ] Pinch handled via `PinchGrabStarted/Finished` delegates (no OpenXR index-pinch binding) ([ISDK overview](https://developers.meta.com/horizon/documentation/unreal/unreal-isdk-overview/))
- [ ] Platforms → Android: **Android Package Name** = dashboard package; **Store Version** incremented each upload; APK signed ([platform window](https://developers.meta.com/horizon/documentation/unreal/unreal-platform-tool))
- [ ] Packaging flavor **Android (ASTC)** ([Android guide](https://developers.meta.com/horizon/documentation/unreal/unreal-ide-guide-android/))
- [ ] Shipping configuration for the uploaded build ⚠

## Hands / MR / perf / content
- [ ] Whole experience completable with controllers off; tested on device
- [ ] MR: anchor support / scene permission enabled; tested in ≥2 rooms or simulator synthetic rooms ⚠
- [ ] ≥60 fps on device (OVR Metrics Tool, Unreal Insights, `metavr perf capture`) ([VRC perf](https://developers.meta.com/horizon/resources/vrc-quest-performance-1/), [Insights](https://developers.meta.com/horizon/documentation/unreal/ts-unreal-insights-ue5))
- [ ] No logos/brands/real people; English or subtitles ([rules §4](https://start-developer-competition-26.devpost.com/rules))

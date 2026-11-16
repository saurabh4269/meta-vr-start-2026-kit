# Test your app for Meta VR Glasses | Meta Horizon OS Developers

> Source: https://developers.meta.com/vr/essentials/test-your-app/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Essentials

Updated: Sep 25, 2026

You can begin testing your VR app before Meta VR Glasses hardware is available. Use a supported simulator for input paths, layout, and rendering, and complete the binary checks in your development environment. When physical hardware is available, complete the device-only checks for installation from a Store release channel, sustained thermal behavior and compute puck placement, final compositor and optics validation, and cross-device Cloud Backup.

You’ll need:

- A release build of the app you plan to upload
- Test account(s) with the ownership, purchase, release-channel, friendship, and multiplayer states required by your service tests
- Compatible controllers, if the app requires them
- \[Optional\] For on-device field-of-view (FoV) simulation, a supported Quest device
- Access to the app’s release channels and device-targeting settings
- Tools that record CPU time, GPU time, frame rate, and render scale, such as [Meta VR CLI](https://developers.meta.com/vr/essentials/ai-tooling-overview)
- \[Optional\] For final on-device validation, a physical Meta VR Glasses test device with the same compute puck placement and power setup you expect people to use

This page covers what test to run. For what changes on the device and why, read [App compatibility for Meta VR Glasses](https://developers.meta.com/vr/essentials/app-compatibility), [Platform services on Meta VR Glasses](https://developers.meta.com/vr/essentials/platform-services), and [Meta VR Glasses field of view and display values](https://developers.meta.com/vr/essentials/field-of-view) first.

To test without hardware, use the simulator guide for your build path:

For Meta XR Simulator setup, use the [`xr-simulator-setup` skill](https://developers.meta.com/vr/essentials/ai-tooling-overview). A simulator does not replace the checks below.
Testing with a simulator doesn’t replace final on-device validation. The device-only notes below identify checks to defer until Meta VR Glasses hardware is available.

1. Build the APK you plan to upload.
2. Inspect its `lib` directory with your development environment’s APK analyzer.
3. Replace or rebuild any dependency that exists only under `armeabi-v7a`.
4. Confirm every required library is present under `arm64-v8a`.
5. Upload the build to a test release channel and resolve any validation errors.

For channel setup and build management, read [Release channels](https://developers.meta.com/vr/resources/publish-release-channels/) and [Manage builds](https://developers.meta.com/vr/resources/publish-release-channels-upload/). The [`vrc-check` skill](https://developers.meta.com/vr/essentials/ai-tooling-overview) validates Store requirements before you submit.

After the upload passes validation:

1. Confirm your device targeting does not exclude this device.
2. Install from that channel onto a physical device.
3. Verify the intended binary and version installed.
4. Confirm the target does not displace a build for another Quest device you still support.

Decide whether people will use the app with controllers, without them, or both, then test every path you support.

| Intended experience | What to test | 
|---|---|
| Controllers required | Binary, Store delivery, controller pairing, and the controller-required launch flow | 
| Controllers optional | The controller-required checks, then every required flow with eyes and hands | 
| Controllers not supported | That the app starts and stays usable with eyes and hands when no controllers are active | 

1. Disconnect or turn off the controllers.
2. Start the app.
3. For a controller-required app, confirm the **Switch to Controllers** dialog blocks entry until controllers are active.
4. For an app designed to run without controllers, confirm it starts with no controller prompt.
5. Complete every required flow with eyes and hands, including navigation, dialogs, scrolling, and exit.

1. Pair and activate compatible controllers.
2. Start the app and complete its required flows.
3. If the app supports both input methods, switch between controllers and hands during a session.
4. Confirm focus, selection, held objects, and open dialogs are all in a valid state after each switch.

Repeat the **Without controllers** and **With controllers** tests for a fresh install and for an existing-user update from your current Quest release.

Use the [device-level Meta VR CLI workflow](https://developers.meta.com/vr/essentials/field-of-view#simulate-the-field-of-view-on-a-quest-headset) with any build path to find content that may be clipped or hard to see. This workflow requires a Quest 3S, Quest 3, or Quest Pro.

For Unity, [enable the Unity field-of-view simulation setting](https://developers.meta.com/vr/documentation/unity/in-headset-fov-simulation#use-the-unity-experimental-toggle-for-a-fixed-test-configuration) and run the app in Editor Play Mode, Meta Quest Link, or Meta XR Simulator.

Web/IWSDK also provides build-path-specific alternatives.

Test 360 and 1280 density-independent pixels (dp), every width where your layout changes, and one width between each pair of those breakpoints. At each sampled width, check that:

- Text stays legible
- Interactive targets stay reachable
- Content reflows instead of clipping
- Dialogs and required actions fit without horizontal scrolling
- The current task and selection survive a resize

Test these states:

- The first view after launch, and after recentering
- Menus, dialogs, captions, status information, and error messages
- Targets at the center and near each view boundary
- Every supported 2D window width and orientation
- Camera cuts, teleports, and changes in viewing distance
- Full-screen effects and overlays that depend on screen position

Record anything cut off, hard to target, or visible only after an unexpected head turn. Fix the layout, then run the same tests again.

For how the device handles rendering, foveation, CPU and GPU levels, and heat, read [Performance and hardware](https://developers.meta.com/vr/essentials/performance-hardware), [Render scale](https://developers.meta.com/vr/essentials/render-scale), [Foveated rendering](https://developers.meta.com/vr/essentials/fixed-foveated-rendering), [CPU and GPU levels](https://developers.meta.com/vr/essentials/cpu-gpu-levels), and [Thermal management](https://developers.meta.com/vr/essentials/thermal).

To capture the data these checks need, [Meta VR CLI](https://developers.meta.com/vr/essentials/ai-tooling-overview) loads Perfetto traces and extracts GPU frame metrics, and the `perfetto-debug` skill walks an AI agent through capturing and analyzing one.

Follow [Virtual Reality Check (VRC) requirement VRC.Quest.Performance.1](https://developers.meta.com/vr/resources/vrc-quest-performance-1): use the app for the length of its content or 45 minutes, whichever is shorter. Include the busiest scenes and UI states a person can reach, not only a light demo scene.

Turn dynamic resolution off and hold foveation at one known level, so automatic quality changes cannot hide the source of a frame-time problem.

Define one repeatable scene and interaction sequence. Run it once to capture a baseline, make one category of change, then run the same sequence again. Use the measurements to determine whether the app is limited by CPU work, GPU work, or both.

- GPU-bound: change render scale, foveation, shaders, lighting, or post-processing
- CPU-bound: reduce simulation, scripts, physics, animation, or background work
- Mixed: make separate CPU and GPU changes

Compare the same scenes with foveation off and with fixed foveation. Unity has a complete public eye-tracked foveated rendering (ETFR) setup route. Follow the Unity link in [Foveated rendering](https://developers.meta.com/vr/essentials/fixed-foveated-rendering), then repeat the comparison with ETFR active. Record GPU frame time and image quality rather than assuming a standard gain.

Cover these cases:

- Text, thin geometry, particles, and high-contrast edges near the view boundary
- The highest level dynamic foveation can select
- Fast transitions between light and heavy GPU workloads
- Every supported render resolution and anti-aliasing setting
- Post-processing paths and intermediate render targets

For Unity ETFR, also test permission denial, valid gaze data, loss of validity during a session, and the documented fallback. Android, Native, Spatial SDK, Unreal, and Web do not currently have complete public Meta ETFR setup routes, so this procedure does not require an ETFR test for those build paths.

Profile with it off, then enable it and repeat the same sequence. Check that scale changes do not break post-processing, render targets, screen-space effects, or UI placement. If the app sits near the minimum for long periods, reduce the base workload.

For thermal testing, run the app for the length of its content or 45 minutes, whichever is shorter. Capture a cold baseline at the start and compare it with the end of the run.

Record the setup so another tester can repeat it:

- Ambient conditions
- Battery and charging state
- Selected refresh rate
- Passthrough, eye tracking, and other active device features
- One supported compute puck placement, orientation, and attachment method
- Whether the compute puck’s vents are clear
- App scene, route, and input sequence

Keep the vents uncovered. If your product requirements name more than one supported placement, repeat the same run for each named placement. Do not add placements based only on what a tester can improvise.

Record frame time, rendered FPS, render scale, foveation level, and any performance or thermal notices from your build path. Compare the start and end of each run.

Test each supported refresh rate and the most expensive feature mix, including scene changes, loading, menus, mixed reality, and recovery after heavy work.

Check that the app:

- Meets [VRC.Quest.Performance.1](https://developers.meta.com/vr/resources/vrc-quest-performance-1): no extended period below 60 rendered FPS, except for its documented loading, fade, system-overlay, streaming, recording, and App Spacewarp cases
- Does not depend on a short-lived performance state to pass
- Keeps required UI readable at the minimum render scale
- Reduces the correct CPU or GPU workload when available performance capacity decreases
- Recovers quality without rapid switching
- Preserves interaction and app state through every change

For how composition, layers, and App Spacewarp work, read [The compositor](https://developers.meta.com/vr/essentials/the-compositor), [Compositor layers](https://developers.meta.com/vr/essentials/compositor-layers), and [App Spacewarp](https://developers.meta.com/vr/essentials/app-spacewarp).

Test the busiest layer set a person can reach, including:

- All app panels, menus, captions, and video layers visible at once
- Panels moving across or overlapping other layers
- Rounded edges, transparency, masks, and underlays
- Passthrough or occlusion, if the app uses them
- App Spacewarp, if the app supports it
- System UI appearing above the app

Check frame timing and visual order on the device. Look for missed frames, unexpected overlap, clipped edges, and layers that disappear. Repeat after changing layer count, overlap, blending, or filtering.

To understand which services change on this device, read [Platform services on Meta VR Glasses](https://developers.meta.com/vr/essentials/platform-services).

Run these with more than one account and more than one device. For backup timing, supported directories, backup history, and manual restore controls, use the Cloud Backup guide for your build path:

Verify they can:

- Find and install the compatible release
- Pass the entitlement check
- Reach prior purchases
- Restore supported backup data
- See supported friends and presence states
- Invite, join, and play with people on supported Quest devices

To verify automatic cross-device restore, use a dedicated test account:

1. On the Quest device, create a distinct save value, such as a unique test name or progress value.
2. Exit the app and use the Cloud Backups page to confirm that a backup with a newer timestamp exists. If necessary, request a manual backup from the device settings.
3. Uninstall the app from Meta VR Glasses and confirm that it is no longer installed. Uninstalling removes local app data but does not delete its cloud backup.
4. On the Cloud Backups page, check whether the app has a backup for the Meta VR Glasses device. If it does, delete only the backup for that device. Deletion is permanent, so do not use a personal or production account for this setup.
5. Reinstall the app on Meta VR Glasses before using it again. With the app absent and no backup for the app on the Meta VR Glasses device, installation restores the most recent backup for the app from another owned device.
6. Start the app and confirm the distinct value was restored.

Test manual restore separately:

1. Create or select a source backup on the Cloud Backups page.
2. Request a restore of that backup to the Meta VR Glasses device.
3. Start the app and confirm the selected value was restored.

- Claim or buy the app
- Complete account and permission flows
- Make and restore purchases
- Create backup data
- Join social and multiplayer flows

Test the failure cases too. The app should explain expired sessions, incompatible builds, unavailable services, and failed joins, and it must not lose user data.

Support and legal

English (US)

© 2026 Meta
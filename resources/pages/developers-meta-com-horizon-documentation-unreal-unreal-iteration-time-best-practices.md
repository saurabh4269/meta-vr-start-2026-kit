# Unreal Iteration Speed Best Practices | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unreal/unreal-iteration-time-best-practices
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Apr 17, 2026

One of the largest time sinks in the development cycle is building and deploying changes to the Meta Quest headset for testing. The following best practices can help reduce this time. Some of these practices might require modifications to your project.

Link is a useful and fast way to iterate on a project. With a headset connected to your computer, you can play in Unreal Editor and get the results directly in the headset while receiving input from the device. This is useful in cases where the changes are device-independent, such as logical code changes, asset positioning, and asset updates. The situations where it might not be beneficial are when iterating on elements that are device dependent, like shaders and rendering, or logic that is specific to the device.

For more information, see [Set up Link](https://developers.meta.com/vr/documentation/unreal/unreal-link/).

The Meta XR Simulator simulates the Meta Quest headset and features directly on your development computer. It lets you iterate quickly on your project without the need to put on a headset. For mixed reality, it provides synthetic environments that make it very easy to test different sizes and layouts of rooms. This enables you to test changes that are device-agnostic, as well as verify app logic, repetitive movement/functionality, and mixed reality rooms.

For more information, see [Meta XR Simulator](https://developers.meta.com/vr/documentation/unreal/xrsim-intro/).

Sometimes, it is necessary to deploy and test the project on the device. For example, platform-specific features, game performance, and graphics all benefit from on-device testing.

Unreal Engine provides multiple entry points to launch the project on device, such as Package APK, Quick Launch, Project Launcher, and Unreal Automation Tool. For more information, see [“Build Operations” in the Unreal Engine documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/build-operations-cooking-packaging-deploying-and-running-projects-in-unreal-engine).

There are several options that can improve the iteration speed for deploying to the device.

When iterating on code, you can speed up the deploy time by skipping the Gradle packaging step, reuse the previously built APK, and push the compiled `libUnreal.so` shared library directly to the device. This avoids the time-consuming APK rebuild for code-only changes. For more information, see [Reduce App Deploy Time](https://developers.meta.com/vr/documentation/unreal/unreal-reduce-app-deploy-time/).

This option can drastically reduce the deploy time to seconds.

To enable it, use any of the following methods:

- DefaultEngine.ini \[/Script/OculusXRHMD.OculusXRHMDRuntimeSettings\] bDeploySoToDevice=True
- Editor UI:**Meta XR Tools** → **Deploy compiled .so directly to device**
- In UE 5.4, Unreal Engine introduced the`bDontBundleLibrariesInAPK` option under Android platform settings (`[/Script/AndroidRuntimeSettings.AndroidRuntimeSettings]`), which achieves similar results. This is a standard Unreal Engine setting, not specific to the Meta XR Plugin.

When iterating on assets, choose only to deploy the files/packages that have been modified.

To enable, use any of the following methods:

- UnrealAutomationTool argument:`-IterativeDeploy`
- Project Launcher:**Custom Launcher Profile** → **Deploy** → **Advanced Settings** → **Only deploy modified content**

- Iterative Cook-on-the-Fly (Oculus-VR fork only):
  - Engine config:
        \[/Script/OculusXRHMD.OculusXRHMDRuntimeSettings\] bIterativeCookOnTheFly=True
  - Editor UI: **Meta XR Tools** → **Enable Iterative Cook on the Fly**

When cooking the assets, only cook the modified ones. This means that the on-device cooked assets are reused, removing unnecessary work from the cooker and device deploy.

- UnrealAutomationTool argument:`-IterativeCook`
- Project Launcher:**Custom launcher** → **Cook** → **Advanced Settings** → **Iterative cooking**
- Project Settings: Enable iterative cooking for Quick Launch (or “Launch on”)

Unreal Engine provides two cooking methods:

- **Cook by the book**: Cook contents ahead of time before deploying.
- **Cook on the fly**: Cook contents just in time after deployment during run time.

In general:

- **Cook by the book**: Deterministic, no runtime performance impact. Good for profiling or testing builds.
- **Cook on the fly:** Fast deploy and iteration. Good for local development builds on subsets of assets.

We tested the above options on:

- A medium-sized project (\~20GB disk size & \~5k asset packages)
- Two sets of PC specifications
- Clean builds and iterative builds

Observations:

- Iterative methods are notably faster than the baseline configuration in iterative builds
- The iterative deploy patch in the Oculus-VR fork significantly accelerates Cook-on-the-Fly

Additionally, when performing clean builds, Cook-on-the-Fly shortens the project launch time significantly, as it defers cooking to run time.

Here are some other promising features potentially worth trying:

- [Zen Store](https://dev.epicgames.com/documentation/en-us/unreal-engine/zen-store-in-unreal-engine): Optimizes content deployment with HTTP chunks and reduces deploy time.
- [Multiprocess Cooking](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-multi-process-cooking-for-unreal-engine): Trades memory for parallelism. Can potentially accelerate cooking significantly in large projects.

Support and legal

English (US)

© 2026 Meta
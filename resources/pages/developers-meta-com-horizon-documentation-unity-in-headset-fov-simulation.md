# Simulate field of view | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/in-headset-fov-simulation/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Oct 28, 2026

Use this guide to test an app that targets Meta VR Glasses without a Meta VR Glasses device. You can simulate the Meta VR Glasses field of view (FoV) on an existing Quest 2, Quest 3, Quest 3S, or Quest Pro headset. Simulation can reveal content that Meta VR Glasses may clip or make hard to see.

This guide covers three workflows. Meta VR CLI applies simulation at the OS level. The Unity experimental setting and Immersive Debugger provide Unity-specific simulation.

See [Meta VR Glasses field of view and display values](https://developers.meta.com/vr/essentials/field-of-view) for the device’s FoV, render extent, and display resolution.

Prepare the tools required by your workflow:

- For Meta VR CLI, follow [Install Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-install). Then use [Work with devices and apps](https://developers.meta.com/vr/essentials/metavr-devices-and-apps) to connect one supported headset with developer mode enabled.
- For the Unity toggle, [set up Meta XR Core SDK](https://developers.meta.com/vr/documentation/unity/unity-core-sdk) and add `OVRManager` to your project.
- For runtime control in Unity, set up [Immersive Debugger](https://developers.meta.com/vr/documentation/unity/immersivedebugger-overview).

| Workflow | Where it works | Use it to | 
|---|---|---|
| Meta VR CLI | Horizon OS on one developer-mode headset | Test at the device level | 
| Unity experimental toggle | Unity runtime in the Editor or an Android package (APK) | Set up one test session or APK, such as a quality assurance (QA) build | 
| Immersive Debugger | Unity runtime in the Editor or an APK | Tune the mask live and compare FoV changes | 

Meta VR CLI applies FoV simulation directly to Horizon OS on the connected headset. It is not specific to Unity or another app engine.

The source headset is the connected Quest on which Meta VR CLI simulates the Meta VR Glasses FoV. Meta VR CLI supports Quest 3S, Quest 3, and Quest Pro for this workflow.

To simulate the full Meta VR Glasses field of view of 70 degrees horizontal by 66 degrees vertical, run:

metavr device fov-sim enable

To simulate the recommended design area of 58 degrees horizontal by 54 degrees vertical, which accounts for a wider range of face shapes and fits, run:

metavr device fov-sim enable --design-area

`--design-area` requires Meta VR CLI 1.10.0 or later. Run `metavr --version` to check. To upgrade, see The override is temporary and resets when the headset reboots.

After validation, clear the simulation and return to the source headset’s default FoV:

metavr device fov-sim disable

The **Simulate VR Glasses Field of View** setting is Unity-specific. Use it as a one-time configuration for an Editor test session or a specific APK, such as a QA build. The setting establishes whether the FoV simulator starts enabled. The simulator’s default mask is 70 degrees horizontal by 66 degrees vertical.

For an Editor test session, enable **Simulate VR Glasses Field of View** on the `OVRManager` object before you enter Play Mode.

For a Quest Android build, select an `OVRManager` object and open:

Enable **Experimental Features Enabled**. Under **Device Simulation**, enable **Simulate VR Glasses Field of View**. Turning off the first setting also turns off FoV simulation.

On both the **Quest** and **Editor + Link** tabs of the `OVRManager` Inspector, the **Draw Design Area Guideline** setting is indented under **Simulate VR Glasses Field of View**. It is on by default and is available only when simulation is on. It draws a 58-by-54-degree guideline inside the simulated FoV. Keep critical content inside the guideline, and use the surrounding FoV only for peripheral, non-essential content. Turn it off to view the mask without the guideline.

The Android setting marks the build as experimental. Before Store submission, turn off **Experimental Features Enabled**, then build a new APK.

Open **FoV Simulator** under **Custom Inspectors** to disable, re-enable, or tune the mask live. **FoV Simulator** also has a **Draw Design Area Guideline** control to show or hide the guideline.

The Unity experimental toggle configures the starting mask for an Editor test session or APK. Immersive Debugger controls that same simulator live. Use it to disable, re-enable, or tune the mask for a direct before-and-after comparison. The two workflows do not create separate masks or simulator instances.

- **Meta VR CLI**: Check the visible boundary inside the source headset. Casts and screenshots capture the image before lens distortion, so they do not show the result accurately.
- **Unity experimental toggle**: Check that the scene appears through a rounded rectangle. An opaque black mask covers the area outside it. While **Draw Design Area Guideline** is on, a thin white rounded-rectangle guideline marks the 58-by-54-degree design area inside the visible area. Check that your critical content sits inside the guideline.
- **Immersive Debugger**: Change a FoV Simulator control and check that the mask updates. Disable, enable, or reset the simulator to test live control.

- Face shape, device fit, eye position, and gaze direction can reduce the area a person sees.
- Simulation helps find clipping and visibility issues, but it does not replace testing on Meta VR Glasses.

- **OS-level FoV simulation does not clip compositor layers.** When you run `metavr device fov-sim enable`, Horizon OS does not apply the simulated FoV to [compositor layers](https://developers.meta.com/vr/documentation/unity/os-compositor-layers). 2D panels that render as compositor layers stay visible outside the simulated FoV. This issue will be fixed in Horizon OS v209. The Unity experimental toggle and Immersive Debugger workflows do not have this issue.

Support and legal

English (US)

© 2026 Meta
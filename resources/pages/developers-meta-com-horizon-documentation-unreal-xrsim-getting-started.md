# Getting Started with Meta XR Simulator | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unreal/xrsim-getting-started
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Nov 2, 2026

Standalone XR Simulator

This documentation covers the newly released Standalone XR Simulator. Older versions of the Meta Core SDK may not be fully compatible. If you encounter issues, use the toggle in Meta XR Simulator to set it as the OpenXR active runtime. For legacy usage, refer to the The Meta XR Simulator is an Extended Reality (XR) runtime for developing and testing XR applications on your development machine.

The simulator implements OpenXR and integrates with supported engine and graphics
API configurations. Your application must use the OpenXR features and extensions
supported by Meta XR Simulator. The simulator includes a predefined input
mapping schema and a user interface that displays information about how the
runtime composites the final view and simulates input.

The simulator presents one device to your application at a time. Connect an
application first: the **Device** control cannot list profiles until a runtime
session is active. Then select the device in the **Inputs** panel, under
**Device info** > **Device**. The default is **Meta Quest 3**. For the list of
devices you can pick, see
[Meta XR Simulator](https://developers.meta.com/vr/documentation/unreal/xrsim-intro/#device-simulation).

The device you select changes what your application sees:

- Field of view, recommended render resolution, and the refresh rates on offer
- The supported IPD range
- Which OpenXR extensions the runtime advertises, so a feature present on one device is absent on another
- Which input options appear. An input mode available on one device is absent on another
- Passthrough color mode

Test against the device you intend to ship on. A build that runs on one profile
does not prove it runs on another.

Stop and restart your application after you change **Device**. In an editor,
stop and re-enter Play mode. The profile is captured when your application
creates its OpenXR instance, so restarting is the reliable way to apply the
change.

Select **Meta VR Glasses** in the **Device** control to develop against Meta VR Glasses on your
development machine.

The Meta VR Glasses profile presents these characteristics to your application:

| Characteristic | Value | 
|---|---|
| Field of view, per eye | 37° temporal, 37° nasal, 34° up, 34° down | 
| Refresh rates | 90 Hz and 120 Hz, defaulting to 90 Hz | 
| Recommended render resolution, per eye | 1680 × 1760 | 
| Supported IPD range | 0.058 m to 0.072 m | 
| Passthrough color resolution | 1024 × 1024 | 

By default, Meta VR Glasses simulate eye gaze and hand tracking and present no
controllers. Meta Touch Plus controllers are available as an optional input.

As with any profile change, stop and restart your application after you select
Meta VR Glasses so the runtime binds the new profile.

Meta VR CLI can activate the runtime, launch and quit your application, set the
simulated device, and read the runtime logs, so you can script a simulator
session instead of clicking through the interface. The commands run on macOS and
Windows. See [Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-environment).

- UE5

Meta XR Simulator supports Direct3D 11, Direct3D 12, and Vulkan. Direct3D renders through a Vulkan compositor.

Unreal editor integration for Meta XR Simulator runs on Windows.

1. Create a VR project. You can create a VR Template project or create one from scratch following [Set up your development environment](https://developers.meta.com/vr/documentation/unreal/unreal-quick-start-install-prerequisites/).
2. Verify that **XR API** is set to **Epic Native OpenXR** in **Project Settings** > **Plugins** > **Meta XR**. This is the default and works with the Meta XR Simulator.
3. Enable the Meta XR Simulator by checking the**Meta XR Simulator** toggle, under the **Meta XR Simulator** dropdown located on the main toolbar.
 The editor opens a dialog stating that a restart is required. Select**OK** to let the editor restart itself and apply the change; closing and reopening the editor by hand does not apply it. Select **Cancel** to leave the OpenXR runtime unchanged, which leaves the simulator inactive. Deactivating the simulator opens the same dialog.
4. Click **VR Preview** to launch the Meta XR Simulator.

By default, Unreal sets **Run Under One Process** and **HMD For Primary Process Only** to `True`. To test all instances connecting to the Meta XR Simulator, set both options to `False`:

- **Listen server crash**: Unreal crashes when net play mode is set to listen server.

Support and legal

English (US)

© 2026 Meta
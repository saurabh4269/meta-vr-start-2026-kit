# Get Started with Meta XR Simulator | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/xrsim-getting-started
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Nov 2, 2026

Standalone XR Simulator

This documentation covers the newly released Standalone XR Simulator. Older versions of the Meta Core SDK may not be fully compatible. If you encounter issues, remove the 'com.meta.xr.simulator' package from your project and use the toggle in Meta XR Simulator to set it as the OpenXR active runtime. For legacy usage, refer to the The Meta XR Simulator is an Extended Reality (XR) runtime for developing and testing XR applications on your development machine.

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
[Meta XR Simulator](https://developers.meta.com/vr/documentation/unity/xrsim-intro/#device-simulation).

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

To run your Unity app in Meta XR Simulator:

1. Check that your project and machine meet the [prerequisites](https://developers.meta.com#prerequisites).
2. [Install](https://developers.meta.com#installation) the standalone Meta XR Simulator.
3. [Activate](https://developers.meta.com#activate-meta-xr-simulator-in-unity) the simulator in the Unity Editor.
4. [Enter Play mode](https://developers.meta.com#run-your-app-in-meta-xr-simulator). Your app runs in the Meta XR Simulator window.
5. [Choose the device and inputs](https://developers.meta.com#input-simulation) you want to simulate.

Meta XR Simulator works with a supported OpenXR application built in Unity. See [Application requirements](https://developers.meta.com/vr/documentation/unity/xrsim-intro/#application-requirements) for the OpenXR versions, graphics APIs, and extensions it supports. To fully configure your Unity project for Meta XR development, complete the [project setup steps](https://developers.meta.com/vr/documentation/unity/unity-project-setup/).

- Development machine running one of the following:
    
  - Windows 10+ (64-bit)
  - macOS 10.10+ (ARM only)

Additional macOS requirements

On macOS, your Unity project needs the Unity OpenXR Plugin v1.13.0 or later.

Meta XR Simulator is a standalone application. Use the following links to view the release notes and download
the installer for your operating system:

Download and run the installer for your operating system. You do not need to
add a Meta XR Simulator package to your Unity project. If your project still
contains the `com.meta.xr.simulator` package, remove it in the Package Manager.

The menu and toolbar controls below come from the Meta XR Core SDK. If your
project does not use that SDK, use
[global activation](https://developers.meta.com/vr/documentation/native/xrsim-getting-started#Activation)
instead.

1. Open your project in the Unity Editor.
2. Activate the XR Simulator in one of two ways:
    
  - Click its icon next to the **Play** button in Unity’s top toolbar.
  - Select **Window** > **Meta** > **Meta XR Simulator** > **Activate**.
3. Check the Unity console for the `[Meta XR Simulator is activated]` message.

When you set the simulator as the OpenXR runtime through Unity, the runtime toggle in the simulator UI does not show the simulator as active, even when it is connected. Unity sets the runtime for the editor process only, and the toggle reports the system-wide setting.

1. Open the scene you want to test.
2. Click **Play** in the Unity Editor. Your app starts and its view appears in
the Meta XR Simulator window.
3. Use the simulator panels to control the simulated headset and inputs. You can drag the panels to arrange them.
4. To stop the session, click **Play** again to exit Play mode.

To simulate a different device, change **Device** in the **Inputs** panel, then
exit and re-enter Play mode. See
[Choose which device to simulate](https://developers.meta.com#choose-which-device-to-simulate).

If your app runs in the Game view but the Meta XR Simulator window does not show
it, select **Window** > **Meta** > **Meta XR Simulator** > **Status** to confirm
the simulator is active, then check the
[Application requirements](https://developers.meta.com/vr/documentation/unity/xrsim-intro/#application-requirements).

To go back to development on your physical device, deactivate the simulator in Unity by selecting **Window** > **Meta** > **Meta XR Simulator** > **Deactivate**. Select **Window** > **Meta** > **Meta XR Simulator** > **Status** to check the current state.

Between runs, exit Play mode and leave the simulator active. The simulator
window stays open, so the next run starts faster.

Meta XR Simulator maps input from your development machine to a simulated Meta Quest headset, controllers, and hands. The input sources are:

- A keyboard and mouse
- An Xbox controller
- Meta Quest Touch controllers

To select which Meta Quest input you want to simulate:

1. In the Meta XR Simulator UI, open the **Inputs** panel.
2. Under **Input settings**, choose a source for **Left input** and **Right input**.

To see how your development machine inputs map to Meta Quest, open the **Input bindings** panel. It shows the keys and buttons assigned to each action, and you can reassign them.

For more information about input mapping for keyboard, mouse, and Xbox game controllers, see [Simulate User Input from Keyboard, Mouse, and Xbox Game Controllers](https://developers.meta.com/vr/documentation/unity/xrsim-input-keyboard/).

For information about mapping input from Meta Quest Touch controllers, see [Simulate User Input from Meta Quest Touch Controllers](https://developers.meta.com/vr/documentation/unity/xrsim-data-forwarding/).

Suppose you built a Horizon OS app in Unity that uses Meta Quest Touch controllers. You want to verify small changes without putting the headset on and taking it off each time. Test the app in Meta XR Simulator and keep using your Touch controllers as input.

- A [Meta XR Unity project](https://developers.meta.com/vr/documentation/unity/unity-project-setup/) with Meta Quest Touch controller input
  - For this example, the application from the [Meta XR Hello World tutorial](https://developers.meta.com/vr/documentation/unity/unity-tutorial-hello-vr) was used.

Follow [Simulate User Input from Meta Quest Touch Controllers](https://developers.meta.com/vr/documentation/unity/xrsim-data-forwarding/) to connect your controllers.

The Meta XR Simulator responds to controller movements and button presses. You can use your keyboard or mouse to move the camera around.

To return to simulated input, select **Disconnect Controllers** under **Inputs** > **Quest controllers**.

The Meta XR Simulator does not require any additional packages in Unity if your project uses OpenXR. The Meta XR Simulator package in the Unity asset store is now deprecated.

To learn more about Meta XR Simulator and its functionality, see [Meta XR Simulator Overview](https://developers.meta.com/vr/documentation/unity/xrsim-intro/).

Support and legal

English (US)

© 2026 Meta
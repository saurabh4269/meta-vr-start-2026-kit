# Meta XR Simulator Overview | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/xrsim-intro/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Nov 2, 2026

Standalone XR Simulator

This documentation covers the new Standalone XR Simulator. Older Meta Core SDK versions may not work with it. If you encounter issues, remove the 'com.meta.xr.simulator' package from your project and use the toggle in Meta XR Simulator to set it as the OpenXR active runtime. For legacy usage, refer to the Meta XR Simulator is a lightweight
[OpenXR runtime](https://registry.khronos.org/OpenXR/specs/1.0-khr/html/xrspec.html#runtime)
that runs on your computer. It presents an API-level model of a Meta Quest or
other supported device to your application. It ships no operating system image
and no Android layer, so it does not emulate device hardware.

A simulated device is a set of device-profile properties:

- Display name and system name
- View count
- IPD range
- Refresh-rate list
- Per-eye field of view
- Recommended eye resolution
- Interaction-profile ranking
- Passthrough resolution and color mode

You can test and debug on your computer without a headset. Launch the
application from your development machine, drive the simulated headset and
inputs with a keyboard, a mouse, or a connected controller, and iterate without
deploying a build to a device.

The simulator reports one device profile to your application at a time. The
following profiles are documented:

- Meta Quest 2
- Meta Quest Pro
- Oculus Rift S
- Meta Quest 3
- Meta Quest 3S
- Meta VR Glasses

Meta Quest 3 is the default profile. Select a profile under **Device info** in
the [Inputs panel](https://developers.meta.com#inputs-panel).

After you change **Device**, stop the application and restart it. The profile is
captured when your application creates its OpenXR instance, so restarting is the
reliable way to apply the change. In an editor, stop and re-enter Play mode.

Device data varies by profile. Hand tracking and Environment Depth are each
available on a subset of profiles.

A synthetic environment is a 3D scene that stands in for a physical room.

On a physical Meta Quest headset, cameras capture your room, detect walls and
furniture, and supply passthrough. Synthetic environments serve the same purpose
in Meta XR Simulator. They are pre-created 3D rooms that provide:

- **Passthrough data**: Visual representation of the “physical” space
- **Scene information**: Walls, floors, ceilings, furniture, doors, and windows
- **Spatial anchors**: Places to attach virtual objects
- **Environment Depth data**: Distance data. Windows only, on the Meta Quest 3,
Meta Quest 3S, and Meta VR Glasses profiles.

Without a synthetic environment, your application has no “physical world” to
interact with. This matters most for mixed reality applications.

Your application must meet all of the following conditions.

- The application requests OpenXR API version 1.0 through 1.1. Outside that range, instance creation fails.
- The application uses a supported graphics API. Vulkan works on Windows and macOS. Direct3D 11 and Direct3D 12 work on Windows. Metal works on macOS. OpenGL and OpenGL ES are not supported.
- The application uses extensions that the chosen device profile supports. Support varies by profile.

Drive the headset and both hands from your computer. Sources include the
keyboard and mouse, physical Meta Quest controllers connected by data
forwarding, and an Xbox controller on Windows.

For more information see
[Input Simulation](https://developers.meta.com/vr/documentation/unity/xrsim-input-keyboard).

Test tracking without a headset. Use **Tracking controls** in the
[Inputs panel](https://developers.meta.com#inputs-panel).

Test your application in different room layouts:

- **Built-in rooms**: Game room, living room, bedroom, and more
- **Custom rooms**: Build your own in the synthetic environment builder
- **JSON-based rooms**: Scene definitions in JSON format
- **Real room captures**: Import room setups from a Meta Quest device

For more information see
[Synthetic Environments](https://developers.meta.com/vr/documentation/unity/xrsim-heroscenes).

Record a simulator session to a VRS file, then replay it. A recorded session
reproduces the same head and input motion on every run, so a bug driven by that
motion becomes repeatable.

For more information see
[Session Capture (Record and Replay)](https://developers.meta.com/vr/documentation/unity/xrsim-session-capture).

Connect more than one application client to the simulator to test a shared
session. Each client acts as a separate user, so you can exercise connection,
presence, and shared-state code paths without extra headsets.

For more information see
[Multiplayer Testing](https://developers.meta.com/vr/documentation/unity/xrsim-multiplayer).

You interact with Meta XR Simulator through its window interface. The window
looks different depending on whether an application is running in the
simulator.

When you open the XR Simulator without running an application, the window
displays a message and provides access to essential settings:

- Choose a synthetic environment from the available options
- Configure basic simulator settings
- Turn on the XR Simulator runtime using the runtime toggle in the header

Once you launch an application in the simulator, the window displays:

- **Viewport**: The main view showing what would appear in the headset
- **Header**: Runtime activation, session recording and replay upload, and
synthetic environment controls
- **Navigation rail**: Buttons that open the Inputs, Inputs binding, Graphics,
Settings, and About panels
- **Bottom tray**: Expandable Console and Multiplayer sessions tabs

The header holds status information and controls:

- **XR Simulator runtime toggle**: Sets Meta XR Simulator as the active OpenXR
runtime and shows whether that activation is enabled

- **Record session**: Starts and stops a VRS recording. The button label changes
with state: `Record session`, `Stop recording`, and `Stop playback`.
- **Upload**: Replays a recorded session. Select the `.vrs` file to replay and
a destination for the replay output. Disabled while recording or playback is
active.
- **Choose environment**: Picks a room to load.

Documentation and Report a bug appear on the rail as additional items.

Side panels open from the navigation rail.

The **Inputs** panel includes the following controls, among others:

- **Device info**: Pick the simulated device. Set its IPD (the gap between the
eyes), refresh rate, and `Viewport`.
- **Input settings**: Enable the headset and choose a source for the left and
right inputs.
- **Tracking controls**: Sync the headset to movement tracking, or play random
head movement. Both appear only while movement tracking is active.
- **Keyboard and mouse**: Configure **Point & click** and choose its action input.
- **Quest controllers**: Connect physical Quest controllers by data forwarding.
- **Xbox controller**: Connect an Xbox controller on Windows.
- **Input positioning**: See where the headset and inputs are reported.

The **Input bindings** panel, which opens from the **Inputs binding** rail item,
shows how simulator controls map to simulator actions:

- View the keys or buttons assigned to each action, such as moving forward, rotating up, or grabbing
- Customize the key or button assignments

The **Graphics** panel reports the graphics and compositor APIs in use, frame
rate over time, and the composition layers your application submits.

The **Settings** panel holds simulator preferences such as the theme, the path
to Android Debug Bridge (ADB), and analytics consent.

The **About** panel reports the runtime version, the session and developer IDs,
the simulator file paths, and the OpenXR extensions the runtime supports.

Use the **Console** tab to view logs and diagnostic information. Use the
**Multiplayer sessions** tab to manage simultaneous sessions.

Download the simulator for your platform:

For guidance on the setup and installation of Meta XR Simulator with your
development environment, see
[Get started with Meta XR Simulator](https://developers.meta.com/vr/documentation/unity/xrsim-getting-started).

Support and legal

English (US)

© 2026 Meta
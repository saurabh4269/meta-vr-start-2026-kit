# Meta for Developers

> Source: https://developers.meta.com/horizon/downloads/package/meta-xr-simulator-mac-arm/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Download

Updated: Oct 14, 2026|Version207.1

Meta XR Simulator is a lightweight OpenXR runtime built for developers and enables you to simulate Meta VR devices and features on the OpenXR API level.
Overview

Version 207.1 adds support for AMD graphics cards and grab and pinch from camera hand tracking. It also fixes memory growth, crashes when an app exits, and a range of rendering, hand tracking and input issues.

What's New

AMD GPU support: Meta XR Simulator now runs on AMD graphics cards. The memory growth that could use up all system memory during Unity Play Mode and crash the machine is fixed, and the fix has been verified on AMD hardware.

Grab and pinch from camera hand tracking: Camera-tracked hands now report grab and pinch, so apps can read them like any other hand input.

What's Fixed

Fixed memory that kept growing over long sessions.

Fixed crashes and hangs when an app exits or disconnects. Apps also reach a focused state faster at launch.

Fixed Vulkan validation errors and several layer rendering issues, including the white screen in Passthrough Camera Access.

Camera hand tracking is more accurate and steadier, and keeps working through Stop and Play in the Unity and Unreal editors. Fixed Look and Pinch hands getting stuck or left behind.

Fixed stuck keys, micro-gestures and Meta VR Glasses input.

On macOS, background servers now close with the simulator and adb discovery works. The app now shows as "Meta XR Simulator" in Finder, Dock and Spotlight.

Known Issues

VRS Recording does not capture user interactions in the scene.

If you update the Unity OpenXR package while the Editor is open, XR Simulator won't connect until you restart the Unity Editor.

Meta XR Simulator Documentation

Getting Started Guides:

Support and legal

English (US)

© 2026 Meta
# Simulating camera tracking in Meta XR Simulator | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/xrsim-camera-tracking/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 4, 2026

Camera tracking uses a webcam on your computer to drive the simulated hands and
head look direction in Meta XR Simulator. Use it to try hand interactions and
change where you look, without a headset and without mapping every motion to
the keyboard.

For an introduction to the simulator, see
[Meta XR Simulator](https://developers.meta.com/vr/documentation/unity/xrsim-intro/).

- A webcam attached to your computer, on Windows or macOS.
- Camera permission for Meta XR Simulator. On macOS, grant it in **System
Settings** > **Privacy & Security** > **Camera**. On Windows, allow desktop
apps to use the camera in **Settings** > **Privacy & security** > **Camera**.
- An application running against Meta XR Simulator, with its session connected.
The **Inputs** panel is unavailable until a runtime connects.

Camera tracking is available in Meta XR Simulator v207 and later.

The tracking service and its models ship inside the simulator. Nothing downloads
at runtime.

1. Open the **Inputs** panel.
2. Find **Camera tracking** and turn on **Enable camera**.
3. Wait while the status reads `Starting`. The simulator allows 20 seconds for
the service to come up.
4. When the status reads `Streaming`, move your hands in front of the webcam and
confirm that the simulated hands follow them in your application.

A live preview of your webcam appears under the toggle once the service is streaming and its preview server has started. The preview is a
convenience and is independent of tracking, so treat your application as the
check rather than the preview.

The service opens the camera when you turn camera tracking on and releases it
when you turn camera tracking off.

| Status | Meaning | 
|---|---|
| `Camera tracking is off` | The toggle is off. | 
| `Starting` | The service is launching. | 
| `Streaming` | Hands and head look direction are driving the simulator. | 
| Failure message | The service did not start inside 20 seconds, or it stopped. The panel replaces the status with a message pointing you to the Meta XR Simulator log. | 

Turning on **Enable camera** switches the data behind both hands to the webcam
at once. There is no per-hand setting. Turning it off returns both hands to the
built-in gestures.

Camera tracking does not change **Left input** or **Right input**. It replaces
the data behind a hand, so it has a visible effect on a side set to **Hand**.

Your application reads camera tracking through the normal OpenXR tracking
interfaces. If it enables `XR_EXT_hand_tracking`, it reads the simulated hand
joints with `xrLocateHandJointsEXT`. Camera-derived head rotation updates the
standard head and view pose your application already uses to locate views and
spaces.

This is not eye-gaze input. It does not use `XR_EXT_eye_gaze_interaction`.
Camera tracking updates poses. It does not raise engine events or send button
actions.

- Depth is inferred from a single camera, so reach and distance are approximate. Tune your seating distance if depth feels consistently wrong.
- Your working volume is bounded by what the webcam can see. Hands outside the frame have no pose at all.
- Hands that cross or overlap are harder to tell apart.
- Head look direction drops out when your face turns away from the camera or leaves the frame.
- A single webcam does not reproduce headset tracking. Validate interaction quality on a headset.

Wait through the next status check, which runs every 2 seconds. A cold start can
take longer than the 20-second budget, and the simulator recovers on its own. If
the error persists, turn **Enable camera** off and on again.

Grant camera access to Meta XR Simulator in **System Settings** > **Privacy &
Security** > **Camera**, then turn **Enable camera** off and on again.

If another application is preventing camera access, close it and turn **Enable
camera** off and on again.

Support and legal

English (US)

© 2026 Meta
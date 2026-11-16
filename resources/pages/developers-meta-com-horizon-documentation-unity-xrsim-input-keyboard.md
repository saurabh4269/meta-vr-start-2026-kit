# Meta XR Simulator Interaction | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/xrsim-input-keyboard
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 3, 2026

On Meta Quest devices, people use controllers or hands to interact with apps.
Meta XR Simulator reproduces that interaction in the **Inputs** panel.

You choose what each hand *is* in **Input settings**, where **Left input** and
**Right input** each take a value. Separate sections then supply the data that
drives it.

| What you choose | Where | What drives it | 
|---|---|---|
| **Controller** | **Left input** / **Right input** | Keyboard and mouse, or an Xbox controller on Windows | 
| **Hand** | **Left input** / **Right input** | Keyboard and mouse. An Xbox controller cannot trigger gestures | 
| **None** | **Left input** / **Right input** | Nothing. The hand is absent | 
| **Look and Pinch** | **Left input** / **Right input** | Gaze and pinch. Offered on the Meta VR Glasses profile only. Selecting it sets both **Left input** and **Right input** to **Look and Pinch** | 
| Forwarded controllers | **Quest controllers** | Physical Meta Quest controllers. Connecting sets both sides to **Controller** | 
| Recorded playback | **Tracking controls** | A recorded file. Drives body and face, not the hands | 
| Camera tracking | **Camera tracking** | A webcam. Replaces the data behind a side set to **Hand**, without changing that setting | 

The default method is keyboard and mouse. Use the WASD keys to move, hold the
right mouse button and move the mouse to look around, and use the arrow keys to
rotate your view. Open the **Input bindings** panel for the full list.

The simulator labels this section **Keyboard and mouse**. It also offers
**Point & click**, where the controller ray follows your mouse cursor. For
details, see
[Point-and-Click input](https://developers.meta.com/vr/documentation/unity/xrsim-point-and-click/).

A webcam can drive the simulated hands and your head look direction. The
simulator labels this section **Camera tracking**. For more information see
[Camera tracking](https://developers.meta.com/vr/documentation/unity/xrsim-camera-tracking/).

On Windows, an Xbox controller can serve as an input device. Connect it to your
Windows computer by any method the controller supports. The simulator labels
this section **Xbox controller**.

On macOS the section appears but reports the controller as disconnected, because
the simulator reads Xbox controller state through a Windows-only API.

Keyboard, mouse, and Xbox controller input are limited in 3D space. Meta Quest
controllers simplify actions such as grabbing an object and placing it on a
table edge. This method forwards the input from real controllers rather than
simulating it.

The simulator labels this section **Quest controllers**. For more details, see
[Data forwarding](https://developers.meta.com/vr/documentation/unity/xrsim-data-forwarding/).

The **Input bindings** panel displays the keys assigned to each simulated
action, such as movement, head rotation, and controller interactions like
grabbing. You can reassign them to suit your preferences. Open it from the
**Inputs binding** item in the navigation rail, and find gesture and hand
action keys under **Input bindings** > **Hand actions**.

The panel covers keyboard bindings. It does not list Xbox controller bindings.

The **Tracking controls** section of the **Inputs** panel plays back recorded
tracking data, so you can test body and face tracking without a physical
headset. It also offers a **Sync headset to movement tracking** toggle.

The section stays inert and reads `No movement tracking active` until your
application starts one of those trackers.

Support and legal

English (US)

© 2026 Meta
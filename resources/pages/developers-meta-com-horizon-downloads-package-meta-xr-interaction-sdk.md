# Meta for Developers

> Source: https://developers.meta.com/horizon/downloads/package/meta-xr-interaction-sdk/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Download from Unity

Updated: Nov 9, 2026|Version209.0

The core interaction building blocks from the Interaction SDK in a lightweight, platform-independent package with no dependency on the Meta XR Core SDK. Provides the foundational framework for grab, poke, ray, and locomotion interactions, along with hand pose detection tools and visual indicators. The Essentials package does not include any Meta-specific dependencies and is designed to work across platforms.
What's New

Hands Debug Overlay

We added the `DebugInputView` prefab, which displays an overlay with the state and logs of OS-provided hand gestures, including pinch and microgestures. For pinch, the overlay shows the current state and pinch strength of the index and middle fingers on each hand. See the [Hands debug overlay](https://developers.meta.com/horizon/documentation/unity/unity-isdk-hands-debug-overlay/) documentation for more information.

OS-Style Panel Transformer

We added the `OSPanelTransformer`, which moves panels the same way the system UI does. The panel smoothly tracks the user's head and retains its angular size as it moves closer or farther away.

What's Fixed

Fixed `FindObjectsByType` calls that were incompatible with Unity 6.4 and later.

Fixed per-frame allocation in `GazeInteractor` by reusing the same `GazeCandidateProperties` object every frame. Copy the properties if you need them beyond the current frame.

Fixed a 40-byte per-frame allocation in `RayInteractor` by reusing the same `RayCandidateProperties` object. Copy the properties if you need them beyond the current frame.

Improvements

Added the standard Interaction SDK hover effects to the 3D objects in the GazeExamples scene.

Support and legal

English (US)

© 2026 Meta
# Grab Interaction Best Practices | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-isdk-hand-grab-best-practices
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Nov 3, 2025

This topic describes several best practices you can use to implement efficient and robust [Hand Grab](https://developers.meta.com/vr/documentation/unity/unity-isdk-hand-grab-interaction/) and [Controller Grab](https://developers.meta.com/vr/documentation/unity/unity-isdk-grab-interaction/) interactions in your project.

You can reference HandGrabPoses in other GameObjects to avoid duplicating them everywhere.

You can reuse HandGrabPoses for other Interactables, so there is no need to duplicate them if you are doing DistanceHandGrab and HandGrab.

If you provide several HandGrabPoses with different scales on the same Interactable, they will be interpolated depending on the scale of the Hand or the Object.

It is important to use values for the Sliding Threshold that make sense for the particular interaction. For items that are fixed in space, like handrails or levers, setting the sliding threshold to 0 is appropriate. For almost everything else a value of 1 (max) generally makes the most sense.

Lateral Thumb Pinch (Thumb against the side of the Index) is important for certain grabs like keys or knobs. For everything else, it might get in the way, so ignore the Thumb and use the Index in the Grabbing Rules if you don’t need Lateral Thumb Pinch.

When using HandGrab with controllers (or ControllersAsHands) it is important that the HandGrabAPI is driven by the actual Triggers, even if visually it looks like a Hand. Use the ControllerPinchInjector with the HandGrabAPI.

- For information on using Interaction SDK, see [Interaction SDK Overview](https://developers.meta.com/vr/documentation/unity/unity-isdk-interaction-sdk-overview/).
- To get started with Interaction SDK, see [Getting Started with Interaction SDK](https://developers.meta.com/vr/documentation/unity/unity-isdk-getting-started/).
- To add hand grab interactions, see [Add an Interaction with Quick Actions](https://developers.meta.com/vr/documentation/unity/unity-isdk-quick-actions/).

- [Hands design](https://developers.meta.com/vr/design/hands/): Learn about design for using hands in your app.
- [Hands technology](https://developers.meta.com/vr/design/hands-technology/): Learn about the technology behind hands.
- [Design Principles](https://developers.meta.com/vr/design/hands-plain-language-principles/): Learn about twenty principles for designing hand interactions.
- [Best Practices](https://developers.meta.com/vr/design/hands-best-practices/): Learn about applied practices for designing hand interactions.
- [Gesture Design](https://developers.meta.com/vr/design/hands-gesture-design/): Learn about best practices for gesture design and pose and gesture detection.
- [Limitations & Mitigations](https://developers.meta.com/vr/design/hands-limitations-mitigations/): Learn about tracking limitations and design and code mitigations for hands.
- [Hands examples](https://developers.meta.com/vr/design/hands-examples/): Learn about hands interaction examples.
- [Quickstart](https://developers.meta.com/vr/documentation/unity/unity-tutorial-hello-vr/): Get started quickly with a hands prototype – build your first VR project.
- [Hand representation](https://developers.meta.com/vr/design/hand-representation/): Learn about hand representation.

- [Input mappings](https://developers.meta.com/vr/design/interactions-input-mappings/): Learn about how input mappings bridge modalities and interaction types.
- [Input hierarchy](https://developers.meta.com/vr/design/interactions-input-hierarchy/): Learn about the different input hierarchies.
- [Multimodality](https://developers.meta.com/vr/design/interactions-multimodality/): Learn about multimodality.
- [Ray casting](https://developers.meta.com/vr/design/raycasting_usage/): Learn about indirect interaction through ray casting.
- [Touch](https://developers.meta.com/vr/design/touch_usage/): Learn about direct interaction through touch.
- [Grab](https://developers.meta.com/vr/design/grab_usage/): Learn about grab interactions for object manipulation.
- [Microgestures](https://developers.meta.com/vr/design/design-microgestures/): Learn about microgesture interactions.

Support and legal

English (US)

© 2026 Meta
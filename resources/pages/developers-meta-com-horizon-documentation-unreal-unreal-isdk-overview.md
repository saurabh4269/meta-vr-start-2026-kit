# Interaction SDK for Unreal Engine | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unreal/unreal-isdk-overview
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Aug 31, 2026

The Meta XR Interaction SDK for Unreal Engine lets VR users immersively interact with their virtual environment. With Interaction SDK, you can grab and scale objects, push buttons, navigate user interfaces, and more while using controllers or your physical hands.

Download Interaction SDK

Interaction SDK offers many features to create an immersive XR experience, allowing users to:

- Grab and manipulate objects, including scaling and moving objects freely or along fixed axes
- Throw a held object
- Press buttons or interact with surfaces using rays
- Press buttons and scroll user interfaces using poking

See [Interaction SDK Samples for Unreal Engine](https://developers.meta.com/vr/documentation/unreal/unreal-isdk-samples) for information on obtaining the sample project that demonstrates the feature set of Interaction SDK.

Interaction SDK Plugin for Unreal Engine consists of:

- A closed source DLL (InteractionSDK Native) that powers ray, poke, grab, and pose-detection interactions
- Unreal ActorComponents and SceneComponents that wrap the native DLL
- Prebuilts that collect components into ready-to-use interactions

Gaze Interactions use the user’s eye gaze as the pointing ray for far interaction, actuated by a hand pinch. Gaze targets:

- Far UI
- Grabbables
- Hover-only objects

Gaze is a hands-only path in Interaction SDK v207. Controllers do not actuate gaze. Add the `UIsdkGazeRigComponent` to your pawn to enable gaze on the rig. Gaze is disabled by default. Turn it on by opening **Project Settings** > **Plugins** > **Meta XR - InteractionSDK**, selecting the **Gaze** group, and setting **Gaze Enabled** to `true`.

The Interaction SDK for Unreal Engine is available from the Meta VR Developer Hub: [Meta XR Interaction SDK Unreal](https://developers.meta.com/vr/downloads/package/meta-xr-interaction-sdk-unreal)

To install the downloaded plugin:

1. Take note of the directory that you have installed Unreal Engine to, e.g. `C:\Epic Games\UE_5.4`. This will be referred to as `[UnrealDir]` below.
2. In the `[UnrealDir]\Engine\Plugins` directory, create a new directory called `Marketplace`.
3. Open the zip file you downloaded and copy the `MetaXRInteraction` folder into the newly created Marketplace directory (`[UnrealDir]\Engine\Plugins\Marketplace`).
4. Run Unreal Editor.
5. In the **Level Editor** toolbar, click **Edit > Plugins**. Search for *Meta* (searching for ‘Meta XR’ may not show all results).
6. Enable both the **Meta XR** plugin (if present) and the **Meta XR Interaction SDK** plugin.
7. Restart Unreal Editor for the changes to take effect.

To get started using Interaction SDK in Unreal Engine with your project, please see [Getting Started with Interaction SDK](https://developers.meta.com/vr/documentation/unreal/unreal-isdk-getting-started/).

To try Interaction SDK interactions without any setup, you can download the following:

- [Interaction SDK Samples](https://github.com/oculus-samples/Unreal-InteractionSDK-Sample), the official reference for Interaction SDK features.

- Meta Quest 2
- Meta Quest 3
- Meta Quest 3S
- Meta Quest Pro
- Meta VR Glasses

- Unreal Engine 5.4 and later

Interaction SDK can integrate with the [Meta XR plugin](https://developers.meta.com/vr/documentation/unreal/unreal-setting-up-metaxr-plugin/), or, in a restricted mode, with Unreal Engine’s built-in **Open XR HandTracking** plugin. This means it will read hand and controller data from whichever of the two plugins are present in the project.

When deploying projects using Interaction SDK to Meta devices, it is recommended that the project includes either the [Meta XR plugin](https://developers.meta.com/vr/documentation/unreal/unreal-setting-up-metaxr-plugin/), or is built on the [Oculus-VR fork of Unreal Engine](https://github.com/Oculus-VR/UnrealEngine).

When deploying to non-Meta devices, Interaction SDK can read hand-tracking data from Unreal’s OpenXR HandTracking plugin as a fallback.

In addition to the [MetaXR feature comparison](https://developers.meta.com/vr/documentation/unreal/unreal-compatibility-matrix), there are some additional Interaction SDK functionality gaps when using the OpenXR path, as highlighted in the following table:

| Feature | MetaXR | OpenXR | 
|---|---|---|
| **Procedural Controller Hand Animation** | ✓ | - | 
| **Hand Tracking Confidence** | ✓ | - | 
| **Input mapping for index pinch** | ✓ | - | 

- **Hand Tracking Confidence** - The MetaXR hand data source provides granular tracking confidence levels. The OpenXR path provides only binary hand validity rather than granular confidence.
- **Input Mapping for Index Pinch** - OpenXR does not currently support a direct input binding for the index pinch gesture. However, developers can utilize the PinchGrabStarted and PinchGrabFinished event delegates found in the IsdkHandFingerPinchGrabRecognizer. These events can be used to implement custom actions triggered by the index pinch gesture.

Interaction SDK plugin has an optional dependency on the following plugins:

- To get started using Interaction SDK in Unreal Engine with your project, see [Getting Started with Interaction SDK](https://developers.meta.com/vr/documentation/unreal/unreal-isdk-getting-started/).

Design guidelines are Meta’s human interface standards and design frameworks that help you create safe, user-oriented, and retainable immersive and passthrough user experiences.

- [Input mappings](https://developers.meta.com/vr/design/interactions-input-mappings/): Understand how input mappings bridge modalities and interaction types.
- [Input hierarchy](https://developers.meta.com/vr/design/interactions-input-hierarchy/): Understand the input hierarchy.
- [Multimodality](https://developers.meta.com/vr/design/interactions-multimodality/): Understand multimodality.
- [Ray casting](https://developers.meta.com/vr/design/raycasting_usage/): Understand indirect interaction through ray casting.
- [Touch](https://developers.meta.com/vr/design/touch_usage/): Understand direct interaction through touch.
- [Grab](https://developers.meta.com/vr/design/grab_usage/): Understand grab interactions for object manipulation.
- [Microgestures](https://developers.meta.com/vr/design/design-microgestures/): Understand microgesture interactions.

- [Input modalities](https://developers.meta.com/vr/design/interactions-input-modalities/): Explore the different input modalities.
- [Head](https://developers.meta.com/vr/design/head/): Design and UX best practices for head input.
- [Hands](https://developers.meta.com/vr/design/hands/): Design and UX best practices for using hands.
- [Controllers](https://developers.meta.com/vr/design/controllers): Design and UX best practices for using controllers.
- [Voice](https://developers.meta.com/vr/design/voice/): Design and UX best practices for using voice.
- [Peripherals](https://developers.meta.com/vr/design/interactions-input-peripherals): Design and UX best practices for using peripherals.

Support and legal

English (US)

© 2026 Meta
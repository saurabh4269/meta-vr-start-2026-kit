# Setup Hand Tracking in Unreal Engine | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unreal/unreal-hand-tracking/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Apr 14, 2026

If you have not previously implemented input motion controllers in Unreal Engine, see Unreal Engine’s [Motion Controller Component Setup](https://dev.epicgames.com/documentation/en-us/unreal-engine/motion-controller-component-setup-in-unreal-engine).

Before you start implementing hand tracking in your app, see the [Hand Tracking Design Guidelines](https://developers.meta.com/vr/design/hands/) for terminology, best practices and interaction models when using hands as an input source in virtual reality.

Review the following store guidelines for hand tracking implementation:

- [VRC.Quest.Input.5](https://developers.meta.com/vr/resources/vrc-quest-input-5/): Hands must render in the correct position and orientation, and must animate properly
- [VRC.Quest.Input.7](https://developers.meta.com/vr/resources/vrc-quest-input-7/): The application must properly respect when input is switched between controllers and hands
- [VRC.Quest.Input.8](https://developers.meta.com/vr/resources/vrc-quest-input-8/): The system gesture is reserved, and should not trigger any other actions within the application

For an overview about how hand tracking is implemented and how it has been used in apps, see the [OC6 Video Presentation: Hand Tracking Deep Dive: Technology, Design, and Experiences](https://www.youtube.com/watch?v=gpQePH-Ffbw).

For standard hand interactions such as poke, grab, and ray-based selection, the [Interaction SDK](https://developers.meta.com/vr/documentation/unreal/unreal-isdk-overview) is the recommended approach. The sections below cover the lower-level Meta Core SDK APIs for custom hand tracking implementations. For more information, see [Hand Tracking in Unreal Engine](https://developers.meta.com/vr/documentation/unreal/unreal-hand-tracking-overview/).

The following image shows the architecture of the hand tracking implementation for Unreal Engine, and how input information from hands is routed using the same mechanism as controller input.

As shown in the diagram, device input remains the main source of input data for Unreal Engine. Device input routes hand input through the Unreal Engine input system the same way that controller buttons and sticks are routed. Pinches and pinch strength are also routed as hand input.

Hand-specific features like the mesh/skeleton and bone rotation are provided through the `UOculusXRInputFunctionLibrary` class in the `OculusXRInput` module. This Blueprint function library provides static methods to access hand-specific data such as hand scale, pointer pose, bone rotation, tracking confidence, and more.

You can turn on hand tracking in Unreal Engine in the **Project Settings**, which adds the `com.oculus.permission.HAND_TRACKING` entry to the Android manifest for your project.

Go to **Edit > Project Settings**, go to **Plugins** and select **Meta XR**.
Under **Hand Tracking Support**, choose:

- **Controllers**: Hand tracking will not be enabled for your app
- **Controllers and Hands**: A user can use hand tracking or controllers in your app
- **Hands Only**: A user must have hand tracking enabled on their device to use your app

To set high frequency, in **Project Settings > Plugins > Meta XR > Hand Tracking Frequency**, select **High**.

The hand tracking integration for Unreal Engine includes the following components.

In summary, the input module has these additions for hand tracking:

- The Input Module supports input from touch controllers and hand tracking.
- The Input Module relays hand pinches and pinch strength through Unreal Engine’s input event system.
- The module will update and store new hand poses, which can be accessed through Blueprints or by the `UOculusXRHandComponent`.

Specifically:

- Hand state data, including hand poses and tracking status, is accessible through`UOculusXRInputFunctionLibrary` Blueprint functions such as `GetTrackingConfidence` and `IsHandTrackingEnabled`.
- Pinch inputs are updated with key events and axes for pinches and pinch strength
    
  - New key names and axes are defined for hands in the Unreal Engine input system, identifying each finger (Thumb, Index, Middle, Ring, and Pinky) per hand.
  - Pinch strength values can be bound to UE input settings so that their events can be associated with Blueprints and the`UOculusXRHandComponent`. See [Input Bindings](https://developers.meta.com#input-binding) for how to do this.
- Updating Hand Pose
    
  - Use `GetControllerOrientationAndPosition` to get the root hand position
  - Use custom functions for [getting the pointer pose](https://developers.meta.com/vr/documentation/unreal/unreal-blueprints-get-pointer-pose/) and [bone rotations](https://developers.meta.com/vr/documentation/unreal/unreal-blueprints-get-bone-rotation/)

Hand tracking exposes input bindings through Unreal Engine’s input system under the **Oculus Hand** category. PinchStrength values for each finger (for example, `OculusHand_Left_IndexPinchStrength`) can be bound as **Axis Mappings** and return a float value representing pinch strength.

Pinch button events (for example, `OculusHand_Left_IndexPinch`) are registered internally but are not available through the standard Action Mapping UI. To respond to pinch button events, poll the values through C++ or use the `UOculusXRInputFunctionLibrary` Blueprint functions.

To create an axis mapping for pinch strength:

1. Go to **Edit > Project Settings**, then find **Engine > Input**.
2. Under **Axis Mappings**, add a new mapping.
3. For the mapping key value, search for the **Oculus Hand** category to find the available hand tracking input bindings. The following image shows an example:

The Unreal Engine integration provides several Blueprint functions on `UOculusXRInputFunctionLibrary` for accessing hand tracking data.

| Function | Description | 
|---|---|
|  | Returns the name of the bone from the bone ID | 
|  | Returns all bone rotations corresponding to the specified hand type | 
|  | Returns which hand is the dominant user hand | 
| GetFingerTrackingConfidence | Returns the tracking confidence for a specific finger | 
|  | Returns the hand scale | 
|  | Returns a `USkeletalMesh` for the specified hand type | 
|  | Returns the current hand pointer pose | 
|  | Returns the tracking confidence of the specified hand | 
|  | Initializes physics capsules on the runtime hand mesh | 
| IsHandInteractionProfile | Returns true if the current interaction profile is hands | 
| IsHandPositionValid | Returns true if the hand position data is valid | 
|  | Returns true if hand tracking is enabled on the device | 
|  | Returns true if the pointer pose is valid | 
| IsSimultaneousHandsAndControllersEnabled | Returns true if simultaneous hands and controllers mode is enabled | 
| SetSimultaneousHandsAndControllersEnabled | Enables or disables simultaneous hands and controllers mode | 

The `UOculusXRHandComponent` is part of the `OculusXRInput` module. This component is a subclass of [Unreal’s `UPoseableMeshComponent`](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/Components/UPoseableMeshComponent), and must be a child of a `UMotionControllerComponent`, which provides the tracking pose and late-update functionality for hands.

The component handles loading the mesh/skeleton as well as updating the bones. This component also handles setting new materials for the hand, hiding hands when tracking is lost/confidence is low.
The component also provides options to update the root pose, update root scale, set the pointer pose root, and enable physics capsules.

The following image shows an example of these properties, and how to set them in Unreal Engine.

When the user performs the [system gesture](https://developers.meta.com/vr/design/hands/#system-gesture) to return to Home or access the menu, it is surfaced through the `OVRPlugin` as an `ovrpButton_Start` signal and a status flag. This behaves the same as pressing the Home key or menu button on a controller. You will not need special menu logic for hands in this case.

The following image shows the pinch gesture as well as the system gesture.

Dominant hand features are surfaced through Hand Status flags of the OVRPlugin. You can access this information by using the Blueprint function [GetDominantHand](https://developers.meta.com/vr/documentation/unreal/unreal-blueprints-get-dominant-hand/).

Design guidelines are Meta’s human interface standards and design frameworks that help you create safe, user-oriented, and retainable immersive and passthrough user experiences.

- [Hands design](https://developers.meta.com/vr/design/hands/): Design best practices for using hands in your app.
- [Hands technology](https://developers.meta.com/vr/design/hands-technology/): Understand the technology behind hands.
- [Design Principles](https://developers.meta.com/vr/design/hands-plain-language-principles/): Twenty principles for designing hand interactions.
- [Best Practices](https://developers.meta.com/vr/design/hands-best-practices/): Applied practices for designing hand interactions.
- [Gesture Design](https://developers.meta.com/vr/design/hands-gesture-design/): Best practices for gesture design and pose and gesture detection.
- [Limitations & Mitigations](https://developers.meta.com/vr/design/hands-limitations-mitigations/): Tracking limitations and design and code mitigations for hands.
- [Hands examples](https://developers.meta.com/vr/design/hands-examples/): Hands interaction examples.
- [Hand representation](https://developers.meta.com/vr/design/hand-representation/): Understand hand representation.

Support and legal

English (US)

© 2026 Meta
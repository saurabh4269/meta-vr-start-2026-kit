# Hand Tracking Overview for Meta VR Devices in Unity | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-handtracking-overview/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 14, 2026

Hand tracking enables the use of hands as an input method for Meta VR devices. Using hands as an input method delivers a new sense of presence, enhances social engagement, and delivers more natural interactions. Hand tracking complements controllers and is not intended to replace controllers in all scenarios, especially with games or creative tools that require a high degree of precision.

🎓 Deciding whether hand tracking is right for your title?

We support the use of hand tracking on Windows through the Unity Editor, when using Meta Quest headset and Link. This functionality is only supported in the Unity Editor to help improve iteration time for Meta Quest developers. Check out the [Hand Tracking Design](https://developers.meta.com/vr/design/hands/) resources for detailed guidelines on using hands in virtual reality.

The recommended way to integrate hand tracking for Unity developers is to use the [Interaction SDK](https://developers.meta.com/vr/documentation/unity/unity-isdk-interaction-sdk-overview/), which provides standardized interactions and gestures. Building custom interactions without the SDK can be a significant challenge and makes it difficult to get approved in the store.

| Feature | Description | SDK | Documentation | Samples | 
|---|---|---|---|---|
| **Tracking** |  |  |  |  | 
| Hand Tracking | Hand tracking enables the use of hands as an input method | Meta Core SDK |  |  | 
| Fast Motion Mode (FMM) | Provides improved tracking of fast movements common in fitness and rhythm apps (60Hz) | Meta Core SDK |  |  | 
| Wide Motion Mode (WMM) | Allows you to track hands and display plausible hand poses even when the hands are outside the headset’s field of view | Meta Core SDK |  |  | 
| Multimodal | Provides simultaneous tracking of both hands and controllers. | Meta Core SDK |  |  | 
| Capsense | Provides logical hand poses when using controllers. | Meta Core SDK |  |  | 
| OpenXR Hand Skeleton | Support for the OpenXR hand skeleton standard | Interaction SDK / Meta Core SDK |  |  | 
| **Poses & Gestures** |  |  |  |  | 
| Pose Detection | A pose is detected when the tracked hand matches that pose’s required shapes and transforms | Interaction SDK |  |  | 
| Pose Recording | Capture a pose for use in pose detection. | Interaction SDK |  |  | 
| Gesture Detection | Sequences can recognize a series of IActiveStates over time to compose complex gestures | Interaction SDK |  |  | 
| Microgestures | Recognize thumb tap and thumb swipe motions performed on the side of the index finger. | Interaction SDK |  |  | 
| **Interactions** |  |  |  |  | 
| Poke | Interact with surfaces via direct touch using hands | Interaction SDK |  |  | 
| Grab | Enable you to pick up or manipulate objects in the world using controllers or hands. | Interaction SDK |  |  | 
| Hand Grab | Provides a physics-less means of grabbing objects that’s specifically designed for hands | Interaction SDK |  |  | 
| Distance Grab | Lets you use your hands to grab and move objects that are out of arm’s reach | Interaction SDK |  |  | 
| Ray Grab | Object can be interacted with by the user from a distance by casting a ray out from the hand or controller. | Interaction SDK |  |  | 
| Custom Grab Poses | Record a custom hand grab pose to control how your hands conform to a grabbed object | Interaction SDK |  |  | 
| Throw | Enable throwing objects using hands. | Interaction SDK |  |  | 
| Raycast | Interact with objects in the world from a distance by casting a ray, or line, out from the hand or controller. | Interaction SDK |  |  | 
| 2D Widget Interaction | Handles all the scaffolding and plumbing necessary to display a Widget Blueprint in the world and make it interactable. | Interaction SDK |  |  | 
| **Visuals** |  |  |  |  | 
| Custom hand models | Replace the default Interaction SDK hands with your own set of custom hands | Interaction SDK |  |  | 

Support and legal

English (US)

© 2026 Meta
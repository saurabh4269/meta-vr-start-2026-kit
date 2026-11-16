# Detecting a Hand Pose | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-isdk-building-hand-pose-recognizer
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Jan 21, 2026

In this tutorial, you will learn how to detect a hand pose by constructing a thumbs-up pose for both hands. For a detailed explanation of how pose recognition works, see [Hand Pose Detection](https://developers.meta.com/vr/documentation/unity/unity-isdk-hand-pose-detection/)

Custom hand poses for controllers and controller-driven hands

Controllers are not supported by hand poses since they rely on information about your physical hand, such as finger position and wrist orientation. Detecting hand poses does work with controller-driven hands, though they may be more limited as to what poses can be expressed and detected. You can use custom hand poses to trigger interactions or animate avatars. To determine whether the player makes the custom hand pose, pose detection algorithms compare the hand joint positions to the pose to detect matches.

The following diagram shows how the detection algorithm checks for the different parts of the thumbs-up pose.

The pose is a combination of two different shapes (thumb curl open and all fingers closed) and a transform orientation (wrist up).

This guide assumes you have a scene set up with a camera rig configured with a **TransformFeatureStateProvider** and **FingerFeatureStateProvider** for each hand. Add an interaction rig by following the instructions in the [Create Comprehensive Rig](https://developers.meta.com/vr/documentation/unity/unity-isdk-add-comprehensive-interaction-rig) guide. If you built your own custom rig and want to add these components, see [Configuring a custom rig for hand pose detection](https://developers.meta.com#configuring-a-custom-rig-for-hand-pose-detection).

The Interaction SDK comprehensive interaction rig contains a GameObject for each hand’s interactions. In this guide, these are referred to as the left or right hand GameObject, which you can find in the Hierarchy under **OVRCameraRig** > **OVRInteractionComprehensive** > **\[Left|Right\]Interactions**.

Each hand GameObject contains a GameObject for the hand’s features, such as the **TransformFeatureStateProvider** and **FingerFeatureStateProvider** components. In this guide, these are referred to as the left or right hand features GameObject, which you can find in the Hierarchy under **OVRCameraRig** > **OVRInteractionComprehensive** > **\[Left|Right\]Interactions** > **Features**.

If you are using your own custom rig, use the appropriate GameObjects on your rig that correspond to these GameObjects.

The custom pose is defined by a collection of components, added to an empty GameObject.

1. In the**Hierarchy**, add an empty GameObject by right-clicking and selecting **Create Empty**.
2. Name the GameObject**ThumbsUpPoseLeft**.
3. In the **Inspector**, add the following components to **ThumbsUpPoseLeft**:
  - **ShapeRecognizerActiveState**
  - **TransformRecognizerActiveState**
  - **ActiveStateGroup**
  - **ActiveStateUnityEventWrapper**
4. Repeat these steps for the right hand, naming that GameObject **ThumbsUpPoseRight**.

Shapes, which represent arrangements and states of the fingers, must be stored in the hand’s **ShapeRecognizerActiveState** component. The thumbs-up pose includes shapes that check for the following arrangements:

- All fingers are fully closed
- Thumb is fully extended

The SDK requires matching both these shapes to confirm that the thumbs-up shape is true.

However, a shape doesn’t define a pose on its own because shapes don’t track velocity or the hand’s orientation in space.

1. Under**Hierarchy**, select the **ThumbsUpPoseLeft** GameObject you created in the previous section.
2. In the**Inspector**, in the **ShapeRecognizerActiveState** component, set the **Hand** property to the left hand GameObject to track the shape of the left hand.
3. Set**Finger Feature State Provider** to the left hand features GameObject. If prompted to select a component, select the `FingerFeatureStateProvider` component. This allows the [ShapeRecognizerActiveState](https://developers.meta.com/vr/reference/interaction/v209/class_oculus_interaction_pose_detection_shape_recognizer_active_state/) component to access the state of all five fingers on the left hand, so it can compare them to the shapes you define.
4. In the**Shapes** property, click the **+** twice to add two elements to the list.
5. Set**Element 0** to the **FingersAllClosed** ShapeRecognizer asset by clicking the circle in the property’s textbox and searching for *FingersAllClosed*. This is the first shape of the pose.**Note**: If you cannot find the shapes in the Quick Search Tool, locate them in the **Meta XR Interaction SDK Essentials** > **Runtime** > **Sample** > **Poses** > **Shapes** folder and drag them onto the **Shapes** property.
6. Set**Element 1** to the **ThumbUp** ShapeRecognizer asset. This is the second shape of the pose.
7. Repeat these steps for the**ThumbsUpPoseRight** GameObject, using the right hand GameObject for the **Hand** property and the right hand features GameObject for the **Finger Feature State Provider**.

Since pose shapes don’t track the orientation of the hand, your pose is active whenever your thumb is extended and the other fingers are closed, regardless of which way your hand is rotated. To define the correct orientation, a pose uses the **TransformRecognizerActiveState** component.

To ensure the hand pose is a thumbs-up instead of a thumbs-down, define the pose’s orientation to be the wrist facing upwards in world space.

1. In the**Hierarchy**, select the **ThumbsUpPoseLeft** GameObject.
2. In the**Inspector**, in the **TransformRecognizerActiveState** component, set the **Hand** property to left hand GameObject.
3. Set the**Transform Feature State Provider** property to the left hand features GameObject to obtain the left hand’s transform data.
4. In the**Transform Feature Configs** dropdown, select **Wrist Up** to define the correct orientation as the wrist facing up.
5. Under**Transform Config**, in the **Up Vector Type** dropdown, select **World** to define the wrist orientation as relative to world space.
6. Set the**Feature Thresholds** property to **DefaultTransformFeatureStateThresholds** by clicking the circle in the property’s textbox and searching for *DefaultTransformFeatureStateThresholds*. This is a set of default threshold definitions created by the SDK team.**Note**: If the thresholds assets do not show up in the finder dialog, they can be found in the **Meta XR Interaction SDK Essentials** > **Runtime** > **Default Settings** > **Poses Detection** folder. You can drag and drop them onto the property from there.
7. Repeat these steps for the**ThumbsUpPoseRight** GameObject, using the right hand GameObject for the **Hand** property and the right hand features GameObject for the **Transform Feature State Provider**.

So far you’ve defined the shapes and the orientation that together make a thumbs-up. Now it’s time to check the shapes and orientation simultaneously. To check both simultaneously, you’ll combine the shapes and orientation in an **Active State Group**. This group becomes active when the tracked hand matches all of the required shapes and orientation.

1. In the**Hierarchy**, select the **ThumbsUpPoseLeft** GameObject.
2. In the**Active State Group** component, in the **Shapes** property, click the **+** twice to add two elements to the list.
3. Set**Element 0** to the **ThumbsUpPoseLeft** GameObject. A list of options appears. Select **ShapeRecognizerActiveState** from the list.
4. Set**Element 1** to the **ThumbsUpPoseLeft** GameObject. A list of options appears. Select **TransformRecognizerActiveState** from the list.
5. Repeat these steps for the**ThumbsUpPoseRight** GameObject.

To track whether the pose is occurring, use the **Active State Unity Event Wrapper** component, which tracks an active state and fires its **WhenActivated** and **WhenDeactivated** events based on that state.

1. In the**Hierarchy**, select the **ThumbsUpPoseLeft** GameObject.
2. In the**Active State Unity Event Wrapper** component you added earlier, set the **Active State** property to the **ThumbsUpPoseLeft** GameObject. A list of options appears. Select **ActiveStateGroup** from the list because you want to track the combined state of the shapes and orientation, not the individual states.
3. Add your own custom functions to the**When Activated()** list, the **When Deactivated()** list, or both. These functions will trigger when a thumbs-up starts or stops.
4. Repeat these steps for the**ThumbsUpPoseRight** GameObject.

If you have built your own custom rig and want to add the components required for hand pose detection, you can follow these steps.

Hand tracking provides transform data about your hands, like which direction your wrist is facing. To access that data, each hand needs a **TransformFeatureStateProvider** component. The Interaction SDK comprehensive interaction rig already contains these components for each hand, but if you built your own rig, you’ll need to add them.

1. In the**Hierarchy**, on your rig GameObject, select your left hand features GameObject.
2. In the**Inspector**, add a **TransformFeatureStateProvider** component.
3. Repeat these steps for your right hand features GameObject.

Finger thresholds define when a finger is in a specific [state](https://developers.meta.com/vr/documentation/unity/unity-isdk-active-state/) (for example, curled or open). For the thumbs-up pose, you will use the default thresholds included with the Interaction SDK. To use the default thresholds, you need to add a **FingerFeatureStateProvider** component to each hand.

1. In the**Hierarchy**, on your rig GameObject select your left hand features GameObject.
2. In the**Inspector**, add a **FingerFeatureStateProvider** component.
3. In the**FingerFeatureStateProvider** component, set the **Hand** property to your left hand GameObject.
4. On the**Finger State Thresholds** property, click the **+** button five times to add elements for each finger.
5. On**Element 0**, set the **Finger** property to *Thumb*, and set the **State Thresholds** property to point to the **DefaultThumbFeatureStateThresholds** asset.**Note**: If the thresholds assets do not show up in the finder dialog, they can be found in the **Meta XR Interaction SDK Essentials** > **Runtime** > **Default Settings** > **Poses Detection** folder. You can drag and drop them onto the property from there.
6. On**Element 1**, set the **Finger** property to *Index*, and set the **State Thresholds** property to point to the **DefaultFingerFeatureStateThresholds** asset.
7. On**Element 2**, set the **Finger** property to *Middle*, and set the **State Thresholds** property to point to the **DefaultFingerFeatureStateThresholds** asset.
8. On**Element 3**, set the **Finger** property to *Ring*, and set the **State Thresholds** property to point to the **DefaultFingerFeatureStateThresholds** asset.
9. On**Element 4**, set the **Finger** property to *Pinky*, and set the **State Thresholds** property to point to the **DefaultFingerFeatureStateThresholds** asset.
10. Repeat these steps for your right hand features GameObject, using your right hand GameObject for the**Hand** property.

- To understand the concepts and components used to detect a pose, see [Hand Pose Detection](https://developers.meta.com/vr/documentation/unity/unity-isdk-hand-pose-detection/).
- To record your own custom pose to use for pose detection, see [Hand Pose Selector Recorder](https://developers.meta.com/vr/documentation/unity/unity-isdk-hand-pose-selector-recorder).
- To use velocity and rotation data when detecting poses, see [Hand Pose Detection](https://developers.meta.com/vr/documentation/unity/unity-isdk-hand-pose-detection/#velocityrecognition).
- To learn about the concept of Active State, see [Active State Overview](https://developers.meta.com/vr/documentation/unity/unity-isdk-active-state/).
- To practice using the basics of Active State, see [Use Active State](https://developers.meta.com/vr/documentation/unity/unity-isdk-use-active-state/).
- To learn how to detect custom body poses, see [Compare Body Poses](https://developers.meta.com/vr/documentation/unity/unity-isdk-compare-body-poses/).
- To try pose recognition in a pre-built scene, see the [PoseExamples](https://developers.meta.com/vr/documentation/unity/unity-isdk-example-scenes/#poseexamples) or **DebugGesture** scenes.

- [Hands design](https://developers.meta.com/vr/design/hands/): Learn about design for using hands in your app.
- [Hands technology](https://developers.meta.com/vr/design/hands-technology/): Learn about the technology behind hands.
- [Design Principles](https://developers.meta.com/vr/design/hands-plain-language-principles/): Learn about twenty principles for designing hand interactions.
- [Best Practices](https://developers.meta.com/vr/design/hands-best-practices/): Learn about applied practices for designing hand interactions.
- [Gesture Design](https://developers.meta.com/vr/design/hands-gesture-design/): Learn about best practices for gesture design and pose and gesture detection.
- [Limitations & Mitigations](https://developers.meta.com/vr/design/hands-limitations-mitigations/): Learn about tracking limitations and design and code mitigations for hands.
- [Hands examples](https://developers.meta.com/vr/design/hands-examples/): Learn about hands interaction examples.
- [Quickstart](https://developers.meta.com/vr/documentation/unity/unity-tutorial-hello-vr/): Get started quickly with a hands prototype – build your first VR project.
- [Hand representation](https://developers.meta.com/vr/design/hand-representation/): Learn about hand representation.

Support and legal

English (US)

© 2026 Meta
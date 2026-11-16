# Getting Started with Interaction SDK | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-isdk-getting-started/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 14, 2026

This tutorial explains how to create your first interactions using Interaction SDK. You will add the Interaction SDK rig to your scene, set up a UI, and add interactions to enable users to interact with the UI.

🎓 New to building for hands?

The [Building Your First Game for Hands](https://app.dataprotocol.com/container/256?utm_source=mh_docs&utm_medium=link&utm_campaign=DEV-unity-isdk-getting-started&utm_id=mh) interactive course on Meta VR Academy walks you through the full journey, from choosing a core loop to testing on-device.

Runtime Unity XR and the Project Setup Tool

If you must use Unity XR instead of the Meta XR Core SDK, see Before proceeding with this tutorial, complete the setup steps outlined in the following sections:

- [Set Up Unity for XR development](https://developers.meta.com/vr/documentation/unity/unity-project-setup/) to create a project with the necessary dependencies
- [Set up your device](https://developers.meta.com/vr/documentation/unity/unity-env-device-setup) to configure and test your project on a headset
- Complete [Setup Interaction SDK](https://developers.meta.com/vr/documentation/unity/unity-isdk-setup)

In Interaction SDK, the rig is a predefined collection of GameObjects that enables you to see your virtual environment and initiate actions, such as grabbing, teleporting, or poking. The **OVRComprehensiveInteractionRig** prefab contains this rig. It integrates many of the core interactions and features offered by Interaction SDK, wired up according to best practices, including support for poke, ray, multiple types of grabs, and locomotion. It also adds support for hands, controllers, and controller-driven hands to your scene.

The rig reads hand, controller, and headset data from an **OVRCameraRig**, which handles the camera system and head-movement tracking. Adding the rig as a child of the **OVRCameraRig** is what the Quick Action does, and it lets the editor resolve the rig’s camera reference by searching the parent objects. If you place the rig elsewhere in the **Hierarchy** panel, assign the camera rig on the rig’s `OVRCameraRigRef` component yourself.

Instead of manually adding these prefabs to the scene, we recommend using Interaction SDK Quick Actions, which finds or adds any missing dependencies such as the camera rig. You can read a more advanced guide about how to use this rig in [Comprehensive Interaction Rig](https://developers.meta.com/vr/documentation/unity/unity-isdk-cameraless-rig/).

Gaze also works with the UnityXR rig. To use that rig instead, select **Interaction SDK** > **Add UnityXR Comprehensive Interaction Rig** and follow [Create the UnityXR Interaction Rig](https://developers.meta.com/vr/documentation/unity/unity-isdk-add-comprehensive-interaction-rig-unityxr/). The steps below describe the OVR rig, as does the **OVR Manager** eye tracking step later on this page.

1. Delete the default**Main Camera** if it exists, since Interaction SDK uses its own camera rig.
2. Right click on the**Hierarchy** and select the **Interaction SDK** > **Add OVR Comprehensive Interaction Rig** Quick Action.
3. If you have an**OVRCameraRig** in the scene, it appears referenced in the wizard. If there is no camera rig, click **Fix All** so the wizard creates one.
4. Select**Generate As Editable Copy** and set the **Prefab Path** to store an intermediary copy of the rig prefab so you can store as many overrides as needed.
5. If you want to further customize the rig, adjust the settings in the wizard. For details on the available options, see the[OVR Comprehensive Interaction Rig Quick Action](https://developers.meta.com/vr/documentation/unity/unity-isdk-ovr-interaction-rig-quick-action) documentation.
6. Click**Create** to add the OVR Comprehensive Interaction Rig to the scene.
7. In the**Hierarchy**, select the **OVRCameraRig**.
8. On the**Inspector** tab, go to **OVR Manager** > **Quest Features**, and then on the **General** tab, in the **Hand Tracking Support** list, select **Controllers And Hands**, **Hands Only** or **Controllers Only** depending on your needs. The Hands Only option lets you use hands as the input modality without any controllers.

1. In the**Project** panel, navigate to the **Packages** > **Meta XR Interaction SDK Essentials** > **Runtime** > **Sample** > **Objects** > **UISet** > **Prefabs** > **Backplate** folder and add a backplate for the UI by dragging the EmptyUIBackplateWithCanvas prefab to the Hierarchy panel.The backplate prefab contains a**Canvas**, a background for the UI, some basic layout components, and ray and poke interactable components to enable direct touch and raycast interactions with the UI.
2. In the**Hierarchy**, select the **CanvasRoot**. In the **Inspector**, under **Rect Transform**, use the **Width** and **Height** properties to set the size of the Canvas. This example uses the following settings to scale it to a reasonable size for a few components:
  - **Rect Transform** > **Width**: *500*
  - **Rect Transform** > **Height**: *250*
3. In the**Hierarchy**, select the **UIBackplate**. In the **Inspector**, under **Rect Transform**, set the **Width** and **Height** properties to match the **Canvas** width and height set in the previous step. This example uses the following settings to match the Canvas size:
  - **Rect Transform** > **Width**: *500*
  - **Rect Transform** > **Height**: *250*
4. Add some UI elements to the panel to interact with by dragging and dropping prefabs from the**Packages** > **Meta XR Interaction SDK Essentials** > **Runtime** > **Sample** > **Objects** > **UISet** > **Prefabs** folder. For example, in the **Button** > **UnityUIButtonBased** folder, drag the **PrimaryButton\_IconAndLabel\_UnityUIButton** prefab to the **UIBackplate** object in the **Hierarchy**. The button element appears on the UI. Add as many elements as you desire to create your UI.

Gaze targeting reads eye pose data, so your project must declare eye tracking support before it runs on a device. In the **Hierarchy** panel, select the **OVRCameraRig**. In the **Inspector** panel, under **OVR Manager** > **Quest Features** > **General**, set **Eye Tracking Support** to *Supported* or *Required*. **Eye Tracking Support** is a dropdown rather than a checkbox. Choose *Supported* if your app still runs without eye tracking, or *Required* if it does not.

1. Right-click on the**Canvas**, and select **Interaction SDK** > **Add Gaze Interaction to Canvas**. The wizard for that menu item appears.
2. In the wizard, you may see a message about a missing`PointableCanvasModule`. Select **Fix**. This adds the module to the scene’s EventSystem object, or creates an object that carries both. `PointableCanvasModule` is a scene-level singleton, so it does not go on the Canvas.
3. If you want to further customize the interaction, adjust the interaction’s settings in the wizard. For details on the available options, see the[Gaze Canvas Quick Action](https://developers.meta.com/vr/documentation/unity/unity-isdk-gaze-ui-quick-action/) documentation.
4. Select**Create**. The wizard automatically adds the required components for the interaction to the Canvas. It also adds components to the camera rig if those components weren’t already there.

To make the UI grabbable, a best practice is to add a *handle* to the UI for the user to grab onto instead of grabbing the UI panel itself. This helps to avoid conflicts between grabbing the UI and interacting with the UI elements. The handle is a sibling child object to the UI under a common parent, so when you add the grab interaction to the handle, you can set the target transform of the Grabbable to point to the transform of the root object and move the UI and handle all at once.

1. Right-click in the**Hierarchy** panel and select **Create Empty** to add a new GameObject. This acts as a container for the UI and handle. Name the object accordingly. In the example, it is called *UIContainer*.
2. In the**Hierarchy** panel, drag your UI onto the new UI container object to parent it.
3. In the**Hierarchy** panel, right-click on the UI container object and choose **Create** > **UI** > **Canvas**. Name the new object **GrabBar**. In this example, the handle is composed of a **Canvas** with an **Image** that has a rounded box material applied. You can use a different visual for your handle as long as it has a surface to interact with. In the **Canvas** component properties, set the **Render Mode** to *World Space* and Enable *TexCoord1* in the **Additional Shader Channels**. Set the **Scale**, **Width**, and **Height** for the **Rect Transform** component of the **GrabBar** object to set the size appropriately for your use case. In this example, they are set to:
  - **Width**: 300
  - **Height**: 20
  - **Scale**: (0.0005, 0.0005, 0.0005)
4. Place the handle object directly beneath the UI you want to grab.
5. In the**Hierarchy** panel, right-click on the **GrabBar** object and choose **Create** > **UI** > **Image**. Set the **Width** and **Height** for the **Rect Transform** component of the **Image** to match the dimensions set on the Canvas previously. In this example, they are set to:
  - **Width**: 300
  - **Height**: 20
6. In the**Project** panel, click on **Packages** > **Meta XR Interaction SDK Essentials** > **Runtime** > **Sample** > **Materials** > **RoundedBoxUI.mat** and drag it onto the **Material** property of the Image object in the **Inspector** panel.
7. In the Inspector panel with the**Image** object selected, click **Add Component** and select **Rounded Box UI Properties**. Set the Border Radius property to:
  - **X**: 20
  - **Y**: 20
  - **Z**: 20
  - **W**: 20

   The Image is displayed with rounded corners.
8. The default**Movement Provider** added by the Gaze Grab quick action is **Move From Target Provider**. For moving UIs, we recommend **Coronary Movement Provider** instead, because it can billboard the UI to face the user while it is grabbed. In the **Inspector** panel with the *GrabBar* object selected, click **Add Component** and select **Coronary Movement Provider**. You assign it in the wizard later.**Note**: `CoronaryMovementProvider` is experimental. Experimental types can change without a deprecation cycle.

1. Right-click on the*GrabBar* object and select **Interaction SDK** > **Add Gaze Grab Interaction**. The wizard for that menu item appears.
2. In the wizard, select the**Fix** and **Fix All** buttons to fix any errors. This adds missing components or fields where they are required.
3. In the wizard, set the**Target Transform** to point to your UI container object. This causes the grab interaction to affect the entire UI and not only the handle object.
4. In the wizard, set the**Movement Provider** to the **Coronary Movement Provider** on the *GrabBar* object that you added previously. The grab interaction then uses that provider to move the UI.
5. If you want to further customize the interaction, adjust the interaction’s settings in the wizard. For details on the available options, see the[Gaze Grab Quick Action](https://developers.meta.com/vr/documentation/unity/unity-isdk-gaze-grab-quick-action/) documentation.
6. Select**Create**. The wizard automatically adds the required components for the interaction to the **GameObject**. It also adds components to the camera rig if those components weren’t already there.

Both quick actions in this tutorial expose an **Add Required Interactor(s)** setting that controls which devices receive a gaze interactor. It defaults to **Hands**, so following the steps as written gives you gaze on hand tracking alone. To reach controllers too, select **Controllers** in that field before you select **Create**. The setting accepts more than one device, and the rig runs the resulting interactors side by side rather than replacing one with the other.

For the full picture of serving hands, controllers, and gaze from one object, see [Support Hands, Controllers, and Gaze on the Same Object](https://developers.meta.com/vr/documentation/unity/unity-isdk-hands-controllers-and-gaze/).

Gaze depends on eye pose data. Without it, an object that answers only gaze cannot be reached at all.

Both quick actions in this tutorial leave **Enable Ray Fallback** selected by default, so the UI you built already handles this. While eye tracking data is valid, ray interactors are held off the UI and gaze targets it. While that data is not valid, the ray interactors reach the UI instead. If the object you run the quick action on has no ray interactable, the quick action creates one so that ray has something to fall back to. Clear **Enable Ray Fallback** only if you have a reason to leave the object reachable by gaze alone.

For the components this setting adds and how the handoff is filtered, see [Support Hands, Controllers, and Gaze on the Same Object](https://developers.meta.com/vr/documentation/unity/unity-isdk-hands-controllers-and-gaze/#configure-the-gaze-and-ray-fallback).

Use [Link](https://developers.meta.com/vr/documentation/unity/unity-link) to test your project.

1. Open the**Link** desktop application on your computer.
2. Put on your headset, and, when prompted, enable Link.
3. On your development machine, in Unity Editor, select the**Play** button.
4. In your headset, you can interact with the UI directly or at a distance using ray-casting. The UI can be moved around by grabbing it.

Build your project into an .apk to test your project.

1. Make sure your headset is connected to your development machine.
2. In Unity Editor, select**File** > **Build Profiles**.
3. Click**Open Scene List** to open the Scene List window.
4. Add your scene to the**Scene List** by dragging it from the Project panel or by clicking **Add Open Scenes**.
5. Click**Build and Run** to generate an .apk and run it on your headset. In the File Explorer that opens, select a location to save the .apk to and give it a name. The build process may take a few minutes.
6. In your headset, you can interact with the UI directly or at a distance using ray-casting. The UI can be moved around by grabbing it.

- To learn about the key concepts in Interaction SDK, see the [Architecture Overview](https://developers.meta.com/vr/documentation/unity/unity-isdk-architectural-overview/).
- For alternative setup methods, see [Getting Started with Interaction SDK and Unity XR](https://developers.meta.com/vr/documentation/unity/unity-isdk-getting-started-unityxr/).

Add some GameObjects and make them interactable with [Quick Actions](https://developers.meta.com/vr/documentation/unity/unity-isdk-quick-actions/).

Support and legal

English (US)

© 2026 Meta
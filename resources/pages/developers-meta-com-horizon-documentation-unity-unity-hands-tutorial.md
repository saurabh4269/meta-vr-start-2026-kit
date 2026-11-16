# Interaction Setup | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-hands-tutorial
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Oct 17, 2026

This Quickstart step configures an Interaction SDK rig and adds poke, ray, grab, and gaze interactions to a world-space UI.

Complete [Project Setup](https://developers.meta.com/vr/documentation/unity/unity-project-setup/) and continue with the Unity project open after its required configuration checks pass.

Spending some time experiencing great hand interactions and reviewing design guidance can help you make better design decisions as you prototype.

- **Try hands-based apps**: Download [First Hand](https://www.meta.com/experiences/first-hand/5030224183773255/) and the [Interaction SDK Samples](https://www.meta.com/experiences/interaction-sdk-samples/5605166159514983/) on your headset to see what polished hand interactions look and feel like. See [Hands Examples](https://developers.meta.com/vr/design/hands-examples/) for more titles to try.
- **Review the design guidance**: Read the [Hands overview](https://developers.meta.com/vr/design/hands/) to understand how hand tracking works in Meta Horizon OS, and check [Hands Interaction Types](https://developers.meta.com/vr/design/hands-interaction-types/) to learn when to use poke, ray, and grab.
- **Review the principles and practices**: Read the [Design Principles](https://developers.meta.com/vr/design/hands-plain-language-principles/) for the shared design philosophy, then use [Best Practices](https://developers.meta.com/vr/design/hands-best-practices/) for ergonomics, common pitfalls, and do’s and don’ts for hand-based interactions.

Set up your camera rig, build a UI with buttons, sliders, and toggles, and wire up hand interactions. Quick Actions are the recommended way to add the Interaction SDK rig and UI interactions. The wizard manages references and presents related options together. This guide uses Quick Actions as its primary path.

In Interaction SDK, the rig is a predefined collection of GameObjects that enables you to see your virtual environment and initiate actions, such as grabbing, teleporting, or poking. The **OVRComprehensiveInteractionRig** prefab contains this rig. It integrates many of the core interactions and features offered by Interaction SDK, wired up according to best practices, including support for poke, ray, multiple types of grabs, and locomotion. It also adds support for hands, controllers, and controller-driven hands to your scene.

The rig reads hand, controller, and headset data from an **OVRCameraRig**, which handles the camera system and head-movement tracking. Adding the rig as a child of the **OVRCameraRig** is what the Quick Action does, and it lets the editor resolve the rig’s camera reference by searching the parent objects. If you place the rig elsewhere in the **Hierarchy** panel, assign the camera rig on the rig’s `OVRCameraRigRef` component yourself.

Instead of manually adding these prefabs to the scene, we recommend using Interaction SDK Quick Actions, which finds or adds any missing dependencies such as the camera rig. You can read a more advanced guide about how to use this rig in [Comprehensive Interaction Rig](https://developers.meta.com/vr/documentation/unity/unity-isdk-cameraless-rig/).

01 Add the Interaction Rig

02 Configure the Wizard

03 Create the Rig

04 Enable Hand Tracking

1. Delete the default**Main Camera** if it exists, since Interaction SDK uses its own camera rig.
2. Right click on the**Hierarchy** and select the **Interaction SDK** > **Add OVR Comprehensive Interaction Rig** Quick Action.

As an alternative to the Quick Action primary path, open **Window** > **Meta** > **Tools** > **Building Blocks** and add the **Interactions Rig** block. That block lists **Camera Rig** as a dependency, so adding it also adds the camera rig.

Legacy projects may still use the `OVRCameraRigInteraction` prefab in **Packages** > **Meta XR Interaction SDK** > **Runtime** > **Prefabs** > **Legacy**. That prefab is deprecated and does not name a replacement, so use one of the paths above for new work.

Design your interactions so users can keep their arms close to their body with elbows at hip level. Requiring hands above heart level causes rapid fatigue. Place interactive content at a comfortable distance, about 1 to 1.5 meters away, for UI panels. See [Best Practices](https://developers.meta.com/vr/design/hands-best-practices/) for ergonomic guidelines.

For any troubleshooting issues, see:

For production-quality UI, use the Meta Horizon OS UI Set prefabs instead of a plain Canvas and Panel.

1. In the**Project** panel, navigate to the **Packages** > **Meta XR Interaction SDK Essentials** > **Runtime** > **Sample** > **Objects** > **UISet** > **Prefabs** > **Backplate** folder and add a backplate for the UI by dragging the EmptyUIBackplateWithCanvas prefab to the Hierarchy panel.The backplate prefab contains a**Canvas**, a background for the UI, some basic layout components, and ray and poke interactable components to enable direct touch and raycast interactions with the UI.
2. In the**Hierarchy**, select the **CanvasRoot**. In the **Inspector**, under **Rect Transform**, use the **Width** and **Height** properties to set the size of the Canvas. This example uses the following settings to scale it to a reasonable size for a few components:
  - **Rect Transform** > **Width**: *500*
  - **Rect Transform** > **Height**: *250*
3. In the**Hierarchy**, select the **UIBackplate**. In the **Inspector**, under **Rect Transform**, set the **Width** and **Height** properties to match the **Canvas** width and height set in the previous step. This example uses the following settings to match the Canvas size:
  - **Rect Transform** > **Width**: *500*
  - **Rect Transform** > **Height**: *250*
4. Add some UI elements to the panel to interact with by dragging and dropping prefabs from the**Packages** > **Meta XR Interaction SDK Essentials** > **Runtime** > **Sample** > **Objects** > **UISet** > **Prefabs** folder. For example, in the **Button** > **UnityUIButtonBased** folder, drag the **PrimaryButton\_IconAndLabel\_UnityUIButton** prefab to the **UIBackplate** object in the **Hierarchy**. The button element appears on the UI. Add as many elements as you desire to create your UI.

For UI guidelines, see:

Avoid pure white (#FFFFFF) and pure black (#000000) in your UI. They cause eye strain in Passthrough or MR. Use a maximum background brightness of #DADADA for light themes. Colors appear more saturated in-headset than on your monitor, so always verify on the actual device. See [Display Guidelines](https://developers.meta.com/vr/design/display/) for more details.

Now connect the Interaction SDK to the panel’s **CanvasRoot** canvas so you can poke buttons with your fingertips and use ray interactions from a distance. Also add grab to make the UI movable.

Always support **both poke and ray** on UI surfaces. Don't rely on only one. Some users prefer direct touch, others prefer pointing from a distance, and some may have accessibility needs that favor one over the other. Also, hands have **no haptic feedback** unlike controllers, so provide clear audio and visual cues (color changes, animations, sounds) on every interaction. See [Accessibility Guidelines](https://developers.meta.com/vr/design/accessibility/) for inclusive design practices.

01 Add Poke Interaction

02 Add Ray Interaction

03 Add Grab Handle to Move

1. Right-click on the**CanvasRoot**, and select **Interaction SDK** > **Add Poke Interaction to Canvas**. The Poke wizard appears.
2. In the Poke Canvas wizard, you may see a message about a missing PointableCanvasModule. Select**Fix**. This will add the missing PointableCanvasModule.
3. If you want to further customize the interaction, adjust the interaction’s settings in the wizard. For details on the available options, please see the[Poke Canvas Quick Action](https://developers.meta.com/vr/documentation/unity/unity-isdk-poke-quick-action) documentation.
4. Select**Create**. The wizard automatically adds the required components for the interaction to the Canvas. It also adds components to the camera rig if those components weren’t already there.

Use eye tracking to target UI elements, add a separate grab handle, and configure ray fallback when eye tracking data is unavailable.

Gaze targeting reads eye pose data, so your project must declare eye tracking support before it runs on a device. In the **Hierarchy** panel, select the **OVRCameraRig**. In the **Inspector** panel, under **OVR Manager** > **Quest Features** > **General**, set **Eye Tracking Support** to *Supported* or *Required*. **Eye Tracking Support** is a dropdown rather than a checkbox. Choose *Supported* if your app still runs without eye tracking, or *Required* if it does not.

1. Right-click on the**Canvas**, and select **Interaction SDK** > **Add Gaze Interaction to Canvas**. The wizard for that menu item appears.
2. In the wizard, you may see a message about a missing`PointableCanvasModule`. Select **Fix**. This adds the module to the scene’s EventSystem object, or creates an object that carries both. `PointableCanvasModule` is a scene-level singleton, so it does not go on the Canvas.
3. If you want to further customize the interaction, adjust the interaction’s settings in the wizard. For details on the available options, see the[Gaze Canvas Quick Action](https://developers.meta.com/vr/documentation/unity/unity-isdk-gaze-ui-quick-action/) documentation.
4. Select**Create**. The wizard automatically adds the required components for the interaction to the Canvas. It also adds components to the camera rig if those components weren’t already there.

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

You now have an Interaction SDK rig and a world-space UI configured for poke, ray, grab, and gaze interactions. [Deploy and Test](https://developers.meta.com/vr/documentation/unity/unity-deploy-and-test/) verifies these interactions with Meta XR Simulator, Meta Horizon Link, or Build and Run.

- To learn about the key concepts in Interaction SDK, see the [Architecture Overview](https://developers.meta.com/vr/documentation/unity/unity-isdk-architectural-overview/).
- To review package options and requirements, see [Interaction SDK Packages and Requirements](https://developers.meta.com/vr/documentation/unity/unity-isdk-packages-and-requirements/).

Support and legal

English (US)

© 2026 Meta
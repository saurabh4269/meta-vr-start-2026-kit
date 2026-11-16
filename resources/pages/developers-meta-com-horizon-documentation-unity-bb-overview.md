# Explore Meta VR Features with Building Blocks | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/bb-overview/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 8, 2026

Building Blocks is a developer tool for Unity, that helps you quickly start building a new Meta VR app or add features to your existing project.

Each Building Block represents an atomic piece of Meta VR functionality. After adding a Building Block to a scene, all of the feature’s dependencies are installed automatically for you. Any required configuration is also done automatically with the [Project Setup Tool](https://developers.meta.com/vr/documentation/unity/unity-upst-overview).

This page provides basic instructions for adding Building Blocks to an existing project in Unity.

Before proceeding with this tutorial, complete the setup steps outlined in [Set Up Unity for XR development](https://developers.meta.com/vr/documentation/unity/unity-project-setup/) to create a project with the necessary dependencies.

Building Blocks in SDKs

To access Building Blocks for all available features, - [Meta XR Interaction SDK](https://developers.meta.com/vr/downloads/package/meta-xr-interaction-sdk-ovr-integration): Building Blocks for interactions such as ray, poke, locomotion, and grab.
- [Meta XR Audio SDK](https://developers.meta.com/vr/downloads/package/meta-xr-audio-sdk/): Building Blocks for spatial audio features.

To add a building block to your Unity project:

1. In the**Meta XR SDK Window**, select **Building Blocks**. If the window isn’t visible, select **Window** > **Meta** > **Meta XR SDK** to open it.In Unity 6000.3 or later, you can pin the SDK menu to the toolbar. Right-click the Unity toolbar and select**Meta XR SDK** > **SDK menu**.The**Building Blocks** window opens. From this window, you can discover and add the building blocks available
from the Meta XR SDKs included in your project.
2. Locate the building block you want to add and click the preview image to view a description.
3. Click **Add Block** to import it into your scene.

To take a closer look at the Building Blocks in your scene:

1. Select the **\[Building Block\]** GameObject in the Hierarchy.
2. In the**Inspector**, look at the **Building Block** component.Every installed Block comes with a**Building Block** component. By inspecting this component, you can find useful information about how it is being used in your project, including:
  - The Block’s name and a thumbnail representing the feature.
  - Under **Dependencies**, a list of Blocks the current Block depends on. Selecting the icon to the right of a dependency will show the Block in the scene hierarchy.
  - Under **Used by**, a list of Blocks that depend on the current Block. Selecting the icon to the right of a dependent Block will show the Block in the scene hierarchy.

Suppose that you want to add a realistic and responsive 3D representation of a user’s Meta Quest controllers to your app, using Meta XR Core SDK’s controller tracking capabilities.

To do this with Building Blocks:

1. Open your Unity project.
2. In the**Meta XR SDK Window**, select **Building Blocks**. If the window isn’t visible, select **Window** > **Meta** > **Meta XR SDK** to open it.
3. Add the**Camera Rig Building Block** to your scene by clicking the **Add Block to current scene** icon on the bottom right corner of the Block.The**Camera Rig** Building Block contains the [Meta XR camera rig prefab](https://developers.meta.com/vr/documentation/unity/unity-ovrcamerarig), a fundamental part of every scene in a Meta VR app built with Unity.
4. After adding the**Camera Rig** Building Block, delete the **Main Camera** in your scene, if one exists.The**Camera Rig** Building Block replaces the **Main Camera** with the Meta XR camera rig prefab.
5. Add the**Controller Tracking** Building Block, which implements controller movement tracking in your app.Recall that after adding a Building Block, all required dependencies and configurations are handled automatically for you.
6. With your Meta VR device connected to your computer, and the device selected as the build target, build and run the project.
7. Put on your device and interact with the 3D representation of each of your Meta Quest controllers.

To learn more about individual Building Blocks, read the feature documentation corresponding to the Building Block. For example, to learn more about Meta XR interactions, see [Meta XR Interaction SDK Overview](https://developers.meta.com/vr/documentation/unity/unity-isdk-interaction-sdk-overview/).

For more information about Building Blocks that implement multiplayer features, see [Multiplayer Building Blocks](https://developers.meta.com/vr/documentation/unity/bb-multiplayer-blocks).

After you’ve learned about exploring new features of Meta XR Core SDK, you are ready to learn more about [Inputs and Interactions](https://developers.meta.com/vr/documentation/unity/unity-ovrinput/).

Support and legal

English (US)

© 2026 Meta
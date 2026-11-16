# Mixed Reality Utility Kit - Getting started | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-mr-utility-kit-gs
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Nov 10, 2026

- **Understand** the setup requirements for using the Mixed Reality Utility Kit (MRUK).
- **Install** the MRUK package via tarball, Asset Store, or Unity Package Manager (UPM).
- **Configure** a Unity project with the correct permissions and setup for Scene API and Passthrough.
- **Test** in the Unity Editor using simulated room data or live device data via Meta Horizon Link.

Before proceeding with this tutorial, complete the setup steps outlined in the following sections:

- [Set Up Unity for XR development](https://developers.meta.com/vr/documentation/unity/unity-project-setup/) to create a project with the necessary dependencies
- [Set up your device](https://developers.meta.com/vr/documentation/unity/unity-env-device-setup) to configure and test your project on a headset

You can install the Mixed Reality Utility Kit package the following ways:

- **Asset Store**: Visit the [Unity Asset Store](https://assetstore.unity.com/packages/tools/integration/meta-mr-utility-kit-272450), add the package to your assets, and install it from the **My Assets** pane in the Package Manager.
- **Unity Package Manager (UPM)**: Add the following entry to the `dependencies` section of your `manifest.json` file: "com.meta.xr.mrutilitykit": "latest", // e.g. "77.0.0" Alternatively, select**Install package by name** in the Package Manager and enter `com.meta.xr.mrutilitykit`.
- **Import from disk**: Download the package directly from the [Meta Developer site](https://npm.developer.oculus.com/-/web/detail/com.meta.xr.mrutilitykit) and unzip it. In Unity, open the *Package Manager*, click the **+** icon, choose **Install package from disk**, and select the `package.json` file, located in the unzipped folder.

1. Make sure your [Unity development environment](https://developers.meta.com/vr/documentation/unity/unity-project-setup) and your [Meta VR device](https://developers.meta.com/vr/documentation/unity/unity-env-device-setup/) are correctly set up.
2. Create a new Unity scene or open an existing one.
3. Remove the **Main Camera**.
4. Add the **OVRCameraRig** prefab or the **Camera Rig Building Block**.
  - Under **OVRManager** → **Quest Features**, set **Scene Support** to **Required**.
  - Under **Permission Requests On Startup**, check the **Scene** permission.
5. If you want to see [Passthrough](https://developers.meta.com/vr/documentation/unity/unity-passthrough), add the [OVRPassthroughLayer](https://developers.meta.com/vr/reference/unity/v76/class_o_v_r_passthrough_layer) component to a GameObject in your scene or add the [Passthrough Building Block](https://developers.meta.com/vr/documentation/unity/unity-passthrough-tutorial-with-blocks).
  - Under **OVRManager** → **Quest Features**, set **Passthrough Support** to **Required**.
  - Under **Insight Passthrough & Guardian Boundary**, check the **Enable Passthrough** permission.
6. Go to **Meta → Tools → Update AndroidManifest.xml**, to ensure your Android Manifest is correctly set up with all necessary permissions.
7. Open the **Project Setup Tool (PST)** and fix all outstanding warnings.
  - You may find this under **Meta** → **Tools** → **Project Setup Tool**.

Building Blocks are a Unity extension designed to help you discover features you can add to your Meta VR app with Meta XR SDKs. They are a great way to get started with MRUK and to quickly add common functionality to your app.

If you’d like to accelerate your development, you can use the Building Blocks for several common interactions and scene setup tasks. Continue to [Manage Scene Data](https://developers.meta.com/vr/documentation/unity/unity-mr-utility-kit-manage-scene-data) to learn more about these tasks in detail.

🏗️ Available Building Blocks for MRUK

- **Effect Mesh:** Generates a stylized mesh from scene geometry like walls and floors. Useful for custom visuals or colliders.
- **Find Spawn Positions:** Helps you identify valid, safe positions in the environment to spawn virtual objects.
- **Scene Mesh:** Provides a mesh representation of the physical room layout, great for physics or visual effects.
- **Anchor Prefab Spawner:** Automatically spawns content based on semantic labels of anchors like couch, table, or wall art.
- **Instant Content Placement:** Enables fast object placement using environment raycasting, ideal for menus or 3D content.
- **Room Guardian:** Adds boundary logic to ensure content placement or interactions stay inside the scanned room area.
- **Scene Debugger:** Visual tool for inspecting anchor positions, labels, and scene relationships directly in the Editor.
- **Room Model** (Deprecated): Simulates scene data in the Unity Editor using fake prefab rooms for testing without a physical device.

Explore more MRUK documentation topics to dive deeper into spatial queries, content placement, manipulation, sharing, and debugging.

- [Overview](https://developers.meta.com/vr/documentation/unity/unity-mr-utility-kit-overview) Get an overview of MRUK’s key areas and features.
- [Place Content without Scene](https://developers.meta.com/vr/documentation/unity/unity-mr-utility-kit-environment-raycast) Use Environment Raycasting to place 3D objects into physical space with minimal setup.
- [Manage Scene Data](https://developers.meta.com/vr/documentation/unity/unity-mr-utility-kit-manage-scene-data) Work with MRUKRoom, EffectMesh, anchors, and semantic labels to reflect room structure.

- [Place Content with Scene](https://developers.meta.com/vr/documentation/unity/unity-mr-utility-kit-content-placement) Combine spatial data with placement logic to add interactive content in the right places.
- [Manipulate Scene Visuals](https://developers.meta.com/vr/documentation/unity/unity-mr-utility-kit-manipulate-scene-visuals) Replace or remove geometry, apply effects, and adapt scenes using semantics and EffectMesh.
- [Track Objects in MRUK](https://developers.meta.com/vr/documentation/unity/unity-mr-utility-kit-trackables) Track keyboards using MRUK-trackables.

- [Share Your Space with Others](https://developers.meta.com/vr/documentation/unity/unity-mr-utility-kit-space-sharing) Use MRUK’s Space Sharing API to sync scene geometry across multiple users.
- [Debug Your MRUK App](https://developers.meta.com/vr/documentation/unity/unity-mr-utility-kit-debug) Use tools like the Scene Debugger and EffectMesh to validate anchor data and scene structure.

- [MRUK Samples](https://developers.meta.com/vr/documentation/unity/unity-mr-utility-kit-samples) Explore sample scenes like NavMesh, Virtual Home, and more.
- [Mixed Reality Motifs](https://developers.meta.com/vr/documentation/unity/unity-mrmotifs-instant-content-placement) Instant Content Placement.

- [Mixed Reality Best Practices](https://developers.meta.com/vr/design/mr-overview) Design MR apps that are comfortable, intuitive, and immersive.

Support and legal

English (US)

© 2026 Meta
# Build Configuration Overview | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-build
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

This page provides an overview of configuring and generating builds for Meta XR Unity projects.

To create a starter project that builds and runs on a Meta VR device, follow the [Unity Hello World for Meta VR devices](https://developers.meta.com/vr/documentation/unity/unity-tutorial-hello-vr/) guide.

To open the **Build Profiles** window in Unity, navigate to **File** > **Build Profiles**.

In the **Build Profiles** window, the **Scene List** pane displays a list of scenes from the project that Unity includes in the build.

To add scenes to the build, click **Open Scene List** to open the **Scene List** window. Select the scenes you want to add, and then click **Add Open Scenes**.

To manage scenes, you can also do the following:

- To exclude a scene from the build, but not from the list of scenes, unselect the scene.
- To adjust the order of the scenes, drag them up or down the list. Numbers on the right indicate the scene index, which is mostly used in scripting APIs.
- To add scenes from a folder (the *Assets* folder, for example), drag the scenes into this window from the folder.

The final build output for Meta VR devices is an `.apk` file (Android executable).

Set the Unity build target to your device:

1. Under**Platforms**, select **Meta Quest** and click **Enable Platform**. If the profile is already installed, click **Switch Platform**.Unity versions prior to 6.1If the Meta Quest platform is absent from your version of Unity, select the**Android** build platform instead.
2. Open the drop-down list to the right of**Run Device**, and select your Meta VR device.The device is listed only if it is connected to your computer over USB. If you do not see the device in the list, ensure you have connected it properly and select**Refresh**.

To build your app, deploy it to your connected headset, and run it on the headset, click **Build and Run** and provide a location to save your build.

To build your app but not run it, click **Build** and provide a location to save your build. This option builds an `.apk` Android executable file. It does not automatically deploy or run your app on the headset.

Unity’s build process is time-consuming, as it compiles the entire project instead of generating deltas from your previous build. To avoid building your app every time you want to test new changes, [we recommend using Link](https://developers.meta.com#stream-app-to-your-headset-with-link) to stream the app directly to your headset as a PC VR app.

To reduce build times when building and deploying your app as a standalone app, do the following:

- In the `OVRManager.cs` settings, select **Skip Unneeded Shaders** to [Strip Unused Shaders](https://developers.meta.com/vr/documentation/unity/unity-strip-shaders/).
- Use **[OVR Build APK](https://developers.meta.com/vr/documentation/unity/unity-build-android-tools/#ovr-build-apk)**.
- If you are building your app exclusively for debugging, use **[OVR Quick Scene Preview](https://developers.meta.com/vr/documentation/unity/unity-build-android-tools/#ovr-quick-scene-preview)**.

Link is a development tool that enables you to stream applications from your development machine directly to your headset, eliminating the need to build a project for your target device and deploy the app to your headset on each test run.

To preview your scene using Link, follow these steps:

1. [Download Link](https://www.oculus.com/download_app/?id=1582076955407037) and install the app on your machine.
2. Put on your headset.
3. Open **Settings** on your headset.
4. Select **Quest Link** and toggle **Quest Link** on.
5. Select**Launch Quest Link** to start Link on your development machine and on your headset.
6. In your Unity project, press **Play**(►) to run the app on your headset.

For more details on Link, see [Use Link for App Development](https://developers.meta.com/vr/documentation/unity/unity-link).

Support and legal

English (US)

© 2026 Meta
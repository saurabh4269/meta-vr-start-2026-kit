# Project Configuration Overview | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-project-configuration/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Feb 18, 2025

This page provides an overview of Unity project configuration settings that help you optimize app performance and quality, and utilize Meta features to ease the app development process.

Before you proceed with any other project settings, set the target platform for the app as each platform has unique settings.

To set the build platform:

1. In Unity, navigate to **File** > **Build Profiles**.
2. Under**Platforms**, select **Meta Quest** and click **Enable Platform**. If the profile is already installed, click **Switch Platform**.Unity versions prior to 6.1If the Meta Quest platform is absent from your version of Unity, select the**Android** build platform instead.

For more information about build profiles, see [Build Configuration Overview](https://developers.meta.com/vr/documentation/unity/unity-build/).

You can configure some general settings to add details that uniquely identify your company and the app in the Unity Editor:

1. In Unity, navigate to **Edit** > **Project Settings** > **Player**.
2. In **Company Name**, type the name of your company. Unity uses this to locate the preferences file.
3. In **Product Name**, type the name of your app or product that you want it to appear on the menu bar when the app is running. Unity also uses this to locate the preferences file.
4. In **Version**, type the version number that identifies the iteration. For subsequent iterations, the number must be greater than the previous version number.

You only need to set this once, as all the platforms share this information.

To configure graphics quality:

1. In Unity, navigate to **Edit** > **Project Settings** > **Quality**.
2. In the**Anti Aliasing** list, select 4x. Unlike non-VR apps, VR apps must set the multisample anti-aliasing (MSAA) level appropriately high to compensate for stereo rendering, which reduces the effective horizontal resolution by 50%. You can also let [OVRManager](https://developers.meta.com/vr/reference/unity/v209/class_o_v_r_manager/) automatically select the appropriate multisample anti-aliasing (MSAA) level based on the headset.**Known Issue**: If you are using Universal Render Pipeline (URP), you need to manually set the MSAA level to 4x. We are aware of the issue that URP does not set the MSAA level automatically. Once the fix is published, we will announce it on our [Release Notes](https://developers.meta.com/vr/downloads/package/meta-xr-core-sdk/) page.
3. Select **Realtime Reflections Probes** to update reflection probes during gameplay.
4. In the **Global Mipmap Limit** list, select **Full Resolution** to display textures at maximum resolution.
5. In the **Anisotropic Textures** list, select **Per Texture**.
6. Select **Billboards Face Camera Position** to force billboards to face the camera while rendering instead the camera plane.

Every Meta VR app must contain an `AndroidManifest.xml` file. This file contains essential metadata, including permissions, package details, hardware and software support, supported Android versions, and other important configurations.

As you update your project settings, metadata is automatically updated in the manifest file. **You do not need to manually update the manifest file to add app details or specific hardware and software support.**

For example, there’s no need to manually add the package name or the minimum supported Android version in the manifest file. When you set the package name and select the minimum Android API level from Project Settings, say API level 19, the generated manifest includes the `<uses-sdk android:minSdkVersion="19" />` element and the `package` attribute and its value.

Meta Quest 3 and Meta Quest 3S use [compatibility mode](https://developers.meta.com/vr/documentation/unity/os-compatibility-mode) for apps that target earlier Meta Quest headsets. To have headset-identification APIs report the physical headset model instead of an older compatibility model, select every current Meta Quest headset that your app supports: Meta Quest 2, Meta Quest Pro, Meta Quest 3, and Meta Quest 3S.

During the Android build, the Meta XR SDK writes these selections to the `com.oculus.supportedDevices` manifest entry. See [Supported Meta Quest devices](https://developers.meta.com/vr/resources/publish-mobile-manifest#supported-meta-quest-devices) for its values and syntax.

Meta VR Glasses are not currently a supported public value for `com.oculus.supportedDevices`. To make a compatible build available on Meta VR Glasses, follow [App compatibility for Meta VR Glasses](https://developers.meta.com/vr/essentials/app-compatibility) and select [**Future devices**](https://developers.meta.com/vr/resources/publish-release-channels-device-targeting#requirements-and-restrictions) in Store targeting, along with each current Meta Quest device that should receive the build. Device targeting controls delivery; it does not guarantee app compatibility.

Similarly, when you enable hand tracking from Unity, the Meta XR SDK automatically adds the feature and sets the permission value based on the setting you’ve opted in Unity.

To generate the Android Manifest file from Unity, navigate to **Window** > **Meta** > **Tools** > **Create store-compatible AndroidManifest.xml**.

Support and legal

English (US)

© 2026 Meta
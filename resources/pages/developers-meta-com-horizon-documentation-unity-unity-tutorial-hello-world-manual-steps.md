# Manual Project Setup Appendix | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-tutorial-hello-world-manual-steps
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Oct 19, 2026

Use this appendix to set up a Unity project for Meta Quest development without Meta VR Developer Hub (MVDH). For the recommended MVDH flow, see [Get Started](https://developers.meta.com/vr/documentation/unity/unity-tutorial-hello-vr/).

1. Open Unity Hub and select **Installs**.
2. Open the menu for the Unity Editor version you will use, then select **Manage** > **Add modules**.
3. Add Android build support for that Editor version.

Choose the XR provider that supports your project’s requirements.

The following provider plugins are available for Meta VR development:

- [Unity OpenXR Plugin](https://docs.unity3d.com/Packages/com.unity.xr.openxr@1.15/manual/index.html) (recommended)
  - Recommended Version: 1.15.1
  - Requires Unity 6 or later, Meta XR SDKs v74 or later.
- [Oculus XR Plugin](https://docs.unity3d.com/Packages/com.unity.xr.oculus@4.4/manual/index.html) (deprecated)
  - Recommended Version: 4.5.1
  - Requires Unity 2022 or later, Meta XR SDKs v73 or earlier.

Oculus XR Plugin is deprecated

The Oculus XR Plugin is deprecated and scheduled for removal. Use the [Unity OpenXR Plugin](https://developers.meta.com/vr/documentation/unity/unity-xr-plugin/#unity-openxr-plugin) instead.

For installation and legacy-provider details, see [XR Plugin Management for Meta Quest](https://developers.meta.com/vr/documentation/unity/unity-xr-plugin/).

Follow the steps below to create a new project in Unity Hub:

1. Select**Projects** in the left navigation bar, then click **New project**.
2. Select Unity Editor version **6.1** or later.
3. Select the **Universal 3D** template. Click **Download template** if required. This creates an empty project built on the Universal Render Pipeline (URP).
4. Enter your project name, a save location, and a Unity organization.
5. Click**Create project**.

1. Select**Edit** > **Project Settings** from the Unity Editor menu.
2. Select **XR Plug-in Management** on the left of the **Project Settings** window.
3. If XR Plug-in Management is not installed, click**Install XR Plugin Management**.
4. Enable the**OpenXR** provider for the **Standalone** build target.If Unity opens the**Project Validation** page under **XR Plug-in Management** after you enable OpenXR, this is expected. It occurs when Unity installs or upgrades the OpenXR package and validation issues exist. Select **XR Plug-in Management** to return, then continue with the next step.
5. Enable the**OpenXR** provider for the **Android** build target.

1. In the Unity Editor menu, select **File** > **Build Profiles**.
2. Under**Platforms**, select **Meta Quest** and click **Enable Platform**. If you already installed the profile, click the **Switch Platform** button.
3. If prompted to install `com.unity.xr.openxr`, click **Install**.

Unity versions prior to 6.1

If the Meta Quest platform is absent from your version of Unity, select the The Meta XR All-in-One SDK supplies the Core, Platform, and Interaction SDK dependencies used in this setup.

1. In the Unity Editor menu, select**Window** > **Package Management** > **Package Manager**.
2. Select**+** in the upper left of the **Package Manager** window. Select **Add Package By Name**. Enter `com.meta.xr.sdk.all`.
3. If prompted to enable the Meta XR feature set, select**Yes**.If the feature set isn’t enabled, select**Edit** > **Project Settings** > **XR Plug-in Management** > **OpenXR**. Enable the **Meta XR** feature group for the **Standalone** and **Android** build targets.
4. If Unity prompts you to restart the Unity Editor, select**Restart Editor**. If no prompt appears, continue to the next step.

1. Select**Window** > **Meta** > **Tools** > **Project Setup Tool**.
2. For the **Standalone** and **Android** build targets, select **Fix All** under **Outstanding Issues**. Review **Recommended Items** one at a time and apply the ones you want, or select **Apply All** when you want every recommendation. Apply the items under **Manually Fixable Items** yourself.
3. Confirm that no required issues remain for either build target.

1. In the**Package Manager** window, select **Updates** and review any available Meta XR package updates.

1. Select**Project Settings** > **XR Plug-in Management** > **OpenXR**, then open the settings for the **Android** build target.
2. Select**Meta XR** in the **OpenXR Feature Groups** section to filter the list.
3. Confirm that**Meta XR Feature** is enabled. **Meta XR Foveation** is enabled by default. Enable **Meta XR Subsampled Layout** only if your app requires it.

The Meta XR All-in-One SDK already includes the Platform SDK. If your app uses Platform SDK features such as user identity, entitlements, in-app purchases, achievements, or group presence, configure an App ID:

1. Create an app on the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/).
2. Open the app’s **API** page and copy the App ID.
3. Follow [Set up a platform app for Unity development](https://developers.meta.com/vr/documentation/unity/ps-setup/) to add the App ID to your Unity project.

For available Platform SDK features, see [Platform Solutions overview](https://developers.meta.com/vr/documentation/unity/ps-platform-intro/).

1. Connect your headset to the development computer.
2. In **Build Profiles**, use the device-selection controls to select the headset for deployment.

The headset is ready for Unity deployment when it is selected as the deployment target.

Use Android Debug Bridge (ADB) for command-line device checks and APK installation. Follow [Android Debug Bridge for Meta Quest](https://developers.meta.com/vr/documentation/unity/ts-adb/) to install and configure ADB for your development computer.

1. Run the following command: adb devices
2. Confirm that the output lists the connected headset with the`device` status.

Install an APK directly:

Run the following command to install an APK on your headset:

adb install \<APK\_PATH>

For example, on Windows:

adb install C:\Dev\Android\MyProject\VrApp.apk

On macOS:

adb install \~/Dev/Android/MyProject/VrApp.apk

Use the `-r` option to overwrite an existing APK of the same name already installed on the target device:

adb install -r \<APK\_PATH>

`adb install` bypasses the normal install route. Cloud Backup will not register apps installed this way and will not perform backups for them.
You now have a manually configured Unity project for Meta Quest.

- Continue with [Interaction Setup](https://developers.meta.com/vr/documentation/unity/unity-hands-tutorial/) to add the Interaction SDK rig, UI panel, and hand interactions.
- For the recommended MVDH flow, see [Software Setup](https://developers.meta.com/vr/documentation/unity/unity-software-setup/) in the Quickstart.
- See [Unity development overview](https://developers.meta.com/vr/documentation/unity/unity-development-overview/) for additional setup topics.

Continue your learning using the following resources:

- [Meta VR CLI overview](https://developers.meta.com/vr/essentials/metavr-overview/): Use Meta VR CLI from a terminal or through an AI coding agent.
- [Getting Started with Interaction SDK](https://developers.meta.com/vr/documentation/unity/unity-isdk-getting-started/): Add the interaction rig, set up a UI, and enable your first interactions.
Your project is already set up; jump straight into building.
- [Develop Unity apps for Meta Quest VR headsets](https://developers.meta.com/vr/documentation/unity/unity-development-overview/): Essential components and topics to build, test, and debug your apps.
- [Introduction to Mixed Reality on Meta Quest](https://developers.meta.com/vr/documentation/unity/mr-experience-and-use-cases/): Immersive modes and use cases.
- [Unity Sample Projects Overview](https://developers.meta.com/vr/documentation/unity/unity-samples-overview/): Sample scenes, motifs, and showcase projects built by Meta engineers to help you create VR experiences in Unity.
- [Meta XR Simulator Overview](https://developers.meta.com/vr/documentation/unity/xrsim-intro/): Standalone OpenXR runtime for Windows and Apple Silicon macOS that lets you preview your scene on your computer.
- [Meta VR Developer Hub](https://developers.meta.com/vr/documentation/unity/ts-mqdh/): Tool used by the recommended setup workflow for Meta Quest development.

Support and legal

English (US)

© 2026 Meta
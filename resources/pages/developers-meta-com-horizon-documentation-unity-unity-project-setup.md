# Project Setup | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-project-setup
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Oct 19, 2026

Create and configure your Unity project for Meta VR hand-tracking development. This workflow uses [Meta Quest Developer Hub (MQDH)](https://developers.meta.com/vr/documentation/unity/ts-mqdh-getting-started/) to create the project. To configure a project without MQDH, follow [Manual Steps for Project Setup](https://developers.meta.com/vr/documentation/unity/unity-tutorial-hello-world-manual-steps/).

01 Open MQDH

02 Start a New Project

03 Choose Settings

1. Open[Meta Quest Developer Hub (MQDH)](https://developers.meta.com/vr/documentation/unity/ts-mqdh-getting-started/) on your computer.
2. In the left sidebar, select**XR Projects**. MQDH shows your XR projects and a **Create project** button in the top-right corner.
3. If MQDH cannot find Unity installed in the default location, follow the instructions in MQDH to download and install it.

For any troubleshooting issues, see[MQDH XR Projects](https://developers.meta.com/vr/documentation/unity/ts-mqdh-xr-projects/)

01 Remove Default Camera

02 Project Setup Tool

03 Enable OpenXR Features

04 Review Packages

1. If the scene contains a**Main Camera**, right-click it in the **Hierarchy** window and select **Delete**.

Interaction SDK uses its own camera rig. [Interaction Setup](https://developers.meta.com/vr/documentation/unity/unity-hands-tutorial/) adds an **OVRCameraRig**, which handles the camera system and head-movement tracking, so the scene does not need the default **Main Camera**.

For any troubleshooting issues, see[Project Setup Tool](https://developers.meta.com/vr/documentation/unity/unity-upst-overview/) · [Meta XR Packages](https://developers.meta.com/vr/documentation/unity/unity-package-manager/)

Confirm the following required settings before you continue:

- The Project Setup Tool shows no remaining required issues in the **Standalone** and **Android** tabs.
- Under **Edit** > **Project Settings** > **XR Plug-in Management** > **OpenXR**, the **Meta XR** feature group is enabled for **Standalone** and **Android**.

After both checks pass, the required project setup is complete. If you set **SDKs** to **All** when you created the project, also confirm the URP setup in [Use the Universal Render Pipeline](https://developers.meta.com#use-the-universal-render-pipeline). The Platform SDK and AI tooling setup is optional, depending on your project’s needs.

Required if you installed all SDKs

The required OpenXR project setup above may not include this step. Complete it if you set **SDKs** to **All** when you created the project, if your project uses the Universal Render Pipeline (URP), or if you want to switch to URP.

To check which render pipeline your project uses, select **Edit** > **Project Settings** > **Graphics** and inspect **Default Render Pipeline**. If the field shows an asset labeled **(Universal Render Pipeline Asset)**, URP is the default render pipeline.

If no asset is assigned to **Default Render Pipeline** and you want to use URP, do the following:

1. Select **Assets** > **Create** > **Rendering** > **URP Asset (with Universal Renderer)** to create a URP asset.
2. In **Edit** > **Project Settings** > **Graphics**, assign the new asset to **Default Render Pipeline**.
3. In **Edit** > **Project Settings** > **Quality**, make sure each quality level you use either has no Render Pipeline Asset assigned, so it uses the default, or has the same URP asset assigned.

After you assign the URP asset, open the Project Setup Tool again and resolve any issues it lists. When the URP package is installed, the tool also checks URP settings.

If your app uses Platform SDK features such as user identity, entitlements, in-app purchases, achievements, or group presence, add the [Meta XR Platform SDK](https://assetstore.unity.com/packages/tools/integration/meta-xr-platform-sdk-262366) from the Asset Store. After installing it, create an app on the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/) and copy the App ID from the API page. See [Set up a platform app for Unity development](https://developers.meta.com/vr/documentation/unity/ps-setup/) and [Platform Solutions overview](https://developers.meta.com/vr/documentation/unity/ps-platform-intro/).

Install the `meta-vr` plugin from the [Meta Quest Agentic Tools repository and marketplace](https://github.com/meta-quest/agentic-tools) by following the installation instructions for your supported AI coding agent. The plugin bundles Meta VR CLI MCP configuration and skills. If you run Meta VR CLI through npm (`npx -y metavr`), Node.js 16 or later is required.

Follow Unity’s [Unity Pipeline package and CLI documentation](https://docs.unity.com/en-us/unity-production-pipeline/local-tools-cli/unity-pipeline-package), then add the `com.unity.pipeline` package to the project:

unity pipeline install

Confirm that the Pipeline server is available:

unity pipeline list

Continue when `Running` and `Server Reachable` are both `true`. See the [Meta VR CLI overview](https://developers.meta.com/vr/essentials/metavr-overview/) to use Meta VR CLI from a terminal or through an AI coding agent.

For more information about configuring Unity projects manually, see [Project Configuration Overview](https://developers.meta.com/vr/documentation/unity/unity-project-configuration/).

To learn more about project setup, see the following resources:

- [Meta VR CLI overview](https://developers.meta.com/vr/essentials/metavr-overview/): Learn how to use Meta VR CLI from a terminal or through an AI coding agent.
- [Meta XR Packages](https://developers.meta.com/vr/documentation/unity/unity-package-manager/)
- [The Project Setup Tool](https://developers.meta.com/vr/documentation/unity/unity-upst-overview/)
- [XR Plugin Management for Meta VR](https://developers.meta.com/vr/documentation/unity/unity-xr-plugin/)
- [Unity XR Plugin Management](https://docs.unity3d.com/Manual/XRPluginArchitecture.html)
- [Project Configuration Overview](https://developers.meta.com/vr/documentation/unity/unity-project-configuration/)
- [Build Configuration Overview](https://developers.meta.com/vr/documentation/unity/unity-build/)
- [Platform Solutions overview](https://developers.meta.com/vr/documentation/unity/ps-platform-intro/)
- [Set up a platform app for Unity development](https://developers.meta.com/vr/documentation/unity/ps-setup/)
- [Unity Manual](https://docs.unity3d.com/Manual/)

Support and legal

English (US)

© 2026 Meta
# Setting up the Meta XR plugin for your project | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unreal/unreal-setting-up-metaxr-plugin/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Apr 14, 2026

The Meta XR plugin is required to customize Unreal Engine for developing Meta Horizon OS applications. You already should have installed the plugin before creating your new project. If you haven’t, see [Installing the Meta XR Plugin](https://developers.meta.com/vr/documentation/unreal/unreal-quick-start-install-metaxr-plugin/).

You only need to install the Meta XR plugin once and this section assumes that you’ve either installed the Meta XR plugin separately, or as part of installing Unreal Engine from the Oculus-VR fork of the Unreal source code (the recommended path). However, you need to set it up and enable it, for each project you create.

Only a few specific plugin settings are discussed here. For information on all available settings, see [Meta XR Plugin Settings](https://developers.meta.com/vr/documentation/unreal/unreal-plugin-settings/).

Setting up the Meta XR plugin takes four steps:

- [Enable the Meta XR plugin](https://developers.meta.com#enable-plugin)
- [Configure the Meta XR plugin](https://developers.meta.com#configure-plugin)
- [Configure the Meta XR Project Setup Tool](https://developers.meta.com#configure-projectsetup)
- [Configure the Meta XR Platform window](https://developers.meta.com#configure-platformwindow)

Even if you’ve installed Unreal Engine from the Oculus-VR fork of the Unreal source code (which automatically installs the appropriate Meta plugin), you still need to enable it for each project.

To enable the Meta XR plugin:

1. In the Unreal Editor, go to**Edit** and select **Plugins**.
2. In the list of**All Plugins**, under **Installed**, select **Virtual Reality**.
3. Select**Meta XR** to enable it. If the **Oculus VR** plugin is displayed, do not enable it when using Unreal 5.x because it is deprecated.**Note:** If you do not see the Meta XR plugin, refer to [Installing the Meta XR Plugin](https://developers.meta.com/vr/documentation/unreal/unreal-quick-start-install-metaxr-plugin/). The Oculus VR plugin is not supported for Meta Horizon OS development.
4. Select**Restart Editor** when prompted.

Configuring the **Meta XR** plugin will enable you to set up many of the default behaviors of your project to suit your specific needs. These include things like setting up the splash screen, the color space, and rendering options.

1. Ensure that your project is loaded in Unreal Engine and the plugin is enabled.
2. In the Unreal Editor, go to**Edit** and select **Project Settings**.
3. Under**Plugins** in the left nav, select **Meta XR**.
4. Configure the plugin as appropriate for the needs of your project.**Note:** You can configure a number of settings. For more information on your options, see [Meta XR Plugin Settings](https://developers.meta.com/vr/documentation/unreal/unreal-plugin-settings/).
5. Select an appropriate OpenXR backend. See[Choosing an OpenXR Backend](https://developers.meta.com/vr/documentation/unreal/unreal-openxr/).
6. Select **Restart Editor** if prompted.

The **Meta XR Project Setup Tool** can help you set up parts of your project to target the specific devices you’re developing for.

To configure the Meta XR Project Setup Tool for your project:

1. Load your project in Unreal Engine and make sure the Meta XR plugin is enabled.
2. In the Unreal Editor, go to**Edit** and select **Project Settings**.
3. Under**Plugins** in the left nav, select **Meta XR**.
4. In the**Plugins - Meta XR** window, under **General Meta XR**, select **Launch Meta XR Project Setup Tool**.
5. Select the tab for the type of device that you’re targeting.
6. If there are any required or recommended rules, click**Apply All**.
7. Restart the editor after applying settings.**Note:** You may need to restart the editor more than once.

The Meta XR Platform window helps you configure project settings for Meta VR applications, including device-specific defaults such as the APK file path.

To configure the Meta XR Platform window for your project:

1. Load your project in Unreal Engine and make sure the Meta XR plugin is enabled.
2. In the Unreal Editor, go to**Edit** and select **Project Settings**.
3. Under**Plugins** in the left nav, select **Meta XR**.
4. In the**Plugins - Meta XR** window, under **General Meta XR**, select **Launch Meta XR Platform Window**.**Note:** If a **Download Oculus Platform Utility** popup appears, click **OK** to download the required utility. This download is needed for the Platform Window to function correctly.
5. Ensure that the**Target Platform** is set to **Quest**.
6. Fill out the rest of the settings as needed for your device.
7. Click**Upload**.
8. Restart the editor after applying settings.**Note:** You may need to restart the editor more than once.

Support and legal

English (US)

© 2026 Meta
# XR Plugin Management for Meta VR | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-xr-plugin/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Oct 7, 2026

If you're new to Unity development for Meta VR devices, check out [Build your first VR project](https://developers.meta.com/vr/documentation/unity/unity-tutorial-hello-vr/) to create your first VR app with hand tracking.

Unity supports XR development on a variety of platforms with the Unity [XR Plugin Management system](https://docs.unity3d.com/Manual/XRPluginArchitecture.html).

The following provider plugins are available for Meta VR development:

- [Unity OpenXR Plugin](https://docs.unity3d.com/Packages/com.unity.xr.openxr@1.15/manual/index.html) (recommended)
  - Recommended Version: 1.15.1
  - Requires Unity 6 or later, Meta XR SDKs v74 or later.
- [Oculus XR Plugin](https://docs.unity3d.com/Packages/com.unity.xr.oculus@4.4/manual/index.html) (deprecated)
  - Recommended Version: 4.5.1
  - Requires Unity 2022 or later, Meta XR SDKs v73 or earlier.

Oculus XR Plugin is deprecated

The Oculus XR Plugin is deprecated and scheduled for removal. Use the [Unity OpenXR Plugin](https://developers.meta.com/vr/documentation/unity/unity-xr-plugin/#unity-openxr-plugin) instead.

The [Unity OpenXR Plugin](https://docs.unity3d.com/Packages/com.unity.xr.openxr@1.14/manual/index.html) aims to unify various OpenXR backends.

Using the Unity OpenXR Plugin comes with the following limitations:

- [Depth API](https://developers.meta.com/vr/documentation/unity/unity-depthapi-overview/) is not supported in Unity versions prior to 6 and Meta XR Core SDK versions prior to v74.
- [Depth API occlusion features](https://developers.meta.com/vr/documentation/unity/unity-depthapi-occlusions/) require using Unity OpenXR: Meta (`com.unity.xr.meta-openxr@2.1.0`) and Unity version 6 or later. For details, see [Unity OpenXR: Meta](https://developers.meta.com#unity-openxr-meta).
- Prior to OpenXR version [1.9](https://docs.unity3d.com/Packages/com.unity.xr.openxr@1.9/manual/index.html), setting the tracking origin **STAGE** requires a recenter before the world origin is updated.

All new projects should install the Unity OpenXR Plugin to get the benefit of the latest features and optimizations.

To install the OpenXR provider plugin:

1. Open any 3D project in the Unity Editor **6000.0.66f2 or later** (**6.1 or later** recommended)
2. From the top menu of the Unity Editor, navigate to **Edit** > **Project Settings** to open the **Project Settings** window.
3. Select **XR Plug-in Management** in the **Project Settings** window.
4. If XR Plug-in Management is not installed, select **Install XR Plugin Management**.
5. In the **Windows, Mac, Linux settings** tab, select **OpenXR**.
6. In the **Android, Meta Quest settings** tab, select **OpenXR**.
7. Close the **Project Settings** window.
8. From the top menu of the Unity Editor, navigate to **Window** > **Package Management** > **Package Manager** to open the Unity Package Manager window.
9. On the left-hand navigation menu, make sure **In Project** is highlighted. Underneath **Search in Project**, expand the **Packages - Unity** dropdown.
10. In the list of packages in the left menu, verify that there is a check mark
beside **OpenXR Plugin**, indicating that the package is installed.

For more information on how to setup the OpenXR Plugin, see the
[Unity OpenXR Plugin Settings documentation](https://developers.meta.com/vr/documentation/unity/unity-openxr-settings/).

By itself, the Unity OpenXR Plugin does not support [Depth API occlusion features](https://developers.meta.com/vr/documentation/unity/unity-depthapi-occlusions/). To integrate occlusion into a project built on the Unity OpenXR Plugin, you must use [Unity OpenXR: Meta (`com.unity.xr.meta-openxr@2.1.0`)](https://docs.unity3d.com/Packages/com.unity.xr.meta-openxr@2.1/manual/index.html).

To install Unity OpenXR: Meta:

1. Open the Package Manager in Unity 6.
2. Select **Unity Registry**
3. Search for**Unity Open XR Meta** Package

Unity uses the Oculus XR Plugin to facilitate XR development on Meta Quest headsets. The Oculus XR Plugin exposes settings for common lifecycle management and runtime settings such as rendering modes, depth buffer sharing, and latency optimization.

Unity’s Oculus XR Plugin provides the base functionality for getting the XR application running on the Meta Quest headset. We recommend also using the [Meta XR Core SDK](https://developers.meta.com/vr/downloads/package/meta-xr-core-sdk/) package if the project requires the latest up-to-date features. Meta XR Core SDK package contains the latest version of OVRPlugin as well as handy C# scripts that expose Meta Quest features that are not yet provided through Unity’s APIs. For example, advanced features such as presence platform, voice, hand tracking, interaction, and many more are surfaced through the Meta XR Core SDK and not through Unity API.

To install the Oculus XR provider plugin:

1. Open any 3D project in the Unity Editor (version **2022** or **2023**).
2. From the top menu of the Unity Editor, navigate to **Edit** > **Project Settings** to open the **Project Settings** window.
3. Select **XR Plug-in Management** in the **Project Settings** window.
4. If XR Plug-in Management is not installed, select **Install XR Plugin Management**.
5. In the **Windows, Mac, Linux settings** tab, select **Oculus**.
6. In the **Android settings** tab, select **Oculus**.
7. Close the Project Settings window.
8. From the top menu of the Unity Editor, navigate to **Window** > **Package Management** > **Package Manager** to open the Unity Package Manager window.
9. At the top left of the window, expand the **Packages - Unity** dropdown.
10. In the list of packages in the left menu, verify that there is a check mark beside the Oculus plugin, indicating that the package is installed.

A few runtime settings may be available on the latest version only.

To upgrade to the latest available plugin version:

1. From the top menu of the Unity Editor, navigate to **Window** > **Package Management** > **Package Manager** to open the Unity Package Manager window.
2. In the top menu of the Package Manager window, expand the **Packages:** drop-down, and select **Packages: Unity Registry**.
3. From the list of packages in the left menu, select either **Oculus XR Plugin** or **Unity OpenXR Plugin**.
4. In the detailed view, select the **Version History** tab for actionable items.

Disabling an XR plugin package from the XR Plug-in Management interface doesn’t automatically uninstall the plugin. You need to remove the plugin from the Package Manager window.

1. On the menu, go to **Window** > **Package Management** > **Package Manager**.
2. In the top menu of the Package Manager window, expand the **Packages:** drop-down, and select **Packages: In Project**.
3. From the list of packages in the left menu, select either **Oculus XR Plugin** or **OpenXR Plugin**.
4. In the detailed view, select **Remove**.

Support and legal

English (US)

© 2026 Meta
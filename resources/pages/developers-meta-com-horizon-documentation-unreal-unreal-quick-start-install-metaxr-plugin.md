# Installing the Meta XR plugin | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unreal/unreal-quick-start-install-metaxr-plugin
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Apr 14, 2026

Developers creating apps for Meta Horizon OS should install the Meta XR plugin for Unreal when they cannot use an Unreal Engine branch built from Meta’s Oculus-VR fork. This plugin adapts Unreal Engine for Meta Horizon OS development.

Recommended

Use Unreal Engine built from Meta’s Oculus-VR fork instead of installing this plugin. The fork includes the Meta XR plugin plus additional XR development features and fixes. For more information, see [Installing Unreal Engine](https://developers.meta.com/vr/documentation/unreal/unreal-quick-start-install-unreal-engine/).

The downloadable Meta XR plugin targets the latest supported version of Unreal Engine. You can download it directly from the [downloads page](https://developers.meta.com/vr/downloads/package/unreal-engine-5-integration/). The Meta XR plugin is not available through Epic Games Marketplace.

For other Unreal Engine versions, install the plugin from the [Oculus-VR fork of the Unreal Engine source code](https://github.com/Oculus-VR/UnrealEngine) on GitHub. The plugin files are included in this repository’s download.

Account requirements

To access the Oculus-VR fork of Unreal Engine, ensure you have a verified Meta Developer Account. Your Epic Games and GitHub accounts must also be linked. For more information, see [Prerequisites for installing Unreal Engine](https://developers.meta.com/vr/documentation/unreal/unreal-quick-start-install-prerequisites/).

1. Open the [Unreal Engine 5 Integration](https://developers.meta.com/vr/downloads/package/unreal-engine-5-integration/) page in the Meta developer documentation.
2. Download the **Unreal Meta XR plugin** using the button on the top right of the page.
3. Extract the .zip file contents to the UE5 plugins folder (`\Engine\Plugins\Marketplace`). Create the `Marketplace` folder if it does not already exist.
 For example: `C:\Program Files\Epic Games\UE_5.4\Engine\Plugins\Marketplace`.
4. Open Unreal Engine, go to **Edit** > **Plugins**, and search for *Meta XR*. Confirm the plugin appears in the list and enable it if it is not already enabled.

For legacy UE 4.27 plugin installation instructions, see [Legacy: Oculus VR Plugin for UE 4.27](https://developers.meta.com/vr/documentation/unreal/unreal-legacy-ue4-xr-plugin/).

Support and legal

English (US)

© 2026 Meta
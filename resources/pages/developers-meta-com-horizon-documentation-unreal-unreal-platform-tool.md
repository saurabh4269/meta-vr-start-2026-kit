# Upload your app to Meta Horizon Store | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unreal/unreal-platform-tool
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Apr 21, 2026

The Meta XR Platform Window is an in-editor tool that uploads your packaged Unreal Engine app directly to Meta Horizon Store. It handles the upload process in the background using `ovr-platform-util`, which downloads automatically on first use.

Before uploading, ensure you have the following:

- **Meta XR Plugin**: Installed and enabled in your Unreal Engine project.
- **Registered app**: An app registered in the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/).
- **App ID and App Token**: Available from the **API** tab of your app in the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/).
- **Packaged APK**: A signed Android APK built from your project.

1. Sign your APK. For details, see the[Signing Android projects](https://dev.epicgames.com/documentation/en-us/unreal-engine/signing-android-projects-for-release-on-the-google-play-store-with-unreal-engine) section of the Unreal Engine documentation.
2. Modify the following settings in the Unreal Engine editor under**Edit** > **Project Settings** > **Platforms** > **Android**:
  - **Android Package Name**: This must match the package name registered in the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/).
  - **Store Version**: Each upload of your APK requires a unique store version number. Increment this number before each upload.
  - **Install Location**: No action required. For distribution builds, the Meta XR Plugin sets this to `auto`, which allows Android to choose between internal storage and SD card.

You can open the Meta XR Platform Window in two ways:

- **Toolbar**: Select the **Meta XR Tools** dropdown in the toolbar, then select **Meta XR Platform Window**.
- **Plugin settings**: Navigate to **Edit** > **Project Settings** > **Plugins** > **Meta XR**, then select the **Launch Meta XR Platform Window** button.

In the Meta XR Platform Window, fill in the following fields:

- **Target Platform**: Select **Quest**.
- **App ID**: Enter the App ID from the **API** tab in the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/).
- **App Token**: Enter the App Token from the same **API** tab.
- **Release Channel**: Select the release channel for this upload.
- **Release Note**: Enter a description of the changes in this build.
- **APK File Path**: Browse to the location of your packaged APK file.
- **Debug Symbols**: Enable this toggle to include debug symbols with the upload.
- **Symbol Directory**: If debug symbols are enabled, specify the directory containing your symbol files.

Select **Upload** to begin the upload process. The tool runs `ovr-platform-util` in the background to transfer your build to Meta Horizon Store. You can select **Cancel** to stop an in-progress upload.

**Note**: The first time you upload, `ovr-platform-util` downloads automatically. This may add time to the initial upload.

For other ways to upload your app, including command-line tools, see [Upload apps for Meta Quest](https://developers.meta.com/vr/resources/publish-upload-overview/).

Support and legal

English (US)

© 2026 Meta
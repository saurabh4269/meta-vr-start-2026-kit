# Uploading your VR apps | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/resources/publish-upload-overview
> Fetched: 2026-11-16 (IST) via headless Chrome — readable copy for offline reference; content © its owner.

Build for Meta VR devices with AI agents. [Install Meta VR CLI](https://developers.meta.com/vr/discover/metavr/)

Distribute and grow

Updated: Mar 26, 2026

Apps that target Meta Quest have a stringent set of packaging requirements and any app you upload must be packaged accordingly. The upload validator rejects apps that do not meet these requirements.

Additionally, your apps are checked for the following items:

- **Proper controller support**. Controllers are different depending on the device type. If your app displays a visible controller, you should change the model displayed depending on what device you are running on. Alternatively, a stylized controller model that is distinct from the Meta Quest Touch controllers is acceptable.
- **A correct application manifest**. The application manifest of your app must conform to our specifications if you want to upload the app to the Meta Horizon Store. For more information, see [Application Manifests for Release Builds](https://developers.meta.com/vr/resources/publish-mobile-manifest/).
- **A correctly signed APK**. Different devices require different signing schemes. For more information, see [Application Signing](https://developers.meta.com/vr/resources/publish-mobile-app-signing/).

Before you can upload your app, you must:

- Have a Meta account and set up a development team. For more information, see [Manage Your Team and Users](https://developers.meta.com/vr/resources/publish-account-management-intro/).
- Create a page for your app in the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/). For more information, see [Creating Your App Page](https://developers.meta.com/vr/resources/publish-create-app/).
- Make sure your app and expansion files meet the size requirements. The APK may be up to 1 GB in size. The expansion file (if one is being used) may be up to 4 GB in size.
- The APK must have an application manifest that is fit for a release build. See [Application Manifests for Release Builds](https://developers.meta.com/vr/resources/publish-mobile-manifest/).
- The APK must be signed with an Android certificate. For more information, see [Application Signing](https://developers.meta.com/vr/resources/publish-mobile-app-signing/).

You can upload your build (and related assets like APKs, OBBs, asset files, debug symbols, and language packs) using the [Developer Dashboard](https://developers.meta.com/vr/manage/). You can also upload using the [Oculus Platform Command Line Utility](https://developers.meta.com/vr/resources/publish-reference-platform-command-line-utility/) or the [Meta VR Developer Hub](https://developers.meta.com/vr/documentation/unity/ts-mqdh/).

You can also upload from the Unity or Unreal editors:

- For Unity, see [Upload Apps from the Unity Editor](https://developers.meta.com/vr/documentation/unity/unity-platform-tool/).
- For Unreal Engine, see [Upload Apps from the Unreal Editor](https://developers.meta.com/vr/documentation/unreal/unreal-platform-tool/).

To upload a build from the [Developer Dashboard](https://developers.meta.com/vr/manage/):

1. Navigate to your app and go to the **Builds** page, or open a **Release Channel** page.
2. Click **Upload** (or **Upload new build** on a release channel page).
3. Select your APK. You can also include OBBs, asset files, debug symbols, and language packs.
4. Set your upload options — release channel, age group, release notes, and draft mode.
5. Review the pre-upload validation results and fix any errors.
6. Click **Upload**. The upload continues in the background. You can minimize the dialog and continue working.

The Oculus Platform Command Line Utility uses delta-patching techniques to upload only the portions of your app that have changed, so generally this is faster. Additionally, the command line utility can handle larger app packages. If there are any packaging problems with your app, the upload validation routines inform you after uploading your build so that you can correct the issue and try again.

For more information on using this utility, see the [Oculus Platform Command Line Utility](https://developers.meta.com/vr/resources/publish-reference-platform-command-line-utility/).

The Meta VR Developer Hub provides a graphical wrapper around the command line interface. Use the following steps to upload your app to the Developer Dashboard through the Meta VR Developer Hub.

If you previously submitted a build with expansion files, you must use the Oculus Platform Command Line Utility to upload the new binary along with the expansion files, and cannot upload the new build using the developer dashboard.

1. Verify that your build meets the release packaging requirements for your platform. 2D and immersive applications have different required VRCs. Make sure to understand what is required for your app type. For more information, see the [Virtual Reality Check (VRC) Guidelines](https://developers.meta.com/vr/resources/publish-quest-req/).
2. Open **Meta VR Developer Hub**, ensure it is logged in with the account associated with the app you want to upload to.
3. Click on **App Distribution** on the left-side navigation bar, select the correct **Org** and **App**.
4. Click **Upload** action button on the **Release Channels** you are targeting.
5. Follow instructions to select and upload your build files, make sure to write proper **Release Notes**.
6. Click **Upload**.

If you are using the Unity integration or the Unreal Engine integration, you can upload your build through their editors. Your app packages should be less than 1 GB in size.

- For Unity, see[Upload Apps from the Unity Editor](https://developers.meta.com/vr/documentation/unity/unity-platform-tool/).
- For Unreal, see[Upload Apps from the Unreal Editor](https://developers.meta.com/vr/documentation/unreal/unreal-platform-tool/).

If users experience a problem with a build, you can use the **Select Build** functionality to change to a previous app build, or upload a new build.

Did you find this page helpful?

Want to share more detailed feedback? Let us know.

Support and legal

English (US)

© 2026 Meta
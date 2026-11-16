# Building and Packaging Apps | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unreal/unreal-ide-guide-android
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Apr 14, 2026

This guide covers building and packaging Unreal applications that target Meta Quest devices.

Once your environment is set up with the appropriate tools and your project settings are configured properly, you can build VR projects targeting Android, and then load and run the APKs on your Meta Quest device.

- Follow the [Set up your development environment](https://developers.meta.com/vr/documentation/unreal/unreal-quick-start-setup-dev-environ/) guide to configure your development environment and prepare your device for development.

1. Connect your Meta Quest device to your PC via USB.
2. Open a shell terminal and verify you can communicate with your device by using `adb devices`.
    Depending on the device you are using, you may need to configure your connection for software installation. For more information, see \[ADB\](https://developers.meta.com/documentation/native/android/mobile-adb-mirroring/) in the Mobile SDK Developer Guide.
3. From the **Platforms** menu, select **Android** > **Package Project**. Under **Flavor Selection**, **Android (ASTC)** compression is recommended.
4. Browse to the destination folder where you would like your APK to be installed.
5. Once the build process is completed, navigate to the destination folder. Run the .bat file beginning with Install\_ (Windows) or the corresponding .sh file (macOS/Linux) to install the application.
6. Click the application to launch.

You may also directly build and launch an application to your Meta Quest headset without saving the APK locally.

1. Connect your device to your PC by USB.
2. From the **Platforms** menu, select **Project Launcher**.
3. Select your project, and then select your headset in the window below it.
    If you do not see your device listed, verify your USB connection, and check if you need to set your connection to \*\*Connected as an Installer\*\*.
4. Click the **Launch this profile** icon on the right side of your device profile.

Your application will build and install to your Meta Quest device.

You can preview your Meta Quest application on a PC using the following methods:

- **2D Mobile Preview**: Use the Mobile Preview mode in the Unreal editor for quick iteration without deploying to a headset.
- **Meta Quest Link**: Connect your Meta Quest headset to your PC via Meta Quest Link to preview the application in VR on the desktop.
- **On-device**: Build an APK and deploy directly to the headset, or use **Launch on Device** from the Unreal editor.

Although you can preview mobile applications during development using Meta Quest Link, this can misrepresent the true app experience because PC-VR applications are subject to substantially different performance requirements than Meta Quest applications. For more information, see **Performance Targets** in [Meta Quest: Testing and Performance Analysis](https://developers.meta.com/vr/documentation/unreal/unreal-debug-android/). You may find it easiest to use the 2D Mobile Preview in Unreal, and then build an APK or use **Launch on Device** when you need to view the app in VR.

Meta Quest provides Blueprints for common Quest operations such as querying battery level and headphone connection status.

For more information, see [Blueprints Reference](https://developers.meta.com/vr/documentation/unreal/unreal-blueprints/).

Meta Quest provides advanced mobile rendering features such as multi-view rendering. These features can significantly improve performance. For more information, see [Rendering](https://developers.meta.com/vr/documentation/unreal/unreal-advanced-rendering/).

Support and legal

English (US)

© 2026 Meta
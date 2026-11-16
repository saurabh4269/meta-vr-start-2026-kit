# Meta VR Plugin for Android Studio | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/android-apps/meta-horizon-android-studio-plugin
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Nov 9, 2026

The Meta VR Plugin for Android Studio is the recommended workflow for developers building Meta VR apps in Android Studio. It adds a new project template for Meta VR devices, lets you manage those devices from Android Studio, lets you test your project in Meta Spatial Simulator, and bundles Meta VR CLI for use with AI coding tools.

You can use [Meta VR CLI and AI tools](https://developers.meta.com/vr/documentation/android-apps/ts-ai-tooling-mcp) through the plugin or as a standalone workflow. If your primary workflow is [React Native with Expo](https://developers.meta.com/vr/documentation/android-apps/expo-for-react-native), you don’t need to use the Android Studio plugin.

The plugin runs in [Android Studio](https://developer.android.com/studio), Google’s free IDE. It is distributed through JetBrains, but you do not need an IntelliJ account or any paid JetBrains product.

The plugin supports these Android Studio releases:

| Plugin version | First supported Android Studio release | Latest supported Android Studio release | 
|---|---|---|
| `253.2.0.1.77` | Panda 1 (`2025.3.1`) | Panda 4 (`2025.3.4 Patch 1`) | 
| `261.2.0.1.77` | Quail 1 (`2026.1.1`) | Quail 4 (`2026.1.4 Patch 1`) | 
| `262.2.0.1.77` | Rabbit 1 (`2026.2.1`) | Rabbit 2 (`2026.2.2 Patch 1`) | 

Older plugin builds remain available for earlier Android Studio releases, including Otter (`2025.2`), but they are out of date and will not receive further updates.

When you open the [plugin’s JetBrains Marketplace page](https://plugins.jetbrains.com/plugin/26861-meta-vr) with Android Studio installed, the page detects your version and offers a compatible build. If no compatible build is offered, install a supported version from the [Android Studio archive](https://developer.android.com/studio/archive), then try again.

1. Open Android Studio.
2. Go to the [Meta VR Marketplace page](https://plugins.jetbrains.com/plugin/26861-meta-vr).
3. Click **Install to Android Studio YOUR\_VERSION**.
4. In Android Studio, click **OK** on the installation prompt.
5. Restart Android Studio if prompted.

1. Open Android Studio settings and go to **Plugins**. On Windows and Linux, go to **File** > **Settings** > **Plugins**. On macOS, go to **Android Studio** > **Settings** > **Plugins**.
2. Click **Marketplace**.
3. Search for `Meta`, then select the Meta VR Plugin for Android Studio and install it.
4. Restart Android Studio if prompted.

The first time you open a project after installation, a welcome dialog appears and a **Meta VR** tool window is added to the sidebar.

In the Meta VR Plugin for Android Studio, open the **Meta VR** tool window. On the **Meta VR CLI** card, click **Open in terminal**, then run `metavr init`.

For full AI-tool setup, see [Install Meta VR CLI for Android apps](https://developers.meta.com/vr/documentation/android-apps/ts-ai-tooling-mcp).

The plugin adds a **Meta VR** project type to the Android Studio New Project wizard. The generated project is a normal Android project with panel sizing already configured, so you can start building right away.

1. Go to **File** > **New** > **New Project**.
2. Select the **Meta VR** template, then click **Next**.
3. Fill in the project fields, then click **Finish**.

The plugin can generate separate Meta VR device and mobile product flavors for an existing Android project. Open the **Meta VR** tool window, click **Create Product Flavors...**, and follow the on-screen instructions. After the plugin configures the project, review the generated Gradle and source changes. See [Use product flavors for separate APKs](https://developers.meta.com/vr/documentation/android-apps/port-an-existing-app#product-flavors-option).

The plugin flags code that will not work on Horizon OS while you edit. Libraries that are not compatible with Horizon OS, including Google Mobile Services and Google Play Billing, are underlined in your import list. Permissions that are not available on Horizon OS are underlined in `AndroidManifest.xml`. Both issue types also appear in the Problems window. When guidance is available, use the quick fix or **Learn More** link for details. See [Unsupported dependencies](https://developers.meta.com/vr/documentation/android-apps/port-an-existing-app#unsupported-dependencies) and [Unsupported permissions](https://developers.meta.com/vr/documentation/android-apps/port-an-existing-app#unsupported-permissions).

Add the supported-device metadata to each applicable manifest so the plugin recognizes the project and runs these inspections.

The canonical `com.oculus.supportedDevices` identifiers are:

| Device | `supportedDevices` identifier | 
|---|---|
| Meta Quest 2 | `quest2` | 
| Meta Quest Pro | `questpro` | 
| Meta Quest 3 | `quest3` | 
| Meta Quest 3S | `quest3s` | 
| Meta VR Glasses | `vrglasses` | 

Separate multiple identifiers with a pipe (`|`).

To declare support for all current Meta VR devices, add this element to the `application` node in `AndroidManifest.xml`:

```
<meta-data
    android:name="com.oculus.supportedDevices"
    android:value="quest2|questpro|quest3|quest3s|vrglasses" />
```
Open the **Meta VR** tool window and sign in with your [Meta Horizon account](https://www.meta.com/help/quest/1336626146870772/). Under **Virtual Devices**, download and start Meta Spatial Simulator. The plugin installs and manages the simulator, so you don’t need a separate installer. See [Test your app on Meta Spatial Simulator](https://developers.meta.com/vr/documentation/android-apps/spatial-sim-overview) for more details.

To test on hardware, enable developer mode and run from the toolbar. See [Test your app on your device](https://developers.meta.com/vr/documentation/android-apps/enable-developer-mode).

The **Physical Devices** section shows a connected Meta VR device and its battery information. Use it to capture screenshots or recordings, control the proximity sensor, restart the device, or shut it down.

The tool window links to Meta developer resources and support. See [Meta Horizon Developer Support](https://metahorizondevelopers.atmeta.com/s/).

If a newly created project cannot sync because Gradle is using an incompatible JDK, [set the JDK for the Horizon OS template](https://developers.meta.com/vr/documentation/android-apps/create-app#troubleshoot-the-gradle-jdk).

To disable the plugin without removing it, go to **Settings** > **Plugins** > **Installed**, find the Meta VR Plugin for Android Studio, and click **Disable**. Enable it again from the same place.

Support and legal

English (US)

© 2026 Meta
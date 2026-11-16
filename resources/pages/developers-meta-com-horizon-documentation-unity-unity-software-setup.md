# Software Setup | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-software-setup
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Oct 1, 2026

Create your Meta developer accounts, install Unity and Meta developer tools, and configure a Meta VR device for development.

This Quickstart uses [Meta VR Developer Hub (MVDH)](https://developers.meta.com/vr/documentation/unity/ts-mqdh-getting-started/) to configure Unity projects, manage device connections, deploy APKs, access performance tools, and upload builds to the Meta Horizon Store.

Create the accounts you will need to access developer tools, download SDKs, and publish apps.

1. Create a Meta developer account through [Meta developer sign-up](https://developers.meta.com/vr/sign-up/).
2. Complete [account verification](https://developers.meta.com/vr/manage/verify/).
3. Create a Unity ID at [id.unity.com](https://id.unity.com/).

Account setup is complete when your Meta developer account is verified and you have created a Unity ID.

Install the required software to build and deploy apps for Meta VR devices.

1. Install the [Meta Horizon mobile app](https://www.meta.com/help/quest/articles/getting-started/getting-started-with-quest-2/install-meta-horizon-mobile-app/) on your phone.
2. Download and install [Unity Hub](https://unity.com/download).
3. Install **Unity Editor** (6000.0.66f2 or higher) with these modules:
  - **Android Build Support**
  - **OpenJDK**
  - **Android SDK and NDK Tools**
4. Download and install MVDH for your operating system from [MVDH Getting Started](https://developers.meta.com/vr/documentation/unity/ts-mqdh-getting-started/), then log in with the same Meta developer credentials used to set up your device.

Software setup is complete when the required Unity modules are installed and you can sign in to MVDH with your Meta developer account.

You can skip this step if you are only using Meta XR Simulator. Otherwise, enable Developer Mode on your Meta VR device so you can deploy and debug apps.

Before enabling developer mode, ensure the following prerequisites are met:

- You are a registered Meta developer with a verified Meta account. To check your account status, see [Verification](https://developers.meta.com/vr/manage/verify/) in the Developer Dashboard.
- You are at least 18 years old.
- Your device does not have any device-level restrictions that prevent enabling developer mode.

Follow these steps to enable developer mode:

1. On your mobile device, open the Meta Horizon app.
2. In the app, tap the headset icon in the toolbar.
3. Your paired headset should appear at the top of the screen. Tap the headset item, which displays the model and status of your paired headset.
4. Tap**Headset Settings** beneath the image of your headset.
5. Tap**Developer Mode**.
6. Toggle**Developer Mode** to the on position.
7. Use a USB-C data cable to connect the device to your computer.**Note**: To set up without a computer, check the setup documentation for your specific device on [Meta Quest Help Center](https://www.meta.com/help/quest/).
8. Put on your device.
9. On your device, open the**Quick Control** menu item.
10. Select**Open Settings**, displayed as a gear icon. Then, open the **Developer** tab and toggle **MTP Notification** on.
11. When asked to allow USB debugging, select**Always allow from this computer**.

Developer Mode is intended for development tasks such as running, debugging and testing applications. Engaging in other activities may result in account limitations, suspension, or termination. For more information, see [Content Guidelines.](https://developers.meta.com/vr/policy/content-guidelines/)

After completing the procedure, open **MVDH** > **Device Manager** and verify that your device has a green **Active** status.

Android Debug Bridge (ADB) is included with Unity’s Android SDK tools in `/Android/SDK/platform-tools/`.

1. On Windows, download the [OEM USB driver](https://developers.meta.com/vr/downloads/package/oculus-adb-drivers/), extract the `oculus-adb-driver-2.0` ZIP, open `/usb_driver/`, right-click `android_winusb.inf`, and select **Install**. On macOS, skip the driver installation.
2. Add the `platform-tools` directory to your system path:
  - **Windows**: `C:\Program Files\Unity\Hub\Editor\{version}\Editor\Data\PlaybackEngines\AndroidPlayer\SDK\platform-tools`
  - **macOS**: `/Applications/Unity/Hub/Editor/{version}/PlaybackEngines/AndroidPlayer/SDK/platform-tools`
3. Run the following command to list connected devices: adb devices
4. Confirm that the output lists your device with the`device` status. For example: List of devices attached 1PASH9BB939351 device
5. If no device appears, check the USB connection, confirm that USB debugging is allowed on the device, and verify that the device has a green **Active** status in **MVDH** > **Device Manager**.

For Wi-Fi setup, additional commands, and troubleshooting, see the [Android Debug Bridge guide](https://developers.meta.com/vr/documentation/unity/ts-adb/).

For manual project setup, including Meta XR SDKs and the optional Platform SDK, see [Manual project setup](https://developers.meta.com/vr/documentation/unity/unity-tutorial-hello-world-manual-steps/).

Support and legal

English (US)

© 2026 Meta
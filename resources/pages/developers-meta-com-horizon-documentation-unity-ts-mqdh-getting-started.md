# Get Started with Meta VR Developer Hub | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/ts-mqdh-getting-started/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Nov 5, 2026

Meta VR Developer Hub (MVDH) is a companion application for Windows and macOS that helps you manage Meta VR devices, debug apps, capture media, and submit builds to the Meta Horizon Store. Use MVDH to streamline your development workflow by deploying apps directly to your headset, viewing device logs, casting your headset display, and more.

This guide walks you through installing MVDH and connecting your headset.

Before setting up Meta VR Developer Hub (MVDH), make sure that you have reviewed the following documents:

To complete this guide, you must have the following:

- Meta Horizon developer account: [Register a Meta account](https://developers.meta.com/vr/sign-up/)

- Supported Meta Quest headsets:
  - Quest 2
  - Quest Pro
  - Quest 3
  - Quest 3S and 3S Xbox Edition

- USB-C data cable
- Android or iOS mobile device

1. Download and install the MVDH app from the download page for your operating system:
2. Open the application and log in using your Meta developer credentials. Use the same Meta developer credentials you used to log in on the headset.

To use MVDH features, you need to first connect your Meta VR device to your development machine:

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
6. Toggle**Developer Mode** to the on position.The following video shows enabling developer mode on the Meta Horizon app. **Video**: Toggle developer mode on in the Meta Horizon app.
7. Use a USB-C data cable to connect the device to your computer.**Note**: To set up without a computer, check the setup documentation for your specific device on [Meta Quest Help Center](https://www.meta.com/help/quest/).
8. Put on your device.
9. On your device, open the**Quick Control** menu item.
10. Select**Open Settings**, displayed as a gear icon. Then, open the **Developer** tab and toggle **MTP Notification** on.
11. When asked to allow USB debugging, select**Always allow from this computer**.

To verify the connection:

1. Open MVDH.
2. In the left navigation pane, choose **Device Manager**. All the devices you have set up are displayed in the main pane. Each device is shown with its status, which includes the device ID and connection status. The active device shows a green **Active** designator.
3. If multiple headsets are connected to your computer, select the currently connected headset from the drop-down list in the upper-right corner.

If MVDH doesn’t detect your headset or the connection fails, see [Troubleshooting MVDH](https://developers.meta.com/vr/documentation/unity/ts-mqdh-troubleshooting/).

MVDH maintains a regular update cadence to ship new features and important bug fixes. It supports auto-update and prompts you to install the new release when it becomes available. To check your version of MVDH, navigate to **Settings** > **About**.

Support and legal

English (US)

© 2026 Meta
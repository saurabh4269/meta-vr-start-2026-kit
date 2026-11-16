# Device Setup | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/native/android/mobile-device-setup/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Aug 6, 2026

This topic shows how to set up a Meta Android device for running, debugging, and testing applications. The currently supported Meta devices that run Android include:

- Meta Quest
- Meta Quest 2
- Meta Quest Pro
- Meta Quest 3
- Meta Quest 3S

For Rift devices, see the [Rift Native SDK](https://developers.meta.com/vr/documentation/native/pc/pcsdk-intro) documentation.

By default, a Meta Quest device only runs apps installed from the Meta Horizon Store. Setting up your device for development unlocks the ability to install your own builds directly from your development machine so that you can run, debug, and test them on real hardware before publishing. This local development loop is essential for iterating on an app, and each step below enables a specific part of it:

- **Join or create a developer team** to associate your Meta account with a verified developer organization. Team membership is a prerequisite for enabling developer mode.
- **Verify your account** to confirm your identity. This is a one-time security step that unlocks developer mode and helps protect the platform from abuse.
- **Enable developer mode** to authorize your device to install and debug apps from outside the Meta Horizon Store.
- **Install the Oculus ADB Drivers (Windows only)** so that Android Debug Bridge (ADB) can communicate with your device to push builds.

To begin development locally, you must enable developer mode for the Meta device in the Meta Horizon app. Before you can put your device in developer mode, you must belong to (or have created) a developer team on the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/). If developing on Windows, you will also need to install drivers to use Android Debug Bridge (ADB).

A developer team links your Meta account to a verified developer organization on the Meta Horizon Developer Dashboard. You must belong to a team before you can verify your account and enable developer mode.

To join an existing team, follow these steps:

1. Contact the team admin and request that your developer account be added.
2. You’ll receive an email invitation to join the team. Once accepted, you’ll be a team member.

To create a new team, follow these steps:

1. Go to the [Create New Team](https://developers.meta.com/vr/manage/organizations/create/) page of the Meta Horizon Developer Dashboard.
2. Fill in the appropriate information.

Account verification confirms your identity and is required before you can enable developer mode. It is a one-time step that helps keep the platform secure.

1. Go to the [verification tab](https://developers.meta.com/vr/manage/verify/) of the Meta Horizon Developer Dashboard.
2. If prompted, log in with your Meta account.
3. Verify your account with one of the two following options:
    
  - Confirm your mobile number to set up SMS two-factor verification. Visit the [Facebook Help Center](https://www.facebook.com/help/130694300342171) to ensure that your country and phone carrier are supported for SMS.
  - Add a payment method to your account (Paypal excluded).

Developer mode authorizes your device to install and debug apps that come from outside the Meta Horizon Store, which is what lets you load and test your own builds during development.

Once you belong to a developer team, follow these steps to put your device in developer mode:

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

Developer Mode is intended for development tasks such as running, debugging and testing applications. Engaging in other activities may result in account limitations, suspension, or termination. For more information, see [Content Guidelines.](https://developers.meta.com/vr/policy/content-guidelines/)

If you are going to be pushing builds from a Windows machine, you’ll need the Oculus ADB Drivers.

1. Go to the [Oculus ADB Drivers](https://developers.meta.com/vr/downloads/package/oculus-adb-drivers/) page and click **Download**.
2. Unzip the downloaded file.
3. Right-click on the `.inf` file and select **Install**.

Once complete, you’ll be able to use Android Debug Bridge (ADB) to push builds to your device.

Support and legal

English (US)

© 2026 Meta
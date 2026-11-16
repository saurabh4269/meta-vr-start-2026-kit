# Use Link for App Development | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-link
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Apr 21, 2026

Link helps you decrease your iteration time by launching the app you develop in Unity or Unreal directly from the Editor to your device when you select **Play**(►). This eliminates the need to build the app on PC and deploy it to a Meta VR device every time you test your app during development.

This topic:

- Outlines the Meta Horizon Link developer app.
- References resources for Link setup and basic usage.
- Discusses useful settings and troubleshooting practices while testing your apps over Link.

Link is compatible with Meta Quest 3S, Meta Quest 3, Meta Quest 2, Meta Quest Pro, and Meta VR Glasses.

- Apps released on the Meta Horizon Store don’t have access to development/experimental features, even if the features are enabled in Link settings.**Important**: To make sure all features work as intended prior to releasing to the Store, you must check your app on device first.
- The visual appearance and performance characteristics of an app running over Link may differ from running it on a Meta Quest headset.
- Link causes your device to behave like a PC VR headset until the tool is explicitly turned off.

To preview your scene using Link, follow these steps:

1. [Download Link](https://www.oculus.com/download_app/?id=1582076955407037) and install the app on your machine.
2. Put on your headset.
3. Open **Settings** on your headset.
4. Select **Quest Link** and toggle **Quest Link** on.
5. Select**Launch Quest Link** to start Link on your development machine and on your headset.
6. In your Unity project, press **Play**(►) to run the app on your headset.

1. In the Meta Horizon Link app, navigate to **Settings** > **General**.
2. Next to **OpenXR Runtime**, select **Set Meta Horizon Link as active**. Once active, the option is grayed out.

1. In the Meta Horizon Link app, navigate to **Settings** > **Developer**.
2. Ensure **Developer Runtime Features** option is toggled on.

Suppose that you want to test an app that uses passthrough, Passthrough Camera API, eye tracking, and natural face expressions.

1. In the Meta Horizon Link app, navigate to **Settings** > **Developer**.
2. Ensure the following options are toggled on:
    
  - **Passthrough over Meta Horizon Link**
  - **Passthrough Camera API permissions** (available in v2.1 and later)
  - **Eye tracking over Meta Horizon Link**
  - **Natural Facial Expressions over Meta Horizon Link**
**Note**: The options for these features appear only after you toggle on **Developer Runtime Features**.
3. After you toggle each of the features on, read the dialog box. Select**Turn On** if you consent.
4. If your Unity or Unreal project is already open, restart the Editor after enabling the features over Link.

Connect your headset using a USB-C cable, and perform the following in the Meta Horizon Link app:

1. Select **Devices** and ensure your headset is showing up.
2. Select the connected device and select **Device Setup** in the right menu.
3. Select **Link Cable** and then select **Continue**.
4. On the **Connect Your Headset** page, select **Continue**.
5. On the **Check Your Cable Connection** page, select **Test Connection**.
6. Ensure you get a**Compatible connection** message, after the test is complete.For color passthrough, the USB connection should provide an effective bandwidth of at least 2 Gbps.If this test returns an**Incompatible connection** message, or if the bandwidth is low, you might need to try a different USB-C cable. Use the [Meta Horizon Link Cable](https://www.meta.com/quest/accessories/link-cable/) to ensure compatibility.

You can always measure the connection speed by using the USB speed tester built into the Meta Horizon Link app:

1. In the Meta Horizon Link app, go to **Devices**.
2. Select the connected device.
3. Select **USB Test** and then **Test Connection**.

To ensure your headset connects to Link properly, follow these steps on your headset:

1. Go to **Settings** > **System**.
2. Next to **Quest Link**, toggle on access.

As a developer, you can use Link in two modes:

- Directly run the scene in the Unity Editor by hitting**Play**(►)
- Run your project as a standalone PC app

Regardless of the mode, the app collects full tracking data from your headset.

Running your app on a PC over Link for most cases is similar to running on the headset. While running the app on a PC over Link for **Play**-in-Editor and standalone modes, you (as a user) see a 3D screen of the app inside your viewport of the headset. You also see the normal screen of the app on the PC screen.

Disabling the proximity sensor via Meta VR Developer Hub (MVDH) is part of the standard development workflow.

1. Connect your headset to your development machine.
2. Open MVDH on your machine.
3. From the left navigation bar in MVDH, select**Device Manager**.
4. Select your headset from the**Devices** list.
5. Under**Device Actions**, locate **Proximity Sensor**.
6. Toggle the setting on to disable the proximity sensor. Once disconnected from MVDH, the proximity sensor remains disabled for 10 minutes, or as otherwise specified in the setting description.

If you need to collect Link logs, you can do so through the Unity Editor and the Oculus App.

1. In the Unity Editor, navigate to **Window** > **General** > **Console**.
2. Select **Play** while your headset is in PC Link.
3. Click the three dots in the top right of the console and select **Open Editor Log**.
4. Locate `OculusLogGather.exe` on your hard drive. The location of this file depends on where you installed the Oculus App. Generally, it should be in your `C:\Program Files\Meta Horizon\Support\oculus-diagnostics` folder.
5. Run `OculusLogGather.exe`.

For additional Link troubleshooting, read [Solve performance issues from graphics preferences](https://www.meta.com/help/quest/articles/fix-a-problem/troubleshooting-oculus-link/troubleshooting-tips-oculus-link/).

Support and legal

English (US)

© 2026 Meta
# Simulate User Input from Meta Quest Touch Controllers | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/xrsim-data-forwarding/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 11, 2026

You can forward input data from physical Meta Quest Touch controllers through your headset to the Meta XR Simulator.

1. Connect your Meta Quest headset to your computer with a USB cable and allow USB debugging on the headset.
2. In Meta XR Simulator, open **Inputs** and expand **Quest controllers**.
3. Under **Device**, select the connected headset.
4. Select **Install server**. The simulator installs the data forwarding server
on the headset and attempts to launch it.

1. If **Launch server** appears after installation, select it.
2. Look in the headset and confirm that **Meta XR Simulator - Data Forwarding
Server** is running in the foreground.
3. Select **Connect Quest Controllers**.
4. During the three-second calibration, hold the controllers in the headset’s field of view. Move them afterward and confirm that the simulated controllers respond.

Press A, B, X, and Y simultaneously to use the current physical controller
poses as the reference poses for the simulated controllers. The simulator
ignores a repeat press within one second of the last one.

Select **Disconnect Controllers**. Confirm that control of the simulated
controllers returns to the keyboard and mouse.

- If installation fails, keep the headset awake, clear any USB debugging or app
permission prompts, then select **Retry install**.
- If launch fails, bring the server app to the foreground and clear any system
dialog that blocks it. Wake the Quest controllers if the headset displays a
controllers-required dialog, then select **Launch server**.
- If connection fails while the server is running, select **Connect Quest
Controllers** again.

For other input options, see [Meta XR Simulator input simulation](https://developers.meta.com/vr/documentation/unity/xrsim-input-keyboard/).

Support and legal

English (US)

© 2026 Meta
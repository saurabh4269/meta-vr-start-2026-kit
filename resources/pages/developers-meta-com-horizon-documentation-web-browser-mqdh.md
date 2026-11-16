# Use MVDH with browser | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/web/browser-mqdh
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

# Use MVDH with browser

Meta VR Developer Hub (MVDH) is a standalone companion development tool for Meta VR devices. For information on how to set up and general usage, [visit the Meta VR Developer Hub page here](https://developers.meta.com/vr/documentation/native/android/ts-mqdh/).

MVDH is a useful tool for a variety of applications, and has a set of tools that are useful for 2D and WebXR browser development:

Enabling ADB over Wi-Fi using MVDH is the preferred method for connecting your device to your desktop for debugging Browser applications.

## Cast your device to desktop

You can use MVDH to cast the Browser window onto your desktop to debug your browser content without having to repeatedly put on and take off your device.

For WebXR experiences, this is an alternative to using the WebXR emulator -- the emulator will display your experience in your desktop web browser, while casting from device runs it directly on Browser.

## Take screenshots and videos

MVDH also allows you to take [screenshots and videos](https://developers.meta.com/vr/documentation/native/android/ts-mqdh-media/) of your experience from the desktop, which can be useful if you’re casting from your device.

## Send a URL to browser from desktop

You can use MVDH to open a URL from your desktop web browser directly on your device in Browser. This avoids typing URLs manually on the device.

1. Follow the instructions to [connect your device over USB or Wi-Fi to MVDH](https://developers.meta.com/vr/documentation/native/android/ts-mqdh-getting-started/).
2. In MVDH, navigate to **Device Manager**.
3. In the **Device Actions** card, find the **Browser** action.
4. Type or paste a URL and select **Open** to send a command that opens the webpage on your device.
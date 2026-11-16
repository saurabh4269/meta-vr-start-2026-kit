# Test your app on Meta Spatial Simulator | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/android-apps/spatial-sim-overview/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Nov 9, 2026

Meta Spatial Simulator runs your 2D Android app as a panel on your desktop. You test and iterate there instead of loading the app onto a physical device every time. It is for 2D Android apps only. Other ways to build for Horizon OS, such as [Spatial SDK](https://developers.meta.com/vr/develop/spatial-sdk/), [OpenXR](https://developers.meta.com/vr/develop/native/), [Unity](https://developers.meta.com/vr/documentation/unity/unity-development-overview/), and [Unreal](https://developers.meta.com/vr/documentation/unreal/), use their own simulation tools or a physical device.

| **Requirement** | **Minimum** | 
|---|---|
| macOS | Apple silicon (M1 or later), macOS 12 or later, with Xcode Command Line Tools (`xcode-select --install`) | 
| Windows | Windows 10 or later, 64-bit, 8 or more cores, hardware virtualization enabled in BIOS | 
| GPU | Vulkan-capable, with current drivers | 
| Disk space | 8 GB free | 
| Memory | 4 GB free | 
| Android SDK | The `platform-tools` package for `adb`, and the `emulator` package | 
| Android Studio | Panda 2025.3 or later, for the Android Studio workflow | 

There is no standalone installer. Install the simulator from Android Studio or from the command line, whichever fits your workflow.

1. Install the [Meta VR Plugin for Android Studio](https://developers.meta.com/vr/documentation/android-apps/meta-vr-android-studio-plugin) if you do not have it yet.
2. Click the Meta logo in the sidebar to open the **Meta VR** tool window, and log in with your Meta Horizon account.
3. In**Virtual Devices and Tools**, click the download icon beside **Meta Spatial Simulator**.
4. Click the green play button to start the simulator.

1. Install[Meta VR CLI](https://developers.meta.com/vr/documentation/android-apps/ts-ai-tooling-mcp) (`metavr`). That page covers the native installer and npm.
2. Install and start the simulator: metavr tools install spatialsim metavr ssim start metavr ssim status

If you are signed in to Meta VR CLI, `metavr ssim start` signs the simulator in to the same account, which removes the separate sign-in step. Starting the simulator from the Android Studio plugin does the same. A simulator that is already signed in keeps the account it has.

The download, update, and sign-in flags are listed in [Set up your environment and tools](https://developers.meta.com/vr/essentials/metavr-environment).

Your app appears as a panel. You can test it by clicking UI elements, typing into text fields, and scrolling with your mouse wheel or trackpad.

1. Start Meta Spatial Simulator. The device appears in Android Studio only while the simulator is running.
2. Select **Meta Spatial Simulator** in the device dropdown in the Android Studio toolbar.
3. Click **Run**.

Meta VR CLI has no build command. Build your APK as usual with Android Studio or Gradle, then use the CLI to deploy it.

1. Install and launch your APK: metavr app install path/to/your-app.apk metavr app launch com.example.myapp
2. Capture a screenshot when you need the rendered panel as a file rather than something to look at on screen. Use it in a CI check, in a bug report, or with a coding agent that has no view of the simulator window: metavr capture screenshot -o app.png

The simulator reproduces the Look and Pinch input model of Meta VR Glasses, the pre-release Meta device that replaces controllers with eye tracking and hand input. Look and Pinch is on by default, so the simulator starts in that model.

See [Test Look and Pinch](https://developers.meta.com/vr/documentation/android-apps/spatial-sim-look-and-pinch) for the settings menu, the interactive element overlay, and what to fix in your app. For the interaction model itself, see [Look and Pinch for 2D apps](https://developers.meta.com/vr/documentation/android-apps/gaze-and-hands).

The simulator also covers:

- [Test multiple windows](https://developers.meta.com/vr/documentation/android-apps/spatial-sim-multi-window): how your app behaves alongside other apps, in the background, and on return.
- [Sign in to the simulator](https://developers.meta.com/vr/documentation/android-apps/spatial-sim-sign-in): the parts of your app that need an account.
- [Built-in apps](https://developers.meta.com/vr/documentation/android-apps/spatial-sim-bundled-apps): flows that leave your app for Browser, Store, Files, or Gallery and come back, such as an OAuth handoff or a file picker.

- [Platform SDK testing](https://developers.meta.com/vr/documentation/android-apps/horizon-platform-sdk-spatial-simulator-overview): user management, in-app purchases, group presence, and application lifecycle, in a sandbox.

- [Billing Compatibility SDK testing](https://developers.meta.com/vr/documentation/android-apps/horizon-billing-compatibility-sdk/): your Google Play Billing integration, on SDK 2.0.0 or later.

The `metavr` commands on this page drive the device and the simulator. They are unrelated to the [Platform SDK on Spatial Simulator command-line interface](https://developers.meta.com/vr/documentation/android-apps/horizon-platform-sdk-spatial-simulator-cli), which uses `adb` broadcasts to simulate Platform SDK events such as in-app purchases, users, and leaderboards.

Check your machine against the [requirements](https://developers.meta.com#requirements) first, then:

- Update your GPU drivers to the current release.
- Free up memory. The simulator needs 4 GB.
- On Windows, confirm hardware virtualization is enabled in BIOS.

Read the simulator log output for errors, and allow up to five minutes on the first boot.

`metavr` resolves your Android SDK from `~/Library/Android/sdk` on macOS, `%LOCALAPPDATA%\Android\Sdk` on Windows). Set `adb`, and the CLI on one SDK, and put the SDK’s `platform-tools` directory first on your On macOS, add this to `~/.zshrc` or `~/.bash_profile`, then reload the shell:

export ANDROID\_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID\_HOME/platform-tools:$ANDROID\_HOME/emulator:$PATH"

On Windows, run this in PowerShell. It persists the values for new terminals and applies them to the one you are in:

```
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
$dirs = "$sdk\platform-tools;$sdk\emulator"
$userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$newPath = if ($userPath) { "$dirs;$userPath" } else { $dirs }
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdk, "User")
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")
$env:ANDROID_HOME = $sdk
$env:PATH = "$dirs;$env:PATH"
```
Read the User-scope `Path` rather than `$env:PATH`. The latter is the Machine and User values merged, so writing it back to the User scope copies every Machine entry into your account.

To see which `adb` wins, run `which -a adb`, or `where.exe adb` on Windows.

- Restart the ADB server with `adb kill-server && adb start-server`.
- Confirm no second virtual device is running on the same port.
- Update your `platform-tools` package.

A physical device, phone, or second virtual device is attached at the same time, so a command that expects a single device fails with `Multiple devices connected. Please specify a device with --device`. List what is attached:

metavr device list

Then pin the target with `-d`, the short form of `--device`, and the simulator’s serial. `metavr ssim status` also reports the serial:

metavr -d emulator-5554 capture screenshot -o app.png

- Read logcat for the error.
- Confirm your app targets API 34 (Android 14) or later.
- The simulator does not include Google Play services, so an app that depends on GMS does not run.

Support and legal

English (US)

© 2026 Meta
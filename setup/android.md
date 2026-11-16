# Android apps (Jetpack Compose / React Native via Expo) — short guide

The overview lists **Android apps** as a supported path: "React Native via Expo, or Jetpack Compose via Meta VR Plugin for Android Studio" ([overview](https://start-developer-competition-26.devpost.com/)). These are mostly **2D panel apps** on Horizon OS; the hands-only rule still applies (hands-driven input such as Look and Pinch / poke). Submission is the same as Unity/Unreal: APK → release channel **Competition** → invite URL.

## Jetpack Compose (Android Studio)
From [Meta VR Plugin for Android Studio](https://developers.meta.com/horizon/documentation/android-apps/meta-horizon-android-studio-plugin) (updated 9 Nov 2026):
- Plugin builds: `253.2.0.1.77` (Android Studio Panda 2025.3.x), `261.2.0.1.77` (Quail 2026.1.x), `262.2.0.1.77` (Rabbit 2026.2.x).
- Install from the [JetBrains Marketplace page](https://plugins.jetbrains.com/plugin/26861-meta-vr) or Settings → Plugins → Marketplace → search "Meta".
- **File → New → New Project → Meta VR** template. The plugin flags Horizon-incompatible libraries (Google Mobile Services, Play Billing).
- **Meta VR** tool window → Meta VR CLI card → **Open in terminal** → `metavr init`.
- Overview of options: [Horizon OS apps](https://developers.meta.com/horizon/documentation/android-apps/horizon-os-apps). Get Android Studio: [developer.android.com/studio](https://developer.android.com/studio).

## React Native via Expo
From [React Native comes to Meta Quest](https://reactnative.dev/blog/2026/02/24/react-native-comes-to-meta-quest):
1. Install **Expo Go** on the headset (Meta Horizon Store).
2. Create a standard Expo project and start the dev server; scan the QR code with the headset camera in Expo Go.
3. For store/release builds, use development builds and add the `expo-horizon-core` config plugin to `app.json` (see the blog post for the full snippet and product-flavor notes).

## Testing without a headset
[Meta Spatial Simulator](simulators/meta-spatial-simulator.md) (2D Android apps only; target API 34+, no GMS).

## Upload
Same as [unity.md §7](unity.md#7-upload-to-a-release-channel-named-competition--invite-url): create channel **Competition**, upload with `metavr store dist upload ...` / MQDH / `ovr-platform-util`, enable "Grant access to users by URL".

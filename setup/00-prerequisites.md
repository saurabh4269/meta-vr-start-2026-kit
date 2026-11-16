# 00 — Prerequisites (all build paths)

Everything here comes from the official pages linked on the competition's Devpost site (or one click deeper). Each step cites its source; local copies are in `resources/pages/`. Items marked **⚠ unverified** are my inference, not stated in a fetched doc.

## 1. Competition eligibility (do this first)

| Step | Details | Source |
|---|---|---|
| Join the Meta VR Start program | Apply at the Start program page (~5 min). You, or a member of your team, must be a Start member in good standing **before you submit**. | [overview](https://start-developer-competition-26.devpost.com/) · [Start program](https://developers.meta.com/vr/discover/programs/start/) · [FAQ](https://start-developer-competition-26.devpost.com/details/faqs) |
| Verify membership | Log in to the [Developer Forum](https://communityforums.atmeta.com/category/horizon-developer-forum); a "Start Member" or "Start Partner" flair should show next to your name. If not after 24 h, file a ticket at the [Developer Support Center](https://developers.meta.com/vr/support/). | [FAQ](https://start-developer-competition-26.devpost.com/details/faqs) |
| Age / account | 18+ (and age of majority), active Meta account with **Developer Access enabled**, eligible country. | [FAQ](https://start-developer-competition-26.devpost.com/details/faqs), [rules](https://start-developer-competition-26.devpost.com/rules) |
| Register on Devpost | "Join Hackathon" on the Devpost site. | [rules §3](https://start-developer-competition-26.devpost.com/rules) |
| Headset not required to enter | You may test with simulators; judges use Quest 3 / 3S. | [FAQ](https://start-developer-competition-26.devpost.com/details/faqs) |

## 2. Meta developer account, team, verification

From [Software Setup (Unity)](https://developers.meta.com/horizon/documentation/unity/unity-software-setup) and [Device Setup](https://developers.meta.com/horizon/documentation/native/android/mobile-device-setup/):

1. Create a Meta developer account: <https://developers.meta.com/vr/sign-up/>.
2. Verify the account: <https://developers.meta.com/vr/manage/verify/> — SMS 2FA on a supported carrier **or** a payment card (PayPal not accepted).
3. Join or create a **developer team (organization)** in the [Developer Dashboard](https://developers.meta.com/vr/manage/) — required before developer mode and before you can create an app / release channel. (Two individual entrants may share one org as long as each has their own developer account — [Devpost forum answer](../resources/devpost/forum/45708-can-two-individual-entrants-use-the-same-meta-horizon-developer-organization.md).)
4. Unity path: create a Unity ID at <https://id.unity.com/>. Unreal path: create an Epic Games account and link it to GitHub (<https://www.unrealengine.com/en-US/ue-on-github>) — [Unreal prerequisites](https://developers.meta.com/horizon/documentation/unreal/unreal-quick-start-install-prerequisites/).

## 3. Phone app + headset developer mode (when you have the Quest)

From [Software Setup](https://developers.meta.com/horizon/documentation/unity/unity-software-setup) (identical steps in [Device Setup](https://developers.meta.com/horizon/documentation/native/android/mobile-device-setup/)):

1. Install the **Meta Horizon mobile app** and pair the headset.
2. In the app: headset icon → your headset → **Headset Settings** → **Developer Mode** → toggle on. (Requires verified account, 18+, no device restrictions.)
3. Connect the headset with a **data-capable USB-C cable**.
4. In headset: Quick Controls → Settings (gear) → **Developer** tab → toggle **MTP Notification** on.
5. When prompted **Allow USB debugging**, choose **Always allow from this computer**.
6. In MQDH/MVDH → **Device Manager**, the device should show a green **Active** status.

Developer Mode is for development only; Meta warns other uses can lead to account limits ([source](https://developers.meta.com/horizon/documentation/unity/unity-software-setup)).

## 4. Desktop tools

| Tool | Version seen 16 Nov 2026 | Notes | Source |
|---|---|---|---|
| Meta Quest Developer Hub (MQDH; newer docs call it "Meta VR Developer Hub", MVDH) | Windows 6.5.2, macOS 6.6.0 | Device manager, APK install, logs, perf, uploads, creates Unity projects ("XR Projects"). No Linux build listed. | [MQDH getting started](https://developers.meta.com/horizon/documentation/unity/ts-mqdh-getting-started/), [Win pkg](https://developers.meta.com/horizon/downloads/package/oculus-developer-hub-win), [Mac pkg](https://developers.meta.com/horizon/downloads/package/oculus-developer-hub-mac) |
| ADB (Android platform-tools) | ships with Unity's Android SDK | Windows also needs the **Oculus ADB driver** (v2.0): extract `oculus-adb-driver-2.0`, right-click `usb_driver/android_winusb.inf` → Install. macOS: no driver. | [Software Setup](https://developers.meta.com/horizon/documentation/unity/unity-software-setup), [ADB driver pkg](https://developers.meta.com/horizon/downloads/package/oculus-adb-drivers/), [ADB guide](https://developers.meta.com/horizon/documentation/unity/ts-adb/) |
| Meta VR CLI (`metavr`) | 1.8.0 | Install: `curl -fsSL https://developers.meta.com/horizon/install-cli/ \| sh` (macOS/Linux; see page for Windows) or `npx metavr@latest init`. Device install/logs/perf traces, simulators, **`metavr store share`** (creates app + release channel + invite link). | [install](https://developers.meta.com/horizon/essentials/metavr-install), [overview](https://developers.meta.com/horizon/essentials/metavr-overview/), [pkg](https://developers.meta.com/horizon/downloads/package/meta-vr-cli/) |
| Meta Quest Link (Windows only) | — | Stream from PC for fast iteration with real hands; not representative of on-device perf. | [Link](https://developers.meta.com/horizon/documentation/unity/unity-link), [Hardware Setup](https://developers.meta.com/horizon/documentation/unity/unity-env-device-setup) |
| Agentic tools (skills / MCP) | — | `meta-quest/agentic-tools` plugin bundles Meta VR CLI MCP config + skills for AI coding agents. | [repo](https://github.com/meta-quest/agentic-tools), [Unity project setup](https://developers.meta.com/horizon/documentation/unity/unity-project-setup) |

## 5. Windows vs macOS vs Linux

| Capability | Windows | macOS | Linux | Source |
|---|---|---|---|---|
| Unity Build & Run to Quest | ✅ | ✅ | ⚠ not listed in Meta's Unity hardware table | [Hardware Setup](https://developers.meta.com/horizon/documentation/unity/unity-env-device-setup) |
| Meta Horizon Link (PC streaming) | ✅ | ❌ | ❌ | same |
| Meta XR Simulator | ✅ (Win 10+ 64-bit) | ✅ Apple Silicon only (needs Unity OpenXR Plugin ≥ 1.13.0) | A "Meta XR Simulator (Linux)" listing exists on the downloads index, but its package page returned 404 on 16 Nov 2026 — ⚠ unverified | [XR Sim get started](https://developers.meta.com/horizon/documentation/unity/xrsim-getting-started), [downloads](https://developers.meta.com/horizon/downloads/unity/) |
| Unreal editor + Meta XR Simulator integration | ✅ | ❌ (editor integration is Windows) | ❌ | [Unreal XR Sim](https://developers.meta.com/horizon/documentation/unreal/xrsim-getting-started) |
| Unreal development in general | ✅ | ✅ | ✅ | [Unreal prerequisites](https://developers.meta.com/horizon/documentation/unreal/unreal-quick-start-install-prerequisites/) |
| Meta Spatial Simulator (2D Android apps only) | ✅ Win10+ 64-bit, 8+ cores, virtualization on | ✅ Apple Silicon, macOS 12+ | ❌ not listed | [Spatial Sim](https://developers.meta.com/horizon/documentation/android-apps/spatial-sim-overview/) |
| IWSDK / WebXR + Immersive Web Emulator | ✅ | ✅ | ✅ (any Chromium browser / Node ≥ 20.19) | [IWSDK setup](https://iwsdk.dev/guides/01-project-setup.html), [IWE](https://github.com/meta-quest/immersive-web-emulator) |

## 6. Pick a build path

| Path | Guide | Judges get |
|---|---|---|
| Unity (Meta XR SDK v207+, current 209.0) | [unity.md](unity.md) | Invite URL to a release channel named **Competition** |
| Unreal (UE 5.8 + Meta XR plugin / integration v207+) | [unreal.md](unreal.md) | Invite URL to **Competition** channel |
| IWSDK / WebXR | [iwsdk-webxr.md](iwsdk-webxr.md) | Hosted HTTPS URL (GitHub Pages, Vercel, …) |
| Android (Expo / Jetpack Compose / Spatial SDK) | [android.md](android.md) | Invite URL to **Competition** channel |

Then: [on-device-quest.md](on-device-quest.md) (real headset), [simulators/](simulators/README.md) (no headset), [submission-checklist.md](submission-checklist.md).

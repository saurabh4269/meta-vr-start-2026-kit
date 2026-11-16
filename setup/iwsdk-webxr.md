# IWSDK / WebXR setup (hands-first, hosted URL submission)

| Item | Value (checked 16 Nov 2026) | Source |
|---|---|---|
| Competition-suggested | Node.js v20.19.0+, `npm create @iwsdk@latest` | [overview](https://start-developer-competition-26.devpost.com/) |
| Node requirement (current docs) | 20.19+ (Node 20 line), 22.12+ (Node 22 line), or 24+ | [IWSDK project setup](https://developers.meta.com/horizon/documentation/iwsdk/guides/01-project-setup/) |
| `@iwsdk/create` / `@iwsdk/core` | 1.1.0 / 1.1.0 (npm registry) | `npm view @iwsdk/create version` |
| Immersive Web Emulator extension | 2.0.0 | [Chrome Web Store](https://chromewebstore.google.com/detail/immersive-web-emulator/cgffilbpcibhmcfbgggfhfolhkfbhmik) |
| SDK source | [facebook/immersive-web-sdk](https://github.com/facebook/immersive-web-sdk) (redirects to meta/immersive-web-sdk, MIT) | Devpost /resources |

Submission for this path is a **hosted URL** (GitHub Pages, Vercel, etc.), not an APK ([overview](https://start-developer-competition-26.devpost.com/), [rules §4](https://start-developer-competition-26.devpost.com/rules)). Make sure it loads for anyone without a login.

## 1. Fastest start: the verified template in this repo
```bash
cd templates/iwsdk-starter
npm ci
npm run dev       # HTTPS dev server + built-in emulator
npm run build     # -> dist/
```
Mixed-reality, hand tracking, anchors, plane/mesh detection, grabbing, no locomotion. Details: [templates/iwsdk-starter/KIT-NOTES.md](../templates/iwsdk-starter/KIT-NOTES.md).

## 2. Or scaffold your own
From [IWSDK project setup](https://developers.meta.com/horizon/documentation/iwsdk/guides/01-project-setup/) / [iwsdk.dev ch.1](https://iwsdk.dev/guides/01-project-setup.html):
```bash
npm create @iwsdk@latest      # interactive: name, language, VR/AR, features
cd my-iwsdk-app && npm run dev
```
Non-interactive form used for this kit's template: see KIT-NOTES (flags verified with `@iwsdk/create@1.1.0`; note `--no-locomotion` is rejected together with `--target ar`).

## 3. Hands-only configuration
- `iwsdk.config.json` → `world.xr.features.handTracking`. Meta's example uses `{ "required": true }` to require hands (and `gazeTracking: true` for Meta VR Glasses' Look and Pinch) — [IWSDK testing guide](https://developers.meta.com/horizon/documentation/iwsdk/guides/02-testing-experience/). The kit starter currently has `handTracking: true` (generator default); change to `{ "required": true }` if you want to require hands.
- Built-in interactions (grab etc.): [iwsdk.dev ch.6](https://iwsdk.dev/guides/06-built-in-interactions.html). Raw WebXR hands: [WebXR Hands](https://developers.meta.com/horizon/documentation/web/webxr-hands) — note Quest reserves the **palm pinch** gesture for the system.
- FoV-aware: `world.features.fieldOfViewMask: true` plus the IWER FoV-mask toggle (same testing guide).

## 4. Test
- **Desktop (no headset):** IWER is injected automatically on localhost; toolbar → **Toggle input mode** to switch controllers ↔ hands; Play mode (pointer lock), `Left Shift`+WASD to move — [testing guide](https://developers.meta.com/horizon/documentation/iwsdk/guides/02-testing-experience/). Extension alternative for any WebXR page: [simulators/immersive-web-emulator.md](simulators/immersive-web-emulator.md).
- **Quest:** same Wi-Fi → open the Vite **Network** URL in Meta Quest Browser → accept the self-signed cert → Enter XR. Or USB + `chrome://inspect/#devices` → Port forwarding → `https://localhost:<port>` (same guide), or `adb reverse tcp:<port> tcp:<port>` then open `https://localhost:<port>` in Quest Browser ([Browser remote debugging](https://developers.meta.com/horizon/documentation/web/browser-remote-debugging/)). Remote debugging: [Browser + MQDH](https://developers.meta.com/horizon/documentation/web/browser-mqdh). Windows firewall, `adb reverse`, and `chrome://inspect` detail: [windows.md §9](windows.md#9-iwsdk--webxr-on-windows).
- **Performance:** [WebXR performance](https://developers.meta.com/horizon/documentation/web/webxr-perf) (frame-rate control, RenderDoc). Rules require ≥60 fps on Quest 3/3S.

## 5. Deploy
From [Build and deploy](https://developers.meta.com/horizon/documentation/web/iwsdk-guide-build-deploy) / [iwsdk.dev ch.8](https://iwsdk.dev/guides/08-build-deploy.html):
- `npm run build` → static `dist/`.
- **GitHub Pages (branch):** set Vite `base: '/<repo-name>/'` (or `'/'` for user sites/custom domains), `npm install -D gh-pages && npm run build && npx gh-pages -d dist`, Settings → Pages → Deploy from branch `gh-pages`.
- **GitHub Pages (Actions):** `templates/iwsdk-starter/deploy/github-pages-deploy.yml.example` (verbatim from Meta's guide).
- **Vercel:** `templates/iwsdk-starter/vercel.json` (from the official [iwsdk-v0-template](https://github.com/meta-quest/iwsdk-v0-template)).
- WebXR needs HTTPS; both hosts provide it.
- Optional Store/PWA distribution: [Web launch](https://developers.meta.com/horizon/documentation/web/web-launch) (not required for the competition).

Then [submission-checklist.md](submission-checklist.md).

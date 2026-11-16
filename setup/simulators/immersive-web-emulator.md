# Immersive Web Emulator (IWE) & IWER — WebXR / IWSDK

Two forms of the same runtime:
1. **IWER (Immersive Web Emulation Runtime)** — built into the IWSDK dev server; injected automatically on localhost. Nothing to install. ([IWSDK testing guide](https://developers.meta.com/horizon/documentation/iwsdk/guides/02-testing-experience/), [IWER docs](https://meta-quest.github.io/immersive-web-emulation-runtime/))
2. **Immersive Web Emulator browser extension v2.0.0** (updated 9 Jul 2026) — injects IWER into *any* WebXR page (three.js, A-Frame, your deployed URL). ([Chrome Web Store](https://chromewebstore.google.com/detail/immersive-web-emulator/cgffilbpcibhmcfbgggfhfolhkfbhmik), [GitHub, MIT](https://github.com/meta-quest/immersive-web-emulator))

## OS / browser support
Windows, macOS and Linux in Chromium browsers. Extension: Chrome Web Store, [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/immersive-web-emulator/hhlkbhldhffpeibcfggfndbkfohndamj), or manual **Load unpacked** from [GitHub releases](https://github.com/meta-quest/immersive-web-emulator/releases) for other Chromium browsers. Non-Chromium browsers: not supported (embed IWER instead). Source: [IWE README](https://github.com/meta-quest/immersive-web-emulator).

## Feature coverage (IWE README)
✅ WebXR Device API, Gamepads, **Hand Input**, AR module, Hit Test, Plane Detection, Mesh Detection, Anchors. Layers only with the layers polyfill. ⛔ Lighting Estimation, DOM Overlays.

## Using it with `templates/iwsdk-starter`
```bash
cd templates/iwsdk-starter && npm ci && npm run dev
```
Open the local URL → **Enter XR**. The starter's `iwsdk.config.json` sets emulator device `metaQuest3` and room `sunlit_living_room`. Controls ([testing guide](https://developers.meta.com/horizon/documentation/iwsdk/guides/02-testing-experience/)):
- **Play mode** (circle-play icon) locks the pointer; mouse looks; `Escape` exits.
- `Left Shift` + WASD moves the emulated headset; `Left Shift` + ↑/↓ changes height.
- Toolbar **Toggle input mode** → **hands** (test the hands-only path); **Reset device transforms** resets poses.
- Meta VR Glasses profile: **Select input mode → Gaze + Hands**; hold left mouse to pinch, mouse wheel to move the hand in depth; **Field-of-view mask** button previews the narrower FoV.
- With the built-in IWER you don't need the extension on localhost. IWE 2.0 only turns on for sites where you click its toolbar button ([store listing](https://chromewebstore.google.com/detail/immersive-web-emulator/cgffilbpcibhmcfbgggfhfolhkfbhmik)), so leave it off for the dev server ⚠ running both at once is untested.

## Using the extension on any WebXR page (e.g. your deployed URL)
From the store listing: install and **pin** IWE → open the WebXR page → click the IWE button to enable emulation for that site (the page reloads with a simulated runtime, device profile and in-page controls) → switch controller/hand input in the overlay; persistent defaults (device, environment, stereo, IPD, FOV) live in **DevTools → WebXR**.

## Limits
- Simulated hands (mouse/keyboard poses), no tracking noise or occlusion.
- Desktop frame rate says nothing about Quest Browser performance — test on the headset ([WebXR perf](https://developers.meta.com/horizon/documentation/web/webxr-perf)).
- No real passthrough; AR uses synthetic rooms.

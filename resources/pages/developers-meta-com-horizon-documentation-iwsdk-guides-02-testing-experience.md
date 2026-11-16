# Chapter 2: Testing Your Experience | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/iwsdk/guides/02-testing-experience/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 4, 2026

Now that you have a working IWSDK project, it’s time to launch it and see it in action! This chapter covers how to run your development server and test your WebXR experience using both browser emulation and a physical VR headset.

First, let’s navigate to your project and get the development server started.

Open your terminal and navigate to the project folder you created in Chapter 1:

cd my-iwsdk-app  # Replace with your actual project name

If you chose “No” when asked to install dependencies during project creation, install them now:

npm install

This will install all the necessary packages. If you already installed dependencies during project creation, you can skip this step.

Start your development server:

npm run dev

You should see output similar to:

VITE v7.1.4  ready in 1234 ms
  ➜  Local:   https://localhost:5173/
  ➜  Network: https://192.168.1.100:5173/
  ➜  press h + enter to show help

Or, if you prefer a CLI summary after startup:

npx iwsdk dev status

::: warning HTTPS Required
Notice that the URL uses **HTTPS** (not HTTP). This is required for WebXR to work - browsers only allow WebXR on secure origins. IWSDK generates and caches a locally generated development certificate without installing a certificate authority or changing your operating-system trust store. The managed browser accepts it automatically; a physical headset shows its normal certificate warning, which you should accept to continue.
:::

Your development server is now running and ready for testing!

Now that your development server is running, you can test your WebXR experience in two ways: with a physical headset for the full immersive experience, or on your desktop using IWER emulation.

If you have access to a VR headset, this provides the best testing experience for your WebXR application.

We recommend using a **[Meta Quest 3](https://www.meta.com/quest/quest-3/) or [Quest 3S](https://www.meta.com/quest/quest-3s/)** for development, because this tutorial is verified with those devices.

The Meta Quest series has excellent WebXR support built into the headset’s browser:

You can access the local development server from your XR headset using one of two methods: via your computer’s IP address or by using ADB with port forwarding.

On most home networks, you can access the local server directly. **Your headset must be connected to the same Wi-Fi network as your computer.**

1. **Put on your headset** and navigate to the browser app
2. **Find your computer’s IP address** in the Vite dev server output (look for the “Network” URL)
  - Example output: `➜  Network: https://192.168.1.100:5173/`
  - `npx iwsdk dev status` also reports the current runtime URL
3. **Enter the development URL** in your headset’s browser using the reported network host and port, for example `https://192.168.1.100:5173`
4. **Accept the certificate warning** (this is normal for local development with self-signed certificates)
5. **Click “Enter XR”** when the page loads

If accessing via IP address doesn’t work due to network restrictions or firewall settings (common on corporate networks), use ADB (Android Debug Bridge) with port forwarding:

1. **Connect your headset to your computer** via USB cable
2. **Enable developer mode** on your headset (check your device’s documentation for instructions)
3. **Set up port forwarding**:
  - Open Chrome on your computer and navigate to `chrome://inspect/#devices`
  - Your headset should appear under “Remote Target”
  - Click “Port forwarding...” in Chrome DevTools
  - Add a rule to forward the port shown in the Local URL from your computer to your headset
4. **Access the local server** on your headset by entering the forwarded URL, for example `https://localhost:5173`
5. **Accept the certificate warning** and **click “Enter XR”** when the page loads

IWER (Immersive Web Emulator Runtime) is a WebXR emulator that runs entirely in your browser, allowing you to develop and test WebXR applications without a headset. The IWSDK development plugin enables IWER according to your project’s emulator configuration; it does not probe for connected WebXR hardware. IWER provides mouse and keyboard controls to simulate VR interactions.

Learn more about IWER at [meta-quest.github.io/immersive-web-emulation-runtime/](https://meta-quest.github.io/immersive-web-emulation-runtime/).

The IWSDK development plugin injects IWER when the configured activation rules match. Generated projects keep project-owned emulator settings in `iwsdk.config.json`:

```
{
  "dev": {
    "emulator": {
      "device": "metaQuest3"
    }
  }
}
```
Keep the Vite configuration focused on enabling the development plugin:

```
import { iwsdkDev } from '@iwsdk/vite-plugin-dev';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [iwsdkDev()],
});
```
Do not also pass `emulator` to `iwsdkDev()`. When a project manifest is present, the plugin rejects competing project-owned configuration.

To test with IWER, open the local URL reported by the development command and select **Enter XR**. The development plugin injects the emulator when the configured activation rules match.

After entering XR, use the IWER toolbar and controller panels overlaid on the
page:

1. Click the **Play mode** button (the circle-play icon) to lock the pointer.
Move the mouse to look around. Press `Escape` to leave play mode.
2. Hold `Left Shift` while using `W`, `A`, `S`, and `D` to move the emulated headset through the
scene. Use `Left Shift` + `ArrowUp`/`ArrowDown` to adjust height.
These keys continue to drive their controller thumbsticks while Left Shift
is held, so the default XR starter moves both the emulated headset and the
player. If you need isolated headset free-flight, use the controller gear
buttons to remap the thumbstick keys first.
3. Without `Left Shift`, `W`/`A`/`S`/`D` drive the left
thumbstick. The arrow keys drive the right thumbstick.
4. In play mode, left mouse is the right-controller **trigger/select** and
right mouse is the right-controller **grip/squeeze**. The starter plant’s `DistanceGrabbable` uses trigger/select; near-field `OneHandGrabbable` and `TwoHandsGrabbable` interactions use grip/squeeze.
5. Outside play mode, click a controller’s **Trig** or **Grip** value for a
momentary press. Use the adjacent pin button to latch that value until you
release it. Open the gear button to inspect or remap keyboard bindings.
6. To move the starter plant, leave play mode, latch **Trig**, and drag the
controller’s transform handle in the scene. Use **Grip** instead when testing
a near-field grabbable. Click the handle to switch between translation and
rotation, then release the latch to drop the object.
7. Use **Toggle input mode** in the toolbar to switch between controllers and
hands. Use **Reset device transforms** to return the headset and inputs to
their default pose.

The default left-controller trigger and squeeze bindings are `Q` and
`E`. The visible binding chips in each controller panel are the source
of truth if you have remapped a control.

For automated interaction, use the CLI sequence in
[AI workflows: XR Interaction](https://developers.meta.com/vr/documentation/iwsdk/ai/workflows/#xr-interaction).

Configure the root `iwsdk.config.json` to request gaze and hands and enable
the Meta VR Glasses view profile for on-device testing:

```
{
  "$schema": "./node_modules/@iwsdk/core/dist/schemas/iwsdk-project.v1.schema.json",
  "version": "iwsdk.project.v1",
  "scene": "./public/scenes/main.iwsdk.scene.json",
  "world": {
    "xr": {
      "mode": "vr",
      "features": {
        "handTracking": { "required": true },
        "gazeTracking": true
      }
    },
    "features": {
      "fieldOfViewMask": true
    }
  }
}
```
For desktop emulation, set `dev.emulator.device` to the device profile that
your IWER build provides for the Meta VR Glasses device. Then start the development
server, open its local URL, and enter XR. Open
**Select input mode** in the IWER toolbar and choose **Gaze + Hands**. This
selects hands as the primary inputs and enables cursor-controlled gaze.

Use these controls in cursor-gaze mode:

- Move the pointer to aim the gaze ray.
- Hold the left mouse button to pinch with the selected commit hand.
- Drag while holding the left mouse button to move that hand.
- Use the mouse wheel while pinching to move the hand in depth.
- Drag with the right mouse button to rotate the emulated headset.
- Press Space to reset the commit hand’s transform.

Pointer-lock play mode is unavailable while cursor gaze is active. Open
**Configure gaze emulation** to choose **Off**, **Cursor**, or **Head-locked**,
select the left or right commit hand, and inspect whether session gaze was
negotiated and the source is connected. The right hand is the default commit hand. Head-locked mode keeps gaze straight ahead relative to the headset.

The selected Meta VR Glasses device profile’s IWER field-of-view mask starts enabled. Use the
**Field-of-view mask** toolbar button to enable or disable that desktop preview
layer. The button is disabled for device profiles that do not provide mask
data.

The manifest configuration in this section also enables IWSDK’s core mask. To inspect the core
mask by itself on a desktop, disable the IWER mask with the toolbar button. To
compare against a completely unmasked desktop view, temporarily set
`world.features.fieldOfViewMask` to `false` as well.

Gaze is a pose-only input source. Use `xr_look_at`, `xr_set_transform`, or
`xr_animate_to` to aim it; gaze transform updates accept orientation but not an
independent position. Move the gaze origin by moving the headset.

Send the pinch through `hand-left` or `hand-right` with `xr_select` or
`xr_set_select_value`. The gaze source itself does not emit select events and
is not accepted by the selection or gamepad tools. Use `xr_set_connected` with
the `gaze` device to test the tracked-gaze and head-pose fallback paths.

To preview Meta VR Glasses scene coverage on Meta Quest 3, Quest 3S, or another
supported Quest headset, keep this setting in the existing
`world.features` object:

```
"features": {
  "fieldOfViewMask": true
}
```
`true` selects IWSDK’s built-in Meta VR Glasses view profile at full opacity. Use
this Boolean form for the on-device preview.
Open the project on the headset and enter immersive XR. The mask uses the
browser’s native WebXR runtime; IWER is not required on the headset, and
`dev.emulator.device` affects only desktop emulation. The mask is hidden outside
an immersive session.

Treat the mask as a scene-coverage preview

The mask obscures pixels outside the built-in Meta VR Glasses WebXR view profile. It does not replace the host's \`XRView\` projection matrix, reproduce lens-edge shape, or expand a host projection that is narrower than the target bounds. It covers content rendered through IWSDK's main projection layer; validate native WebXR composition layers separately. For the distinction between nominal visible area and WebXR render extent, see
[Meta VR Glasses field of view and display values](https://developers.meta.com/vr/essentials/field-of-view).

For the complete workflow, see
[Get started with Meta VR Glasses using IWSDK](https://developers.meta.com/vr/documentation/iwsdk/guides/get-started-glasses/).

Excellent! You now have a running WebXR application and understand how to test it both in the browser with IWER emulation and on a physical headset.

In Chapter 3, we’ll dive into creating and manipulating 3D objects using Three.js fundamentals within the IWSDK framework.

Support and legal

English (US)

© 2026 Meta
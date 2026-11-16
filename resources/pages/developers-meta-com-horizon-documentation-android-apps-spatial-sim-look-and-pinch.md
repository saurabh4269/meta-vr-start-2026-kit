# Test Look and Pinch | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/android-apps/spatial-sim-look-and-pinch
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Oct 22, 2026

This guide covers the Meta VR Glasses features available in Meta Spatial Simulator: the **Settings** menu, **Look and Pinch** mode, and the **Show Interactive Elements** debug overlay. Use them to test how your app behaves on a device that uses eye tracking and hand input instead of controllers.

Until Meta VR Glasses ship, the simulator is the only way to test Look and Pinch input for a 2D Android app and confirm your app is ready for the device.

The Settings menu is accessed via a **gear button** in the top-left corner of the emulator screen. It floats above all apps and is always accessible.

- **Open:** Click the gear button
- **Close:** Click the gear button again, click the X button, click outside the Settings window, or press Escape / Back

When Settings is open, the app underneath is fully obscured to the system. Hover effects, clicks, and other input events **will not pass through** to the app below until Settings is closed.

Settings contains two toggles and an account row:

| Control | What it does | 
|---|---|
| **Look and Pinch** | Turns Look and Pinch input on or off. On by default | 
| **Show Interactive Elements** | Draws the interactive element overlay | 
| **Account** |  | 

Two icon buttons sit above them. The first returns to the home screen and leaves the foreground app running in the background. The second opens Window Manager, the overview of everything running. See [Test multiple windows](https://developers.meta.com/vr/documentation/android-apps/spatial-sim-multi-window).

SMS codes aren’t supported. We recommend either of these options:

- Sign in to Meta VR CLI, close the simulator, then run `metavr ssim start`.
- Sign in to Android Studio Plugin, close the simulator, then relaunch it from the plugin.

As a fallback, select **get a recovery code** in the two-factor sign-in panel. Use Browser to get an unused recovery code. After you close Browser, the sign-in panel reappears. Enter your recovery code to finish logging in.

Look and Pinch mode simulates how input works on the device. Your app does not receive hover events directly, so build it in a way that lets the OS highlight UI on the app’s behalf. For a full explanation of the Look and Pinch interaction model, see [Look and Pinch for 2D apps](https://developers.meta.com/vr/documentation/android-apps/gaze-and-hands/).

Look and Pinch is **on by default**, so the simulator starts in the input model the device uses. Turn it off to check how your app behaves with pointer input, as on Quest:

1. Open the Settings menu (gear button, top-left)
2. Turn **Look and Pinch** off

Turn it back on the same way. Test your app with and without Look and Pinch enabled, since your app needs to work whichever input method is in use. Even on the device, a user can turn Look and Pinch off.

- **Your app stops receiving hover events directly.** The system handles hovering and highlights UI on your app’s behalf, so anything you drove from hover events yourself needs rechecking.
- Horizontal and vertical trackpad scrolling follow your computer’s scrolling direction setting.
- **The mouse cursor changes to an eye icon** when Look and Pinch is active and Settings is closed. When Settings is open or Look and Pinch is off, the cursor returns to the default arrow.
- Hover effects disappear while scrolling, dragging, or holding down a click, which is expected

- Your app does not draw its own tooltips in Look and Pinch mode, because it does not receive hover events. The OS draws them instead, and the simulator renders them the same way the device does. Configure their content with the Gaze SDK for your UI toolkit: [Jetpack Compose](https://developers.meta.com/vr/documentation/android-apps/gaze-and-hands-compose-sdk/#control-interaction-targeting-and-tooltips), [React Native](https://developers.meta.com/vr/documentation/android-apps/gaze-and-hands-react-native-sdk/#control-targeting-and-tooltips), or [Android Views](https://developers.meta.com/vr/documentation/android-apps/gaze-and-hands-view-sdk/#control-targeting-and-tooltips).
- Tooltips appear after a one second delay, so a user’s eyes can cross several buttons without triggering a run of tooltips.
- A tooltip can sit above, below, left, or right of its element.
- A tooltip stays visible while the user gazes at it. Reproduce this by moving quickly from the element onto the tooltip.
- Clicking a tooltip triggers a click on the originating item. This matches device behavior.

This is a debug overlay that outlines **all interactable elements** detected by the hover system, regardless of where your cursor is.

1. Open the Settings menu
2. Turn **Show Interactive Elements** on

- Interactive elements (buttons, links, list items, and other tappable elements) are drawn with a green fill and a yellow stroke
- Non-interactive elements are drawn as normal, with no overlay on top of them. Nothing marks an element as non-interactive, so if an element you expect a user to click has no green fill, the system is not treating it as interactive
- Outlines respect the clipping bounds of their parent views, so an element in a scrollable list clips at the list boundary
- When Settings is open, outlines for the scene behind it are hidden; they reappear when Settings closes

Above, the overlay marks the controls in the Settings menu itself. The app behind it has no outlines, because Settings is open.

In Look and Pinch mode, the system handles hover events and your app does not receive them. If you use `onHoverEvent` or `PointerMoveEvent` for essential functionality, it will break. See [Look and Pinch for 2D apps](https://developers.meta.com/vr/documentation/android-apps/gaze-and-hands/) for details on the privacy-preserving interaction model.

The system identifies interactable elements by traversing the view/compose hierarchy. Use `Modifier.clickable` in Compose or mark views as `clickable` in the view system. See [Provide UI Understanding](https://developers.meta.com/vr/documentation/android-apps/gaze-ui-understanding/) for detailed framework-specific guidance.

Hovering each element in turn tells you what the system detected under your cursor, not what it missed. **Show Interactive Elements** answers the second question, because it outlines every element at once and makes an undetected control visible as a gap.

Meta VR Layout SDK exact X/Y offsets use the parent window’s density. Positive X moves the child left; positive Y moves it up, on every anchor. Offsets update the existing window and are constrained to the 1600 × 960 dp parent-and-child footprint. Semantic offsets use the same placement rules; Z continues to control depth ordering.

Support and legal

English (US)

© 2026 Meta
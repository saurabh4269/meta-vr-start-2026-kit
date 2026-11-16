# Meta for Developers

> Source: https://developers.meta.com/horizon/downloads/package/meta-xr-interaction-sdk-unreal/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Download

Updated: Sep 22, 2026|Version207.0

The Meta XR Interaction SDK package contains an Unreal plugin that can be used to build rich UI and 3D object interactions.
The Meta XR Interaction SDK for Unreal Engine makes it easy for VR users to immersively interact with their virtual environment. With Interaction SDK, you can grab and scale objects, push buttons, navigate user interfaces, and more while using controllers or just your physical hands.

What's New

Gaze Interactions

We added Gaze support to Interaction SDK for Unreal Engine on Meta devices with eye tracking. Users can target objects with eye gaze, with head gaze as a configurable fallback, then pinch to select and drag distant UI from the hand. Near hand grab still takes precedence over gaze-driven far grab of 3D objects.

Target selection is flicker-resistant so brief glances away do not steal the target, and sub-element targeting picks the individual button inside a panel rather than the whole panel. Two targeting modes are available: cone-cast and a strict line raycast for complex or animating widgets. See the [Gaze interactions](https://developers.meta.com/horizon/documentation/unreal/unreal-isdk-gaze-interaction/) and [Getting started with gaze interactions](https://developers.meta.com/horizon/documentation/unreal/unreal-isdk-gaze-getting-started/) documentation for more information.

Note: Gaze features require the MetaXR plugin and Project Settings > Plugins > MetaXR > XR API must be set to Epic Native OpenXR.

Gaze UI and Hover-Only Interactables

Gaze hover and select now work on UMG widgets, including hover-only interactables for objects that react to gaze without being actionable. Per-interactable opt-in and opt-out is supported without affecting hand or controller interaction, and arbitration resolves overlapping 3D objects and distant UI. Adding the gaze rig component to a pawn lets users target and select UI by looking at it and pinching to confirm, with minimal additional setup for existing interactables. See the [UI interaction using gaze](https://developers.meta.com/horizon/documentation/unreal/unreal-isdk-create-gaze-ui/) documentation for more information.

Gaze Grab of 3D Objects

We added gaze-driven far grab of 3D objects, with near hand grab taking precedence when the hand is close. This lets users acquire distant objects with gaze and manipulate them with their hands. See the [Gaze grab interactions](https://developers.meta.com/horizon/documentation/unreal/unreal-isdk-gaze-grab-interaction/) documentation for more information.

Gaze Testing and Samples

We added mouse-driven gaze in Play In Editor, including click and drag, so you can test gaze interactions without a headset. The new gaze sample scene includes a live gaze-state panel and a hover-only example. You can also toggle between gaze and hand/controller interaction at runtime, with a project-wide enable switch that is off by default.

Unreal Engine 5.8 Support and Sample Project Changes

This release adds official support for Unreal Engine 5.8. The plugin and sample `.uasset` files are still serialized for 5.7. We also deprecated the OpenXR-only sample project. The primary sample now requires the MetaXR plugin and defaults to the Epic Native OpenXR XRAPI. We also began migrating functionality from `InteractionSdk.dll` to Unreal-based solutions. This migration continues in subsequent releases until the DLL is fully removed.

What's Fixed

Enabled procedural controller-driven hands in Native OpenXR.

Improved hand aim pose in Native OpenXR

Fixed a controller data source crash on PC Link session loss.

Fixed ControllerDrivenHands sometimes being placed incorrectly.

Fixed crashes and packaging errors in AIsdkLevelTransitionMenu and UIsdkRoundedButtonComponent.

Known Issues

There is currently no path to disable the grabbable cursor on gaze interactors. This is corrected in a subsequent update.

When using Unreal Engine 5.8 or higher, if your project uses our samples you may need to set `r.Mobile.ShadingPath=0` in the project's DefaultEngine.ini for samples to render properly in packaged APKs. See Epic's article on [Mobile Rendering and Shading Modes](https://dev.epicgames.com/documentation/unreal-engine/mobile-rendering-and-shading-modes-for-unreal-engine) for more information.

Supported Unreal Engine Versions

Unreal Engine 5.8

Unreal Engine 5.7

Support and legal

English (US)

© 2026 Meta
# Meta for Developers

> Source: https://developers.meta.com/horizon/downloads/package/unreal-engine-5-integration/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Download

Updated: Nov 9, 2026|Version209.0

The latest Horizon Integration SDK for Unreal Engine 5 for developers bundled with OVRPlugin, Audio SDK, and Platform SDK.
UE Requirements

UE version 5.8.0

What's New

Removed the deprecated OVRPlugin XR API; projects using it are automatically migrated to the Native OpenXR XR API

Body Tracking, Eye Tracking and Face Tracking settings can no longer be edited in Project Settings, as they are not applicable to the Native OpenXR XR API

What's Fixed

Fixed apps targeting Meta VR Glasses failing Meta Horizon Store upload

Fixed crashes and missing results when sharing anchors to a group

Fixed MR Utility Kit creating a new world lock anchor every session and its highlight material failing to compile for Android

Fixed controller haptics and hand tracking issues on Windows and over Link, including crashes

Fixed face tracking viseme, colocation discovery and passthrough color LUT issues with Native OpenXR

Known Issues

Changing Fixed Foveated Rendering settings at runtime is not supported on UE 5.7+

Workaround: Use the project-level fixed foveated rendering settings in the MetaXR section of the Project Settings, or use the Github fork of the engine

Dynamic Resolution is only available when using the Github fork of the engine

Workaround: Use the Github fork of the engine

Mobile Subpass Bloom, Mobile VR Temporal Anti-Aliasing and tile-aligned foveated rendering are only available when using the Github fork of the engine

Support and legal

English (US)

© 2026 Meta
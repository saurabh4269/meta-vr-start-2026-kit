# Meta for Developers

> Source: https://developers.meta.com/horizon/downloads/package/meta-xr-mr-utility-kit-unreal/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Download from GitHub

Updated: Jul 19, 2024|Version67.0

MRUK provides a rich set of utilities/tools on top of Scene API to perform common operations when building spatially-aware apps. This makes it quick and easy to program against the physical world and allows the developer to focus on what differentiates their app. What's New

MRUK has been moved into the MetaXR plugin. Use MRUK from the MetaXR plugin in the future. There will be no standalone version anymore. The sample can be found on [https://github.com/oculus-samples/Unreal-MRUtilityKitSample](https://github.com/oculus-samples/Unreal-MRUtilityKitSample)

Added a scene decoration sample that leverages the Procedural Content Generation Framework (PCG) in Unreal to procedurally decorate a scene during runtime.

What's Fixed

Documentation improvements

Improvements

It’s now possible to customize the spawning logic in The AMRUKAnchorActorSpawner by inheriting from it and overriding methods

A new align mode was added to AMRUKAnchorActorSpawner to allow for custom alignments of spawned actors

It’s now possible to use multiple AMRUKAnchorActorSpawner in the same level

The distance map generator is now able to produce a distance map directly

Known Issues

In some cases, MRUK may load partial Scene data. This can lead to missing or misaligned Scene anchors. This will be fixed in v69. You can locally apply the hotfix from [https://github.com/Oculus-VR/UnrealEngine/pull/490](https://github.com/Oculus-VR/UnrealEngine/pull/490) in the meantime.

Support and legal

English (US)

© 2026 Meta
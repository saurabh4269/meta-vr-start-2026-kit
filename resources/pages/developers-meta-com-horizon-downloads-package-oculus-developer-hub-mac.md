# Meta for Developers

> Source: https://developers.meta.com/horizon/downloads/package/oculus-developer-hub-mac/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Download

Updated: Nov 2, 2026|Version6.6.0

Streamline app development for Meta Quest devices with the essential Meta Quest Developer Hub (MQDH) desktop companion tool for Mac.
New Features

Renamed Meta Quest Developer Hub to Meta VR Developer Hub (MVDH). [See developer guide](https://developers.meta.com/vr/documentation/unity/ts-odh/)

Redesigned Casting Window with a modern design and moved the Action bar to the toolbar to improve casting view visibility. This change is rolling out over the next few weeks. [Learn more](https://developers.meta.com/link)

Introduced redesigned Performance Analyzer trace capture with named presets for easier configuration. [Read documentation](https://developers.meta.com/link)

macOS builds are now properly signed and notarized.

Changes & Improvements

Breaking: Performance Analyzer trace capture now uses named presets instead of individual options. See the [migration guide](https://developers.meta.com/link) for details.

File Manager now loads thumbnails in bounded batches with placeholders for large media libraries, preventing headset freezes.

File rename now works over ADB-over-Wi-Fi and displays the new name immediately.

Filenames are validated before saving, rejecting over-length names with a clear message.

Build uploads that fail now stop and display the failure reason instead of spinning indefinitely.

Unity projects in the XR setup wizard now select the correct Meta XR SDK version.

Dropdowns inside dialogs now respond to arrow keys, Enter, and Escape.

ADB-over-Wi-Fi connection status is now accurate, and disconnected headsets no longer show a green indicator.

The USB connection checkmark in device setup reflects the actual cable state.

OVR Metrics and GPU Profiling toggles now recover when a command fails.

Background helper processes are cleaned up after use.

Viewing live metrics no longer starts a recording automatically.

Delete All in Recorded Traces now removes OVR Metrics sessions.

Feedback attachments now arrive with the submitted report.

Deprecations & Removals

The old "GPU Surface Timing" (Standard VR) preset has been removed. Capture falls back to the CPU Low Overhead preset.

Bug Fixes

Resolved an issue where Performance Analyzer metrics were not working on current Horizon OS versions.

Fixed a bug where casting reliability was poor, causing the device card to get stuck on "Casting".

Fixed an issue where Input Forwarding did not work at non-native casting resolutions.

Reopening the Build Upload window no longer crashes the app.

The “no recent binary” indicator now clears once an upload completes.

A transient network error during sign-in no longer signs you out.

Failed sideloads now surface the real installer error.

Headset renaming now works and persists.

Logcat window no longer crashes when rapidly opened and closed.

Custom command names no longer truncate in the grid layout.

\[MAC\] Add-account login window has working close, minimize, and zoom buttons again.

Known Issues

None reported.

Support and legal

English (US)

© 2026 Meta
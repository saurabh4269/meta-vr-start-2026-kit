# Meta for Developers

> Source: https://developers.meta.com/horizon/downloads/package/oculus-developer-hub-win/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Download

Updated: Sep 16, 2026|Version6.5.2

Streamline app development for Meta Quest devices with the essential Meta Quest Developer Hub (MQDH) desktop companion tool for Windows.
Meta Quest Developer Hub 6.5.2 for Windows (MQDH) is a desktop companion tool designed to streamline app development for Meta Quest headsets. The [developer guide](https://developers.meta.com/vr/documentation/unity/ts-odh/) provides instructions and valuable information for using MQDH.

What’s New

Redesigned Casting Window with a new, modern design

Moved the Action bar to the toolbar to not obstruct the casting view

NOTE: This will be rolling out over the next few weeks

Redesigned Performance Analyzer trace capture

Perfetto capture now uses named presets (CPU Low Overhead, GPU Surface and Metric, Render Pass Diagnosis, etc.) instead of a long list of individual options

Changing any setting inside a preset shows the capture as a custom configuration

GPU profiling is now a per-device opt-in (off by default) — turn it on for a headset when you want GPU data in a capture

Connecting a headset no longer turns GPU profiling on by itself, so frame time and TimeWarp are unaffected until you ask for GPU data

Presets that carry heavy CPU overhead (GPU Surface and Metric, Render Pass Diagnosis) now warn you before you capture

The old "GPU Surface Timing" (Standard VR) preset has been removed and "GPU Deep Dive" renamed to "Render Pass Diagnosis"; if you had either selected, capture falls back to the CPU Low Overhead preset

Traces now include CPU frequency, memory rows, and GPU command-batch events by default

Performance Analyzer metrics work again on current Horizon OS versions

Charts that showed dashes or empty graphs on Horizon OS v57 and newer, including on Quest 3, now display real values

GPU Memory Access and additional GPU counters now plot values instead of appearing as empty rows

The in-headset metrics overlay responds to MQDH again: None/Basic/Advanced cards, per-metric checkboxes, and Stats/Graphs switches all reach the headset

Metrics settings are now grouped by category instead of a single long list

Improved casting reliability

\[WINDOWS\] Audio now stays in sync over long casting sessions instead of drifting into lag or crackling

A cast that fails to start returns the app to a usable state instead of leaving the device card stuck on “Casting”

Input Forwarding now works at all casting resolutions, not only native resolution

Escape exits full-screen casting on both Windows and macOS

Feedback Center now shows your 20 most recent submissions with a link to the Horizon OS Developer Center for full history

Unified app update path

MQDH now uses a single updater instead of two overlapping update mechanisms

Quest 3S Xbox Edition is now recognized throughout the app with the correct name and product image

Performance Analyzer CLI adds `mqdh-perf capture` for scripted trace capture

Improvements and Bug fixes

File Manager no longer freezes the headset when loading large media libraries; thumbnails load in bounded batches with placeholders for 4K+ video

File rename works over ADB-over-Wi-Fi and the new name appears immediately

Filenames are validated before saving so over-length names are rejected with a clear message

Build uploads that fail now stop and show the failure reason instead of spinning indefinitely

Reopening the Build Upload window no longer crashes the app

The “no recent binary” indicator clears once an upload completes

Unity projects in the XR setup wizard no longer select a deprecated Meta XR SDK version

A transient network error during sign-in no longer signs you out

Dropdowns inside dialogs now respond to arrow keys, Enter, and Escape

Failed sideloads now surface the real installer error instead of a bare exit code, and uninstalls no longer hang

ADB-over-Wi-Fi connection status is now accurate — disconnected headsets no longer show a green indicator

The USB connection checkmark in device setup reflects the actual cable state independently of authorization status

OVR Metrics and GPU Profiling toggles recover when a command fails instead of spinning indefinitely

Headset renaming works and the new name persists, including over ADB-over-Wi-Fi

Background helper processes are cleaned up rather than accumulating over a long session

Viewing live metrics no longer starts a recording automatically

Delete All in Recorded Traces now also removes OVR Metrics sessions

Feedback attachments, including plain-text files, now arrive with the submitted report

Logcat window no longer crashes when rapidly opened and closed

Custom command menu stays anchored to its button when the page scrolls

Fixed custom command names truncating in the grid layout

\[WINDOWS\] Background command windows no longer flash on screen while MQDH works

Support and legal

English (US)

© 2026 Meta
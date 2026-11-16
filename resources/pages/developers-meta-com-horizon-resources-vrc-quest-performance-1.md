# VRC.Quest.Performance.1 | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/resources/vrc-quest-performance-1/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Distribute and grow

Updated: Oct 22, 2025

The app must run at an allowed refresh rate and maintain a rendering rate (fps) of at least 60 fps:

- Apps must maintain a rendering rate of at least 60 fps<sup>1</sup>.
- Interactive applications must use a refresh rate of 72 Hz, 80 Hz, 90 Hz, 96 Hz, 100 Hz or 120 Hz. (96 Hz, 100 Hz, and 120 Hz not available on all devices)
- Media applications may use a refresh of 60 Hz on devices that support 60 Hz (not available on all devices).

|  | Required ✓ | Recommended + | 
|---|---|---|
| Immersive apps | ✓ |  | 
| Panel (2D) apps |  | + | 

- Apps are not required to maintain their rendering rate when a loading screen or full-screen fade is present.
- Due to the additional GPU cost incurred when streaming a play session or recording it to video, applications are allowed to run at a slightly lower rendering rate *while streaming or recording to video*.

- Interactive applications may use a rendering rate (fps) of half the refresh rate (such as 30 fps for 60 Hz, 36 fps for 72 Hz), for portions of their experience utilizing Application SpaceWarp.
- Applications are required to generate motion vectors that minimize the artifacts of Application SpaceWarp to receive this exception.

Use the [OVR Metrics Tool](https://www.meta.com/experiences/ovr-metrics-tool/2372625889463779/) to test your app against these requirements. For additional information, please review the following guidance:

VRC.Quest.Performance.1 is one of the most commonly failed VRCs. Learn more about passing this check in less than two minutes:

Additionally, you can check out the [Passing the Most Commonly Failed VRCs](https://docs.dataprotocol.com/how-to-guides/passing-the-most-commonly-failed-vrcs?utm_source=mh_docs&utm_medium=banner&utm_campaign=vrc_quest_performance_1&utm_id=mh#performance) guide.

1. Use the app for the length of the content or 45 minutes, whichever is shorter.
2. Launch the OVR Metrics tool and select the log file for your app.
3. Observe the FPS graph to determine if extended periods of rendering rate below 60 fps are present.

The application should not experience extended periods of rendering rate below 60 fps, or when using Application SpaceWarp, 30 fps. Exceptions include when there’s a black screen or loading scenes, or when system menu overlays are present, or when a play session is being streamed or recorded to video.

- 2025-10-22: Added 96 Hz and 100 Hz. While not available today, we plan to make these refresh rates available on Quest 2, Quest 3 and Quest 3S in a future version of the OS.
- 2025-09-02: Apps are not required to maintain their rendering rate when a loading screen or full-screen fade is present.
- 2024-10-29: 120 Hz added as an allowed refresh rate.
- 2024-08-07: Lowered rendering rate requirements. Apps can now run at a minimum rendering rate of 60fps, or 30fps if using Application SpaceWarp. The minimum refresh rate of 72 Hz, or 60 Hz on Meta Quest 2, remains unchanged.
- 2024-07-31: Removed App Lab from VRC platform requirements.
- 2024-04-25: During streaming or video recording, the app rendering rate is now allowed to fall slightly.
- 2024-03-11: If using Application SpaceWarp, the app rendering rate is now allowed to be half the refresh rate.

Support and legal

English (US)

© 2026 Meta
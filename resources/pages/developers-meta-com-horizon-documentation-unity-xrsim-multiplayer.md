# Multiplayer testing with Meta XR Simulator | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/xrsim-multiplayer
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 11, 2026

Meta XR Simulator lets you test a multiplayer mixed reality game without
gathering people for a test session.

Switch between sessions in the **Multiplayer sessions** tab of the bottom tray.

To use this form of multiplayer testing, ensure that you have the following:

- At least two Meta Quest headsets
- A VR app set up for Unity
- [ParrelSync](https://developers.meta.com/vr/documentation/unity/unity-multiplayer-testing/) installed for your Unity Editor
- [Link](https://developers.meta.com/vr/documentation/unity/unity-link/) set up for your headset and PC

1. In the menu, navigate to **ParrelSync** > **Clone Manager**.
2. Use ParrelSync’s Clone Manager to create two additional Unity Editors.   Once you have created two additional clones, you must activate the Meta XR Simulator.

This page covers the concept and the clone setup only. The steps for activating
the simulator in each intended clone, launching the clients, and verifying the
sessions are not published here, because that flow has not been run end to end
against a v207 build.

For the currently published Unity procedure, see
[Setup Multiplayer Testing with Link and XR Simulator in Unity](https://developers.meta.com/vr/documentation/unity/unity-multiplayer-testing-xr-sim/).

Support and legal

English (US)

© 2026 Meta
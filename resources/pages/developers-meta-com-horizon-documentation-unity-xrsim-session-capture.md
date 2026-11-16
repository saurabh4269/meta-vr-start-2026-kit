# Capture a Meta XR Simulator Session | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/xrsim-session-capture
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 3, 2026

Session Capture records the inputs you give an app running in Meta XR Simulator to a VRS file, then replays them. A replay reproduces the same head and input motion every run, so you can build repeatable manual tests or drive automated tests in continuous integration.

For an introduction to the simulator, see [Meta XR Simulator](https://developers.meta.com/vr/documentation/unity/xrsim-intro/).

1. Start an app with the runtime set to Meta XR Simulator.
2. Load a scene.
3. In the simulator header, select **Record session**.
4. Choose a save path for the `.vrs` recording. The simulator enters the recording state and the button label changes to **Stop recording**.
5. Use your keyboard and mouse, or a connected controller, to interact with the app.
6. Select **Stop recording** to end the recording.

After you [create a recording](https://developers.meta.com#create-a-recording):

1. Start the same app with Meta XR Simulator.
2. In the simulator header, select the upload button. Its tooltip begins with`Upload VRS file`.Disabled while recording or playback is active.
3. Choose the `.vrs` recording to open.
4. Choose a save path for the `.vrs` replay output.
5. The simulator enters the replay state and the button label changes to **Stop playback**.
6. Select **Stop playback** to end the replay early.

This works with standalone applications but not with Play mode in Unity.

Add a `session_capture` block to `persistent_data.json`, then launch the app with Meta XR Simulator to replay automatically.

| Platform | Location | 
|---|---|
| Windows | `%APPDATA%\MetaXR\MetaXrSimulator\persistent_data.json` | 
| macOS | `~/Library/Application Support/MetaXR/MetaXrSimulator/persistent_data.json` | 

```
"session_capture": {
    "delay_start_ms": 1000,
    "exec_state": "replay",
    "quit_buffer_ms": 5000,
    "quit_when_complete": true,
    "record_path": "C:\\open\\test_recordings\\recording.vrs",
    "replay_path": "C:\\open\\test_recordings\\replay.vrs"
}
```
The sample paths are Windows-style. Use POSIX paths on macOS.

`persistent_data.json` is merged over the core configuration and wins where the two disagree. A `session_capture` block left from an earlier run triggers another replay on the next launch. Remove the block when you finish.
When the replay finishes, the runtime asks your **application** to exit its OpenXR session. It does not close the simulator window and does not terminate your application: your application has to act on the request. Set `quit_when_complete` to `false` to skip it.

From launch, the request comes after `delay_start_ms` plus the recording length plus `quit_buffer_ms`. From the end of playback, the delay is `quit_buffer_ms`.

- `session_capture` (object, required): top-level block that contains the automation parameters.
- `delay_start_ms` (int, optional): milliseconds to wait before starting the replay. Defaults to 0.
- `exec_state` (string, required): which state to start the automation in. `replay` is the supported value.
- `quit_buffer_ms` (int, optional): milliseconds to wait after the replay completes before requesting session exit. Omit the key and the value is 1000. Set it and values below 5000 are raised to 5000, while values of 5000 or greater are used as written.
- `quit_when_complete` (bool, optional): whether to request session exit after the replay completes. Defaults to `true`.
- `record_path` (string, required): absolute path to the recording to replay.
- `replay_path` (string, optional): absolute path to save the replay output. Leave it out to replay without writing a file.

Support and legal

English (US)

© 2026 Meta
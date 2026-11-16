# Built-in Test Rooms | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/xrsim-heroscenes
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

# Built-in Test Rooms

Updated: Sep 4, 2026

Meta XR Simulator allows you to simulate mixed reality (MR) applications in
synthetic environments. Your application can query the passthrough data, scene
information (walls, floors, ceilings, furniture, doors, and windows), and
spatial anchors embedded in each environment. On Windows, applications running
on the Meta Quest 3, Meta Quest 3S, or Meta VR Glasses device profile can also
query environment depth data.

Select **Choose environment** in the Meta XR Simulator toolbar, then pick a room
from the **Environments** popover. Your choice persists across simulator
restarts.

Changing the environment stops and relaunches the simulator’s target platform,
which drops every connected OpenXR client. If an application is connected, the
simulator asks you to confirm first. With no application connected it happens
immediately, without a prompt. Start your application again afterward.

If the environment fails to restart, the popover reports the failure and offers
**Force close**. That kills whatever process is holding the port, which is the
Unity Editor if a Synthetic Environment Builder project is serving the
environment. Stop that process yourself where you can, and save your work before
using **Force close**.

Meta XR Simulator has three realistic synthetic environments: a game room, a
living room, and a bedroom.

Meta XR Simulator includes six additional feature rooms. Use them to test MR
apps against a variety of room layouts.

**Note**: Passthrough stylization effects (such as color maps, color LUTs, edge
rendering, and brightness/contrast/saturation adjustments) are supported by the
SDK but may not render correctly in Meta XR Simulator’s simulated passthrough.

Passthrough in the simulator is delivered as a texture, and the format is set by
`ses_texture_format` in `sim_core_configuration.json`, in the `config` directory
of your Meta XR Simulator installation.

| Value | Behavior | 
|---|---|
| `gpu_handle` | Shares a GPU texture handle. | 
| `raw_rgba` | Sends uncompressed pixels. | 
| `jpg` | Sends compressed pixels. | 

On a desktop install the shipped value is `gpu_handle`. Check your own
configuration file rather than assuming it, because some builds ship `jpg`
instead. Android always uses `jpg` whatever the file says.

The simulator treats any unrecognized value as `jpg`. Set `jpg` if passthrough
fails to display. The simulator reads this value once and caches it, so restart
the simulator after you change it.

## Create your own test rooms

The **Synthetic Environment Builder** lets you construct your own test rooms.
See
[Synthetic Environment Builder](https://developers.meta.com/vr/documentation/unity/xrsim-synthetic-environment-builder/)
to learn more.
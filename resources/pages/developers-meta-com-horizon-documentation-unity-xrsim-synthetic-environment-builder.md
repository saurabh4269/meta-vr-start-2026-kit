# Build Your Own Test Room | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/xrsim-synthetic-environment-builder/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 3, 2026

The Synthetic Environment Builder lets you use your own synthetic environment for mixed reality simulation in the Meta XR Simulator. It is a UPM package that you can import into your Unity project containing a synthetic environment, and turn that project into a Synthetic Environment Server.

- A Unity project containing the synthetic environment you want to use for passthrough simulation. This page calls it the server project.
- The `com.unity.postprocessing` package, version 3.2.2. The Builder declares it
as a dependency, so Unity resolves it when you add the package.
- A scene where each room has exactly one floor and exactly one ceiling. The Builder builds a separate room layout for every room in the scene.

The Builder ships as a separate download rather than inside the Meta XR
Simulator package. Download it from
[Meta XR Simulator - Synthetic Environment Builder](https://developers.meta.com/vr/downloads/package/meta-xr-simulator-synthetic-environment-builder/),
then add the `com.meta.xr.simulator.synthenvbuilder` package to the server
project with **Window** > **Package Manager** > **+** > **Add package from
disk**.

1. Open the server project with the Builder package installed.
2. Under`SynthEnvServer`, open `Scene Annotation Tool`:
3. An editor window will pop up:
4. Click `Initialize Scene`. The button becomes disabled once the server object
exists in the scene, which is how you confirm this step worked.
5. Run the server project in Play mode. It now acts as the synthetic environment server. Run an MR application in Meta XR Simulator and confirm that its passthrough content comes from the server project.

Initializing the scene adds a server component to it. Entering play mode starts
a gRPC server on `localhost:33792`, which is the port Meta XR Simulator looks
for a synthetic environment on. Leaving play mode stops it.

In the Unity Editor the server runs while Play mode is active: passthrough in
the simulator lasts exactly as long as the server project is playing, and stops
when you exit Play mode. If you build the server project instead, the same
server starts and stops with that player process.

Only one process can hold port 33792, so a built-in room and a server project
cannot serve at the same time. Exit Play mode to release the port cleanly. If
the simulator reports that the environment failed to restart on that port,
**Force close** in the **Environments** popover kills whatever process holds it.
That is the Unity Editor when the Builder is running, so save your work first
and reserve **Force close** for a process you cannot stop any other way.

The next thing to do is annotate your synthetic environment with [scene information](https://developers.meta.com/vr/documentation/unity/unity-scene-overview/).

1. Select a game object in the scene.
2. In the`Scene Annotation Tool`, make sure the `Selected Object` is correct, and then click `Make 3D Scene Entity`:
3. The game object should now be surrounded by a bounding box:
4. Apply the correct[semantic label](https://developers.meta.com/vr/documentation/unity/unity-scene-build-mixed-reality/#scene-semantic-classifications). Adjust center/size if needed.

1. Select the game object where the 2D entity plane is going to be attached to, for example, a desk:
2. In the`Scene Annotation Tool`, make sure the `Selected Object` is correct, and then click `Make 2D Scene Entity`:
3. This creates a plane under the selected game object:
4. Set the position, size and orientation of the plane to match the surface it represents. The Builder guesses the initial rotation and never validates it, so check the result in the Scene view against the image below.
5. Apply the correct[semantic label](https://developers.meta.com/vr/documentation/unity/unity-scene-build-mixed-reality/#scene-semantic-classifications).

Note:

1. Each room needs exactly one ceiling and one floor. Aside from that, you can freely choose which objects to label according to your particular use case.
2. The label dropdowns offer a fixed set. For a 2D entity: `CEILING`, `COUCH`, `DOOR_FRAME`, `FLOOR`, `TABLE`, `WALL_ART`, `WALL_FACE` and `WINDOW_FRAME`. For a 3D entity: `BED`, `COUCH`, `LAMP`, `OTHER`, `PLANT`, `SCREEN`, `STORAGE` and `TABLE`.
3. For a single-room scene you can skip room assignment: annotations with no room fall into a built-in default room. For more than one room, select `Create Room Entity` for each, then assign every annotation to its room with the **Room** dropdown in the Inspector.
4. Scene entities are highlighted by Unity Scene Gizmos. You can choose to not have them highlighted by unchecking`Bounded 2D/3D Entities` from the scene gizmos menu:

For multiplayer simulation, the Synthetic Environment Builder can create “position marks” that show where each player is when the server is running. Each client that streams passthrough or hand state gets a color-coded cube, plus a mark for each of its hands:

To add position marks:

1. Make sure the view of the main camera includes the entire scene. Use a top-down view. The marks are excluded from the capture cameras, so they never appear in simulated passthrough.
2. Add a Unity layer named exactly`Position Marks`. The Builder looks the layer up by that name:

A client gets a mark once it starts streaming passthrough or hand state. A client that only reads scene data gets none.

Run the server project in play mode and connect it to an MR application running in the Meta XR Simulator. Check whether the application has correct passthrough and scene information. Use the Unity [Scene Manager](https://developers.meta.com/vr/documentation/unity/xrsim-getting-started/#optional-using-a-sample-scene-to-validate-your-installation) sample.

Then, you can build your server project and use it as a synthetic environment server.

Built-in rooms and rooms created with the Synthetic Environment Builder provide Passthrough, Scene, and Depth data. If you only need Scene data, use a lightweight JSON-based room instead. See [Meta XR Simulator JSON Format Rooms](https://developers.meta.com/vr/documentation/unity/xrsim-test-rooms-json-1.0/).

Support and legal

English (US)

© 2026 Meta
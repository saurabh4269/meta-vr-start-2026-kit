# Get Started with Passthrough | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-passthrough-gs/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Oct 7, 2026

This topic describes the instructions to get started with passthrough.

If you're new to Unity development for Meta VR devices, check out [Build your first VR project](https://developers.meta.com/vr/documentation/unity/unity-tutorial-hello-vr/) to create your first VR app with hand tracking.

Before proceeding with this tutorial, complete the setup steps outlined in:

- [Set up Unity for XR development](https://developers.meta.com/vr/documentation/unity/unity-project-setup/) to create a project with the necessary dependencies
- [Set up your device](https://developers.meta.com/vr/documentation/unity/unity-env-device-setup) to configure
and test your project on a headset
- [Project configuration](https://developers.meta.com/vr/documentation/unity/unity-project-configuration) to
optimize your app performance

To configure your Unity project for passthrough, set up the **OVRCameraRig**
using the following steps:

1. Create a new scene or select an existing scene from your project.
2. Delete any existing **Main Camera** objects from the **Hierarchy** tab.
3. From the **Project** tab, locate the **OVRCameraRig** using search, and then
drag the prefab into the scene.
4. On the **Hierarchy** tab, select **OVRCameraRig**.
5. On the**Inspector** tab, under **OVRManager**, do the following:a. Under**Quest Features** > **General** tab, in the **Passthrough Support** list, select either **Required** or **Supported** to enable the build-time
components for using passthrough.b. Under**Insight Passthrough**, select **Enable Passthrough** to initialize
passthrough during app startup. (To initialize passthrough at a later time
through a C# script, you can leave the checkbox unchecked and set [`OVRManager.isInsightPassthroughEnabled`](https://developers.meta.com/vr/reference/unity/v209/class_o_v_r_manager/#a10fd7bd957490b396fcbd41f901917e0) in your script.)
6. Create a new empty GameObject in the scene and navigate to its inspector tab.
Click **Add Component**, and then in **Scripts**, select **OVR Passthrough
Layer**.

Recommendation

If you have a multi-scene MR project it is recommended to use the same OVRPassthroughLayer instance across all scenes. In other words, the GameObject with the **OVR Passthrough Layer** component should contain a script that calls DontDestroyOnLoad() on the GameObject and the access this same instance of the component across all of your scenes and only disable it in full VR scenes.

When using **OVR Passthrough Layer (Script)**, you also need to set the Skybox Material to None. To do this, go to **Window** > **Rendering** > **Lighting**, and then on the **Environment** tab, in the **Skybox Material** field, select **None**. This ensures that the passthrough is visible behind your virtual content.

To experiment more with passthrough, first do either the basic
[Passthrough Basic Tutorial](https://developers.meta.com/vr/documentation/unity/unity-passthrough-tutorial/)
or the
[Basic Passthrough Tutorial with Building Blocks](https://developers.meta.com/vr/documentation/unity/unity-passthrough-tutorial-with-blocks/).
For more showcase projects for Meta Quest, see the repositories
in the
[oculus-samples](https://github.com/orgs/oculus-samples/repositories?type=all)
GitHub organization. The Unity-Discover and Unity-TheWorldBeyond projects both
make use of passthrough.

Customize passthrough through
[styling](https://developers.meta.com/vr/documentation/unity/unity-customize-passthrough-styling/) and
[color mapping](https://developers.meta.com/vr/documentation/unity/unity-customize-passthrough-color-mapping/).

In your app, you may want to show either a VR or passthrough background based on
user choice. Our system already provides users with this choice in the home
environment, and your app can leverage the user’s home environment preference.
More generally, our system provides a recommendation for apps to default to MR
or VR based on user preferences. This recommendation is available using
[`OVRManager.IsPassthroughRecommended()`](https://developers.meta.com/vr/reference/unity/v209/class_o_v_r_manager_passthrough_capabilities/).
Example usage:

```
// Add this to any MonoBehavior
void Start()
{
   if (OVRManager.IsPassthroughRecommended())
   {
      passthroughLayer.enabled = true;
      // Set camera background to transparent
      OVRCameraRig ovrCameraRig = GameObject.Find("OVRCameraRig").GetComponent<OVRCameraRig>();
      var centerCamera = ovrCameraRig.centerEyeAnchor.GetComponent<Camera>();
      centerCamera.clearFlags = CameraClearFlags.SolidColor;
      centerCamera.backgroundColor = Color.clear;
      // Ensure your VR background elements are disabled
   }
   else
   {
      passthroughLayer.enabled = false;
      // Ensure your VR background elements are enabled
   }
}
```
Enabling passthrough is asynchronous. System resources (like cameras) can take a
few hundred milliseconds to activate, during which time passthrough is not yet
rendered by the system. This can lead to black flickers if your app expects
passthrough to be visible immediately upon enabling, and the passthrough system
wasn’t previously active. You can avoid that by using the
**passthroughLayerResumed** event, which is emitted once the layer is fully
initialized, and passthrough is visible.

You don’t need to worry about this at app startup, though. If the transition
leading into your app was already showing passthrough (see
[Loading Screens](https://developers.meta.com/vr/documentation/unity/unity-customize-passthrough-loading-screens/)),
you can rely on passthrough being rendered immediately upon enabling. Just make
sure that your
[`OVRPassthroughLayer`](https://developers.meta.com/vr/reference/unity/v209/class_o_v_r_passthrough_layer/)
is enabled right from the start. In other words, you only need to consider this
event if you enable passthrough while the app is already running.

Example usage:

```
[SerializeField] private OVRPassthroughLayer oVRPassthroughLayer;
private void Awake()
{
  oVRPassthroughLayer.passthroughLayerResumed.AddListener(OnPassthroughLayerResumed);
  // 1) We enable the passthrough layer to kick off its initialization process
  oVRPassthroughLayer.enabled = true;
}
private void OnDestroy()
{
  oVRPassthroughLayer.passthroughLayerResumed.RemoveListener(OnPassthroughLayerResumed);
}
// 2) OnPassthroughLayerResumed is called once the layer is fully initialized and passthrough is visible
private void OnPassthroughLayerResumed(OVRPassthroughLayer passthroughLayer)
{
  // 3) Do something here after the passthrough layer has resumed
}
```
You can speed up app development significantly by avoiding the need to rebuild
and deploy for every iteration. Consider the following options:

- [Passthrough over Link](https://developers.meta.com/vr/documentation/unity/unity-passthrough-use-over-link/) allows you to run your app directly in the Unity Editor with a headset
connected over Link.
- [Meta XR Simulator](https://developers.meta.com/vr/documentation/unity/xrsim-getting-started/) allows you to
run your app in a simulator without the need for a physical device.

Support and legal

English (US)

© 2026 Meta
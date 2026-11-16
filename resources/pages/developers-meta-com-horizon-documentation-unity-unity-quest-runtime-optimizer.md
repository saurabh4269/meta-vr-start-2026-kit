# Runtime Optimizer | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/unity-quest-runtime-optimizer
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Oct 22, 2026

This tool is currently in its experimental phase. Meta is actively gathering feedback from users to shape its future.

The Meta Quest Runtime Optimizer helps developers identify and resolve performance bottlenecks in Meta Quest applications. It provides real-time analysis and actionable insights to optimize GPU and CPU performance, and runs without additional dependencies.

Key capabilities include:

- **Quick Perf**: Real-time CPU and GPU frame time monitoring with automatic bottleneck classification
- **Bottleneck Analysis**: Rule-based analysis of captured frames with per-category insights and render breakdowns
- **What If? Analysis**: Per-GameObject GPU cost measurement via automated A/B experiments
- **Material and Shader Analysis**: Detailed shader instruction counts and cost metrics (requires Adreno Offline Compiler)

- **Meta Horizon OS**: V78+
- **Unity engine version**: Unity 2022.3+
- **Platform OS**: Windows 10+ (64-bit)
- Unity ID: [Create or log in to your Unity account](https://id.unity.com/)

1. Navigate to [Meta Quest Runtime Optimizer package](https://assetstore.unity.com/packages/slug/325194) in the Unity Asset Store and click **Add to my assets**.
2. In Unity, navigate to **Window** > **Package Management** > **Package Manager**.
3. Select **My Assets** and add the **Meta Quest Runtime Optimizer** package.

Navigate to **Window** > **Meta** > **Tools** > **Quest Runtime Optimizer** in Unity.

Toggle **Quest Runtime Optimizer Enabled** on. This updates your project to include all necessary configurations, including enabling Development Build and adding the `ENABLE_RUNTIME_OPTIMIZER` scripting define symbol.

Disable this option when submitting your application for release candidate (RC) builds.

Build your APK in **development mode**. The tool requires a development build to communicate with the runtime.

Ensure that your APK’s Executable path looks correct. For example: `com.unity.template.vr/com.unity3d.player.UnityPlayerGameActivity`

Click **Launch** to start your application. The tool will automatically connect to your device.

If the application is already running, click **Connect** to establish the connection.

You should see the “Connected” status message if the tool successfully starts.

Click **Freeze Frame** to freeze the current frame. This pauses the application state and takes a snapshot (screenshot and performance metrics) that serves as the baseline for analysis.

Once successfully frozen, the **Freeze Frame** button updates to **Unpause** and the **Analyze** button becomes enabled.

During freeze, the tool disables the proximity sensor and locks head tracking to ensure consistent measurements. There is a 5-second cooldown between freeze operations.

Once connected, the **Quick Perf** view lets you check CPU and GPU frame times. Click **Refresh** to fetch the latest metrics from the device. The target for VR applications is *14.2ms* (\~70 FPS). Frame times are color-coded:

| Color | Threshold | Meaning | 
|---|---|---|
| **Green** | Below 80% of the target | Good performance | 
| **Yellow** | Between 80–95% of the target | Approaching budget | 
| **Red** | Above 95% of the target | Over budget | 

The tool also provides an automatic suggestion based on your frame times:

| Scenario | Suggestion | 
|---|---|
| **GPU-bound** | Use Bottleneck or What If? Analysis to identify costly objects and shaders | 
| **CPU-bound** | Use Unity Profiler to identify CPU bottlenecks | 
| **Both CPU and GPU bound** | Reduce overall scene complexity | 
| **Good performance** | Consider Bottleneck Analysis for further GPU optimization | 

Use Quick Perf to determine whether your application is CPU-bound or GPU-bound before choosing an analysis mode.

Access the options menu from the toolbar to customize the tool’s behavior:

| Option | Description | 
|---|---|
| **Enable Adreno Offline Compiler** | Enables material and shader cost analysis (requires [Qualcomm AOC](https://qpm.qualcomm.com/#/main/tools/details/Adreno_GPU_Offline_Compile)) | 
| **Show Debug Log** | Enable verbose debug logging to the Unity Console | 
| **Enable PC Testing** | Connect to a locally running application on `localhost` instead of via ADB, for testing without a physical Quest headset | 

The analysis section also has its own options button with a **Use Percentage** toggle to switch between weight (percentage) and absolute count in vertex and texture analysis views.

The Runtime Optimizer offers two analysis modes:

| Mode | Description | 
|---|---|
| **Bottleneck Analysis** | High-level direction: identifies performance categories consuming the most GPU budget (\~25 seconds) | 
| **What If? Analysis** | Detailed and precise: measures the exact GPU cost of individual GameObjects (\~1 minute, varies with object count) | 

This mode captures a GPU trace and Unity scene snapshot, then parses the data to highlight potential bottlenecks and provide improvement suggestions.

Ensure your headset remains active during the analysis. If the device enters sleep mode during capture, the tool will detect the empty frame and prompt you to restart the capture.

Use the dropdown menu and select **Bottleneck analysis**. Then, click **Analyze** to start the analysis.
Once the analysis is complete, click the capture in the **Captured Frames** section to view the data in the **Analysis** section.

The Insights panel provides a summary of captured metrics organized into five performance categories. Each category includes a description of the issue and actionable recommendations:

| Category | Trigger | Recommendation | 
|---|---|---|
| **Texture** | High anisotropic filtering, texture fetch stalls, or excessive textures per fragment | Combine textures using a Texture Atlas, generate mipmaps, use compressed formats | 
| **Fragment** | High fragment instruction count per fragment shaded | Use simpler shaders, reduce overdraw and translucent objects | 
| **Setup** | High draw call count (target: below 300) | Reduce draw call count | 
| **Vertex** | High vertex instruction count, high MSAA level | Reduce vertex count or shader complexity, lower MSAA level | 
| **Vertex Fetch** | High vertex fetch stalls or large average bytes per vertex | Reduce vertex data size, vertex count, or draw call count | 

The Render Breakdown section organizes runtime data by asset type and displays key metrics for the captured frame:

- **Draw Call Count**: Total draw calls in the frame (below 300 is optimal)
- **MSAA Level**: Current multisample anti-aliasing level
- **Triangle Count**: Total triangles rendered (displayed in thousands)
- **Loaded Textures Memory**: Total texture memory usage (in MB)

Lists all meshes sorted by their rendering cost (vertex count \* draw count), in descending order. For each mesh, you can see:

- **Weight or Count**: Percentage of total vertex cost or absolute vertex count (toggle via the options menu)
- **Draw Count**: How many times the mesh is drawn per frame
- **Asset Link**: Click to select the mesh asset in the Unity Project window

Lists all loaded textures sorted by runtime memory size, in descending order. For each texture, the view shows:

- **Asset Link**: Click to select the texture asset in the Unity Project window
- **Weight or Size**: Percentage of total texture memory or size in MB (toggle via the analysis options menu)

Lists detailed material and shader cost data. To access this section, you must enable the **Adreno Offline Compiler** option and download the [Qualcomm Adreno Offline Compiler tool](https://qpm.qualcomm.com/#/main/tools/details/Adreno_GPU_Offline_Compile).

When enabled, the material analysis shows per-material shader statistics:

- **Pixel Shader (PS) instruction count**
- **Vertex Shader (VS) instruction count**

Values are color-coded (green/red) to indicate whether they fall within acceptable performance thresholds.

The “What if?” analysis measures the GPU cost of individual GameObjects with high accuracy. It performs automated A/B experiments — disabling each selected object and measuring the before-and-after GPU frame time — similar to manually disabling objects and rebuilding, but without the rebuild step.
To start the analysis:

1. Select **What if? analysis** from the dropdown menu.
2. Click **Analyze** to open the **Select Game Objects to Test** window.

The window displays all GameObjects currently visible in your camera frustum (not all scene objects). You can:

- **Search** with keywords to filter the list
- **Select All** to select all visible objects (up to 200 maximum)
- Use the hierarchical tree view to browse objects by their scene hierarchy
- View selected objects in the staging area and remove them individually

The What If? analysis supports two modes:

- **Individual mode** (default): Each selected GameObject is disabled one at a time. Results show the per-object GPU cost, allowing you to rank objects by their rendering expense.
- **Group mode**: All selected GameObjects are disabled together. Results show the combined GPU cost savings of removing all selected objects at once.

Once you’ve selected the game objects you want to test, click **Scan Selected GameObjects** to begin the analysis.
If another analysis is still running, the tool shows an **Analysis In Progress** dialog. Wait for the running analysis to finish, then try again.
The results are displayed in the **Analysis** section, sorted by GPU cost in descending order.

Each result shows:

- **GPU Frame Time**: The GPU time attributable to this GameObject (with ± variance)
- **GameObject Link**: Clickable navigation path to select and highlight the object in the Unity Hierarchy

A negative GPU time is expected when a disabled GameObject was occluding something more costly behind it. This means the object was actually saving GPU time by preventing the rendering of more expensive hidden geometry.

The test takes approximately 200ms per GameObject. For large selections, the capture timeout automatically extends to accommodate the longer analysis. Results rank all GameObjects by their GPU cost in descending order.

1. The frame must be frozen first (see [Step 6: Freeze the frame to start the analysis](https://developers.meta.com#step-6-freeze-the-frame-to-start-the-analysis)). The optimizer locks head tracking to guarantee experiment reproducibility.
2. Measures the baseline GPU cost of what’s in view.
3. Iteratively disables selected GameObjects while measuring the before-and-after GPU frame time.
4. Takes measurements over several frames and averages them for accuracy.
5. Ranks all GameObjects by their cost in descending order.

The left panel displays all captured frames with thumbnail previews and lightweight metrics (FPS, CPU/GPU times, CPU-bound or GPU-bound indicator). Click any capture to view its full analysis. While a Bottleneck analysis capture is in progress, a **Capturing...** card appears at the top of the list. You can open the capture after it finishes processing.

You can share captures with teammates or archive them for later analysis:

- **Export**: Click the options button (**⋮**) on a capture and select **Export** to save it as a `.roz` package (a ZIP archive containing the Perfetto trace, screenshots, and analysis JSON)
- **Import**: Click the **Import Capture** button at the top of the Captured Frames panel to load a previously exported `.roz` file

For advanced GPU trace analysis, click the options button (**⋮**) on a capture and select **Open PTrace** to open the raw Perfetto trace in the [Perfetto UI](https://ui.perfetto.dev/).

| Status | Meaning | Solution | 
|---|---|---|
| **Not Connected** | No USB device detected | Ensure your Quest is connected via USB and ADB is configured | 
| **Connected. Invalid OS** | Horizon OS version is below v78 | Update your headset to Horizon OS v78 or later | 
| **App Running. Not Connected** | App is running but TCP connection failed | Click **Connect** to retry; ensure the APK was built with Runtime Optimizer enabled | 
| **Connected. App not launched** | Device connected but app isn’t running | Click **Launch** to start your application | 

The tool monitors for device sleep and will show a dialog if detected. The capture is automatically cancelled and you’ll need to restart. To prevent this:

- Keep the headset on your head or prop it so the proximity sensor is engaged
- The tool automatically disables the proximity sensor during freeze, but this has a 10-minute duration limit

If the Runtime Optimizer window loses focus during an active capture, you’ll see a warning dialog. Keep the tool window focused and visible throughout the analysis to avoid interruptions.

The tool reports the following capture failures in the Unity Console rather than in a dialog. Device sleep, window focus loss, and empty frames also show dialogs, as described in their sections. Look for Console messages that start with `Capture failed [` or `Aborting capture:`.

- **Headset disconnected**: The device disconnected during capture. Reconnect the headset and try again.
- **App connection lost**: The tool lost its connection to the application while the headset stayed connected. Relaunch the application and try again.
- **App crashed**: The Console names the application and points to the device crash log (`adb logcat -b crash`).
- **GPU profiler crash**: A crash in the headset’s GPU profiler layer stopped the application when the capture started GPU profiling. This is a known GPU driver issue, not a bug in your application. Relaunch the application and capture again.
- **App not in the foreground**: The tool stops the capture because the screenshot and trace would not show the application you are analyzing.
- **Relaunch during a capture**: Clicking **Launch** or **Relaunch** cancels the capture in progress, and the Console shows a warning.

After you start the application with **Launch**, the tool monitors the headset’s GPU profiling service. If that service restarts, the Unity Console warns that Bottleneck analysis will report 0.00 ms GPU time and What if? analysis will return no results. Click **Relaunch** to restart the application under the new service. Clicking **Connect** restores the connection but not GPU profiling.

If CPU and GPU frame times drop to near-zero during capture, the tool detects this as a device sleep event and prompts you to restart. Ensure the headset stays awake throughout the analysis.

- Starting GPU profiling for a capture can crash the application because of a known GPU driver issue in the headset’s GPU profiler layer. For recovery steps, see [Capture fails](https://developers.meta.com#capture-fails).
- **OS V78**:
  - Very rare kernel panics after What if? analysis
  - Dynamic objects are not supported and do not show up in What if? analysis or Bottleneck analysis

Support and legal

English (US)

© 2026 Meta
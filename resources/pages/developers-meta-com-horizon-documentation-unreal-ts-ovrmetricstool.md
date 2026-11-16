# Monitor Performance with OVR Metrics Tool | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unreal/ts-ovrmetricstool
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Oct 2, 2026

OVR Metrics Tool is a performance monitoring solution for Meta VR devices. It provides [a wide range of performance metrics](https://developers.meta.com/vr/documentation/unreal/ts-ovrstats/), including frame rate, heat, GPU and CPU throttling, and the number of screen tears and stale frames per second. In addition to built-in system metrics, app developers can define custom metrics to track application-specific performance or debugging information. Metrics can be visualized in real time through the onscreen overlay or automatically recorded in CSV reports for later analysis. OVR Metrics Tool also offers remote device management functionality and is available on the [Meta Horizon Store](https://www.meta.com/experiences/ovr-metrics-tool/2372625889463779/).

Additional information on OVR Metrics Tool can be found in [OVR Metrics Tool - Best Practices for Non-Engineers](https://developers.meta.com/vr/documentation/unreal/ts-ovr-best-practices/).

OVR Metrics Tool is a tool for Meta VR devices that can provide performance information about a running app. Much of this performance information is similar to that provided by `VrApi` Logcat logs. OVR Metrics Tools provides access to that information from an on-device app rather than the command line. See the [Logcat](https://developers.meta.com/vr/documentation/unreal/ts-logcat/) topic for information on using Logcat.

OVR Metrics Tool has two modes. In **Report Mode**, the tool records a performance report about a VR session that can be read after it has concluded. Report data can be easily exported as a CSV with PNG images. In **Performance HUD Mode**, the tool displays a HUD overlay over running apps that provides real-time performance graphs and information. The information displayed on the performance HUD can be customized to preference.

App developers can define and report custom metrics directly from their applications, providing targeted insights for debugging and optimization during development. These metrics can be monitored in real time on the HUD overlay or recorded in CSV files for later analysis. By tracking application-specific performance indicators alongside standard system metrics, developers gain deeper visibility into app behavior, enabling faster identification and resolution of issues.

OVR Metrics Tool has a number of extra GPU statistics that require the profiling tool `ovrgpuprofiler` to be enabled from a connected shell. See the [ovrgpuprofiler](https://developers.meta.com/vr/documentation/unreal/ts-ovrgpuprofiler/) for information on enabling the tool.

See the [OVR Metrics Tool and VrApi Stats Guide](https://developers.meta.com/vr/documentation/unreal/ts-ovrstats/) for information on all of the statistics OVR Metrics Tool can track.

The following sections describe how to install OVR Metrics Tool and use it to capture performance information for an app in **Report Mode** and **Performance HUD Mode**.

Please install the latest version from the [Meta Horizon Store](https://www.meta.com/experiences/ovr-metrics-tool/2372625889463779/). Or search for **ovr metrics tool** and download the app from the App **Store** on the device.

The OVR Metrics Tool app can be launched from the device’s app **Library**. It can also be launched by connecting the device to a computer via ADB and issuing the following command:

adb shell am start omms://app

When OVR Metrics Tool launches on the device, the main screen looks like this:

From the main screen you can enable and configure the features of the tool.

Report mode records performance data from a VR session. Data from the reports can be retrieved from the device or viewed on the device.

To enable report mode, enable the toggle labeled **Record all captured metrics to csv files**. You can also enable report mode by issuing the following ADB command:

adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.ENABLE\_CSV

Once enabled, you must manually select the metrics to be collected on the **Stats** tab or by using one of the preset option buttons:

- **Basic** includes the following metrics:
  - Battery level
  - CPU level
  - GPU level
  - Average FPS
  - Stale Frame Count
  - CPU Utilization
  - GPU Utilization
  - App GPU Time
- **Advanced** includes everything in **Basic** as  well as the following metrics:
  - Foveation level
  - Early Frame count
  - Eye buffer width
  - Eye buffer height
  - Timewarp GPU Time
  - VrShell+Boundary GPU Time
  - Spacewarp FPS
  - Max Consecutive Stale Frames

OVR Metrics Tool provides access to a wide range of performance metrics for HUD display. Users can manually select which metrics to show in the HUD overlay using the Stats tab for real-time text readout, and the Graphs tab to visualize short-term historical trends for those metrics. This allows you to tailor the HUD to display the specific performance data most relevant to your application or analysis needs. Some advanced GPU statistics require enabling the profiling tool `ovrgpuprofiler` from a connected shell before they can be selected. For more information, see [GPU Profiling with ovrgpuprofiler](https://developers.meta.com/vr/documentation/unreal/ts-ovrgpuprofiler/).

These statistics include the following:

- Boundary GPU Time
- CPU Utilization per core (cores 0-5, plus cores 6-7 on Meta Quest 2 and Meta Quest Pro)
- Application VSS, RSS, and Dalvik PSS

`ovrgpuprofiler` metrics
- Average Vertices Per Frame
- Average Fill Percentage per Eye
- Average Instructions per Fragment
- Average Instructions per Vertex
- Average Textures per Fragment
- Percentage Time Shading Fragments
- Percentage Time Shading Vertices
- Vertex Fetch Stall Percentage
- Texture Fetch Stall Percentage
- L1 Texture Miss Percentage
- L2 Texture Miss Percentage
- Texture Sample Percentage Using Nearest Filtering
- Texture Sample Percentage Using Linear Filtering
- Texture Sample Percentage Using Anisotropic Filtering

See [Statistics enabled with ovrgpuprofiler](https://developers.meta.com/vr/documentation/unreal/ts-ovrstats#statistics-enabled-with-ovrgpuprofiler) for more information about these data points.

After choosing metrics, run an app and conduct a session to collect data. Note that data is logged for every app run. After the session, open OVR Metrics Tool, click the drop-down menu in the upper-right corner, and select **View Recorded Sessions**. Select the entry that corresponds to your session to see a series of graphs describing performance. Recorded sessions can be retrieved from `/sdcard/Android/data/com.oculus.ovrmonitormetricsservice/files/CapturedMetrics/` as a CSV file when the device is connected to a computer. [Meta VR Developer Hub](https://developers.meta.com/vr/documentation/unreal/ts-mqdh-file-manager) can be used for retrieving metrics from the **File Manager**.

Performance HUD mode displays a real-time graph showing selected metrics over running apps. To enable performance HUD mode, from the main screen, turn on **Enable Persistent Overlay**. You can also enable the HUD by issuing the ADB command:

adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.ENABLE\_OVERLAY

The HUD resembles the following depending on the chosen metrics:

By default, no metrics are displayed on the HUD, although the FPS graph is present. You must manually select the displayed metrics on the **Stats** tab or by using the **Basic** and **Advanced** buttons described in the **Report Mode** section. The **Graphs** tab is used to configure which graphs will be shown on the overlay.

Below the buttons are more options for the overlay. Stats and metrics on the graph can be toggled (enabled by default).

The **Screenshot on Dropped Frames** option is at the bottom of the main screen. Enabling this option takes a screenshot if the number of dropped frames exceeds the set limit for the specified time.

Many of the HUD’s options can be controlled from the command line:

This command can take the following optional parameters:

--eb headlocked (true|false) // whether the overlay should be locked to view
--ef pitch (-90.0 to 90.0) // the pitch of the overlay (negative is down)
--ef yaw (-180.0 to 180.0) // the yaw of the overlay (negative is left)
--ef scale (1.0 to 3.0) // the scale of the overlay
--ef distance (0.1 to 2.0) // the distance the overlay appears (headlocked only)

On Meta VR Glasses, the default overlay pitch is 5 degrees instead of 20 degrees.

adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.DISABLE\_OVERLAY

adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.ENABLE\_GRAPH // enable all graphs
adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.ENABLE\_STATS // enable all stats
adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.DISABLE\_GRAPH // disable all graphs
adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.DISABLE\_STATS // disable all stats

adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.ENABLE\_GRAPH --es stat \<stat> // add graph for \<stat> to overlay
adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.ENABLE\_STAT --es stat \<stat> // add \<stat> to overlay
adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.DISABLE\_GRAPH --es stat \<stat> // disable graph for \<stat>
adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.DISABLE\_STAT --es stat \<stat> // remove \<stat> from overlay

Valid values for `<stat>` are listed below. The statistics they represent are described in the [OVR Metrics Tool and VrApi Stats Guide](https://developers.meta.com/vr/documentation/unreal/ts-ovrstats/).

"available\_memory\_MB",
"app\_pss\_MB",
"battery\_level\_percentage",
"battery\_temperature\_celcius",
"battery\_current\_now\_milliamps",
"power\_current",
"power\_level\_state",
"power\_voltage",
"power\_wattage",
"cpu\_level",
"gpu\_level",
"cpu\_frequency\_MHz",
"gpu\_frequency\_MHz",
"mem\_frequency\_MHz",
"minimum\_vsyncs",
"extra\_latency\_mode",
"average\_frame\_rate",
"display\_refresh\_rate",
"average\_prediction\_microseconds",
"screen\_tear\_count",
"early\_frame\_count",
"stale\_frame\_count",
"maximum\_rotational\_speed\_degrees\_per\_second",
"foveation\_level",
"eye\_buffer\_width",
"eye\_buffer\_height",
"app\_gpu\_time\_microseconds",
"timewarp\_gpu\_time\_microseconds",
"guardian\_gpu\_time\_microseconds",
"cpu\_utilization\_percentage",
"cpu\_utilization\_percentage\_core0",
"cpu\_utilization\_percentage\_core1",
"cpu\_utilization\_percentage\_core2",
"cpu\_utilization\_percentage\_core3",
"cpu\_utilization\_percentage\_core4",
"cpu\_utilization\_percentage\_core5",
"cpu\_utilization\_percentage\_core6",
"cpu\_utilization\_percentage\_core7",
"gpu\_utilization\_percentage",
"spacewarp\_motion\_vector\_type",
"spacewarped\_frames\_per\_second",
"app\_vss\_MB",
"app\_rss\_MB",
"app\_dalvik\_pss\_MB",
"app\_private\_dirty\_MB",
"app\_private\_clean\_MB",
"app\_uss\_MB",
"stale\_frames\_consecutive",
"avg\_vertices\_per\_frame",
"avg\_fill\_percentage",
"avg\_inst\_per\_frag",
"avg\_inst\_per\_vert",
"avg\_textures\_per\_frag",
"percent\_time\_shading\_frags",
"percent\_time\_shading\_verts",
"percent\_time\_compute",
"percent\_vertex\_fetch\_stall",
"percent\_texture\_fetch\_stall",
"percent\_texture\_l1\_miss",
"percent\_texture\_l2\_miss",
"percent\_texture\_nearest\_filtered",
"percent\_texture\_linear\_filtered",
"percent\_texture\_anisotropic\_filtered",
"vrshell\_average\_frame\_rate",
"vrshell\_gpu\_time\_microseconds",
"vrshell\_and\_guardian\_gpu\_time\_microseconds"

adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.ENABLE\_CSV // records all metrics to CSV files in /sdcard/Android/data/com.oculus.ovrmonitormetricsservice/files/CapturedMetrics/
adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.DISABLE\_CSV // disables writing metrics to disk
adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.ENABLE\_DROPPED\_FRAME\_SCREENSHOT --ei count \<count> --ei time \<time> // enables functionality that will take a screenshot if \<count> frames are missed within a window of \<time>
adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.DISABLE\_DROPPED\_FRAME\_SCREENSHOT // disables automatic screenshot functionality
adb shell am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.LOG\_STATE // prints a json blob to logcat with the current configuration state of OVR Metrics Tool, useful for automated tooling

Support and legal

English (US)

© 2026 Meta
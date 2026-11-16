# Get Started with Unreal Insights for UE5 | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unreal/ts-unreal-insights-ue5
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Apr 17, 2026

Unreal Insights is a profiling and analysis tool that allows you to quickly find bottlenecks, performance spikes, threading patterns, and more. The goal of this guide is to help walk you through the setup process, which can otherwise be a bit tricky over a remote connection.

- Unreal Engine version 5.0+
- Tracing enabled in built development app (on by default)
- Unreal Insights executable built or downloaded (`<CloneDir>\Engine\Binaries\Win64\UnrealInsights.exe` and **Solution ‘UE5’ > Programs > UnrealInsights** in Solution Explorer)

1. Install the development app and verify the existence of `/sdcard/UnrealGame/<ProjectName>`. You might need to launch the game for the first time for the binary to create its associated Unreal Engine project directory.
2. Instruct adb to pass through TCP connections made on the device over USB (Unreal Insights listens on TCP port 1980):
  - `adb reverse tcp:1980 tcp:1980`
3. Create a`UECommandLine.txt` file to do what you want:
  - Fill it in with the following template:
        ../../../\<ProjectName>/\<UProjectName>.uproject /Game/Maps/\<MapName> -trace=log,counters,cpu,frame,bookmark,file,loadtime,gpu,rhicommands,rendercommands,object -statnamedevents -tracehost=127.0.0.1 -tracefile=/sdcard/UnrealGame/\<ProjectName>/MostRecentTraceCapture.utrace
  - Replace `<ProjectName>`, `<UProjectName>`, and `<MapName>` with the appropriate values for your project. See below the following image for an explanation of directories and arguments.
4. Open a command prompt and navigate to the folder containing`UECommandLine.txt` and copy the file to your project’s root directory on device.
  - `adb push UECommandLine.txt /sdcard/Android/data/<PackageName>/files/UnrealGame/<ProjectName>`
    - Replace `<ProjectName>` with the name of your project.
    - Replace `<PackageName>` with the package name of your project. (For example, `com.YourCompany.YourProject`)
5. Open `UnrealInsights.exe` and select the **Auto-start analysis for LIVE trace sessions** option, if desired.
6. Using your headset, run the map. You should see the trace being filled out in the Unreal Insights window.

Notes on each directory/flag shown above:

- `<ProjectName>` - The name of the Unreal Engine project. This will match the entry in `/sdcard/UnrealGame/<ProjectName>`.
- `<UProjectName>` - The UProjectName will match the output binary (dictated by the engine), so you can just use the APK name or find the `.uproject` file in your game’s directory.
- `<MapName>` - This is optional, but it allows you to customize launch arguments on a per-map basis. If you know the map name, you can put it here.**Note**: If you have a benchmarking scene that you are using, you can set up tracing for only a single map so that the tracing overhead doesn’t affect profiling on other maps. This can help you keep the launch argument file in the same location without having to remove or rename it between play types.
- `-trace` - Enable defining channels to tap into for the trace. Here are some combinations that we use when profiling:
  - Most Detail/Most Overhead - `log,counters,cpu,frame,bookmark,file,loadtime,gpu,rhicommands,rendercommands,object`
  - Decent Detail/Minimal Overhead - `counters,cpu,frame,bookmark,gpu`
- `-statnamedevents` - When combined with the `-trace=cpu` option, this will activate even more CPU timing events.
- `-tracehost` - IP address of the host machine with the running Unreal Insights instance that you want to connect to (127.0.0.1).
- `-tracefile` - Used to define a local path on the device where you want to dump the `.trace` file to as an alternative to live analysis. You can keep it in a static location and overwrite it each time to keep a most recent trace.

As an example, consider a project named `QuestUE5Demo`, based on the VR Template, and set the default map to `VRTemplateMap`. The uproject is the same as the project, `QuestUE5Demo`. The full package name is `com.YourCompany.QuestUE5Demo`.

../../../QuestUE5Demo/QuestUE5Demo.uproject /Game/Maps/VRTemplateMap -trace=log,counters,cpu,frame,bookmark,file,loadtime,gpu,rhicommands,rendercommands,object -statnamedevents -tracehost=127.0.0.1 -tracefile=/sdcard/UnrealGame/QuestUE5Demo/MostRecentTraceCapture.utrace

1. Push the updated`UECommandLine.txt` file to your project root directory on device.
  - `adb push UECommandLine.txt /sdcard/Android/data/com.YourCompany.QuestUE5Demo/files/UnrealGame/QuestUE5Demo`
2. Launch Unreal Insights and check the **Auto-start analysis for LIVE trace sessions** checkbox if you want.
3. Launch your game. The live trace will start on launch within the Unreal Insights window.

The default `PushCommandLine.bat` file may push to the wrong location. You can edit it to push to where you want if you don’t want to type the `adb push` command every time you make a change. This is helpful if you want to frequently change your text file. You can edit yours to automatically push and reload the app for quick iteration. The script just includes:

%ANDROID\_HOME%\platform-tools\adb.exe push UECommandLine.txt /mnt/sdcard/UnrealGame/QuestUE5Demo/UECommandLine.txt
%ANDROID\_HOME%\platform-tools\adb.exe shell am force-stop com.YourCompany.QuestUE5Demo
%ANDROID\_HOME%\platform-tools\adb.exe shell am start -n com.YourCompany.QuestUE5Demo/com.epicgames.unreal.GameActivity

- `-NoSound` - Disables audio.
- `-NoTextureStreaming` - Isolates hitches.
- `-NoVerifyGC` - Avoids hitching in development builds.
- `-Benchmark` - Runs game at fixed-step in order to process each frame without skipping.
- `-ResX/ResY` - Sets the x and y resolution for the game to render at. Can force bottleneck to CPU this way.
- `-Dumpmovie` - Dumps rendered frames to files using the current resolution of the game. Useful to share a benchmark video for context.

Support and legal

English (US)

© 2026 Meta
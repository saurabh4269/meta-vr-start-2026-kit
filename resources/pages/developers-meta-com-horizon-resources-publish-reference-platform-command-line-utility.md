# OVR Platform Utility command line tool | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/resources/publish-reference-platform-command-line-utility/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Distribute and grow

Updated: Jul 20, 2026

The OVR Platform Utility, also called the Oculus Platform Utility, Platform Command Line Utility, or `ovr-platform-util`, is a command-line tool for uploading and downloading builds and managing release channels. Use it to automate build uploads, downloads, and release channel management, manage Rift PC builds and Meta Quest APK builds, upload debug symbols, and manage add-on content such as DLC and IAP.

The utility runs on Windows, macOS, and Linux.

1. Select the appropriate download for your operating system:
2. Copy the utility to the directory of your choice.
3. On macOS and Linux make the binary executable: cd /path/to/utility chmod +x ./ovr-platform-util ./ovr-platform-util help

On Windows the binary is named `ovr-platform-util.exe`. On macOS and Linux it is `ovr-platform-util`.

Most commands require an app ID and either app credentials or a user token. Some download commands also need a build ID.

1. Open the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/).
2. Select your app.
3. Under **Development**, choose **API**. Copy the value under **App ID**, or **App Credentials**. Treat your App Credentials like a password.

1. Open the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/).
2. Select **Account** from the left navigation, then select **Account settings**.
3. Under **Get Oculus platform utility token**, Select your platform if needed, then choose **Generate token**. Copy the token. Treat it like a password.

After a successful upload the CLI prints the build ID. You can also find it in the Developer Dashboard:

1. Open the [Meta Horizon Developer Dashboard](https://developers.meta.com/vr/manage/).
2. Select your app.
3. Under **Distribution**, choose **Builds**. Then select the relevant build.
4. Open the **Details** tab. Copy **Build ID**.

`ovr-platform-util` is embedded in the Unity and Unreal engine integrations. For engine-specific upload UI see:
Use the Oculus Platform Utility directly in automation pipelines, or to access features not exposed in the editor UI.

| Task | Command | 
|---|---|
| Show help |  | 
| Show version |  | 
| Self update |  | 
| List PCVR Redistributables |  | 
| Get a user access token |  | 
| List release channels for an app |  | 

| Task | Command | 
|---|---|
| Upload Rift build |  | 
| Download Rift build |  | 
| Clone existing Rift build |  | 
| Copy build between channels |  | 
| Upload add-on files such as DLC or IAP |  | 
| Download asset files |  | 

| Task | Command | 
|---|---|
| Upload Quest build |  | 
| Download Quest build |  | 
| Upload debug symbols |  | 
| Copy build between channels |  | 
| Upload add-on |  | 
| Download asset files |  | 

ovr-platform-util help

Lists all top-level commands and global options.

ovr-platform-util version

Example output:

Oculus Platform Command Line Utility - 1.117.0.000001 (Built on Tue Oct 28 2025)

ovr-platform-util self-update

Checking for the latest version
Updating utility from version 1.103.0.000001 to 1.117.0.000001
100% \[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\]
Creating .ovr-platform-util.exe
Spawned new instance of the tool to perform the update

Logs in with your Meta account and prints a user access token. Use the token with other commands that accept `--token`. If you omit `--email` or `--password`, or if two-factor authentication is required, the tool prompts you interactively.

ovr-platform-util get-access-token \[--email \<email>\] \[--password \<password>\]

| Flag | Description | 
|---|---|
| `-u <email>` `--email <email>` | Optional. The email address of the account to log in with. If not provided, the tool prompts interactively. | 
| `-p <password>` `--password <password>` | Optional. The password for the account. If not provided, the tool prompts interactively. | 

ovr-platform-util get-access-token --email user@example.com --password example

Your access token is: FRLabcdefghijklmnopqrstuvwxyz1234567890

Lists all release channels for an app, including the channel name, channel ID, and latest build version.

ovr-platform-util get-release-channel-data --app-id \<ID> \[--token \<token>\]

| Flag | Description | 
|---|---|
| `-a <ID>` `--app-id <ID>` | Required. Specifies the ID of your app. Obtained from the API tab of your app in the Meta Horizon Developer Dashboard. | 
| `-t <token>` `--token <token>` | Optional.  A user token obtained from the Developer Dashboard. | 

ovr-platform-util get-release-channel-data --app-id 10001234 --token 1234abcd

Channel Name         | Channel ID          | Version Code | Version Name
-------------------------------------------------------------------------
 LIVE                 | 12345678901234567   | v100         | 1.0.0
 rc                   | 12345678901234568   | v101         | 1.0.1
 beta                 | 12345678901234569   | v99          | 0.9.9

Uploads a Rift application to a release channel.

```
ovr-platform-util upload-rift-build \
  -a <AppID> --app-secret <AppSecret> --token <UserToken> \
  -d <BuildPath> -l <LaunchFile> \
  -c <ReleaseChannel> -v <Version> -n <Notes> \
  [--assets-dir <assetsDir>] [--asset-files-config <config.json>] \
  [--language-packs-dir <path>] \
  [-p <Arguments>] [-L <2DLaunchFile>] [-P <2DArguments>] \
  [-r <RedistID>,...] [-f {true|false}] \
  [-g <OFF|TWINSTICK|RIGHT_D_PAD|LEFT_D_PAD>] \
  [--clean] [--draft] [--inherit-asset-files] [--exclude-addons] \
  [--config <json>] [--help] [--disable-progress-bar]
```
| Flag | Description | 
|---|---|
| `-d <buildPath>` `--build-dir <buildPath>` | Required. Specifies the full path to the directory containing your build files. | 
| `-a <ID>` `--app-id <ID>` | Required. Specifies the ID of your app. Obtained from the API tab of your app in the Meta Horizon Developer Dashboard. | 
| `-s <app-secret>` `--app-secret <app-secret>` | Required. Specifies the app secret. Obtained from the API tab of your app in the Meta Horizon Developer Dashboard. | 
| `-t <token>` `--token <token>` | Either app secret or user token required.  A user token obtained from the Developer Dashboard. | 
| `-c <releaseChannel>` `--channel <ReleaseChannel>` | Required. Specifies the release channel for uploading the build. Use **store** for the "Production (AppLab)" or "Production (Store)" channels. Release channel names are not case-sensitive. | 
| `-v <version-number>` `--version <version-number>` | Required. Specifies the version number shown to users. | 
| `-l <launchFile>` `--launch-file <launchFile>` | Required. Specifies the relative path from the the build directory to the executable that launches your app. | 
| `-n <text>` `--notes <text>` | Optional. Specifies the release note text shown to users. Enclose the text in quotation marks. Encodes double quotes as \". Encode newlines as \n. | 
| `-p <arguments>` `--launch-params <arguments>` | Optional. Specifies any arguments passed to the launcher. | 
| `--assets-dir <dirPath>` | Optional Specifies the path to the directory with DLCs for this build. | 
| `--asset-files-config <filePath>` | Optional. Specifies the path to the file that configures required assets or associates DLC assets with in-app purchases. | 
| `--language-packs-dir <file-path>` | Optional. The path to the directory that contains language packs. | 
| `-L <2DLaunchFile>` `--launch-file-2d <2DLaunchFile>` | Optional. Specifies the relative path from the build directory to the executable that launches your app in 2D mode. | 
| `-P <2DArguments>` `--launch-params-2d <2DArguments>` | Optional. Specifies any arguments passed to the launcher in 2D mode. | 
| `-r <redistID>,<redistID2>...` `--redistributables <redistID>,<redistID2>....` | Optional. Specifies one or more redistributable IDs. Enclose the IDs with quotation marks. Separate multiple redistributable IDs with commas. Example - “RedistID1,RedistID2”. See the [Redistributable section](https://developers.meta.com#redists) for a complete list of redistributables and their IDs | 
| `-f {true/false}` `--firewall-exceptions {true/false}` | Optional. Specifies if a Windows Firewall exception is required. True or False. Default is false. | 
| `-g <option>` `--gamepad-emulation <option>` | Optional. Allow for gamepad emulation via Touch (Options as “OFF”, “TWINSTICK”, “RIGHT\_D\_PAD”, and “LEFT\_D\_PAD”). | 
| `--help` | Optional. Show help for the command | 
| `--draft` | Optional. Uploads as a draft which can be later published on the Developer Dashboard. | 
| `--clean` | Optional. Skips the caching layer and performs a fresh upload. Use this if you want to force the tool to start over and recompute the checksums of an interrupted upload session instead of continuing where it left off. | 
| `--config` | Optional. Provides the JSON file with configuration parameters | 
| `--inherit-asset-files` | Optional. A boolean that indicates whether to inherit asset files from the previous build. The default is false. | 
| `--exclude-addons` | Optional. A boolean that indicates whether to exclude the add-ons associated with this app. The default is false. | 
| `--disable-progress-bar` | Optional. A boolean that indicates whether to disable progress bar. | 

These examples use a fictitious app “Rabbit Hole” on Windows.

Common values:

- App ID: `10001234`
- Token: `1234abcd`
- Build directory: `C:\Rabbit Hole`
- Launch file: `bin\badrabbits.exe`
- Version: `1.1`
- Channel: `rc`
- Notes: `Fixes the rabbit spawn bug.`

ovr-platform-util upload-rift-build --app-id 10001234 --token 1234abcd \
  -d "C:\Rabbit Hole" -l "bin\badrabbits.exe" \
  -n "Fixes the rabbit spawn bug." -v 1.1 -c rc

ovr-platform-util upload-rift-build --app-id 10001234 --app-secret 1234abcd \
  -d "C:\Rabbit Hole" -l "bin\badrabbits.exe" \
  -n "Fixes the rabbit spawn bug." -v 1.1 -c rc \
  -r "606493776156948, 910524935693407"

The IDs for the redistributables for .NET Framework 3.5 and Visual C++ 2013 x86 appear in the [Redistributable section](https://developers.meta.com#redists).

ovr-platform-util upload-rift-build --app-id 10001234 --token 1234abcd \
  -d "C:\Rabbit Hole" -l "bin\badrabbits.exe" \
  -n "Fixes the rabbit spawn bug." -v 1.1 -c rc \
  -L badrabbits2d.exe -P "-force2dfix" -f true -w 10

ovr-platform-util upload-rift-build --app-id 10001234 --token 1234abcd \
  -d "C:\Rabbit Hole" -l "bin\badrabbits.exe" \
  -n "Carrots now available as in-app purchases.\nBlue rabbits no longer \"glitch\" and get stuck in terrain.\nSpawn sound spatialization adjusted for realism." \
  -v 1.1 -c rc

ovr-platform-util download-rift-build -b \<BuildID> -d \<Directory> \[-t \<token>\]

| Flag | Description | 
|---|---|
| `-b <buildID>` `--build-id <buildID>` | Required. Specifies the build ID you want to download. You can obtain this from the CLI output after successfully uploading an app build with the command line tool. | 
| `-d <directory>` `--output-dir <directory>` | Required. Specifies the directory you want to download the build to. | 
| `-t <token>` `--token <token>` | Optional. A user token obtained from the Developer Dashboard. | 
| `--help` | Optional. Show help for the command | 
| `-c` `--concurrency` | Optional. An integer indicuating how many segments to download at a time. Default is 10. | 

ovr-platform-util download-rift-build -b 3141592653589793 -d "C:\Rabbit Hole" -t \<token>

Clones an existing Rift build to create a new build. You can optionally modify any of the metadata for the build. The new build will be placed in the release channel specified by the `destination_channel` parameter. The build to be cloned can either be picked from another channel by using the `source_channel` or specified explicitly by using the `build_id` parameter.

ovr-platform-util clone-rift-build \
  --app-id \<AppID> --app-secret \<AppSecret> --token \<UserToken> \
  --source-channel \<Channel> --destination-channel \<Channel> \
  \[options\]

| Flag | Description | 
|---|---|
| `-a <ID>` `--app-id <ID>` | Required. Specifies the ID of your app. Obtained from the API tab of your app in the Meta Horizon Developer Dashboard. | 
| `-s <app-secret>` `--app-secret <app-secret>` | Either app secret or user token required. Specifies the app secret. Obtained from the API tab of your app in the Meta Horizon Developer Dashboard. | 
| `-t <token>` `--token <token>` | Either app secret or user token required.  A user token obtained from the Developer Dashboard. | 
| `--destination-channel <channel>` | Required. Specifies the release channel to be updated. | 
| `--source-channel <channel>` | Optional. If specified, the build from this channel will be copied to the destination channel. | 
| `-b <buildID>` `--build-id <buildID>` | Optional. Specifies the build ID you want to download. You can obtain this from the CLI output after successfully uploading an app build with the command line tool. | 
| `-v <version-number>` `--version <version-number>` | Required. Specifies the version number shown to users. | 
| `-l <launchFile>` `--launch-file <launchFile>` | Required. Specifies the relative path from the the build directory to the executable that launches your app. | 
| `-n <text>` `--notes <text>` | Optional. Specifies the release note text shown to users. Enclose the text in quotation marks. Encodes double quotes as \". Encode newlines as \n. | 
| `-p <arguments>` `--launch-params <arguments>` | Optional. Specifies any arguments passed to the launcher. | 
| `-L <2DLaunchFile>` `--launch-file-2d <2DLaunchFile>` | Optional. Specifies the relative path from the build directory to the executable that launches your app in 2D mode. | 
| `-P <2DArguments>` `--launch-params-2d <2DArguments>` | Optional. Specifies any arguments passed to the launcher in 2D mode. | 
| `-r <redistID>,<redistID2>...` `--redistributables <redistID>,<redistID2>....` | Optional. Specifies one or more redistributable IDs. Enclose the IDs with quotation marks. Separate multiple redistributable IDs with commas. Example - “RedistID1,RedistID2”. See the [Redistributable section](https://developers.meta.com#redists) for a complete list of redistributables and their IDs | 
| `-f {true/false}` `--firewall-exceptions {true/false}` | Optional. Specifies if a Windows Firewall exception is required. True or False. Default is false. | 
| `-w {"7SP1"/8.1/10}` `--windows-min-version {"7SP1"/8.1/10}` | Optional. Specifies the minimum required Windows version. The versions that can be specified are “7SP1”, 8.1, 10. The default is “7SP1”. | 
| `-g <option>` `--gamepad-emulation <option>` | Optional. Allow for gamepad emulation via Touch (Options as “OFF”, “TWINSTICK”, “RIGHT\_D\_PAD”, and “LEFT\_D\_PAD”). | 

ovr-platform-util clone-rift-build --app-id 10001234 --app-secret 1234abdc \
  --source-channel alpha --destination-channel beta \
  --launch-params "server=beta"

Use these IDs with `-r` or `--redistributables` on Rift upload and clone commands. You can also generate these IDs using the `list-redists` command.

| Name | Redistributable ID | 
|---|---|
| .NET Framework 3.5 | 606493776156948 | 
| .NET Framework 4.0 | 133610290311340 | 
| .NET Framework 4.5.1 | 1617306711884127 | 
| .NET Framework 4.7.1 | 1667821599930345 | 
| DirectX (June 2010) | 822786567843179 | 
| OpenAL 1.1 | 1147517301974655 | 
| Visual C++ 2005 | 1604897159783747 | 
| Visual C++ 2008 | 118440348500045 | 
| Visual C++ 2010 | 532320330249657 | 
| Visual C++ 2010 x86 | 1008652072555515 | 
| Visual C++ 2012 | 1683508698536289 | 
| Visual C++ 2012 x86 | 1002692246447245 | 
| Visual C++ 2013 | 1675031999409058 | 
| Visual C++ 2013 x86 | 910524935693407 | 
| Visual C++ 2015 Update 3 | 1183534128364060 | 
| Visual C++ 2015 x86 Update 3 | 1113033105419344 | 
| Visual C++ 2017 | 1315322525257173 | 
| Visual C++ 2017 x86 | 1064693870299984 | 
| Visual C++ 2019 | 2657209094360789 | 
| Visual C++ 2019 x86 | 2556834837738356 | 
| Vulkan Runtime 1.0.65.1 | 1824471960899274 | 
| Vulkan Runtime 1.1.73.0 | 1941020095932382 | 

Uploads an APK,  with optional OBB, assets, and debug symbols to a Quest release channel. If an intended age group is not specified, the upload will go into “draft” status. For more information, see [Age Group Self-Certification and Youth Requirements](https://developers.meta.com/vr/resources/age-groups/).

```
ovr-platform-util upload-quest-build \
  --age-group {TEENS_AND_ADULTS|MIXED_AGES|CHILDREN} \
  --app-id <ID> --app-secret <secret> --token <token> \
  --apk <path/to.apk> \
  [--obb <path/to.obb>] \
  --channel <ReleaseChannel> \
  [--notes <ReleaseNotes>] \
  [--assets-dir <path>] [--asset-files-config <config.json>] \
  [--language-packs-dir <path>] \
  [--debug-symbols-dir <DirPath> --debug-symbols-pattern <Pattern>] \
  [--draft] [--inherit-asset-files] [--exclude-addons] \
  [--help] [--disable-progress-bar]
```
| Flag | Description | 
|---|---|
| `--age-group` | Required. (If not specified, the upload will go into “draft” status.) Age group of the build. This can be TEENS\_AND\_ADULTS, MIXED\_AGES, or CHILDREN. For more information, see [Age Group Self-Certification and Youth Requirements](https://developers.meta.com/vr/resources/age-groups/). | 
| `-a <ID>` `--app-id <ID>` | Required. Specifies the ID of your app. Obtained from the API tab of your app in the Meta Horizon Developer Dashboard. | 
| `-s <app-secret>` `--app-secret <app-secret>` | Either app secret or user token required. Specifies the app secret. Obtained from the API tab of your app in the Meta Horizon Developer Dashboard. | 
| `-t <token>` `--token <token>` | Either app secret or user token required.  A user token obtained from the Developer Dashboard. | 
| `--apk <filePath>` | Required. Specifies the path to the APK file to upload. | 
| `--assets-dir <dirPath>` | Optional Specifies the path to the directory with DLCs for this build. | 
| `--asset-files-config <filePath>` | Optional. Specifies the path to the file that configures required assets or associates DLC assets with in-app purchases. | 
| `--obb <filePath>` | Optional. Specifies the path to the Expansion file (OBB) to upload. | 
| `-c <releaseChannel>` `--channel <ReleaseChannel>` | Required. Specifies the release channel for uploading the build. Use **store** for the "Production (AppLab)" or "Production (Store)" channels. Release channel names are not case-sensitive. | 
| `-n <text>` `--notes <text>` | Optional. Specifies the release note text shown to users. Enclose the text in quotation marks. Encodes double quotes as \". Encode newlines as \n. | 
| `--language-packs-dir <file-path>` | Optional. The path to the directory that contains language packs. | 
| `--debug-symbols-dir <dirPath>` | Optional. The path to the directory that contains debug symbol files. | 
| `--debug-symbols-pattern <filenamePattern>` | Optional. A pattern sequence that can match the filenames of all the debug symbol files. An asterisk may be used to indicate a wildcard, for example, \*.sym.so. | 
| `--help` | Optional. Show help for the command | 
| `--draft` | Optional. Uploads as a draft which can be later published on the Developer Dashboard. | 
| `--config` | Optional. Provides the JSON file with configuration parameters | 
| `--inherit-asset-files` | Optional. A boolean that indicates whether to inherit asset files from the previous build. The default is false. | 
| `--exclude-addons` | Optional. A boolean that indicates whether to exclude the add-ons associated with this app. The default is false. | 
| `--disable-progress-bar` | Optional. A boolean that indicates whether to disable progress bar. | 

Values used:

- Age group: MIXED\_AGES
- App ID: 10001234
- Token: 1234abcd
- APK: `C:\RabbitHole.apk`

ovr-platform-util upload-quest-build --age-group MIXED\_AGES \
  --app-id 10001234 --token 1234abcd \
  --apk C:\RabbitHole.apk --channel alpha \
  --notes "Fixes the rabbit spawn bug."

Downloads an APK and its OBB (if present) for a Quest build. Use `--list` to preview the files without downloading.

ovr-platform-util download-quest-build -b \<BuildID> -d \<Directory> -t \<token> \[--list\]

| Flag | Description | 
|---|---|
| `-b <buildID>` `--build-id <buildID>` | Required. Specifies the build ID you want to download. You can obtain this from the CLI output after successfully uploading an app build with the command line tool. | 
| `-d <directory>` `--output-dir <directory>` | Required unless `--list` is set. Specifies the directory you want to download the build to. | 
| `-t <token>` `--token <token>` | Required. A user token obtained from the Developer Dashboard. | 
| `-l` `--list` | Optional. Lists the file(s) that would be downloaded (name, size, ID) instead of downloading them. When set, `--output-dir` is not required. | 

ovr-platform-util download-quest-build -b 1000012345678 -d "C:\Rabbit Hole" -t 1234abcd

Starting download (APK): 1000012345678
File name: app.apk
File size: 50.8MB
Downloading...
100% \[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\]
Finished downloading APK: 0m 3s.
App contains corresponding OBB file: 1000012345679.
Starting download (OBB): 1000012345679
File name: main.1.com.sampleApp.extraData.obb
File size: 615.6MB
Downloading...
100%
100% \[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\]
Finished downloading OBB: 0m 30s.
Total time: 0m 33s.

ovr-platform-util download-quest-build -b 1000012345678 --list -t 1234abcd

The following file(s) would be downloaded:
  app.apk  50.8MB  \[APK\] 1000012345678
App contains corresponding OBB file: 1000012345679.
  main.1.com.sampleApp.extraData.obb  615.6MB  \[OBB\] 1000012345679

Attaches debug symbols to a Quest build already uploaded to a channel. Helps with crash symbolication in Developer Dashboard.

ovr-platform-util upload-debug-symbols \
  --parent \<BuildID> \
  --app-id \<ID> --app-secret \<AppSecret> --token \<UserToken> \
  --debug-symbols-dir \<DirPath> \
  --debug-symbols-pattern \<FilenamePattern>

| Flag | Description | 
|---|---|
| `-p <buildID>` `--parent <buildID>` | Required. Specifies the build ID of the binary to attach debug symbol files to. You can obtain the build ID from the CLI output after successfully uploading an app build. Or, you can obtain it from the Details page in Developer Center by clicking the version number of an uploaded binary. | 
| `-a <ID>` `--app-id <ID>` | Required. Specifies the ID of your app. Obtained from the API tab of your app in the Meta Horizon Developer Dashboard. | 
| `-s <app-secret>` `--app-secret <app-secret>` | Either app secret or user token required. Specifies the app secret. Obtained from the API tab of your app in the Meta Horizon Developer Dashboard. | 
| `-t <token>` `--token <token>` | Either app secret or user token required.  A user token obtained from the Developer Dashboard. | 
| `--debug-symbols-dir <dirPath>` | Required. The path to the directory that contains debug symbol files. | 
| `--debug-symbols-pattern <filenamePattern>` | Required. A pattern sequence that can match the filenames of all the debug symbol files. An asterisk may be used to indicate a wildcard, for example, \*.sym.so. | 
| `--help` | Optional. Show help for the command | 
| `--disable-progress-bar` | Optional. A boolean that indicates whether to disable progress bar. | 

Attach `*.so` files in `/myProject/obj/local/armeabi-v7a/` to build `1234567890123456`:

ovr-platform-util upload-debug-symbols --parent 1234567890123456 \
  -a 1234567890123456 -t \<user-token> \
  --debug-symbols-dir /myProject/obj/local/armeabi-v7a/ \
  --debug-symbols-pattern "\*.so"

Moves a build between release channels or promotes a specific build ID. Works for both Rift and Quest.

```
ovr-platform-util set-release-channel-build \
  --age-group {TEENS_AND_ADULTS|MIXED_AGES|CHILDREN} \
  --app-id <AppID> --app-secret <AppSecret> --token <UserToken> \
  --source-channel <Channel> --destination-channel <Channel> \
  [--build-id <BuildID>]
```
| Flag | Description | 
|---|---|
| `--age-group` | Required. Age group of the build. This can be TEENS\_AND\_ADULTS, MIXED\_AGES, or CHILDREN. For more information, see [Age Group Self-Certification and Youth Requirements](https://developers.meta.com/vr/resources/age-groups/). | 
| `-d <buildPath>` `--build-dir <buildPath>` | Required. Specifies the full path to the directory containing your build files. | 
| `-s <app-secret>` `--app-secret <app-secret>` | Either app secret or user token required. Specifies the app secret. Obtained from the API tab of your app in the Meta Horizon Developer Dashboard. | 
| `-t <token>` `--token <token>` | Either app secret or user token required.  A user token obtained from the Developer Dashboard. | 
| `--destination-channel <channel>` | Required. Specifies the release channel to be updated. | 
| `-b <buildID>` `--build-id <buildID>` | Optional. Specifies the build ID you want to download. You can obtain this from the CLI output after successfully uploading an app build with the command line tool. | 
| `--source-channel <channel>` | Optional. If specified, the build from this channel will be copied to the destination channel. | 

Promotes the current build in the Beta channel to the RC channel:

ovr-platform-util set-release-channel-build --age-group TEENS\_AND\_ADULTS \
  --app-id 10001234 --app-secret 1234abcd \
  --source-channel beta --destination-channel rc

Upload downloadable content or in-app purchase asset files and associate them with your app. For more information, see [Add-ons](https://developers.meta.com/vr/resources/add-ons/).

ovr-platform-util upload-add-on \
  --app-id \<AppID> --app-secret \<AppSecret> --token \<UserToken> \
  --file \<file> --sku \<sku> --min-version-code \<min-version> \
  \[--metadata \<json>\] \[--help\] \[--disable-progress-bar\]

| Flag | Description | 
|---|---|
| `-a <ID>` `--app-id <ID>` | Required. Specifies the ID of your app. Obtained from the API tab of your app in the Meta Horizon Developer Dashboard. | 
| `-s <app-secret>` `--app-secret <app-secret>` | Either app secret or user token required. Specifies the app secret. Obtained from the API tab of your app in the Meta Horizon Developer Dashboard. | 
| `-t <token>` `--token <token>` | Either app secret or user token required.  A user token obtained from the Developer Dashboard. | 
| `-f <file-path>` `--file <file-path>` | Required. The path to the asset file to upload. | 
| `-p <SKU>` `--sku <SKU>` | Required. The SKU associated with the add-on item. | 
| `-v <version-code>` `--min-version-code <version-code>` | Required. The minimum build number of the app to associate this add-on item with. | 
| `--metadata` | Optional. Arbitrary metadata for developer to attach to the asset | 
| `--help` | Optional. Show help for the command | 
| `--disable-progress-bar` | Optional. A boolean that indicates whether to disable progress bar. | 

This example command uploads an add-on with the SKU “carrot” for app 10001234:

ovr-platform-util upload-add-on --app-id 10001234 --app-secret 1234abcd \
  --file C:\rabbit-hole\dlc\ --sku carrot --min-version-code 1

Adjust `--min-version-code` to match your app’s version code scheme.

Downloads asset files (such as DLC or asset bundles) associated with your app. You can download a single asset file by its ID, or all asset files for a build. Use `--list` to preview the files without downloading. Works for both Quest and Rift builds.

```
ovr-platform-util download-asset-file \
  {--asset-file-id <ID> | --build-id <BuildID>} \
  --output-dir <Directory> --token <token> \
  [--list]
```
Exactly one of `--asset-file-id` or `--build-id` is required.

| Flag | Description | 
|---|---|
| `--asset-file-id <assetFileID>` | Required (unless `--build-id` is set). Specifies the ID of a single asset file to download. | 
| `-b <buildID>` `--build-id <buildID>` | Required (unless `--asset-file-id` is set). Specifies the build ID to download all asset files from. | 
| `-d <directory>` `--output-dir <directory>` | Required unless `--list` is set. Specifies the directory you want to download the build to. | 
| `-t <token>` `--token <token>` | Required. A user token obtained from the Developer Dashboard. | 
| `-l` `--list` | Optional. Lists the file(s) that would be downloaded (name, size, ID) instead of downloading them. When set, `--output-dir` is not required. | 

ovr-platform-util download-asset-file --asset-file-id 1000012345679 \
  -d "C:\Rabbit Hole\assets" -t 1234abcd

ovr-platform-util download-asset-file --build-id 1000012345678 \
  -d "C:\Rabbit Hole\assets" -t 1234abcd

ovr-platform-util download-asset-file --build-id 1000012345678 --list -t 1234abcd

Build 1000012345678 has 3 asset file(s).
  patch.1.com.BensCoolSamples.UnrealOBBSample.obb  426.8MB  \[ASSET\] 1000012345679
  required\_file.txt  18B  \[ASSET\] 1000012345677
  optional\_file.txt  18B  \[ASSET\] 1000012345676

Support and legal

English (US)

© 2026 Meta
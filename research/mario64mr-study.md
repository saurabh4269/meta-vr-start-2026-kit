# Mario 64 MR (lucas-martinic/mario64mr): what we can learn

Prepared 18 Nov 2026, the morning of the deadline. Study only: no code or assets from this repo go into our projects.

## 0. How it was studied
- **Clone:** `reference-winners/mario64mr/`, shallow, at `8b99dce` (17 Nov 2026, "Options: Graphics › Diorama", PR #34). 29 files, 15 MB, most of it the README GIF. Nothing was installed, built or run.
- **Licence:** MIT, but only for the author's own files (`install_mario64mr.py` and `native/`, "the patches' context lines excepted": `LICENSE:3-5`). The sources the tool downloads (n64decomp/sm64, sm64ex, libsm64) keep their own terms. Nintendo owns the game, characters, artwork and names. **Learn only; nothing to reuse.**
- **The Unity project is not public** (issue #35 "Unity source" is open and unanswered). The repo holds only the native C changes, the patcher, the installers and two headless tests. To answer the Unity questions I downloaded the v1.3 release APK into the session scratchpad and read only its file list, `AndroidManifest.xml` (decoded with a small parser), `boot.config`, `ScriptingAssemblies.json`, shader property names and the IL2CPP metadata's identifier strings. Nothing was executed. Findings from the APK are marked **(APK)**: class and field names show what exists, not exactly how it works.
- **Standing:** 192 stars, 28 forks in 11 days; about 1,000 downloads of the Quest APK per release (GitHub API, 18 Nov). It is a fan project, not a competition entry (Nintendo IP would rule it out).

## 1. The stack
| Layer | What | Evidence |
|---|---|---|
| Engine | Unity **6000.3.13f1** (Unity 6.3), IL2CPP, URP, OpenGL ES 3 / Vulkan with fragment density map | APK `META-INF/com.android.games.engine.build_fingerprint`; `boot.config` `xr-vulkan-extension-fragment-density-map-enabled=1` |
| Meta SDKs | Meta XR Core (OVRPlugin **1.201.0**, i.e. SDK v201), **MRUK** (`meta.xr.mrutilitykit`, `libmrutilitykitshared.so`), **Interaction SDK** (`Oculus.Interaction*`, native 0.201.0), Immersive Debugger, EnvironmentDepth building block (included; no sign their own code uses it) | APK `lib/arm64-v8a/`, `ScriptingAssemblies.json` |
| Hands | Unity XR Hands (`Unity.XR.Hands`, `MetaAimHand`) plus their own `HandPinch`, `HandFrame`, `MarioGloves` | APK metadata |
| Manifest | `HAND_TRACKING`, `USE_SCENE`, `USE_ANCHOR_API`, `BOUNDARY_VISIBILITY`; passthrough required; hand tracking **not** required; `handtracking.version V2.0`, `frequency HIGH`; `ossplash.background passthrough-contextual`; `trade_cpu_for_gpu_amount 1`; Horizon OS SDK min 60, target 201; Quest 2, 3, 3S | decoded manifest |
| Game logic | **Not an emulator.** The full game is compiled from the community decompilation via the sm64ex PC port, with the renderer, window, audio and controller back ends replaced by a "Unity bridge" (a shared library Unity calls once per tick and reads display batches, textures, audio and state from) | `native/fullgame/unity_bridge.c:1, 62-64, 134-138, 170-228`; `patch_sm64ex.py:101-118` |
| Title screen | The original "Goddard" Mario-head code built as its own library, with a CPU F3D display-list interpreter and a patch for a **second cursor** so two hands can stretch the face | `native/goddard/shim/gd_api.h:1-3, 109-113`; `native/goddard/patches/two_hands.patch` |
| IP separation | The APK ships no game code or data. The user's machine builds three `.so` files and a resource pack from their own ROM; the app loads them at run time from its private folder (**APK:** `NativeLibraries` with `dlopen`, `RtldNow`, `RtldGlobal`, `MissingDataNotice`) | `README.md:33-40`; `install_mario64mr.py:2-30`; `install_mario64mr.py:645-700` |

## 2. Mixed reality techniques
- **The real room becomes the game's own collision.** Room triangles from Unity (game units, about 600 per metre: `tests/room_carry_test.c:63`) are loaded through the game's original surface builder into a separate spatial partition. That partition is swapped in only while Mario's step runs out in the room, then swapped back (`unity_room.inc.h:22-35, 110-147`; `unity_mr.c:176-202`). Mario's original physics runs on your desk, with nothing approximated. This mirrors our own "follow the source exactly" rule: VR additions sit on top, and the original logic stays untouched.
- **Room geometry fallback chain (shipped after a bug):** scene mesh (Quest 3/3S scan) → Space Setup anchors (floor, walls, furniture as boxes) → floor only. v1.0 used only the mesh, so on a Quest 2 the cartridge fell through the table (issue #13; v1.1.1 release notes). **(APK)** `RoomLight.FloorIfNoRoom`, `AnchorMesh`, `_anchorsOnly`, `_roomReloadInterval`, `RoomSettleTime`, `RoomBands`.
- **Room reloads are safe mid-play:** the previous room's surfaces stay allocated for one more reload, so a pointer to the floor Mario stood on never dangles (`unity_room.inc.h:141-145`). Input is bounded (±8000 units, 30,000 triangles; `:111-115`).
- **Never punish leaving known geometry.** If Mario walks off the scanned room, the room is forgotten, or a warp happens, he goes back into the game where he was taken from rather than dying (`unity_mr.c:93-96, 138-153, 192-197`). Letting go where the room has no floor is refused (`unity_mr.c:157-158`). A menu item "Bring Mario back" is the escape hatch (`unity_options.inc.h:57-61`; `README.md:285`).
- **Portal rendering with stencils (APK shader properties):** "Stencil (1 in the window, 2 Mario out in the room, 4 his shadow there)", "Clip: 0 none, 1 behind the window, 3 + in front within it", "Flatten: … what comes out of the window onto it", "Front face depth behind the window". A `CartMorph` shader blends the cartridge into the window frame as it is stretched.
- **Head through the window:** inside the level you get a sky dome around you and a hole back to your room (`README.md:247-250`). Entering and leaving use separate thresholds (**APK** `HeadInAhead`, `HeadOutAhead`). The game's 3×3 sky tiles are extended by three tiles on every side, because in MR you can look into the window from the side (`patch_sm64ex.py:427-453`).
- **Flat-screen culling turned off in MR:** the game's frustum and back-face rejection assume one fixed camera, but a leaning viewer sees what that camera would cull (`patch_sm64ex.py:192-197`). Billboards (trees, coins) are rebuilt to face **your head** around the game's up axis, not the game camera (`unity_mr.c:29-64`; `patch_sm64ex.py:454-460`).
- **Shadow on real surfaces:** Mario's original blob shadow is fitted to the room's floor while he is outside (`patch_sm64ex.py:264-278`) and drawn on a room-surface shader that is otherwise invisible (**APK** `Mario64MR/RoomSurface`: "Alpha scale (his shadow out in the room is softer)", "Shadow strength"). **(APK)** `RoomLight` with "Room light (diffuse)" and "Room reflections" suggests the character is tinted to the room.
- **Diorama:** set the open window on a table and the level rises out of a glowing ring, about 2 m across. You can move, turn and scale it by its base. The level follows Mario up and down so he stays about 10 cm below your eyes as they were at placement, and anything below the table is cut away (`README.md:252-265`; v1.0.1 notes). To show the whole level, drawing distance and room culling are bypassed **for drawing only**, while the game's updates still treat far objects as far (`patch_sm64ex.py:227-260, 333-397`; `unity_bridge.c:194-196`).
- **Placement preview:** holding the window's lower part near a surface shows a glowing circle; releasing over it commits (`README.md:253-255`; **APK** `CartridgeLauncher.FindDropPoint`, `BuildRing`, `IntentRadius`).
- **Occlusion:** no evidence that their own code uses the Depth API. Hands are handled with a hand-shaped occluder (**APK** `Mario64MR/HandOccluder`, `MarioGloves._occluderMaterial`), and v1.3 made "Mario's gloves or your own (passthrough) hands" an option (`README.md:280`; issue #19).
- **Boundary:** the app asks Horizon OS to hide the boundary grid while passthrough shows the room (`BOUNDARY_VISIBILITY`; v1.1.2, issue #16), with an honest warning in the notes.

## 3. Input
- **Hybrid, not hands-only.** The right Touch controller plays the game; the left hand reaches in and carries Mario. Pick up the second controller and the layout switches live; put it down and it switches back (`README.md:193-195, 213-237`). An Xbox pad also works. Hand tracking is optional in the manifest, so PICO and Steam Frame map the "left hand" onto the left controller's grip (`README.md:312-317, 379-382`). Under our competition's hands-first rule this design would fail; it is a reference for hands as a second verb, not as the only input.
- **Two-handed stretch** opens the cartridge into a window (up to 4×); squeezing the frame closes it (`README.md:197-205`). Both Goddard cursors drag by the original game's own rules (`two_hands.patch`).
- **Pinch with hysteresis on two signals (APK):** `HandPinch.PinchOnStrength`, `PinchOffStrength`, `PinchOnDistance`, `PinchOffDistance`, `SmoothingTime`. We already use distance hysteresis.
- **Hands as moving collision surfaces:** hand triangles are rebuilt every frame as the game's own moving-platform surfaces, both in the room and inside the game (`unity_room.inc.h:14-19, 37-92`; **APK** `AddHandBoxes`). Mario can **stand on your palm**: a flat-palm check (**APK** `UpdatePalmFlat`) plus "which surface is he on", after which the host moves him with the hand (`unity_room.inc.h:94-108`).
- **Touch to collect:** a coin your hand touches is added to Mario's collision list, so the game's own interaction code collects it. There is an AABB broadphase, then a closest-point-on-triangle test. Stars and keys are excluded on purpose ("Mario's to reach") (`unity_hands.inc.h:1-9, 22-57, 65-84, 118-138`).
- **The world holds still while your hand is inside it** (`README.md:240`; `unity_mr.c:102-120`; camera patch `patch_sm64ex.py:295-303`; **APK** `UpdateFreeze`, `Thaw`, `_freezeWeight`). This removes the "aim at a moving target" problem for hand reach.
- **Throwing:** a ring buffer of hand positions and times (**APK** `RecordThrowSample`, `ThrowVelocity`, `_throwPositions`, `_throwTimes`).
- **Left-palm menu gesture** as START (`README.md:210, 223`): native apps can use it; WebXR reserves it for the system.

## 4. Rendering and performance on Quest
- **Fixed-rate game, display-rate presentation.** The game ticks at 30 Hz; the PC port's 60 fps patch draws an in-between frame, and Unity spreads those over 72 to 120 Hz (`unity_bridge.c:160-189`; `patch_sm64ex.py:77-82, 111-117`; **APK** `FramesPerTick`, `TickBlendId`). When Mario jumps between worlds the in-between frame is skipped, so he never smears across the room (`patch_sm64ex.py:279-281`; `unity_mr.c:161`).
- **User-facing graphics options, persisted, with a Defaults button:** refresh 72/80/90/120 Hz, resolution 70–150%, MSAA off/2×/4×, foveation off to "high (top)", texture filtering from "N64 unfiltered" to 16× anisotropic, system sharpening, hands, diorama detail (`unity_options.h:18-35`; `unity_options.inc.h:67-77`; `README.md:272-287`).
- **Per-device defaults:** Quest 2 starts at 72 Hz with more foveation; Quest 3/3S at 90 Hz (`README.md:293-296`).
- **Diorama detail option:** "whole level" or "near Mario (lighter)" trades content for frame time (`README.md:281`).
- **Self-measurement (APK):** `LogPerf`, `_perfSlowFrames`, `_perfTick`, `_perfRender`. Logs carry a `[Mario64MR]` tag, and the README asks testers for exactly those lines (`README.md:307-308, 416`).
- **Bridge limits fail soft:** fixed-size batch, vertex and audio buffers that set an error code instead of crashing (`unity_bridge.c:16-18, 72, 102-104, 126, 143`).
- **Audio:** a ring buffer with resampling from the game's rate to the output rate (**APK** `_audioRing`, `_audioResample`, `TargetBufferedFrames`); `xr-low-latency-audio-enabled=1` in `boot.config`.
- **A real crash bug found on ARM:** float-to-u16 casts saturate differently on arm64; fixed by casting through s32 (`patch_sm64ex.py:315-327`). Lesson: arithmetic that is undefined behaviour shows up only on the headset's CPU.

## 5. Polish, onboarding and presentation
- **One looping GIF at the top shows the whole hook** (reach in, pick Mario up, set him on a real table, he jumps back), with a descriptive alt text (`README.md:3`). There is no store page and no trailer link: the GIF and the author's social posts carry it.
- **The first object is a physical toy, not a menu.** A cartridge floats in front of you: pick it up, throw it, drop it on your table, then stretch it open (`README.md:10-11, 197-205`). Every later feature is discovered from that object.
- **The original's own UI hosts the new options** (R in the pause menu), so nothing foreign appears in the game's look (`patch_sm64ex.py:471-483`).
- **Errors are said in the headset:** "If anything is missing, the app says so in front of you" (`README.md:140`; **APK** `MissingDataNotice`).
- **README structure:** a feature list, "You need", per-OS install, controls tables, troubleshooting by symptom (including why Defender's `!ml` flag is a false alarm and how to check the script yourself), and a plain legal section (`README.md:53-74, 396-454`).
- **Release discipline:** eight releases in 11 days, each saying what changed, which part to update (app only, or rerun the installer), and a pre-release build for a tester when the author had no headset (v1.1.2-boundary-test). Bugs reported in issues get a cause, a fix and a thank-you in the notes.

## 6. Engineering practices
- **Patch by anchor against a pinned upstream.** Every third-party source is pinned to a commit (`install_mario64mr.py:52-58`; `patch_sm64ex.py:14`). Each edit is a `replace_once` that raises "Upstream source changed" unless the anchor occurs exactly once (`patch_sm64ex.py:65-68`). Every run starts from `git show HEAD:path`, so rerunning is idempotent (`:84-88`). It patches about 25 upstream files without a fork.
- **Check the likeliest failure first, before anything expensive.** The ROM is checked before any download, with a specific reason for each wrong case (other region, hack, 24/64 MB, zip, not N64) (`install_mario64mr.py:89-148, 724-728`). Missing tools get the exact install command for the machine (`:731-738`).
- **Never look stuck:** long silent steps print counts every 30 s (`install_mario64mr.py:195-228`) and NDK unzip prints every 5% (`:372-386`).
- **Completion marker written last,** so an interrupted step reruns instead of being built from (`install_mario64mr.py:183-189`).
- **Platform traps handled in code:** WSL on `/mnt/c` is warned about (`:739-741`); Windows user folders with odd characters move the toolchain to `C:\Mario64MR` (`windows/install_mario64mr.ps1:27`); PowerShell's progress bar is turned off because it slows downloads (`:22`); the Steam Frame installer tees its own log (`steam-frame/install.sh:23`).
- **Headless tests of the hard parts:** two C programs link the real game library, drive it through the title screen and file select into Castle Grounds, inject room and hand triangles, and assert outcomes. Covered: put down off the room's edge, walk off the scanned room, room forgotten under him, a same-area warp; touch-to-collect a coin, not a far coin, not a star (`tests/room_carry_test.c:82-140`; `tests/hands_test.c:116-146`). Each user-reported bug in PR #36 gained a test.
- **Gaps:** no CI (no `.github/`), the test runner is macOS-only (`cp -c`, `sysctl`, `install_name_tool`: `tests/run_headless_test.sh:15, 21, 27`), and nothing covers the (private) Unity side.
- **Debugging on device (APK):** the Meta Immersive Debugger is in the build; `sm64unity_face_joint` exists "for input verification/diagnostics" and never changes state (`unity_bridge.c:199-215`).

## 7. Smarter than us, ranked for Hands of a Master
"Small" means under about an hour and safe to do on deadline day; everything else is "later".

| # | Idea (their source) | WebXR / HOAM version | When |
|---|---|---|---|
| 1 | **Hands and controllers both understood; layout follows what is in your hands** (`README.md:193-195`; hand tracking optional in the manifest) | HOAM has no controller path. A judge who enters holding Touch controllers sees "Bring your hands back" (`src/calligraphy-system.ts:2701-2740`), which is wrong advice. When an input source has a gamepad and no `hand`, say "Put your controllers down: this lesson uses your hands. If your hands don't appear, turn on Settings › Movement tracking › Hand tracking." | **Before the deadline (small)** |
| 2 | **One hero GIF of the magic moment at the top, with alt text** (`README.md:3`) | A 5–8 s loop of the lock-in (ghost snaps onto your hand and turns gold, bell, gold ink) at the top of the README and first in the Devpost gallery, cut from the headset trailer footage | **Before the deadline (small, once footage exists)** |
| 3 | **Self-measured slow frames with a fixed log tag** (APK `LogPerf`, `_perfSlowFrames`; `README.md:307-308`) | Count frames over 14 ms per 5 s window from XR frame timestamps; log one `[hands-of-a-master] perf` line (dev or `?perf=1`). Today's first headset session then yields numbers without a Perfetto trace | **Before the deadline (small)** |
| 4 | **Troubleshooting by symptom, said in the README and in the app** (`README.md:140, 396-436`) | Add "If something's off" to README and Devpost: no table found (run Space Setup, or use the virtual desk), hands not showing, no sound (tap the page once), text too small (Larger text). HOAM already says it in the app for most of these | **Before the deadline (small)** |
| 5 | **Shadow on the real surface as a height cue** (`patch_sm64ex.py:264-278`; APK `RoomSurface`) | A soft blob under the master's fingertip on the paper that tightens and darkens as the tip lands: shows pen-up versus pen-down at a glance, one quad, one draw. Inspect with emulator screenshots before shipping | Before the deadline only if time remains after device QA; else later |
| 6 | **The world holds still while your hand is inside it** (`README.md:240`; `unity_mr.c:102-120`) | During the master's demonstration, if the learner's fingertip comes onto the paper, pause the demo instead of letting both inks overlap; resume on lift. During piano play this already happens for tracking loss | Later |
| 7 | **Graphics options and per-device defaults** (`unity_options.h:18-35`; `README.md:293-296`) | After a device trace: 90 Hz on Quest 3 when `supportedFrameRates` allows and frame time leaves headroom; foveation choice in the menu. WebXR can't change MSAA or framebuffer scale mid-session, so keep those at session start | Later (needs device numbers) |
| 8 | **Room-geometry fallback chain beyond planes** (v1.1.1 notes; APK `RoomLight`) | When no plane is labelled table, raycast down the `XRMesh` scene mesh in front of the user for a table height before falling back to the virtual desk | Later |
| 9 | **Physical toy as the first verb** (cartridge: `README.md:10-11`) | For example a rolled scroll on the desk that you pinch and pull open to start the first lesson, instead of an automatic unroll | Later (design change) |
| 10 | **Pre-release builds and release notes per fix** (v1.1.2-boundary-test) | After judging: a `preview` Vercel alias for testers and a CHANGELOG in the README | Later |

**Where we are already ahead or level:**
- **Hands-only:** the whole journey completes without a controller; theirs needs a controller to play.
- **Testing:** an automated end-to-end run of every lesson with injected jitter and negative cases, against their two headless C tests, no CI and a macOS-only runner.
- **Install:** zero install (a URL, once deployed) against `adb`, developer mode and a 10–30 minute build.
- **Accessibility:** captions, auto left-handed mode, tempo, guide modes, larger text. They have none of these beyond volumes and the HUD.
- **Already in our skill:**
  - pinch hysteresis;
  - least-squares release velocity, which beats a plain ring buffer;
  - tracking-loss grace;
  - the real-hand window (`punchHands`; they shipped the same idea as a v1.3 option);
  - the placement preview;
  - a "Move paper in front of me" recovery, our version of their "Bring Mario back".

**Not applicable to WebXR:**
- hiding the boundary (no WebXR API; check on the headset whether Quest Browser shows the grid during `immersive-ar`);
- system sharpening;
- the left-palm menu gesture, which WebXR reserves for the system.

## 8. Proposed additions to our skills (text only; the skills folder was not edited)

**`quest-hands-first-webxr/references/hands-input.md`**
- *Controllers in hand:* a hands-first app must still recognise controllers. If `inputSources` has a gamepad without `hand`, show "Put your controllers down" plus where to turn on hand tracking, not the tracking-loss card. Optionally map the grip pose and trigger to the fingertip and pinch so the journey still completes (source: Mario 64 MR switches layouts live).
- *Freeze the target while the hand reaches in:* anything a hand must touch holds still while the hand is inside its volume, then eases back to motion (Mario 64 MR `_freezeWeight`, `Thaw`).
- *Hands as kinematic colliders rebuilt every frame* (boxes per bone), a flat-palm test before anything may stand on a hand, and carrying by adding the hand's per-frame delta. Exclude goal items from "touch to collect" so the core verb stays the player's.

**`references/placement.md`**
- *Room geometry chain:* scene mesh → Space Setup anchors/planes → floor → virtual surface. Test on a headset with no scan (Quest 2, or a Quest 3 user who skipped the scan): Mario 64 MR v1.0 broke there.
- *Leaving known geometry is never a failure:* return the object or character to its last safe place and keep a "bring it back" item in the menu.
- *Reloading the room mid-session:* keep the previous geometry alive until the next reload so references stay valid; reload on an interval and after a settle time.
- *Use the original engine's own collision for real surfaces* when porting a game: convert the room into its native format and swap partitions around the character's step, rather than writing a second physics.

**`references/visual-quality.md`**
- *Self-measurement:* a slow-frame counter with a fixed log tag (`[app] perf slow=… of … p95=…ms`), on in dev and behind `?perf=1` in production; ask testers for those lines.
- *Height cue on real surfaces:* a soft shadow under anything hovering over the table (a fingertip, a held piece) on an otherwise invisible receiver; softer than a virtual-floor shadow.
- *Ports from flat screens:* disable the original's frustum and back-face culling for content seen from a free head; billboards face the head around the world's up, not the original camera; extend skies and backdrops beyond the original view.
- *Per-device defaults:* Quest 2 at 72 Hz with more foveation; Quest 3/3S at 90 Hz if a trace shows headroom; persist the user's choices with a "Defaults" button.

**`quest-mr-game`**
- *Fixed-step simulation, interpolated to the display:* tick the rules at a fixed rate, render between the last two states, and **skip interpolation on teleports and world changes**.
- *Two-handed stretch to open or scale* a portal or board; a hysteresis pair for "head inside the portal".
- *Portals:* stencil IDs per region (inside the window, out in the room, shadows out in the room), and clip modes for geometry crossing the window plane.

**`references/testing.md`**
- *Headless tests of the game core* drive the real build through its menus to a known state, inject room and hand geometry, and assert outcomes. Each player-reported bug becomes one named case.
- *Platform arithmetic:* undefined float-to-integer casts behave differently on the headset's arm64 CPU; test pure maths on arm64 or clamp before casting.

**`references/submission.md`**
- *Top of README and Devpost:* one looping GIF of the single magic moment, with descriptive alt text, before any text.
- *Troubleshooting by symptom,* each with the exact fix. Pre-empt scary-looking false alarms by explaining what the script does.
- *Release notes per version* that say what changed, what the user must update, and credit the testers.

**`references/build-path.md` (Unity path notes)**
- A proven Quest MR stack as of Nov 2026: Unity 6000.3 (IL2CPP, URP), Meta XR Core v201, MRUK, Interaction SDK, Unity XR Hands, Immersive Debugger.
- Manifest choices:
  - hand tracking `V2.0`, frequency `HIGH`;
  - `USE_SCENE` plus `USE_ANCHOR_API`;
  - `BOUNDARY_VISIBILITY` (request it hidden only while passthrough shows the room);
  - `passthrough-contextual` splash;
  - hand tracking optional when controllers are a fallback.
- Boot config: fragment density map (foveation) and low-latency audio.
- **`adb install -g` grants the scene permission silently**, so the in-app permission prompt path goes untested; test once with a plain install (issue #13).
- *IP separation pattern:* ship an engine shell; build user-owned content locally and load it at run time from the app's private folder (`dlopen`), with an in-headset notice when it is missing.

**`references/process.md` / tooling**
- *Patch, don't fork:* when an SDK in `node_modules` (e.g. IWSDK) needs a change, use a `tools/patch-<sdk>.mjs` that pins the version, starts from pristine files, and fails loudly unless each anchor occurs exactly once. Link it in the write-up as engineering depth.
- *Installer and tool scripts:*
  - check the cheapest and likeliest failure first (a ROM, a key, a device) before any download;
  - print progress every 30 s during silent steps;
  - write a completion marker last so interrupted steps rerun;
  - print the exact install command when a tool is missing.

## 9. Not verified
- The Unity C# source (not public): every **(APK)** item is inferred from identifier and shader property names, not from reading the code.
- Whether EnvironmentDepth is used at run time, or merely included.
- Boundary behaviour in Quest Browser `immersive-ar` sessions.
- Nothing was run, on a headset or otherwise. The downloaded APK stays in the session scratchpad only, not in this folder.

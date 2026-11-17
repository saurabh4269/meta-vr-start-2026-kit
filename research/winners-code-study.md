# Past Meta WebXR / Quest winners: code study and feedback for our six projects

Prepared 17 Nov 2026, about 30 hours before the 2026 deadline (Wed 18 Nov, 12:00 PM PST).

Everything in this folder is third-party and kept for study only. Nothing was copied into our projects, committed, or run: no `npm install`, no builds.

## 0. Summary
- **Editions checked:**
  - Meta Horizon Start Developer Competition 2025 (32 awards);
  - Presence Platform Digital Hackathon 2024;
  - Presence Platform Hackathon 2023 (WebXR teams placed).
  - Excluded: Open Source Champions 2025 (Horizon Worlds only). 2026 is not judged yet.
- **Public winner code is rare.** Only five of the 32 Devpost pages from 2025 link to code: Nanauts and Dun Jun (both repos now 404), HandCraft XR (its IWSDK fork only), OpenSoundLab (Unity) and OnTheGoVR (Kotlin). From 2024, Flaivor (Unity). The 2023 winners published no code.
- **Folders here:**
  - `opensoundlab/`, `onthegovr/`, `flaivor/`: cloned repos;
  - `handcraft-xr/iwsdk-fork-patch/`: MIT patch;
  - `handcraft-xr/live-bundle/`, `nanauts/live-bundle/`: minified, study only;
  - `dunjun/`: dead end;
  - `_devpost-pages/`: write-ups of all 32 2025 winners.
  - Folders with no licence or only a patch have a `SOURCE.txt` note.
- **Nothing was buildable within the safety rules.** No winner published a web project with a `package.json`; the rest need Unity or the Android SDK.
- **Our standing:**
  - Hands of a Master beats the 2025 IWSDK winners on tests, accessibility and design docs, but trails every winner on what judges see: no headset run, no URL, no trailer.
  - Chausar is feature complete, but uncommitted and never run on a headset.
  - The other four projects are scaffolds.

## 1. All winners found

### 1a. Start Developer Competition 2025
Prizes are from Meta's winners blog (mirrored in the kit). Code status is from each Devpost page plus a GitHub API check on 17 Nov 2026.

| Award | Project | Stack | Code |
|---|---|---|---|
| Casual winner $100K | Tiny Golf | Unity | none |
| Casual runner-up $60K | Little Critters (update) | Unity, MRUK | none |
| Casual honourable mention $30K | Le Dino Labo | Unity | none |
| Social winner $100K | Saber Punks | Unity, Photon | none |
| Social runner-up $60K | FALCON | Unreal | none |
| Social honourable mention $30K | Pack Attack | UE5 + React web companion | none (companion not inspected) |
| Entertainment winner $100K | DreamSpace | Unity, MRUK | none |
| Entertainment runner-up $60K | Photon | Unity, Android | none |
| Entertainment honourable mention $30K | (m)ORPH | Unity 6 | none |
| Lifestyle winner $100K | Inkphony | Unity, PCA, Gemini | none |
| Lifestyle runner-up $60K | Tarot Experience – AI Edition | Unity | none |
| Lifestyle honourable mention $30K | IMMERROCK | Unreal | none |
| Hands $50K | Hand Survivor | Unity 6 | none |
| Hands $50K | Pocket Lands | Unity | none |
| Hands $50K | Awesome Hand | Unity | none |
| PCA+AI $50K | Language IRL | Unity, Sentis, Azure | none |
| PCA+AI $50K | Chores.gg | Unity, Gemini | none |
| PCA+AI $50K | Flows.xr | Unity, OpenXR | none |
| **IWSDK $30K** | **The Nanauts** | IWSDK, Llama on AWS | repo 404; live bundle in `nanauts/` |
| **IWSDK $30K** | **Dun Jun** | IWSDK, three.js, Havok | repo 404; moved to VIVERSE (`dunjun/`) |
| Spatial SDK $50K | Compile Crops | Spatial SDK | none |
| Spatial SDK $50K | Mise | Spatial SDK | none |
| React Native $25K | Magic Wonders | React Native | none |
| Android, Quest features $25K | GeoPortal | Kotlin | none |
| Android Utility $25K | MarketView VR | Kotlin | none |
| Android Travel $25K | **OnTheGoVR** | Spatial SDK, Kotlin | yes (`onthegovr/`) |
| Judges' Choice $30K | Into The Mind | Unreal | none |
| Judges' Choice $30K | **OpenSoundLab** | Unity | yes, OSLLv1 (`opensoundlab/`) |
| Judges' Choice $30K | Lasertag update | Unity | none (site not inspected) |
| Judges' Choice $30K | Final Throwdown | Unity | none |
| Judges' Choice $30K | **HandCraft XR: Winter Edition** | IWSDK, three.js, Havok | IWSDK fork (MIT) + live bundle (`handcraft-xr/`) |
| Judges' Choice $30K | ModStorm Block Party | three.js, WebRTC | none |

### 1b. Related competitions
- **Presence Platform Digital Hackathon 2024** ($30K total): Blobble, **Flaivor** and Dreamscape, all Unity. Only Flaivor has code (`flaivor/`, no licence).
- **Presence Platform Hackathon, April 2023:** The Digital Wardrobe and SUBMERSED, no code. The placed WebXR teams (Handmade Stories with Needle Engine, top 3; SquatMaster with A-Frame, top 5) published no code.

## 2. Set-up table
| Folder | Source | Licence | Status |
|---|---|---|---|
| `handcraft-xr/iwsdk-fork-patch/` | evstinik/immersive-web-sdk vs upstream, 10 commits as one `.patch` | MIT (reuse with notice) | Read only. A patch, not a project |
| `handcraft-xr/live-bundle/` | handcraft.astonishingdev.com JS, 2.7 MB, no source map | none (learn only) | Read only, by grep |
| `nanauts/live-bundle/` | jameskane05.github.io/nanauts JS, 2.8 MB | none (learn only) | Read only |
| `dunjun/` | dunjun.world, now a React login site | none | Nothing to study |
| `opensoundlab/` | SphericalLabs/OpenSoundLab `feature/hands` @5fd569d, sparse (.cs + licences) | OSLLv1: derivatives academic or artistic only, no store distribution (learn only) | Read only, needs Unity |
| `onthegovr/` | InventiveOtters/quest-travel-app @412c9c1 | none (learn only) | Read only. Building means running the repo's `gradlew` script |
| `flaivor/` | TheWiselyBearded/Flaivor @3c2c560 | none (learn only) | Read only. Needs Unity and paid API keys |

## 3. Techniques per repo

### HandCraft XR
In the patch (line numbers in `evstinik-vs-upstream.patch`):
- **Pinch hysteresis:** starts at 8 mm and releases at 15 mm (L1335–1365). Upstream IWSDK 1.1.0 uses one 8 mm threshold.
- **Grab from the pinch point:**
  - the grab point sits at the index–thumb midpoint (L247–259);
  - the grab radius is 3 cm (L292–310);
  - the point is frozen while pinching (L1183–1235);
  - for hands, select also counts as squeeze (L165–175).
- **Per-hand hover:** `Hovered.byLeftHand/byRightHand` (L601–684).
- **Render and BVH:**
  - `onBeforeRender`/`onAfterRender` world hooks (L587–600);
  - a stencil buffer for outlines (L10–27);
  - BVH building skipped for BatchedMesh and outline meshes (L655–670, L1161–1175).
- **Physics:** `userData.ignorePhysicsShape` (L322–354) and Havok container shapes (L800–892).

In the bundle (byte offsets):
- **Two-tier shadows** (@2673626): a static 512² map with `autoUpdate=false` that updates only after changes, plus a 128² "micro" shadow camera that follows only the moving objects.
- **Save format** (@2668623): versioned save JSON; a `dirtyPersistables` query re-saves only changed objects; a safe fallback when loading fails.
- **Juice** (@2600549): 3–4 sound variants per event, played as positional one-shots, plus a dust puff on placing.
- **Deferred work:** non-urgent work goes through `requestIdleCallback` (@2602924).

Write-up and delivery: built in one month; trailer recorded on a Quest 3 standalone; two live URLs; the SDK fork is linked openly.

### The Nanauts
Byte offsets in `main.min.js`:
- **Room scan:** if there are no planes or meshes, it shows a prompt panel, then calls `session.initiateRoomCapture()`, with feature detection and a failure path (@2690875). IWSDK 1.1.0 disabled its own automatic call because of the "anchor wiping issue" (`node_modules/@iwsdk/core/dist/scene-understanding/scene-understanding-system.js:115–124`).
- **Microgestures:** a thumb tap on `gamepad.buttons[9]` of a hand input source (when it has 10 or more buttons), with a 200 ms refractory period, routed by context (@2342871).
- **UI and testing:** declarative UI rules with `showWhen`, `priority`, `exclusive` and a wrist-UI state (@2312074). Named debug state presets (@2109202).
- **Lifecycle:** a `PLATFORM_CHECK` state for Quest, emulator or unsupported, plus `stateBeforePause` and `stateBeforeSessionEnd` (@2112704–2112900).
- **Scene understanding:** semantic `XRMesh` labels for table and lamp (@2006307); a hit-test source per input with plane and point entity types (@2820440); a navmesh.
- **Voice:** `MediaRecorder` Opus audio sent to Lambda `/transcribe` and `/interpret` (@2212634). Procedural emotive Web Audio robot voices (@2610460).
- **Small habits:** `localStorage` wrapped in try/catch; a haptics helper that only works with controllers; Google Analytics.

### Dun Jun
No code was reachable. From the write-up: a custom static and dynamic gesture detector (punch, slap, poke), gesture-driven menus, a Quest 2 target of 72–90 fps, and about one month of work. Since then it has added accounts and a leaderboard.

### OpenSoundLab
- **Finger chords as buttons:** index = trigger, thumb+middle = menu, thumb+ring = copy, pinky = drag. Each chord fires only if the other fingers are clear, after a hold and with a latch (`Assets/OSLInputAdditions.cs:107–300`).
- **Thresholds:** press at 0.25 and full at 0.7 (`Assets/Scripts/System/HandInputAdapter.cs:37–38`).
- **Grab point:** the thumb–index midpoint (`HandInputAdapter.cs:155`).
- **World scaling** about a pivot (`Assets/Scripts/WorldDragController.cs:236`).
- **Onboarding:** example patches and tooltips (`Assets/Scripts/Hints/`).

### OnTheGoVR
- **Scheduled start:** clients wait for `targetStartTime` before starting (`app/src/main/java/com/inotter/onthegovr/sync/client/ClientSyncCoordinator.kt:190–260`).
- **Drift monitor:** checks every 5 s and corrects above 100 ms (`sync/protocol/DriftMonitor.kt:42–140`). Weakness: it assumes the devices' clocks agree.
- **Onboarding:** a 3-step wizard (`ui/onboarding/`).
- **Process:** a spec-kit workflow (`.specify/`) and detekt; only a placeholder test.

### Flaivor
- **Structured AI output:** the LLM must return JSON actions such as `timer_needed` and `timer_length` (`Assets/Scripts/ThinkerModule.cs:46`).
- **Agent split:** separate Listener, Thinker and Speech modules.
- **Honest write-up:** latency and panel placement are named as problems.

## 4. Adoptable from their code
"Reuse" means copy with the licence notice; "learn" means re-implement the idea in our own code.

| # | Item | Licence | Where | Effort |
|---|---|---|---|---|
| A1 | Pinch hysteresis 8/15 mm (HandCraft patch L1335–1365) | MIT, reuse | patterns.md "Pinch". Chausar already has 22/40 mm (`hands.ts:15–16`) | 0.5 h |
| A2 | Pinch-midpoint grab point, frozen while pinched (patch L247–259, L1183–1235; OSL `:155`) | MIT reuse / OSL learn | Chausar dice pickup; patterns.md | 0.5–1 h |
| A3 | Two-tier shadows (HandCraft @2673626) | learn | Chausar `ShadowRig` (`director.ts:245`); SKILL Phase 5 | 1.5–2 h |
| A4 | Room scan behind an explicit button (Nanauts @2690875) | learn | HOAM `tryPlaceOnPlane`/`placeVirtual`; Chausar placement; patterns §6 | 1–1.5 h each + device |
| A5 | Debug state presets via `?state=` (Nanauts @2109202) | learn | SKILL Phase 3; HOAM and Chausar (dev only) | 1 h each |
| A6 | Declarative panel rules (Nanauts @2312074) | learn | patterns.md; Flyby, Giants | 1 h |
| A7 | Thumb-tap microgesture via `buttons[9]` (Nanauts @2342871) | learn | Accessibility alternative in HOAM and Chausar; device-unverified | 1 h + device |
| A8 | Sound variation pools (HandCraft @2600549) | learn | Chausar clacks; HOAM pitch jitter | 0.5 h |
| A9 | Versioned save + dirty flag (HandCraft @2668623) | learn | HOAM `progress.ts` (add a `version`); Chausar `save.ts` | 0.5 h |
| A10 | Resume state after the session ends (Nanauts @2112900) | learn | HOAM and Chausar `enterXR` | 1 h |
| A11 | Finger chords with an "others clear" check and a hold latch (OSL `:228–300`) | OSLLv1, learn only | patterns.md "Gestures"; Giants | 0.5 h docs |
| A12 | Scheduled start + drift correction (OnTheGoVR) | learn | Giants multiplayer later; add an RTT clock offset | later |
| A13 | LLM JSON action contract (Flaivor `:46`) | learn | Repo City, Sadak; patterns.md "Agents" | 0.5 h |
| A14 | `ignorePhysicsShape`, container shapes, BatchedMesh BVH skip (patch L322–354, L800–892, L655–670) | MIT, reuse | Only if Havok or BatchedMesh is used (Repo City) | later |
| A15 | Ship IWSDK `src` for device sourcemaps (patch L32–66) | MIT, reuse | SKILL Phase 6 debugging tip | 0.25 h |

## 5. Feedback per project
Evidence comes from the judging page (60 fps floor; "rooms the developer never tested"; "real gameplay"; "persistent anchors … repeat usage") and from the 2025 web winners. All had live URLs, HandCraft and Nanauts recorded on a Quest, and Le Dino Labo, HandCraft and MarketView each cut scope to one loop. Final Throwdown playtested with people who don't use XR.

**Suggested triage:** finish Hands of a Master (about 10 h) and Chausar (about 14 h), keep about 6 h of buffer, and don't start the four scaffolds this round.

### 5.1 Hands of a Master
Winners were stronger on device footage, live URLs, on-device performance work, and tactile juice (sound variety, outlines, shadows). We are stronger on e2e and negative tests, accessibility, and the adaptive learning loop.

| Pri | Item | Evidence | Effort |
|---|---|---|---|
| High | Headset session + fps capture + fix pass: touch thresholds, ghost readability, multiview text, lock-in at 2.4 cm with real jitter | 60 fps floor; HandCraft and Dun Jun on-device performance work | 3–4 h |
| High | Deploy; test logged out on the headset; add a mirror URL | All web winners; HandCraft had two URLs | 1 h |
| High | Trailer recorded on the headset, lock-in within 0:08–0:20, real dissolve footage | "Real gameplay"; HandCraft; first-seconds transformation pattern | 3–4 h |
| High | 15-minute playtest with one or two people new to XR; fix captions only | Final Throwdown; "intuitive from the moment of entry" | 1.5 h |
| Medium | "Scan room" button before the virtual-desk fallback (explicit press only) | Nanauts; "rooms never tested"; IWSDK anchor-wipe note | 1–1.5 h |
| Medium | Check that IWSDK's saved anchor (`scene-understanding-system.js:533–640`) restores the desk; if so, say "your desk remembers" in the Devpost text | Innovation criterion names persistent anchors | 0.5 h |
| Medium | Dev `?state=` presets for filming | Nanauts | 1 h |
| Low | Thumb-tap as "watch again" (if it works on the device) | Nanauts; Accessibility award | 1 h |
| Low | Pitch and filter jitter on repeated sound effects | HandCraft | 0.5 h |
| Low | Resume the same stroke after the session ends | Nanauts | 1 h |

### 5.2 Chausar
| Pri | Item | Evidence | Effort |
|---|---|---|---|
| High | Commit now (all work is untracked) | — | 0.25 h |
| High | Headset session + fps while dice fly (1024² shadow on motion, depth occlusion at the table edge) | 60 fps; A3 is the fix | 3–4 h |
| High | Fix the honest-dice bias (5 or 6 about 60%, `docs/TESTING.md`) | "Solid and bug-free" | 1–2 h |
| High | Seat Shakuni away from walls using wall planes or the mesh | "Rooms never tested"; Nanauts semantic meshes | 1–2 h |
| High | Deploy + trailer on the headset (shot list exists) | as for HOAM | 4 h |
| Medium | Room-scan button | Nanauts | 1 h |
| Medium | Clack sound variation | HandCraft | 0.5 h |
| Low | `?state=accusation` presets; keep the controller fallback but show hands first | Nanauts; rules | 1 h |

### 5.3 Repo City (scaffold)
- **High:** don't start it before Hands of a Master and Chausar are submitted.
- If you do: a frozen `city.json`, one InstancedMesh city on the table, pinch to lift a roof, and a scripted guide with no live LLM (8–10 h, still thin).
- **Medium:** if an LLM is used, use JSON actions (A13).

### 5.4 Giants & Hiders (scaffold)
- **High:** skip it. Multiplayer, OSM assets and gestures make it the riskiest of the six.
- The minimum would be solo versus an AI hider with one circle gesture, using OSL-style exclusivity (A11), in about 10 h.
- **Later:** A12 with an RTT offset.

### 5.5 Flyby Chair (scaffold)
- **High:** skip it. The 8–10 minute mission is too long for judges.
- A slice would be 3 minutes: dissolve into the capsule (reuse HOAM's dissolve), three switches, Earthrise, dissolve back (8 h).
- **Medium:** keep the shake minimal.

### 5.6 Sadak VR (scaffold)
- **High:** don't submit this round. It needs the original authors' permission, a paid speech API and a WebSocket relay, and risks the thin-wrapper rule.

## 6. General lessons for the skill
**SKILL.md**
- Phase 5: replace "no shadow maps" with "no per-frame full shadow maps", and describe the static + micro-shadow approach.
- Phase 6: two tested URLs; trailer recorded on the headset in standalone mode; `?state=` presets for filming.
- Phase 3: feature-detect and log Quest-only APIs (`initiateRoomCapture`, `restorePersistentAnchor`, microgesture buttons). Never call `initiateRoomCapture` automatically.
- Pitfall: IWSDK's single 8 mm pinch threshold flickers at the edge; use hysteresis for custom pinches.

**process.md**
- A 15-minute non-XR playtest before the video.
- Reserve about 30 h for device QA, deploy, trailer and forms.
- Polish one loop, and list known issues in the write-up.
- Commit after every green run on every project.

**patterns.md**
- Pinch: hysteresis, midpoint grab point frozen while pinched, select counted as squeeze.
- Gestures: chords with exclusivity, hold and latch; disable the ray near grab targets (Pocket Lands); keep gestures distinct (Hand Survivor).
- Placement §6: a room-scan fallback.
- UI state: a central state with declarative panels; keep `stateBeforePause` and `stateBeforeSessionEnd`.
- Sound §10: variation pools.
- Agents: JSON actions; `MediaRecorder` Opus to a serverless endpoint.
- Microgestures, marked as unverified.

**assets-and-licensing.md**
- Code licence triage:
  - MIT, Apache, BSD or CC0: reuse with the notice.
  - No licence, OSLLv1, or minified bundles: learn only.
- Disclose any analytics.

**Habits worth copying**
- Fork or patch the SDK openly and link it, as HandCraft did; it reads as developer ingenuity.
- Ship the SDK `src` for device sourcemaps.
- Our JUDGING.md plus the e2e test beats OnTheGoVR's spec-kit process; keep it.

## 7. Not verified
- Nanauts and Dun Jun source (repos 404, no archives); Nanauts was read only as a minified bundle (byte offsets, mangled names). Dun Jun's VIVERSE build was not studied.
- HandCraft's game source.
- Microgesture `buttons[9]` and room-capture behaviour on a real Quest.
- Judges' comments (none published).
- 2023 and 2024 per-winner prize amounts.
- The 2022 Presence Platform hackathon.
- Pack Attack's companion and Lasertag's site.
- No winner code was built, and nothing was run on a headset.
- Status of our other five projects comes from their docs and a read-only survey.

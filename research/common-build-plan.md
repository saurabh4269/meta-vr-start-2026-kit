# Common build plan: all projects (IWSDK / WebXR, Linux first)

Written 16 Nov 2026. It combines three sources:
- the local kit (rules, Meta docs, the 2025 winners and the bundled IWSDK skills);
- a scan of reusable libraries, samples and assets;
- X, Reddit and forum posts.

⚠ marks an inference or something not yet checked on a headset. Everything else has a source, listed at the end.

**Deadline:** Wed 18 Nov 2026, 12:00 PM PST, which is **Thu 19 Nov, 1:30 AM IST**. Judging uses whatever is live at that moment, and you can't update it afterwards.

---

## 0. Decisions that shape the plan

1. **One entry per person.** Each person can submit one entry, either solo or as one team's representative. They can also be a non-representative member of other teams ([FAQ](../resources/devpost/details_faqs.md)). Building several projects only works if **a different person submits each one**. Decide now who that is for every project you start.
2. **Stack for every project:**
   - IWSDK **1.1.0** (pinned exactly), WebXR in Meta Quest Browser.
   - Hosted on Vercel; judges get a URL.
   - IWSDK runs fully on Linux. Windows is only needed for MQDH casting and the demo-video capture.
3. **Stay on 1.1.0.**
   - It includes the fix for the multiview texture-upload bug ([IWSDK #55](https://github.com/facebook/immersive-web-sdk/issues/55)). We checked that `dist/runtime/deferred-texture-uploads.js` is in the installed package.
   - Don't move to 1.2.0-rc, and don't drop back to 1.0.x, which has the bug.
4. **One polished loop per project, not a feature list.** Meta's 2026 blog, Tony Vitillo's 16 lessons and the 2025 winners all say the same thing.
5. **One repo per project,** each created from a shared base repo (§1).

---

## 1. Repo strategy

```
~/a/code/hackathons/meta-vr/
  meta-vr-start-2026-kit/   docs, research, this plan; app/ = verified starter
  hands-of-a-master/        own git repo (created 16 Nov from app/; README = project brief)
  chausar/                  own git repo
  repo-city/                own git repo
  giants-and-hiders/        own git repo
  flyby-chair/              own git repo
  sadak-vr/                 own git repo
```
All six already pass `npm ci`, `typecheck` and `build`. The shared modules in §2 are built in the first project, in `src/common/`, then copied into the others.

- **Starting work on a project:**
  1. Copy the latest `src/common/` from the project built before it.
  2. On a new machine, run `npm ci`, then `npm run setup` (writes the MCP configs and warms up the IWSDK reference index).
  3. Link a Vercel project.
  4. Deploy something on day 1, so the judge URL works from the start.
- **Keep shared fixes in sync:** fix shared code in whichever repo you're working in (`src/common/`) and copy the change into each project repo.
  - Don't use a workspace or package setup: with 2.5 days left, plain copies are simpler.
- **Cross-platform rules:**
  - LF line endings via `.gitattributes`.
  - npm scripts only, no bash-only steps.
  - No absolute paths in tracked files.
  - `.mcp.json` and `opencode.json` are generated per machine and gitignored.
  - `.npmrc` skips the onnxruntime CUDA download. If a future npm version rejects that setting, use the env var `ONNXRUNTIME_NODE_INSTALL_CUDA=skip`.

---

## 2. Shared foundation: build once in `src/common/` (first project), then copy

Each module below is small, and every project needs it. Build them in this order:

| # | Module | What it does | Build from |
|---|---|---|---|
| 1 | `xr-perf.ts` | When `VisibilityState.Visible`: `session.updateTargetFrameRate(72)`. Set `renderer.xr.setFoveation(0.5)` by default and **0.3 for scenes heavy with text**; three.js defaults to 1.0, the maximum, and IWSDK never changes it (checked in `node_modules`). Pause simulation when `VisibleBlurred`. A dev-only FPS and draw-call overlay using `renderStats`. | IWSDK API reference "XR Session Optimization"; [Meta WebXR FFR](https://developers.meta.com/horizon/documentation/web/webxr-ffr/) |
| 2 | `hands.ts` | Pinch **hysteresis** (separate start and release thresholds). A One Euro filter on fingertips (npm `1eurofilter`, BSD-3). Tracking-loss handling: hold the last pose about 150 ms, then ease out, and tint the hand when tracking confidence drops. Pre-pinch aim: use the pose from about 0.5 s before release, to cancel release jitter. A 120 ms ring buffer of palm positions with a linear-fit velocity, for throws. **Never bind the palm-up pinch**, which the system reserves; on the left hand it exits the session. | [dmnshd hand-tracking post](https://dmnshd.gg/blog/webxr-hand-tracking), Table Troopers and Hand Physics Lab case studies, [WebXR hands](../resources/pages/developers-meta-com-horizon-documentation-web-webxr-hands.md) |
| 3 | `table-placement.ts` | Find the play surface:<br>1. An `XRPlane` or `XRMesh` labelled `table`/`desk` in `SceneUnderstandingSystem`.<br>2. If none, a **hit-test place-it-yourself** fallback (Quest Browser 40.4+ uses the Depth API, so no room scan is needed).<br>3. If still nothing, a virtual table about 0.7 m in front at seated height.<br>Then create an `XRAnchor`. Show "Place" and "Move" affordances, and a re-centre button. | IWSDK guides 11 and 14, `examples/scene-understanding` and `environment-raycast` |
| 4 | `grounding.ts` | The AR lighting recipe, to make virtual objects look like they sit in the room: `IBLGradient` at 0.25; `ShadowCatcher` at 0.25 opacity; `ContactShadow` tinted **black** at 0.4 (the default blue-grey glows on dark floors); ACES tone mapping. | IWSDK 1.1 changelog, `iwsdk-compose-scene/references/environment-recipes.md` |
| 5 | `ui-kit` | Shared UIKitML panels: hand-menu, toast, caption bar, credits panel, tutorial card. Placement rules:<br>- Content about 1 m away and slightly low; panels for direct touch at about 45 cm.<br>- `Follower` for UI that should stay with you, never head-locked.<br>- Hit targets at least 22 mm, contrast at least 4.5:1.<br>- Captions: up to 32 characters × 2 rows, with a box behind them. | [MR design guideline](../resources/pages/developers-meta-com-horizon-design-mr-design-guideline.md), [accessibility](../resources/pages/developers-meta-com-horizon-design-accessibility.md) |
| 6 | `onboarding.ts` | A first-run flow with **no wall of text**:<br>1. A lighting tip ("good light helps your hands").<br>2. An animated ghost hand demonstrating the one core gesture.<br>3. The player performs it once and gets confirmation.<br>4. Straight into play.<br>Use the word "pinch", not "tap". | Meta "Seven design decisions", Best First Five Minutes award text |
| 7 | `feedback.ts` | Hand tracking has no haptics, so every interaction gets a visual and sound response instead: hover glow, press squash, and a soft click through `AudioSource`. Pool short SFX, and avoid flashing visuals. | [Hands best practices](../resources/pages/developers-meta-com-horizon-design-hands-best-practices.md) |
| 8 | `transition.ts` | A passthrough ↔ VR fade using `DomeGradient`/`DomeFade` plus alpha on an inside-out shell. Never teleport the user while in passthrough. | IWSDK 1.1 changelog, MR guideline |
| 9 | `save.ts` | `localStorage` progress (streaks, unlocks, best scores) for the Reason to Come Back award, wrapped in try/catch. Anchors are capped at 8 per site and don't persist in private mode. | [Meta WebXR MR docs](https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/) |
| 10 | `api/` (Vercel functions) | One server-side proxy for any LLM or TTS call. Keys stay on the server, and the browser calls `/api/...`. Use `@anthropic-ai/sdk` or the Vercel AI SDK. | IWSDK guide 18: the SDK has no backend |

Already in every project repo:
- the `.npmrc` CUDA skip;
- a `vercel.json` that keeps `Permissions-Policy: xr-spatial-tracking=*`;
- a credits panel;
- `deploy` and `typecheck` scripts.

---

## 3. Visual playbook: premium look at 72 fps on Quest

**What winners did:**
- One verb a stranger understands in two seconds.
- The room is the stage.
- One transformation in the trailer's opening seconds.
- A **consistent art style:** mixing asset packs looks like "a yard sale".
- A small finished toy beats a big rough game (2025 winners analysis).

**Do:**
- **Ground everything** with the §2.4 recipe. Contact shadows are the cheapest wow available.
- **Stylised over realistic:** `MeshToonMaterial`/cel shading, or unlit plus baked lighting. It's cheap, reads well in passthrough and hides low polygon counts.
- **Fake the glow inside materials:** emissive colour with ACES tone mapping, Fresnel rims, additive billboard halos, sprite flares.
  - **No full-screen post-processing:** EffectComposer and pmndrs postprocessing break in WebXR, and an extra render target turns off foveation and MSAA.
- **Particles:** three.quarks (MIT), batched, with low counts and additive blending. ⚠ It has no Quest benchmarks, so measure frame rate on the headset.
- **Text:**
  - uikit MSDF for UI.
  - `XRQuadLayer`/`XRCylinderLayer` (fixed in 1.1) for long, crisp text such as code panels or lessons.
  - **Devanagari and other Indic scripts can't use uikit or troika.** They don't do Indic shaping, so conjuncts and vowel signs break. Draw them with Canvas2D `fillText` into a CanvasTexture or quad layer.
- **Depth occlusion** (`DepthOccludable`) for objects your real hands reach into:
  - Add it **after** meshes load.
  - Never on UI or troika text (IWSDK #60).
  - Hard mode for cheap, MinMax soft mode for the hero object.
  - Depth updates at 30 Hz, so edges lag.
- **Custom shaders:** `precision highp float`. `mediump` gives blocky artifacts only on Quest (three.js forum).
- **Assets:**
  - glTF with **Draco + KTX2**, via `gltf-transform optimize --compress draco --texture-compress ktx2`.
  - **Don't use meshopt.** IWSDK's loader has no meshopt decoder; we checked `node_modules`.
  - Optimise models before putting them in `public/`, because Vite copies files as-is.
- **Instancing and batching:** `InstancedMesh`/`BatchedMesh` for anything repeated (buildings, pieces, tiles).
- **Shadows:** `castShadow` off by default. Use ContactShadow or a blob shadow, not real-time shadow maps.
- **Stretch only: Gaussian splats** (Spark, MIT, under about 500k splats ⚠). Quest has an open freeze bug when MSAA, shadows and Spark are combined, and IWSDK turns MSAA on. Use splats only as a backdrop, and only after the core loop is done.

**Don't:**
- head-locked HUDs;
- content behind real walls;
- big objects popping in close to your face (fade them in);
- more than one real-time light;
- PBR on everything;
- WebGPU (it needs a browser flag on Quest).

---

## 4. Hands and UX playbook

- **Three verbs only:** pinch, grab, poke. Teach any other gesture explicitly and keep it clearly distinct from the others. Gesture failure modes to avoid: too similar, wrong one fires, awkward chains, too many to remember.
- **Hand position and reach:** keep hands below the heart and at least 10 cm from the headset. Interactions should work with arms resting and within seated reach (2 ft).
- **Targets and snapping:** **colliders larger than the visible object**, and snap pieces into place. Demeo did this for dice and pieces.
- **Tracking will fail, so design for it:**
  - A held object snaps back gently.
  - The player is never punished.
  - One hand never covers the other.
  - Motion away from the user tracks better than motion across the view, which matters for throws.
- **Pace:** sequential, never twitchy. Avoid time pressure.
- **Accessibility for free:**
  - captions for everything, so the game works without audio (VRC Accessibility 1);
  - an option for one-handed play;
  - text size settings;
  - a slow-tempo mode.

  Accessibility is the core purpose of only about 4% of 2026 entries, which makes it an easy differentiator.
- **AI as a character in the room, never a chat panel.** It must pass the "take it away" test: remove the AI and the experience still stands.

---

## 5. Room and passthrough playbook (Experience Design and Technical, 25% each)

- **Passthrough must change the experience:** the real table becomes the play surface. Judges mark you down if it would play the same with passthrough off.
- **Unknown rooms:**
  - Judges will test in rooms you've never seen. Always have the §2.3 fallback chain.
  - The design must work in the smallest workable space.
  - Wall Town Wonders found that "table surfaces keep changing". Re-detect the table on re-entry, and let the player move the board.
- **Narrow FoV:**
  - Turn on `world.features.fieldOfViewMask: true` in the emulator.
  - Keep essential UI within about 37° left/right, 25° up and 43° down (the IWSDK skill figures; stricter than `metavr device fov-sim`'s 58×54°).
- **Comfort:** seated, no artificial locomotion. In VR sections, keep a stable frame and visible passthrough edges where possible.

---

## 6. Performance budget (check on the headset, not the emulator)

| Item | Target |
|---|---|
| Frame rate | 72 Hz target; never below 60 (VRC.Quest.Performance.1). Loading screens and fades are exempt. |
| Frame time | about 13.9 ms at 72 Hz. Per-frame allocations count as bugs. |
| Draw calls | **under 100 is the goal, 300 the hard ceiling** ⚠ (the 300 comes from Meta's Unity optimizer; 100 is a community figure) |
| Triangles | aim for 100–300k visible ⚠ (no WebXR-specific number exists; measure) |
| Textures | KTX2; 2k maximum per hero asset, 1k for props; at most 4k for planets |
| Lights | 1 real-time light plus IBL |

**Method:**
- Turn dynamic resolution off and fix foveation at one level.
- Use one repeatable sequence and change one thing at a time.
- Decide whether you're CPU- or GPU-bound.
- On the headset, use `metavr` perf capture or Perfetto (the `hz-perfetto-debug` skill).
- The emulator says nothing useful about fps.

---

## 7. Tooling and agent workflow

- **IWSDK MCP plus skills** (already set up in `app/`; `npm run setup` on any machine):
  - Start every task with the `iwsdk-dev` skill.
  - For a headless agent session, run `npx iwsdk dev up --ai-mode agent`.
  - Check behaviour with the **runtime** `browser_screenshot`. The editor's `scene_screenshot` doesn't run your systems.
  - Hand testing: `xr_set_hand_pose` and `xr_run_sequence` (poke, pinch-grab).
  - Debugging: ECS `pause`/`step`/`diff`.
  - Run the `iwsdk-project-code-reviewer` agent (a 22-point checklist) before each deploy.
  - Don't hand-write scene JSON, UIKitML or physics bodies without the matching skill.
- **Meta agentic-tools plugin** (Claude Code): `/plugin marketplace add meta-quest/agentic-tools`, then `/plugin install meta-vr@meta-vr`.
  - Skills: `hz-iwsdk-webxr`, `hz-perfetto-debug`, `hz-quest-verify-first`, `hz-vr-debug`.
  - `metavr` searches Meta's 3D asset library and runs `device fov-sim`.
- **Blender MCP** (`ahujasid/mcp-for-blender`, MIT): imports from Poly Haven, Sketchfab and Poly Pizza and calls Meshy, Tripo or Hunyuan3D, for preparing assets.
- **Testing on the headset from Linux:**
  - Quest on USB, `adb reverse tcp:8081 tcp:8081`, then open `https://localhost:8081` in Quest Browser.
  - Or use the `iwsdk-native-xr-test` skill (`runtime pair-headset`).
  - Install adb with `sudo apt install android-tools-adb`; the kit's `scripts/quest-adb.sh` has helpers.
- **Windows (later):**
  - MQDH casting and recording for the trailer.
  - Air Link if you want it.
  - After cloning, run `npm ci && npm run setup`.

---

## 8. Asset sources and licenses

| Need | Source | License / condition |
|---|---|---|
| HDRIs, textures, props | Poly Haven, ambientCG | CC0 |
| Low-poly kits (board game, city, UI, audio) | Kenney, Quaternius | CC0 |
| Individual models | Sketchfab / Poly Pizza, **filtered** | CC0 or CC-BY (credit it) |
| Moon | NASA SVS CGI Moon Kit (svs.gsfc.nasa.gov/4720) | Credit NASA SVS. **No NASA logos or insignia.** |
| Earth (day, night, clouds, normal) | Solar System Scope textures | CC BY 4.0 (credit). Convert 8k to a 4k KTX2. |
| Earth shader | `bobbyroe/threejs-earth` | MIT. Fresnel atmosphere, no post-processing. |
| SFX and music | Kenney audio; Freesound (**CC0 filter**); Pixabay | CC0 / Pixabay license |
| AI 3D | Meshy (free tier CC BY 4.0, credit it); TRELLIS / TripoSR (MIT, self-hosted) | **Tripo's free tier is non-commercial.** Hunyuan3D's license excludes the EU, UK and South Korea. |
| Fonts | Noto Sans Devanagari, Mukta, Hind (Google Fonts) | OFL. Indic text uses the Canvas2D path (§3). |
| Maps | OpenStreetMap | ODbL: "© OpenStreetMap contributors" in-app. Strip brand names from OSM shop tags (rule 4.19). |

**Rules for every asset:**
- No logos, brands or identifiable people.
- A credits panel in the app and in the Devpost text.
- Use a single art style per project.

---

## 9. Per-project notes (in suggested build order)

Suggested order: **open lane × prize fit × feasibility within the time left**. Ideas where the research found existing work go later.

### 1. Hands of a Master: build first
- **Why first:**
  - Research found **no hands-only calligraphy tutor**.
  - A 2026 CHI paper ("Skill-Adaptive Ghost Instructors") showed that a ghost whose transparency **adapts to skill** improves retention, and it names calligraphy as a future application. That's a strong credible-innovation story.
  - It fits two awards: Reason to Come Back and Accessibility.
- **Reuse:**
  - `@iwsdk/xr-input`'s hand visual adapter, which already uses `fillPoses`. Clone it as a translucent Fresnel "ghost" hand.
  - Desk `XRPlane` plus an anchor.
  - One Euro filter.
  - The $1-recognizer or DTW idea for stroke matching.
  - A paper texture from ambientCG.
- **Build:**
  1. A recorder: `fillPoses` → a Float32Array per frame with timestamps → JSON. Record the master sequence yourself.
  2. Playback with a resampler.
  3. Ribbon-mesh ink strokes on the paper plane.
  4. Per-stroke scoring (path, order, speed).
  5. Ghost opacity that fades as your score rises.
  6. A streak counter in `save.ts`.
- **Minimum playable version:** one character, 3–5 strokes, a fingertip "air brush" over a virtual paper on the real desk.
- **Risks:** fingers curling around a real pen hurts tracking ⚠, so the air brush is the default. Jitter close to the page: smooth the path and score leniently.

### 2. Mahabharat Chausar
- **Why:** an open lane (no chausar or pachisi, no cheating by gesture). It targets Boldest Original Concept, plus Social if there's time.
- **Reuse:**
  - IWSDK Havok physics (turn on `features.physics`). Throws keep their velocity; set the outcome with `PhysicsManipulation`.
  - byWulf/threejs-dice (MIT) shows how to pre-simulate a throw to force an outcome.
  - The Dun Jun 2025 winner's gesture detector (`sma1692/DunJun`; check its license before reusing).
  - handy-work (MIT) as reference for pose detection.
  - Kenney board-game assets with a toon material.
- **Build:**
  1. The board snaps to the table.
  2. Long "pasa" dice as box shapes; read the top face.
  3. Pieces moved with a pinch.
  4. 2–3 distinct cheat gestures, using hysteresis and a hold time so they don't fire by accident.
  5. A heuristic AI Shakuni that watches your hand anomalies, with LLM-written taunts through `/api` (optional).
  6. A board-crack finale: pre-fractured glTF plus emissive cracks plus three.quarks.
- **Risks:** fast throws leave the tracking volume, so use the ring-buffer velocity and the last good pose. If you use Hindi text, it needs the Canvas2D path.

### 3. Repo City
- **Why:** desktop code-city tools exist (RepoVerse on the three.js forum, Aug 2026; CodeCharta), but **no tabletop MR version operated by hand**.
- **Reuse:**
  - **CodeCharta's `ccsh`** (BSD-3) or **scc** (MIT, `--format json`) for metrics; lizard for per-function complexity.
  - Instanced buildings.
  - Quad layers for code text, with shiki (MIT) tokens.
  - three.quarks fire.
  - Claude via `/api` for the guide.
- **Build:**
  1. A small `repo-to-city` CLI that writes JSON into `public/`.
  2. A treemap layout of districts.
  3. Pinch to lift a roof → floors are functions → a code panel.
  4. Two-hand zoom.
  5. Fire on buildings whose tests fail, read from a test-results JSON.
- **Risks:** text readability (use layers, foveation 0.3). It must show real code early in the video, so it doesn't look like another mind map.

### 4. Giants & Hiders
- **Why:** no MR hide-and-seek found. **But** a public WebXR OSM tabletop city already exists, so the novelty has to come from the hide-and-seek mechanic, not the map.
- **Reuse:**
  - Blosm/blender-osm (the add-on is GPL; exported models are yours) or OSM2World (MIT) → Blender decimate → toon palette → Draco/KTX2.
  - Quaternius city kit.
  - $1 recognizer or a circle fit for the radius gesture.
  - Trystero (MIT, P2P) for optional multiplayer later.
- **Build order:** solo against an AI hider first; multiplayer only if time allows.
- **Risks:** networking, and brand names in OSM tags.

### 5. Flyby Chair
- **Why later:** a 2026 three.js WebXR lunar-flyby sandbox already exists, so a plain flyby isn't novel. Its edge has to be the **crewed, seated cockpit and the hand tasks**.
- **Reuse:**
  - bobbyroe/threejs-earth (Fresnel atmosphere, day/night).
  - NASA SVS Moon kit.
  - Solar System Scope Earth.
  - `PokeInteractable` switches; knobs that only rotate (OneHandGrabbable).
  - `DomeGradient`/`DomeFade` for the room-to-capsule transition.
- **Risks:**
  - comfort: keep shaking mild and the cockpit frame stable;
  - no NASA or "Artemis" marks.

### 6. Sadak VR
- **Permission:** Parth Mittal (owner) is the project mentor, so permission is in hand. Before submitting, still get it **in writing**, ideally with a license added to the source repo, because Meta may ask for proof (rules §4). Credit all four authors.
- **Division:** Adapted.
- **Technical red flags:**
  - Devanagari shaping needs the Canvas2D path.
  - Sarvam's STT WebSocket needs a server relay; Vercel functions can't hold WebSockets open.
  - The mic has to be requested inside the click that enters AR, and needs gain.
  - Web Speech on Quest is unverified.
  - Language learning is a contested lane.

---

## 10. Per-project definition of done (submission gate)

- [ ] The whole experience completes with **hands only**, including onboarding, menus and the ending. Test with the controllers turned off.
- [ ] A new player understands it without coaching, and the first wow arrives in about 30 seconds.
- [ ] The table is found, or the fallback works, in 2 different real rooms. Re-centre works.
- [ ] Holds **72 fps** through the heaviest moment on Quest 3 (and 3S if you have one), measured with a perf capture.
- [ ] Text, images and hand models render **on the headset**. The emulator doesn't show the multiview path.
- [ ] Captions on everything, and essential UI inside the narrow FoV.
- [ ] Credits panel; no logos, brands or real people; English throughout.
- [ ] The Vercel **production alias** URL opens logged out and in incognito on the headset. Don't redeploy after the deadline.
- [ ] Video:
  - under 3 minutes, public on YouTube or Vimeo, real headset footage;
  - the hook and hands-first design within the first 30 seconds;
  - the try-it link next to the video.
- [ ] The Devpost entry is complete: Track, Division, description and images. **Submit several hours before 12:00 PM PST on 18 Nov.**

---

## 11. Sources

- **Local kit:**
  - `resources/devpost/*`: rules, judging, special awards, FAQ, and the update "tips to help your entry stand out".
  - `resources/pages/*`: Meta's hands, MR, accessibility, perf and FoV docs.
  - `research/past-winners-2025-analysis.md`, `research/submissions-2026-aggregate.md`, `research/accessibility-and-pitfalls.md`.
  - `templates/iwsdk-starter/.claude/skills/*` (13 IWSDK skills) and `AGENTS.md`.
- **IWSDK:**
  - https://github.com/facebook/immersive-web-sdk (MIT; 11 examples; `packages/core/CHANGELOG.md`; issues #55, #60, #16, #62).
  - Guides 06, 10, 11, 12, 13, 14, 15 and 18 at https://iwsdk.dev.
  - https://iwsdk.dev/ai/mcp-tools.html.
- **Meta:**
  - [WebXR perf best practices](https://developers.meta.com/horizon/documentation/web/webxr-perf-bp/)
  - [Fixed foveation](https://developers.meta.com/horizon/documentation/web/webxr-ffr/)
  - [WebXR MR](https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/)
  - [What makes a title work hands-only](https://developers.meta.com/vr/blog/what-makes-a-meta-vr-title-work-hands-only/)
  - [IWSDK 1.0 blog](https://developers.meta.com/vr/blog/immersive-web-sdk-1-0/)
  - [2025 winners](https://developers.meta.com/vr/blog/meta-horizon-start-developer-competition-meet-the-winners/)
  - [agentic-tools](https://github.com/meta-quest/agentic-tools)
- **Community:**
  - [dmnshd: hand tracking in WebXR](https://dmnshd.gg/blog/webxr-hand-tracking)
  - [SkarredGhost: 16 lessons from a Meta award](https://skarredghost.com/2025/12/05/how-meta-horizon-award-lessons/)
  - [Nanauts case study](https://jamesckane.com/case-study/the-nanauts/)
  - [Wall Town Wonders interview](https://premortem.games/?p=5452)
  - [three.js forum: Quest texture artifacts (mediump)](https://discourse.threejs.org/t/texture-artifacts-only-in-meta-quest-3-browser/88506)
  - [three.js forum: post-processing in WebXR](https://discourse.threejs.org/t/post-processing-in-webxr/69951)
  - [UploadVR: instant hit-test placement](https://uploadvr.com/quest-browser-depth-api-webxr-hit-testing-instant-placement)
  - [CHI '26: Skill-adaptive ghost instructors](https://arxiv.org/html/2603.06253)
- **Libraries:** three.quarks, Spark, gltf-transform, `1eurofilter`, $1 Unistroke Recognizer, handy-work, threejs-dice, CodeCharta, scc, lizard, shiki, Blosm, OSM2World, Trystero, bobbyroe/threejs-earth (licenses in §8 and §9).
- **Gaps:** reddit.com and X couldn't be fetched directly, so those findings come from search-result snippets and mirror sites. ⚠ Not verified:
  - Spark working with IWSDK's MSAA and multiview;
  - hand-joint velocity on Quest;
  - mesh detection on Quest 3S;
  - three.quarks frame rates on Quest;
  - Tripo's exact terms.

---

## 12. Lessons from building projects 1 and 2 (Hands of a Master, 16 to 17 Nov; Chausar, 17 Nov)
Verified in the IWSDK 1.1.0 emulator. Reuse these in every project. **Start every new project by reading the skills** (canonical in `../../skills/`, synced into each project's `.claude/skills/` by `../../skills/sync.sh`; edit only the canonical copy, then run the script):
- `quest-hands-first-webxr` (core, always): workflow phases 0 to 9, context-labelled defaults, pitfalls, and references for process, architecture, hands, placement, UI and text, visual quality, audio, assets and licensing, testing (`scripts/xr_e2e_lib.py`) and submission.
- `quest-mr-tutor` (add-on for learning experiences): surface contact, ghost hand, lesson ladders, key presses, the user's own content. Reference code: `../../hands-of-a-master/src/`.
- `quest-mr-game` (add-on for games with an opponent or NPC): rules sim, controllable physics, NPC state machine, realistic character pipeline, table dressing, juice. Reference code: `../../chausar/src/game/`.

- **UIKit units are centimetres.** A 440-unit panel needs `scale ≈ 0.07–0.09` for 30–40 cm wide. Buttons then come out about 2.6 cm tall, which meets the 2.2 cm target.
- **Create panels from code** with `world.assets.instantiate('<manifest id>')` and parent them to the thing they control, e.g. the desk. Add `RayInteractable` + `PokeInteractable`.
- **Fingertip poke did not click UIKit buttons in the emulator.** Pinch-ray and mouse did. Add your own press test: an element's `matrixWorld` maps the unit square onto its rectangle, so transform the index tip into it, check |x| ≤ 0.55 and |y| ≤ 0.6 (a small margin around the rectangle, as in `calligraphy-system.ts`), and detect crossing the panel's +Z plane. Route both the ray click and the poke through one debounced `trigger(id)`.
- **Hand joints:** `frame.getJointPose(hand.get('index-finger-tip'), refSpace)` and `frame.fillPoses(...)`. The latter is missing from the TS types, so cast. Smooth with a One Euro filter (`src/common/one-euro.ts`).
- **Pick the active hand carefully.** Ignore a hand resting far below the surface (lap under a virtual desk). Prefer the hand already in use. Discard touches under 0.2 s, which are hands passing through a surface.
- **Table placement:** filter `XRPlane` by `orientation === 'horizontal'`, height within 0.12–0.95 m below the head, prefer `semanticLabel` `table`/`desk`. Clamp into the polygon and slide toward the centroid until the footprint is inside (round tables). Fall back to a virtual table after about 2.5 s. Add `XRAnchor` once placed. The emulator room has 15 labelled planes, so test both "seated at a table" and "standing in the middle".
- **Skinned hand rendering:** the WebXR generic-hand GLB has flat bones named after the joints. Set each bone from a world joint matrix premultiplied by the armature's inverse. A depth-only pre-pass at `renderOrder` N with the shader at N+1 gives a clean translucent "ghost".
- **Emulator end-to-end testing is practical.** Dev-only `console.info('[tag] ...')` lines, including a machine-readable `layout {json}`, plus `iwsdk browser logs` (count ≤ 200; use timestamps, not line counts) plus `iwsdk xr animate-to` / `run-sequence` with `anchor: 'index-tip'`. With `world.xr.offer: "always"`, the session is re-offered after exit; call `xr enter` again. Edits under `src/` hot-reload the page and end the XR session, so don't edit code during a test run.
- **Measure:** log `renderer.info.render.calls/triangles` in dev. Calligraphy alone peaked at 64 calls and 31k triangles in XR; with Blender models, the grand piano and a 360-degree place it reached 280 calls until the 93-part piano was merged by material in Blender (now at most 112 calls and 62k triangles). The emulator counts each eye separately; Quest's multiview halves that.

### Added 17 Nov (user feedback on look and feel)
- **"Dummy" visuals lose points.** Build every prop in one Blender Python script (`tools/blender/build_assets.py`), export glTF without Draco or meshopt (the IWSDK loader has no meshopt decoder), and use CC0 PBR textures from Poly Haven and ambientCG. Render a still-life preview (`tools/blender/preview.py`) to review before loading it in the app.
- **Place the user where the activity lives,** using public CC0 360-degree photos (Poly Haven, Wikimedia Commons). Show one world at a time: place content in passthrough on the real table, then dissolve fully into the place, with a button back to the room. Pattern and shader: the skill's `patterns.md` §13.
- **Soften the place behind the task** (blur, desaturation, warm haze) and face its calmest side; a crisp busy photo pulled attention off the work.
- **Music:** CC0 from OpenGameArt, chosen per place, with an on/off switch. No music where the user makes the sound.
- **AI 3D generation without a GPU (checked 17 Nov):** only the Hugging Face Space `trellis-community/TRELLIS` (MIT) is practical: image-to-3D, about 1 to 3 models a day on the free quota, then decimate in Blender. Avoid Hunyuan3D (its licence bars use and display of output in the EU, UK and South Korea). Keep a provenance note per asset (rules 10 and 12).
- **Meta's asset API (`metavr asset search`) is down for us** ("Invalid API response", server side). Don't plan around it.
- **The design skills from `meta-quest/agentic-tools`** (Apache-2.0) are worth copying into each project: text at least 1 degree of view, targets 43 to 64 mm, nothing closer than 0.5 m, no thin fonts, break reminders.

### Added 17 Nov (Chausar: game with an NPC opponent)
- **Set the visual bar on day one.** The first version passed every functional test and was still called "dummy, naive, unpolished"; everything after was rebuilding. Decide character, environment, table dressing and lighting before gameplay code.
- **Bisect a visual bug before patching it** (Blender render vs engine, rest vs posed, morphs off vs on, compressed vs not). Five rounds of tuning an eye bug ended when one A/B showed the eye proxies were exported unskinned.
- **Two pinch tiers:** 8 mm / 15 mm for precise selection; 22 mm / 40 mm with a 150 ms tracking-loss grace for grabbing and throwing. IWSDK's own select is one 8 mm threshold with a 200 ms cooldown.
- **Metal needs room reflections:** `IBLTexture {src:'room'}` at about 0.8 instead of the scaffold's `IBLGradient` 0.25, plus one tight shadow camera refreshed only on motion.
- **A wall-replacing dome** (a 360° panorama centred on the head, faded out below about −15°) keeps the real table, hands and floor in passthrough while transforming the room.
- **Realistic characters for free:** MakeHuman/MPFB (CC0) built by script, animated procedurally (IK, look, blinks, jaw); no Draco on skinned meshes; full seated body with `DepthOccludable` instead of clipping at the tabletop.
- **Free AI assets:** FLUX.1-schnell → TRELLIS on a free Hugging Face token gives about 1–3 models a day; generate hero assets first and keep a procedural fallback. Hunyuan3D stays excluded (licence).
- **Emulator tests:** log `#pageId.seq` on every line and wait with `browser logs --since`, so stale lines from earlier loads never match; 19 emulated-hand checks plus rules and physics sims.
- **One dev port per project:** Chausar uses 8082; the other scaffolds still share 8081.

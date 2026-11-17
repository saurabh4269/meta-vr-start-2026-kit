# Giants & Hiders and Code as Architecture: existing apps, open-source code, papers and docs

Added 18 Nov 2026. Companion to [idea-shortlist.md](idea-shortlist.md) (ideas 6 and 4) and the same format as [ideas-7-8-resources.md](ideas-7-8-resources.md). Every URL below was checked on 18 Nov 2026 and resolved (HTTP 200). Exceptions are marked: DOI links were checked against the doi.org handle service because IEEE and ACM block scripts, and one PDF returns 403 to scripts. GitHub stars, licences and last-push dates were read from the GitHub API on the same day. The BabiaXR figures come from the GitLab API.

- **No 2026 project is named or linked.** Everything here is a store game, a long-standing open-source repo, a paper, a video or a doc page. I checked every app and repo name against the local 2026 gallery data (384 rows, titles, taglines, repo links and descriptions) and none matched a 2026 entry. Some gallery entries *use* tools listed here (IWSDK, PeerJS); that is not a name clash.
- ⚠ marks my suggestion, assumption or an unverified point. It is not a sourced fact.
- "I found no X" means "not found in my searches", not "none exists".
- Licence caution: GPL, AGPL, PolyForm-Noncommercial and no-licence code is listed for ideas only. Don't copy it into the entry.

---

## Top picks to start from

| Need | Pick | Licence | Why this one |
|---|---|---|---|
| **6. Question and elimination engine** | [taibeled/JetLagHideAndSeek](https://github.com/taibeled/JetLagHideAndSeek) ([live tool](https://taibeled.github.io/JetLagHideAndSeek/)) | MIT, 541★, pushed 2026-08-28 | Already implements the Hide + Seek question types (radius, thermometer, matching, measuring, tentacles) as map geometry, using Turf, osmtogeojson and Leaflet. Port the logic, not the UI |
| **6. Geometry maths** | [Turfjs/turf](https://github.com/Turfjs/turf) | MIT, 10,550★, pushed 2026-11-17 | Circles, polygon difference and point-in-polygon: "wrong areas go dark" is a polygon difference |
| **6. OSM data to a mesh** | [tyrasd/osmtogeojson](https://github.com/tyrasd/osmtogeojson) plus [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) | MIT, 752★ | Fetch one district once, save a static GeoJSON, extrude the buildings in three.js |
| **6. Web networking (no server)** | [dmotz/trystero](https://github.com/dmotz/trystero) | MIT, 2,860★, pushed 2026-11-13 | Peer-to-peer rooms over WebRTC with no backend of your own |
| **6. Colocation, if you go native** | [oculus-samples/Unity-LocalMultiplayerMR](https://github.com/oculus-samples/Unity-LocalMultiplayerMR) | MIT, 55★, pushed 2026-11-12 | Meta's colocation package plus three networking variants (Netcode, Photon Fusion, PUN) |
| **6. Closest format reference** | [Jet Lag: The Game, Hide + Seek](https://jetlag.denull.ru/en/rules/) | n/a | The rules your game is modelled on. Don't use its name or assets |
| **4. City layout** | [d3/d3-hierarchy](https://github.com/d3/d3-hierarchy) ([treemap docs](https://d3js.org/d3-hierarchy/treemap)) | ISC, 1,280★, pushed 2026-11-03 | Squarified treemap gives you districts and building footprints from a folder tree |
| **4. Metrics per file** | [boyter/scc](https://github.com/boyter/scc) | MIT, 8,884★, pushed 2026-11-17 | One fast CLI gives lines, comments and complexity per file as JSON |
| **4. Existing code-city to study** | [MaibornWolff/codecharta](https://github.com/MaibornWolff/codecharta) ([live demo](https://codecharta.com/visualization/app/index.html?file=codecharta_visualization.cc.json.gz&file=codecharta_analysis.cc.json.gz&currentFilesAreSampleFiles=true)) | BSD-3-Clause, 584★, pushed 2026-11-17 | Mature, actively maintained, with importers for git logs, coverage, tokei, Sonar, code-maat and tree-sitter |
| **4. Closest three.js clone** | [Manavarya09/code-city](https://github.com/Manavarya09/code-city) | MIT, 10★, pushed 2026-06-20 | Files as buildings, folders as districts, dependency roads, bug-fix commits as fires, all in the browser via the GitHub API. Desktop only |
| **4. Parsing** | [tree-sitter/tree-sitter](https://github.com/tree-sitter/tree-sitter) ([web build](https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web)) | MIT, 27,496★, pushed 2026-11-17 | Gives functions per file (the "floors"), in Node or the browser |
| **4. Evidence VR helps** | [CodeCity: On-Screen or in Virtual Reality?](https://doi.org/10.1109/VISSOFT52517.2021.00011) ([open PDF](https://www.inf.usi.ch/lanza/PUBS/P/More2021a.pdf), 403 to scripts, opens in a browser) | n/a | 24 participants: VR was much faster with comparable correctness. Cite it |
| **6. Meta docs** | [Shared Spatial Anchors](https://developers.meta.com/horizon/documentation/unity/unity-shared-spatial-anchors/), [Colocation Discovery](https://developers.meta.com/horizon/documentation/unity/unity-colocation-discovery/), [Mixed Reality in Browser (WebXR anchors)](https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/) | n/a | Read these before choosing web or native for multiplayer |

**Two findings that change plans**
1. **Giants & Hiders: WebXR has no shared-anchor API, so web colocation means manual alignment.** Meta's browser doc describes only *local* persistent anchors (8 per site, lost in private mode), with no way to share them with another headset. Shared Spatial Anchors and Colocation Discovery (Bluetooth) are in the native SDKs. The Unity route also needs the app set up in the developer dashboard, with test users on a non-production release channel, and a Data Use Checkup (the user-ID part only if you share by user ID). ⚠ So for the IWSDK build, design the multiplayer as **remote and asymmetric**: each player has their own table diorama and only the game state travels over WebRTC. That needs no alignment. Treat true same-room colocation as a Unity-only stretch. ⚠ You would also need two headsets to test it.
2. **Code as Architecture: the city is solved, the fire is not.** Several open-source code-cities exist, and one (Manavarya09/code-city) already has fires, but they come from bug-fix commits, not live test results, and none runs hands-first on a Quest. ⚠ The differentiator is "failing test = fire you can poke", plus the AI guide. Build the city from stock parts (git tree or scc, then d3-hierarchy, then three.js) and spend your time on the test-to-building mapping and hand interaction.

---

# Idea 6: Giants & Hiders

## 6.1 Similar apps and games

| App | Platform | What it does | Borrow / differentiate |
|---|---|---|---|
| [Jet Lag: The Game, Hide + Seek](https://jetlag.denull.ru/en/rules/) (fan rules). Videos: [Japan, 1:13:08](https://www.youtube.com/watch?v=PHjkSKQSzv4), [Switzerland, 40:22](https://www.youtube.com/watch?v=E8UmTJVDnUI). Background: [Wikipedia](https://en.wikipedia.org/wiki/Jet_Lag:_The_Game) | Web series; real-world game on real maps | Hider picks a zone and answers seekers' questions (radius, thermometer, matching, measuring, photos) while holding curse cards. Seekers narrow the map | **Borrow** the question types and the narrowing loop (already in the shortlist). **Differentiate**: a tabletop diorama, hands only, a shrinking hider, and a solo AI hider. **No names, logos or assets** |
| [VR Giants](https://store.steampowered.com/app/1124160/VR_Giants/) (Risa Interactive, June 2023) | PC VR plus a screen player, local or online | The VR player is a giant who protects a tiny screen player; the tiny player uses the giant's body as part of the level | **Borrow** the "giant body is the level" feel and the asymmetric roles. **Differentiate**: ours is hide and seek on a city, and both roles are hand-tracked |
| [Panoptic](https://store.steampowered.com/app/541930/Panoptic/) (Team Panoptes, Oct 2020) | PC VR, local multiplayer | One player is the giant Overseer, the other a tiny Challenger sneaking through crowds, in a cat-and-mouse game | **Borrow** the giant-hunts-tiny tension and the "laser eye" scan reveal. **Differentiate**: ours is information-based (questions) rather than reflex-based |
| [Black Hat Cooperative](https://store.steampowered.com/app/503100/Black_Hat_Cooperative/) (Team Future, 2016) | PC VR plus a keyboard player | The VR player sneaks through a maze; the screen player sees the full map and guides them by voice | **Borrow** the asymmetric information split: one side has the map, the other has the street-level view. **Differentiate**: no voice or keyboard needed, and the roles swap |
| [Ruckus Ridge VR Party](https://store.steampowered.com/app/443800/Ruckus_Ridge_VR_Party/) (Foreignvr, 2016) | PC VR plus gamepad players, local | A VR player versus up to three screen players in a tournament of mini-games | **Borrow** the short-round tournament pacing for the 3-minute video. **Differentiate**: ours needs no gamepads or monitor |
| [Mannequin](https://www.gematsu.com/2023/09/asymmetric-multiplayer-hide-and-seek-vr-game-mannequin-announced-for-ps-vr2-pc-and-quest) (Fast Travel Games) | Quest, PC, PS VR2 | Asymmetric hide and seek: aliens pose as frozen humans, agents hunt them with gadgets | **Borrow** the "blend in and bluff" hider fantasy. **Differentiate**: ours is table-scale, seated and hands-only |
| [Eye in the Sky](https://store.steampowered.com/app/566700/Eye_in_the_Sky/) (VinLia Games, 2017) | PC VR plus a computer player | Asymmetric escape room where each side sees a different view and must share information | Another example of splitting information across roles |
| [Demeo](https://www.meta.com/blog/demeo-hand-tracking-mixed-reality-mr/) (Resolution Games; blog Jul 2024) | Quest 2/3/Pro, mixed reality, hand tracking, colocated | A digital board game on your real table: pick up figures, toss dice. It uses Shared Spatial Anchors for same-room play | **Borrow** the "figures on your table, grab with a pinch" feel and the colocation approach. **Differentiate**: ours adds a role asymmetry and map deduction |
| [Little Cities](https://www.meta.com/blog/a-new-way-to-play-little-cities-adds-hand-tracking-support-today/) (Purple Yonder; hand tracking added June 2022) and [Traffix XR: Cities of Tomorrow](https://thexrschool.com/traffix-xr-cities-of-tomorrow/) (Infinity Games, 15 Oct 2026, review) | Quest; Traffix is mixed reality with hand tracking on Quest 3/3S/Pro | Miniature cities you build or manage with your hands, on your real table | **Borrow** the diorama scale and lighting that make a tiny city read as a toy. **Differentiate**: neither has a second player or a hidden-information loop |
| [Lasertag](https://github.com/anaglyphs/lasertag) (2025 Judges' Choice; Unity, Netcode over LAN) | Quest 3, colocated | Same-room mixed-reality multiplayer with live room scanning | Proof that colocated Quest play is possible for a solo developer. Code is noncommercial-licensed, so reference only |
| [Catch Me If You Can](https://devpost.com/software/catch-me-if-you-can-127ctv) (Presence Platform NY Hackathon 2024 winner, Casual or Social Gaming) | Quest 3, Unity, colocated | Hide and seek and freeze tag in mixed reality: the room goes dark and players use space setup | A real example of colocated hide and seek. Read its write-up for what went wrong with colocation. Not a 2026 entry |
| [Scotland Yard](https://en.wikipedia.org/wiki/Scotland_Yard_(board_game)) (board game) | Tabletop | Detectives hunt a hidden player on a map and are only told their transport type each turn | A map-deduction reference: the hider is visible only through limited information, which is also the Giants & Hiders loop |

I did not find an existing Quest game that combines a map-narrowing question loop with a giants-and-tiny roles twist. ⚠ That is not proof none exists.

## 6.2 Open-source code

### Question logic, maps and geometry

| Repo | Licence | ★ | Last push | How you'd reuse it |
|---|---|---|---|---|
| [taibeled/JetLagHideAndSeek](https://github.com/taibeled/JetLagHideAndSeek) | MIT | 541 | 2026-08-28 | Astro/React web tool. Its README lists the question families it implements: radius, thermometer, many "matching" and "measuring" variants (same zone, same nearest park, distance to coastline), and tentacles. Dependencies: `@turf/turf`, `osmtogeojson`, `leaflet`. **Port the question-to-polygon logic** into the headset game ⚠ |
| [Turfjs/turf](https://github.com/Turfjs/turf) | MIT | 10,550 | 2026-11-17 | `circle` plus `difference` for radius questions, `booleanPointInPolygon` for answers, bisectors for thermometer ⚠ (my mapping of the functions to the questions) |
| [tyrasd/osmtogeojson](https://github.com/tyrasd/osmtogeojson) | MIT | 752 | 2026-04-23 | Turns an Overpass response into GeoJSON. Run it once at build time, then ship static JSON |
| [anvaka/city-roads](https://github.com/anvaka/city-roads) | MIT | 9,826 | 2026-11-14 | Fetches every road in a city from OSM in the browser and draws it. A reference for the street-network fetch and the "city as lines" look |

### OSM to 3D

| Repo | Licence | ★ | Last push | How you'd reuse it |
|---|---|---|---|---|
| [gkjohnson/three-geojson](https://github.com/gkjohnson/three-geojson) | MIT | 241 | 2026-09-30 | GeoJSON polygons and lines straight to three.js shapes: building footprints to extruded meshes |
| [tordanik/OSM2World](https://github.com/tordanik/OSM2World) | MIT | 877 | 2026-11-17 | Java converter from OSM to 3D models. Run it offline to produce a district glTF if hand-extruding looks flat ⚠ |
| [StrandedKitty/streets-gl](https://github.com/StrandedKitty/streets-gl) | MIT | 1,122 | 2025-08-21 | A full OSM 3D renderer in WebGL2. Too heavy to embed, but a good reference for building and road meshes. Older push date |
| [w3reality/three-geo](https://github.com/w3reality/three-geo) | MIT | 1,426 | 2025-02-25 | Terrain plus map textures in three.js. ⚠ I believe it needs a Mapbox token; I did not check. Low priority, since a city diorama is flat |
| [OSMBuildings/OSMBuildings](https://github.com/OSMBuildings/OSMBuildings) | Custom (see its LICENSE.md) | 1,015 | 2021-04-29 | Old. Listed so you don't burn time on it |
| [ProbableTrain/MapGenerator](https://github.com/ProbableTrain/MapGenerator) | LGPL-3.0 | 1,487 | 2024-05-09 | Procedural road-network generator, if you ever want an invented city instead of OSM. LGPL: link, don't copy |

**Data rules.** OSM data is ODbL, so credit it ([OSM copyright](https://www.openstreetmap.org/copyright)). Fetch your one district once and ship the file, rather than calling the public Overpass servers from every headset ⚠.

### Multiplayer and colocation

| Repo | Licence | ★ | Last push | How you'd reuse it |
|---|---|---|---|---|
| [oculus-samples/Unity-LocalMultiplayerMR](https://github.com/oculus-samples/Unity-LocalMultiplayerMR) | MIT (Photon SDK and TextMeshPro keep their own terms) | 55 | 2026-11-12 | Three Unity projects (Netcode for GameObjects, Photon Fusion 1, PUN 2), each with matchmaking, player connection and colocation, plus a network-agnostic `colocation-package`. The README says newer SDKs fold this into Multiplayer Building Blocks |
| [oculus-samples/Unity-SharedSpatialAnchors](https://github.com/oculus-samples/Unity-SharedSpatialAnchors) | MIT | 165 | 2026-11-11 | Meta's reference for creating and sharing an anchor between headsets |
| [oculus-samples/Unity-Discover](https://github.com/oculus-samples/Unity-Discover) | MIT | 310 | 2026-02-12 | Mixed-reality showcase with colocation. Meta's [Discover walkthrough](https://developers.meta.com/vr/documentation/unity/unity-learn-mixed-reality-through-discover/) explains it |
| [oculus-samples/Unity-SharedSpaces](https://github.com/oculus-samples/Unity-SharedSpaces) | MIT | 248 | 2026-01-24 | Basic multiplayer showcase, if you need lobby and avatar plumbing |
| [anaglyphs/lasertag](https://github.com/anaglyphs/lasertag) | PolyForm Noncommercial | 371 | 2026-11-16 | Reference only: Netcode in Distributed Authority "DAHost" mode over a LAN instead of Unity's cloud |
| [meta/immersive-web-sdk](https://github.com/meta/immersive-web-sdk) | MIT | 351 | 2026-11-17 | Your engine for the web build. Its [examples](https://github.com/meta/immersive-web-sdk/tree/main/examples) include `poke`, `grab`, `gaze-pinch`, `environment-raycast`, `scene-understanding` and `physics`. I found no multiplayer example in it |
| [dmotz/trystero](https://github.com/dmotz/trystero) | MIT | 2,860 | 2026-11-13 | Serverless WebRTC rooms: join by room code, send small JSON state messages. Best fit for "pass the map state between two headsets" ⚠ |
| [peers/peerjs](https://github.com/peers/peerjs) | MIT | 13,519 | 2026-02-27 | Simpler WebRTC data channels, but it needs a signalling server (the free cloud one is fine for a demo) ⚠ |
| [colyseus/colyseus](https://github.com/colyseus/colyseus) | MIT | 7,558 | 2026-11-10 | A real authoritative server for a hosted game. More work than P2P, but it keeps the hider's secret location off the seekers' device |
| [networked-aframe/networked-aframe](https://github.com/networked-aframe/networked-aframe) | MIT | 1,205 | 2026-10-12 | A-Frame, not three.js or IWSDK. Reference for how avatars and entities are synced |

⚠ **Hidden information.** If the hider's location lives on the seeker's device in a peer-to-peer game, a curious player can read it from the network traffic. For a 3-minute demo that doesn't matter; mention it if a judge asks.

### Fog of war and dimming the map

I found **no maintained three.js or WebXR fog-of-war library**. The usual technique is a mask texture that darkens excluded areas (draw the remaining candidate polygon into a texture, then sample it in the building shader) ⚠. The repos below are Unity examples of the same idea.

| Repo | Licence | ★ | Last push | Note |
|---|---|---|---|---|
| [AsehesL/FogOfWar](https://github.com/AsehesL/FogOfWar) | MIT | 528 | 2018-05-15 | Unity fog rendered from the visible area, with a mask texture |
| [Pjchardt/fogofwar-example](https://github.com/Pjchardt/fogofwar-example) | MIT | 2 | 2018-04-30 | Tiny render-texture-plus-shader example, easy to read |

## 6.3 Papers, docs and videos

**Meta docs and samples**
- [Shared Spatial Anchors](https://developers.meta.com/horizon/documentation/unity/unity-shared-spatial-anchors/) (Unity). Key points from the page: local multiplayer in a single room; devices Quest 2, Pro, 3, 3S; Meta XR Core SDK v71+; Enhanced Spatial Services turned on in headset settings; your own networking for game state.
- [Colocation Discovery](https://developers.meta.com/horizon/documentation/unity/unity-colocation-discovery/) (updated Nov 2026). Bluetooth discovery of nearby sessions; the host can broadcast up to 1,024 bytes (a room name or IP address). Lets you share anchors by group UUID without Photon.
- [Multiplayer Building Blocks](https://developers.meta.com/horizon/documentation/unity/bb-multiplayer-blocks/). The no-code route to a colocation block with Netcode or Photon.
- [Mixed Reality Support in Browser](https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/). WebXR passthrough, plane detection and local persistent anchors. **Nothing on sharing anchors across headsets.**
- [Photon Fusion: Mixed reality with local multiplayer](https://doc.photonengine.com/arvr/current/technical-samples/fusion-mixedreality-localmultiplayer). A walkthrough of colocation through shared anchors. It says that **to test colocalization the app must be distributed through a Meta release channel**.
- [Colocation on Quest (user help)](https://www.meta.com/help/quest/1083740680462326/) for what players see.
- [IWSDK site](https://iwsdk.dev/) and [meta/immersive-web-sdk](https://github.com/meta/immersive-web-sdk).
- [Track Craft's colocation update (UploadVR)](https://www.uploadvr.com/track-craft-colocation-update-mixed-reality/). A real indie shipping colocated MR; its report says Quest 2 and Pro can join but a Quest 3 must host, because only the Quest 3 can scan the room mesh.

**Videos** (titles and lengths only; I did not watch them end to end)
- [Colocation with Meta's Shared Spatial Anchors and the new Colocation Discovery API](https://www.youtube.com/watch?v=elf6WuGzwdI), 9:59. A developer tutorial.
- [Co-Location on Quest 3 Is Absolutely AMAZING](https://www.youtube.com/watch?v=2qDpqGU_A14), Cas and Chary XR, 8:22. What players experience.

**Papers**
- [ShareVR: Co-Located Experiences for VR between HMD and non-HMD Users](https://doi.org/10.1145/3025453.3025683) (CHI 2017). The foundational study of asymmetric VR play. Useful for judging how roles feel.
- [Virtual Reality on a WIM: Interactive Worlds in Miniature](https://doi.org/10.1145/223904.223938) (CHI 1995). The classic on manipulating a miniature copy of a world from the outside. That is the seekers' view in your game.
- [Can You See Me Now?](https://doi.org/10.1145/1124772.1124774) (ACM TOCHI 2006). A mixed-reality chase game where online players hunt runners in a real city on a shared map. The closest research ancestor of the format ⚠ (I read the title and venue only).

**What to read first.** The [Jet Lag rules page](https://jetlag.denull.ru/en/rules/), the README of taibeled/JetLagHideAndSeek, and the Meta SSA page. Together they cover the game, the logic and the networking limit.

---

# Idea 4: Code as Architecture

## 4.1 Similar apps and tools

| App | Platform | What it does | Borrow / differentiate |
|---|---|---|---|
| [CodeCharta](https://codecharta.com) ([repo](https://github.com/MaibornWolff/codecharta)) | Web visualization plus a CLI analysis suite | Turns metrics into a 3D city. Area, height and colour map to metrics you choose. Importers cover git logs, coverage, tokei, Sonar and code-maat, and the repo has a tree-sitter folder | **Borrow** its metric-to-building mapping and its `cc.json` idea of a pre-computed file. **Differentiate**: desktop screen, no hands, no live test state, no guide |
| CodeCity (Richard Wettel, 2007 and after). Videos: [Data presentation, 5:52](https://www.youtube.com/watch?v=WoHTpSVt5k4), [Navigation, 4:36](https://www.youtube.com/watch?v=hTNUTosNyl0), [Design disharmony maps, 6:42](https://www.youtube.com/watch?v=qyFdLwbWveo) | Desktop (Smalltalk) | The original: classes are buildings, packages are districts, size and height show metrics. Its disharmony maps colour buildings by design problems | **Borrow** the district layout and the idea of colouring by problems (your fire is a problem colour). I could not load the original project page, so use the videos and papers |
| [ExplorViz](https://explorviz.dev) ([GitHub](https://github.com/ExplorViz)) | Browser: desktop, VR and AR | Live trace visualization of running software as a city, explored collaboratively on-screen, in VR or in AR | **Borrow** the "pick up the city and share it" ideas. **Differentiate**: ExplorViz needs monitored runtime data; yours runs from a repo plus test results. Its public demo link is dead, so I did not link it |
| [BabiaXR CodeCity](https://babiaxr.gitlab.io) (A-Frame, WebXR) | Browser, runs on Quest | An open-source CodeCity in WebXR, built from a git repo with a Python metrics script. Used in a controlled study on Oculus Quest | **Borrow** the pipeline (clone, compute metrics, build a scene). **Differentiate**: controller or gaze, no hands, no tests. GPL-3.0, so reference only |
| [CodeHouse](https://doi.org/10.1109/VISSOFT.2019.00018) (Hitachi, VISSOFT 2019). [Video](https://www.youtube.com/watch?v=rVhOaGrC_ac), 4:44 | VR research tool | Shows software as a house: modules are rooms on the inside of a cylinder, linked to a debugger for dynamic behaviour | **Borrow** the debugger link idea, which is your test-to-building link. I found no public code |
| [Gource](https://gource.io) ([repo](https://github.com/acaudwell/Gource)). [Linux kernel video](https://www.youtube.com/watch?v=WeJoP1orbmE), 10:31 | Desktop, video output | Animates a repo's history as a growing tree with contributors flying around | **Borrow** the "watch it grow" opening shot for the trailer. Not a spatial explorer |
| [Manavarya09/code-city](https://github.com/Manavarya09/code-city) | Browser (desktop) | Paste a GitHub repo URL; buildings, districts, roads, fires on bug-fix commits and walking contributors. Its hosted demo is down (the Vercel pages return 404 and 402), so run it locally | The nearest thing to your concept. **Differentiate** with real test results, hands and the guide |

**Papers about the same idea, and a few more implementations**
- [CityVR: Gameful Software Visualization](https://doi.org/10.1109/ICSME.2017.70) (ICSME 2017). A Unity VR city with gaze and controller interaction.
- [Code Park: A New 3D Code Visualization Tool](https://doi.org/10.1109/VISSOFT.2017.10) (VISSOFT 2017). A 3D code visualization tool (title only; I did not read it).
- [DGT-AR: Visualizing Code Dependencies in AR](https://doi.org/10.1109/VISSOFT60811.2023.00020) (VISSOFT 2023). Dependency graphs in AR, closest to your "trace a street" interaction.

I did not find a Quest app that shows live test results as fires on a hand-driven code city. ⚠ That is not proof none exists.

## 4.2 Open-source code

### Code-city implementations

| Repo | Licence | ★ | Last push | How you'd reuse it |
|---|---|---|---|---|
| [MaibornWolff/codecharta](https://github.com/MaibornWolff/codecharta) | BSD-3-Clause | 584 | 2026-11-17 | Latest visualization release `vis-2.11.0` (2026-11-10). The `analysis/analysers` folder has importers for git log, coverage, tokei, Sonar, code-maat and dependencies. Reuse the analysis CLI to produce metrics, then read its JSON ⚠ (I did not run it; check that the coverage importer matches your test runner) |
| [Manavarya09/code-city](https://github.com/Manavarya09/code-city) | MIT | 10 | 2026-06-20 | Single-page three.js app. Study how it maps the GitHub API response to buildings and fires; its README says no backend and no API keys |
| [modernizing/codecity](https://github.com/modernizing/codecity) | MPL-2.0 | 71 | 2022-02-13 | A WebXR code city with a Quest 2 to-do list and a [live page](https://modernizing.github.io/codecity/). Unfinished and old, but its README tells you to use the WebXR API Emulator extension in Chrome |
| [victorrentea/code-city](https://github.com/victorrentea/code-city) | Unlicense | 13 | 2026-11-11 | Turns a Java source folder into one self-contained HTML page. Public domain, so you can borrow freely |
| [rodrigo-brito/gocity](https://github.com/rodrigo-brito/gocity) | MIT | 1,810 | 2025-12-05 | Go-source code city. A good reference for metric choices |
| [honzaap/GithubCity](https://github.com/honzaap/GithubCity) | Apache-2.0 | 1,300 | 2023-10-20 | Your contribution calendar as a city. A visual-style reference only |
| [srizzon/git-city](https://github.com/srizzon/git-city) | AGPL-3.0 | 6,000 | 2026-11-17 | GitHub profiles as a pixel-art city. AGPL: look, don't copy |
| [aMonteSl/Code-XR](https://github.com/aMonteSl/Code-XR) | GPL-3.0 | 6 | 2026-09-18 | A VS Code extension for XR code visualization. GPL: reference only |
| [josongmin/quanta-code-city](https://github.com/josongmin/quanta-code-city) | none stated | 0 | 2026-11-09 | React plus three.js code city. No licence means all rights reserved: ideas only |
| [vasturiano/3d-force-graph-vr](https://github.com/vasturiano/3d-force-graph-vr) | MIT | 252 | 2026-08-22 | A VR force graph, useful if you show imports as a graph view alongside the city |
| [ExplorViz/frontend](https://github.com/ExplorViz/frontend) | no licence file found | 6 | 2026-11-17 | ExplorViz's browser client, with VR and AR modes. ⚠ I found no licence file, so ideas only |

### Parsing and metrics

| Repo | Licence | ★ | Last push | How you'd reuse it |
|---|---|---|---|---|
| [boyter/scc](https://github.com/boyter/scc) | MIT | 8,884 | 2026-11-17 | Per-file lines, comments and complexity as JSON. The simplest source for "building height" |
| [tree-sitter/tree-sitter](https://github.com/tree-sitter/tree-sitter) | MIT | 27,496 | 2026-11-17 | Parser library. The [web build](https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web) runs in the browser; bindings: [node](https://github.com/tree-sitter/node-tree-sitter) (MIT, 884★), [py](https://github.com/tree-sitter/py-tree-sitter) (MIT, 1,523★). Gives function boundaries for the floors. Grammars are per language, for example [JavaScript](https://github.com/tree-sitter/tree-sitter-javascript), [Python](https://github.com/tree-sitter/tree-sitter-python) and [TypeScript](https://github.com/tree-sitter/tree-sitter-typescript) (all MIT) |
| [sverweij/dependency-cruiser](https://github.com/sverweij/dependency-cruiser) | MIT | 7,437 | 2026-11-17 | JS/TS import graph as JSON: your "streets" |
| [XAMPPRocky/tokei](https://github.com/XAMPPRocky/tokei) | MIT or Apache-2.0 | 15,075 | 2026-09-06 | Fast line counter, an alternative to scc |
| [terryyin/lizard](https://github.com/terryyin/lizard) | MIT-style (see its LICENSE.txt) | 2,604 | 2026-11-17 | Cyclomatic complexity per function across many languages |
| [d3/d3-hierarchy](https://github.com/d3/d3-hierarchy) | ISC | 1,280 | 2026-11-03 | `treemap` with the squarify tiling. Folders to nested rectangles, then extrude each leaf |
| [octokit/octokit.js](https://github.com/octokit/octokit.js) | MIT | 7,880 | 2026-11-17 | GitHub API client for the browser. The [git trees endpoint](https://docs.github.com/en/rest/git/trees) lists a whole repo in one call (file paths and sizes, but no line counts). Mind the [rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) |
| [isomorphic-git/isomorphic-git](https://github.com/isomorphic-git/isomorphic-git) | MIT | 8,392 | 2026-11-17 | Pure-JS git, if you want history in the browser |
| [ishepard/pydriller](https://github.com/ishepard/pydriller) | Apache-2.0 | 978 | 2026-09-26 | Python git-history mining (churn, authors) for "hot" buildings |
| [adamtornhill/code-maat](https://github.com/adamtornhill/code-maat) | GPL-3.0 | 2,656 | 2025-07-03 | Hotspot and coupling analysis from git logs. GPL, so run it as a separate tool, don't embed |

### Tests and coverage ingestion

| Source | Licence | ★ | Last push | How you'd reuse it |
|---|---|---|---|---|
| [Jest CLI `--json`](https://jestjs.io/docs/cli) ([jestjs/jest](https://github.com/jestjs/jest)) | MIT | 45,475 | 2026-11-16 | JSON of each test file with pass or fail and failure messages (with stack traces ⚠). The easiest "which file is on fire" feed |
| [vitest-dev/vitest](https://github.com/vitest-dev/vitest) | MIT | 17,388 | 2026-11-17 | Same idea if your sample repo uses Vite |
| [istanbuljs/istanbuljs](https://github.com/istanbuljs/istanbuljs) ([Istanbul](https://istanbul.js.org/)) | per package (see each) | 1,107 | 2026-04-09 | The JS coverage format (`coverage-final.json`): per-file statement and function coverage for a "lit windows" effect ⚠ |
| [davglass/lcov-parse](https://github.com/davglass/lcov-parse) | BSD-3-Clause | 55 | 2020-12-22 | Reads LCOV files into JSON. Old and tiny; LCOV is simple enough to parse yourself ⚠ |
| [linux-test-project/lcov](https://github.com/linux-test-project/lcov) | GPL-2.0 | 1,118 | 2026-11-16 | The LCOV tool itself. Format reference only |

⚠ **Mapping a failure to a building.** A failing test names a test file and often a stack trace with source paths. The simplest mapping is "the source file at the top of the failing stack is on fire", with the test file as a second building. The dependency graph from dependency-cruiser can then spread smoke to the importers. This is my design, not an existing tool's behaviour.

### Text in a headset

| Repo | Licence | ★ | Last push | How you'd reuse it |
|---|---|---|---|---|
| [protectwise/troika](https://github.com/protectwise/troika) (troika-three-text) | MIT | 1,992 | 2026-11-02 | Crisp signed-distance-field text in three.js, for the code panel |
| [pmndrs/uikit](https://github.com/pmndrs/uikit) | MIT | 3,270 | 2026-10-27 | UI panels for react-three-fiber. Only relevant if you use R3F rather than IWSDK ⚠ |

## 4.3 Papers, docs and videos

**Papers on the city metaphor**
- [Visualizing Software Systems as Cities](https://doi.org/10.1109/VISSOF.2007.4290706) (Wettel and Lanza, VISSOFT 2007). The original idea.
- [Software Systems as Cities: A Controlled Experiment](https://doi.org/10.1145/1985793.1985868) (ICSE 2011). CodeCity users did better on correctness and time than the baseline tools in the study.
- [On the Use of Virtual Reality in Software Visualization: The Case of the City Metaphor](https://doi.org/10.1016/j.infsof.2019.06.007) (IST 2019). 42 participants: the city helped correctness over Eclipse, and immersive VR was faster than the screen.
- [CodeCity: On-Screen or in Virtual Reality?](https://doi.org/10.1109/VISSOFT52517.2021.00011) (VISSOFT 2021). 24 participants on a Quest-class headset: VR was much faster with comparable correctness.
- [Exploring Software Cities in Virtual Reality](https://doi.org/10.1109/VISSOFT.2015.7332423) (Fittkau et al., VISSOFT 2015). An early VR software city.
- [The influence of the city metaphor and its derivates in software visualization](https://doi.org/10.1016/j.jss.2024.111985) (JSS 2024). A mapping study of 406 publications. Start here for the field overview.
- [BabiaXR: Facilitating experiments about XR data visualization](https://doi.org/10.1016/j.softx.2023.101587) (SoftwareX 2023) and [ExplorViz: Research on software visualization, comprehension and collaboration](https://doi.org/10.1016/j.simpa.2020.100034) (Software Impacts 2020). The two open-source web-based platforms.

**Videos** (titles and lengths only)
- [Collaborative Software Visualization for Program Comprehension](https://www.youtube.com/watch?v=MYAkRMWLVD8), ExplorViz, 4:33.
- [CodeHouse: VR Code Visualization Tool](https://www.youtube.com/watch?v=rVhOaGrC_ac), Hitachi, 4:44.
- The three CodeCity videos linked in 4.1.

**Meta docs**
- [Hand tracking overview (Unity)](https://developers.meta.com/horizon/documentation/unity/unity-handtracking-overview/) for the platform rules.
- [IWSDK](https://iwsdk.dev/) and its [examples](https://github.com/meta/immersive-web-sdk/tree/main/examples) (`poke`, `grab`, `gaze-pinch`, `layers`) for the interactions you'll need: poke a fire, grab a roof, pinch to zoom.

**What to read first.** The 2021 VR-versus-screen paper (it is your evidence), the CodeCharta live demo (what a good city looks like), and the Manavarya09/code-city README (the minimal client-side pipeline).

---

## What I did not do
- I did not run any of the repos listed. Notes on what they do come from READMEs, descriptions and file listings. Anything that needs a run is marked ⚠.
- I did not read the full text of the papers or the videos. Summaries come from abstracts, search excerpts and titles.
- Not linked on purpose: ExplorViz's demo (the domain now redirects elsewhere), explorviz.net (now points to an unrelated site), Wettel's old CodeCity pages (they return errors), and BoardGameGeek (blocks scripts, so I linked Wikipedia instead).

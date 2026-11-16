> Copied from the team's research workspace on 16 Nov 2026. 2026 project names/links removed by request; 2025 winners kept.

# Meta Horizon Start Developer Competition 2025 — winners analysis, and 2026 productivity ideas

*Prepared for Saurabh Gupta's Meta VR Start Developer Competition 2026 entry. All winner names, prizes, teams, and project details below were taken from official or primary sources listed in §1. Where something could not be fetched, that is stated. "Why it won" is inferred from the public writeups plus the published judging criteria — Meta did not publish per-winner judge commentary.*

---

## 1. Sources and method

Fetched and read:

- Official winners blog (canonical list of all 32 awards): [Meet the Meta Horizon Start Developer Competition Winners](https://developers.meta.com/horizon/blog/meta-horizon-start-developer-competition-meet-the-winners/) (dated 23 Dec 2025). The 2026 competition overview at [start-developer-competition-26.devpost.com](https://start-developer-competition-26.devpost.com/) links this page as "last year’s winning submissions." A local copy of the 2026 overview is at `(local research workspace) raw/overview-live.html`.
- Last year's Devpost: [start-developer-competition.devpost.com](https://start-developer-competition.devpost.com/). Project gallery (655 submissions listed on Devpost): [project-gallery](https://start-developer-competition.devpost.com/project-gallery). Winners-ordered gallery, whose JSON-LD enumerates all 32 winners and prize titles: [project-gallery?order_by=prize_winners](https://start-developer-competition.devpost.com/project-gallery?order_by=prize_winners). Official rules and 2025 tracks: [rules](https://start-developer-competition.devpost.com/rules).
- Every winner's Devpost project page (full writeup, team, Built With tags, embedded demo video, outbound links). Local HTML is in `(local research workspace) past-winners/`.
- Meta's short winners recap video (not a substitute for the project demos): [YouTube, 3:14](https://www.youtube.com/watch?v=0zR7iy9YTeg).

Not claimed:

- I did not sit through every demo video frame-by-frame, and no official judging score sheets were published. Video observations below come from the embedded YouTube links, gallery image captions, and what the teams wrote about their trailers.
- Store pages are listed only when the Devpost page itself linked one. Missing store links are marked "not listed," not "does not exist."
- The official blog's link for Flows.xr pointed at the bare host `http://Flows.xr/` (a typo). The correct Devpost page, confirmed by the gallery JSON-LD, is [devpost.com/software/weavexr](https://devpost.com/software/weavexr).

Rival checks for the 2026 ideas were run against the public 2026 Devpost submissions (~382 badge-verified entries, census of 15 Nov 2026). **By request, this repo copy names no 2026 projects**; overlap is described generically (e.g. "several similar 2026 entries", "no similar 2026 entries found").

---

## 2. 2025 vs 2026 — what actually changed

The 2025 competition (5 Nov–9 Dec 2025; winners announced 23 Dec 2025) had **no Productivity division**. Main tracks were Entertainment, Lifestyle, and Gaming (Casual + Social). Lifestyle was defined as enhancing daily life, "how they get things done, learn new skills, and connect with others around shared interests" — the closest ancestor of 2026 Productivity. Special awards separately rewarded hand interactions, Passthrough Camera Access with AI, Immersive Web SDK, Spatial SDK, React Native, and Android (utility, Quest-unique features, Travel Mode). ~2,900 developers submitted more than 650 projects for a $1.5M pool across 32 awards.

Judging weights were already the same as 2026: 25% each Innovation & Creativity, Experience Design, Technical Implementation, Polish & Presentation. Entries could be NEW or significantly UPDATED. Hands-only was a *special award*, not a requirement.

**2026 implications:** Productivity is now a first-class $70K / $35K division, so a "useful sitting-at-a-desk" app can compete for a main prize, not only a $25K utility award. Hands-only end-to-end is now mandatory. New special awards (Agentic Interaction, First Five Minutes, Reason to Come Back, Accessibility Forward, Boldest Original Concept, Social & Multiplayer) map cleanly onto things 2025 winners already did well. The 2026 field of 382 already contains a crowd of generic "spatial desks," "agentic workspaces," and "memory palaces" — copying MarketView's multi-panel finance desk or Flows.xr's node graph is no longer a gap.

---

## 3. Complete winners list (all 32)

Prize amounts are from the official blog. Teams: official blog first, then Devpost names where they differ. "Why it stood out" is an inference, not a Meta quote.

### Best Casual Game — $100,000 / $60,000 / $30,000

| Place | Project | Team | One-line | Why it stood out (inferred) | Links |
|---|---|---|---|---|---|
| Winner, $100K | **Tiny Golf** | BRAINZ GAMIFY — Dominik Pultera & Robin Pultera | Mixed-reality mini golf on your table; a pinch is the swing; you can also build courses by hand. | Instantly understood toy + one perfect hand verb ("pinch is the king of couch play"). Shipped like a store product in ~30 days, one programmer + one designer. | [Devpost](https://devpost.com/software/tiny-golf) · [Video](https://www.youtube.com/watch?v=e1_YPNKMR0E) · Store: not listed |
| Runner-up, $60K | **Little Critters – Advanced hand tracking update** | Purple Yonder — James Howard | Update to a shipped MR tower-defense game: hands plus real walls/floors/ceilings change how enemies get squashed or knocked off. | A *significant* update, not a reskin. Hands do things controllers cannot, using MRUK scene context. | [Devpost](https://devpost.com/software/little-critters) · [Video](https://www.youtube.com/watch?v=i2qJPLwJRSw) · [Store](https://www.meta.com/experiences/little-critters/8692631140830732/) |
| Honorable mention, $30K | **Le Dino Labo** | Realcast — Nino Sapina, Diego Fernandez-Bravo, Elise Combette, Hugo Teyssier | Assemble a scientifically grounded T. Rex bone by bone, then see it at true scale. | Familiar wonder (dinosaurs) + one delayed awe beat (full-scale reveal). Built in three weeks, core loop polished, extra features cut on purpose. | [Devpost](https://devpost.com/software/realcast-game-working-title) · [Video](https://www.youtube.com/watch?v=OciTlQDsUHU) · Store: not listed |

### Best Social Game — $100,000 / $60,000 / $30,000

| Place | Project | Team | One-line | Why it stood out (inferred) | Links |
|---|---|---|---|---|---|
| Winner, $100K | **Saber Punks** | EFish Games — Daniel Little & Xypher Orion | VR PvP sword fighting with 12 characters, 150+ motion-based combos, now with colocated MR, room collision and a spectator mode. | Deep existing combat system *plus* a real "fight in your living room / hide behind the couch" update. Motion combos need no buttons. | [Devpost](https://devpost.com/software/saber-punks) · [Video](https://www.youtube.com/watch?v=nYZlCRHhAB4) · [Steam](https://store.steampowered.com/app/1686240/Saber_Punks/) · [Site](https://www.saberpunks.com) |
| Runner-up, $60K | **FALCON** | Wild Vision Games | Fly RC-style vehicles in your real room or in VR; colocated and online multiplayer; build your own tracks. | The room becomes an airfield. Social + creation tools, Unreal/C++. | [Devpost](https://devpost.com/software/falcon-shgxn9) · [Video](https://www.youtube.com/watch?v=CwuS1JffbFs) · Store: not listed |
| Honorable mention, $30K | **Pack Attack** | Sunflovr — Andrew Douglas & Ines Hilz | Asymmetric party game: the Quest player is in an MR post office; friends join on their phones via a website (no app install) and pack parcels. | "Just works" social: friends play in seconds from a URL. Designed chaos in the Overcooked family, but cross-device. | [Devpost](https://devpost.com/software/pack-attack) · [Video](https://www.youtube.com/watch?v=YkWO2qdyeME) · [Web companion](https://pack-attack.app) |

### Best Entertainment Experience — $100,000 / $60,000 / $30,000

| Place | Project | Team | One-line | Why it stood out (inferred) | Links |
|---|---|---|---|---|---|
| Winner, $100K | **DreamSpace** | Pranay Garg & Shashank Vaibhav | Turns any real room into an immersive MR environment — virtual windows, storms, skylines, proximity passthrough — meant for everyday use (movies, browsing, hanging out). | The first-seconds awe is unmistakable (your wall opens onto New York or a storm) *and* it is built for comfortable daily wear, not a one-shot demo. MRUK + custom shaders, two new environments added during the contest. | [Devpost](https://devpost.com/software/dreamspace-6g8rzm) · [Video](https://www.youtube.com/watch?v=ogtDlO9M6jA) · [Store](https://www.meta.com/en-gb/experiences/dreamspace-mixed-reality-home/9449316705178989) |
| Runner-up, $60K | **Photon** | Photon XR — Jerry Zhang & Noy Wang | Spatial-video sharing platform, including 2D-to-3D conversion, VR180, and spatial lighting. | A real content platform with craft-level lighting, not a single clip. Significant updates during the contest (VR180, discovery, UI rewrite). | [Devpost](https://devpost.com/software/photon-bm9p31) · [Video](https://www.youtube.com/watch?v=5WpxaLfLWOo) · Store: not listed |
| Honorable mention, $30K | **(m)ORPH Mixed Reality Music Experience** | Kasson Crooker | Songs become grab-able sound objects in your real room; colocated multiplayer; hands and microgestures only. | A full reinvent of a 2021 VR music app into MR. Room-alive-with-sound is a clear hook. (The writeup honestly flags a colocation-orientation bug.) | [Devpost](https://devpost.com/software/m-orph-mixed-reality-music-experience) · [Video](https://www.youtube.com/watch?v=tDy0m9KRpzg) · [Store (Morph VR)](https://www.meta.com/en-gb/experiences/morph/5857833644234313/) |

### Best Lifestyle Experience — $100,000 / $60,000 / $30,000

This is the 2025 category closest to 2026 Productivity. The $100K winner was a creative-learning tool, not a spreadsheet.

| Place | Project | Team | One-line | Why it stood out (inferred) | Links |
|---|---|---|---|---|---|
| Winner, $100K | **Inkphony** | Lucas Martinic, Tejas Shroff & Nadja Pirchheim | Everything around you becomes an instrument. Write notes on real surfaces with your finger; PCA + Gemini turns real objects into sounds you can "pinch" out of the world. | Everyday objects become a new instrument in one pinch — the lifestyle $100K went to a *magical use of the room*, plus a real composition-learning loop, plus production-grade PCA/depth alignment. | [Devpost](https://devpost.com/software/inkphony) · [Video](https://www.youtube.com/watch?v=T6NyCAvU0sk) · [Store short link](https://www.meta.com/s/8YgVAmyJM) |
| Runner-up, $60K | **The Tarot Experience VR – AI Edition** | Adam James Malone (IMRSR) | A quiet three-card reading: start in MR, ask one question, enter a symbolic space, get a gentle AI interpretation, return to your room. | Restraint. AI supports reflection instead of spitting predictions. A rare contemplative VR tone, built as a significant update. | [Devpost](https://devpost.com/software/the-tarot-experience-vr-ai-edition) · [Video](https://www.youtube.com/watch?v=DnuDY5wk3rE) · Store: not listed |
| Honorable mention, $30K | **IMMERROCK** | IMMERROCK MEDIA INC — Yanira Moguel & Evanna Roman | Mixed-reality guitar/bass learning; this update adds real-time note detection, exercises that evolve with you, and clearer rewards. | Adaptive skill learning on a *real* instrument. A live-app overhaul judged as a significant update, with celebration and feedback design that makes practice feel good. | [Devpost](https://devpost.com/software/immerrock) · [Video](https://www.youtube.com/watch?v=98HlGIi8KMs) · [Store](https://www.meta.com/en-gb/experiences/immerrock/7334845636643834/) |

### Best Implementation of Hand Interactions — $50,000 each (3 winners)

| Project | Team | One-line | Why it stood out (inferred) | Links |
|---|---|---|---|---|
| **Hand Survivor** | Tim Van Leemput & Denis Tribouillois | Vampire-Survivors-like wave fighter played only with hands: a "physical" hand that squishes enemies and a "spirit" hand that casts gesture spells. | Hands are the genre hook, not a skin. Custom gesture recognition, build-defining skill picks, performance work for standalone FPS. | [Devpost](https://devpost.com/software/handsurvivor) · [Video](https://www.youtube.com/watch?v=8RnPp3ORdL8) |
| **Pocket Lands** | Thomas van den Berge | Voxel sandbox: a lap-sized diorama in passthrough that can open across the living-room floor, or you can drop into first-person VR. Shaped with your hands. | A classic "wow" (the HoloLens Minecraft diorama) actually shipped, at a claimed smooth framerate, by a solo dev. Scale shift is the awe beat. | [Devpost](https://devpost.com/software/pocket-lands) · [Video](https://www.youtube.com/watch?v=VEUu8n77FVg) |
| **Awesome Hand** | KAYAC GAMES. Official blog: Takashi Sato, Ryosuke Sugimoto, Ryota Hayashi. Devpost lists Takashi Sato and Ryota Hayashi only. | Physics puzzles where your tracked hands *are* the ramps, bridges and guides for a ball. | The most literal "hands are not controllers" design in the field. Simple to understand, uniquely impossible without hand meshes as colliders. First VR game for the team. | [Devpost](https://devpost.com/software/awesome-hand) · [Video](https://www.youtube.com/watch?v=LB8Yeluiems) |

### Best Implementation of Passthrough Camera Access (PCA) with AI — $50,000 each (3 winners)

These are the 2025 projects closest to 2026's Agentic Interaction award, and two of them are clearly "get things done" apps.

| Project | Team | One-line | Why it stood out (inferred) | Links |
|---|---|---|---|---|
| **Language IRL** | Parker Howell & Riko Balakit | An AI tutor (Monobonobo) floats in your room, labels real objects, and drills you by voice. Room = vocabulary list. | AI is a character in your space, not a chat box. CV + speech + gestures + an expressive companion, built by two people in under a month. Spatial context as the pedagogic idea. | [Devpost](https://devpost.com/software/see-and-speak-spanish) · [Video](https://www.youtube.com/watch?v=1RC030TLCys) |
| **Chores.gg** | Conway Anderson & Hayden Jackson | Passthrough + Gemini detects chore activity and awards XP, streaks and a leaderboard. | Vision AI aimed at a boring daily job, with the honesty to drop a feature (spatial anchors on chore spots) when Gemini was not consistent enough. | [Devpost](https://devpost.com/software/ping-t6exlb) · [Video](https://www.youtube.com/watch?v=Sm9pWQHiZU4) |
| **Flows.xr** | Binto K Bino | Mixed-reality workbench: chain headset inputs (camera, audio, depth, text, spatial data) into AI blocks; an assistant helps you build the graph. | The only 2025 winner that is a *developer/productivity tool*. PCA + AI as a spatial node graph, with a cooking-assistant preset as the demo. | [Devpost](https://devpost.com/software/weavexr) · [Video](https://www.youtube.com/watch?v=fbFu2ehXxFU) |

### Best Immersive Experience Built with Immersive Web SDK — $30,000 each (2 winners)

| Project | Team | One-line | Why it stood out (inferred) | Links |
|---|---|---|---|---|
| **The Nanauts** | James C. Kane | Three AI robot explorers survey your real room; you talk to them; Llama 3.3 judges intent. IWSDK / WebXR, solo, ~3 weeks. | Agentic characters that use scene understanding and PCA, delivered on the web path, with real personality work (procedural animation and voices). | [Devpost](https://devpost.com/software/nanauts) · [Video](https://www.youtube.com/watch?v=7r-29fp4Nbg) · [Live](https://jameskane05.github.io/nanauts/) · [GitHub](https://github.com/jameskane05/nanauts) |
| **Dun Jun** | Shabahat M Ayubi & Nikita Fernandes | Hands-only dungeon survival in the Quest browser: punch, slap, poke; menus are gestures too. | Proves IWSDK can do tight action games, not only experiments. Custom gesture system, live at [dunjun.world](https://dunjun.world/). | [Devpost](https://devpost.com/software/dunjun) · [Video](https://www.youtube.com/watch?v=BpONkM3Co7A) · [GitHub](https://github.com/sma1692/DunJun) |

### Best Immersive Experience Built with Spatial SDK — $50,000 each (2 winners)

| Project | Team | One-line | Why it stood out (inferred) | Links |
|---|---|---|---|---|
| **Compile Crops** | Gulzar Ahmed (Devpost: Gulzar A) & Grace Park | Desk/floor MR farm where you program drones with code blocks (loops, conditions) and watch them plant, water and harvest. | Learning to code with immediate spatial cause-and-effect. Custom AST highlighting as code runs. Edutainment, not a toy farm. | [Devpost](https://devpost.com/software/compile-crops) · [Video](https://www.youtube.com/watch?v=ZNeVG0tUZiQ) |
| **— Mise —** | Official blog: Ojiro Ochiai. Devpost team is listed as "Private user." | AR cooking assistant: digital pantry, AI recipes, step-by-step spatial instructions, hands-free timers, and a vision/voice sous-chef that can look at your pot via PCA. | Solves a real kitchen job (dirty hands, decision fatigue) with Spatial SDK anchors, hand tracking, and a seeing AI. Closest 2025 analogue of a modern "agent in your workplace." | [Devpost](https://devpost.com/software/mise-9wvaib) · [Video](https://www.youtube.com/watch?v=VQT4SE5cFgw) |

### Best Experience Built with React Native — $25,000

**Magic Wonders** by Federico Perez & Martin Perez (studio name Magic Wonders). Gesture-based spellcasting that also drives a real smart home via Alexa, plus online dueling and a physical IMU wand. The "magic follows you into your house" hook, plus a real hardware + TFLite gesture model, plus a substantial contest update (multiplayer, bots, tutorials). [Devpost](https://devpost.com/software/magic-wonders) · [Video](https://www.youtube.com/watch?v=NTN3Vbj88MY). Note: a 2026 entry cannot depend on a custom wand if the experience must be completable hands-only; their virtual-wand path is the relevant lesson.

### Best Android App Leveraging Features Unique to Meta Quest — $25,000

**GeoPortal** by Merve Yuvaci. Built in four days after seeing the contest late. An in-flight, seated app: live flight on a holographic globe, 360° city tours when you pass landmarks, educational mini-games, offline Bluetooth multiplayer. Kotlin / Jetpack Compose, no heavy 3D engine. Solves "stuck in a seat with no map." [Devpost](https://devpost.com/software/geoportal) · [Video](https://www.youtube.com/watch?v=diRcGpDhMl8).

### Best Android Utility App — $25,000 — the only pure "productivity workspace" winner

**MarketView VR** by Gustavo Enriquez. A VR-native stock-research workspace: portfolio panel, detail chart, news. Research only, no trading. Jetpack Compose on Horizon OS, real market data, designed with Meta Horizon MCP guidance. The writeup is almost a manifesto for 2026 Productivity: resist feature creep, typography and contrast must be more generous than a finance app, spatial memory ("that chart lives *there*") is the actual advantage, and they planned a voice AI assistant as a later step rather than shipping a mess. [Devpost](https://devpost.com/software/marketview-vr) · [Video](https://www.youtube.com/watch?v=XFBR9wV8kLA).

### Best Android App for Travel Mode — $25,000

**OnTheGoVR** by Flavius Holerga & Gabriel Tiplea (Devpost: Gabi Tiplea). Offline shared cinema on a trip: local-network sync, no internet, 2D or spatial theatre, local file discovery. Spatial SDK. Solves a cramped-seat problem, end to end. [Devpost](https://devpost.com/software/syncedvr) · [Video](https://www.youtube.com/watch?v=snMBNi9eN0o) · [GitHub](https://github.com/InventiveOtters/quest-travel-app).

### Judges' Choice — $30,000 each (6 winners)

| Project | Team | One-line | Why it plausibly landed Judges' Choice | Links |
|---|---|---|---|---|
| **Into The Mind** | InnerspaceVR — Balthazar | Narrative adventure for up to 7 on Quest 3, hands only (pinch-teleport). A vessel that travels inside a professor's body and then into his dreams. | Ambition and art direction. Educational science + Inception-like turn. Unreal, pushed for Quest 3 visual quality. | [Devpost](https://devpost.com/software/into-the-mind) · [Video](https://www.youtube.com/watch?v=A2s7b85T348) |
| **OpenSoundLab** | Sphericals — Ludwig Zeller | Open-source spatial modular synthesizer in MR, now with hands; 30+ modules. Fork of abandoned SoundStage VR. | A serious creative instrument, not a gimmick, with a planned store release. Hands made a professional tool feel native. | [Devpost](https://devpost.com/software/opensoundlab) · [Video](https://www.youtube.com/watch?v=230hncihTxI) · [GitHub](https://github.com/SphericalLabs/OpenSoundLab/tree/feature/hands) · [sphericals.io](http://www.sphericals.io) |
| **Lasertag – Operator & Scene Meshing prototypes** | Julian Triveri | Turns any space into laser tag. This update: live scene meshing from Depth API, long-range occlusion, NPCs on a live navmesh, desktop operator for large groups. | Unusually honest about what is still prototype-quality, but the technical foundation (live meshing, colocation that "just works") is distinctive. | [Devpost](https://devpost.com/software/lasertag-zombies-update) · [Video](https://www.youtube.com/watch?v=FXE2ThA0RgE) · [anaglyph.dev](https://anaglyph.dev) |
| **Final Throwdown** | Fantail Games — Steven Linton, Dora de Norie, Madison Bothwell, Nathan Walker | New colocated MR minigame inside the existing *Game Night* app: 1:1 robot fists, punch friends or a boss off an arena. Short rounds, safety spacing, reach normalized, arena height adapts to the shortest (including seated) player. | Playtested with non-XR users. Social, funny, safe, accessible. A completely new mode inside a shipped product. | [Devpost](https://devpost.com/software/sumo-boxing) · [Video](https://www.youtube.com/watch?v=RI3DOfg7vhY) · [Game Night store](https://www.meta.com/en-gb/experiences/game-night/8603854472983065/) |
| **HandCraft XR: Winter Edition** | Nikita Evstigneev | Cozy, hands-only MR sandbox: build a miniature Christmas market on a virtual table in the Quest browser. Snap, scale, decorate, auto-save. | IWSDK polish: it feels like a tiny finished toy, not an SDK sample. From scratch in a month. | [Devpost](https://devpost.com/software/handcraft-xr-winter-edition) · [Video](https://www.youtube.com/watch?v=4KbKIA9H5_Y) · [Live](https://handcraft.astonishingdev.com) |
| **ModStorm Block Party** | ModStorm — Kris Johnson & Kory Fluckiger | Fast VR/web voxel party minigames. Click a link, no install; ~30MB; voice chat; 2–4 players. | Frictionless social on the open web. Variety (they prototyped a minigame a day) and a clear party loop. | [Devpost](https://devpost.com/software/party-blast) · [Video](https://www.youtube.com/watch?v=qsvlQcJF09A) |

---

## 4. Winner-by-winner notes (concept, hook, interaction, platform, polish)

Only details from the project pages and official blurbs are used here. Interaction is hands / controllers / MR as the team stated it — 2025 did not require hands-only, and several winners also supported controllers.

### Tiny Golf
Seated, table-scale MR mini golf. Hook: pinch-pull-release like a tiny Angry Birds slingshot, then grab bits and invent a course in your real room. Hands (pinch is the designed verb) and also controllers. Unity; MongoDB tagged for UGC backend. Awe is immediate and small, which helped 60/90 fps and "couch play." Polish signal: they say it could launch on the store as-is; brand, trailer, onboarding, both input modes. Likely scored high on Experience Design and Polish; Innovation is the interaction, not the sport.

### Little Critters (update)
Existing MR tower defense. Hook: squash a critter between your real palm and a real wall, or graze the surface and flick it off. Custom gesture recognizer; multiple grab shapes (pinch, crab-claw, fist); MRUK surfaces as context; tracking-loss rules so held objects are not dropped. Unity. This is the template for a winning *Adapted* 2026 entry: one new verb that only works because of Quest scene understanding.

### Le Dino Labo
Grab, inspect, snap bones in anatomical groups; then the true-scale skeleton appears. Unity, Meta XR SDK, Blender. Hook is the scale reveal. They postponed skins and ragdoll on purpose. Lesson: a three-week build can place if the core snap feel and the ending shot are right.

### Saber Punks
Adapted. Five-year combat game plus a contest-scope colo-MR / spectator / room-collision update. Unity, Photon, MRUK, LIV, bHaptics. Hook in a video: slashes pelt a real couch while you dodge in your room. Still supports the older VR combat; passthrough is the new magic. Technical Implementation is the likely strength (no-desync combat, room materials, decals).

### FALCON
Room becomes a flight arena. Hand-flown vehicles, colocated and online play, in-world track editor. Unreal, C++, EOS. Hook: a drone threads your real furniture. Social + UGC, runner-up rather than winner — Saber Punks had a deeper existing system plus a clearer combat fantasy.

### Pack Attack
Headset player in an MR warehouse; phone/browser friends pack orders; parcels land in the headset drop zone and get launched. UE5 + React web, no companion-app install. Hook is the living-room shouting, not a shader. Strong Experience Design / Social.

### DreamSpace
MR windows and whole-room environments with proximity passthrough (the real room fades back as you walk near walls). Unity, MRUK, custom sky/fog/rain shaders, day/night. Hook in the first seconds of the trailer: your actual wall is suddenly a courtyard, a storm, or a New York window. Designed as a *place you stay*, which is also a 2026 "Reason to Come Back" pattern. Comfort and blending are the craft.

### Photon
Platform: upload, convert, recommend, watch 3D / VR180 video with spatial lighting. Unity + Android + Cloudflare. Hook is the lighting on a 3D clip, plus "first spatial-video community" positioning. Update-heavy during the window.

### (m)ORPH
Sound objects orbit your real furniture; clap, smack, thumb-tap microgestures; colocated sharing. Unity 6, Meta v81, Netcode, spatial audio. Hook: the mix changes as you walk around your favourite chair. A clean "significantly updated" story (2019 VR app fully reinvented). They document a remaining shared-anchor orientation bug — honesty did not stop an honorable mention.

### Inkphony (Lifestyle winner — study this for Productivity)
Write a staff on any real surface; tap notes, scrub to erase, drag the staff. Background PCA + Gemini + depth/timestamp alignment continuously recognises surroundings and generates instrument icons/sounds without clutter. A stereoscopic "pinch the real world" shader extracts or plays a sound from a real object. Hands-first; earlier Logitech-pen path expanded. Hook: pinch an apple and it becomes a bass note. This is "AI + PCA as a new instrument," not a chatbot. Unity, PCA v81, depth.

### The Tarot Experience VR – AI Edition
MR question → symbolic VR space → three cards (Past/Present/Future) → ChatGPT/OpenAI interpretation that is written to stay open-ended → gentle return to the room. Unity, passthrough. Hook is tone, not spectacle. Lesson: AI can win Lifestyle without being flashy if the pacing is considered.

### IMMERROCK
Real guitar/bass in mixed reality; this update rebuilds the learning system (note detection, evolving exercises, Wait / Song Tempo / Song Mastery, auto speed-up and restart, celebrations). Unreal, C++. Hook: you see your real instrument, get instant feedback, and the course changes as you improve. Reason-to-come-back is the actual product.

### Hand Survivor
Seated-or-standing wave survival, pure hand tracking. Unity 6, Meta XR SDK v81, ShapeRecognizer + TransformRecognizer plus custom filters (hand facing away, two-hand distance). Hook: open a palm and a laser fires; grab and a meteor drops. They wrote about avoiding gesture clashes — a useful 2026 warning.

### Pocket Lands
Hand-sculpted voxels in a passthrough diorama that can scale from lap to room, or FPS VR. Unity, Meta SDK. Solo, engine built over a year, "became a game" in the contest month. Hook: the tiny world on your knees becomes the floor. They claim large dioramas at 90 fps depending on complexity. Interaction design note: pinch-to-place vs raycast-to-catalog conflict solved by disabling the ray when the pinch is near blocks.

### Awesome Hand
Your hand meshes are physics objects. Guide a ball with palms, use both hands as a bridge, grow a giant hand, etc. Unity. Hook in shot one: a real hand is a ramp. Controllers would break the concept, which is why it won a Hands award.

### Language IRL
YOLO/Sentis + Meta passthrough/scene + Azure speech + a custom animated mentor. Learners speak; pronunciation grading is designed to feel supportive. Hook: a labelled mug in *your* kitchen, and a character that reacts. They report it was actually useful when one teammate travelled to Germany. Long-term pitch is "AI mentor on future glasses."

### Chores.gg
PCA frames → Gemini "is this chore activity?" → XP on a brainCloud backend. Hands and head used to place UI. Hook is modest (gamified tidying) but the job is real. They cut unreliable "anchor at the dirty dish" progress tracking.

### Flows.xr
Node-graph workbench in passthrough: camera/audio/depth/text/spatial blocks wired to model blocks; an AI assistant authors or edits the graph. Unity, OpenXR, Meta XR SDK. Hook: a cooking-assistant workflow assembled in mid-air. This is the 2025 "productivity tool" special-award winner. In 2026 the same idea is already surrounded by agentic-workspace entries — do not clone the node graph.

### The Nanauts
IWSDK, scene-understanding navmesh, PCA environment maps, Llama 3.3 on AWS, WebXR hit-test portals, microgestures or controllers. Hook: tiny robots walk your real floor and ask what a lamp is. Solo in three weeks. They tried SAM 3 / SAM-3D, then pivoted when Quest browser camera intrinsics were too unreliable — a useful 2026 scoping lesson.

### Dun Jun
IWSDK + Three.js + Havok, custom static and dynamic gesture detector, 72–90 fps target (they mention Quest 2 as well). Hook: a creature flies at your face and you slap it. Instantly readable First Five Minutes.

### Compile Crops
Spatial SDK + Kotlin ECS + Jetpack Compose + WebView "compiler" with a Kotlin–JS bridge and a custom AST that highlights the running line. Drones automatically plant/water/harvest from the program. Hook: you write a loop and a drone on your desk obeys it. Learning, not a generic farm sim.

### Mise
Spatial SDK, spatial anchors for wall panels, hand tracking for hygiene, OpenAI vision LLM on PCA so you can ask "is this water boiling?" Pantry + dietary constraints + micro-task recipes + voice. Hook: floating step and timer in a real kitchen, and the assistant can *see* the pot. They specifically designed panels so they do not hide knives or the stove.

### Magic Wonders
React Native, Alexa smart-home, BLE wand with on-device TFLite LSTM gestures, online duel. Hook: a gesture turns your real lights the colour of the spell. For 2026, the completable-without-hardware path matters more than the custom IC.

### GeoPortal
Kotlin, Compose Canvas globe (no engine), AviationStack + 14k-city landmark database, ExoPlayer 360° tours, offline Bluetooth games. Hook: as the plane passes a city, you "drop" into a 360 tour. Seated by definition. Built in four days — proof that a tight, well-chosen utility can still win a special award, though a 2026 main-track winner will need more polish than a four-day app unless the hook is extraordinary.

### MarketView VR
Three-panel research desk, Alpha Vantage + Finnhub, Compose, VR typography iterated for contrast and scale. Hook is quieter: a personal "mission control" without buying three monitors. They explicitly deferred voice AI. In 2026 this exact "stock panels in space" idea is already taken again (a similar 2026 entry exists) and was never the $100K Lifestyle pattern.

### OnTheGoVR
Host a local stream, friends join with a code, pause/play syncs, works on a hotspot with no internet. Spatial SDK cinema environments. Hook: two seats on a train, one shared film, no cables.

### Into The Mind
Up-to-7-player narrative, Unreal, hand tracking, pinch teleport. Hook: shrinking into a body, then a dream-world tonal shift. Polish is cinematic rather than toy-like.

### OpenSoundLab
Unity + C/C++ DSP, passthrough, Mirror multiplayer, new hand-tracking prototype. Hook: patch a modular synth in your real room with your fingers. Open source, taught and performed live.

### Lasertag update
Depth API → multithreaded surface-net mesh → better occlusion and NPC navmeshes; Colocation Discovery; desktop operator. Unity. Hook: the real building *is* the arena, now with zombies that use the live mesh. They list stutter and triangle-count issues in the writeup.

### Final Throwdown
Unity, Presence Platform, MRUK, Netcode. Local physics on each headset for zero-latency punches; hits replicated. Safety warnings if you walk; arena scales to the room; reach equalized for kids and adults; height follows the shortest headset so seated play works. Hook: you look at your friend and punch a robot that is mapped to their real hands. Playtested at a library.

### HandCraft XR: Winter Edition
IWSDK, Three.js, Havok, custom pinch-spawn, two-hand scale/rotate, snapping, instancing, adaptive shadows, local save. Hook: a tiny lit Christmas market grows on the table in passthrough, in the browser, no install.

### ModStorm Block Party
Three.js + WebSockets + WebRTC voice + WebXR, same JS on VR/mobile/desktop. Hook: paste a URL, start a party, nine short chaotic rounds. Known issues honestly listed (rare audio-context / controller-GLTF glitches, fixed by refresh).

---

## 5. Cross-cutting winning patterns

Each pattern is backed by named 2025 winners. These are the repeating moves, not official rubric language.

1. **One verb a stranger understands in two seconds.** Tiny Golf (pinch-to-shoot), Awesome Hand (hand is a ramp), Dun Jun (slap the monster), Final Throwdown (your fist is the fist), Le Dino Labo (snap the bone), Pack Attack (pack / launch). They picked a familiar frame so the video can spend its time on the *feel*, not the rules. This is what 2026's First Five Minutes award is for.

2. **The real room is the stage, not wallpaper.** DreamSpace (windows, storms), Inkphony (objects become instruments), Language IRL (room is the classroom), Mise (the actual kitchen and pot), Little Critters (real walls participate), Saber Punks / FALCON / Lasertag (furniture is cover or an airfield or an arena), (m)ORPH (the mix lives in your furniture), Pocket Lands / HandCraft XR (a world on your real table). The awe shot is almost always "my familiar room just did something impossible."

3. **Hands invent new verbs; they are not a controller remap.** Little Critters (surface-aware squash), Inkphony (write on a wall, pinch a real object), Hand Survivor (physical vs spirit hand, distinct gestures), Awesome Hand (hand meshes as colliders), Pocket Lands (sculpt the diorama), OpenSoundLab (patch cables by hand), Compile Crops (snap code, drones obey). James Howard wrote this explicitly: look beyond a drop-in replacement for controllers.

4. **Comfort, sitting, and "I could use this tonight" beat spectacle-only demos.** Tiny Golf called pinch "the king of couch play." DreamSpace is pitched as a daily backdrop for movies and browsing. MarketView, GeoPortal and OnTheGoVR are seated by design. Final Throwdown lowers the arena to the shortest/seated player and normalizes reach. 2026 is explicitly seated-friendly; this pattern already won.

5. **Treat the submission as a product, not a lab slice.** Tiny Golf: identity, trailer, onboarding, both input paths, "could ship today." Photon, Inkphony, IMMERROCK, Magic Wonders, Little Critters, Saber Punks: live or long-running apps with a clearly scoped, deep contest update. HandCraft XR and Le Dino Labo cut content to polish the core loop. MarketView resisted feature creep for a true P0. Polish & Presentation is 25% of the score; several writeups mention playtests (Tiny Golf, Final Throwdown's library test, Language IRL).

6. **The trailer has a single transformation in the first seconds.** DreamSpace: wall becomes a skyline. Pocket Lands: lap diorama eats the floor. Le Dino Labo: assembled bones become a life-size rex. Inkphony: a real object is pinched into a note. Language IRL: your mug is labelled and a tutor appears. Mise: a timer and a step hang over a real stove. If the first 30 seconds need a voice-over to explain the premise, it is already behind these winners.

7. **AI is a character, a pair of eyes, or a collaborator in the room — not a floating ChatGPT panel.** Language IRL (tutor), Mise (sous-chef that can see the pot), Inkphony (background vision that births instruments), Chores.gg (vision that scores real work), Flows.xr (assistant that authors a workflow), The Nanauts (explorers you talk to), The Tarot Experience (a quiet interpreter). Thin wrappers were already a bad idea in 2025; they are explicitly discouraged in 2026.

8. **Social winners removed friction.** Pack Attack and ModStorm: join from a URL, no install. OnTheGoVR: offline code join. Final Throwdown: setup guides people to safe marks. Saber Punks and FALCON: colocated "same room" play. GeoPortal: Bluetooth on a plane. "It just works" is the actual social innovation.

9. **A significant update can beat a new prototype — if the new piece is the point.** 2025 officially allowed NEW or UPDATED. Winners in that mold: Little Critters, Saber Punks, Inkphony, IMMERROCK, Photon, (m)ORPH, OpenSoundLab, Lasertag, Final Throwdown (new mode in Game Night), Magic Wonders. The update has to be a new verb or a new context (hands + room, PCA + AI, colo MR), not a content pack.

10. **Scope honesty and one-loop completeness beat a half-finished platform.** Le Dino Labo postponed skins. MarketView shipped three panels. Chores.gg dropped broken anchors. The Nanauts dropped SAM 3. Lasertag and (m)ORPH still won special/honorable or Judges' Choice while documenting remaining bugs — but the main $100K winners feel complete in the demo. For a 2–3 day 2026 build, this is the difference between a prize and a gallery page.

### What the "productivity-like" 2025 winners specifically did

There was no Productivity prize. The work that would now sit in that division lived in Lifestyle, PCA+AI, Spatial SDK, and Android Utility:

- They picked a **real daily job** (compose, practice guitar, learn a language, cook, tidy, program a drone, research a portfolio, survive a flight or a train) and made the first use feel like a magic trick, not a dashboard.
- The **$100K Lifestyle winner was Inkphony, not MarketView.** Useful multi-panel workspaces won a $25K special award. The big prize went to "pinch the world and it becomes music." A 2026 Productivity entry should still have that kind of visual hook, or it will lose Innovation to yet another spatial desk.
- Learning winners (IMMERROCK, Language IRL, Compile Crops) used **immediate physical feedback** and a reason to return (evolving exercises, stickers that stay, a farm that grows).
- Utility winners (MarketView, GeoPortal, OnTheGoVR, Mise, Chores.gg, Flows.xr) were **narrow and seated**, solved one job end-to-end, and used Quest-only capabilities (passthrough, anchors, PCA, Travel Mode, generous spatial layout) rather than porting a phone app.
- They kept typography, UI density and AI latency under control (MarketView, Mise). A cramped Bloomberg clone in a headset is how you lose Experience Design.

---

## 6. Ten fresh 2026 Productivity ideas

Constraints used: hands-only, seated, Quest 3/3S at 60 fps, mixed-reality friendly, a visible awe beat in the first 30 seconds of a <3-minute video, a natural agent where it helps, feasible for a solo (or very small) team in roughly 2–3 days with AI coding help, and **not** in a lane the 2026 field has already packed.

**Lanes I would not enter** (crowded in the 2026 field, or already won in 2025). 2026 entries are described only by count, not name:

- Generic spatial desks / agentic workspaces / "data capsules" — crowded: 15+ similar 2026 entries.
- Memory palaces — crowded: 3 similar 2026 entries.
- Stock / trading desks — 2025 MarketView VR won; at least 1 similar 2026 entry.
- Language labels on real objects — 2025 Language IRL won; at least 1 similar 2026 entry.
- Cooking assistants / kitchen games — 2025 Mise won; at least 1 similar 2026 entry.
- Chore XP — 2025 Chores.gg.
- Presentation / meeting rehearsal against AI people — crowded: 3+ similar 2026 entries.
- Node-graph AI workbenches — 2025 Flows.xr, plus several 2026 agent-tool entries.
- ASL *tutors* (ghost hands teaching letters/signs) — 2+ similar 2026 entries.
- E-book / Kindle-style readers — 2+ similar 2026 entries.

Use a **generic, unbranded** form, paper, or repo in the demo (no government, university, GitHub, or product logos) to stay inside the no-branding rule.

### 1. Repo City — walk your codebase as a city on the desk

**Pitch.** Paste or drop a small repo (or a prepared demo repo). On your real table it rises as a city: files are buildings, folders are blocks, import/call edges are streets, test coverage tints the roofs, and git history is a stack of archaeological layers you can peel. An AI "architect" walks with you, answers "why is this coupled?", and a failing test appears as a fire you pinch out, following the smoke to the responsible function. Seated, hands only: pinch to enter a building and the file unrolls as a wall of tangible functions.

**Awe moment.** A messy project becomes a tiny, living city in one breath; a red roof catches fire and you lean in.

**Patterns used.** 1 (instantly readable metaphor), 2 (city sits on the real desk), 6 (transformation in the first seconds), 7 (AI as a guide, not a chat panel), 10 (demo one repo, one bug, one tour).

**Target prizes.** Productivity; Boldest Original Concept; Agentic Interaction; First Five Minutes.

**Rival check (2026, generic).** No similar 2026 entry found for "files as buildings" / code-as-a-city. A handful of 2026 entries are adjacent but do different jobs (an architecture/outage sandbox, a task-dependency graph, a prompt-to-concept-graph tool, a networking-hardware trainer, an office of AI agents). Stay visually distinct from second one: this is *your code* as architecture.

**Feasibility.** High if the demo is one frozen repo parsed to JSON (file tree + imports + one failing test) and the "AI architect" is scripted plus one live LLM question. Do not try to parse any GitHub URL live.

### 2. Page Lift — diagrams stand up off a real page

**Pitch.** You set a real textbook page, printout, or handwritten sheet on the desk. Passthrough + PCA + a vision model recognises the figure; the diagram lifts off the paper into a 3D object you can explode, rotate, and ask about ("what happens if I open this switch?"). Text stays anchored to the real page; only the figure becomes spatial. Hands: pinch to lift, two-hand scale, flick to explode into labelled parts.

**Awe moment.** A flat circuit (or anatomy, or free-body diagram) climbs off the paper and hangs in the air above the actual ink.

**Patterns used.** 2, 6, 7 (AI that *sees* the page), 4 (seated desk), Inkphony/Mise's "the real object is the interface."

**Target prizes.** Productivity; First Five Minutes; Agentic Interaction; maybe Accessibility Forward (a small diagram becomes inspectable at any scale).

**Rival check (2026, generic).** No similar 2026 entry found for diagrams lifting off a printed page. Adjacent 2026 entries go the opposite direction (tracing a virtual picture onto paper), read e-books, or build molecules from scratch. Open, if the trailer starts on a real sheet of paper.

**Feasibility.** High with one prepared demo page and a pre-built 3D model, plus one live PCA "what is this diagram?" call so the agent is real. Do not promise arbitrary textbooks.

### 3. Paper Unfold — a dense form becomes a conversation

**Pitch.** A real, generic form (visa-style, job application, hostel or exam form — designed by you, no official marks) sits on the desk. Fields lift into a short stack of plain-language cards. You answer by voice or by pinching choices. An agent explains jargon ("this box is asking X, you usually attach Y") and checks consistency. Answers visually write themselves back onto the paper.

**Awe moment.** A hostile page of tiny boxes unfolds into three clear questions hanging over your real form, then folds back, filled in.

**Patterns used.** 1, 2, 4, 6, 7, Mise's "split a hard job into micro-tasks," MarketView's "do not ship a cramped clone of the paper form in 3D."

**Target prizes.** Productivity; Agentic Interaction; Accessibility Forward (jargon translation, large spatial fields); First Five Minutes.

**Rival check (2026, generic).** No similar 2026 entry found for form filling. One 2026 game has you inspect suspicious messages/receipts; one general assistant pins notes onto desks. Stay specific: the paper is the interface.

**Feasibility.** High. One custom form, one OCR/vision pass (or even QR/fiducials on your demo sheet if OCR is risky in two days), scripted field logic, one LLM jargon explainer.

### 4. Citation Sky — a literature review you can hold

**Pitch.** You drop a few paper titles or a small bibliography (your own demo set, or pasted references — not a branded publisher dump). Over the real desk they become a constellation: each paper is a globe you can pinch open to an abstract card; citation links are threads; a survey "spine" is a brighter path. Ask "what did people do after this 2019 method?" and a thread lights up. Seated; look up, pull a thread down, cluster papers into a "related work" pile.

**Awe moment.** A typed bibliography detonates into a night sky of papers above your lamp; pulling one thread lights the descendants.

**Patterns used.** 2, 6, 7, 10 (fixed corpus for the demo), DreamSpace-like "the ceiling changes," but in service of actual research work — a natural fit for a final-year IIT student.

**Target prizes.** Productivity; Boldest Original Concept; Agentic Interaction; Reason to Come Back (your real reading list grows).

**Rival check (2026, generic).** No similar 2026 entry found for literature review / citation graphs. A few 2026 entries read files or build concept/news graphs from prompts. Keep the trailer obviously "these are papers," not another mind-map.

**Feasibility.** High with 8–15 pre-embedded papers and real citation edges, plus one live "explain this cluster" LLM call.

### 5. Hands of a Master — apprentice to a recorded craft, on real paper

**Pitch.** Pick *one* desk craft (recommended: calligraphy or a short character/stroke set, or a single real-paper fold — not virtual origami). A master's recorded hands appear as a translucent overlay on your real hands and on the real paper/pen. You follow a stroke; the system scores shape, order and pressure-proxy (speed/path). An agent coaches one thing at a time ("slower on the downstroke"). Sessions are five minutes; yesterday's worst stroke comes back tomorrow.

**Awe moment.** Ghost hands settle over your own and write a perfect stroke on the real page; yours follows, and the ink is real.

**Patterns used.** 3 (a verb only hands can teach), 4, 5 (one loop polished), 7 (coach), IMMERROCK's adaptive practice, Language IRL's "learning in your space," plus 2026 Reason to Come Back and Accessibility (tempo, mirrored angle, stroke-by-stroke feedback).

**Target prizes.** Productivity (skill learning sits in this division); Accessibility Forward; Reason to Come Back; maybe First Five Minutes.

**Rival check (2026, generic).** No direct rival found for apprenticing to a master's recorded hands on real paper. Adjacent 2026 entries: a couple of ghost-hand sign-language tutors, a picture-tracing overlay, a virtual-paper puzzle, virtual workbenches, hand-rehab/therapy apps, and a hand-hygiene trainer. Name the craft (e.g. calligraphy) in the first seconds.

**Feasibility.** Medium-high if you record one master sequence yourself and score 2D stroke paths over a marked page. Do not attempt pottery, sitar, or live force-feedback. Real ink on real paper is the awe; keep the library to one script.

### 6. Sign Bridge — a live two-person conversation, not a tutor

**Pitch.** Two people at a real table: one signs, one speaks. The headset wearer sees captions and a mid-table signing avatar that turns their speech into a limited, clearly labelled sign vocabulary; sign input is recognised at least for a demo set (or, if recognition is too risky in two days, the signer uses a "confirm the gloss" pinch on suggested words while the speech→sign direction stays live). This is a *conversation tool*, not an A–Z lesson.

**Awe moment.** You speak a sentence and a calm avatar signs it across the real table to the person opposite; their reply appears as words in the air between you.

**Patterns used.** 3, 4, 7, 8 (friction: no extra hardware), Magic Wonders' "it follows you into the real room," Language IRL's speech loop.

**Target prizes.** Accessibility Forward first; Productivity (it is a communication utility); Agentic Interaction; Social (if the second person is in frame, even without a second headset).

**Rival check (2026, generic).** The sign-language *tutor* lane has several 2026 entries, and one 2026 entry includes a sign-language communication suite. No similar 2026 entry found for a live two-person interpreter utility. The trailer must show a seated two-person conversation in the first 10 seconds.

**Feasibility.** Medium. The safe 2–3 day slice is speech→avatar for a fixed vocabulary, plus captions, plus a handful of recognised signs or pinch-confirmed glosses. Promising full ASL fluency would be a lie in this timeframe.

### 7. Stack Trace Table — debug by taking the program apart

**Pitch.** A short, intentionally buggy function materializes as a physical call stack on the desk: each frame is a block, each variable a labelled bead, the thrown error a crack of light. Pinch a frame to open it, pull a value out, rewind time with a slider, and ask a duck-like agent "why is this null?" It points at the bead that went empty. This is a debugger you can sit at, not a general AI companion that drives your PC.

**Awe moment.** You pinch a towering call stack; it separates like wooden blocks, and one bead is dark — the bug.

**Patterns used.** 1, 3, 6, 7, Compile Crops' "code has spatial cause and effect," Tiny Golf's table scale (keeps 60 fps).

**Target prizes.** Productivity; Agentic Interaction; First Five Minutes; Boldest Original Concept.

**Rival check (2026, generic).** No similar 2026 entry found for a spatial debugger. Adjacent 2026 entries: a room companion that drives a coding agent on your computer (avoid pitching "an agent that types on your laptop"), a retro game-coding toy, and several remote-desktop/window streamers. Your hook is *program state as toys on the table*.

**Feasibility.** High with one scripted bug, a precomputed execution trace, and one LLM question over that trace. Do not attach to a live IDE in three days.

### 8. Fit Check — does this part fit the real object?

**Pitch.** A maker/engineer utility: generate or import a simple 3D part (phone stand, hook, spacer, lid). Place it on the real object with passthrough and plane/object alignment. Pinch to scale by millimetres, slice a cross-section, flag collisions, export a print-ready file (or a generic mesh — don't require a branded slicer). An agent suggests "add 2 mm clearance at the lip."

**Awe moment.** A stand appears around your actual mug or phone and either seats cleanly or visibly intersects — in the real room, instantly.

**Patterns used.** 2, 4, 6, 7, Pocket Lands' "virtual object, real furniture," Mise-like practical job.

**Target prizes.** Productivity; First Five Minutes; Boldest Original Concept (for a tool, not a game).

**Rival check (2026, generic).** No similar 2026 entry found for fit-checking 3D prints against a real object. Adjacent: virtual-only workbenches, a desk wind tunnel, furniture planners. Start the trailer with a real object on the table.

**Feasibility.** Medium-high with 2–3 preset models, desk-plane placement, and a simple intersection test. Skip automatic mesh generation from a photo unless it is already reliable in a prototype on day one.

### 9. Packing Ghosts — trip prep on the real table

**Pitch.** You are packing a real bag. Speak the trip ("two days, interviews, rain"). The agent, using PCA, recognises items on the table and in the bag's mouth, ticks a list, and ghosts the missing objects (charger, ID, a jacket) as translucent props you should go get. Pinch a ghost to postpone it; a closing check shows what is still missing.

**Awe moment.** Your half-packed bag is surrounded by glowing "missing" objects that aren't there yet.

**Patterns used.** 2, 6, 7, Chores.gg's vision-on-real-work (but a different job), GeoPortal/OnTheGoVR's travel context without copying cinema or flight tracking.

**Target prizes.** Productivity; First Five Minutes; Agentic Interaction.

**Rival check (2026, generic).** No similar 2026 packing utility found; one adjacent daily-routine organizer exists. 2025 OnTheGoVR (travel cinema), GeoPortal (in-flight tracking) and Chores.gg (XP for housework) are the 2025 neighbours — don't add streaks/leaderboards.

**Feasibility.** High with a short fixed checklist, Gemini-style vision on a tabletop, and a handful of pre-made ghost models. Recognition will be messy; design the UI so a missed item can be pinched in manually without breaking the demo.

### 10. Defense Desk — oral-exam / thesis interrogator at your table

**Pitch.** You load *your* abstract, a figure, and a short FAQ (or a demo paper). The empty chair across your real desk is occupied by a calm examiner-agent who has "read" it. They ask a hard question, can point at a figure you have Page-Lifted onto the table, and they follow up if you hand-wave. After the session, weak answers stay as cards you can restudy. This is not a board meeting and not twins of your real colleagues.

**Awe moment.** The chair opposite you is suddenly occupied, and the first question is specifically about *your* figure 3.

**Patterns used.** 4, 6, 7, Tarot's pacing/restraint (a serious tone, not a joke interviewer), Language IRL's "a character in your space," Reason to Come Back (nightly orals).

**Target prizes.** Productivity; Agentic Interaction; First Five Minutes; Reason to Come Back. Strong personal fit for a final-year student if the demo uses a real (or believable) thesis excerpt.

**Rival check (2026, generic).** Several 2026 entries already do rehearsal against AI people (audience twins, an AI boardroom, general hard-conversation roleplay, frontline job training). The first shot must be: one examiner, your paper on *your* desk, an oral-defense question.

**Feasibility.** High with a fixed paper, a question tree plus one LLM follow-up, and a simple seated avatar. Combining a single Page Lift figure makes the demo look bigger than the code you have to write.

---

## 7. Recommendation for a 2026 Productivity entry

If the goal is a main-track Productivity prize *and* a special award, the 2025 pattern says: **a real job + a first-30-second room transformation + an AI that has eyes or a role + a loop you could finish in a short seated session.**

Strongest three, given the 2026 crowd and a 2–3 day build:

1. **Page Lift** — clearest awe, very seated, very MR, still open, easy to film, combines naturally with Defense Desk or Citation Sky later.
2. **Repo City** — most distinctive for an IIT CS/EE-style student, maps to Boldest Original Concept, and the nearest rivals are clearly different if the trailer starts on source files, not an architecture incident board.
3. **Paper Unfold** or **Citation Sky** — both solve work you actually do, both had no similar 2026 entries found, both demo cleanly.

**Hands of a Master** is the best "Reason to Come Back + Accessibility" play if you are willing to record a tight calligraphy (or similar) loop and live with comparisons to 2026 tracing-overlay and ASL-tutor entries. **Sign Bridge** is the best Accessibility-first play, but only if you can stay obviously not-a-tutor and not a sign-language performance demo, and you accept a limited vocabulary.

I would not spend the remaining days on another spatial planner, memory palace, stock desk, language-labeller, or "AI agents in a glass office." Those lanes are already full, and 2025 already showed that the big lifestyle/productivity energy went to *the room doing something it has never done*, not to more panels.

---

## 8. File trail

- Official blog: copy saved in `resources/pages/developers-meta-com-horizon-blog-meta-horizon-start-developer-competition-meet-the-winners.md`.
- Gallery JSON-LD of all 32 winners: `(local research workspace) past-winners/winners_jsonld.json`.
- Parsed Devpost pages: `(local research workspace) past-winners/parsed_winners_v2.json`.
- Concatenated writeups: `(local research workspace) past-winners/all_writeups.md`.
- 2026 submissions census: kept privately outside this repo (not included by request).

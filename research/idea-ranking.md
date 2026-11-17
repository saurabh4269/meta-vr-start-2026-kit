# Idea ranking: all eight ideas, judged on the official criteria

Written **18 Nov 2026 (IST)** for Saurabh Gupta's Meta Horizon Start Developer Competition 2026 entry (hands-only, Quest 3/3S).

**No feasibility or deadline scoring.** Every idea is judged as if it were built well. Build effort, schedule and "can it be finished" are deliberately ignored. The scores say how good the idea is, not how easy it is. 2026 gallery data is used only as aggregate overlap; no 2026 entry is named or linked.

---

## 1. The official criteria and weights (quoted)

Source: [Official Rules §5–6](https://start-developer-competition-26.devpost.com/rules) and the [Judging page](https://start-developer-competition-26.devpost.com/details/judging); repo copies in `resources/devpost/rules.md` and `resources/devpost/details_judging.md`. I re-fetched the live rules page on 18 Nov and the text matches the repo copy.

> **Stage One:** "…determine via pass/fail whether the Projects meet a baseline level of viability, in that the Project and Entry reasonably fits the theme and reasonably applies the required tools and features featured in the Contest."
>
> **Stage Two:** "All Entries that pass Stage One will be evaluated in Stage Two based on the below equally weighted criteria (the 'Judging Criteria')."

| Criterion | Official description (verbatim, trimmed to the scoring text) | Weight |
|---|---|---|
| **Innovation & Creativity** | "Measures originality, creative ambition, and relevance to the chosen track (Gaming, Entertainment, or Productivity). High-scoring projects differentiate themselves, show developer ingenuity, and uniquely leverage Meta device capabilities (e.g., spatial depth, hands-first design, gaze, passthrough mode, scene understanding, persistent anchors) to drive repeat usage." | **25%** |
| **Experience Design** | "Evaluates design, mechanics, and user journey for the intended audience, with emphasis on seated, hands-first, or context-specific use. Strong entries have intuitive navigation, clear onboarding, and a habit-forming purpose. Passthrough should be purposeful: the player's real room meaningfully changes the experience, not a scene that plays the same with passthrough off. We'll also evaluate FoV-aware design…" | **25%** |
| **Technical Implementation** | "Assesses technical expertise, reliability, and strategic use of platform tools, particularly the features that define hands-first experiences: gaze interactions (Unity/Unreal ISDK v207+), hand tracking, passthrough, spatial anchoring, and FoV-aware design. High-scoring entries must be performant on Meta Quest hardware (min 60 fps), solid and bug-free… For entries that use passthrough, this includes correct use of scene understanding (MRUK), anchoring content to detected planes, surfaces, and room geometry, and holding up in rooms the developer never tested." | **25%** |
| **Polish & Presentation** | "Assesses the overall quality of the project submission, including UI/UX, art direction, and sound design. High-scoring entries are performant, visually cohesive, and clearly demonstrate relevance to the chosen track. This includes high-quality submission materials (text, images, video) that effectively communicate the project's value. On your video/trailer: show real gameplay that honestly represents the experience. Lead with the story and what makes your project distinct. Don't lean on AI-generated video to carry the pitch." | **25%** |

Tie-break in the rules: "resolved by Judges' vote."

Special awards (from the [special awards page](https://start-developer-competition-26.devpost.com/details/special-awards)) that the ideas aim at: **Best Reason to Come Back**, **Best First Five Minutes**, **Boldest Original Concept**, plus Accessibility and Agentic awards.

### How I applied them
- **Official score = the plain average of the four criteria**, each 1–10 (that is exactly 25% each).
- **Technical Implementation is scored as the idea's technical ceiling, not build effort.** I asked: how much hands-first platform depth does the concept naturally earn (hand tracking, passthrough, MRUK and anchors, FoV-aware UI)? And how reliable is its *core mechanic* in principle (for example, fine-finger scoring near paper and crossed-hands occlusion are inherent tracking risks)? Time and workload are not counted.
- **Originality vs existing Meta/Quest apps is a separate extra column (1–10)**, not part of the official score. It is based on the checks in §3. 10 means nothing like it on Meta, Steam, SideQuest or Pico. 5 means a direct Meta Store competitor exists.
- **Combined score = 75% official + 25% originality.** This is my own blend, to give a combined rank.
- **Tie-break:** higher official score, then higher originality.

---

## 2. Ranked table

| Rank | Idea | Innovation 25% | Experience Design 25% | Technical 25% | Polish & Presentation 25% | **Official score** | Originality (extra) | **Combined** |
|---|---|---|---|---|---|---|---|---|
| 1 | **8. Hast Rekha** (MR palmistry) | 9 | 7 | 7 | 9 | **8.00** | 8.5 | **8.13** |
| 2 | **1. Hands of a Master** (Devanagari calligraphy ± mudras) | 8 | 9 | 6 | 9 | **8.00** | 7.0 | **7.75** |
| 3 | **2. Mahabharat Chausar** | 8 | 7 | 7 | 8 | **7.50** | 8.5 | **7.75** |
| 4 | **4. Code as Architecture** | 8 | 7 | 8 | 7 | **7.50** | 8.0 | **7.63** |
| 5 | **6. Giants & Hiders** | 8 | 7 | 6 | 8 | **7.25** | 8.0 | **7.44** |
| 6 | **7. Twin Hands** | 6 | 8 | 7 | 6 | **6.75** | 7.0 | **6.81** |
| 7 | **3. Artemis Flyby Chair** | 6 | 7 | 6 | 9 | **7.00** | 5.0 | **6.50** |
| 8 | **5. Sadak VR** | 5 | 6 | 6 | 7 | **6.00** | 5.0 | **5.75** |

Rank 2 and 3 have the same combined score (7.75); Hands wins on the tie-break (higher official score).

**By official score alone** the order is: Hast Rekha 8.00 = Hands of a Master 8.00, then Chausar 7.50 = Code as Architecture 7.50, Giants & Hiders 7.25, Artemis 7.00, Twin Hands 6.75, Sadak 6.00. Artemis moves up on official score because of its strong trailer, but down on originality.

The scores are my judgment, not measurements. The gap between ranks 1–5 is small (about 0.7 combined). The gap between rank 5 and 8 is large.

---

## 3. Originality checks: closest existing app per idea

Checked 18 Nov 2026 (IST) on the Meta Horizon Store, queststoredb.com, SideQuest lists, Steam, Google Play (for phone equivalents) and the web. URLs were opened. Meta Store pages returned HTTP 200 and I read their text. Steam pages returned 403 to curl (bot block), but I read their content through the search tool. "None found" is not proof of absence.

| # | Idea | Closest existing Meta/Quest app | Other similar things found | Verdict |
|---|---|---|---|---|
| 1 | Hands of a Master | [Pencil! – Learn to Draw](https://www.meta.com/experiences/pencil-learn-to-draw/7699993220035742/): real-paper drawing lessons, no ghost hands, no scoring. Format reference: [PianoVision](https://www.meta.com/experiences/pianovision/5271074762922599/) | [QalamMR](https://queststoredb.com/app/qalammr-26619612291040355/) (Arabic, virtual paper, needs a stylus); full table in [hands-of-master-competition.md](hands-of-master-competition.md) | Craft is partly taken; the *combination* (master's ghost hands + real paper + per-stroke score + Devanagari) is open |
| 2 | Mahabharat Chausar | [All On Board!](https://www.meta.com/en-us/experiences/all-on-board/25569652079315833): a board-game hub with generic "Parchisi" among its free classics, controllers, no story. Also [VR Ludo Quest](https://www.meta.com/experiences/vr-ludo-quest/26312559938379654/) (controllers, AI opponents) and [Tabletop](https://www.meta.com/en-gb/experiences/tabletop/5641568645972544/) (Ludo in MR, controllers) | Phone: [Bisaat – Chausar](https://play.google.com/store/apps/details?id=com.dyutgames.bisaatchausar) (authentic rules, Shakuni as a character, no VR); [Ludo/Pachisi/Chaupar](https://play.google.com/store/apps/details?id=com.azodus.chaupar). Research: an FAU thesis "Dhayam VR" (a Mahabharata dice-game VR prototype, no store listing found) | Chausar itself, Mahabharata framing, hand-throw dice and cheat-by-gesture are all absent on Meta. Pachisi/Ludo as a generic game is covered. |
| 3 | Artemis Flyby Chair | [Journey To Impossible](https://www.meta.com/experiences/journey-to-impossible/23868872842746439/): Apollo cockpit simulation with interactive controls ($10.99, VR). Also [A lunar adventure](https://www.meta.com/experiences/893710327423160/) (puzzle adventure), [Apollo 11](https://www.meta.com/experiences/apollo-11/2164469606967296/) (documentary), [SpaceWise](https://www.meta.com/experiences/spacewise-the-real-solar-syst/1422848437569079/) (planets on your table in MR), [Stargaze XR](https://www.meta.com/experiences/stargaze-xr-ar-space-explorer/9333736950013837/) | Not on the Store: [Artemis: The Free Return](https://wulfdesign.github.io/lunar-flyby-xr) (WebXR lunar free-return flyby, ~16 min autopilot, runs in Quest Browser, [repo](https://github.com/wulfdesign/lunar-flyby-xr)); [Artemis VR on Steam](https://store.steampowered.com/app/2720780/Artemis_VR) (PC, listed "planned 2026") | A crewed Moon-cockpit journey exists in several forms, including a Quest-browser Artemis flyby. What is unclaimed: your real chair as the seat, hand-operated switches, Earth held in your fingers, and the capsule dissolving into your real room. |
| 4 | Code as Architecture | **None found on the Meta Store.** Closest Quest-runnable: [BabiaXR CodeCity](https://babiaxr.gitlab.io) (WebXR code city, GPL, no live tests, not hands-first) | [CodeCharta](https://codecharta.com), [ExplorViz](https://explorviz.dev); details in [ideas-giants-code-resources.md](ideas-giants-code-resources.md) | Code cities are a solved visual. Live failing tests as fires you poke, hands-only, with an AI guide, is not. |
| 5 | Sadak VR | [Mondly: Learn Languages in VR](https://www.meta.com/experiences/mondly-learn-languages-in-vr/4214902388537196/): scripted conversation scenes in 30 languages **including Hindi**, 4.2★ (2.6K ratings). Also [Word By Word XR](https://www.meta.com/experiences/word-by-word-xr/1104258189142039/) (hands-only MR language tiles, 16 European languages, Nov 2026), [Spatial Lingo](https://www.meta.com/experiences/spatial-lingo-language-practice/24846121391731831/) (Meta's open-source MR language app), [IMMERSE](https://www.meta.com/experiences/immerse-build-real-language-fluency/3181432891940455), [Dynamic Languages](https://www.meta.com/experiences/dynamic-languages-travel-learn-explore/4890053391081880/) | Cultural tour: [India Metaverse](https://www.meta.com/experiences/india-metaverse/28146045071707840/) (landmark tours, no language learning) | VR language-learning with scenario conversations and Hindi already exists. What is new is Indian street errands in 10 Indian languages, which is a niche. The concept is also someone else's project (an adaptation). |
| 6 | Giants & Hiders | **None found on the Meta Store** for giant-seeker / tiny-hider deduction. Closest Quest tabletop-MR: [Demeo](https://www.meta.com/blog/demeo-hand-tracking-mixed-reality-mr/) (a different game) | [Panoptic](https://store.steampowered.com/app/541930/Panoptic/) and [VR Giants](https://store.steampowered.com/app/1124160/VR_Giants/) (Steam, asymmetric giant vs tiny, reflex-based) | Asymmetric scale exists elsewhere; hide-and-seek deduction with hand-gesture questions on an OSM city diorama does not. |
| 7 | Twin Hands | [Rehabilitation Hand Exercise MR App](https://www.meta.com/experiences/rehabilitation-hand-exercise-mr-app/25951351701205896/): guided hand-therapy reps in passthrough (April 2026), no bimanual patterns or sync scoring. Also [Can You Handle It?](https://www.altlabvr.com/can-you-handle-it) (hand-tracked game with a mirrored-fingers mod), [Hand Physics Lab](https://www.meta.com/experiences/hand-physics-lab/3392175350802835/), [Reflex Master](https://www.meta.com/experiences/reflex-master/6280619228661318/) (controller reflex training) | Research tool: [MovementVR](https://movementvr.github.io/index.html) (bimanual motor-learning experiments, a research APK) | No consumer Quest app coaches and scores opposite-hand patterns. Wellness and training themes are crowded in this year's field (aggregate: 30+ wellness entries, 100+ education/training). |
| 8 | Hast Rekha | [AstroWitch](https://www.meta.com/experiences/astrowitch/1841573847152019/): seated astrology reading with an AI voice, with no palm reading. **No Quest or MR palm reader found.** | Phone palm readers (e.g. [Palm Sage](https://play.google.com/store/apps/details?id=app.palmsage.palm_sage&hl=en_US), [Hastrekha](https://play.google.com/store/apps/details?id=com.houseoftech.hastrekha.ai&hl=en_US)); a web "AI palm reading" service ([VR Ashwa](https://www.vrashwa.com/ai-palm-reading-online-free-palm-reading-with-ai-vr-ashwa/)) | Palm reading exists on phones; in headset MR with glowing lines on your real palm and the seven mounts it does not. |

### Aggregate overlap with this year's field (no names)
From [submissions-2026-aggregate.md](submissions-2026-aggregate.md) (382 entries): traditional South-Asian board games, apprenticing to a master's hands on real paper, codebase-as-architecture and seated crewed space journeys had **no direct rival**. Hide-and-seek or chase games: none found, though geo-guessing and map games are crowded (4–5 similar). Language learning is **contested**. Wellness is crowded. Palmistry: no entries found. Bimanual coordination: none found.

---

## 4. Per-idea verdict and evidence

Each entry gives: the score reasons, the **key hypothesis** (what must be true for it to win) and the **cheapest test**.

### 1 (rank 2). Hands of a Master: official 8.00, combined 7.75
- **Why these scores.**
  - Innovation 8: a master's recorded ghost hands over your real paper, scored per stroke. Devanagari-first is a gap, since there is no headset app for any Indian script. It isn't a first for calligraphy overall (QalamMR, You, Calligrapher, Pencil!).
  - Experience Design 9: the real paper is essential, not decorative. Passthrough passes the "meaningfully changes the experience" test. Ghost hands teach without text, and streaks and slow tempo fit Best Reason to Come Back and Accessibility.
  - Technical 6: the core mechanic is fine-finger scoring close to a surface, where occlusion and jitter are inherent. The headset has no pen signal, which is why Pencil! skips scoring.
  - Presentation 9: "your hand slides into the master's and the stroke glows gold on your paper" is the single most legible hook of the eight.
- **Key hypothesis.** A hands-only fingertip path is stable enough over real paper to tell a good stroke from a bad one, and a viewer sees "a master teaching my hand" within 10 seconds.
- **Cheapest test.** Record one master stroke set. Have 3 people (one practised, two novices) trace it 10 times each in the headset. Check that scores separate the practised person from the novices by more than the repeat-to-repeat jitter. If not, fall back to the fingertip "air pen" or the mudras mode, which tracking handles well.

### 2 (rank 8). Sadak VR: official 6.00, combined 5.75
- **Why these scores.**
  - Innovation 5: language learning with scenario conversations and Hindi is already on the Store (Mondly), and Meta's own Spatial Lingo shows MR language practice. The Indian streets and 10 Indian languages are the real novelty, and the concept is the original authors' work.
  - Experience Design 6: it is voice-first, while the rules are hands-first. Reply cards fix that, but a rebuilt street fails the "plays the same with passthrough off" test.
  - Technical 6: speech in a WebXR session and OSM scenes are fine, but no MRUK or anchoring story.
  - Presentation 7: a warm, colourful, relatable story.
- **Key hypothesis.** Hands-only reply-card play teaches enough to feel real, and judges accept it as new work (hand interactions and MR are the "significantly updated" features) while the passthrough use is read as purposeful.
- **Cheapest test.** Run one errand with 5 people using only reply cards and no mic. Ask whether they learned a phrase. Then play the same scene with passthrough off: if it feels identical, passthrough isn't earning its place, and that is the main risk.

### 3 (rank 3). Mahabharat Chausar: official 7.50, combined 7.75
- **Why these scores.**
  - Innovation 8: Chausar, the Mahabharata story, a real hand-throw, and "cheat by secret gesture, get called out by an AI Shakuni who watches your hands" has nothing like it on Meta. It fits Boldest Original Concept.
  - Experience Design 7: the table becomes the board, so passthrough is purposeful; bluffing is a clear loop; retention is moderate (match-based, so Best Reason to Come Back is weaker).
  - Technical 7: throw physics and hand-motion anomaly detection are strong hand-tracking showcases, but fast throws leave the tracking volume.
  - Presentation 8: the cracking board and the light pouring out make a great reveal shot.
- **Key hypothesis.** The secret-flick cheat is discoverable and the AI's accusations feel fair, so players enjoy the bluffing and not just the dice.
- **Cheapest test.** Wizard-of-Oz: one person plays "Shakuni" watching a video of 5 testers throwing dice while some cheat. See whether cheats are spotted about half the time and the testers say it felt fair.

### 4 (rank 7). Artemis Flyby Chair: official 7.00, combined 6.50
- **Why these scores.**
  - Innovation 6: a crewed Moon cockpit exists on the Store (Journey To Impossible), and a Quest-browser Artemis flyby exists. Your chair as the seat and Earth held in your fingers are the new parts.
  - Experience Design 7: seated is perfect, and the capsule dissolving into your real room is purposeful passthrough. It has weak replay (one mission).
  - Technical 6: mostly rendering plus hand switches; MRUK chair detection is the one platform-specific piece.
  - Presentation 9: Earthrise and Earth between your fingers is the best cinematic trailer shot of the set. Use real gameplay, not AI video.
- **Key hypothesis.** The Earth-in-your-fingers moment gets a visible gasp from a first-time viewer, and the passthrough-to-capsule dissolve reads as more than a cosmetic effect.
- **Cheapest test.** A 90-second grey-box (skybox, a porthole, one Earth sphere you can pinch) shown to 5 people. Record whether they react without prompting, and test MRUK chair detection in 3 rooms.

### 5 (rank 4). Code as Architecture: official 7.50, combined 7.63
- **Why these scores.**
  - Innovation 8: nothing on the Meta Store. Live test results as poke-able fires, hands-first, with an AI guide, are unclaimed. The one close project with fires derives them from bug-fix commits instead.
  - Experience Design 7: a desk city is a good use of the table; the habit comes from using it on your own repos. Code text in a headset is the usability risk.
  - Technical 8: instanced rendering, parsers for metrics and imports, a test-result feed and an AI guide give the richest technical story of the eight.
  - Presentation 7: strong if the video leads with a real repo, but it can look like another mind-map.
- **Key hypothesis.** Seeing your own repo as a city with a burning building helps a developer find the failing module faster than a flat view, and a viewer immediately understands "fire = failing test".
- **Cheapest test.** Build the city JSON for one repo from `scc` and a test run. Show it on a flat page and in the headset to 3 developers and time how long they take to find the failing module. Supporting evidence: a 24-person study found faster answers in a VR code city at equal accuracy ([paper](https://doi.org/10.1109/VISSOFT52517.2021.00011)).

### 6 (rank 5). Giants & Hiders: official 7.25, combined 7.44
- **Why these scores.**
  - Innovation 8: scale is the mechanic. Giant seekers ask hand-gesture questions over a tiny city; a tiny hider looks up. Hide-and-seek deduction has no Meta Store equivalent.
  - Experience Design 7: the table diorama is purposeful passthrough. The rules need teaching, and the best moment needs a second player (solo uses an AI hider).
  - Technical 6: sharing a room across two headsets isn't possible in WebXR, so play must be remote, and gesture questions need tolerant detection.
  - Presentation 8: "giants peering over the rooftops" is a memorable shot, with the second-player caveat.
- **Key hypothesis.** The question-and-eliminate loop is fun when asked with hand gestures at table scale, and works against an AI hider as well as a human one.
- **Cheapest test.** Playtest radius and thermometer questions on a flat map against a hidden pin with 3 people. Check whether they narrow it down in about 8 questions and want another round.

### 7 (rank 6). Twin Hands: official 6.75, combined 6.81
- **Why these scores.**
  - Innovation 6: bimanual coaching with a sync score is a gap on Quest, but the idea is simple and the wellness lane is crowded.
  - Experience Design 8: highly habit-forming (short sessions, streaks, ghost-hand onboarding, accessible), and hands are the whole point. Passthrough matters little.
  - Technical 7: joint-level analysis, phase and sync scoring and handling crossed hands are real hand-tracking depth.
  - Presentation 6: exercise patterns are hard to make visually spectacular in a trailer.
- **Key hypothesis.** The sync score separates good from bad bimanual attempts reliably, and judges accept it as coordination and focus training (not a medical cure, since Brain Gym-style claims aren't supported).
- **Cheapest test.** Log joint data from 3 people doing mirrored and parallel wrist circles. Compute the phase offset between the hands and check it separates the two patterns even when the hands cross.

### 8 (rank 1). Hast Rekha: official 8.00, combined 8.13
- **Why these scores.**
  - Innovation 9: no MR palm reader found on Quest, and it draws on Indian palmistry (Samudrika) with a built rulebook of 63 features. It fits Boldest Original Concept.
  - Experience Design 7: your real palm is the canvas, so passthrough is essential. The daily-return loop is weaker (a reading is a one-off unless you add daily changes).
  - Technical 7: hand-landmark regions and a camera-based line finder would be a deep use of hand tracking and the Passthrough Camera API. Whether the Quest camera shows creases clearly enough is **unproven**, so reliability is uncertain.
  - Presentation 9: glowing lines on your real hand is instantly visual and shareable.
- **Key hypothesis.** Either the Quest camera resolves palm creases well enough for the filter and model to trace them, or the hand-landmark mounts plus "trace your own line" fallback still look magical and feel personal.
- **Cheapest test.** Capture 1280×960 passthrough frames of 5 palms with Meta's [camera sample](https://github.com/oculus-samples/Unity-PassthroughCameraApiSamples). Run the existing auto-labeling pipeline on them offline. If the lines come out clean, the scan layer works; if not, ship the tracing tier.

---

## 5. Recommendation: top five or six

1. **Hast Rekha** is the top pick on both the official score and originality. It has the strongest hook (glowing lines on your own hand) and nothing like it on Quest. Its open question is whether the camera sees creases, so decide with the cheap test above before committing to that layer.
2. **Hands of a Master** is the best fit to the official criteria (tied for first), with the strongest Experience Design and the best "first five minutes". Position it as Devanagari-first with a mudras mode, and don't claim "first calligraphy app".
3. **Mahabharat Chausar** has the highest originality among the games and a clear Boldest Original Concept case.
4. **Code as Architecture** is the strongest technical story and the only Productivity entry; the live-test fire is the differentiator.
5. **Giants & Hiders** has a distinctive scale-based concept, with a second player or stand-in needed for its best shot.
6. **Twin Hands** is the sixth, as a solid habit-forming but visually modest option, to be framed as coordination training.

**Lowest:** Artemis Flyby Chair (great trailer, but Moon cockpits already exist, including a Quest-browser Artemis flyby) and Sadak VR (language learning with Hindi already on the Store, voice-first conflicts with hands-first, and weak passthrough use).

Hast Rekha, Hands of a Master and Chausar all fall inside a 0.4 combined-score band, so the order among them is a judgment call and can be changed by the cheap tests.

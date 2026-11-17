# Idea shortlist: final top six

These are Saurabh's final six candidates, in priority order.

- **Rival status** is a check against the public 2026 Devpost gallery, kept generic: **no 2026 project is named or linked**. Aggregate context is in [submissions-2026-aggregate.md](submissions-2026-aggregate.md).
- **Award names** come from the [special awards page](https://start-developer-competition-26.devpost.com/details/special-awards). Track and Division names come from the [rules §4](https://start-developer-competition-26.devpost.com/rules).
- **Rules that apply to every idea:**
  - Hands-only end-to-end and seated (2 ft radius).
  - A satisfying loop in ≤10 min.
  - Purposeful passthrough, with MRUK holding up in rooms you never tested.
  - FoV-aware UI.
  - ≥60 fps on Quest 3/3S.
  - No logos, brand names or identifiable people.
  - A public video under 3 minutes.

  Check against [setup/submission-checklist.md](../setup/submission-checklist.md) and [accessibility-and-pitfalls.md](accessibility-and-pitfalls.md).
- ⚠ marks a design suggestion or risk call. It is not a sourced fact.

---

## 1. Hands of a Master
**Concept.** Translucent "ghost hands" of a master overlay your own real hands over real paper or a real object. You learn a craft by matching their motion, and every stroke is scored. Calligraphy comes first; pottery and sitar are later extensions.

**Core loop.**
1. Pick a lesson (one character or stroke set).
2. Watch the ghost hands perform it once at full speed.
3. Shadow them at a slowed tempo while the overlay sits on your real page.
4. Get a per-stroke score (path, order, speed, pressure proxy).
5. Repeat until you pass, then unlock the next stroke set.
6. Keep a daily practice streak.

**Hand interactions.**
- Your tracked index fingertip or pen-holding pose is compared with the master's recorded joint path.
- Pinch to scrub or replay the master's stroke, and two-finger spread to slow the tempo.
- Poke floating cards to choose a lesson.
- Hold your palm up to pause.

**Awe moment.** Your hand slides into the ghost hand and the two lock together. For one stroke you move *as* the master, and the stroke glows gold on your real paper.

**Target prizes.**
- Tracks: Productivity (learning a skill) or Entertainment.
- Special awards: **Best Reason to Come Back** (streaks, visible improvement between sessions) and **Best Accessibility Forward Experience** (slow-tempo mode, one-handed, captioned guidance). **Boldest Original Concept** is also possible.

**Scope and risks.**
- Record **one master sequence yourself** (a short character set). Score 2D stroke paths on a marked page, anchored with an MRUK plane on the desk.
- Pottery and sitar need force feedback and fine finger tracking that hands can't give reliably. Leave them as "future plans" ⚠ (also the advice in [past-winners-2025-analysis.md §6.5](past-winners-2025-analysis.md)).
- Hand-tracking jitter near the page: smooth the path and score loosely ([pitfalls](accessibility-and-pitfalls.md)).
- Occlusion when your fingers curl around a pen ⚠. The fingertip-only "air pen" mode is the fallback.

**2026 rival status.** **No similar entries found.** A few adjacent entries do ghost-hand sign-language tutoring or picture-tracing overlays. None apprentice you to a master's recorded hands on real paper.

---

## 2. Mahabharat Chausar
**Concept.** A carved chausar board rises out of your real table in passthrough. You play the dice game from the Mahabharata against a friend or an AI Shakuni. Cheating is a mechanic: you can secretly load the dice, but your opponent can catch you.

**Core loop.**
1. Throw cowrie or long dice with a real hand-throw motion.
2. Move pieces around the cross-shaped track by pinch-grab.
3. Optionally load the dice with a secret gesture, which costs karma.
4. The opponent watches your hands and can call **"Cheat!"**.
5. Get caught and you're punished: lose pieces and karma.
6. Cheat successfully and you build toward the **Kurukshetra finale**, where the board erupts into a mini battle that decides the match.

**Hand interactions.**
- Real throw motion; release speed and direction feed the dice physics.
- Pinch-grab and place pieces.
- **Secret gestures** load the dice: finger curl, wrist flick, a held pinch before release.
- Point and call "Cheat!" with a gesture.
- The AI Shakuni reads your hand-motion anomalies to decide when to accuse.

**Awe moment.** A caught cheater's side of the board **cracks open**, and divine light pours out to reveal the true roll.

**Target prizes.**
- Track: Gaming.
- Special awards: **Best Social & Multiplayer Experience** and **Boldest Original Concept** (cheating by hand gesture only works with tracked hands). AI Shakuni also fits **Best Agentic Interaction**.

**Scope and risks.**
- Start with **1v1 vs AI Shakuni**, which needs no networking. Add local or online multiplayer only if time allows.
- Throw physics with hand tracking: fast throws leave the tracking volume. Use Meta's last-good-pose approach ([First Steps blog](https://developers.meta.com/horizon/blog/adding-hand-tracking-to-first-steps/)).
- Tune secret gestures so they aren't triggered by accident.
- Use only public-domain Mahabharata story material (rules §4.10). Use respectful, original art.
- The Kurukshetra battle can be a short, scripted spectacle, not a full RTS ⚠.

**2026 rival status.** **No similar entries found.** Board and tabletop games are a crowded lane overall, but none are chausar or pachisi, and none use cheat-by-gesture.

---

## 3. Artemis Flyby Chair (interplanetary mission)
**Concept.** Your real chair becomes the commander's seat of a crewed capsule on a lunar flyby. Launch, see Earth shrink, go silent behind the Moon, watch Earthrise, then reenter and splash down back into your room.

**Core loop (one ~8–10 min mission).**
1. **Launch:** press switches with your fingers while the cabin shakes.
2. **Coast:** hold the shrinking Earth between your fingers at the porthole.
3. **Far side of the Moon:** radio silence over real lunar imagery.
4. **Earthrise.**
5. **Panel tasks:** an AI crewmate explains what's happening and gives you small fixes (pinch or twist a valve, reseat a breaker).
6. **Reentry and splashdown:** reentry glow, then the capsule walls dissolve back into your passthrough room.

**Hand interactions.**
- Poke toggle switches and twist rotary knobs.
- Pinch-and-hold Earth through the porthole (a scale illusion).
- Grab checklists and flip their pages.
- Look-and-pinch to talk to the crewmate (hands-only fallback: reply cards).

**Awe moment.** Earthrise. You hold your hand up and Earth fits between your thumb and finger.

**Target prizes.**
- Track: Entertainment.
- Special awards: **Boldest Original Concept** (presence and scale) and **Best First Five Minutes** (the launch is the hook). The AI crewmate could also target **Best Agentic Interaction**.

**Scope and risks.**
- **Polish the flyby and Earthrise.** Keep launch and reentry short (about 60–90 s each).
- **No NASA or Artemis logos, insignia or mission patches** (rule 4(19)). Consider a generic in-app title rather than "Artemis" ⚠.
- NASA lunar imagery is broadly usable, but check NASA's media usage guidelines before you rely on it ⚠ (not fetched here).
- Comfort: the cabin shake must stay mild. Keep the horizon stable and avoid forced acceleration (seated, no locomotion).
- Performance: use skybox and textured spheres for the planets, not heavy geometry.

**2026 rival status.** **Partial overlap only.** Space and planet-globe experiences exist, but **no seated, crewed-journey entry** was found.

---

## 4. Code as Architecture (Repo City)
**Concept.** A real code repository rises as a city on your desk.

- Files are buildings; height means size or complexity.
- Folders are districts and dependencies are streets.
- A **failing test is a building on fire**.

**Core loop.**
1. Load a repo (a pre-processed JSON from a small CLI or GitHub API step).
2. Explore the city from above.
3. Pinch a building to open it: floors are functions and the code shows on a panel.
4. Ask the AI guide what a module does.
5. Follow a dependency street.
6. Watch fires appear and go out as tests run.

**Hand interactions.**
- Pinch to open or lift a building, and two-hand pinch to zoom the city.
- Trace a street with a finger to follow imports.
- Poke the fire to see the failing assertion.
- Grab the AI guide and place it beside a district.

**Awe moment.** You lift the roof off your own project and see the code you wrote last night as a lit building with one floor smouldering.

**Target prizes.**
- Track: Productivity.
- Special awards: **Boldest Original Concept** (spatial code comprehension) and **Best Agentic Interaction** (AI guide).

**Scope and risks.**
- Pre-compute metrics offline; render instanced boxes for a few hundred files.
- Code text readability in the headset: use large type and angular scaling.
- Lead the video with real source files so it doesn't read as another mind-map.
- Keep private-code concerns local ⚠.

**2026 rival status.** **One loosely similar entry** (3D concept or diagram maps). **None build code cities.**

---

## 5. Sadak VR
**Concept.** A hands-first VR/WebXR port of [Sadak](https://github.com/mittal-parth/sadak) ([live](https://playsadak.vercel.app)). It's a voice-first three.js/Next.js game where you learn 10 Indian languages through everyday errands in Indian neighbourhoods rebuilt from OpenStreetMap. The owner, Parth Mittal, has given permission to build a VR version. **Division: Adapted / Significantly Updated** (the original predates 24 Sep 2026).

**Core loop.** For each errand: hear the line → reply → get scored → continue. Returning characters remember you.

**Hand interactions.**
- Hail an auto with a raised hand.
- Point at stall items.
- Hand coins to the vendor.
- Pinch-to-talk.
- Reply cards give a hands-only path for every voice step.

**Awe moment.** You're standing on a real Old Delhi street, and a shopkeeper greets you by something you told them yesterday.

**Target prizes.**
- Track: Entertainment or Gaming.
- Special awards: **Best Reason to Come Back** (character memory, progress) and **Best Accessibility Forward Experience** (learning through your own language). Voice-first input also fits **Best Agentic Interaction**.

**Scope and risks.**
- One district, one street, 2–3 errands, at 60 fps.
- Get **written permission** and ideally an MIT license.
- Credit all four authors, Sarvam AI and OpenStreetMap (ODbL).
- Microphone use inside WebXR on Quest Browser is untested ⚠.

Full plan: **[sadak-vr-port.md](sadak-vr-port.md)**.

**2026 rival status.** **Language learning is a contested lane** (several language/phrase-learning entries; education overall is 100+). The edge is Indian cities and Indian languages.

---

## 6. Giants & Hiders
**Concept.** Table-scale hide-and-seek in the style of *Jet Lag: The Game*'s Hide + Seek ([fan rules reference](https://jetlag.denull.ru/en/rules/)). It uses **no Jet Lag branding, names or assets** (rule 4(19)).

- A miniature city diorama built from OpenStreetMap data sits on your real table.
- **Seekers** are giants leaning over the diorama.
- The **hider** shrinks down to street level inside it.

**Core loop.**
1. The hider picks a hiding zone.
2. Seekers spend turns asking questions with their hands.
3. The map narrows as questions are answered.
4. The hider earns cards and plays curses.
5. Seekers close in and **pinch the tiny hider out of the city**.
6. Swap roles.

**Hand interactions (seekers).**
- **Radius question:** draw a circle with a finger ("are you inside?"); excluded areas go dark.
- **Thermometer:** move a hand and get hotter or colder.
- **Matching and measuring questions:** "same district as the station?", "closer to the river than me?"

**Hand interactions (hider).**
- Answer **photo questions** with a **finger camera-frame** gesture. The snapshot appears on the seekers' table.
- Play earned curse cards:
  - **fog** over the map;
  - **scrambled street names**;
  - **freeze a giant's hand** for 30 s.

**Awe moment.** The hider looks up from the street and sees friends' giant faces peering over the rooftops.

**Target prizes.**
- Track: Gaming.
- Special awards: **Best Social & Multiplayer Experience** (asymmetric multiplayer). The **solo mode with an AI hider character** fits **Best Agentic Interaction**.

**Scope and risks.**
- **Real-time networking is the biggest risk. Build the AI-hider solo mode first**, then local or online multiplayer.
- Credit OpenStreetMap (ODbL) and keep the city to one small district for 60 fps.
- The finger-frame photo gesture needs tolerant detection ⚠.
- **The video must show the hide-and-chase loop in its first seconds.**

**2026 rival status.** The 2026 field has **geo-guessing games**, including one polished multiplayer street-imagery guessing game, but **no hide-and-seek or chase game** was found.

---

## 7–8. Added 18 Nov: Twin Hands and Hast Rekha
Two later ideas from Saurabh. Full concept docs, evidence review and sources are in [ideas-7-8.md](ideas-7-8.md).

**7. Twin Hands** (bimanual coordination "brain gym")
- **Concept.** A short hands-only practice game. A ghost-hand coach shows a two-hand pattern (mirror or parallel wrist circles, opposite finger sequences, in/anti-phase open-close), and the headset scores sync, accuracy and tempo live.
- **Evidence verdict.** Legitimate coordination/timing practice, but there is no good evidence it repairs attention. Brain Gym's claims are unsupported, so there are **no medical claims** in the pitch.
- **Engine.** IWSDK. **MVP.** Three exercises, ghost demo, scored round, streak. **Biggest risk.** Health overclaiming, then occlusion when the hands cross.
- **2026 rival status.** No bilateral-coordination entries found. Wellness is crowded.

**8. Hast Rekha** (Indian palmistry in MR)
- **Concept.** A pandit reads your palm in passthrough: glowing lines on your real hand, the seven mounts lighting up, a reading, and a shareable card. Framed as culture and entertainment, not prediction.
- **Feasibility verdict.** The hands-only version (hand shape, mounts, tracing your own lines) is solid. Scanning real creases through the Passthrough Camera API is possible in Unity but unproven at 1280×960. WebXR cannot do it today.
- **Engine.** Unity. **MVP.** Tier 0 hands only, Tier 1 Trace mode, Tier 2 Scan mode. **Biggest risk.** Crease detection quality; Trace mode is the fallback.
- **2026 rival status.** No palmistry entries found.

---

## Other ideas considered
Briefly kept on the bench. Details for the productivity ones are in [past-winners-2025-analysis.md §6](past-winners-2025-analysis.md).

| Idea | One line | Why not top six |
|---|---|---|
| Meme Court | Judge and argue memes by gesture in a tabletop courtroom | Open lane, but brand and real-person risks (rules 4(17), 4(19)) and humour is hard to show quickly |
| Draw-it-Real | Fingertip sketch becomes a 3D object | Partial overlap (2 adjacent entries); AI-generation adds wrapper risk |
| Page Lift | Diagrams stand up off a real printed page | Needs reliable page detection; narrower wow |
| Paper Unfold | A dense real form becomes a guided conversation | Utility-heavy, weaker spatial hook |
| Citation Sky | A literature review you can hold as a star map | Adjacent to existing concept-graph entries |
| Fit Check | Does this virtual part fit the real object? | Depth and scale precision risk on Quest |
| Stack Trace Table | Debug by taking a program apart on the desk | Overlaps Repo City, which is stronger |
| Defense Desk | Oral-exam / thesis interrogator at your table | Mostly an AI chat with a spatial skin (wrapper risk) |

**Dropped:**
- **Shadow theater:** crowded lane (3 similar entries).
- **Living chess:** familiar and generic (2 rivals).
- **VR Kindle-style reader:** 2 rivals, plus established Store apps.
- **First Coffee dating sim:** 1 close rival; real-person and AI-wrapper risks.
- **Step into the Map:** crowded (3+ similar map/travel entries).

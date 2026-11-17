# Hands of a Master: competitive check (calligraphy on Quest)

Checked **18 Nov 2026 (IST)**. Question from Saurabh: PianoVision does ghost hands plus scoring well for piano, so is calligraphy already taken?

- **Idea under test** ([idea-shortlist.md](idea-shortlist.md) §1): ghost master hands trace strokes over **real paper** in passthrough, you follow with a real pen or brush, each stroke is scored on path, order and speed, and everything works hands-only on Quest 3/3S.
- **2026 competition names:** no 2026 competition submission is named or linked here. The 2026 overlap is in aggregate only (see [§4](#4-2026-gallery-overlap-aggregate-only)).
- **Link checks:** every URL was opened on 18 Nov 2026. A few return 403 to scripts (Product Hunt, ACM, Justia, MDPI, Behance, GitHubHelp) but were read through a search or fetch tool. Those are marked "read via search". Items marked ⚠ are my inference, not a sourced fact.

---

## 1. Verdict

**Partly taken. The pieces exist; the combination does not.**

- **Taken:**
  - Real-paper mixed-reality (MR) drawing lessons on Quest: Pencil!, a polished product.
  - Calligraphy on Quest, but on *virtual* surfaces with controllers or a stylus.
  - Trace-projection onto paper and walls: Contour, SketchAR, Wall Trace and phone AR apps.
- **Open, with no shipped product found on any platform I searched** (Quest, Steam, Pico, App Lab/SideQuest, Vision Pro, Android XR, phone AR): *ghost recorded-master hands over real paper, with per-stroke scoring on path, order and speed, hands-only.*
- **Why it is open (⚠):**
  - **PianoVision's scoring works because a MIDI keyboard gives exact input.** Without MIDI, hand tracking only drives a virtual keyboard.
  - **Calligraphy has no equivalent ground truth.** Quest hand tracking loses fingers around a pen, and it cannot see ink on paper.
  - **Pencil! chose not to score for this reason.** UploadVR's review says the game "doesn't have to perform sophisticated calculations… you do that all yourself", and wishes for critique once camera access arrives ([UploadVR](https://www.uploadvr.com/a-case-for-pencil-why-physical-drawing-is-better-in-mixed-reality-2/)).
- **Scoring is both the moat and the biggest technical risk.** It needs one of:
  - the Passthrough Camera API (Unity, Quest 3/3S; Meta docs updated 10 Nov 2026) to compare real ink against the template;
  - a tracked stylus (MX Ink, $130, which breaks "hands-only");
  - a fingertip or pen-pose "air pen" score, which scores motion rather than marks on paper.
- **Do not drop the idea because of PianoVision.** It proves the format (ghost hands plus feedback) sells. Nobody has done it for a script.

**Strongest competitor:**
- **Pencil!** (Lead Head Studio) is the strongest competitor overall. It has the same real-paper MR format and mature lessons, a 4.5★ rating from 97 ratings, and it is on Quest and Android XR.
- **If it adds a calligraphy or handwriting pack,** it covers most of the "learn on real paper" value.
- **The gaps:** it has no ghost hands, no scoring, no brush scripts and no Indian scripts.
- **For calligraphy specifically,** the strongest competitor is **QalamMR** (Arabic, MX Ink, July 2026), followed by **You, Calligrapher** (virtual, 30-level graded challenge mode).

---

## 2. Competitor table

**Column key.**
- **Paper:** real, virtual, or n/a.
- **Ghost hands:** shows a recorded or animated hand model.
- **Scores:** gives a per-stroke or per-run score.
- **Input:** hands-only (H), controller (C), or stylus (S).
- **Active:** the status I could verify.

### 2a. Quest and MR: calligraphy, handwriting and brush apps

| App | Platform | Paper | Ghost hands | Scores | Input | Active | Notes | URL |
|---|---|---|---|---|---|---|---|---|
| **Pencil! – Learn to Draw** | Quest 3/3S/Pro; also Android XR | **Real** (paper plus pencil; controller used as paperweight to anchor) | No. A teacher character ("Leo") plus outline overlays. | **No** (you judge yourself) | Pencil on paper. Menus by hand/controller; MX Ink experimental. | Yes. 80+ lessons, updated Oct 2025, 4.5★ (97). | Drawing curriculum, not calligraphy. Won a 2024 Meta hackathon. | [Meta Store](https://www.meta.com/experiences/pencil-learn-to-draw/7699993220035742/), [Meta blog](https://www.meta.com/blog/pencil-learn-to-draw-in-vr/), [Google Play](https://play.google.com/store/apps/details?id=com.LeadHead.Pencil&hl=en_US) |
| **QalamMR** | Quest 3/3S/2/Pro | **Virtual** carved-groove paper on your desk | No. "Animated stroke guidance" plus haptic grooves. | No explicit score found | **Stylus only** (MX Ink required) | Yes. Released 11 Jul 2026, v1.2.2, 3.5★ (2). | Arabic only: 20 letter forms, 3D relief and a gallery. Solo dev, Logitech DevStudio finalist. | [Quest Store DB](https://queststoredb.com/app/qalammr-26619612291040355/), [Product Hunt](https://www.producthunt.com/products/qalammr) (read via search) |
| **You, Calligrapher (墨之韵)** | Quest, Steam PCVR, Pico | Virtual | No | **Graded challenge mode** (30 levels, per a user report) | Controllers | Quest listing 2021; Pico page updated Oct 2026. Low volume (about 9 ratings on Quest). | Chinese brush simulation and templates. | [Meta Store](https://www.meta.com/experiences/you-calligrapher/3964171543647365/), [Steam](https://store.steampowered.com/app/1593700/You_Calligrapher/), [Pico](https://store-global.picoxr.com/gb/detail/1/2062) |
| **Painting VR + Calligraphy Brush Pack** | Quest, Steam | Virtual (mixed-reality background optional) | No | No | Controllers; MX Ink supported | Yes. Add-on Jan 2025, bundle Jul 2026. | Fountain pen and marker brushes. Painting, not teaching. | [Quest Store DB](https://queststoredb.com/add-on/calligraphy-brush-pack-1099980507931745/), [Steam](https://store.steampowered.com/app/3976800/Painting_VR__Calligraphy_Brush_Pack/) |
| **Floating Ink VR** | SteamVR overlay | Virtual | No | No | Controllers | New, 16 Jul 2026; no reviews yet | Wet-ink bleed brush simulation with calligraphy grids. | [Steam](https://store.steampowered.com/app/4884570/Floating_Ink_VR/) |
| **Zen Heart Sutra VR** | Quest 3S | n/a (reading and meditation) | No | No | Hands/controllers | Yes. Released 1 Jun 2026. | Displays the Heart Sutra in brush script. You don't write. | [AltLab](https://www.altlabvr.com/zh/zen-heart-sutra-vr) |
| **Vermillion** | Quest, PC | Virtual oil painting | No | No | Controllers; MX Ink supported | Yes. 4.8★ (927). | Painting, no lessons on scripts. | [Meta Store](https://www.meta.com/experiences/vermillion-vr-painting/4900967296622279/) |
| **Kingspray Graffiti** | Quest, PC | Virtual | No | No | Controllers | Yes. 4.4★ (2.7K). | Spray-paint graffiti, no teaching. | [Meta Store](https://www.meta.com/experiences/kingspray-graffiti/2082941345119152/) |
| **Hajimari – Kanji Writing Practice** | Quest (WebXR) | Virtual floating board | No | **Yes: per-stroke feedback and progress** (stroke order from KanjiVG) | **Hands-only** | Prototype. Submitted to the 2025 edition of the Meta contest, created Nov 2025, 4 likes. | The closest hands-only stroke-order scorer on Quest. Virtual panel, not real paper. Not in the 2026 gallery data. | [Devpost](https://devpost.com/software/hajimari-kanji-writing-practice) |

### 2b. Trace-projection and AR drawing (images onto paper or walls)

| App | Platform | Paper | Ghost hands | Scores | Input | Active | Notes | URL |
|---|---|---|---|---|---|---|---|---|
| **Contour** (Visible Space) | Quest | **Real** wall, canvas or paper | No | No | Hands/controllers | Yes. 2.8★ (135). | "First-ever MR image-tracing app", since 2021. Murals and sign painters. | [Site](https://visible-space.com/contour) |
| **SketchAR / MuralArt Drawing Projector** | Quest (May 2025), Pico 4 Ultra (Jan 2026), phone | Real | No | No (it has lessons) | Hands/controllers | Yes. 3.0★ (247). | Long-running phone AR drawing app brought to Quest and Pico. | [Quest Store DB](https://queststoredb.com/app/sketchar-muralart-drawing-projector-9003180923141086/), [Sketchar Quest post](https://sketchar.io/blog/xr-drawing-meet-sketchar-for-meta-quest), [Pico post](https://sketchar.io/zh/blog/sketchar-is-now-on-pico-4-ultra-the-moment-vr-becomes-a-real-mural-tool) |
| **Wall Trace: Mural Drawing Projector** | Quest 3/3S | Real wall | No | No | **Hands** | Early access since 6 Sep 2026. 4.4★ (11). | Trace overlay for murals. | [Quest Store DB](https://queststoredb.com/app/wall-trace-mural-drawing-projector-28386229590968992/) |
| **passtracing** (open source, MIT) | Quest 2/Pro (WebXR) | Real | No | No | Controllers | Repo only (40 stars) | A reference implementation of paper-tracing in WebXR. | [GitHub](https://github.com/fabio914/passtracing) |
| **Easely** (2022 hackathon build) | Quest 2 | Real wall | No | No | Controllers | Hackathon APK only; read via search | Predecessor of the wall-projection idea. | [GitHubHelp](https://githubhelp.com/RalphVR/easely-meta-hackathon) |
| **"AR Drawing: Paint – Sketch"** (and many clones) | Android/iOS phone | Real (phone camera over paper) | No | No | Touch | Yes. 100K+ installs (HaLabs). | Stencil-on-screen tracing. A phone has to sit between your eyes and the paper. | [Google Play](https://play.google.com/store/apps/details?id=com.drawing.arsketch&hl=en_US) |
| **智永真草千字文+AR** | iOS phone/iPad | **Real** (detects a square grid, shows a red 描红 template under your brush) | Animated stroke demos for all 2,000 characters | No | Touch/phone | Yes. v1.4 (2023); listing live in 2025. 4.4★ (5). | The closest phone-AR calligraphy tool. Brush on real paper, no scoring. | [App Store](https://apps.apple.com/cn/app/%E6%99%BA%E6%B0%B8%E7%9C%9F%E8%8D%89%E5%8D%83%E5%AD%97%E6%96%87-ar/id1475228251) |
| **字習** | iOS | Virtual | No | No | Touch/Apple Pencil | Yes. 4.5★ (18). | Brush-engine writing tool. Lists Vision Pro as compatible (iPad app). | [App Store](https://apps.apple.com/tw/app/%E5%AD%97%E7%BF%92/id1492608770) |
| **RoboKana** (phone, stroke order) | iOS/web | Virtual | No | Yes (stroke order and shape) | Touch | Yes | Japanese handwriting judged on the phone screen. | [Site](https://robokana.com/) |
| **Drawee XR** | Android XR | Virtual | No | No | Hands | Yes. 10+ installs. | Android XR mixed-reality drawing. No calligraphy found. | [Google Play](https://play.google.com/store/apps/details?id=com.ChristophSpinger.Draweexr&hl=en_US) |

### 2c. Tracked stylus (Logitech MX Ink)

| Product | Platform | Notes | URL |
|---|---|---|---|
| **MX Ink** | Quest 2/3/3S | $130 stylus ($170 with Inkwell). Pressure-sensitive tip, 6DoF, and it works *with* a controller in the off hand. | [Road to VR](https://www.roadtovr.com/logitech-launches-mx-ink-the-first-official-stylus-accessory-for-quest/) |
| **MX Ink Experience** (Logitech showcase app) | Quest, early access | Writing on a physical surface; draws on real objects. 3.3★ (7). | [Meta Store](https://www.meta.com/experiences/logi-mx-ink-experience/9252418578183398/), [Logitech docs](https://logitech.github.io/mxink/DemoExperience.html) |
| **Supported apps list** | Quest | Includes Vermillion, Painting VR, Gravity Sketch, Open Brush, ShapesXR and others. Calligraphy support is only QalamMR (above) plus brush packs. | [UploadVR assessment](https://www.uploadvr.com/logitech-mx-ink-logitech-muse-asessment/) |

UploadVR notes that dual-mode input (MX Ink plus hand tracking) is rare on Quest.

**Takeaway:** MX Ink makes pen-tip tracking accurate, but it is a $130 accessory that few people own, and it conflicts with the contest rule of hands-only.

### 2d. Research and HCI

| Work | What it does | Real paper? | Ghost hands? | Scores? | Status | URL |
|---|---|---|---|---|---|---|
| **CalliSenseAR** (UIST '26) | "In-situ AR guidance for corrective and immersive Chinese calligraphy training." I could only retrieve the title; the abstract is not public. | Likely (in-situ) ⚠ | Unknown | "Corrective" implies feedback ⚠ | UIST 2026 programme (draft) | [Programme](https://programs.sigchi.org/uist/2026/program/content/275948) |
| **CalliSense** (CHI '25) | Captures and visualises the writing process (rhythm, force, brush posture) for teachers. Tested with 4 teachers and 12 students. | Real brush | No (a visualisation, not AR) | Visualises, not a score | Published | [arXiv](https://arxiv.org/abs/2502.15883) |
| **Ink Harmony** (SIGGRAPH 2024 Immersive Pavilion) | VR plus a **robotic arm that guides your hand** through strokes. | Virtual | Physical guidance | No | Demo | [ACM](https://dl.acm.org/doi/10.1145/3641521.3680540) (read via search) |
| **Learning Chinese Calligraphy in VR with Sponge-Enabled Haptic Feedback** (Interacting with Computers, 2023) | A sponge between controller and surface; faster novice learning than no haptics. | Virtual | No | User study | Published | [DOI](https://doi.org/10.1093/iwc/iwad041) (read via search) |
| **VR Body Calligraphy** (SIGGRAPH Asia 2024) | Hand-tracking (Quest) whole-body calligraphy performance; pinch controls ink. | Virtual | No | No | Art paper | [ACM](https://dl.acm.org/doi/10.1145/3680530.3695447) (read via search) |
| **The Mixed Reality Calligraphy Studying Environment** (IEEE VRW 2024) | MR glasses plus image capture and analysis to help calligraphy learners practise. A 2-page abstract. | Real | Not stated | Image analysis planned | Published | [HKUST portal](https://researchportal.hkust.edu.hk/en/publications/embracing-tradition-through-technology-the-mixed-reality-calligra-2/) |
| **GhostHands UX** (iLRN) | A mentor's real hands appear as a ghost in a worker's AR view (telementoring for industry). | Real task | **Yes, live mentor** | No | Published | [iLRN](https://publications.immersivelrn.org/academic/article/view/526) |
| **Learn2Write** (MDPI 2021) | Phone AR and ML that recognises a letter you wrote on **real paper** or a board. | Real | No | Recognition, not stroke scoring | Published | [MDPI](https://www.mdpi.com/2073-431x/11/1/4) (read via search) |
| **Patent application US 2025/0278902** | AR interaction guides placed on physical paper. Embodiments include painting and **calligraphy**, and the guide re-aligns as the paper moves. The assignee is not shown on the page I read, so check it before relying on it. | Real | Describes a hand visual | No | Filed 28 Feb 2025, published 4 Sep 2025 | [Justia](https://patents.justia.com/patent/20250278902) (read via search) |

**Takeaway:** the research validates ghost hands (GhostHands UX) and in-situ calligraphy guidance (CalliSenseAR). CalliSenseAR is the closest academic neighbour, and I could not read its abstract. No research system found combines recorded-master ghost hands, real paper and consumer Quest hardware with scoring.

### 2e. Platforms with nothing relevant found

- **Apple Vision Pro:** no calligraphy or handwriting teaching app found. The only hits are iPad apps that run on visionOS, and Logitech's Muse stylus (support is new). Searched on 18 Nov 2026.
- **Android XR / Galaxy XR:** Pencil! has an Android XR listing, and Drawee XR is a generic drawing app. No calligraphy app found.
- **Pico:** only You, Calligrapher and SketchAR (Pico 4 Ultra).
- **SideQuest/App Lab:** nothing calligraphy-specific that is not on the Horizon Store.
- **Devanagari and other Indian scripts on any headset:** **nothing found.** Hindi writing exists only as phone and tablet apps, for example [Write Devanagari Alphabet](https://play.google.com/store/apps/details?id=com.jvnconsultancy.writedevanagarialphabet&hl=en_US) (Android).

---

## 3. Analog: why PianoVision works and what transfers

From PianoVision's [features](https://www.pianovision.com/features/) and [Quest page](https://www.pianovision.com/meta-quest-piano-learning/):
- **Ghost hands** show finger placement.
- **Falling notes**, wait mode and per-run timing and accuracy stats give the practice a score.
- **A MIDI keyboard is the source of truth** for scoring. Hand tracking alone only gives a virtual piano.
- The "Memory Engine" gradually weans you off the headset.

**What transfers to calligraphy:**
- Ghost hands plus wait mode (the master pauses until you start the stroke).
- A progress curve and a "leave the headset" fade.
- A per-stroke report card.

**What does not transfer:**
- There is no MIDI equivalent. The scoring input is the open problem, covered in the verdict.

---

## 4. 2026 gallery overlap (aggregate only)

Checked against the local census (382 badge-verified entries, 14–16 Nov 2026) by keyword over titles, taglines and summaries. This is not a full-text read, and late entries are possible.

- **Calligraphy or script practice:** 2 entries, both hands-only on *virtual* surfaces (finger-tracing glowing strokes). None uses real paper, ghost master hands or per-stroke scoring against a recorded master.
- **Real-paper trace overlay:** 1 entry exists (a picture traced onto real paper with a real pencil). No ghost hands, no scoring.
- **Ghost-hand skill tutoring in other crafts:** several entries exist (sign language, fingerspelling, origami). None targets handwriting.
- **Other crafts:** entries exist for rangoli and for rope knots. Rangoli is a mild overlap with a mudra or rangoli pivot (see below).
- **Net:** a 2026 entry exists in each adjacent lane. **No entry combines ghost master hands, real paper and scoring.**
- This **corrects** the earlier "no similar entries found" line in [idea-shortlist.md](idea-shortlist.md) §1. It should read "adjacent entries exist; no direct rival".

---

## 5. What would make Hands of a Master clearly different

Ranked by value for judges and for you.

1. **Devanagari (and other Indian scripts) first.**
   - **Gap:** no headset app teaches Devanagari, and only phone and tablet apps exist. Every calligraphy app on Quest is Chinese, Arabic or Japanese.
   - **Content is cheap:** a small set of letters (the shirorekha headline, matras, ka–gya) records quickly.
   - **Reach:** it ties to the Hindi-language audience and Indian craft framing. It fits **Best Reason to Come Back** (daily practice streak).
2. **A recorded real master, not an animation.**
   - Capture one calligrapher's actual hand motion and show it as a ghost. QalamMR's maker called this "an amazing idea… for future updates", so the idea has no shipped version yet.
   - Show the master's *pace*, including the lifts and the pauses.
3. **Honest per-stroke scoring with a clear method.** Choose one:
   - **Air-pen score** (hands-only, most robust): score index-fingertip or pen-pose path, order and tempo against the master, calibrated to a marked page.
   - **Camera check** (Unity, Quest 3/3S): after each stroke, compare the real ink against the template. Treat it as a bonus unless you have tested it on a headset.
   - Pencil! (no scoring) and PianoVision (needs MIDI) both avoided this problem.
4. **Hands-only with accessibility as the point.** Slow tempo, one-handed mode, captioned guidance, and no stylus to buy. QalamMR needs an MX Ink; You, Calligrapher needs controllers.
5. **Brush and pen calligraphy, not drawing.** Pencil! owns "learn to draw". Rhythm, pressure proxy and stroke order are the calligraphy angle.

**Do not claim:**
- "The first AR calligraphy app" (the phone AR 描红 app and the research above exist).
- "The first MR drawing teacher" (Pencil!).
- "The first calligraphy app on Quest" (QalamMR and You, Calligrapher).

**Defensible claim:** "the first app on Quest where a recorded master's hands guide *your* hands over real paper and score each stroke", and "the first for Devanagari".

---

## 6. Pivot options inside "Hands of a Master": other crafts

Status is as of 18 Nov 2026.

| Craft | Quest status | 2026 gallery | Scoring feasibility (⚠ my judgement) | Verdict |
|---|---|---|---|---|
| **Devanagari / Indian-script writing** | **Open.** Nothing on any headset; phone apps only. | None found | Same as calligraphy: air-pen score is robust, ink check is risky. | **Best: keep the idea, change the script.** |
| **Mudras** (Indian classical dance hand shapes) | **Open.** Only concepts and prototypes: a hobby VR project ([LinkedIn](https://www.linkedin.com/posts/nidhi-surekha_vrdesign-culturaltech-handtracking-activity-7336338512926973952-UhlD)), a design case study ([Behance](https://www.behance.net/gallery/245286249/Gesture-Based-Learning-of-Bharatanatyam-Through-AR)), a web recogniser. | None found | **Best.** Hand-pose matching is exactly what Quest tracking does well. No pen occlusion and no paper. | **Strong alternative.** Fits ghost hands plus per-pose scoring cleanly. Overlaps Twin Hands (idea 7). |
| **Rangoli / kolam** | Partly open. No Quest app found; phone mehndi/henna try-on apps exist. | Entries exist | Powder-drop motion is hard to score. | Crowded-ish. Weak pivot. |
| **Mehndi / henna** | Phone AR try-on apps only ([example](https://play.google.com/store/apps/details?id=com.mehndiar.app&hl=en_US)). | None found | Tracing on a real hand or arm is hard; hand tracking wobbles. | Open, but risky. |
| **Origami** | Quest virtual-folding games exist. | Several entries | Real-paper fold verification isn't feasible. | Crowded. Skip. |
| **Knots** | A 2023 free experimental Quest app ([Rigging Drill](http://blog.marineverse.com/spatial/2023/07/31/rigging-drill-tie-knots-in-mixed-reality.html), read via search). | Entry exists | Real-rope tracking is poor. | Skip. |
| **Sign language** | Taken: [Gesture Play](https://www.meta.com/en-gb/experiences/gesture-play/24771852309158778/) (ASL alphabet, hand-tracking, scored), [Silent Classroom ASL](https://www.meta.com/en-gb/experiences/silent-classroom-asl-vr/9249215595132131/). | Several entries | Occlusion limits letters. Gesture Play drops J, M, N, P, Q, R, T and U. | Taken. Skip. |
| **Pottery** | Virtual apps ([YourPottery](https://www.altlabvr.com/yourpottery), [Clayground](https://www.clayvr.com/)); an MR *concept* with AR overlays on real clay ([Creta](https://devpost.com/software/creta-learning-pottery-through-the-past), 2025 design challenge). | None found | Force and clay shape can't be scored from hand tracking. | Concept exists; scoring is infeasible. Keep as a "future" slide. |
| **Sitar / tabla / harmonium** | **No Quest app found** for Indian instruments. Others: PianoVision, [Museverse](https://museverse.xyz/) (piano, taiko, marimba), [Immerrock](https://www.uploadvr.com/immerrock-guitar-training-hands-on-slightly-off-tune/) (guitar). | None found | ⚠ Quest's microphone could score pitch or bols by audio. Hand-tracking a real sitar neck is uncertain. | Open niche, but unproven. Prototype risk is high. |

**Best pivot:** mudras, if you want scoring that works with hands-only tracking. Devanagari is the best differentiator if you want to keep real paper.

---

## 7. Recommendation

1. **Keep Hands of a Master, but make it Devanagari-first.** Don't pitch it as "calligraphy on Quest" in general, because that lane now has several occupants.
2. **Decide the scoring method before building.** Try the air-pen path score first, because it is hands-only and works in WebXR. Test the camera check on a headset only if you go Unity.
3. **Reframe the shortlist line** from "no similar entries" to "adjacent entries exist; no direct rival".
4. **Hold mudras as a fallback or add-on,** because it has the easiest reliable scoring and an open Quest niche.
5. **Don't depend on MX Ink.** It breaks hands-only and almost no judge will own one.

## 8. Caveats

- **Absence of evidence:** "no shipped product found" is based on store and web searches. Private, regional-store or unreleased apps may exist.
- **Meta Horizon Store:** most pages are JavaScript-rendered. Details come from page text read via fetch plus Quest Store DB and AltLab mirrors; ratings may drift.
- **QalamMR scoring:** I found no per-stroke score in its listing. If it adds one, it becomes the closest competitor.
- **CalliSenseAR:** only the UIST '26 programme title was readable. Treat its features as unknown.
- **The patent application** is not legal advice. Check the assignee and claims before relying on it.

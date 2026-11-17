# Ideas 7 and 8: bilateral hand "brain gym" and Indian palmistry in MR

Added 18 Nov 2026. Both ideas came from Saurabh. Same rules as the [shortlist](idea-shortlist.md): hands-only, seated (2 ft radius), loop ≤10 min, ≥60 fps on Quest 3/3S, no logos, public video under 3 minutes.

- **No 2026 project is named or linked.** Rival status below comes from keyword counts over the public gallery data, in aggregate only. See [submissions-2026-aggregate.md](submissions-2026-aggregate.md).
- ⚠ marks my design suggestion, assumption or risk call. It is not a sourced fact.
- **More resources:** existing apps, open-source repos, datasets and learning links for both ideas are in [ideas-7-8-resources.md](ideas-7-8-resources.md).

| | **7. Twin Hands** | **8. Hast Rekha** |
|---|---|---|
| One line | Bimanual coordination practice game with a ghost-hand coach and live sync scoring | A pandit reads your palm in passthrough: glowing lines, lit mounts, a reading, a share card |
| Verdict | **Evidence:** fun, legitimate coordination/timing practice. No good evidence it repairs attention. Pitch it as practice, not therapy | **Feasibility:** hands-only version is solid. Line detection from camera frames is possible on Quest 3/3S in Unity but unproven on real palms. Tracing mode is the safe fallback |
| Engine | IWSDK (WebXR) | Unity (for the Passthrough Camera API); IWSDK for a hands-only tier |
| Biggest risk | Overclaiming health benefits; hand-crossing occlusion | Palm creases may not be readable at 1280×960 passthrough resolution |

---

# 7. Twin Hands (bilateral hand-coordination "brain gym")

## 7.1 Idea
Many people feel their attention is scattered by phones. Saurabh's premise: doing different or opposite movements with each hand (for example wrists rotating in opposite directions, or fingers closing little-to-thumb on one hand and thumb-to-little on the other) "gets the brain back in shape".

Twin Hands is a short, hands-only practice game built on that kind of movement. A ghost-hand coach shows the pattern, both of your real hands try it, and the headset scores how well the two hands stay in sync, accurate and on tempo.

## 7.2 Evidence: claimed vs supported

**Honest summary.** The movements are real motor-coordination tasks and can be trained and scored. The idea that they "reconnect" or "unblock" the brain, or restore attention, is not supported.

| Claim | Status | What the sources say |
|---|---|---|
| "Brain Gym" cross-lateral movements improve learning/attention by "connecting brain circuits" | **Not supported** | Hyatt's 2007 review found only 5 peer-reviewed efficacy studies, all with serious methodological flaws, and concluded the data did not show Brain Gym beats no treatment ([Hyatt 2007](https://dx.doi.org/10.1177%2F07419325070280020201), summarised in [Spaulding et al. 2010](https://www.researchgate.net/publication/42802004_Is_Brain_GymR_an_Effective_Educational_Intervention)). Spaulding et al. found no high-quality or even acceptable studies. In 2008 the British Neuroscience Association, the Physiological Society and Sense About Science wrote to UK education authorities calling its explanations pseudoscientific ([Guardian](https://www.theguardian.com/science/2008/apr/03/brain.gym)) |
| Anti-phase hand movements are harder than in-phase, and get harder with speed | **Well supported** | Kelso's classic finger-wagging study: at increasing frequency, anti-phase movement spontaneously switches to in-phase ([Kelso 1984](https://pubmed.ncbi.nlm.nih.gov/6742155/)). This gives a principled difficulty ladder: tempo makes the harder patterns break first |
| Bimanual coordination can be trained | **Supported** | In 26 adults aged 60–67, six sessions of bimanual tasks cut coordination error and variability by more than 50%; anti-phase and complex modes and imposed speed were recommended ([Mockałło et al. 2020](https://www.researchgate.net/publication/339702025_Effectiveness_of_bimanual_coordination_tasks_performance_in_improving_coordination_skills_and_cognitive_functions_in_elderly)) |
| …and it transfers to attention/memory | **Mixed, weak** | The same 2020 study found **no** differences in attention or working memory. A small 2023 study (n=17, older adults) reported transfer of anti-phase training to untrained inhibition tasks, which is promising but preliminary ([Frontiers 2023](https://www.frontiersin.org/journals/aging-neuroscience/articles/10.3389/fnagi.2023.1124109/full)) |
| Playing an instrument (bimanual) helps executive function | **Some support** | In 135 older adults, 16 weeks of piano or percussion improved bimanual synchronisation and visual scanning/working memory vs a listening-only group ([Frontiers 2019](https://www.researchgate.net/publication/337773079_The_Effects_of_Bimanual_Coordination_in_Music_Interventions_on_Executive_Functions_in_Aging_Adults)). That is 16 weeks with ~3 h/week practice, far more than a 5-minute game |
| Cognitive-motor training helps executive function | **Positive but fragile** | A meta-analysis of 25 studies in older adults found small gains in global cognition and inhibitory control, with high heterogeneity, and the effects did not survive a sensitivity analysis. Programmes with progressive difficulty and task specificity worked better ([Eur Rev Aging Phys Act 2020](https://pubmed.ncbi.nlm.nih.gov/32636957/)) |
| Coordination training helps cognition in mild cognitive impairment | **Trend only** | A 2026 network meta-analysis found a positive trend whose confidence interval crossed zero. Combined physical-cognitive training ranked best ([iScience](https://www.cell.com/iscience/fulltext/S2589-0042(26)02940-8)) |
| Tapping/timing practice improves sustained attention | **Small near-transfer** | Five daily 30-minute sessions of synchronisation tapping with feedback improved sustained attention (CPT-II) vs a passive control, but not fluid intelligence ([Karampela et al. 2020](https://www.researchgate.net/publication/340113612_Motor_timing_training_improves_sustained_attention_performance_but_not_fluid_intelligence_near_but_not_far_transfer)). Small study with a passive (not active) control |
| Phones are wrecking attention | **Contested** | A 2023 meta-analysis found a significant negative overall effect of smartphone use/presence on cognition, with high heterogeneity ([Böttger et al.](https://www.mdpi.com/2076-328x/13/9/751)). A 2024 four-level meta-analysis found no meaningful effect of the mere presence of a phone ([PsyPost summary](https://www.psypost.org/smartphone-in-sight-no-impact-on-cognitive-performance-study-finds/)) |
| Far transfer from cognitive training in general | **Generally weak** | The general finding in the literature is near transfer but little far transfer ([Sala et al. second-order meta-analysis](https://psycnet.apa.org/record/2019-24562-001)). ⚠ I could not open the abstract; this is from the title and my recollection, so verify before quoting |

**Gaps.** Almost all the supportive studies are in older adults. I found no study of a short bimanual routine improving attention in young adults.

**Pitch rules (no medical claims).**
- **OK to say:**
  - "Coordination and focus practice you can score."
  - "Train your two hands to do different things at once."
  - "Your sync score improves as you practice."
  - "A five-minute screen-break that asks for your full attention."
- **Do not say:**
  - Treats, cures or reverses attention loss, ADHD, or "brain damage from phones".
  - "Rewires" or "reconnects" your brain.
  - Anything from Brain Gym's vocabulary ("unblock", "integrate hemispheres").
  - Any clinical or cognitive-score claim.
- In-app numbers are "practice metrics", never a cognitive measure.
- Footer line in the app and the Devpost text: "A coordination game, not a medical device. It makes no health claims."
- ⚠ A fair framing of the transfer evidence is "motor timing and coordination are skills that can be trained, and sustained-attention demands are part of the task".

## 7.3 Exercise catalogue (11 hand-tracking-detectable exercises)

**Joint data.** Quest tracks the hand as a skeleton. The OpenXR extension defines **26 joints per hand**: 4 for the thumb, 5 for each other finger, wrist and palm ([OpenXR spec](https://registry.khronos.org/OpenXR/specs/1.0/html/xrspec.html)). **WebXR exposes 25** because it has no palm joint ([Chromium's OpenXR hand code](https://github.com/brave/chromium/raw/861acd0eba5552d43769c70d15364e5e0a39ae94/device/vr/openxr/openxr_hand_tracker.cc), [MDN XRHand](https://developer.mozilla.org/en-US/docs/Web/API/XRHand)). The palm centre is easy to recompute from the metacarpals, so this does not matter.

**Mirror vs parallel.**
- Rotating one wrist clockwise and the other counter-clockwise is *mirror-symmetric*. Both hands move toward the midline together, which is the "in-phase" pattern in the Kelso sense.
- Rotating both the same way (parallel) is usually the harder pattern.
- So the ladder is ⚠ roughly: mirror → parallel → different shape or sequence per hand → different rhythm per hand.
- This is my reading of the literature, and it is task-dependent. Measure it in playtests rather than assuming.
- Label the two variants "Mirror" (opposite rotation) and "Parallel" (same rotation) in the UI.

| # | Exercise | Detection from joints | Tracking pitfalls |
|---|---|---|---|
| 1 | **Mirror wrist circles** (left clockwise, right counter-clockwise) | Per hand, u = normalise(middle-metacarpal − wrist). The mean of u over the last ~2 s approximates the forearm axis. Project u onto the plane perpendicular to that mean, take θ = atan2, then ω = dθ/dt. Direction is sign(ω) per hand, in the user's head frame. Sync = circular spread of (θ_R − θ_L) | Hands stay apart, so little occlusion. Noise on the wrist joint (it's an estimated point). Faster than ~1.5 Hz gets jittery |
| 2 | **Parallel wrist circles** (both clockwise) | Same as #1, target relative phase differs | Same as #1 |
| 3 | **Opposite finger opposition** (left little→thumb, right thumb→little) | Per finger i, pinch when dist(thumbTip, fingerTip) < ~2 cm with hysteresis (enter 1.8 cm, exit 2.8 cm). Log the sequence of pinch onsets per hand, compare order and timing to the target | The thumb is hidden behind the fingers on some hand orientations. Self-occlusion in fast sequences. Unity can use `OVRHand.GetFingerIsPinching`; WebXR needs the joint distance. 30 Hz default sampling blurs fast taps |
| 4 | **Same-order finger opposition** (both little→thumb) | Same as #3, mirror target | Same as #3 |
| 5 | **Fist-roll opposition** (left closes little→index, right opens index→little) | Per-finger flexion angle from the chain (proximal vs metacarpal vectors); sequential closing time per finger | A closed fist is mostly tracked, but fingers deep in the palm are guessed. Use angles with hysteresis, not tip positions |
| 6 | **In-phase vs anti-phase open/close** (both hands "pump" together, or alternate) | Per hand, signal s(t) = mean fingertip-to-palm distance. Relative phase from peak timing or a Hilbert transform. Score vs the 0° or 180° target | Easy to detect. The main pitfall is that hands at the same depth can overlap if the user drifts inward |
| 7 | **Thumb-up / pinky-up switch** (left thumb up while right pinky up, then swap on the beat) | Boolean finger-extended flags (finger tip farther from the palm than its knuckle). Meta's ISDK `ShapeRecognizer` does this in Unity | Extended-finger tests are noisy on a half-curled finger. Add a minimum hold time (150 ms) |
| 8 | **Opposite lazy-8s** (one hand draws ∞ clockwise, the other counter-clockwise in the air) | Index-tip path in a head-relative frame. Fit to an ∞ template with dynamic time warping, or track the crossing-point count and direction | No surface, so drawing size drifts. Be loose with the template. Index fingertip is occluded if the user curls the other fingers |
| 9 | **Different shapes at once** (circle with one hand, square or triangle with the other) | Index-tip path per hand, run a $1-style path recogniser for each | Scale and speed variation. Hand pair rarely collides if the shapes are in two separate boxes |
| 10 | **Push–pull pistons** (left hand moves away from you while the right comes toward you) | Palm-centre depth along the head-forward axis; phase between the hands | Meta notes that motion parallel to the view direction is tracked less well than motion away from the player ([Limitations & mitigations](https://developers.meta.com/horizon/design/hands-limitations-mitigations/)). Use small, slow movements |
| 11 | **Polyrhythm tapping** (left taps index–thumb on every beat, right taps middle–thumb on every other beat, or 3:2) | Pinch-onset timestamps vs a metronome. Score inter-onset-interval error and its variability | Hand tracking runs at **30 Hz by default**, so timing resolution is ~33 ms. Use ±100 ms scoring windows. Fast Motion Mode samples at 50–60 Hz in Unity, but can't be combined with simultaneous controllers ([UploadVR](https://www.uploadvr.com/quest-hand-tracking-2-4-improves-fast-motion-mode/)) |

**Bonus (cross-lateral reach, Brain-Gym-flavoured but harmless as a game).** Targets float on the opposite side of your body's midline. The right hand reaches for left targets and vice versa. Detect with hand position relative to the head-yaw midline. Occlusion risk is high when arms cross, so put targets at different depths and keep the hands apart.

**Tracking rules across all exercises.**
- **Occlusion.** Meta's guidance is to minimise hand overlap: the more one hand covers the other, the lower the accuracy ([Limitations & mitigations](https://developers.meta.com/horizon/design/hands-limitations-mitigations/)). Their troubleshooting page says to fade the hands when one occludes the other ([Troubleshooting](https://developers.meta.com/horizon/documentation/unity/unity-handtracking-troubleshooting-limitations/)).
  - ⚠ **Rule: never score a rep when either hand is low-confidence or lost.** Pause the timer and fade the ghost instead.
  - Never design a pattern where one hand must cross over the other.
- **Fast motion.** Cap the target tempo ⚠ around 1.5 reps/s for hands and 2 taps/s per hand, and make faster levels harder in the *pattern*, not the speed. Meta suggests predictable target speed and visual cues to keep users at a trackable pace.
- **Tracking volume.** Hands resting by the thighs or too near the face are not tracked. Keep the exercise zone at chest height, in front.
- **Lighting.** Hand tracking depends on room light; show a "light is too dim" hint.
- **Noise.** Filter joint positions lightly (e.g. a 1€ filter) before computing angles and phases.

## 7.4 App design

**Session flow (about 5 minutes).**
1. **Hand check (10 s).** Both palms up so the app confirms tracking and shows a clear "ready" state.
2. **Warm-up (30 s).** Easy mirror open/close (#6) with the ghost demo.
3. **Three blocks (about 75 s each).**
   - Ghost-hand demo plays at full speed (10 s).
   - Slow try-along (10 s).
   - Scored round (about 55 s).
4. **Switch challenge (30 s).** At random cues (a colour or a chime) the target flips, e.g. mirror → parallel. This trains stopping and switching, and the response time is a "focus" metric.
5. **Cooldown (20 s).** Slow open-close breaths with a calm visual.
6. **Results.** Sync graph, three sub-scores, streak.

**Progression and difficulty.** Backed by the finding that progressive difficulty and task specificity improved outcomes ([2020 meta-analysis](https://pubmed.ncbi.nlm.nih.gov/32636957/)), and that imposed speed and anti-phase/complex modes gave bigger coordination gains ([Mockałło 2020](https://www.researchgate.net/publication/339702025_Effectiveness_of_bimanual_coordination_tasks_performance_in_improving_coordination_skills_and_cognitive_functions_in_elderly)).
- **Tempo:** 40 → 90 BPM, with an adaptive staircase ⚠. +5% after three scores ≥80, −5% after two scores below 50.
- **Pattern ladder:** mirror → parallel → different shapes → polyrhythm → dual-task.
- **Dual-task layer:** a colour cue (Stroop-style) says which hand must reverse.
- **Levels:** unlock in a fixed order so a first-time player can't land in anti-phase at 90 BPM.

**Scoring (all shown to the player, 0–100).**
- **Sync:** 1 − (circular SD of relative phase ÷ threshold). The standard measure in the bimanual literature is the mean and variability of relative phase between limbs. Also show the mean phase error from the target (0° or 180°).
- **Accuracy:** share of reps that match the target pattern (right direction, right finger order).
- **Tempo:** error against the metronome, in inter-onset intervals, plus its variability.
- **Focus ribbon:** a rolling score through the round. Dips show lapses, and the slope shows time-on-task decline. Plus the **switch-cost** time after the pattern flip. All labelled "practice metrics", not a cognitive measure.

**Ghost-hand demo.**
- Two translucent ghost hands float in the exercise zone and play a recorded joint animation.
- Each exercise is a short, looping recording of the two hands. Record them yourself with a small recorder (tracked joints per frame, ~60 frames/s) and play them back on a skinned hand rig. **Reuse the ghost-hand recorder/player from Hands of a Master** ([idea 1](idea-shortlist.md)).
- Your real hands are visible through passthrough (or rendered in VR). Fingertips leave a trail that turns green when you match, amber when you lag.
- A "mirror coach" mode shows your left hand mirrored on the right as a hint for symmetrical patterns.

**Why VR beats a phone video.**
- **Real-time, objective feedback.** A phone video can't tell you whether your own hands were in sync. The headset sees both hands and scores them live, with trails that show timing errors.
- **Full attention.** Wearing the headset means no notifications and no idle thumb scrolling. ⚠ In passthrough MR you can still see your phone, so the "you can't check your phone" claim is stronger in a fully virtual calm room than in dimmed passthrough. Offer both and say so honestly.
- **Spatial coach.** Ghost hands sit where your hands should be, not on a screen you have to translate to your body.
- **Don't claim** that this beats a phone for health outcomes. The claim is about feedback and focus.

**Hands-only fit.**
- No controller needed. A palm-up pinch starts a session and a poke selects a level.
- Everything happens in a 40 cm box in front of the chest, seated, elbows resting if needed.
- Accessibility: slow-tempo mode, one-hand "half-pattern" mode, large on-screen cues, and no flashing visuals.

**60 fps build.** The detection math is trivial: a few hundred floating-point ops per frame, plus two skinned hand meshes and trail ribbons. Keep trails GPU-instanced and avoid per-frame allocations in the phase buffers. Test with a performance overlay on a real Quest 3/3S.

**Engine: IWSDK (WebXR) for the MVP.**
- No camera or platform features are needed, only joint poses.
- Fastest iteration on Linux, with the Immersive Web Emulator and a link to share.
- Joint maths is the same in any engine.
- ⚠ The cost: WebXR gives no hand confidence value, no pinch-strength, and (as far as I know) no Fast Motion Mode. Treat a joint pose that is missing or invalid as "lost", and keep the tempo cap conservative. Verify the achievable hand-update rate on a real headset early.
- **Choose Unity + Interaction SDK instead** only if testing shows the browser's hand rate or latency is too poor for the tapping exercises. Unity gives `OVRHand` confidence and pinch states, `ShapeRecognizer`, and Fast Motion Mode ([ISDK hand pose detection](https://developers.meta.com/horizon/documentation/unity/unity-isdk-hand-pose-detection), [Hand pose tutorial](https://developers.meta.com/horizon/documentation/unity/unity-isdk-building-hand-pose-recognizer/)).

**MVP for about one day (⚠ rough hours).**
1. (1–2 h) Scaffold, log joints, draw the exercise zone and a live "both hands tracked" indicator.
2. (3 h) Three detectors: **#1/#2 wrist circles**, **#3/#4 finger opposition**, **#6 open/close phase**. Plus the sync/accuracy score.
3. (2–3 h) Ghost hands: record the three demos, play them back.
4. (2 h) Session loop: demo → try → scored round → results; local-storage streak; three tempo levels.
5. (1–2 h) Polish: trails, sounds, metronome, "light is too dim" hint, disclaimer line.
6. Video: 45–60 s using the [trailer approach](../video/trailer-scripts.md). Ghost hands + glowing trails on real hands are the hook.

**Cut if short on time:** shapes (#9), lazy-8 (#8), pistons (#10), polyrhythm, dual-task layer, switch challenge, and the cooldown.

**Risks.**
- **Health overclaim.** The biggest risk by far. Follow the pitch rules in 7.2. Judges may know the Brain Gym history.
- **Crowded lane.** Wellness/meditation is the most crowded theme in the gallery (34 of 382 entries, 9%; [aggregate](submissions-2026-aggregate.md)). The edge is the *scored two-hand coordination*, not "wellness".
- **Occlusion and tracking loss** when the hands get close. Mitigated by the "never cross" rule and confidence gating.
- **Fun.** Coordination drills can be dull. Add a metronome beat or music, and make the visual feedback satisfying.
- **Fatigue.** Short rounds (about 1 minute) and rest breaks.

**Name.** **Twin Hands.** Alternatives: Mind Duet, Both Hands, Sync Hands.

**2026 rival status (aggregate).** Keyword search over the 382 gallery entries found **no entry built around bilateral or bimanual coordination training**. Adjacent: about one entry is themed on short attention spans (a different mechanic), and 2–3 are hand-rehabilitation tools (clinical framing). Approximate keyword matching, so treat as indicative.

**Target prizes.** Tracks: Entertainment or Productivity. Special awards: **Best Accessibility Forward Experience** (slow-tempo, one-hand modes), **Best Reason to Come Back** (streaks, visible improvement between sessions).

---

# 8. Hast Rekha (Indian palmistry in MR)

## 8.1 Idea
In the Indian tradition of *hast rekha* / *hast samudrika shastra*, the lines, mounts and shape of the palm are read as signs of a person's temperament and life path. Hast Rekha puts a pandit in your room. You hold up your palm in passthrough, glowing lines trace across your real hand, the mounts light up one by one, the pandit explains what the tradition says, and you leave with a shareable card.

**Framing.** Culture and entertainment, never prediction. The app says so on its opening card and in the pandit's script: "The tradition says…".

## 8.2 What the tradition says (for content)

**Background.** *Hasta Samudrika* is the palmistry branch of the wider Samudrika Shastra, the study of body marks, which also includes face reading and skull reading. It is linked in tradition to the Garuda Purana ([overview](https://www.astroword.in/blog/hastarekha-shastra-complete-guide-vedic-palmistry), [Wikipedia](https://en.wikipedia.org/wiki/Palmistry)).

**Lines.** Sources agree on the four major lines. Interpretations vary between teachers ([Wikipedia: "many and often conflicting interpretations"](https://en.wikipedia.org/wiki/Palmistry)), so stick to broad tendencies.

| Line | Hindi/Sanskrit | Where | Traditional reading (broad) |
|---|---|---|---|
| Life line | Jeevan Rekha | Curves around the base of the thumb | Vitality and quality of life energy. Classical sources say it is *not* lifespan |
| Heart line | Hridaya Rekha | Runs across under the fingers | Emotional nature and bonding style |
| Head line | Mastishka Rekha | Starts near the index finger side and crosses the palm | Thinking style: curved is intuitive, straight is analytical |
| Fate line | Bhagya Rekha (also Karma/Dhana) | Rises vertically toward the Saturn mount | Career stability and direction. Absence is read as a self-directed path, not bad luck |
| Sun line (optional) | Surya Rekha | Vertical toward the ring finger | Recognition, creative success |

Sources: [AstroWord](https://www.astroword.in/blog/hastarekha-shastra-complete-guide-vedic-palmistry), [Head line guide](https://likhahai.com/palmistry/head-line/), [Palm line guide](https://www.rekhai.in/blog/how-to-read-palm-lines), [Sun line guide](https://astrosight.ai/palmistry/sun-line-fame-success-vedic-astrology).

**Mounts (*parvat*).** Seven classical mounts, each tied to a planet ([AstroWord](https://www.astroword.in/blog/hastarekha-shastra-complete-guide-vedic-palmistry)):

| Mount | Planet | Place | Trait |
|---|---|---|---|
| Guru | Jupiter | Below the index finger | Ambition, leadership |
| Shani | Saturn | Below the middle finger | Discipline, wisdom |
| Surya | Sun | Below the ring finger | Creativity, recognition |
| Budh | Mercury | Below the little finger | Communication, business sense |
| Mangal | Mars | Edge of the palm below Mercury | Courage, resilience |
| Chandra | Moon | Lower edge of the palm | Intuition, imagination |
| Shukra | Venus | Base of the thumb, encircled by the life line | Vitality, relationships |

A raised mount is read as strong in that trait. An exaggerated one tips into excess. Some teachers also split Mars into two mounts ⚠ (from my memory of palmistry texts, not from the sources above).

**Hand shape ("elements").** The same guide describes four types by palm shape and finger length:

| Type | Palm | Fingers | Reading |
|---|---|---|---|
| Earth | Square | Short | Practical, grounded |
| Air | Square or rectangular | Long | Intellectual, social |
| Fire | Rectangular | Short | Energetic, spontaneous |
| Water | Long, narrow | Long, slender | Emotional, intuitive |

**Which hand.** One Indian palmistry author cited there says the dominant hand shows the present and active life, and the non-dominant hand shows the innate potential, regardless of gender ([AstroWord](https://www.astroword.in/blog/hastarekha-shastra-complete-guide-vedic-palmistry)).

**What not to include.** Lifespan from the life line, number of marriages from marriage lines, death, illness, money-loss predictions. The "money line" has three different locations in different sources, so skip it.

## 8.3 Honest status of palmistry
Palmistry is widely regarded as pseudoscience, because interpretations conflict between teachers and its predictions lack evidence ([Wikipedia](https://en.wikipedia.org/wiki/Palmistry)). Skeptics note that readings can feel accurate through cold reading, meaning high-probability guesses and cues from the sitter (same page), and through the Barnum effect, where vague statements feel personal ([overview of the science](https://elcizgisi.com/en/blog/is-palmistry-scientific)). The real science is dermatoglyphics, the study of ridge patterns, which is different from the palm-line reading.

So Hast Rekha is a **cultural and storytelling experience**, with:
- A disclaimer on the first card: "A cultural entertainment. Not a prediction. Not advice."
- Readings written as "tendencies", positive or reflective, and never about health, death, relationships ending or money loss.
- No claim that the AI "knows" anything. The pandit is a character.
- ⚠ Treat it with respect for the tradition: use the Sanskrit names, credit Samudrika Shastra, and avoid mocking tones.

## 8.4 Technical reality

**What hand tracking gives.** Joint poses only (26 joints in OpenXR/Unity, 25 in WebXR). **It does not give palm-crease images.** From joints alone you can compute:
- Palm width, palm length, finger-to-palm ratios, which give the hand "element".
- Mount zones, as fixed positions on the palm relative to the finger joints (e.g. Guru below the index knuckle).
- Which hand, whether the palm faces you, whether the fingers are spread, how still the hand is.
- Fingertip paths hovering above the palm, which is what the "trace" mode below uses.

⚠ Hand-tracking bone lengths are estimates, so finger-length ratios are noisy. Average over about 60 frames and keep the classification coarse.

**Passthrough Camera API (PCA): current rules** ([Unity overview, updated 10 Nov 2026](https://developers.meta.com/horizon/documentation/unity/unity-pca-overview/)).
- Quest 3 and 3S only, Horizon OS v74 or later. Passthrough must be enabled.
- Permission `horizonos.permission.HEADSET_CAMERA`, which gives the passthrough camera only. (`android.permission.CAMERA` also works but grants avatar camera too.) The user sees an in-headset prompt ([Meta help](https://www.meta.com/help/quest/511837681585017/)).
- Unity: the `PassthroughCameraAccess` component in MRUK v81 or later, replacing the old `WebCamTexture` route ([migration guide](https://developers.meta.com/vr/documentation/unity/unity-pca-migration-from-webcamtexture/)). It gives timestamps, both cameras, intrinsics, extrinsics and pose. Official samples: [CameraViewer](https://developers.meta.com/horizon/documentation/unity/unity-sample-camera-viewer/) and others in the [Unity-PassthroughCameraApiSamples repo](https://github.com/oculus-samples/Unity-PassthroughCameraApiSamples).
- Resolution: 1280×960 (and 1280×1280 from v83, 1728×1728 from v209). Data rate 60 Hz, latency 20–40 ms. **Do not hard-code the highest resolution**: query the supported list.
- The camera sees the real world without virtual objects. Only one foreground app gets camera data.
- Published apps may use it. Meta opened publishing in [May 2025](https://www.roadtovr.com/meta-quest-passthrough-camera-api-public-publish-horizon-store/).
- Camera frames are **Device User Data** under Meta's [Developer Data Use Policy](https://developers.meta.com/vr/policy/data-use/). Prohibited uses include surveillance and uniquely identifying a user (per the Road to VR summary above). Hast Rekha does neither, but this shapes the privacy design below.
- **Simulator.** An older version of the docs said PCA is not supported in the XR Simulator. The 10 Nov 2026 migration guide says MRUK v205+ can preview PCA in the Meta XR Simulator. Either way a simulator frame has no real palm creases, so **line detection needs a physical Quest 3/3S**.
- ⚠ **Data Use Checkup (DUC):** Meta requires a DUC for apps using Platform SDK features that fall under its data policy ([DUC page](https://developers.meta.com/horizon/resources/publish-data-use)). I did not confirm whether PCA appears on that list. Check before submitting.

**WebXR / IWSDK access to camera frames: not available the same way.**
- The W3C [Raw Camera Access](https://immersive-web.github.io/raw-camera-access/) module (`camera-access` feature) exists as a draft. In February 2026 a developer reported that Quest Browser rejects it ("Feature 'camera-access' is not supported for mode: immersive-ar") on Horizon OS v85, and as of 16 Nov 2026 forum replies were still asking for it ([Meta forum thread](https://communityforums.atmeta.com/questions-and-discussions-26/request-webxr-raw-camera-access-camera-access-feature-in-quest-browser-177407)).
- IWSDK's camera feature uses the browser's **MediaDevices (`getUserMedia`)** API ([IWSDK camera guide](https://developers.meta.com/horizon/documentation/iwsdk/guides/13-camera-access/)). That same forum post says a `getUserMedia` fallback "works" but without pose-aligned per-eye frames or intrinsics.
- ⚠ **Not verified:** whether `getUserMedia` in Quest Browser exposes the *passthrough* cameras or something else, and at what quality. A 2025 winner team noted that Quest-browser camera intrinsics were too unreliable for an object-pose approach ([winners analysis](past-winners-2025-analysis.md)). Spend ten minutes on a real headset to test before choosing IWSDK for the camera path.
- **So for the scan mode, use Unity.** Use IWSDK only for a hands-only version.

**Can a palm's creases be seen at all? Honest verdict: probably the three or four deep principal lines, maybe not fine ones; unverified on real users.**
- Geometry: pixels per millimetre ≈ fx ÷ distance_mm, where fx is the focal length in pixels from the camera intrinsics (available at runtime). ⚠ If fx were ~600–900 px (assumption, not a published figure), a palm held 30 cm away gives about 2–3 px per millimetre, so a 1 mm crease spans 2–3 pixels. That is marginal but not hopeless. Measure the real value from the intrinsics.
- Unknown: the fixed-focus sharpness of the cameras at 25–35 cm. ⚠ Test early. If the palm is blurry at 30 cm, the scan mode will not work however good the algorithm.
- **Favourable:** a palm facing the headset with fingers spread is a well-tracked pose, and the app can wait for the hand to be still before capturing.
- **Computer vision.** Research on palmprint principal-line extraction exists (e.g. [PeerJ 2025](https://peerj.com/articles/cs-3109/), [HRNet-based extraction, 2024](https://doi.org/10.1117/12.3032972)). It notes that classic filters cannot distinguish principal lines from fine wrinkles, and deep nets fix that but need training data. Public palmprint datasets are mostly contact-scanner or controlled-camera images ⚠ (e.g. Tongji, IITD, CASIA from my memory, licences unchecked), so there is a domain gap versus headset frames. Do not plan on training a model in a day.
- **Practical approach ⚠:** classic ridge detection (multi-scale Frangi or Gabor, after CLAHE) on a palm ROI that the joints rectify, then use the joint-defined zones to label which ridge is which line. This uses the hand skeleton as a prior (e.g. "the longest ridge hugging the thumb base is the life line"), which is much more robust than blind detection.
- **Hosted vision model.** A general vision LLM can describe visible lines in words, and vendors claim palm readings from photos ([AstroWord](https://www.astroword.in/blog/hastarekha-shastra-complete-guide-vedic-palmistry)), but ⚠ I expect LLMs to be poor at pixel-accurate polylines. It would also send a biometric-like image off the device. Not recommended for geometry. At most an opt-in, text-only second opinion.

## 8.5 Experience design

**Two modes, same pandit.**

1. **Trace mode (hands only; safe, fun, private).** The pandit asks you to trace each of your own lines with your index finger, hovering about 2–3 cm above the palm. Your fingertip path in the palm's own coordinate frame becomes a glowing line. The app measures its length, curvature and where it ends (which mount it points to). It needs only joints, no camera, no stored images, and it works for everybody in any room.
2. **Scan mode (PCA; the wow shot).** Hold up the palm, the app waits for stillness, captures a few frames, and the lines appear glowing on your real palm.

⚠ **Ship order: build Trace first** (guaranteed demo), then Scan on top. If Scan fails for a given user, offer Trace automatically.

**Flow (about 3–4 minutes).**
1. **Welcome card.** The pandit greets you; disclaimer; pick language (English/Hindi toggle ⚠).
2. **Which hand.** "Show me the hand you write with." The app detects the hand and palm-facing pose.
3. **Hand shape.** Hand outline glows; "Your hand is a *Fire* hand…" using joint ratios.
4. **Lines.** Scan or trace. Lines glow one by one: life line (gold), heart (rose), head (blue), fate (green).
5. **Mounts.** The seven mounts light up in turn with planet glyphs. Poke one with your other index finger (hovering) to hear its meaning.
6. **Reading.** The pandit speaks a short reading (caption cards; optional voice). Pinch to ask a follow-up like "tell me about my head line".
7. **Card.** A stylised **Rekha card** (vector drawing of your lines, element, one-line "tendency" quote) appears. Not a photo of your palm.

**Hands-only interaction.**
- Palm-up to begin, pinch to confirm, poke the mounts and lines to hear about them, point at a line to ask. No controllers.
- Seated, the palm is held at about chest height, 25–35 cm away. Hands rest between steps. Offer a "use the other hand" option.

**Rendering the lines.**
- The lines live in the *palm's own coordinate frame*, built from the wrist, index and little-finger knuckles and the thumb base.
- Each frame, re-evaluate that frame from the live joints and draw the polyline as a glowing strip, so the lines follow your hand and bend slightly with finger curl.
- Draw a faint, animated "ink" reveal along each line when it is first found, which makes imperfect detection look intentional.

**Reading generation.**
- **Baseline (works offline and with no API key):** a rule engine over the structured features (hand element, which lines were found, each line's relative length, curvature, breaks or forks, which mount it ends at), picking from a hand-written library of "tendency" sentences based on the classical meanings above. This is the shipping fallback.
- **LLM layer (optional):** an LLM rewrites the matched sentences in the pandit's voice. Send **only structured features and the chosen sentences**, never the image. Use a small backend proxy so the API key is not in the headset build. System prompt: entertainment only; "tendencies", not predictions; no health, death, marriage-ending, money-loss or lifespan content; positive or reflective tone; short.
- ⚠ Keep the LLM output under about 90 words and keep an on-device fallback in case the network is unavailable. It also supports **Best Agentic Interaction** if the pandit takes follow-up questions.

**Pandit character.** A stylised low-poly sage floating across the table, with simple idle animation and head-turn toward your palm. ⚠ Avoid depicting any real person or religious deity. Voice is optional for a day-one build; captions are enough.

**Share card.**
- Render a 1080×1350 image on device from vector data: the stylised lines, the element, and a one-line quote. Not the palm photo.
- Easiest sharing: the player records their reading with the headset's own capture, or screenshots the card.
- Stretch: a QR code that opens a web page with only the stylised card and text, expiring after 24 hours. No image of the palm is ever uploaded. ⚠ Skip if short on time.

**Why it works for the competition.** Passthrough has a real purpose: the *lines are on your actual palm*. It is culturally rooted and visually obvious in the first three seconds of the video. ⚠ A short scripted demo can show the full arc in 60 s: palm up → lines trace → mounts light → pandit speaks → card.

## 8.6 Privacy
A palm image is biometric-like. Palmprints are used for biometric recognition, which is why the research literature on palmprint recognition exists ([example](https://www.mdpi.com/1424-8220/22/1/73)). Design so there is nothing to protect:
- **Process on device and discard.** Keep the frame only in memory, only for the few seconds the algorithm needs, and never write it to disk. IWSDK's own guide also says not to retain frame data longer than required.
- **Never upload the image.** Only a small feature vector (line lengths, curvature numbers, element) goes to the LLM proxy, and only if the user opts in.
- **No user or palm identification.** No matching between sessions and no accounts. This keeps clear of the prohibited uses in Meta's data policy.
- **Plain-language consent card** before the first scan: what the camera is used for, that nothing is saved or sent.
- **Trace mode requires no camera permission at all.** Make the permission request lazy, only when the user picks Scan.
- Mention all this in the Devpost text and the privacy policy that Meta's review needs ([DUC](https://developers.meta.com/horizon/resources/publish-data-use)).
- Teen accounts can be restricted by parents from camera access, but the docs note this restriction is not applied to apps installed via the developer hub. A normal install will respect it, so Trace mode must still work without the camera.

## 8.7 Engine, MVP, risks

**Engine: Unity (MRUK `PassthroughCameraAccess` + OVR hands).**
- Required for the camera path with full intrinsics and pose.
- PCA frames need a physical Quest 3/3S for testing, and Windows is the easier dev setup ([setup/windows.md](../setup/windows.md)).
- IWSDK can host a **hands-only tier** (element, mounts, Trace mode and the reading) if you want a web build, but ⚠ you'd then lose the scan mode.
- The processing is cheap: crop to ~256×256, one ridge filter per capture (not per frame). Run it off the main thread. Per Meta, avoid costly on-device processing so the frame rate stays high.

**MVP for about one day (⚠ rough hours). Three tiers, each shippable.**
- **Tier 0, hands only (about 4 h).**
  - Palm-facing detection, hand "element" from joint ratios, the seven mounts as lit zones on the palm, poke a mount to hear its meaning.
  - Pandit with rule-based reading.
  - Rekha card.
  - Disclaimer and consent screens.
- **Tier 1, Trace mode (about 2–3 h).** Fingertip path capture in the palm frame, glowing lines, length/curvature/end-mount features, and the reading using them.
- **Tier 2, Scan mode (about 4–6 h, with fallback to Tier 1).**
  - PCA permission, capture on stillness, palm ROI rectified from the joints, CLAHE + ridge filter, zone labelling of three principal lines, glowing overlay.
  - If fewer than two lines are found with confidence, the pandit says the lines are faint and switches to Trace.
- **Stretch:** LLM voice rewrite, spoken audio, QR share, Hindi.

**Cut if short on time:** Hindi, voice, QR sharing, follow-up questions, and the fate and sun lines (keep life, heart and head).

**Risks.**
- **Biggest: crease detection quality** on real palms at passthrough resolution, in varied lighting and skin tones, with camera sharpness at hand distance unknown. Mitigation: Trace mode, honest "faint lines" handling, and testing on a real Quest 3/3S before building anything else. This needs a physical headset, which is why the IDC Quest access matters.
- **Cultural sensitivity.** Respectful content, no claim of truth, and no fear-based readings.
- **Privacy review.** Meta's data policy and DUC. Keep camera use minimal and well explained.
- **Wow versus honesty.** The "lines on your real palm" shot is the hook. If scan is flaky in the video, record it on a good-lighting take, and say in the description that it's a heritage entertainment app.
- **Time.** Scan mode is the long pole. Trace mode is the safe floor.
- **Barnum effect.** Readings will feel accurate to almost everyone. Say it's for fun, and let the pandit joke about it.

**Name.** **Hast Rekha.** Tagline: "A pandit reads your palm." Alternatives: Rekha Reader, Pandit Palm, Samudrika.

**2026 rival status (aggregate).** Keyword search over the 382 gallery entries found **no palmistry or palm-reading entry**. Two entries use a fortune-teller or tarot only as a *theme* inside a game, not as the core experience. Approximate keyword matching, so treat as indicative.

**Target prizes.** Tracks: Entertainment (culture). Special awards: **Boldest Original Concept**, **Best Agentic Interaction** (the pandit with follow-ups). Weaker fit for Best Reason to Come Back (a palm doesn't change day to day), so do not target it. ⚠

---

## Shared notes for 7 and 8
- Both are **hands-only** and **seated**, and neither needs a controller.
- **Reuse:** the ghost-hand recorder/player from [Hands of a Master](idea-shortlist.md) for Twin Hands; the palm coordinate-frame code is useful for any idea that draws on a hand.
- **Headset access matters more for these two than for most.** Twin Hands needs checking the real tracking rate and confidence behaviour. Hast Rekha's scan mode cannot be tested without a physical Quest 3/3S. See [setup/](../setup/) for the headset and device setup.

## Sources

**Idea 7.**
- [Hyatt 2007, Brain Gym: Building Stronger Brains or Wishful Thinking?](https://dx.doi.org/10.1177%2F07419325070280020201)
- [Spaulding, Mostert & Beam 2010, Is Brain Gym an Effective Educational Intervention?](https://www.researchgate.net/publication/42802004_Is_Brain_GymR_an_Effective_Educational_Intervention)
- [Guardian 2008, Experts dismiss educational claims of Brain Gym](https://www.theguardian.com/science/2008/apr/03/brain.gym)
- [Kelso 1984, Phase transitions in human bimanual coordination](https://pubmed.ncbi.nlm.nih.gov/6742155/)
- [Mockałło et al. 2020, bimanual tasks in elderly (PLOS ONE)](https://www.researchgate.net/publication/339702025_Effectiveness_of_bimanual_coordination_tasks_performance_in_improving_coordination_skills_and_cognitive_functions_in_elderly)
- [Frontiers 2023, bimanual training and inhibition](https://www.frontiersin.org/journals/aging-neuroscience/articles/10.3389/fnagi.2023.1124109/full)
- [Frontiers 2019, bimanual coordination in music training](https://www.researchgate.net/publication/337773079_The_Effects_of_Bimanual_Coordination_in_Music_Interventions_on_Executive_Functions_in_Aging_Adults)
- [Cognitive-motor training meta-analysis 2020](https://pubmed.ncbi.nlm.nih.gov/32636957/)
- [iScience 2026, exercise modalities for MCI](https://www.cell.com/iscience/fulltext/S2589-0042(26)02940-8)
- [Karampela et al. 2020, motor timing training and sustained attention](https://www.researchgate.net/publication/340113612_Motor_timing_training_improves_sustained_attention_performance_but_not_fluid_intelligence_near_but_not_far_transfer)
- [Böttger et al. 2023, brain drain meta-analysis](https://www.mdpi.com/2076-328x/13/9/751) and [2024 four-level meta-analysis (PsyPost)](https://www.psypost.org/smartphone-in-sight-no-impact-on-cognitive-performance-study-finds/)
- [Near and far transfer in cognitive training, second-order meta-analysis](https://psycnet.apa.org/record/2019-24562-001) (abstract not read)
- [Meta: hand tracking limitations & mitigations](https://developers.meta.com/horizon/design/hands-limitations-mitigations/), [troubleshooting](https://developers.meta.com/horizon/documentation/unity/unity-handtracking-troubleshooting-limitations/), [best practices](https://developers.meta.com/horizon/design/hands-best-practices/), [Wide Motion Mode](https://developers.meta.com/horizon/documentation/unity/unity-wide-motion-mode/)
- [UploadVR: Hand Tracking 2.4 and Fast Motion Mode](https://www.uploadvr.com/quest-hand-tracking-2-4-improves-fast-motion-mode/)
- [OpenXR spec: hand tracking (26 joints)](https://registry.khronos.org/OpenXR/specs/1.0/html/xrspec.html), [MDN XRHand](https://developer.mozilla.org/en-US/docs/Web/API/XRHand)
- [Meta ISDK hand pose detection](https://developers.meta.com/horizon/documentation/unity/unity-isdk-hand-pose-detection)

**Idea 8.**
- [AstroWord: Hastarekha Shastra guide](https://www.astroword.in/blog/hastarekha-shastra-complete-guide-vedic-palmistry), [likhahai: head line](https://likhahai.com/palmistry/head-line/), [rekhai: palm lines](https://www.rekhai.in/blog/how-to-read-palm-lines), [astrosight: sun line](https://astrosight.ai/palmistry/sun-line-fame-success-vedic-astrology)
- [Wikipedia: Palmistry](https://en.wikipedia.org/wiki/Palmistry), [El Çizgisi: is palmistry scientific](https://elcizgisi.com/en/blog/is-palmistry-scientific)
- [Meta: Passthrough Camera API overview (Unity)](https://developers.meta.com/horizon/documentation/unity/unity-pca-overview/), [migration to PassthroughCameraAccess](https://developers.meta.com/vr/documentation/unity/unity-pca-migration-from-webcamtexture/), [CameraViewer sample](https://developers.meta.com/horizon/documentation/unity/unity-sample-camera-viewer/), [AOSP features on Horizon OS](https://developers.meta.com/horizon/documentation/android-apps/passthrough-camera/), [Spatial SDK scanner](https://developers.meta.com/horizon/documentation/spatial-sdk/spatial-sdk-scanner-api/)
- [Meta Quest Help: headset camera permissions](https://www.meta.com/help/quest/511837681585017/)
- [Road to VR: PCA apps can be published](https://www.roadtovr.com/meta-quest-passthrough-camera-api-public-publish-horizon-store/), [UploadVR: PCA launch](https://www.uploadvr.com/quest-passthrough-camera-api-experimental-out-now/)
- [Meta: Data Use Checkup](https://developers.meta.com/horizon/resources/publish-data-use)
- [IWSDK camera access guide](https://developers.meta.com/horizon/documentation/iwsdk/guides/13-camera-access/), [W3C Raw Camera Access](https://immersive-web.github.io/raw-camera-access/), [Meta forum: camera-access in Quest Browser](https://communityforums.atmeta.com/questions-and-discussions-26/request-webxr-raw-camera-access-camera-access-feature-in-quest-browser-177407)
- [PeerJ 2025: palmprint principal lines](https://peerj.com/articles/cs-3109/), [Jia & Zhou 2024: HRNet for principal-line extraction](https://doi.org/10.1117/12.3032972), [MDPI Sensors: contactless palmprint recognition](https://www.mdpi.com/1424-8220/22/1/73)

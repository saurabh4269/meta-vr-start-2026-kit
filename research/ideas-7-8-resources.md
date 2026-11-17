# Ideas 7 and 8: existing apps, open-source code, datasets and learning resources

Added 18 Nov 2026. Companion to [ideas-7-8.md](ideas-7-8.md) (designs, evidence review, MVPs). Every URL below resolved (HTTP 200, or 202/203 for PubMed and XRHealth) when I checked it on 18 Nov 2026. The one exception is the Wiley link, which returns 403 to scripts and is marked. GitHub stars, licences and last-push dates were read from the GitHub API on the same day.

- **No 2026 project is named or linked.** Everything listed here is a store app, a long-standing open-source repo, a dataset, a paper or a doc page. I checked the app and repo names against the public 2026 gallery data and left out anything that matched a 2026 entry.
- ⚠ marks my suggestion, assumption or an unverified point. It is not a sourced fact.
- Hand-tracking and palm-reading products change fast. "I found no X" means "not found in my searches", not "none exists".

---

## Top picks to start from

| Need | Pick | Licence | Why this one |
|---|---|---|---|
| **7. Twin Hands: engine** | [meta/immersive-web-sdk](https://github.com/meta/immersive-web-sdk) | MIT, 351★, pushed 2026-11-17 | Meta's WebXR framework, already the plan for idea 7 |
| **7. Hand pose / finger-sequence detection** | [sma1692/haath](https://github.com/sma1692/haath) (`@treefour/haath` on npm) | MIT, pushed 2026-10-24 | Zero-dependency WebXR engine: per-finger curl from the 25 joints, plus gesture recognition. Best fit for "which finger is touching the thumb now" |
| **7. Recording test data without wearing the headset** | [wengmister/hand-tracking-streamer](https://github.com/wengmister/hand-tracking-streamer) | Apache-2.0, 269★, pushed 2026-06-07 | Streams Quest hand joints to a PC, so you can log real sessions and tune thresholds offline |
| **7. Closest existing app** | [Can You Handle It?](https://www.altlabvr.com/can-you-handle-it) | commercial | Hand-tracked dexterity game whose "Hand Mods" include mirrored fingers. Steal the twist idea, not the code |
| **8. Palm-line reading, closest code** | [samuelwbarber/palm-line-reader](https://github.com/samuelwbarber/palm-line-reader) | MIT, 3★, pushed 2026-07-10 | 5.5M-parameter ONNX model that traces heart, head and life lines. Runs in a browser, with a live demo |
| **8. Camera access on Quest** | [oculus-samples/Unity-PassthroughCameraApiSamples](https://github.com/oculus-samples/Unity-PassthroughCameraApiSamples) | Oculus SDK License, 518★, pushed 2026-10-06 | Meta's own samples: camera-to-world rays, and on-device ML with Unity Inference Engine |
| **8. Palm ROI and pipeline design** | [yeonsumia/palmistry](https://github.com/yeonsumia/palmistry) | Apache-2.0, 57★, pushed 2026-04-30 | Full "warp, segment, classify, measure" pipeline built on MediaPipe landmarks |
| **8. Closest existing apps** | [Palm Sage](https://play.google.com/store/apps/details?id=app.palmsage.palm_sage&hl=en_US), [Hastrekha](https://play.google.com/store/apps/details?id=com.houseoftech.hastrekha.ai&hl=en_US), [AstroWitch](https://www.meta.com/experiences/astrowitch/1841573847152019/) | commercial | On-device line tracing, Indian Samudrika framing, and an XR astrologer, respectively |
| **8. Dataset to start with** | [11k Hands](https://sites.google.com/view/11khands) | Free for "reasonable academic fair use" | Direct download (632 MB), 11,076 palm/back images, wide skin-tone range. No line labels |
| **8. Dataset with fine creases** | [Tongji Contactless Palmprint](https://cslinzhang.github.io/ContactlessPalm/) | No licence text on the page; cite the paper | 12,000 high-contrast palm images, Google Drive download |
| **Both: Meta docs** | [Hand tracking overview](https://developers.meta.com/horizon/documentation/unity/unity-handtracking-overview/), [Passthrough Camera API overview](https://developers.meta.com/horizon/documentation/unity/unity-pca-overview/) | n/a | Start here for the platform rules |

**Two findings that change plans**
1. ⚠ **Palm-line reading is now a commodity on phones.** At least five Google Play apps trace the lines from a photo (section 8.1). The differentiator for Hast Rekha is therefore the **mixed-reality experience** (lines on your real hand, mounts you poke, the pandit character), not the line detection. That supports building tiers 1 and 2 first (hand-shape and trace-your-own-lines) and treating live camera scanning as a bonus.
2. **A browser palm-line model with a permissive licence already exists** (`palm-line-reader`, MIT). It will not run on Quest Browser's camera because WebXR raw camera access is not available there (see [ideas-7-8.md](ideas-7-8.md)). It can still run in Unity via the Unity Inference Engine ⚠ (untested), or as a phone-photo import path.

---

# Idea 7: Twin Hands

## 7.1 Similar apps and games

| App | Platform | What it does | Borrow / differentiate |
|---|---|---|---|
| [Can You Handle It?](https://www.altlabvr.com/can-you-handle-it) (SupraOrbital Studios, early access Dec 2025) | Quest, hand tracking | Rapid physics micro-puzzles (thread, balance, flip, precise timing). "Hand Mods" remix the rules: mirrored fingers, oversized hands, awkward constraints | **Borrow** the "mod" idea: a mid-session twist such as mirrored or swapped hands. **Differentiate**: ours scores two-hand sync and has a coach, not just puzzles |
| [Rehabilitation Hand Exercise MR App](https://www.meta.com/experiences/rehabilitation-hand-exercise-mr-app/25951351701205896/) (E16 AI XR Technology, April 2026) | Quest, hand tracking, passthrough | Guided hand-therapy exercises for mobility, finger strength and coordination with real-time feedback | **Borrow** calibrate-to-your-range and guided-rep flow. **Differentiate**: ours is bimanual with live sync scoring, and positioned as practice, not therapy |
| [PianoVision](https://www.pianovision.com/meta-quest-piano-learning/) ([Meta Store](https://www.meta.com/experiences/pianovision/5271074762922599/)) | Quest 3/3S/2/Pro, mixed reality, hand tracking | Falling notes over a real or MIDI keyboard; a bimanual, timing-based practice loop | **Borrow** the falling-cue lane UI for rhythm timing. **Differentiate**: no instrument needed |
| [Hand Physics Lab](https://www.meta.com/experiences/hand-physics-lab/3392175350802835/) (Holonautic) | Quest, hand tracking | A physics sandbox that responds to every finger. 2.7K ratings | **Borrow** the feel of a physical hand rig. **Differentiate**: it is a toy, with no coaching, targets or scoring |
| [XRHealth Physical & Cognitive Space](https://www.altlabvr.com/xrhealth-physical-cognitive-space) ([XRHealth](https://www.xr.health/us/services/)) | Quest 2 / 3S | Clinician-led VR physical and cognitive therapy via telehealth | Real, clinical, and gated by a membership (a reviewer said they could not try it without paying). **Differentiate**: instantly playable, consumer practice, no clinical claims |
| [Neofect RAPAEL Smart Glove](https://www.neofect.com/us) ([clinic page](https://brooksrehab.org/technology/neofect-smart-glove/)) | Sensor glove plus screen games | Stroke / hand rehab; therapist reviews session data | **Borrow** per-user range calibration and "just right challenge" difficulty. Evidence is mixed: a 14-patient home RCT showed gains ([JNER 2025](https://link.springer.com/article/10.1186/s12984-025-01564-5)); a larger phase 2 trial found no overall difference ([PM&R 2026](https://doi.org/10.1002/pmrj.70014), page blocks bots, abstract read via search). Hardware-free is our edge |
| [Brain Connect: Sequential Finger Tapping](https://www.getbrainconnect.app/en/exercises/134/sequential-finger-tapping-coordination/) | Web / phone, video instructions | Library of coordination exercises with video; this one is thumb-to-each-finger tapping on both hands | **Borrow** the exercise catalogue as a content checklist. **Differentiate**: video-only, with no tracking or feedback |

I did not find a Quest app that scores opposite-direction bimanual patterns against a ghost-hand coach. ⚠ That is not proof none exists.

## 7.2 Open-source code

| Repo | Licence | ★ | Last push | Use for Twin Hands |
|---|---|---|---|---|
| [meta/immersive-web-sdk](https://github.com/meta/immersive-web-sdk) | MIT | 351 | 2026-11-17 | The app framework (three.js, interactions, spatial UI). Moved from the `facebook` org |
| [sma1692/haath](https://github.com/sma1692/haath) | MIT | 0 | 2026-10-24 | WebXR hand kinematics and gesture recognition. Per-hand pose classification is a fixed pass over the 25 joints (curl from dot products). Reuse its curl maths for finger-sequence steps |
| [stewdio/handy.js](https://github.com/stewdio/handy.js) | MIT | 263 | 2021-06-21 | "Define and recognise custom hand poses in WebXR". Old, but the pose-definition format is a good model for a data-driven exercise list |
| [andypotato/fingerpose](https://github.com/andypotato/fingerpose) | MIT | 512 | 2023-05-01 | Finger-curl plus direction descriptors for hand landmarks (MediaPipe, TFJS). Borrow the descriptor idea (per-finger curl and direction with confidence). ⚠ Inputs are 21 landmarks, so you would map from WebXR's 25 joints |
| [Kazuhito00/hand-gesture-recognition-using-mediapipe](https://github.com/Kazuhito00/hand-gesture-recognition-using-mediapipe) | Apache-2.0 | 775 | 2023-04-05 | Keypoint classifier plus a fingertip-history classifier. The history approach is the template for wrist-circle and direction detection ⚠ (my reading of the repo name and description; I did not run it) |
| [wengmister/hand-tracking-streamer](https://github.com/wengmister/hand-tracking-streamer) | Apache-2.0 | 269 | 2026-06-07 | Unity Quest app that streams 21 landmarks per hand plus wrist pose over UDP/TCP. Python SDK in the README. Record real sessions to tune thresholds without the headset |
| [immersive-web/webxr-samples](https://github.com/immersive-web/webxr-samples) | MIT | 1167 | 2026-11-12 | Reference usage of the WebXR hand-input API |
| [raechao93/OpenGestureXR](https://github.com/raechao93/OpenGestureXR) | MIT | 385 | 2026-03-23 | Rule-based plus ONNX gesture classifier. Prototype with webcam tracking; the README says native device support is still on the roadmap, so **low priority** |

**Gap.** I found no maintained open-source library for **rhythm or sequence scoring** of hand movements. ⚠ Plan to write it yourself: per-finger touch events, then compare the two hands' timestamps (phase offset and variability), as designed in [ideas-7-8.md](ideas-7-8.md).

## 7.3 Learning resources

**Videos (what people share).** I read titles and metadata only; I did not watch these end to end. Several make "brain connection" claims that [ideas-7-8.md section 7.2](ideas-7-8.md) says are not supported, so use them for movement ideas, not for claims.
- [Bimanual Interference: Rotating your hands in opposite directions](https://www.youtube.com/watch?v=tdZhUDwoqx0), Mind Your Options, 5:10, 62.7K views. [Hindi and English version](https://www.youtube.com/watch?v=-HSHhkY2X3Y) by It's Easy, 4:52.
- [Can You Do This Countermanded Task?](https://www.youtube.com/shorts/vEmVTWucXIE), Dr. Nathan Keiser, a 30-second short with 27.5M views. The most-seen clip of this kind.
- [Train Your Brain: Why This Hand Exercise Is So Much Harder](https://www.youtube.com/shorts/6yfbQ2vRzxc) and [The Exercise Your Brain Wasn't Ready For](https://www.youtube.com/shorts/KxEZfj0P134), Headache Guru shorts.
- [Cross Laterals for Building Brain Connections](https://www.youtube.com/watch?v=ZH6QI8OjkZA), The Purpose Lab, 4:04. A Brain Gym-style source.
- [10 Brain, Hands & Fingers Warm Up Exercises](https://www.youtube.com/watch?v=4o1iRDFm8Ww), OT Closet, 6:12, an occupational-therapy channel.
- [3 FAST Coordination Exercises](https://www.youtube.com/watch?v=uBQRmq063oA), ZHealthPerformance, 3:56.

**Articles.** [Flint Rehab: finger opposition exercises](https://www.flintrehab.com/finger-opposition-exercises/) (the thumb-to-fingertip family, with the rehab-device angle).

**Papers** (more are already in [ideas-7-8.md](ideas-7-8.md), so only new ones here).
- Haken, Kelso & Bunz 1985, [A theoretical model of phase transitions in human hand movements](https://pubmed.ncbi.nlm.nih.gov/3978150/). The model behind "anti-phase breaks into in-phase as speed rises"; use it to justify the tempo ladder.
- Swinnen 2002, [Intermanual coordination: from behavioural principles to neural-network interactions](https://pubmed.ncbi.nlm.nih.gov/11988774/), Nature Reviews Neuroscience. The standard review.
- Kelso 1984, [Phase transitions and critical behavior in human bimanual coordination](https://pubmed.ncbi.nlm.nih.gov/6742155/).

**Platform docs.**
- Meta: [Hand tracking overview (Unity)](https://developers.meta.com/horizon/documentation/unity/unity-handtracking-overview/), [Interaction SDK overview](https://developers.meta.com/horizon/documentation/unity/unity-isdk-interaction-sdk-overview/), [ISDK hand pose detection](https://developers.meta.com/horizon/documentation/unity/unity-isdk-hand-pose-detection), [Hand tracking in WebXR](https://developers.meta.com/horizon/documentation/web/webxr-hands/).
- Standards: [W3C WebXR Hand Input](https://immersive-web.github.io/webxr-hand-input/), [MDN XRHand](https://developer.mozilla.org/en-US/docs/Web/API/XRHand).
- Unity: [XR Hands package manual](https://docs.unity3d.com/Packages/com.unity.xr.hands@1.5/manual/index.html).

---

# Idea 8: Hast Rekha

## 8.1 Similar apps and games

**Palm-reading apps (phone camera).**

| App | Platform | What it does | Borrow / differentiate |
|---|---|---|---|
| [Palm Sage](https://play.google.com/store/apps/details?id=app.palmsage.palm_sage&hl=en_US) | Android | Photo in; finds the palm, traces four lines on-device, draws exactly where each line was read; deterministic reading; 12 languages including Hindi; no account, nothing leaves the phone | **Borrow** "show the evidence for every sentence" and the same-input-same-reading rule. **Differentiate**: ours is live on your real hand in MR |
| [HandSage](https://play.google.com/store/apps/details?id=com.clearstackapps.handsage&hl=en_US) | Android | Four lines traced in gold; **drag the dots to correct a line**; six-part reading incl. mounts; shareable cards; numerology. Sends only line measurements to a server | **Borrow** user-correctable lines, which is exactly our "trace your own lines" tier. **Differentiate**: spatial interaction |
| [Hastrekha](https://play.google.com/store/apps/details?id=com.houseoftech.hastrekha.ai&hl=en_US) (Dharmic Labs) | Android | Indian: Samudrika Shastra framing; four principal lines; daily guidance; Numerology and Kundali; paid reports. 10K+ downloads | **Borrow** the Indian framing and vocabulary. **Differentiate**: culture-first, no paywall, no health or marriage prediction |
| [Hasta AI](https://play.google.com/store/apps/details?id=in.hasta&hl=en_US) | Android | Kundli, Panchang, tarot, AI palm scan (heart, head, life, fate) and an AI astrologer chat (Nandini). Declares no data collected | **Borrow** the AI-character-as-guide pattern. **Differentiate**: a visible 3D pandit in your room |
| [Mira: AI Palm Reading](https://play.google.com/store/apps/details?id=com.savyx.mira&hl=en_US) | Android | Photo reading; compare palms with a friend; "your palm changes, read again in a few months"; share cards. The photo is sent to a third-party AI service | **Borrow** palm compare and the re-read-later loop. **Differentiate**: images stay on the headset |

**XR / astrology.**

| App | Platform | What it does | Borrow / differentiate |
|---|---|---|---|
| [AstroWitch](https://www.meta.com/experiences/astrowitch/1841573847152019/) | Quest | Seated reading with an AI-voiced astrologer in a candle-lit parlour: sign, rising sign via a brass astrolabe, year and month, tarot (cards drawn with your hands), I Ching. Birth data kept on the headset. Entertainment-only disclaimer | **Borrow** the "reader across a table" staging and the on-device privacy line. **Differentiate**: palm and hand-first; Indian tradition |
| [Tarot Life: Psychic Reading](https://www.meta.com/en-gb/experiences/tarot-life-psychic-reading/8786145224792082) (Innovana Games Studio, 2023) | Quest | A virtual tarot reader and a hand-painted Rider-Waite-style deck. Only 4 ratings | Shows a thin XR fortune-telling space. **Differentiate**: your own hand is the object being read |

I found **no Quest or AR palm-reading app** in my searches. ⚠ The phone apps above all read from a photo, not from a live hand in mixed reality.

## 8.2 Open-source code

**Palm-line detection and reading.**

| Repo | Licence | ★ | Last push | How it would be reused |
|---|---|---|---|---|
| [samuelwbarber/palm-line-reader](https://github.com/samuelwbarber/palm-line-reader) ([live demo](https://sambar.beer/palm-demo.html)) | MIT | 3 | 2026-07-10 | Ships `student_fp16.onnx`, `fp32` and `int8` models in `models/` (5.5M-parameter UNet) that trace heart, head and life lines from an RGB palm crop, plus the MediaPipe crop and mirroring logic. Try it in the browser first, then test it on Quest frames through the Unity Inference Engine ⚠ (untested). **Caveats:** only three lines (no fate line); trained on pseudo-labels from palm photos scraped from a Reddit community, so check the data provenance before shipping the weights ⚠ |
| [yeonsumia/palmistry](https://github.com/yeonsumia/palmistry) | Apache-2.0 | 57 | 2026-04-30 | Four steps: warp a tilted palm using MediaPipe points, detect lines with a trained model, classify lines with K-means, measure lengths against landmark thresholds. Reuse the **pipeline design** and the perspective-correction idea; models are Python and PyTorch |
| [brianwalczak/palm_roi](https://github.com/brianwalczak/palm_roi) | MIT | 1 | 2026-04-11 | Small Python library: palm region of interest plus rotation matrix from hand landmarks. Port the maths to C# for a straightened palm crop from Quest's hand joints ⚠ |
| [AngeloUNIMI/PalmSeg](https://github.com/AngeloUNIMI/PalmSeg) | GPL-3.0 | 34 | 2026-05-31 | MATLAB palm segmentation, valley-point detection and ROI normalisation. **Reference only** (GPL, MATLAB) |
| [scikit-image](https://github.com/scikit-image/scikit-image) filters: [`frangi`, `sato`, `meijering`](https://scikit-image.org/docs/stable/api/skimage.filters.html) | BSD-3-Clause | 6639 | 2026-11-17 | Classical ridge filters for a quick baseline that finds crease-like lines in a cropped palm. Python prototype, no model needed |
| [opencv/opencv_contrib](https://github.com/opencv/opencv_contrib): [`RidgeDetectionFilter`](https://docs.opencv.org/4.x/d4/d36/classcv_1_1ximgproc_1_1RidgeDetectionFilter.html) | Apache-2.0 | 10236 | 2026-11-05 | Same idea in OpenCV (`ximgproc`); useful if you do the line step in native code |
| [Arxiv 2102.12127](https://arxiv.org/abs/2102.12127): U-Net Context Fusion palm-line segmentation | paper | n/a | 2021 | Handcrafted palm-line dataset and architecture. ⚠ I did not find a public code or dataset release |

**Palm ROI landmarks.** [MediaPipe Hand Landmarker docs](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) and [google-ai-edge/mediapipe-samples](https://github.com/google-ai-edge/mediapipe-samples) (Apache-2.0, 2889★, pushed 2026-11-17). Both of the repos above use MediaPipe to find the palm. On Quest you already have joint positions from hand tracking, so MediaPipe is only needed for **photos** (an import path).

**Palmprint recognition (identity, not line reading).** These match people to palms; they do not read palmistry lines. Low value for us, listed so nobody burns an hour on them.
| Repo | Licence | ★ | Last push | Note |
|---|---|---|---|---|
| [AngeloUNIMI/PalmNet](https://github.com/AngeloUNIMI/PalmNet) | GPL-3.0 | 58 | 2026-09-24 | Gabor-PCA networks for touchless palmprints |
| [Zi-YuanYang/CCNet](https://github.com/Zi-YuanYang/CCNet) | none stated | 51 | 2024-08-06 | PyTorch palmprint recognition (TIFS 2023). No licence means all rights reserved |
| [xuliangcs/ppnet](https://github.com/xuliangcs/ppnet) | CC BY-NC 4.0 | 31 | 2025-12-03 | Lightweight palmprint CNN. Non-commercial |
| [leosocy/EDCC-Palmprint-Recognition](https://github.com/leosocy/EDCC-Palmprint-Recognition) | MIT | 188 | 2021-02-08 | Classical (non-deep) recognition |

**Quest camera access (Unity).** [oculus-samples/Unity-PassthroughCameraApiSamples](https://github.com/oculus-samples/Unity-PassthroughCameraApiSamples): Oculus SDK License, 518★, pushed 2026-10-06.
- Five scenes: `CameraViewer`, `CameraToWorld` (turns 2D camera pixels into 3D world rays), `BrightnessEstimation`, `MultiObjectDetection` (Unity Inference Engine) and `ShaderSample`.
- Requirements from the README: Quest 3 or 3S, Horizon OS v74+, Unity 6000.0.38f1+, Meta MRUK v81+, the `horizonos.permission.HEADSET_CAMERA` permission, and a real headset or Meta Horizon Link 2.1+.
- **The XR Simulator does not support the Passthrough Camera API**, so Hast Rekha's scan tier cannot be tested without a headset.
- `CameraToWorld` plus a palm-crop model is the reuse path: run the model on the camera image, then raycast the detected line pixels back onto the 3D hand ⚠ (my design, unproven).

## 8.3 Datasets

None of these has principal-line masks. The browser model above bootstrapped its labels from a bigger teacher model, so expect to do the same ⚠.

| Dataset | What | Access terms | Notes |
|---|---|---|---|
| [11k Hands](https://sites.google.com/view/11khands) ([paper](https://arxiv.org/abs/1711.04322)) | 11,076 hand images, 1600×1200, 190 subjects aged 18–75, palm and back sides, white background; metadata includes skin colour and gender | "FREE for reasonable academic fair use"; direct download (632 MB). Cite Afifi 2019 | **Best first pick:** immediate and the widest skin-tone range. Plain background, not Quest-like |
| [Tongji Contactless Palmprint](https://cslinzhang.github.io/ContactlessPalm/) | 12,000 images, 600 palms from 300 volunteers, two sessions; extracted ROI images too | Google Drive links on the project page. No licence text; cite Zhang et al., Pattern Recognition 2017. ⚠ Treat as research-only | High-contrast, controlled device, so minor creases are visible. Good for training a crease segmenter |
| [IIT Delhi Touchless Palmprint v1.0](https://www4.comp.polyu.edu.hk/~csajaykr/IITD/Database_Palm.htm) | Contactless bitmaps from 230 users, with 150×150 normalised crops | "Publicly available for academic use only"; online request form, download link sent by email | Indian subjects. Request early |
| [PolyU-IITD Contactless v3.0](https://www4.comp.polyu.edu.hk/~csajaykr/palmprint3.htm) | 600+ subjects, 20 images each, contactless | Signed licence agreement approved by the head of your institution; the page says a decision email can take up to 45 days | **Too slow for the deadline**; relevant for later work |
| [IAPR TC4 palmprint dataset index](https://iapr-tc4.org/palmprint-datasets/) | Index of ~14 sets: CASIA, COEP, REST (150 subjects aged 6–70), XJTU-UP (~30,000 unconstrained images from 100 subjects), NTU-CP, others | Each set has its own terms | Use to find a set closer to phone or passthrough conditions (XJTU-UP is the unconstrained one) |
| Palm-line sets on Roboflow Universe ("palm lines recognition", about 3k images; "palmistry" instance segmentation) | Community-labelled boxes, keypoints or masks | ⚠ **Unverified.** They showed up in search, but Roboflow blocked my fetch (403/404), so I could not check the contents or licence | Could be the only labelled palm-line data; check licence and label quality yourself before using |

⚠ **Data-handling note.** Palm images are biometric. Use public datasets for training only, and do not ship dataset images in the app. Keep the "images never leave the headset" rule from [ideas-7-8.md](ideas-7-8.md).

## 8.4 Learning resources

**Indian palmistry (Hast Rekha / Hasta Samudrika).** Quality varies; I read these as overviews, not as authoritative texts. ⚠ Pick one line and mount mapping, cite it in the app, and keep the "culture and entertainment" framing.
- [Wikipedia: Samudrika Shastra](https://en.wikipedia.org/wiki/Samudrika_Shastra) and [Wikipedia: Palmistry](https://en.wikipedia.org/wiki/Palmistry): neutral starting points.
- [Hasta Sāmudrika, Ramakrishna Mission Vivekananda University](https://cs.rkmvu.ac.in/~tamal/jyotisha/hasta/): the hand's parts, lines and marks read against the classical texts it cites (Bṛhatsaṃhitā, Garuda Purāṇa, Agni Purāṇa), with the verses quoted. The most source-driven page I found.
- [Hast Samudrika Shastra: Vedic palmistry tradition (Story in Color)](https://storyincolor.com/traditions/hast-samudrika-shastra), [Vedic Palmistry: the Samudrika Shastra tradition (El Çizgisi)](https://elcizgisi.com/en/blog/vedic-palmistry-samudrika-shastra-guide): the Indian version maps the palm onto the nine Navagraha planets, unlike Western palmistry.
- [Hast Rekha Gyan, 5 myths (Trikaal Vaani)](https://trikalvaani.com/blog/hast-rekha-gyan-samudrika-shastra-guide): names five lines (Jeevan, Mastishk, Hriday, Bhagya, Vivah) plus seven planetary mounts, matching the "seven mounts" in the idea doc.
- [Hast Samudrika Shastra, the Indian science of hands (MoonAstro)](https://www.moonastro.com/palmistry/articles/hast%20samudrika%20shastra%20the%20indian%20science%20of%20hands.aspx).

**Hindi YouTube** (what Indian viewers actually watch; I checked titles and channels, not the content).
- [हाथ की रेखाएं कैसे देखते हैं: Learn Palmistry in 30 mins](https://www.youtube.com/watch?v=a5FeVLMva00) and [हस्तरेखा देखना सीखे: Learn palmistry in 22 mins](https://www.youtube.com/watch?v=xHdfzAMl4NI), both AstroJan. The second has 15.5M views.
- [हथेली में प्रमुख रेखाएँ: Hastrekha lesson 25 (सामुद्रिक शास्त्र)](https://www.youtube.com/watch?v=eWajIpNx-_4), Rajiv Kaushik, 15:08.

**Meta platform docs.**
- Camera: [Passthrough Camera API overview (Unity)](https://developers.meta.com/horizon/documentation/unity/unity-pca-overview/), [Getting started](https://developers.meta.com/horizon/documentation/unity/unity-pca-documentation), [Using Unity Inference Engine with PCA](https://developers.meta.com/horizon/documentation/unity/unity-pca-sentis), [Android passthrough camera](https://developers.meta.com/horizon/documentation/android-apps/passthrough-camera/), [IWSDK camera access guide](https://developers.meta.com/horizon/documentation/iwsdk/guides/13-camera-access/).
- Hands: [Hand tracking overview (Unity)](https://developers.meta.com/horizon/documentation/unity/unity-handtracking-overview/), [Interaction SDK overview](https://developers.meta.com/horizon/documentation/unity/unity-isdk-interaction-sdk-overview/).

**Papers.** The palm-line papers (PeerJ 2025, Jia & Zhou 2024) are already in [ideas-7-8.md](ideas-7-8.md). Added here: [Pham Van et al., Efficient Palm-Line Segmentation with U-Net Context Fusion Module](https://arxiv.org/abs/2102.12127) (2021).

---

## What I could not verify
- **Roboflow Universe** palm-line datasets: blocked, see 8.3.
- **Wiley** (vREHAB trial) and **PeerJ**: the sites block bots (HTTP 403). I read the abstracts via search results; the links are for you to open.
- **Whether the palm-line-reader ONNX model runs under the Unity Inference Engine** on Quest 3/3S, and at what frame time. ⚠ Test before planning around it.
- **Palm crease visibility at Quest passthrough camera resolution**: still unproven (see [ideas-7-8.md](ideas-7-8.md)).
- **Video content**: I checked titles, channels and view counts, not the content of the YouTube videos.

# Hands-first, seated MR: what makes it accessible, and what makes it hard

Research notes for this competition (hands-only, seated-optimized, judged on Quest 3/3S at ≥60 fps). Meta sources are also saved locally in `resources/pages/`. No 2026 competition projects are referenced.

## Part 1 — What makes it accessible

### Seated and one-handed play
- Meta's accessibility guidelines say to "let people use the experience in a seated, reclining, or stationary position", offer **head-gaze selection and other inputs where possible**, and pair actions with **sound and haptic feedback**. They also suggest scaling input (e.g. doubling reach) so a person with limited range can still fully extend their avatar's arms — [Meta: Accessibility](https://developers.meta.com/horizon/design/accessibility).
- The competition's own guideline is the "airplane seat test": every interaction should work within a 2 ft radius ([rules §4](https://start-developer-competition-26.devpost.com/rules)).
- Hands input is naturally *sequential and one-handed*. Meta advises cutting multi-step gestures (e.g. auto-harvest the wood after chopping, rather than requiring a second gesture) — [Meta: Hands best practices](https://developers.meta.com/horizon/design/hands-best-practices).
- Design every core action so it can be done with **either hand alone** and offer a left/right swap ⚠ (my synthesis of the Meta guidance above and [W3C XAUR](https://www.w3.org/TR/xaur/)'s motor-impairment user needs).
- Caveat: designing hands/eyes-first excludes people without (reliable) hand use. Keep at least one alternative path (e.g. head-gaze + dwell, or controllers optional) where the rules allow ⚠ (controllers are allowed as optional — [rules §4](https://start-developer-competition-26.devpost.com/rules)).

### Captions, audio and visual cues
- Captions: start about 1 m away (about half the far-field distance) and let people move them; max **32 characters per row, 2 rows**; offer several fonts/colours and text-size steps of **50/75/100/150/200%** — [Meta: Accessibility](https://developers.meta.com/horizon/design/accessibility).
- Store guidance: [VRC.Quest.Accessibility.1](https://developers.meta.com/horizon/resources/vrc-quest-accessibility-1/). The app should be playable without audio, or provide subtitles.
- With no physical buttons, **visual + audio feedback replaces haptics**: highlights, rays, subtle sounds on hover/select — [Hands best practices](https://developers.meta.com/horizon/design/hands-best-practices).
- Spatial audio tells people where to look. Pair it with a visual indicator for deaf/hard-of-hearing players — [Meta: Accessibility](https://developers.meta.com/horizon/design/accessibility); [XR Access](https://xraccess.org/).

### Target size, contrast, text
- Hit targets ≥ **22 mm × 22 mm / 48 dp / 3° FOV at 0.42 m**; visual targets ≥ **32 dp**; add invisible "hitslop" to reach 48 dp — [Meta: Accessibility](https://developers.meta.com/horizon/design/accessibility), [Hands best practices](https://developers.meta.com/horizon/design/hands-best-practices).
- Contrast: **4.5:1** for normal text (WCAG level) — [Meta: Accessibility](https://developers.meta.com/horizon/design/accessibility).
- Readable at any distance: use angular scaling for dialogs and essential UI — [Meta: MR design guidelines](https://developers.meta.com/horizon/design/mr-design-guideline).

### FoV-aware layout (judged)
- Keep essential UI inside a narrower FoV and adapt across devices ([rules §6](https://start-developer-competition-26.devpost.com/rules)). Test with the Unity in-headset FoV simulation, the Meta VR CLI workflow, or the IWER FoV mask — [setup/on-device-quest.md](../setup/on-device-quest.md).
- Place content about **1 m away, slightly below eye level**; avoid objects that pop in too close or too large at launch; never place virtual objects behind real walls — [MR design guidelines](https://developers.meta.com/horizon/design/mr-design-guideline).

### Comfort and locomotion
- Seated + no artificial locomotion is the most comfortable baseline. If you move the player, offer Meta's recommended comfort options (teleport/snap turn, etc.) — [Meta: Locomotion overview](https://developers.meta.com/horizon/design/locomotion-overview). The kit's IWSDK starter ships with locomotion **off**.
- Avoid visuals that flash on and off — [Hands best practices](https://developers.meta.com/horizon/design/hands-best-practices).

### Gesture tolerance
- Prefer direct manipulation (poke, grab) over abstract poses; explore poke / grab / ray to cut cognitive load — [Hands best practices](https://developers.meta.com/horizon/design/hands-best-practices), [Adapting from controllers](https://developers.meta.com/horizon/design/hands-adapting-from-controllers/).
- Generous thresholds, hover states and confirm-on-release make jittery or partially occluded hands forgiving ⚠ (my synthesis).
- Reserved: on Quest the **palm pinch** gesture is taken by the system — [WebXR Hands](https://developers.meta.com/horizon/documentation/web/webxr-hands).

### Onboarding without text walls
- Teach gestures with an **animation, video or mirror** of the hand pose and keep the first moment short, because immersive sessions are shorter and the headset is a hurdle — [MR design guidelines](https://developers.meta.com/horizon/design/mr-design-guideline).
- The competition's "one bus stop test": a complete, satisfying moment in ≤10 minutes, with fast cold start and clean pause/resume ([rules §4](https://start-developer-competition-26.devpost.com/rules)).
- Tell users about lighting at launch (hand tracking degrades in low light) — [Hands limitations & mitigations](https://developers.meta.com/horizon/design/hands-limitations-mitigations/).

### Reference frameworks
- [W3C XR Accessibility User Requirements (XAUR)](https://www.w3.org/TR/xaur/): user needs by disability and matching requirements (saved locally).
- [XR Access](https://xraccess.org/): community, research and guidelines hub (saved locally).

## Part 2 — What makes it hard (pitfalls)

| Pitfall | Why it happens | Mitigation | Sources |
|---|---|---|---|
| **Hands leave the tracking volume** | Hands resting on thighs or too close to the face aren't tracked; the volume extends beyond the display FoV but not everywhere | Keep interactions in front of the chest; centralize targets | [Hands limitations](https://developers.meta.com/horizon/design/hands-limitations-mitigations/) |
| **Self-occlusion** | Fingers/hands block each other from the cameras (e.g. two-hand overlaps, palm-away poses) | Avoid poses that stack hands; design gestures visible to the cameras | same |
| **Lighting** | Low light reduces accuracy; direct sunlight can damage lenses | Launch-time lighting tip | same |
| **Fast motion / throwing** | Fast hands blur or leave tracking bounds | Meta's First Steps team built throw vectors from the last *good* pose, speed and gaze; they step back ~40 ms (~3 frames) and require ~80 ms of continuous data for "high confidence" throws | [Meta blog: Adding Hand Tracking to First Steps](https://developers.meta.com/horizon/blog/adding-hand-tracking-to-first-steps/) |
| **Jitter** | Per-frame pose noise | Smoothing/filtering, larger hitboxes, hover hysteresis ⚠; high-frequency hand tracking in Unreal ("Hand Tracking Frequency → High") | [Unreal hand tracking](https://developers.meta.com/horizon/documentation/unreal/unreal-hand-tracking/), [First Steps blog](https://developers.meta.com/horizon/blog/adding-hand-tracking-to-first-steps/) |
| **Gorilla arm** (shoulder fatigue) | Holding arms raised and extended; one motion-capture study measured ~**3.77×** more shoulder torque and **2×** elbow torque with the arm raised in front versus relaxed and lowered | Keep hands below heart level, avoid long reaches, allow resting poses and rays for distant targets | [Palmeira et al., SVR '23](https://doi.org/10.1145/3625008.3625046), [Hands best practices](https://developers.meta.com/horizon/design/hands-best-practices), [AlphaPIG, CHI '25 (arXiv 2503.01011)](https://arxiv.org/abs/2503.01011) |
| **Motion sickness** | Artificial locomotion, camera moves, flashing | Seated, no forced locomotion; comfort options if you must move | [Locomotion overview](https://developers.meta.com/horizon/design/locomotion-overview) |
| **The 60 fps budget** | Quest is a mobile GPU; passthrough + hands + MRUK all cost frames | Profile early on device; fixed foveation; reduce draw calls/overdraw | [VRC.Quest.Performance.1](https://developers.meta.com/horizon/resources/vrc-quest-performance-1/), [Test your app](https://developers.meta.com/vr/essentials/test-your-app/) |
| **MRUK loads the fallback room / an old room** | Common forum reports: the app always loads the prefab fallback room; one fix was that the app wasn't "trusted" (no dev org/app registered, so unsigned access to spatial data was denied); others hit an old scene model after rescanning | Register the app in your dev org and build signed; request the Scene permission; reinstall; test standalone, not only over Link; provide a no-scan fallback | [forum 1195753](https://communityforums.atmeta.com/discussions/dev-unity/unity-meta-quest-app-not-getting-room-data-of-the-device-and-always-loads-the-pr/1195753), [forum 1315224](https://communityforums.atmeta.com/discussions/dev-unity/mruk-cant-load-saved-scene-room-data---potential-solution/1315224), [forum 1201905](https://communityforums.atmeta.com/discussions/dev-quest/old-scene-model-loading-in-apk-built-with-mruk/1201905), [MRUK GS](https://developers.meta.com/horizon/documentation/unity/unity-mr-utility-kit-gs) |
| **Rooms you never tested** | Judges' rooms differ; scans vary | Test ≥2 real rooms and simulator synthetic rooms; `OVRScene.RequestSpaceSetup()` to prompt a rescan (forum tip) | [rules §6](https://start-developer-competition-26.devpost.com/rules), [forum 1194024](https://communityforums.atmeta.com/discussions/dev-quest/mruk-unable-to-load-a-new-scene-from-the-device-when-changing-physical-room/1194024), [XR Sim synthetic envs](https://developers.meta.com/horizon/documentation/unity/xrsim-heroscenes/) |
| **Release-channel friction** | Channel names are permanent; invite page disables 90 days after the last upload; invitees must be 18+; 200-user default cap; each upload needs a higher versionCode | Create **Competition** channel early; test the invite from a second account; don't touch it during judging | [custom channels](https://developers.meta.com/horizon/resources/publish-release-channels-add-custom/), [add users](https://developers.meta.com/horizon/resources/publish-release-channels-add-users/), [FAQ](https://start-developer-competition-26.devpost.com/details/faqs) |
| **Simulator limits** | Desktop simulators can't show Quest frame rate or real hand-tracking noise; webcam tracking is approximate; Unreal XR Sim is Windows-only | Use simulators for iteration and the demo video; validate on device | [simulators/README](../setup/simulators/README.md), [camera tracking](https://developers.meta.com/horizon/documentation/unity/xrsim-camera-tracking/) |

## Quick self-audit before submitting
- [ ] Every flow works seated, in a 2 ft radius, with controllers off
- [ ] Core actions work one-handed; no long raised-arm holds
- [ ] Captions/subtitles or fully playable muted
- [ ] Targets ≥48 dp hit area; text contrast ≥4.5:1; text size option
- [ ] Essential UI within the narrower FoV; content ~1 m, slightly low
- [ ] Hand-loss and low-light states handled gracefully
- [ ] Onboarding shows gestures (animation/mirror), not paragraphs
- [ ] ≥60 fps measured on Quest 3/3S

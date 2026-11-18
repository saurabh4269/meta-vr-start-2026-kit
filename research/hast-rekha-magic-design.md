# Hast Rekha - "supernatural" design pack

How to make Hast Rekha feel like magic: palm lines ignite, a touch or pinch opens a themed world, a divine voice explains.
Engine: Unity (URP, Meta XR SDK, OpenXR hand tracking, 25 joints/hand). Target: Quest 3/3S, hands only, no branding.
Built on [`data/palm-regions.json`](../data/palm-regions.json) (line centrelines in palm-frame `(a,b)` coordinates),
[`data/palmistry-rules.json`](../data/palmistry-rules.json) and [`palmistry-rulebook.md`](palmistry-rulebook.md).
Audio proof-of-concept: [`hast-rekha-audio/`](hast-rekha-audio/README.md).

**Link policy.** Every URL below was opened on 18 Nov 2026. Meta developer pages answer curl with HTTP 400 and the ElevenLabs help centre with 403
(bot walls); those were confirmed through the search/fetch tool instead and are marked **(bot-walled, read via fetch)**. 404s were dropped
(list in the appendix). Inference or advice of mine is labelled **(my call)**; facts from a source carry its link.

---

## 0. Ten-line summary

1. **Lines**: draw each line as a ribbon mesh built from `centerline_ab` through the live palm frame (4 joints). Unlit additive Shader Graph with flowing-energy UVs, a pulse and a soft halo. No hand skinning needed; in passthrough the real palm is the canvas.
2. **Touch/pinch**: do your own fingertip/pinch-to-polyline distance test (cheap, no physics). Keep Interaction SDK poke for UI only.
3. **Particles**: Shuriken (built-in Particle System) for almost everything; VFX Graph needs compute + Vulkan and is "not out of preview on mobile" in Unity's own page - treat it as optional.
4. **World**: two-stage portal - a stencil-masked "bubble" (about 0.35 m) over the palm, then an immersive dome (skybox + dimmed/tinted passthrough). Avoid surface-projected passthrough: deprecated in Meta XR SDK v83.
5. **Hand-in-world trick**: Meta's Passthrough Windows shader on the tracked hand mesh keeps the user's *real hand* visible inside the VR world.
6. **Art**: Navagraha colours per mount (Wikipedia: ruby, pearl, red coral, emerald, yellow sapphire, diamond, sapphire, hessonite, cat's eye), abstract planets/mandalas/lotus/glyphs, no deity faces.
7. **Assets**: Poly Haven HDRIs (CC0), Quaternius nature (CC0), Freesound CC0 tanpura/bowls/bells, Kenney particle textures (CC0), a few CC-BY Sketchfab models (credit them).
8. **Voice (recommended)**: pre-render. ElevenLabs *Voice Design* (designed, not cloned) on the $6 Starter plan, because the free plan forbids commercial use and demands an ElevenLabs credit (conflicts with "no branding"); zero-cost alternative Azure `hi-IN-MadhurNeural`/`SwaraNeural` (0.5 M neural chars/month free); offline floor Piper (done, see audio folder).
9. **"Divine" = post chain**: octave-down sub layer + octave-up whisper + fifth pad + chorus + long convolution reverb + tanpura bed, one ffmpeg command (`divine.sh`).
10. **Feedback without haptics**: hover glow, touch ripple + bell strike at the contact point (spatialised), select flare + sub-drop, all inside one frame of the contact.

---

## 1. Glowing lines on the hand (Unity, Quest)

### 1.1 Recommended architecture

| Piece | Choice | Why |
|---|---|---|
| Geometry | Ribbon mesh (or `LineRenderer`) built from `centerline_ab` -> Catmull-Rom (24 samples) -> world via `q(a,b) = wrist + a*(midProx - wrist) + b*(pinkyProx - indexProx)` lifted about 5 mm along the palm normal | Same formula already in `palm-regions.json`; 11 lines x ~24 vertices is nothing for the CPU |
| Hand | Do not render a hand mesh in MR (passthrough shows the real hand). Hand mesh only as depth/occlusion mask or in VR worlds | Fewer draw calls, no skinning mismatch |
| Shader | Shader Graph URP *Unlit*, Surface = Transparent, Blend = Additive, ZWrite off, `_Ignite` (0-1 along the line), `_Hover`, `_Select`, `_Seed`; UV.x = arclength | Additive light reads as "emitted" over passthrough |
| Glow look | Core = `smoothstep` of `1-abs(uv.y*2-1)`, outer halo = same squared, flowing noise `uv.x*8 - time*0.6`, pulse `0.8+0.2*sin(time*2+seed)`; colour ramp gold -> ember | Cheap: 1 texture sample (noise) |
| Particles | One Shuriken system per line: embers drifting off, 20-40 alive, additive, Kenney soft-circle texture | Overdraw is the cost, not count |
| Occlusion | Meta Depth API hands/environment occlusion if virtual items must go behind fingers | Official feature, see 1.4 |

**Passthrough blending note (my call, verify on device in the first hour).** Meta composites the eye buffer over passthrough using the alpha channel
([Passthrough Windows](https://developers.meta.com/horizon/documentation/unity/unity-customize-passthrough-passthrough-windows/) - bot-walled, read via fetch:
alpha 0 shows passthrough, and its window shader uses `Blend Zero SrcAlpha`). So `Blend One One` (alpha left at 0) should add light on top of the real palm,
while a normal alpha blend would make lines look like stickers. Camera must be set as in Meta's
[Passthrough basic tutorial](https://developers.meta.com/horizon/documentation/unity/unity-passthrough-tutorial/) (bot-walled): solid colour background (0,0,0,0), skybox None, `OVRPassthroughLayer` as underlay.

### 1.2 Palm frame, palm-up and gaze (starter code)

```csharp
// Joint names: WebXR index-finger-phalanx-proximal ~ OVR Hand_Index1 ~ ISDK HandIndex1 (check names in your SDK version).
public struct PalmFrame {
    public Vector3 O, Ey, Ex, N;                 // origin, finger axis, knuckle axis, palm normal
    public Vector3 Q(float a, float b) => O + Ey * a + Ex * b;     // lift by N*0.005f when drawing
}
PalmFrame Build(Vector3 wrist, Vector3 indexProx, Vector3 midProx, Vector3 pinkyProx, bool right) {
    var f = new PalmFrame { O = wrist, Ey = midProx - wrist, Ex = pinkyProx - indexProx };
    f.N = Vector3.Cross(f.Ey, f.Ex).normalized * (right ? 1f : -1f);   // flip the sign once on device if both hands face inward
    return f;
}
bool PalmUpAndSeen(PalmFrame f, Transform head) {
    Vector3 centre = f.Q(0.55f, 0f);
    Vector3 toHead = (head.position - centre).normalized;
    bool facing = Vector3.Dot(f.N, toHead) > 0.6f;                              // palm faces the eyes
    bool inGaze = Vector3.Angle(head.forward, centre - head.position) < 30f;    // looking at it
    return facing && inGaze;                                                    // require 250 ms continuous before igniting
}
```
Smooth `O/Ey/Ex` with a critically damped filter (or the 1-euro filter) at about 8-12 Hz cutoff; **freeze the frame at select** so the portal does not jitter when the other hand covers the palm.

### 1.3 Touch / pinch on lines - do not use physics (my call)

```csharp
// In palm (a,b) space the finger is a point; lines are polylines. Convert the fingertip once, then 2D distances (cm-accurate, zero alloc).
Vector2 ToAB(PalmFrame f, Vector3 p) {                   // least-squares projection onto the Ey/Ex plane
    Vector3 d = p - f.O; float ee = Vector3.Dot(f.Ey, f.Ey), xx = Vector3.Dot(f.Ex, f.Ex), ex = Vector3.Dot(f.Ey, f.Ex);
    float de = Vector3.Dot(d, f.Ey), dx = Vector3.Dot(d, f.Ex), det = ee * xx - ex * ex;
    return new Vector2((de * xx - dx * ex) / det, (dx * ee - de * ex) / det);
}
float height = Vector3.Dot(tip - f.O, f.N);              // 0 = on the skin
// hover: height < 0.03 and dist(ab, line) < halfwidth*1.5 ; touch: height < 0.008 ; pinch: ISDK IHand.GetFingerIsPinching(HandFinger.Index) with the pinch point near the line
// hysteresis: enter at 1.0x halfwidth, leave at 1.6x; dwell 120 ms before Select to kill accidental brushes
```
Tracking degrades when one hand overlaps the other, so the 120 ms dwell, the hysteresis and "pinch" as the alternative confirm are what make this feel solid.
If you still want the SDK route: `PokeInteractable` needs an `ISurfacePatch`; the community
[ColliderSurfacePatch workaround](https://communityforums.atmeta.com/unity-development-123/how-to-make-a-collider-pokeable-via-poke-interactable-155490)
(the poster notes a thin "skin" that fires Unselect early) and Meta's [Poke Interactions](https://developers.meta.com/vr/documentation/unity/unity-isdk-poke-interaction/) /
[Create Poke Interactions](https://developers.meta.com/horizon/documentation/unity/unity-isdk-create-poke-interactions/) / [PokeInteractable reference](https://developers.meta.com/horizon/reference/interaction/v203/class_oculus_interaction_poke_interactable/) (all bot-walled, read via fetch).
Use ISDK pose detection ([Hand Pose Detection](https://developers.meta.com/horizon/documentation/unity/unity-isdk-hand-pose-detection?locale=en_GB),
[Detecting a Hand Pose](https://developers.meta.com/horizon/documentation/unity/unity-isdk-building-hand-pose-recognizer/)) for the **closing fist** (close-world) and an open-palm "begin" pose.

### 1.4 Hand mesh, skinned material and occlusion options

| Option | Source | Use here |
|---|---|---|
| ISDK `HandVisual` with your own material | [Hand Visual](https://developers.meta.com/vr/documentation/unity/unity-isdk-hand-visual/), [Use Custom Hand Model](https://developers.meta.com/horizon/documentation/unity/unity-isdk-customize-hand-model/) (bot-walled) | In VR worlds: golden "ghost hand" with fresnel rim. Note: OVRSkeleton/OVRCustomSkeleton does not follow ISDK-modified data, `HandVisual` does |
| Passthrough Windows material on the hand mesh | [Passthrough Windows](https://developers.meta.com/horizon/documentation/unity/unity-customize-passthrough-passthrough-windows/): shader returns `float4(0,0,0,alpha)`, `Blend Zero SrcAlpha`, render queue 5000 | **Real hand visible inside an opaque VR dome** (my call: inflate the mesh 3-5 mm to hide tracking edge error) |
| Depth API hand removal / occlusion | [Depth API Overview](https://developers.meta.com/vr/documentation/unity/unity-depthapi-overview/), [Get started with Occlusions](https://developers.meta.com/vr/documentation/unity/unity-depthapi-occlusions-get-started/), [Hands removal](https://developers.meta.com/horizon/documentation/unity/unity-depthapi-hands-removal/), [Depth API sample](https://developers.meta.com/horizon/documentation/unity/unity-sample-depth-api/), repo [Unity-DepthAPI](https://github.com/oculus-samples/Unity-DepthAPI) | Optional: grown trees/lotus occluded correctly by the room |

### 1.5 VFX Graph vs Particle System on Quest (checked)

* Unity's [Requirements page (VFX Graph 17.0)](https://docs.unity3d.com/Packages/com.unity.visualeffectgraph@17.0/manual/System-Requirements.html): needs **compute shaders and SSBOs**, "**does not support OpenGL ES**", and says VFX Graph "isn't out of preview for mobile platforms" (the page is dated; treat as a warning, not a ban).
* Quest runs Vulkan or GLES ([OpenGL ES and Vulkan](https://developers.meta.com/vr/documentation/unreal/os-vulkan-opengl/) - Meta's doc, bot-walled); compute exists on Quest (Meta talk [State of Compute 2024: Maximizing Performance on Meta Quest](https://www.youtube.com/watch?v=RYkXBOEVrSY)).
* Field report: [Vulkan slower than GLES on Quest 2/3 because of buffer copies](https://discussions.unity.com/t/vulkan-performing-much-worse-than-opengl-es-due-to-excessive-buffer-copies-on-quest-2-3/1561926) - the thread body was not readable to my fetcher; the title is the claim, open it before betting on Vulkan-only effects.
* Unity's own [comparison](https://docs.unity3d.com/Manual/ChoosingYourParticleSystem.html): built-in = thousands of particles, CPU-scriptable; VFX Graph = millions, needs compute.
* Another Quest gotcha: the free Cartoon FX pack's particles vanished in a Quest build until soft particles were disabled / Depth+Opaque Texture handled ([Unity thread](https://discussions.unity.com/t/particles-aren-t-shown-on-meta-quest-2-apk-build/1592066)).

**My call:** Shuriken for everything (budget: <= 1,500 live particles total, each <= 40 px wide on screen, soft particles OFF, no depth-texture dependence). The cost is fill rate/overdraw, so prefer few big additive quads over many tiny ones. Use VFX Graph only if a hero effect truly needs it and only after a 10-minute device test at 72 Hz (13.9 ms/frame; Meta's [AI performance tutorial](https://developers.meta.com/horizon/documentation/unity/unity-tutorial-ai-vr-performance/) states that budget). Profile with Meta's [Runtime Optimizer](https://developers.meta.com/horizon/documentation/unity/unity-quest-runtime-optimizer/) and [Optimize performance](https://developers.meta.com/vr/documentation/unity/optimize-performance/) (design to nominal CPU/GPU level 4). Meta also has a worked [dissolve + energy-blade URP shader tutorial](https://developers.meta.com/horizon/documentation/unity/unity-tutorial-ai-vr-polish/) (AI-prompt based, but the shader description is reusable).

### 1.6 Shader / VFX learning and free code

| Resource | Licence / note |
|---|---|
| [Cyanilux - Hologram Shader Breakdown](https://www.cyanilux.com/tutorials/hologram-shader-breakdown/) | tutorial, URP Shader Graph; fresnel + scanline + glitch |
| [Daniel Ilett - Holograms in Shader Graph and URP](https://danielilett.com/2020-07-12-tut5-9-urp-hologram/) + [video](https://www.youtube.com/watch?v=wtZ5WcrV-9A) | tutorial |
| [daniel-ilett/dissolve-urp](https://github.com/daniel-ilett/dissolve-urp) | **MIT** - dissolve (for portal bloom / world edge) |
| [daniel-ilett/shaders-stylised-shield](https://github.com/daniel-ilett/shaders-stylised-shield) | **MIT** - energy shield (good for the portal rim) |
| [gamedevserj/Shader-Graph-Experiments](https://github.com/gamedevserj/Shader-Graph-Experiments) | **MIT** - many URP Shader Graph effects |
| [andydbc/HologramShader](https://github.com/andydbc/HologramShader) | **MIT**, 992 stars (older pipeline; read, re-implement) |
| [keijiro/NoiseShader](https://github.com/keijiro/NoiseShader) | **MIT** - procedural noise HLSL for flowing energy |
| [keijiro/Smrvfx](https://github.com/keijiro/Smrvfx) | Unlicense - skinned mesh -> VFX Graph (skip on Quest unless VFX Graph tests pass) |
| [Gabriel Aguiar Prod. (YouTube)](https://www.youtube.com/@GabrielAguiarProd): [VFX Graph portal](https://www.youtube.com/watch?v=z5uJA4Ay-Po) (2026 remake), [original portal](https://www.youtube.com/watch?v=V2NZb0WN7SY), [level-up effect](https://www.youtube.com/watch?v=tnUPngBEnQ8) | tutorials; VFX Graph - recreate with Shuriken + Shader Graph |
| [Ben Cloward](https://www.youtube.com/@BenCloward), [Shader Graph Technical Overview with Ben Cloward](https://www.youtube.com/watch?v=iTrrkdjGO0c), [Brackeys](https://www.youtube.com/@Brackeys), [Minions Art](https://www.youtube.com/@MinionsArt), [Daniel Ilett](https://www.youtube.com/@DanielIlett) | channels |
| Unity docs: [Shader Graph](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.0/manual/index.html), [Fresnel Effect node](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.0/manual/Fresnel-Effect-Node.html), [Unity-Technologies/Graphics](https://github.com/Unity-Technologies/Graphics), [UniversalRenderingExamples](https://github.com/Unity-Technologies/UniversalRenderingExamples), [VisualEffectGraph-Samples](https://github.com/Unity-Technologies/VisualEffectGraph-Samples), [VFXToolbox](https://github.com/Unity-Technologies/VFXToolbox) | Unity repos (licence field "other"/NOASSERTION on GitHub - read each LICENSE) |

Free particle packs (Unity Asset Store EULA applies; test on Quest, some rely on soft particles):
[Cartoon FX Remaster Free](https://assetstore.unity.com/packages/vfx/particles/cartoon-fx-remaster-free-109565),
[Unity Particle Pack](https://assetstore.unity.com/packages/vfx/particles/unity-particle-pack-127325),
[Free Fantasy VFX Pack (URP)](https://assetstore.unity.com/packages/vfx/particles/spells/free-fantasy-vfx-pack-urp-309118).
CC0 particle textures: [Kenney particle assets](https://kenney.nl/assets/category:Particles) ([Kenney all assets](https://kenney.nl/assets)).

---

## 2. "Opens its own world" - portal techniques

### 2.1 Comparison

| Technique | What it gives | Verdict |
|---|---|---|
| **Stencil portal / bubble** (a mesh writes stencil 1, world objects test `Stencil Comp Equal`) | A bounded miniature world floating over the palm; no extra camera, one draw of the world | **Stage 1 (use)** |
| **Skybox / HDRI swap + dimmed passthrough** | Full immersion for cheap (one cubemap sample) | **Stage 2 (use)** |
| **Passthrough Windows ("poke-a-hole")** | Real-world pixels cut into a VR scene via framebuffer alpha | **Use on the hand mesh** so the real hand stays visible in the dome |
| Passthrough style: tint / brightness / colour LUT / edge rendering | Passthrough itself turns gold/indigo with glowing real-world outlines | **Use for transitions** ([Passthrough sample](https://developers.meta.com/horizon/documentation/unity/unity-sample-starter-passthrough/) shows brightness/contrast/saturation, colour LUTs, edge rendering, smooth VR/MR fade) |
| Surface-projected passthrough (`AddSurfaceGeometry`) | window onto real surfaces | **Avoid**: "deprecated at the Meta XR SDK level as of v83" ([page](https://developers.meta.com/vr/documentation/unity/unity-customize-passthrough-surface-projected-passthrough/); Meta says use reconstructed passthrough or Passthrough Windows for new work) |
| Render-texture second camera | classic portal | Too expensive on Quest (second eye-pair of rendering) - **my call: skip** |

### 2.2 URP stencil in practice

* Unity: [Render Objects renderer feature](https://docs.unity3d.com/6000.2/Documentation/Manual/urp/renderer-features/renderer-feature-render-objects.html) (has stencil override; the mask can be written without custom shaders). Daniel Ilett's [Shader Toolbox - Stencil Graph Targets](https://danielilett.com/shader-toolbox/stencil-targets/) adds *Stencil Lit/Unlit Shader Graph* targets, so no HLSL needed.
* Learn: [Portals Part 2 - stencil-based portals](https://danielilett.com/2019-12-14-tut4-2-portal-rendering/), videos [Fully Functional Portals in Unity URP](https://www.youtube.com/watch?v=PkGjYig8avo), [Impossible Geometry with Stencil Shaders](https://www.youtube.com/watch?v=EzM8LGzMjmc).
* Open-source (GitHub licence field checked): [daniel-ilett/shaders-portal](https://github.com/daniel-ilett/shaders-portal) (MIT), [noisecrime/Unity-StencilPortalRoomCube](https://github.com/noisecrime/Unity-StencilPortalRoomCube) (MIT; rooms sharing space through portals), [Tongzhou-Yu/ar-portal-arfoundation-urp](https://github.com/Tongzhou-Yu/ar-portal-arfoundation-urp) (MIT; stencil portals in URP on a handheld AR camera - closest to MR), [danielpokladek-shaders/spyro-inspired-portal](https://github.com/danielpokladek-shaders/spyro-inspired-portal) (MIT).
* Gotchas (my call): put world renderers in a layer + on the Render Objects pass, not the default pass; stencil needs a depth-stencil buffer (URP default asset has one); test **Single Pass Instanced** on device once (the portal sphere must render for both eyes); a sphere portal needs back-face culling off for the inside view or use the inside-out sphere trick.

### 2.3 Meta samples to crib from (all public)

[Unity-StarterSamples](https://github.com/oculus-samples/Unity-StarterSamples) (MIT) - the Passthrough scenes (hand-tracked flashlight made of a passthrough cone, 3D passthrough brush using `LineRenderer`, style panel);
[Unity-TheWorldBeyond](https://github.com/oculus-samples/Unity-TheWorldBeyond) (MIT; MR reference: Scene API, passthrough, Voice SDK, Interaction SDK, **Audio Spatializer**);
[Unity-Discover](https://github.com/oculus-samples/Unity-Discover) (MIT; Interaction SDK + passthrough + anchors, Photon);
[Unity-Phanto](https://github.com/oculus-samples/Unity-Phanto) (MIT; scene mesh, haptics);
[Unity-DepthAPI](https://github.com/oculus-samples/Unity-DepthAPI);
[Unity-InteractionSDK-Samples](https://github.com/oculus-samples/Unity-InteractionSDK-Samples) (PokeExamples scene);
[Unity-PassthroughCameraApiSamples](https://github.com/oculus-samples/Unity-PassthroughCameraApiSamples) (palm scan tier; `PassthroughCameraAccess` via MRUK, both cameras, intrinsics/extrinsics).
GitHub shows licence "NOASSERTION" for the last three: read their LICENSE (Meta SDK licence terms) before copying code.

### 2.4 Two-stage portal, concretely

1. `Bloom` (0-1.2 s): a sphere at the palm centre scales 0 -> 0.35 m with a dissolve-edge material (dissolve-urp); inside, stencil shows the world's miniature (skybox is not drawn in stencil; use a small dome mesh with the HDRI cubemap + the line's props).
2. `Hold` (1.2-3 s): the miniature spins slowly, the narrator starts at 1.5 s.
3. `Immerse` (after 3 s, or on a second pinch): fade passthrough to dark/tinted (`OVRPassthroughLayer` brightness/LUT), enable the dome, apply PokeAHole material to the hand mesh, ambient + narration continue. A 0.5 s eased scale of the dome from the palm gives the "world swallows the room" effect.
4. `Close`: a **closing fist** (ISDK pose) or `Palm down`: reverse the sequence in 0.8 s; the lines relight in order.

---

## 3. Per-line world art direction

**Sensitivity rules (my call, important for a public video).** Palmistry is a cultural/entertainment tradition: say "the tradition says", never predict, diagnose or advise (the rulebook already enforces this).
Use *abstract* sacred forms - planets as glowing orbs, lotus, mandala, glyphs, flames, water, stars. **Do not show deity faces/statues**, do not put sacred imagery on the floor
or under the user's feet, and avoid framing Shani/Rahu/Ketu as evil or unlucky; call them "turning points" and "shadow points".
Skip the swastika even though it is an auspicious mark in the Indian texts (it will be misread by a global jury); use the lotus, conch, fish, wheel instead (listed in the rulebook's marks).
Sketchfab searches for "yantra" or "temple" return religious objects: prefer procedural geometry.

Navagraha colour/gem references: [Wikipedia: Navagraha](https://en.wikipedia.org/wiki/Navagraha) lists the gems (Surya ruby, Chandra pearl, Mangala red coral, Budha emerald, Guru yellow sapphire, Shukra diamond, Shani blue sapphire, Rahu hessonite garnet, Ketu cat's eye) and says Mangala has a red complexion and Shani is dark blue/black; hex values below are **my palette picks**.
Sacred-geometry reference: [Sri Yantra (Wikipedia)](https://en.wikipedia.org/wiki/Sri_Yantra), [Commons: Sri Yantra](https://commons.wikimedia.org/wiki/Category:Sri_Yantra), [Commons: Mandala](https://commons.wikimedia.org/wiki/Category:Mandala) (check each file's licence); build mandalas procedurally (polar-coordinate Shader Graph) so there is no licence issue.

### 3.1 Lines (ids as in `palm-regions.json`)

| Line | World | Palette (core / halo) | Motifs | HDRI (Poly Haven, CC0) | Ambient + stinger | Hero technique |
|---|---|---|---|---|---|---|
| `life` Jeevan | **Banyan + river of light**: roots grow along the palm line then up into a canopy; the line becomes a river | `#2FBF71` / `#FFD27A` | roots, ripples, fireflies, Devanagari "जीवन" | [lakeside_sunrise](https://polyhaven.com/a/lakeside_sunrise) | tanpura Sa-Pa + soft water; bowl | `_Growth` vertex displacement on a tube along the spline; CC-BY [Banyan](https://sketchfab.com/3d-models/none-d8a053be9d0f40328b713d4ee13b86d4) or Quaternius trees |
| `heart` Hridaya | **Lotus on a dusk ocean**: lotuses open in a ripple ring from the touch point | `#FF5C8A` / `#3FD0D4` | lotus petals, ripples, rose-gold | [blue_lagoon_night](https://polyhaven.com/a/blue_lagoon_night) | bowl + breathing pad; heartbeat-slow bell | animated petals (mesh particles), water = scrolling normal on a disc; CC-BY [Stylized Lotus](https://sketchfab.com/3d-models/none-12768caa111f446b8796e70f9cc53a23) |
| `head` Mastishk | **Constellation sky**: stars appear, join into a thinking-mind constellation | `#DDE6FF` / `#4B4FD8` | star points + line segments, Devanagari letters as constellations | [rogland_clear_night](https://polyhaven.com/a/rogland_clear_night) | high bell, whisper layer | point cloud mesh + `LineRenderer` joins, drawn in sequence |
| `fate` Bhagya | **Saturn and the cosmic path**: a road of light crosses a ringed planet | `#9FB7FF` / `#1B2A49` + gold ring | ringed planet, path of light, orbit | [rogland_moonlit_night](https://polyhaven.com/a/rogland_moonlit_night) | deep drone, slow bell | procedural sphere + ring (no model needed); optional CC-BY [Saturn](https://sketchfab.com/3d-models/none-9ab1eb3bb97f4e4a9305c0aae2d280a6) |
| `sun` Surya | **Solar mandala** blooming open | `#FFB000` / `#FF5A1F` | rotating mandala rings, rays, saffron | [qwantani_sunrise](https://polyhaven.com/a/qwantani_sunrise) or [pink_sunrise](https://polyhaven.com/a/pink_sunrise) | rising tanpura + temple bells | polar-coordinate Shader Graph, 3 counter-rotating layers |
| `mercury_health` Budh | **Emerald garden of script**: leaves and glyphs drift | `#3DDC97` / `#0B6E4F` | herb leaves, flowing script, steam | [kloofendal_38d_partly_cloudy_puresky](https://polyhaven.com/a/kloofendal_38d_partly_cloudy_puresky) | light chimes | mesh-particle leaves |
| `marriage`, `girdle_of_venus`, `mars_line`, `intuition`, `bracelets` | reuse the world of the owning mount (Venus petals, Mars embers, Moon lake, ...) with a different glyph | per mount | - | per mount | per mount | zero extra art (re-skin) |

Use *two* palettes only per world, glow in the core colour and a low-sat halo, to keep the trailer readable.

### 3.2 Mounts (Navagraha mapping, ids from `palm-regions.json`)

| Mount id | Graha | Gem | Colour | World idea (abstract) |
|---|---|---|---|---|
| `jupiter` Guru | Brihaspati | yellow sapphire | turmeric gold `#F5B700` | a lamp-lit library: floating glyph scrolls rise like a halo |
| `saturn` Shani | Shani | blue sapphire | indigo / steel `#1B2A49` | slow ringed-planet orbit, patience, long reverb |
| `sun_apollo` Surya | Surya | ruby | ruby-orange `#E8481C` | solar mandala (shared with `sun` line) |
| `mercury` Budh | Budha | emerald | green `#2BB673` | flowing script / quick lights |
| `mars_upper`, `mars_lower`, `plain_of_mars` Mangal | Mangala | red coral | coral red `#E5533D` | ember mandala, drum pulse (courage, not aggression) |
| `luna_moon` Chandra | Chandra | pearl | pearl/silver `#EAF2FF` | moonlit lake, tide |
| `venus` Shukra | Shukra | diamond | white-rose `#FFE3EF` | petal storm, warm light |
| `rahu`, `ketu` | Rahu, Ketu | hessonite, cat's eye | smoke violet `#5B4B8A` / ash `#9A9A9A` | eclipse ring with a bright corona - "turning points" |

### 3.3 Free 3D models, HDRIs, textures

* **Poly Haven** - everything is CC0 ([licence](https://polyhaven.com/license), [HDRIs](https://polyhaven.com/hdris)); I pulled the asset list from their public API to pick the slugs above. Download **1k or 2k** HDRIs, import as Cubemap (Texture Shape = Cube), compress ASTC; 8k is wasted on Quest.
* **Quaternius** - CC0: [Stylized Nature MegaKit](https://quaternius.com/packs/stylizednaturemegakit.html) (the page states CC0, FBX/glTF), [Ultimate Stylized Nature](https://quaternius.com/packs/ultimatestylizednature.html) (60+ trees/plants), [home](https://quaternius.com/).
* **Kenney** - CC0: [assets](https://kenney.nl/assets), [particles](https://kenney.nl/assets/category:Particles).
* **Sketchfab** - [free downloadable models](https://sketchfab.com/features/free-3d-models). I queried their public API: CC0 hits for these themes are essentially museum scans (heavy, wrong theme), so use **CC-BY** models and credit the author in-app. Picks (all under 10k faces): [Stylized Lotus Flower - Kigha](https://sketchfab.com/3d-models/none-12768caa111f446b8796e70f9cc53a23), [Banyan - lawrencetrigg1989](https://sketchfab.com/3d-models/none-d8a053be9d0f40328b713d4ee13b86d4), [Saturn (planet) - SebastianSosnowski](https://sketchfab.com/3d-models/none-9ab1eb3bb97f4e4a9305c0aae2d280a6). Re-check the licence label on each page when downloading.
* **Devanagari text** - Unity's TextMesh Pro does not shape Devanagari conjuncts well (users report broken glyphs, see [this Unity thread](https://discussions.unity.com/t/hindi-text-rendering-issue-in-unity/1704259)); Unity's [Advanced Text Generator](https://docs.unity3d.com/6000.2/Documentation/Manual/UIE-advanced-text-generator.html) uses HarfBuzz but is UI Toolkit only and needs dynamic font assets. **My call:** render each Hindi phrase once in a browser/Pillow-with-raqm using [Noto Sans Devanagari](https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari) (OFL, [google/fonts](https://github.com/google/fonts); also [Tiro Devanagari Hindi](https://fonts.google.com/specimen/Tiro+Devanagari+Hindi)) to a transparent PNG and put it on an additive quad. Zero runtime shaping risk. [Commons: Devanagari](https://commons.wikimedia.org/wiki/Category:Devanagari) for reference glyphs.

### 3.4 Indian-style ambient and music (licences verified on each page)

All Freesound items below show **CC0** on their page (checked 18 Nov 2026). Download the original WAV, trim, loop-crossfade, export Vorbis.

| Use | Sound | Note |
|---|---|---|
| Tanpura beds | [tanpura drone#3 - MieliTietty](https://freesound.org/people/MieliTietty/sounds/619263/), [Tanpura Slow plucking... E minor - luckylittleraven](https://freesound.org/people/luckylittleraven/sounds/416776/), [Tanpura tune detune 02](https://freesound.org/people/luckylittleraven/sounds/416764/), [Tanpura Droning Pluck Riff 06 C sharp](https://freesound.org/s/416571/) | pitch-match to the narrator (Sa about 146 Hz D3 in our synthetic bed) |
| Temple bells | [2HinduTemplesBells2 - LoopUdu](https://freesound.org/people/LoopUdu/sounds/271627/), [Temple bells - zachrau](https://freesound.org/people/zachrau/sounds/232440/), [temple_bell_002 - tec_studio](https://freesound.org/people/tec_studio/sounds/668647/) | touch strikes, stingers |
| Singing bowls | [Singing Bowl, long without reverb - hollandm](https://freesound.org/people/hollandm/sounds/573805/), [Singing Bowl-deep - zambolino](https://freesound.org/people/zambolino/sounds/699447/), [Sing bowl ring - Tpkmusic](https://freesound.org/people/Tpkmusic/sounds/841989/) | "select" and portal bloom |
| Om tone | [Om.wav - ApeironMedia](https://freesound.org/people/ApeironMedia/sounds/445246/) | use sparingly (low, under the sub layer) |
| Ours (CC0-equivalent) | `hast-rekha-audio/tanpura.wav` via `gen_assets.py` | synthetic tanpura, no licence issue |

**Not CC0:** [Singing Bowl "Tanpura" - Glen_Hoban](https://freesound.org/s/440680/) is CC BY (credit needed). **Pixabay** audio is free without attribution under the [Pixabay content licence](https://pixabay.com/service/license-summary/) (no standalone redistribution; search pages are bot-walled so I could not list individual tracks - browse "Indian ambient"/"temple bell" by hand).
Freesound licence primer: [FAQ](https://freesound.org/help/faq/), [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

---

## 4. The divine voice

### 4.1 Options compared

| Option | Hindi + English | Cost / terms (checked) | "Voice design" | Offline | Verdict |
|---|---|---|---|---|---|
| **ElevenLabs** ([pricing](https://elevenlabs.io/pricing), [voice design docs](https://elevenlabs.io/docs/capabilities/voice-design), [TTS docs](https://elevenlabs.io/docs/capabilities/text-to-speech)) | multilingual models (verify Hindi voices in-app with a 10 s test) | Free: 10k credits/mo (1 char = 1 credit on multilingual v2, roughly 10 min), **no commercial licence**, and their [help article](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform), bot-walled, read via fetch). Starter **$6/mo** (30k credits) = **Commercial License**; Creator $22 | Yes: *Voice Design* is on the Free plan too (prompt a voice, no cloning) | no | **Best expressiveness. Pay $6 for one month** so the video can go public with no credit line. The purchase is Saurabh's call. [terms](https://elevenlabs.io/terms-of-use) |
| **Azure AI Speech** ([voices](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts), [SSML](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice), [pricing](https://azure.microsoft.com/en-in/pricing/details/cognitive-services/speech-services/)) | hi-IN voices listed today: Swara, Madhur, Aarti, Kavya, Kunal, Arjun, Ananya, Aarav, Rehaan, plus MAI-Voice (Dhruv, Priya, Kavya, Arjun). en-IN/en-GB too | Free tier F0: **0.5 M neural chars/month** (pricing page); commercial use allowed on paid use per Azure terms | SSML: `<prosody rate pitch>`, `<break>`, `<emphasis>`; speaking styles vary per voice (check the voice page) | no | **Zero-cost, solid Hindi.** Try `hi-IN-MadhurNeural` rate -15 %, pitch -2 st |
| **Google Cloud TTS** ([voices](https://cloud.google.com/text-to-speech/docs/list-voices-and-types), [Chirp 3 HD](https://cloud.google.com/text-to-speech/docs/chirp3-hd), [pricing](https://cloud.google.com/text-to-speech/pricing)) | Chirp 3 HD lists hi-IN | Chirp 3 HD: **1 M chars/month free**, then $30 / 1 M chars; Neural2 $16 / 1 M | Chirp 3 HD SSML support is "Preview" | no | Good fallback; billing account needed |
| **Piper** ([engine GPL](https://github.com/OHF-Voice/piper1-gpl), [archived MIT repo](https://github.com/rhasspy/piper), [voices](https://huggingface.co/rhasspy/piper-voices), [Hindi voices](https://huggingface.co/rhasspy/piper-voices/tree/main/hi/hi_IN), [samples](https://rhasspy.github.io/piper-samples/)) | `en_GB-alba` (CC BY 4.0), `hi_IN-pratham/priyamvada` (**CC BY-NC-SA**) | Free; runs on CPU in seconds | none (one fixed speaker) | **yes** | Used for the samples; flat but pleasant, the post chain does the "divine" |
| **Indic Parler-TTS** ([model](https://huggingface.co/ai4bharat/indic-parler-tts), [code](https://github.com/huggingface/parler-tts), [ONNX export](https://huggingface.co/naklitechie/indic-parler-tts-ONNX)) | 21 languages incl. Hindi, Sanskrit, English; Apache-2.0 | free; 0.9 B params (GPU recommended); gated (accept conditions on HF); its card now points to "Indic-Speak" as the newer model | **Yes - text description controls the voice** ("deep, slow, calm, echoey male voice") | yes | Best *free* "designed" voice; try in Colab if time allows; not run here |
| [IndicF5](https://huggingface.co/ai4bharat/IndicF5) | Indic, MIT, gated | reference-audio based | cloning-style | yes | skip (needs reference voice; impersonation risk) |
| Coqui XTTS-v2 ([model](https://huggingface.co/coqui/XTTS-v2), [repo MPL-2.0](https://github.com/coqui-ai/TTS)) | Hindi yes | model licence `other` (CPML, non-commercial); company defunct | cloning | yes | **avoid**: licence + cloning |

**Never clone a real person** (a guru, actor, deity-narrator impersonation) - use designed/neutral voices only.

### 4.2 Pre-render vs runtime

Pre-render. At 60-72 fps there is no frame budget for TTS, runtime cloud calls need internet at judging time, and you want the post chain. Budget: 11 lines x 2 languages x ~30 s = 22 clips; at about 250 KB each as Vorbis that is about 5.5 MB. Unity import: Vorbis, *Streaming* load for narration, *Compressed In Memory* for loops, *Force To Mono* for spatialised cues; call `AudioClip.LoadAudioData()` at scene start for the first world (Magic Wonders also lists "asset preloading" among its fixes).

### 4.3 The divine post chain (what `divine.sh` does)

Voice + octave-down layer (weight) + octave-up whisper (halo) + fifth-up pad (choir) -> chorus -> convolution reverb (stone hall, ~3 s) -> tanpura bed -> loudnorm -16 LUFS. Full commands, parameters and licences in
[`hast-rekha-audio/README.md`](hast-rekha-audio/README.md). Core command:

```bash
ffmpeg -i narration.wav -i temple_ir.wav -stream_loop -1 -i tanpura.wav -filter_complex "
 [0:a]aresample=44100,highpass=f=90,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,asplit=4[m][s][w1][w2];
 [m]equalizer=f=220:t=h:w=200:g=2,equalizer=f=4500:t=q:w=1.5:g=1.5[main];
 [s]rubberband=pitch=0.5,lowpass=f=900,volume=0.30[sub];
 [w1]rubberband=pitch=2.0,highpass=f=1500,adelay=28,volume=0.10[whisper];
 [w2]rubberband=pitch=1.4983,lowpass=f=3500,adelay=45,volume=0.12[fifth];
 [main][sub][whisper][fifth]amix=inputs=4:normalize=0,chorus=0.6:0.9:55|70:0.4|0.32:0.25|0.4:2|1.3,pan=stereo|c0=c0|c1=c0[voice];
 [voice]asplit=2[dry][toverb]; [toverb][1:a]afir=dry=0:wet=1:gtype=peak:irgain=1,volume=0.9[wet];
 [dry][wet]amix=inputs=2:weights=1 0.85:normalize=0,apad=pad_dur=3[vmix];
 [2:a]volume=-20dB,aresample=44100,pan=stereo|c0=c0|c1=c0[drone];
 [vmix][drone]amix=inputs=2:duration=first:normalize=0,afade=t=in:d=0.4,loudnorm=I=-16:TP=-1.5:LRA=7,alimiter=limit=0.95[out]" \
 -map "[out]" -ac 2 -c:a libvorbis -q:a 3 out.ogg
```
Filter docs: [afir](https://ffmpeg.org/ffmpeg-filters.html#afir), [rubberband](https://ffmpeg.org/ffmpeg-filters.html#rubberband), [chorus](https://ffmpeg.org/ffmpeg-filters.html#chorus). Audacity ([download](https://www.audacityteam.org/)) is for hand-trimming and quick A/B: *Effect > Reverb* (Room Size 90, Pre-delay 20 ms, Reverberance 70, Damping 60, Wet +6 dB), *Change Pitch -12 st* for the sub layer (starting values, my call).

**Free impulse responses.** Our own synthetic stone hall (`gen_assets.py`, no licence). Recorded libraries: [EchoThief](https://www.echothief.com/) (sea caves, lava tube, kilns, domes; check the terms on the site before shipping), OpenAIR ([about page](https://www.openair.hosted.york.ac.uk/?page_id=2) - the host has a TLS-certificate problem from my box, so open it in a normal browser; IRs there carry per-file Creative Commons licences, credit if CC BY). Convert to 44.1 kHz stereo wav and swap `temple_ir.wav`.

### 4.4 Spatial audio (Meta XR Audio SDK)

Docs: [Overview](https://developers.meta.com/vr/documentation/unity/meta-xr-audio-sdk-unity/), [Requirements and setup](https://developers.meta.com/vr/documentation/unity/meta-xr-audio-sdk-unity-req-setup/), [Apply spatialization](https://developers.meta.com/horizon/documentation/unity/meta-xr-audio-sdk-unity-spatialize/), [Tutorial: spatialize audio in VR and MR](https://developers.meta.com/horizon/documentation/unity/unity-tutorial-basic-audio/), [Plugin intro](https://developers.meta.com/horizon/documentation/unity/meta-xr-audio-sdk-unity-intro/) (all bot-walled, read via fetch). Reference project: [Unity-TheWorldBeyond](https://github.com/oculus-samples/Unity-TheWorldBeyond) uses the audio spatializer.
**Plan (my call):** narrator = 2D stereo (already wet, "voice from within"); touch bells and chimes = mono, spatialised at the contact point; tanpura = spatialised 2 m behind and above so the sound surrounds; whisper double on a spatialised source orbiting slowly at head height. Do not spatialise the baked-reverb narrator (it would collapse the stereo tail).

---

## 5. Feedback without haptics

Meta's [Phanto sample](https://github.com/oculus-samples/Unity-Phanto) leans on haptics (Haptics SDK); bare hands have none, so let sound + light carry the contact (my call, tune on device):

| Event | Visual (within 1 frame; flare peaks by about 100 ms) | Audio |
|---|---|---|
| Palm seen | faint gold dust gathers over the palm | very soft rising tanpura swell |
| Line ignite (staggered 150 ms apart, life -> head -> heart -> fate -> sun) | line draws in from its start at about 0.5 m/s, ember trail | one ascending bell per line (Sa Re Ga Pa Dha), spatialised on the line |
| Hover (finger < 3 cm) | line x2 brightness, line "leans" 3 mm towards the finger, halo widens | shimmer at 20 % volume, pitch rises with proximity |
| Touch (< 8 mm) | ripple ring runs along the line both ways from the contact point, 30-particle burst | bell strike at the contact point + 80 ms sub thump |
| Select (pinch / dwell 120 ms) | line flashes white-gold, palm flares, portal sphere pops out | bowl strike + sub drop, narrator starts at about 1.5 s |
| Close fist | world collapses into the palm in 0.8 s | reverse swell, tanpura returns |

Tracking-loss rule: if the finger jitters, keep hover for 200 ms after loss rather than snapping off (feels sticky and magical, not broken).

---

## 6. Magic Wonders - lessons that transfer

Source: the [Devpost page](https://devpost.com/software/magic-wonders) (read) and its [video page](https://www.youtube.com/watch?v=NTN3Vbj88MY) (reachable; YouTube blocks captions/transcripts from my box, so only the Devpost text was read). No public repo.

* Their stated learnings: "physical gestures dramatically increase immersion" and "real-world responsiveness makes the magic feel real".
* Their v2 fixes (from the page): improved **sound effects, spatial audio and asset preloading**, **interactive tutorials**, better gesture recognition. Take the same order: audio responsiveness first, then a 10-second tutorial (a ghost hand pulses over the palm: "show me your palm").
* The wand magic has a small gesture vocabulary and a clear **loadout/phase** loop; ours should be the same: 3 gestures only - *show palm* (ignite), *touch/pinch a line* (open), *close fist* (close).
* Their "physical reaches digital" hook (smart-home lights/Alexa) suggests an optional trailer beat: a tiny real-world reaction (the passthrough tint changing to gold) when a world opens. (my call: that is just the passthrough colour LUT, free to do.)
* Their video is the reference to study for pacing, but I could not read it; watch it once yourself for how fast the first spell lands (my call: first magic within 5 s of the video start).

---

## 7. Build recipe

### 7.1 Interaction flow

`Idle` -> (palm up + gaze, 250 ms) `PalmSeek` -> (palm stable 300 ms) `Ignite` (lines light in sequence, 1.5 s) -> `Explore` (hover/touch cues) -> (select) `Open` (portal bubble, 1.2 s) -> `World` (narration 20-40 s, ambient, ~3 beats on screen) -> (closing fist or timeout) `Close` -> `Explore`.
Rules: only one world at a time; the other hand's fingertip is the toucher (the palm hand keeps still; use the dominant-hand index tip, either hand works); a pinch near any glowing line selects that line.

### 7.2 Scripts / components

| Component | Responsibility |
|---|---|
| `HandJoints` | wraps OVRSkeleton or ISDK `IHand` -> wrist, index/middle/pinky proximal, index tip, thumb tip, pinch state |
| `PalmFrame` | builds `O/Ey/Ex/N`, smoothing, `PalmUpAndSeen`, freeze |
| `PalmLineData` (ScriptableObject) | imported from `palm-regions.json`: id, `centerline_ab`, halfwidth, tier, mount refs; editor menu "Import palm-regions.json" |
| `GlowLine` | spline -> ribbon mesh each frame (or only when palm moves), `MaterialPropertyBlock` drives `_Ignite/_Hover/_Select` |
| `LineIgniter` | sequence and chimes |
| `LineToucher` | `ToAB`, hover/touch/select state with hysteresis and dwell, emits events |
| `PortalBloom` | stencil sphere + dissolve, stage 1 and 2, passthrough fade (OVRPassthroughLayer brightness/LUT) |
| `WorldDefinition` (ScriptableObject) | line/mount id, palette, cubemap, prefab, ambient clip, narration clips (en, hi), glyph PNG, subtitle text, duration |
| `WorldDirector` | spawns the world under a stencil-layer root, runs three timed beats, unloads cleanly |
| `NarratorPlayer` | preloaded clips, ducking of ambient under narration (-6 dB), subtitle fade |
| `HandMaskWindow` | applies the PokeAHole material to hand mesh in Immerse |
| `CloseFistDetector` | ISDK shape recogniser (fist) |
| `AudioCueBank` | pooled spatialised AudioSources for touch/hover cues |

### 7.3 Must-build for the trailer (ordered, cut from the bottom)

1. Palm detect + 5 glowing lines igniting with chimes (the hook, 5 s).
2. Touch/pinch with hover + touch cues.
3. **Life line world** (banyan + river of light) with narration - the hero shot.
4. **Heart line world** (lotus ocean) - second world proves the system.
5. **Head** (constellations) and **Fate** (Saturn path) worlds - these two are cheap procedural ones (stars, a sphere with a ring).
6. Passthrough tint + hand-in-world (PokeAHole) transition.
7. Close with fist -> lines relight; end card with the tagline.
8. Hindi narration track (same worlds, switch language). Sun / Mercury / mount worlds and the camera-scan tier come after.

Trailer beats (matches `video/trailer-scripts.md` structure): 0-5 s palm ignites, 5-12 s touch heart line, 12-25 s lotus world + narration, 25-33 s fist closes, relight, touch life line, 33-45 s banyan world, 45-50 s head line stars flash cut, 50-55 s tagline.
Capture with the headset Camera app (1920x1080 landscape) or MQDH Cast; keep hands in frame.

### 7.4 One-hour day-one checklist (my call)

* 0:00 run the Meta Passthrough sample + hand tracking on device; confirm transparent camera / underlay.
* 0:15 draw the heart line from `centerline_ab` with a flat additive material on one palm (check the palm normal sign).
* 0:30 add the finger-to-line hit test and the hover/touch colour change.
* 0:45 a stencil sphere with any HDRI inside, opened from the palm on select; log frame time with OVR Metrics.

---

## Appendix A - dropped or flagged links

Dropped as 404: Unity Asset Store "VFX Graph Samples" and "Free URP Shaders Pack" slugs, GitHub `GabrielAguiarProd/ShaderGraph`, `Unity-Technologies/ShaderGraph_ExampleLibrary`, `daniel-ilett/shaders-3d-print`, `ysbaddaden/unity-hand-trail`, Sketchfab help "Licenses" article, OpenGameArt "lotus-flower", Quaternius "ultimatenaturepack", Unity blog "introducing URP Render Objects", `coqui.ai/cpml`, YouTube `@mix_and_jam`, OpenAIR `?page_id=36`.
Docs that returned 500/503 at check time and were left out: Unity URP 17.0 Render Objects and Shader Graph Stencil pages, Gutenberg 20480 page.
Bot-walled but confirmed live through search/fetch: all `developers.meta.com` pages above, the ElevenLabs help article, Pixabay search pages, Patreon.

## Appendix B - what was *not* done

* No audible listening test (the clips are measured, not heard).
* Hindi clip uses the offline Piper voice; Hindi pronunciation of Sanskrit words (e.g. "प्राण") is unchecked by a native ear.
* Nothing from this doc was run in Unity or on a headset; shader/passthrough claims marked (my call) need the one-hour device check.

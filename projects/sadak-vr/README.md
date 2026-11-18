# Sadak VR: Chandni Chowk

A hands-first mixed-reality port of [SADAK](https://github.com/mittal-parth/sadak) ([play the web game](https://playsadak.vercel.app)), the voice-first game for learning Indian languages through everyday errands. Built for Meta Quest 3/3S with IWSDK (WebXR), for the **Meta VR Start Developer Competition 2026**, Adapted / Significantly Updated division.

**Sit at your real table and it becomes the counter of a stall in Old Delhi.** Sadak VR follows SADAK's own game:
- **The errands:** the six Purani Sadak errands in SADAK's order: stop the auto, kachori at the stall, flowers at the mandir, the bus to Kashmere Gate, paranthe in the gali, and up the Jama Masjid minaret.
- **The lessons:** SADAK's lesson lines at its three levels, with the same level ramp.
- **The dialogue:** the vendor's line in script, romanisation and meaning, and your line to say back. Hold the mic and speak it, and it's scored word by word.
- **Between errands:** SADAK's auto and bus rides.
- **Rewards:** ₹ and XP, the Errands card, and the finale "PURANI SADAK SURVIVED".

VR adds:
- **Hands-first:** touching your line says it for you, so everything completes without a voice.
- **Real verbs:** paying with real coins on the vendor's plate, picking garlands, taking a bite of a kachori, and raising your hand to hail Raju at his parked auto.
- **Rickshaw rides** between the stalls SADAK walks you between.

- **Track:** Entertainment or Gaming. **Awards targeted:** Reason to Come Back, Accessibility Forward.
- **Session:** 6 errands (3, 5 or 7 lines each by level), 10 to 15 minutes; "Keep exploring" goes round again and the vendors remember you.
- **Input:** hands only, seated. Voice is optional (Sarvam saaras:v4 scoring).
- Judging map: [docs/JUDGING.md](docs/JUDGING.md) · Tests: [docs/TESTING.md](docs/TESTING.md)

## Run
```bash
npm ci                # Node ≥ 20.19 (.nvmrc). .npmrc skips onnxruntime's CUDA download.
npm run setup         # once per machine: MCP configs + IWSDK reference index
npx @iwsdk/cli dev up --ai-mode agent   # HTTPS dev server + emulator on https://localhost:8086
npm test && npm run typecheck && npm run build
npm run test:xr       # the whole journey with emulated hands (dev server must be up)
```
On a Quest from Linux: `adb reverse tcp:8086 tcp:8086`, then open `https://localhost:8086` in Quest Browser.

### Voices (Sarvam AI)
Put your key in a gitignored `.env.local` from your own terminal (never paste it into chat):
```bash
echo 'SARVAM_API_KEY=sk_...' >> .env.local
npm run bake:tts      # records every scripted line once into public/audio/tts/*.mp3 (bulbul:v3)
```
The baked clips ship as static files, so voices cost nothing at runtime. For optional spoken replies, set `SARVAM_API_KEY` in the Vercel project's environment; `api/stt.ts` proxies saaras:v4 and keeps the key server-side. The dev server serves the same route.

## How it's built
- `src/game/director.ts`: one IWSDK system running SADAK's loop (placing → reveal → arrive → intro → npc → (pay) → player → result → (serve/pick) → done → ride → … → finale).
- `src/game/content.ts`, `lessons-hindi.ts`, `levels.ts`: SADAK's pack, lessons (verbatim, all levels) and level ramp.
- `src/game/cards.ts`: Canvas2D cards for Hindi (the vendor's line, your line); `src/game/panels.ts` + `public/ui/*.uikitml`: UIKit panels (title, Errands HUD, result row, intro card, ride bar, finale).
- `src/sadak-components.ts`: ECS components; input uses IWSDK's RayInteractable/PokeInteractable (Hovered, Pressed) and OneHandGrabbable (Grabbed).
- `src/sadak-audio/`: SADAK's procedural Delhi qawwali, SFX, chime and street ambience.
- `src/game/coins.ts`: pinch-and-drop rupee coins. `src/game/speech.ts`: clip playback and mic. `src/game/score.ts`: SADAK's word aligner.
- `src/sadak-engine/`: SADAK's own engine code (`lib/game`, unmodified, see its README), which builds the city: every building and plot from its OpenStreetMap map, the roads, the Jama Masjid, Sis Ganj Sahib, Gauri Shankar temple and the other landmarks, markets, street furniture, traffic, the crowd, animals, pigeons, the barber shop, its sky and lights, cel shading, and each vendor's clothes (`attireFor`).
- `src/world/sadak-city.ts`: runs SADAK's `buildWorld` the way SADAK's `engine.ts` does, and stands each errand host where SADAK does (inside the temple and the mosque courtyard for those errands). It also makes the VR-only changes: SADAK's grade and haze move into each material, every material gets the reveal from your table, `city-cull.ts` sets a draw distance for the Quest, and `ink.ts` draws ink lines as inverted hulls instead of SADAK's full-screen pass.
- `src/world/street.ts`: the counter at your table, the vendors, the auto and bus, and the rides.
- `src/world/human.ts` + `public/humans/char-*.glb`: the six errand hosts as real characters, also used as the ride drivers. Each has:
  - a MakeHuman body with textured skin, fitted clothing and hair meshes from MakeHuman's CC0 packs, recoloured to SADAK's `attireFor`;
  - a game skeleton with eye bones;
  - Meta-style viseme and blink face shapes;
  - procedural layers: gaze, two-bone arm reach to the counter, blinks and lip sync, with motion-capture clips through an AnimationMixer once `tools/humans/retarget.py` has made them.

  Rebuild one with `blender -b --python tools/humans/build_character.py -- tools/humans/chars/<id>.json public/humans/char-<id>.glb`.
- `server/sarvam.ts` + `api/stt.ts`: serverless speech-to-text.

## Credits
- **SADAK** by [ahmedfahim21](https://github.com/ahmedfahim21), [Parth Mittal](https://github.com/mittal-parth), [Apoorva Agrawal](https://github.com/imApoorva36) and [Mardav Gandhi](https://github.com/marcdhi): game design, Hindi lesson content, the procedural street, people, props and word scoring, used with permission.
- Voices and speech recognition by [Sarvam AI](https://www.sarvam.ai): Bulbul v3 (TTS), Saaras v4 (STT).
- Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, ODbL 1.0.
- SADAK's cel-shaded look is adapted from [sakura-crossing](https://github.com/Kenton-GMI/sakura-crossing) by Kenton Wang (MIT).
- Characters: [MakeHuman](http://www.makehumancommunity.org) via MPFB for Blender, all CC0: the generated bodies; the system assets (eyes, brows, lashes, teeth, hair, skins); the Skins 01/02, Hair 01, Shirts 01, Pants 01, Shoes 01 and Skirts 01 packs; and the Visemes 02 and Faceunits 01 packs. Built by `tools/humans/build_character.py`, recoloured to SADAK's `attireFor`.
- Motion capture: [Quaternius Universal Animation Library 1 and 2](https://quaternius.itch.io/universal-animation-library) (CC0), retargeted onto each character by `tools/humans/retarget.py`.
- Counter wood: [Poly Haven](https://polyhaven.com) `wood_table_001` and `weathered_brown_planks` (CC0).
- Fonts: Mukta, Rozha One and Tiro Devanagari Hindi (SIL Open Font License); Noto Sans Devanagari for SADAK's signboards (OFL).
- Built on Meta's [Immersive Web SDK](https://iwsdk.dev) starter (MIT; `vercel.json` from iwsdk-v0-template, Apache-2.0).
- Music, sound effects and ambience are SADAK's own procedural audio (Web Audio), ported.

## Before submitting
- [ ] **Written permission** from Parth (and the SADAK team) by email or GitHub issue, ideally an MIT licence on the source repo. Meta may ask for proof (rules §4).
- [ ] Headset checks in docs/TESTING.md · deploy (`vercel --prod`) · trailer under 3 minutes.

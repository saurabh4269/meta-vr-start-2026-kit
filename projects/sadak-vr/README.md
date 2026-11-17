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
- **Real verbs:** paying with real coins on the vendor's plate, picking garlands, taking a bite of a kachori, and raising your hand to stop an auto.
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
- `src/world/`: SADAK's cel-shaded Chandni Chowk (ink outlines, Jama Masjid, streets from SADAK's OpenStreetMap data), the six stalls, the auto and bus, rides, and the reveal-from-your-table shader.
- `server/sarvam.ts` + `api/stt.ts`: serverless speech-to-text.

## Credits
- **SADAK** by [ahmedfahim21](https://github.com/ahmedfahim21), [Parth Mittal](https://github.com/mittal-parth), [Apoorva Agrawal](https://github.com/imApoorva36) and [Mardav Gandhi](https://github.com/marcdhi): game design, Hindi lesson content, the procedural street, people, props and word scoring, used with permission.
- Voices and speech recognition by [Sarvam AI](https://www.sarvam.ai): Bulbul v3 (TTS), Saaras v4 (STT).
- Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, ODbL 1.0.
- SADAK's cel-shaded look is adapted from [sakura-crossing](https://github.com/Kenton-GMI/sakura-crossing) by Kenton Wang (MIT).
- Fonts: Mukta, Rozha One and Tiro Devanagari Hindi (SIL Open Font License).
- Built on Meta's [Immersive Web SDK](https://iwsdk.dev) starter (MIT; `vercel.json` from iwsdk-v0-template, Apache-2.0).
- Music, sound effects and ambience are SADAK's own procedural audio (Web Audio), ported.

## Before submitting
- [ ] **Written permission** from Parth (and the SADAK team) by email or GitHub issue, ideally an MIT licence on the source repo. Meta may ask for proof (rules §4).
- [ ] Headset checks in docs/TESTING.md · deploy (`vercel --prod`) · trailer under 3 minutes.

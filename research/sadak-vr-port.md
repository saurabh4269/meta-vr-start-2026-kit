# Candidate: Sadak → hands-first WebXR port

**Source project (linked only, no code vendored here):** [github.com/mittal-parth/sadak](https://github.com/mittal-parth/sadak) · live at [playsadak.vercel.app](https://playsadak.vercel.app)

Repo facts were read from the GitHub API and README on 16 Nov 2026:

- **What it is:** an interactive, voice-first game. You learn Indian languages through everyday conversations: "Ten Indian cities. Talk your way through."
- **Content:** 10 districts and 10 languages, each with five everyday errands. Examples: stop an auto, order at a food stall, buy an offering at the temple, catch a bus.
- **Lesson format:** each line comes with script, romanisation and its meaning in the language you read best. What you say is scored word by word, and there are three difficulty levels.
- **Characters remember you.** On a return visit, sarvam-105b writes a greeting that refers to your last conversation.
- **Stack:**
  - Next.js 16, React 19, three.js 0.186 (cel-shaded look adapted from *sakura-crossing*, MIT).
  - Speech from [Sarvam AI](https://www.sarvam.ai): **bulbul:v3** TTS, **saaras:v4** STT, **sarvam-105b** LLM.
  - **Supabase** handles auth and progress.
  - Neighbourhoods are rebuilt from **OpenStreetMap** data.
- **Repo history:** created 26 Jul 2026 (10:59 AM IST); last push 3 Nov 2026 (10:14 PM IST).
- **License:** none. The repo has **no license file** (GitHub API `license: null`).
- **Authors (README credits):** [ahmedfahim21](https://github.com/ahmedfahim21), [Parth Mittal](https://github.com/mittal-parth), [Apoorva Agrawal](https://github.com/imApoorva36), [Mardav Gandhi](https://github.com/marcdhi).

## 1. Permissions and credits (do these first)
- [ ] **Get the permission in writing.** Parth (owner) has verbally allowed Saurabh to build a VR version. Ask for the permission by email or in a GitHub issue. Better still, ask the authors to add a license such as **MIT** to the repo. Until a license exists, all rights are reserved by default and only the explicit permission covers the port.
- [ ] Get consent from **all four authors**, or confirm Parth can grant it for the team ⚠ (an open question, not established).
- [ ] **Credit all four authors** in the app's credits, the Devpost description and the repo README.
- [ ] Credit **Sarvam AI** for the speech and LLM models, as the original README does.
- [ ] **OpenStreetMap:** map data © OpenStreetMap contributors, under ODbL 1.0 ([osm.org/copyright](https://www.openstreetmap.org/copyright)). Show the attribution in-app (e.g. on the credits panel) and keep derived map data under ODbL terms.
- [ ] Keep the MIT notice for the *sakura-crossing* shader/look if you reuse it.
- [ ] **Competition rules:**
  - The project must be original to the entrant, or properly licensed ([rules §4.10–4.12](https://start-developer-competition-26.devpost.com/rules)), and Meta may ask for written proof of license ([rules §4](https://start-developer-competition-26.devpost.com/rules)). Written permission is therefore needed, not just nice to have.
  - Consider adding the original authors as Devpost teammates ⚠ (my suggestion; each must meet eligibility).

## 2. Division and rule fit
- **Division:** **Adapted / Significantly Updated Experience.** Sadak existed before 24 Sep 2026. Examples of qualifying updates include "implementing Hand Interactions as a new feature" and "introducing a mixed reality (MR) interaction mode" ([rules §4](https://start-developer-competition-26.devpost.com/rules)). The Devpost entry must summarise the new features; screenshots and a changelog are recommended.
- **Track:** Entertainment or Gaming (a learning game). Productivity is a weaker fit ⚠.
- **Hands-first is mandatory.** The whole experience must be completable without a controller, so every step needs a hands path. Voice can't be the *only* path ⚠: mic-only steps would fail anyone who can't or won't speak, and the rules test is "complete the entire experience" with hands.
- **No brands or logos** (Rule 4(19)): check signage, shop names and vehicle liveries generated from OSM tags. **No identifiable people** (4(17)).
- **Not a thin wrapper:** the game logic, maps and lessons are Sadak's own, so it passes the "take it away" test for Sarvam ([rules §4](https://start-developer-competition-26.devpost.com/rules)).

## 3. Technical path: WebXR / IWSDK
Sadak is already three.js, so the shortest route is **WebXR on a hosted URL**, either IWSDK or three.js + WebXR directly. Setup is in [setup/iwsdk-webxr.md](../setup/iwsdk-webxr.md) and the kit has a verified starter in [templates/iwsdk-starter](../templates/iwsdk-starter/KIT-NOTES.md).

- **Option A (smaller change):** add a WebXR session to the existing Next.js/three.js renderer (`renderer.xr.enabled`, a hands input profile, an Enter VR button). Keep Supabase and the Sarvam API routes on Vercel.
- **Option B (cleaner XR):** a new IWSDK app that re-implements one district scene and calls Sadak's lesson data and API routes. This gives you IWSDK grabbing, IWER emulator testing and spatial UI ([iwsdk.dev](https://iwsdk.dev/)). IWSDK uses `super-three`; check compatibility with the existing three.js code ⚠.
- **Host:** Vercel, as Sadak already uses. Keep the `Permissions-Policy: xr-spatial-tracking=*` header from the template's `vercel.json`. **Mic access:** the browser must allow microphone use in an immersive session on Quest Browser ⚠ (untested; check on device).
- **Seated framing:** the player sits; the street moves past or they teleport between errand spots. No smooth locomotion, to protect comfort.

## 4. Hands-only alternatives for every voice step
| Errand step (today: voice) | Hands path (required) | Voice (optional bonus) |
|---|---|---|
| Hail an auto | Raise a hand / wave gesture toward the road; the auto pulls up | Say the phrase |
| Order at a food stall | **Point** at items on the stall, pinch to select; poke the quantity | Speak the order |
| Pay | **Hand coins/notes** to the vendor: grab from a pouch, drop in their palm | — |
| Talk to a character | **Pinch-to-talk** (hold pinch = push-to-talk) for voice users; non-voice users pick the correct reply from 2–3 floating phrase cards in script + romanisation | Spoken reply scored by saaras STT |
| Learn the phrase | Poke a phrase card to hear bulbul TTS; trace the script with a fingertip (optional) | Repeat aloud |
| Temple offering, bus ticket | Grab the object and place it on the counter/plate | Speak the request |

Design notes:
- Choosing a reply card is a recognition exercise, not production. Label it honestly and keep word-by-word speech scoring as the "hard mode" ⚠.
- Hit targets ≥48 dp; keep cards ~1 m away and slightly low, inside a narrow FoV. Show captions for every NPC line, which the script and romanisation already provide ([accessibility-and-pitfalls.md](accessibility-and-pitfalls.md)).
- The system reserves the palm-pinch gesture on Quest, so don't use it for pinch-to-talk ([WebXR Hands](https://developers.meta.com/horizon/documentation/web/webxr-hands)).

## 5. Performance: one street per district
- Rules require ≥60 fps on Quest 3/3S ([VRC.Quest.Performance.1](https://developers.meta.com/horizon/resources/vrc-quest-performance-1/)). Whole OSM neighbourhoods are too heavy for a mobile GPU ⚠.
- **Trim each district to one street**: the errand stalls plus a facade backdrop. Bake the cel-shading, merge and instance the buildings, use low-poly vehicles, cap draw calls, and use fixed foveation.
- Start with **one district (e.g. Chandni Chowk, Hindi)** done fully. Add more only if the frame budget holds, profiled on device.
- Preload TTS for scripted lines, so you don't stack network latency on frame time. Only the return-visit LLM line needs a live call.

## 6. Mixed-reality option (judging bonus)
Passthrough is judged as "purposeful" only when the real room changes the experience ([rules §6](https://start-developer-competition-26.devpost.com/rules)). One idea: the stall counter snaps to your **real desk** (MRUK plane), so coins and items sit on your actual table while the street opens up beyond it ⚠ (idea only; adds MRUK work).

## 7. Awards fit
- **Reason to Come Back** (special award: "visible growth between sessions, a loop that pulls the user back tomorrow"; [special awards](https://start-developer-competition-26.devpost.com/details/special-awards)). Sadak's **returning-character memory** and per-district progress fit this directly. Add a streak or a phrasebook that fills up.
- **Accessibility angle:** learning through your own language, plus the hands-only path.

## 8. Competitive landscape (generic, no 2026 names)
- **Language learning is a contested lane in 2026.** Several public 2026 entries teach languages or phrases, and education/training as a whole is crowded at 100+ entries ([submissions-2026-aggregate.md](submissions-2026-aggregate.md)).
- **Sadak's edge:**
  - **Indian cities and 10 Indian languages**, rebuilt from real OSM streets.
  - Learning *through* any of those languages.
  - Characters with memory.
  - Native-quality Indic TTS/STT.
- Lead the video with a recognisable Indian street and a hands-only errand in the first 10 seconds.

## 9. Scope for the deadline (Thu 19 Nov, 1:30 AM IST)
That is under 30 hours from now, so the realistic scope is **one district, one street, 2–3 errands, hands-only with optional voice, deployed on Vercel, plus a video under 3 minutes**. Everything else goes in "future plans" on the Devpost form.

# Judging map: Sadak VR

Meta VR Start Developer Competition 2026 · **Adapted / Significantly Updated** division (SADAK, the web game, predates 24 Sep 2026) · Entertainment or Gaming track. Target special awards: **Reason to Come Back**, Accessibility Forward.

## Faithful to SADAK
- **Errands:** SADAK's six Purani Sadak errands, in its pack order, with its titles, briefs, rewards (₹1,320 in all) and completion notes.
- **Lessons and levels:** its Hindi lessons at all three levels, verbatim, with its level ramp. Your starting level (default Medium) sets the first errand; each later errand gets harder.
- **Dialogue:** SADAK's loop.
  - The vendor's line in Devanagari, romanisation and meaning.
  - Your line to say back, as romanised words.
  - Hold the mic and speak; each word is coloured green, yellow or red by SADAK's aligner, and any score above 0 passes.
  - "Continue", "Try again", "Hear correct pronunciation".
- **Rides:** after the auto deal, Raju drives you to the next errand. The bus pulls in, the conductor sells the ticket at the door, and you ride on. These are SADAK's rides.
- **Rewards and HUD:**
  - The Errands card ("N of 6", the current errand highlighted, ticks with completion notes), ₹ and XP.
  - The first-meeting card ("AUTO - AUTO DRIVER").
  - The "Done: …" toast.
  - The finale: "PURANI SADAK SURVIVED", "₹1,320 earned in Chandni Chowk", "Keep exploring".
- **Audio:** SADAK's procedural Delhi qawwali (raga Kafi, keherwa, 116 bpm), ducked to silence in dialogue; its SFX on the same events; its street ambience (autos' pip-pip, bus bray, crowd, temple bells, the azaan at prayer times).
- **City:** built by SADAK's own code (its `buildWorld`, unmodified) from its OpenStreetMap district map. That gives every building and plot, the roads, the Jama Masjid, Sis Ganj Sahib, the Central Baptist Church, Sunehri Masjid and the Gauri Shankar temple, markets, street furniture, traffic, the crowd, animals, pigeons and the barber shop, under its sky, lights and cel shading.
- **Hosts:** real human bodies (MakeHuman, CC0) with five-finger hands, a jaw that moves when they talk and eyelids that blink, wearing SADAK's `attireFor` clothes. SADAK's own people are built from primitives, which looks broken at 0.7 m. Each host stands where SADAK's engine puts them. The flower seller is in the Gauri Shankar temple and the caretaker is in the Jama Masjid courtyard. The two shop errands have SADAK's stall beside them. Raju waits beside his parked auto. Every vendor wears what SADAK's `attireFor` gives them.

## New in VR (the "significant update")
1. **Mixed reality:** your real table becomes the stall counter. Old Delhi grows out of it from passthrough, inside a glowing marigold sphere.
2. **Hands-first:** touching your line says it for you, so every step completes without speaking (SADAK needs a microphone).
3. **Errands you do with your hands:**
   - raise a hand to hail Raju at his parked auto;
   - pinch rupee coins onto the vendor's plate (overpay and he hands one back);
   - pinch garlands off the counter;
   - pick up a hot kachori and take a bite.
4. **Seated comfort:**
   - Rides happen in a cabin (auto, bus, cycle rickshaw), which gives you a still frame to look at while the street moves.
   - Speed and turning are capped.
   - Your real hands show over the virtual street.
5. **Memory:** vendors greet returning players with a line about last time. SADAK writes this live with sarvam-105b; here it is scripted, so it works offline.

## The first two minutes
| Time | What happens |
|---|---|
| 0–15 s | Passthrough. A marigold outline finds your table: "Pinch to open your stall here." |
| 15–25 s | **Awe moment:** Chandni Chowk grows out of your table until the room is gone. "सड़क · Chandni Chowk". The qawwali starts. |
| 25–40 s | Raju's green-and-yellow auto is parked beside you, with Raju at your table. "Raise a hand high to hail Raju's auto": he waves. "AUTO - AUTO DRIVER: Stop the auto". |
| 40 s–2 min | "कहाँ जाना है?" You touch (or say) "Nayi Dilli railway station", +pts, Continue… The fare is agreed and Raju drives you through the street to Vikram's kachori stall. |

## Criteria (25% each)
- **Innovation:** learning a language by doing a real Delhi morning with your hands, on your own table, in a street rebuilt from OpenStreetMap.
- **Experience design:**
  - One world at a time.
  - Every line in three tiers; captions everywhere, so it works muted.
  - SADAK's level ramp.
  - No settings screen in VR; the level is chosen on the title panel.
  - A two-hand pinch held 1.5 s re-places the counter.
- **Technical:**
  - IWSDK 1.1.0 with ECS components and the stock interaction components: RayInteractable and PokeInteractable for your line, the mic and the UIKit panels; OneHandGrabbable for the coins.
  - UIKit panels for the HUD and buttons; Canvas2D for Devanagari.
  - SADAK's engine runs inside IWSDK, unchanged. VR-only layers on top of it: a per-fragment reveal shader added to each of SADAK's materials; its grade and haze moved into the materials (a full-screen pass per eye costs too much on a Quest); inverted-hull ink lines instead of its post-pass ink; and a draw distance (proxies for instanced meshes, layer culling) that brings 3M triangles and 560 draw calls down to 0.13–0.36M and 66–160 per view. SADAK's own building-detail radius is lowered from 105 m to 55 m. Rides move the street along the real road graph.
  - Sarvam bulbul:v3 voices baked into static clips; saaras:v4 scoring through a serverless function.
- **Polish:** see `docs/TESTING.md` (unit checks, a full emulator journey through all six errands, the headset checklist).

## Honest gaps
- One district (Chandni Chowk, Hindi) of SADAK's ten.
- Base-language meanings are English only; SADAK offers 11 base languages.
- Rides compress the real 200–600 m between stalls into about 16 s, with a short reveal cut.
- Raju and the conductor ride as posed figures (now real bodies).
- Our own stall enclosures (awnings, shop bays, boards, the chai tarp, a second bus shelter) are gone. In SADAK the host stands in the open street. Only the counter at your real table and the goods you use remain.
- Ink lines are inverted hulls (buildings, landmarks and stalls within 30 m), not SADAK's screen-space edge pass. The grade is per material.
- Rides use our own route player on SADAK's road graph, not SADAK's `rides.ts`. There are no waypoint arrows or minimap; the flow takes you from errand to errand.
- Voice needs a Sarvam key on the deployment.

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
- **Look:** SADAK's cel-shaded street with ink outlines, built from its OpenStreetMap data, with the red sandstone Jama Masjid.

## New in VR (the "significant update")
1. **Mixed reality:** your real table becomes the stall counter. Old Delhi grows out of it from passthrough, inside a glowing marigold sphere.
2. **Hands-first:** touching your line says it for you, so every step completes without speaking (SADAK needs a microphone).
3. **Errands you do with your hands:**
   - raise a hand to stop the auto;
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
| 25–40 s | "Raise a hand high to stop an auto." Raju's green-and-yellow auto pulls up beside you. "AUTO - AUTO DRIVER: Stop the auto". |
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
  - A per-fragment reveal shader, inverted-hull ink outlines, and rides that move the street along the real road graph.
  - Sarvam bulbul:v3 voices baked into static clips; saaras:v4 scoring through a serverless function.
- **Polish:** see `docs/TESTING.md` (unit checks, a full emulator journey through all six errands, the headset checklist).

## Honest gaps
- One district (Chandni Chowk, Hindi) of SADAK's ten.
- Base-language meanings are English only; SADAK offers 11 base languages.
- Rides compress the real 200–600 m between stalls into about 16 s, with a short reveal cut.
- Raju and the conductor ride as posed figures.
- Voice needs a Sarvam key on the deployment.

# Testing Sadak VR

## Automated (Linux, no headset)
| Command | What it covers |
|---|---|
| `npm test` | Pure logic in node (esbuild bundle): SADAK's pack order, titles, the ₹1,320 total, rides, finale text; 6 errands × 3 levels with 3/5/7 steps; one payment per shop errand; serve/pick; SADAK's level ramp; three tiers per line; TTS clip ids; word scoring; save. |
| `npm run typecheck` | TypeScript. |
| `npm run test:xr` | SADAK's whole day in the IWSDK emulator with emulated hands, through IWSDK's interaction components. It covers placement, the reveal, hailing Raju at his parked auto, the first-meeting cards, every line said by poking it, the UIKit "Continue" button, the auto ride to the next errand, paying with grabbed coins (and overpaying for change), picking garlands, the bus, the finale (PURANI SADAK SURVIVED, ₹1,320), "Keep exploring" and the vendor remembering you. `XR_LEVEL=easy|medium|hard` (default easy for speed). Needs `npx @iwsdk/cli dev up --ai-mode agent` on port 8086. |
| `npx @iwsdk/cli browser run tools/sadak-check.mjs` | Inventory of SADAK's city as built in VR: every world group (buildings, landmarks by name, markets, traffic, crowd, animals, pigeons, rails, boundary), the barber shop, the stalls, ink hulls and cull proxies. |
| `VIEW='{"spot":"minaret","pos":[0,0.47,0.5],"look":[0,0.35,-3],"hideUi":true}' npx @iwsdk/cli browser run tools/view.mjs` | Puts the desktop camera at a spot (anchor-local metres) and reports draw calls and triangles; take a screenshot after. |
| `python3 scripts/e2e/review.py` | Review shots from a seated adult's pose (eyes 1.2 m, −14°): your turn, the result row, the Errands HUD. |

Never edit `src/` while `test:xr` runs (hot reload ends the XR session).

### Dev keys (desktop or emulator, dev builds only)
`1` say your line by touch · `space` Continue / skip · `r` Try again · `h` hear correct pronunciation / hail the auto · `v` mic on/off · `p` put exact change on the plate · `g` take a garland · `l` cycle level · `n` restart · `m` mute · `Shift+R` clear progress and reload.

## Only a headset can prove (tick on a Quest 3 / 3S)
- [ ] 72 fps (60 floor) during the reveal and at the busiest stall view (perf overlay / `hz-perfetto-debug`). SADAK's city on the desktop emulator: 66–160 draw calls and 0.13–0.36M triangles per view at the six spots. If the frame rate drops, the levers are `DETAIL.near` (55 m, SADAK's own detail radius, 105 m on desktop) and the radii in `sadak-city.ts` and `city-cull.ts` (crowd 40 m, traffic 60 m, buildings 130 m, ink 30 m).
- [ ] Real table found in two different rooms; the virtual-counter fallback when there is none.
- [ ] Poke: your line and the UIKit buttons press on a deliberate push, never while reaching for coins; the mic works as hold-to-speak (finger in the orb, or pinch-hold on its ray).
- [ ] Coin grabs with real hands: IWSDK's near grab takes the coin nearest your palm; coins sit 7 cm apart in a row. Check the coin you reach for is the one you get.
- [ ] Rides: comfortable in the cabin (no nausea) for 16 s; the reveal cut mid-ride reads as a scene change, not a glitch.
- [ ] Hail detection (palm above head) doesn't trigger while you scratch your head.
- [ ] Hands visible over the street (IWSDK hand visuals and depth occlusion on cards and coins).
- [ ] Devanagari legible at the real distance (dialogue about 0.85 m, cards about 0.5 m).
- [ ] Sarvam clips play in Quest Browser; the mic permission prompt on Enter; STT round trip under 2 s on Wi-Fi.
- [ ] System-menu pause and resume; headset off and on.
- [ ] Production URL logged out, on the headset.

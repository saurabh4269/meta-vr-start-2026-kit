# Street world: integration notes for the director

> **Update (17 Nov):** the city is no longer our rebuild. `buildStreet(renderer)` now runs SADAK's own engine, vendored unmodified in `src/sadak-engine/` (see `src/world/sadak-city.ts`). The per-spot neighbourhoods (`layout.ts` buildHood, `buildings.ts`, `mosque.ts`, `life.ts`, `sky.ts`) are gone.
>
> The kachori, flowers, paranthe and minaret counters now stand where SADAK's `engine.ts` stands each host: the map's task spot, or `innerNear` (inside the temple or mosque) for a temple errand. The user faces the host from SADAK's spot yaw, or the nearest clear side. The auto and bus keep the kerbside spots below.
>
> Vendors wear SADAK's `attireFor` clothes. The auto spot's host is now Raju, and `AutoRig.park()` stands his auto beside the user with the seat empty. The tables below are otherwise historical.

`src/world/street.ts` exports `buildStreet(): StreetWorld` and implements
`src/world/types.ts`. The street is SADAK's Old Delhi (Purani Sadak) rebuilt
on the real street network: every spot stands where SADAK puts its errand on
its OpenStreetMap-derived map, with its own neighbourhood round it (Chandni
Chowk's red sandstone carriageways with the median of planters and heritage
lamps, Dariba Kalan, Paranthe Wali Gali, Netaji Subhash Marg with the Red
Fort's wall across the road, the Jama Masjid's east stair), cel-shaded, with
dark ink outlines, a warm golden-hour sky and haze. Six spots turn the real
table into a counter, and `ride()` carries the user between them in a cycle
rickshaw, Raju's auto or the bus.

## Contract changes (this pass)

```ts
export type SpotId = 'kachori' | 'flowers' | 'auto' | 'paranthe' | 'bus' | 'minaret';
export type RideKind = 'rickshaw' | 'auto' | 'bus';
export interface RideHandle { readonly progress: number; readonly done: boolean; skip(): void }
// StreetWorld:
bus: AutoRig;                              // the bus pulls in beside the user / drives off
ride(to: SpotId, kind: RideKind): RideHandle;
```

Everything else is unchanged.

## Spots

| Spot | Where (SADAK map, metres, +x east, +z south) | Vendor (rig) | Counter | Goods (`items`) | `plate` |
| --- | --- | --- | --- | --- | --- |
| `kachori` | (3.45, -312.0), west edge of Dariba Kalan 4 m from Chandni Chowk; user faces west, the boulevard on the user's right | Vikram, kurta pyjama, orange towel, 1.72 m (eye 1.58 m leaning) | turquoise counter, steel top, shop bay "कचौड़ी भंडार", orange awning | 3 kachoris on leaf plates | brass thaali |
| `flowers` | (221.2, -304.5), Chandni Chowk south frontage beside the Gauri Shankar temple (on the user's right) | Sunita, red sari, 1.65 m (eye 1.52 m) | marigold stall, red awning, board "फूल माला" | 3 marigold garlands | brass thaali |
| `auto` | (-3.9, -100.7), west edge of Dariba Kalan; user faces north up the lane | the chai-stall man, kurta, red towel, grey hair, 1.66 m (eye 1.53 m). **Raju is the auto's driver** (`auto.root.getObjectByName('auto-driver')`, same look as before) | chai table under a blue tarp, "कड़क चाय" | none | steel tray |
| `paranthe` | (-278.9, -326.1), west side of Paranthe Wali Gali 10 m in from Chandni Chowk (on the user's right); a 4.5 m lane | Mohan, cream kurta, purple towel, moustache, 1.68 m (eye 1.55 m), voice vijay, colour 0xb05cff | steel-topped counter: tava on a burner with two paranthas frying, rolling board and pin, a stack of paranthas, three steel bowls of chutney (mint, chilli-garlic, tamarind), white butter; purple awning, board "पराँठे वाले" | 3 folded paranthas on steel plates with butter and achaar | brass thaali |
| `bus` | (281.4, -91.1), west footpath of Netaji Subhash Marg at the Lal Quila stop; user faces north, the road on the right, the Red Fort's wall across it | Suresh the conductor, blue-grey shirt, leather ticket bag, 1.71 m. **Not at a desk:** he rides in the bus's rear door and is only visible while the bus is there | the stop's sandstone ledge (newspaper, water bottle), the shelter "लाल क़िला", stop sign | none | steel tray (his ticket tray) |
| `minaret` | (72.4, 277.0), 7 m east of the foot of the Jama Masjid's east stair, facing up it | Imran the caretaker, white kurta pyjama and topi, teal shawl, beard, 1.70 m (eye 1.56 m), voice shubh | wooden desk with a green cloth, ledger and pen, ticket roll, brass bell; "टिकट" board; a shoe rack (shoes off before the stair), a water pot | none | brass thaali |

Counter conventions are as before for all six: top 2.5 mm below the anchor
origin, user edge at `z = +0.20`, back edge `z = -0.49`, 1.42 m wide
(`kachori`, `flowers`, `paranthe`) or 1.30 m (`auto`, `bus`, `minaret`); the
vendor's `root` at counter-local `(0, -tableHeight, -0.66)` facing +Z (except
Suresh, below). Item and plate positions (counter-local x, z; origins at the
base on the counter top):

| Spot | items | plate |
| --- | --- | --- |
| `kachori` | (-0.17, -0.06), (0, -0.06), (0.17, -0.06) | (0.10, -0.34) |
| `flowers` | (-0.17, -0.07), (0, -0.07), (0.17, -0.07) | (0.18, -0.34) |
| `auto` | none | (0.16, -0.33) |
| `paranthe` | (-0.17, -0.06), (0, -0.06), (0.17, -0.06); steel plate r 0.088 m, parantha r 0.066 m, 3 cm tall | (0.20, -0.35) |
| `bus` | none | (0.16, -0.33) |
| `minaret` | none | (0.16, -0.33) |

The area round (0.38, -0.14), where the director puts plates, is kept clear
at every counter (the kachori kadhai moved back to (0.50, -0.38) for this).

### Vendors

Unchanged behaviour (breathing, weight shift, blinks, look-at, talk, all six
gestures, idle chores). New chores: Mohan rolls out dough, Suresh and Imran
fiddle with tickets (two-hand work at the counter's middle). Hero rigs now
have four fingers of three segments each, relaxed in a slight curl, instead
of the mitten.

### The bus and Suresh (`street.bus`, `spots.bus`)

- A generic green city bus, no operator's name or logo, cream window band,
  white roof with an AC pod, Devanagari route board "कश्मीरी गेट" front and
  side, both doors on the kerb side standing open. One skinned mesh (body and
  four wheel bones). 11.2 m long, 2.5 m wide.
- `arrive()`: appears 34 m behind the user along Netaji Subhash Marg and
  pulls in, swinging in to the kerb and braking, in **3.4 s**; stops with its
  centre at counter-local `(2.4, -tableHeight, -1.6)`, so its **rear door is
  level with the user** (`z = 0`) and its side is 0.5 m right of the table's
  right edge. `parked` turns true at the stop. Idling shiver while parked.
- `leave()`: pulls away along the road, 50 m in **3.2 s**, then hides.
- `spots.bus.vendor` is Suresh standing on the rear door's step (0.36 m
  up), facing the user. His `root` is a child of the bus (bus-local
  `(1.02, 0.36, -1.6)`), so he arrives and leaves with it and is hidden while
  the bus is away. His IK uses the user's table as the counter, so `offer`
  puts his palm about 0.25 m right of the table's right edge, `receive`
  likewise. Talk to him only after `bus.parked`.
- The auto works as before (2.2 s in, 2.2 s out, stops at `(1.65, 0.15)`), but
  both vehicles now follow the real road through the spot (Dariba Kalan, NS
  Marg), bends included, instead of a straight line.

## Rides (`street.ride(to, kind)`)

The user stays put; the street moves. `ride` finds a route through the road
graph (OSM junctions, roads weighted by length and by how well the vehicle
suits them; SADAK's `world/route.ts` approach), keeps 1 m left (1.6 m for the
bus), rounds the corners and gives it a speed profile: rickshaw 2.5 m/s,
auto 6 m/s, bus 5 m/s, acceleration and braking at most 0.9 m/s², speed
lowered on curves so the yaw rate stays under 18°/s, and the user's heading
itself rate-limited to 18°/s. No pitch or roll; a tiny idle shake on the
cabin (auto engine, bus engine, the rickshaw over the setts).

Timeline (all inside the one call; poll the handle):

1. 0 to 0.6 s: the reveal closes in to 2.6 m round the user (marigold edge),
   on top of whatever radius the director has set.
2. At 0.6 s, under cover: the `from` counter and vendor vanish, any parked
   auto/bus at `from` is taken away (the ride uses it), the cabin appears,
   the street drops by the vehicle's floor height and is posed at the start
   of the route (beside the stall, or where the auto/bus stood). The reveal
   opens over 0.6 s while the vehicle pulls away.
3. Leg 1: about 6 s out of the `from` neighbourhood.
4. A cut: the reveal closes and opens again (1.2 s) while the vehicle keeps
   moving; the neighbourhood switches to `to` and the vehicle is placed on
   the same route about 8 s short of `to`. (The 200 to 600 m in between are
   skipped; every spot's neighbourhood is built separately.)
5. Leg 2: into `to`, braking to a stop at the kerb nearest the counter.
6. Hold 0.4 s, close, then exactly `setActive(to)`: the cabin goes, the `to`
   counter and vendor appear, the street is back at table height. Open.
   `done` turns true.

Measured totals (`progress` runs 0 to 1 over these):

| Ride | Leg 1 | Leg 2 | Total |
| --- | --- | --- | --- |
| `kachori` → `flowers`, rickshaw | 11.5 m, 7.1 s | 16.5 m, 8.0 s | 17.3 s |
| `flowers` → `auto`, rickshaw | 11.5 m, 6.0 s | 16.5 m, 8.0 s | 16.2 s |
| `auto` → `paranthe`, auto | 10 m, 4.7 s | 16 m, 9.9 s (two lane corners) | 16.8 s |
| `paranthe` → `bus`, rickshaw | 11.5 m, 8.3 s | 16.5 m, 8.0 s | 18.5 s |
| `bus` → `minaret`, bus | 16 m, 6.0 s | 26 m, 8.0 s | 16.2 s |

`skip()` jumps to the end (same as step 6). `setActive()` during a ride
cancels it. `ride(active, …)` returns a handle that is already done.

Cabins (rest frames, built in the user's frame round the real table, so the
table becomes part of the vehicle and nothing ever passes through it):

- **rickshaw**: the passenger seat, armrests, a canvas half-dome hood behind
  and over the head with its bow, the front board over the table, the puller
  on his saddle 1.2 m ahead pedalling (cadence follows the speed) and leaning
  into turns, the frame bar and front wheel, the rear wheels turning beside
  the user's knees. The road is 0.5 m below the real floor.
- **auto**: the passenger bench, yellow canopy and rear curtain, chrome grab
  bars on both open sides, green tub, the driver's seat back over the table,
  **Raju** (same look as the auto's driver) 1 m ahead with his hands on the
  handlebar, steering into turns and glancing about, the windscreen frame with
  a marigold string and a lemon-chilli charm. Road 0.32 m below the floor.
- **bus**: a kerb-side window seat, the seat back in front over the table
  with a grab rail, rows of seats ahead on both sides, window frames without
  glass, roof light strips, handrails and poles, two seated passengers,
  **Suresh** standing in the aisle 1 m ahead holding the rail, his ticket bag
  at his hip. Road 0.42 m below the floor.

## Ink outlines

SADAK draws ink with a full-screen post pass; here every outline is an
**inverted hull merged into its parent's geometry**, so outlines cost no draw
calls at all, only triangles:

- `kit.ts inkShell()`: a copy of the part with its winding reversed (only
  the far side survives back-face culling), each vertex carrying a mitred
  outward direction (the distinct normals meeting at that welded position,
  averaged and stretched so the shell is equally thick off every face) and an
  `ink` attribute = its fade distance. `Parts.ink` / `RigBuilder.ink` turn
  shells on for whatever is added while set; `inkOnly()` adds a closed hull
  for an open-backed facade slab.
- `cel.ts`: one shared shader path for every street material. Ink vertices
  are pushed out by `clamp(0.0022 x distance, 1.1 mm, 0.3 m)` (constant on
  screen, about 2.5 px on Quest 3), fading to nothing between 0.6x and 1x
  their fade distance, and pushed 2x that back along the view ray so the
  shell never fights the surface in front of it. Ink fragments go through the
  same reveal discard, fog and marigold edge as everything else; on
  double-sided materials the near half of the hull is discarded. Colour
  `#2a1a12` (`U.uInkColor`), width `U.uInkWidth`.
- What is inked (fade distance): vendors and the cabin people (30 m), crowd
  (26 m), counters and their dressing, the stalls and cabins (22 m), goods
  and plates (6 m), the auto, bus, rickshaws and parked vehicles (45 m), the
  masses of the nearest ten terraces and the spot's own building, real OSM
  footprints within 40 m, the median lamps and planters (42 m), the Jama
  Masjid's plinth, walls, gates, hall, domes and minarets (420 m). Not inked:
  faces, buttons, jewellery, window frames, grilles, signs and other painted
  or thin trim.

## The Jama Masjid

Ported from SADAK's `world/mosque.ts congregationalMosque` with its Delhi
style, at SADAK's position and size (centre (-0.9, 282), turned 1.638 rad so
the east stair faces east, 130 m square): red sandstone on a 5 m plinth with
blind arcades round it, the 30 m wide east stair with its cheek walls, side
stairs to the north and south gates, arcaded cloisters with crenellations,
the east gate's pishtaq framed in white marble with roundels, arched windows,
guldastas, five kiosks and a striped onion dome, corner pavilions, the hauz
in the court, the prayer hall with eleven marble-framed bays round the tall
pishtaq, three **white marble onion domes striped in black** on drums with
gold finials, and two **striped minarets** with three balconies and domed
kiosks. At the `minaret` spot it is in full (about 60k triangles with its
ink); from the other spots a 1.5k-triangle silhouette stands at its true
bearing, drawn in to 150 m and enlarged so the domes and minarets clear the
nearer roofs, with the skyline left open in that direction.

From Imran's desk the east gate and stair fill the view (the gate's top is
about 30 m up, 18 m away); the hall's domes are hidden behind the gate, as
they are on the real stair. The `masjid-cover` shot shows the whole complex
from SADAK's cover angle.

## Street layout from OpenStreetMap

- Data: `src/world/osm-data.ts`, **generated** by
  `node tools/world/osm-extract.mjs <path to purani-sadak.json>` from SADAK's
  compiled map `sadak-source/game_engine/public/maps/purani-sadak.json`
  (built by SADAK's `scripts/osm/build.ts` from OpenStreetMap). It keeps what
  lies within 165 m of the six spots: 285 roads with their real widths and
  footpaths, 1,922 frontage and back-lot plots, 145 real building footprints,
  parks and plazas, and the landmarks.
- **Map data © OpenStreetMap contributors (ODbL)**,
  https://www.openstreetmap.org/copyright. The extract is a derived database
  of OSM data and is distributed under the ODbL 1.0.
- `src/world/layout.ts` builds each spot's neighbourhood: a ground of lane
  setts sinking gently away from the spot (so paving laid on it never shares a
  depth with it far away, the near plane being 1 mm); Chandni Chowk's two
  8 m red sandstone carriageways, its sandstone pavements and the raised
  median between them with heritage lamps and planters every 13 m, built from
  the pair of OSM ways; Netaji Subhash Marg in tarmac with a dashed centre
  line, kerbs and raised footpaths; pedestrian streets in sandstone; poles and
  sagging wires over the lanes; every plot as one of SADAK's terraces (full
  detail for the nearest ten within 24 m, painted windows and real masses to
  40 m, painted boxes to 104 m, back-lot blocks to 60 m; party walls painted
  with storeys); real OSM footprints extruded with painted storeys, a shop band
  and a flat roof; Gurdwara Sis Ganj Sahib (SADAK's `gurdwara`, down Chandni
  Chowk from the kachori stall); the Gauri Shankar temple; the Red Fort's
  curtain wall with bastions and chhatris across the road from the bus stop;
  parked rickshaws, scooters and autos. A ring of hazy skyline blocks and
  clouds stands beyond (146 to 175 m).
- Spots are 100 to 600 m apart, so each has its own neighbourhood and only
  the active one is shown (`setActive`, and the cut in a ride).

## Performance (Quest 3 budget: 60 draw calls, 150k triangles)

`renderer.info.render` after one frame in the preview, seated eye view, with
frustum culling switched off for everything (`budget=1`), outlines included:

| View | draw calls | triangles |
| --- | --- | --- |
| Seat, `kachori` | 26 | 142,984 |
| Seat, `flowers` | 26 | 127,862 |
| Seat, `auto` (auto away / parked with Raju) | 21 / 23 | 99,674 / 113,702 |
| Seat, `paranthe` | 26 | 107,344 |
| Seat, `bus` (bus away / parked with Suresh) | 20 / 22 | 81,758 / 91,834 |
| Seat, `minaret` | 21 | 116,793 |
| Ride, rickshaw out of `kachori` | 22 | 118,682 |
| Ride, auto out of `auto` | 20 | 95,628 |
| Ride, bus out of `bus` / arriving at the masjid | 22 / 22 | 94,558 / 121,127 |

Each view draws: the neighbourhood (near and far, 2 calls), skyline, sky,
the counter's dressing, its items and plate (up to 4), the vendor, 8 walkers
and 3 standers, the cycle rickshaw and its puller, pigeons, kites, contact
shadows, plus the auto (and Raju) or the bus (and Suresh), or during a ride
the cabin and its people. Triangle shares at `kachori`: neighbourhood about
95k (terraces 55k, roads and ground 14k, shop and parked vehicles 10k,
landmarks and the masjid silhouette 4.5k), counter and goods 23k, people 25k.

- Build: `buildStreet()` builds all six neighbourhoods, 1.5 to 2.4 s on a
  desktop CPU (several times that on Quest): build it during loading.
- Fog is lighter than before (40 to 230 m, at most 0.6) so the masjid and the
  ends of the streets keep their colour.

## What the director must do differently

1. **Raise the camera near plane** if you can (`near: 0.02`); the street
   tolerates 1 mm (sinking ground, ink pushed back, no coplanar overlaps) but
   far facades shimmer less with a larger near plane. `far` must stay >= 190.
2. Call `street.update(dt, time)` once per frame (vendors, vehicles, rides,
   crowd, birds, shadows, the reveal centre).
3. During a ride, keep calling `update`; poll `handle.done` (or `progress`).
   The reveal you set still applies; the ride only narrows it further for
   its cuts. Don't call `setActive` during a ride unless you mean to cancel
   it.
4. The auto spot's `vendor` is the chai-stall man; Raju is the driver of the
   auto (not a `VendorRig`, no talk animation). The bus spot's `vendor` is
   Suresh in the bus door: call `bus.arrive()` first.
5. `street.group.userData.world` holds debug hooks (`hoods`, `cabins`,
   `rideInfo()`, `tris()`, materials, lights, atlas); not part of the
   contract.

## Known gaps

- Rides skip the middle of each route (a 1.2 s reveal cut): the real
  distances are 200 to 600 m, too far for 10 to 20 s at the requested speeds.
- The auto's Raju and the bus's conductor in the cabins are posed rigs, not
  `VendorRig`s: they cannot talk or gesture during a ride.
- Buildings are SADAK-style terraces on SADAK's frontage plots; real OSM
  footprints are used where OSM has them (mostly long blocks), extruded flat.
  Party walls are painted, not modelled; back-lot blocks are plain within 60 m.
- The Jama Masjid is 600 m from Chandni Chowk, so from the street spots it is
  a skyline silhouette, slightly enlarged; the real view is blocked by the
  terraces most of the time.
- The Red Fort is only its curtain wall; Sis Ganj Sahib and the Gauri Shankar
  temple are SADAK's generic gurdwara and mandir.
- Crowd walkers loop along walking lines near the spot and pass through each
  other and through the ride vehicle; no avoidance.
- The street has not been profiled on a headset; numbers above are from the
  desktop preview.

## Files

- `street.ts` assembly, the contract, vehicles and rides.
- `layout.ts` the spots' positions and each neighbourhood from OSM.
- `osm-data.ts` the OSM extract (generated); `route.ts` routing and the speed profile.
- `cabins.ts` ride cabins; `mosque.ts` the Jama Masjid, its silhouette, the gurdwara.
- `cel.ts` cel material with ink, grade, fog, reveal; `kit.ts` geometry kit and `inkShell`.
- `atlas.ts`, `buildings.ts`, `people.ts`, `vendor.ts`, `spots.ts`, `props.ts` (auto, bus, rickshaw), `sky.ts`, `life.ts`, `shadows.ts`.
- Dev only: `world-preview.html`, `tools/world/preview.ts`, `vite.preview.config.ts`, `shoot.mjs` (screenshots), `breakdown.mjs`, `probe.mjs`, `pick.mjs` (which mesh is under a pixel), `osm-extract.mjs`.

## Preview

```bash
npx vite --config tools/world/vite.preview.config.ts   # http://127.0.0.1:8096/world-preview.html
node tools/world/shoot.mjs                             # screenshots into artifacts/world/
```

Query parameters: `spot=kachori|flowers|auto|paranthe|bus|minaret`,
`view=seat|vendor|side|wide|street|top|awe|up|cover|ride|rideside`,
`reveal=<m>`, `t=<s>`, `gesture=<kind>`, `talk=1`, `arrive=1`,
`busarrive=1`, `ride=<to>:<kind>` (starts 0.2 s in; `t` is then seconds into
the ride), `table=<m>`, `budget=1`, `dpr=<n>`, `live=1`, `clean=1`. Keys:
1 to 6 spot, q/w/e/r/t view, g gesture, k talk, a auto arrive/leave,
[ ] reveal.

## Credits

- SADAK by ahmedfahim21, Parth Mittal, Apoorva Agrawal and Mardav Gandhi: the
  buildings, props, people, auto, mosque, gurdwara, sky, signage, district
  palette, the compiled map and the routing approach are ported from its
  `game_engine/lib/game` code and `public/maps` data with the owner's
  permission.
- Map data © OpenStreetMap contributors, ODbL 1.0
  (https://www.openstreetmap.org/copyright), via SADAK's compiled map.
- The cel-shaded look (ramp, shadow tint, split-tone grade, painted sky and
  clouds) is adapted from sakura-crossing by Kenton Wang
  (https://github.com/Kenton-GMI/sakura-crossing), MIT License,
  Copyright (c) 2026 Kenton Wang.

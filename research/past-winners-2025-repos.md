# Public source repos for the 2025 Meta Horizon Start winners

*Checked on 16 Nov 2026, evening IST (Asia/Calcutta). Companion CSV: [past-winners-2025-repos.csv](past-winners-2025-repos.csv). Winner write-ups: [past-winners-2025-analysis.md](past-winners-2025-analysis.md).*

Most of the 32 winners shipped as store or studio apps and did not publish their project source. Only **3** still have a public project repo. **2** more have related public code (a gesture library; an IWSDK fork) but not the app itself. **2** GitHub links that were on Devpost during the contest now 404 (The Nanauts entirely; Dun Jun's game repo — its hand-tracking library remains). The other **27** have no public project source that could be verified.

This file names 2025 winners only. It does not name or link any 2026 Devpost submission.

---

## 1. Method

- Read every winner's Devpost page (local HTML in the research workspace, originally fetched from [start-developer-competition.devpost.com](https://start-developer-competition.devpost.com/)) and extracted the **Try it out** / `.app-links` sidebar plus any GitHub, GitLab or Bitbucket URL in the write-up.
- Searched GitHub (repo search, then `gh api` user/org repo lists for identified usernames) by project name, studio name and team-member names.
- Searched the web for the same, and followed official sites linked from Devpost (for example anaglyph.dev, sphericals.io, pack-attack.app, dunjun.world, handcraft.astonishingdev.com).
- Kept a repo only if it still exists (HTTP 200 / `gh repo view`, not 404) **and** the name, README or author clearly matches that 2025 project.
- "Last updated" below is the last **push** (latest commit), converted from GitHub UTC to IST (Asia/Calcutta). Stars and licences are as reported by GitHub on the check date.

Confidence labels:

- **confirmed-from-Devpost** — the GitHub URL was on the 2025 Devpost project page (Try it out or write-up) and the repo still exists.
- **strong-match** — not on the Devpost page itself, but the official site or author README identifies it as this project, and the account matches the team.
- **related-only** — public code from the same team that is not the submitted app (a library or SDK fork).
- **no public repo found** — nothing verifiable after the searches above. A 404 of a previously linked repo is noted.

---

## 2. The useful repos (start here)

These are the ones worth actually opening. Three are the submitted apps; two are adjacent code from winning teams.

| Priority | Repo | Why open it |
|---|---|---|
| 1 | [anaglyphs/lasertag](https://github.com/anaglyphs/lasertag) | Full Unity project for colocated MR laser tag: custom live scene meshing from the Depth API, long-range occlusion, LAN Netcode (Distributed Authority / DAHost), an `operator` branch that matches the contest update. 371 stars. PolyForm Noncommercial 1.0.0. |
| 2 | [SphericalLabs/OpenSoundLab](https://github.com/SphericalLabs/OpenSoundLab/tree/feature/hands) | Open-source MR modular synth (Unity / C#). The Devpost link is the `feature/hands` branch — the contest hand-tracking work. `master` has later Depth API occlusion and other work. Licence is the project's own OSLLv1 (academic/artistic use; no app-store derivatives). 71 stars. |
| 3 | [InventiveOtters/quest-travel-app](https://github.com/InventiveOtters/quest-travel-app) | Complete Spatial SDK / Kotlin contest app (OnTheGoVR): offline local-network cinema, file discovery, 2D and spatial theatre. Small, readable, and written for this competition. No licence file. 0 stars. |
| 4 | [sma1692/haath](https://github.com/sma1692/haath) | Not the Dun Jun game (that Devpost repo now 404s), but the team's MIT-licensed WebXR hand-kinematics and gesture engine, "battle-tested in DunJun": punch/slap velocity gates, bimanual beams, clap hysteresis, 3D circle gestures. The most reusable hand-tracking code from a 2025 IWSDK winner. |
| 5 | [evstinik/immersive-web-sdk](https://github.com/evstinik/immersive-web-sdk) | Not HandCraft XR itself (that source is private; the live toy is still at [handcraft.astonishingdev.com](https://handcraft.astonishingdev.com)). A MIT fork of Meta's Immersive Web SDK that the write-up says was extended for the interaction patterns the game needed. Compare against upstream if you are pushing IWSDK hand interactions. |

**Also useful, but not a winner repo:** Lucas Martinic (Inkphony) publishes separate Quest / PCA experiments, including [Unity-MetaXR-AI-ZeroShot](https://github.com/lucas-martinic/Unity-MetaXR-AI-ZeroShot) (zero-shot object detection on Quest). That is not Inkphony's source.

---

## 3. All 32 winners

| Winner | Prize / track | Devpost | Public source | Engine | Stars | Last push (IST) | Licence | Confidence |
|---|---|---|---|---|---|---|---|---|
| Tiny Golf | Winner, Best Casual Game — $100K | [tiny-golf](https://devpost.com/software/tiny-golf) | no public repo found | Unity | — | — | — | no public repo found |
| Little Critters – Advanced hand tracking update | Runner-up, Best Casual Game — $60K | [little-critters](https://devpost.com/software/little-critters) | no public repo found | Unity, MRUK | — | — | — | no public repo found |
| Le Dino Labo | Honorable mention, Best Casual Game — $30K | [realcast-game-working-title](https://devpost.com/software/realcast-game-working-title) | no public repo found | Unity, Meta XR SDK | — | — | — | no public repo found |
| Saber Punks | Winner, Best Social Game — $100K | [saber-punks](https://devpost.com/software/saber-punks) | no public repo found | Unity, MRUK, Photon | — | — | — | no public repo found |
| FALCON | Runner-up, Best Social Game — $60K | [falcon-shgxn9](https://devpost.com/software/falcon-shgxn9) | no public repo found | Unreal, C++ | — | — | — | no public repo found |
| Pack Attack | Honorable mention, Best Social Game — $30K | [pack-attack](https://devpost.com/software/pack-attack) | no public repo found (companion web app: [pack-attack.app](https://pack-attack.app)) | Unreal + React web | — | — | — | no public repo found |
| DreamSpace | Winner, Best Entertainment Experience — $100K | [dreamspace-6g8rzm](https://devpost.com/software/dreamspace-6g8rzm) | no public repo found | Unity, MRUK | — | — | — | no public repo found |
| Photon | Runner-up, Best Entertainment Experience — $60K | [photon-bm9p31](https://devpost.com/software/photon-bm9p31) | no public repo found | Unity, Android | — | — | — | no public repo found |
| (m)ORPH Mixed Reality Music Experience | Honorable mention, Best Entertainment Experience — $30K | [m-orph-mixed-reality-music-experience](https://devpost.com/software/m-orph-mixed-reality-music-experience) | no public repo found | Unity 6, Netcode | — | — | — | no public repo found |
| Inkphony | Winner, Best Lifestyle Experience — $100K | [inkphony](https://devpost.com/software/inkphony) | no public repo found | Unity, PCA | — | — | — | no public repo found |
| The Tarot Experience VR – AI Edition | Runner-up, Best Lifestyle Experience — $60K | [the-tarot-experience-vr-ai-edition](https://devpost.com/software/the-tarot-experience-vr-ai-edition) | no public repo found | Unity | — | — | — | no public repo found |
| IMMERROCK | Honorable mention, Best Lifestyle Experience — $30K | [immerrock](https://devpost.com/software/immerrock) | no public repo found | Unreal, C++ | — | — | — | no public repo found |
| Hand Survivor | Best Implementation of Hand Interactions — $50K | [handsurvivor](https://devpost.com/software/handsurvivor) | no public repo found | Unity 6, Meta XR SDK | — | — | — | no public repo found |
| Pocket Lands | Best Implementation of Hand Interactions — $50K | [pocket-lands](https://devpost.com/software/pocket-lands) | no public repo found (shipped commercial EA) | Unity, Meta SDK | — | — | — | no public repo found |
| Awesome Hand | Best Implementation of Hand Interactions — $50K | [awesome-hand](https://devpost.com/software/awesome-hand) | no public repo found (KAYAC; now on the Quest store) | Unity | — | — | — | no public repo found |
| Language IRL | Best Implementation of PCA with AI — $50K | [see-and-speak-spanish](https://devpost.com/software/see-and-speak-spanish) | no public repo found | Unity, Sentis, Azure speech | — | — | — | no public repo found |
| Chores.gg | Best Implementation of PCA with AI — $50K | [ping-t6exlb](https://devpost.com/software/ping-t6exlb) | no public repo found | Unity, Gemini | — | — | — | no public repo found |
| Flows.xr | Best Implementation of PCA with AI — $50K | [weavexr](https://devpost.com/software/weavexr) | no public repo found | Unity, OpenXR, Meta XR SDK | — | — | — | no public repo found |
| The Nanauts | Best Immersive Experience Built with IWSDK — $30K | [nanauts](https://devpost.com/software/nanauts) | Devpost linked [jameskane05/nanauts](https://github.com/jameskane05/nanauts); that repo now **404**. Live demo still at [jameskane05.github.io/nanauts](https://jameskane05.github.io/nanauts/). No replacement public source found among the author's other public repos. | IWSDK / WebXR | — | — | — | no public repo found (Devpost link now 404) |
| Dun Jun | Best Immersive Experience Built with IWSDK — $30K | [dunjun](https://devpost.com/software/dunjun) | Game repo [sma1692/DunJun](https://github.com/sma1692/DunJun) (linked from Try it out) now **404**. Related library still public: [sma1692/haath](https://github.com/sma1692/haath). Live game: [dunjun.world](https://dunjun.world/). | IWSDK / Three.js / Havok; library is TypeScript | 0 (haath) | 25 Oct 2026, 3:55 AM IST | MIT (haath) | related-only (strong-match for the library; game repo 404) |
| Compile Crops | Best Immersive Experience Built with Spatial SDK — $50K | [compile-crops](https://devpost.com/software/compile-crops) | no public repo found | Spatial SDK, Kotlin | — | — | — | no public repo found |
| — Mise — | Best Immersive Experience Built with Spatial SDK — $50K | [mise-9wvaib](https://devpost.com/software/mise-9wvaib) | no public repo found | Spatial SDK | — | — | — | no public repo found |
| Magic Wonders | Best Experience Built with React Native — $25K | [magic-wonders](https://devpost.com/software/magic-wonders) | no public repo found | React Native, TypeScript | — | — | — | no public repo found |
| GeoPortal | Best Android App Leveraging Features Unique to Meta Quest — $25K | [geoportal](https://devpost.com/software/geoportal) | no public repo found (author [imneptunex](https://github.com/imneptunex) has other public apps, none are this project) | Kotlin, Jetpack Compose | — | — | — | no public repo found |
| MarketView VR | Best Android Utility App — $25K | [marketview-vr](https://devpost.com/software/marketview-vr) | no public repo found | Kotlin, Jetpack Compose | — | — | — | no public repo found |
| OnTheGoVR | Best Android App for Travel Mode — $25K | [syncedvr](https://devpost.com/software/syncedvr) | [InventiveOtters/quest-travel-app](https://github.com/InventiveOtters/quest-travel-app) | Kotlin, Spatial SDK | 0 | 9 Dec 2025, 10:38 PM IST | none listed | confirmed-from-Devpost |
| Into The Mind | Judges' Choice — $30K | [into-the-mind](https://devpost.com/software/into-the-mind) | no public repo found | Unreal, C++ | — | — | — | no public repo found |
| OpenSoundLab | Judges' Choice — $30K | [opensoundlab](https://devpost.com/software/opensoundlab) | [SphericalLabs/OpenSoundLab](https://github.com/SphericalLabs/OpenSoundLab) (contest work: [`feature/hands`](https://github.com/SphericalLabs/OpenSoundLab/tree/feature/hands)) | Unity, C# | 71 | `feature/hands`: 10 Dec 2025, 12:51 AM IST; `master`: 18 Jun 2026, 11:41 AM IST | OSLLv1 | confirmed-from-Devpost |
| Lasertag – Operator & Scene Meshing prototypes | Judges' Choice — $30K | [lasertag-zombies-update](https://devpost.com/software/lasertag-zombies-update) | [anaglyphs/lasertag](https://github.com/anaglyphs/lasertag) (linked from the Devpost Try-it-out site [anaglyph.dev](https://anaglyph.dev); `operator` branch exists) | Unity, C#, Netcode for GameObjects | 371 | 16 Nov 2026, 11:06 AM IST | PolyForm Noncommercial 1.0.0 | strong-match |
| Final Throwdown | Judges' Choice — $30K | [sumo-boxing](https://devpost.com/software/sumo-boxing) | no public repo found (mode inside the shipped *Game Night* app) | Unity, MRUK, Netcode | — | — | — | no public repo found |
| HandCraft XR: Winter Edition | Judges' Choice — $30K | [handcraft-xr-winter-edition](https://devpost.com/software/handcraft-xr-winter-edition) | Game source not public. Live: [handcraft.astonishingdev.com](https://handcraft.astonishingdev.com). Related fork named in the write-up: [evstinik/immersive-web-sdk](https://github.com/evstinik/immersive-web-sdk) (fork of [meta/immersive-web-sdk](https://github.com/meta/immersive-web-sdk)). | IWSDK / Three.js / TypeScript | 0 (fork) | 28 Dec 2025, 7:48 PM IST (fork) | MIT (fork) | related-only (SDK fork confirmed-from-Devpost; game source not found) |
| ModStorm Block Party | Judges' Choice — $30K | [party-blast](https://devpost.com/software/party-blast) | no public repo found | WebXR, Three.js, Node | — | — | — | no public repo found |

---

## 4. Notes on the found repos

### OpenSoundLab — confirmed-from-Devpost
Try it out on Devpost pointed at `https://github.com/SphericalLabs/OpenSoundLab/tree/feature/hands`. That branch still exists (last commit "Version 0.80", 10 Dec 2025, 12:51 AM IST). Default branch is `master`, which has moved on (passthrough depth occlusion and later work; last push 18 Jun 2026, 11:41 AM IST). For 2025 contest-era hand interactions, check out `feature/hands`. Licence (OSLLv1) allows academic and artistic derivatives with source-share requirements, and forbids app-store distribution of derivatives.

### OnTheGoVR — confirmed-from-Devpost
Try it out pointed at `https://github.com/InventiveOtters/quest-travel-app`. README names OnTheGoVR and the 2025 competition, and describes Spatial SDK + local-network sync. Last push 9 Dec 2025, 10:38 PM IST — the contest deadline day. No licence file; treat as all-rights-reserved unless the authors say otherwise.

### Lasertag — strong-match
Devpost Try it out linked [anaglyph.dev](https://anaglyph.dev), not GitHub directly. That site (and [anagly.ph](https://anagly.ph)) links [anaglyphs/lasertag](https://github.com/anaglyphs/lasertag). The repo is a Unity project by Julian Triveri (trev3d), described as colocated MR laser tag for Quest 3, with a custom live environment scanner and an `operator` branch that matches the "Operator & Scene Meshing prototypes" submission. Last push 16 Nov 2026, 11:06 AM IST. Licence is PolyForm Noncommercial 1.0.0.

### Dun Jun / haath — related-only
Devpost Try it out linked `https://github.com/sma1692/DunJun` plus [dunjun.world](https://dunjun.world/). The user [sma1692](https://github.com/sma1692) still exists, but `DunJun` now returns 404 (private or deleted). The same account published [sma1692/haath](https://github.com/sma1692/haath) (`@treefour/haath` on npm), whose README says it is a zero-dependency WebXR 25-joint hand kinematics and gesture engine "battle-tested in DunJun". That is the reusable piece: pose classification, punch/slap ballistic gates, bimanual triangle beams, double-clap hysteresis, and a plane-agnostic 3D circle solver, written to stay inside a 90 Hz XR frame on Quest. MIT licence. Last push 25 Oct 2026, 3:55 AM IST.

### The Nanauts — Devpost link now 404
Devpost Try it out linked `https://github.com/jameskane05/nanauts` and the Pages URL [jameskane05.github.io/nanauts](https://jameskane05.github.io/nanauts/). The repo now 404s. The author still has many other public repos, none named or described as Nanauts. The GitHub Pages demo still returns HTTP 200, so you can *run* it, but there is no cloneable source.

### HandCraft XR — related-only (SDK fork)
Try it out links the live builds only. The write-up links [evstinik/immersive-web-sdk](https://github.com/evstinik/immersive-web-sdk) as a fork the author "studied, forked, and extended" because of missing IWSDK features. It is a real fork of `meta/immersive-web-sdk` (MIT), last pushed 28 Dec 2025, 7:48 PM IST. It is not the game. No `handcraft` repo was found under evstinik or a matching org.

---

## 5. Gaps

- **Hands / MRUK / PCA winners with no source:** Tiny Golf, Little Critters, Hand Survivor, Pocket Lands, Awesome Hand, Inkphony, Language IRL, Chores.gg, Flows.xr, DreamSpace. For those patterns you will have to rely on the Devpost write-ups in [past-winners-2025-analysis.md](past-winners-2025-analysis.md) and on Meta's official SDK samples, plus the five repos above.
- A Devpost GitHub link is not a guarantee the repo stays public. Both IWSDK winners had public repos at submission time; only related code (haath) and a Pages demo remain.
- Studio and store apps (Saber Punks, IMMERROCK, Pocket Lands, Magic Wonders, Final Throwdown, etc.) were treated as closed unless a matching public repo turned up. None did.
- Some similarly named GitHub projects exist (unrelated "Mise", "GeoPortal", "HandCraft" and "MarketView" repos). They were checked and rejected: different authors, stacks or product descriptions.
- This is a snapshot on 16 Nov 2026. A repo could be published or taken private later.

# Meta VR Start Developer Competition 2026 — dev kit

A private working kit for the [Meta VR Start Developer Competition 2026](https://start-developer-competition-26.devpost.com/):

- every resource linked from the Devpost site, inventoried and mirrored as Markdown;
- setup guides for each build path (Unity, Unreal, IWSDK/WebXR, Android);
- simulator guides and an on-device Quest guide;
- a verified IWSDK starter, helper scripts, and research notes.

> **Private repo: contains copies of third-party docs** (Meta, Devpost, W3C, others) for personal reference. Copyright stays with the original owners and each copy starts with its source URL. Don't make this repo public. SDK binaries and sample code are *linked*, not included.

## Key dates (IST, UTC+5:30)
| Event | Official (PT) | IST |
|---|---|---|
| Submissions opened | 24 Sep 2026, 10:00 AM PDT | 24 Sep, 10:30 PM IST |
| Last Monday Unblock office hours | 16 Nov, 3:00 PM CET / 10:00 AM PT | 16 Nov, 7:30 PM / 11:30 PM IST |
| **Submission deadline** | **Wed 18 Nov 2026, 12:00 PM PST** | **Thu 19 Nov, 1:30 AM IST** |
| Judging | 23 Nov 9:00 AM PST → 9 Dec 7:00 PM PST | 23 Nov 10:30 PM IST → 10 Dec 8:30 AM IST |
| Winners announced | ~11 Dec 2026, 10:00 AM PST | ~11 Dec, 11:30 PM IST |

Sources: [dates](https://start-developer-competition-26.devpost.com/details/dates), [webinars & office hours](https://start-developer-competition-26.devpost.com/details/webinars-office-hours). No build updates are allowed after the deadline until winners are announced ([FAQ](https://start-developer-competition-26.devpost.com/details/faqs)).

## The rules in one screen
- **Hands-first** (required): the whole experience must be completable without pairing a controller. Seated in a 2 ft radius, a satisfying session in ≤10 min, and not a thin wrapper (guidelines).
- Judged on **Quest 3 / 3S at ≥60 fps**. Four criteria at 25% each: Innovation & Creativity, Experience Design (purposeful passthrough, FoV-aware design), Technical Implementation (hands, gaze ISDK v207+, passthrough, MRUK, anchors), Polish & Presentation.
- **What judges get:**
  - Unity / Unreal / Godot / Android: an APK in a **new release channel named "Competition"**, plus its invite URL.
  - IWSDK / WebXR: a hosted URL.
- Also required: a **public video under 3 minutes** (YouTube or Vimeo), a text description, and your Track + Division.
- **No logos or brands.** Everything in English, or with English subtitles.

Full detail: [`resources/devpost/rules.md`](resources/devpost/rules.md) · checklist: [`setup/submission-checklist.md`](setup/submission-checklist.md).

## Folder map
```
resources/
  LINKS.md, links.csv       every link found (494 rows / 313 unique URLs) + completeness audit
  sample-repos.md           66 official sample/tool repos (linked, not vendored)
  devpost/                  Devpost pages as Markdown (overview, resources, rules, FAQ, dates, judging,
                            awards, webinars, updates/, forum/) + verbatim full-page copies
  pages/                    one-click-deep Markdown copies of linked docs (source URL on top)
  files/                    downloads (none: no PDFs/files were linked)
setup/
  00-prerequisites.md       accounts, Start membership, dev mode, MQDH, ADB, OS matrix
  on-device-quest.md        real-headset testing, 60 fps check, hands-only test
  unity.md · unreal.md · iwsdk-webxr.md · android.md
  submission-checklist.md
  simulators/               Meta XR Simulator, Meta Spatial Simulator, Immersive Web Emulator
templates/
  iwsdk-starter/            official IWSDK 1.1.0 MR starter (hands, anchors, planes, grabbing), build-verified
scripts/
  quest-adb.sh              install / logcat / wifi adb / perf capture
  clone-samples.sh          shallow-clone sample repos by group (tools, web, unity, unreal)
  sample-repos.txt          list used by clone-samples.sh
  unity-project-checklist.md · unreal-project-checklist.md
research/                   accessibility & pitfalls, idea shortlist, Sadak VR port plan,
                            2026 aggregate stats (no projects named), 2025 winners analysis
```

## Quick start by engine
**IWSDK / WebXR (fastest; works on Linux too):**
```bash
cd templates/iwsdk-starter && npm ci && npm run dev    # Node >=20.19; emulator built in
npm run build                                           # deploy dist/ to Vercel or GitHub Pages
```
→ [setup/iwsdk-webxr.md](setup/iwsdk-webxr.md), [simulators/immersive-web-emulator.md](setup/simulators/immersive-web-emulator.md)

**Unity:**
1. Install Unity 6000.0.66f2+ with Android modules.
2. Create the project via MQDH XR Projects (or manually), then add Meta XR All-in-One 209.0.
3. Run the Project Setup Tool. Set Hand Tracking Support to Hands Only.
4. Test in Meta XR Simulator, then Build and Run to the Quest.
5. Upload with the Platform Tool to the "Competition" channel.

→ [setup/unity.md](setup/unity.md), [scripts/unity-project-checklist.md](scripts/unity-project-checklist.md)

**Unreal:**
1. Install UE 5.8 plus the Meta XR plugin 209.0, or the Oculus-VR fork.
2. Create a project from the VR template.
3. Set Hand Tracking Support to Hands Only and Frequency to High.
4. Package with Android (ASTC).
5. Upload through the Meta XR Platform Window.

→ [setup/unreal.md](setup/unreal.md), [scripts/unreal-project-checklist.md](scripts/unreal-project-checklist.md)

**Android (Compose / Expo):** → [setup/android.md](setup/android.md)

**No headset yet?** → [setup/simulators/](setup/simulators/README.md). **Got the Quest?** → [setup/on-device-quest.md](setup/on-device-quest.md).

## Research
[research/](research/README.md) contains:

- [accessibility-and-pitfalls.md](research/accessibility-and-pitfalls.md)
- [idea-shortlist.md](research/idea-shortlist.md)
- [sadak-vr-port.md](research/sadak-vr-port.md): a candidate Adapted-division port of [Sadak](https://github.com/mittal-parth/sadak). Its code is not vendored here.
- [submissions-2026-aggregate.md](research/submissions-2026-aggregate.md): aggregate figures only, no 2026 projects named.
- [past-winners-2025-analysis.md](research/past-winners-2025-analysis.md)

## How this was built
- **Crawl date:** 16 Nov 2026, about 7 PM IST.
- **Fetching:** pages were fetched with curl or headless Chrome and converted to Markdown with trafilatura. Repo metadata comes from the GitHub API.
- **Not mirrored, by design:**
  - Videos (title + URL only).
  - SDK installers (link + version).
  - Zoom registrations.
- **Blocked:** Meta forum recordings need a login.
- **Version numbers:** read from the official download pages on the crawl date. Re-check them before relying on them.
- **Unverified items** are marked ⚠ in each guide.

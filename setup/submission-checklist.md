# Submission checklist

**Deadline: Wed 18 Nov 2026, 12:00 PM PST = Thu 19 Nov 2026, 1:30 AM IST** ([dates](https://start-developer-competition-26.devpost.com/details/dates)). Once the Entry Period ends, you can't change the submission; judging uses the state of the Entry at the deadline ([rules §4](https://start-developer-competition-26.devpost.com/rules)).

Sources: [rules](https://start-developer-competition-26.devpost.com/rules) (local: `resources/devpost/rules.md`), [FAQ](https://start-developer-competition-26.devpost.com/details/faqs), [judging](https://start-developer-competition-26.devpost.com/details/judging), [Release channel invites](https://developers.meta.com/horizon/resources/publish-release-channels-add-users/).

## A. Eligibility
- [ ] You (or a team member) are a **Meta VR Start member** — flair visible on the Developer Forum ([FAQ](https://start-developer-competition-26.devpost.com/details/faqs)).
- [ ] Registered on Devpost ("Join Hackathon"); every team member added to the submission.
- [ ] 18+; Meta account with Developer Access ([rules §2](https://start-developer-competition-26.devpost.com/rules)).
- [ ] Project hasn't received direct Meta funding ([rules §4.11](https://start-developer-competition-26.devpost.com/rules)).

## B. Project requirements ([rules §4](https://start-developer-competition-26.devpost.com/rules))
- [ ] VR/MR app for Meta VR devices; fits a **Track** (Entertainment / Gaming / Productivity) and a **Division** (New Experience = built since 24 Sep 2026, or Adapted / Significantly Updated).
- [ ] **Hands-first:** the entire experience can be completed without ever pairing a controller (test with controllers off — [on-device-quest.md](on-device-quest.md)).
- [ ] Guidelines: seated ("airplane seat test", 2 ft radius), fast cold start + clean pause/resume, a satisfying session in ≤10 min ("one bus stop test"), not a thin wrapper around a third-party service ("take it away test").
- [ ] **≥60 fps on Quest 3/3S** ([VRC.Quest.Performance.1](https://developers.meta.com/horizon/resources/vrc-quest-performance-1/)); stable, no crashes.
- [ ] Passthrough (if used) is *purposeful*, uses MRUK/scene understanding and holds up in rooms you never tested; essential UI inside a narrower FoV ([rules §6](https://start-developer-competition-26.devpost.com/rules)).
- [ ] English, or English subtitles (§4.16). No identifiable people besides entrants (§4.17). **No logos, brand names, slogans or recognizable branded products** (§4.19). Content fits Meta content guidelines for 10+/13+/18+ (§4.15).
- [ ] Third-party assets/code are properly licensed (§4.12); only publicly released or Start-released Meta tools (§4.12).
- [ ] Free of charge and reachable for judges until winners are announced (§4).

## C. Access link for judges
**APK path (Unity / Unreal / Godot / Android):**
- [ ] APK uploaded to the Developer Dashboard under a **new** release channel named exactly **Competition** (§4.7; FAQ: make a new one even if you reuse an app).
- [ ] Channel Settings → **Grant access to users by URL** enabled and saved; invite URL copied ([add users](https://developers.meta.com/horizon/resources/publish-release-channels-add-users/)).
- [ ] Limits from that page: invitees 18+; default 200 users per channel; invite page **disabled 90 days after the latest build upload**; regenerating the URL breaks the old link.
- [ ] App Metadata (header image, description) filled in so the invite page looks complete (same page).
- [ ] Tested the invite URL from a **second Meta account** on a Quest 3/3S: join → install → launch → complete hands-only. ⚠ my recommendation, not a stated requirement.
- [ ] arm64-v8a only, APK Signature Scheme v2, higher `versionCode` per upload ([Test your app](https://developers.meta.com/vr/essentials/test-your-app/), [share builds](https://developers.meta.com/horizon/essentials/metavr-share-builds)).

**Web path (IWSDK / WebXR):**
- [ ] Public HTTPS URL (GitHub Pages, Vercel, …) loads logged-out, in Meta Quest Browser, and "Enter XR" works with hands (§4.8).

## D. Devpost form (§4.9)
- [ ] Link to the Competition release channel (or the hosted URL for WebXR).
- [ ] **Demo video < 3 min**, **public** on YouTube or Vimeo (not unlisted/private ⚠ "publicly visible" — check it plays in an incognito window). Footage from a Quest, Meta XR Simulator, or an equivalent emulator is allowed. Show real gameplay; don't lean on AI-generated video ([judging](https://start-developer-competition-26.devpost.com/details/judging)).
- [ ] Text description: inspiration, how you built it, future plans and **target launch date** (if not already on the Store). Adapted projects: summary of new features (screenshots/changelog recommended).
- [ ] Select **Track** and **Division**.
- [ ] Testing instructions (hands-only, seated, any room-scan / Space Setup needs) — ⚠ not an explicit form field in the rules, but rules mention "testing instructions" under Language (§4.16).
- [ ] Optional special awards: check eligibility on the [special awards page](https://start-developer-competition-26.devpost.com/details/special-awards).
- [ ] Submit well before 1:30 AM IST Thu 19 Nov. You may update the build until the deadline; after that **make no updates** and keep the app available from 18 Nov 12:00 PM PST (19 Nov 1:30 AM IST) until winners are announced on or around 11 Dec ([FAQ](https://start-developer-competition-26.devpost.com/details/faqs)).

## E. Polish quick wins (judging = 4 × 25%)
Innovation & Creativity · Experience Design · Technical Implementation · Polish & Presentation — see [rules §6](https://start-developer-competition-26.devpost.com/rules) and the research notes in [research/](../research/).

# Giants & Hiders

Table-scale hide-and-seek on a miniature OpenStreetMap city diorama on your real table. **Seekers** are giants leaning over the city; the **hider** shrinks to street level. Original rules; no third-party show branding, names or assets.

- **Track:** Gaming. **Awards:** Social & Multiplayer (asymmetric), Best Agentic Interaction (solo AI hider).
- **Awe moment:** the hider looks up from the street and sees giant faces peering over the rooftops.
- **Seeker questions:** draw a circle with a finger ("are you inside?") and the excluded area goes dark; a hotter/colder thermometer; matching questions.
- **Hider:** a finger-frame "photo" answer; curse cards (fog, scrambled street names, freeze a giant's hand).

## Minimum playable version
Solo seeker against an AI hider in one small district, with the radius and thermometer questions and a pinch to catch the hider. Multiplayer only if time allows.

## Reuse
- Blosm/blender-osm (the add-on is GPL; exported models are yours) or OSM2World (MIT) → decimate → toon palette → glTF with Draco + KTX2 (no meshopt).
- Quaternius city kit (CC0) for props.
- Circle gesture: project the fingertip path onto the table plane, then a least-squares circle fit with a ≥300° coverage check ($1 recognizer as an alternative).
- Multiplayer later: Trystero (MIT, P2P WebRTC).

## Risks
- A public WebXR OSM tabletop city already exists, so the novelty must come from the hide-and-seek mechanic.
- Strip brand names from OSM shop tags (rule 4.19). Credit "© OpenStreetMap contributors" (ODbL).
- Networking is the biggest risk: build solo first.

## Common to every project
- Stack: IWSDK 1.1.0 (pinned) · WebXR in Meta Quest Browser · mixed-reality `ar` session · hands only · seated · Vercel.
- Shared rules, visual/hands/MR playbooks, perf budget, assets & licenses, and the submission gate: **[common build plan](../meta-vr-start-2026-kit/research/common-build-plan.md)**.
- Competition: Meta VR Start Developer Competition 2026. Deadline **Wed 18 Nov 2026, 12:00 PM PST (Thu 19 Nov, 1:30 AM IST)**.

## Run
```bash
npm ci            # Node >=20.19 (see .nvmrc). .npmrc skips onnxruntime's CUDA download.
npm run setup     # once per machine: MCP configs for Claude/Cursor/Codex + IWSDK reference index
npm run dev       # HTTPS dev server + emulator on https://localhost:8081
npm run typecheck && npm run build
```
Testing on a Quest from Linux: `adb reverse tcp:8081 tcp:8081`, then open `https://localhost:8081` in Quest Browser.
Agent workflow: start every task with the `iwsdk-dev` skill. More in [docs/IWSDK-STARTER.md](docs/IWSDK-STARTER.md) and [AGENTS.md](AGENTS.md).

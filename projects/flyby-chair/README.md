# Flyby Chair

Your real chair becomes the commander's seat of a crewed capsule on a lunar flyby: launch, watch Earth shrink, go silent behind the Moon, see Earthrise, then re-enter and splash down back into your room. Use a generic in-app title; **no NASA or agency logos, insignia or mission names**.

- **Track:** Entertainment. **Awards:** Boldest Original Concept, Best First Five Minutes (the launch is the hook), Agentic (AI crewmate).
- **Awe moment:** Earthrise. You hold up your hand and Earth fits between your thumb and finger.
- **Core loop (8–10 min):** launch (poke switches) → coast (pinch-hold Earth at the porthole) → far-side radio silence → Earthrise → panel tasks from the crewmate (twist a valve, reseat a breaker) → re-entry → the capsule walls dissolve back into your room.

## Minimum playable version
Capsule interior around the seated player, Earthrise as the polished centrepiece, 3–4 poke and twist tasks, and the passthrough ↔ capsule transitions at the start and end. Keep launch and re-entry to 60–90 s each.

## Reuse
- bobbyroe/threejs-earth (MIT): day/night blend, clouds and Fresnel atmosphere without post-processing.
- NASA SVS CGI Moon Kit (credit NASA SVS), Solar System Scope Earth textures (CC BY 4.0, convert to 4k KTX2).
- `PokeInteractable` switches; OneHandGrabbable knobs that only rotate.
- `DomeGradient`/`DomeFade` + inside-out shell alpha for room ↔ capsule.

## Risks
- A plain WebXR lunar flyby already exists in 2026, so the edge is the crewed cockpit and the hand tasks.
- Comfort: keep shaking mild, keep a stable cockpit frame, and use no forced acceleration.
- Performance: planets as textured spheres or billboards, not heavy geometry.

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

# Handoff prompt: start a new project with this kit

Paste everything below the line into a fresh coding agent (Claude Code or similar) opened in an empty working folder, after filling in the two `<…>` fields.

---

You are starting a new entry for the **Meta VR Start Developer Competition 2026**, built as a hands-only, seated, mixed-reality WebXR app for **Meta Quest 3/3S** with **IWSDK 1.1.0**.

**Project idea:** `<one or two sentences: what the player does, and why it's satisfying>`
**Project folder name:** `<kebab-case-name>`

## 1. Get the kit and read it (about 20 minutes, before writing code)
```bash
gh repo clone saurabh4269/meta-vr-start-2026-kit
cd meta-vr-start-2026-kit
```
Read, in this order:
1. `README.md`: dates, the rules on one screen, and a map of the folders. **Deadline: Wed 18 Nov 2026, 12:00 PM PST (Thu 19 Nov, 1:30 AM IST).** No build updates are allowed after it.
2. `skills/quest-hands-first-webxr/SKILL.md` (the core playbook), then `references/process.md`, `references/build-path.md` and `references/submission.md`.
3. The add-on that fits the idea: `skills/quest-mr-tutor/` (teach a skill) or `skills/quest-mr-game/` (an opponent, NPC or physics game).
4. `research/accessibility-and-pitfalls.md`, `research/past-winners-2025-analysis.md` and `research/winners-code-study.md`.
5. `projects/hands-of-a-master/` as the most finished example: `README.md`, `docs/JUDGING.md`, `docs/TESTING.md`, `tools/e2e.py` and `src/calligraphy-system.ts` (one system with a state machine). `projects/chausar/` is the game-shaped example.

## 2. Create the project
```bash
cp -r templates/iwsdk-starter projects/<kebab-case-name>
cd projects/<kebab-case-name>
```
- Set the name in `package.json`. Set a **free dev port** in `vite.config.ts` and `iwsdk.config.json`: ports 8081–8086 are taken by the other projects, so use 8087 or higher.
- Add the project to `PROJECTS` in `skills/sync.sh`, then run `bash skills/sync.sh` from the kit root. This copies the skills into `.claude/skills/`. Restart the agent session so it picks them up.
- `npm ci && npm run setup && npm run typecheck && npm run build` must all pass before you write any feature code.
- `templates/iwsdk-starter/KIT-NOTES.md` covers running it, the emulator and deploying.

## 3. Work the way the skill says
- **Before any gameplay code,** set the visual bar: art direction, lighting, text system, and the hero object. A grey box that passes tests still gets rejected.
- **Build the smallest complete journey first** (enter, place on the real table, do the thing, succeed, finish) and test it end to end in the emulator (`npx iwsdk …` CLI, `skills/quest-hands-first-webxr/scripts/xr_e2e_lib.py`). Then polish, and regression-test after every change.
- **Hands only.** The whole experience must work without controllers, seated, within about 60 cm, with a satisfying session in 10 minutes or less.
- **Never show work you haven't looked at.** Take screenshots from the player's real viewpoint and in close-up, and inspect them before you report anything.
- **Performance:** Quest 3 needs at least 60 fps (aim for 72 or 90). Keep draw calls low and merge static meshes by material (budgets are in `references/visual-quality.md`).
- **Assets and licences (rule 10):** use only original, CC0 or public-domain assets, or assets Meta provides. No copyrighted songs, logos, brands or real people. Log every asset's source in `public/**/CREDITS.md`. The free pipeline is in `references/assets-and-licensing.md`; there's no GPU here, so free Hugging Face Spaces and Blender headless are the options.
- **The user decides** anything that spends money, creates accounts, sets style direction, publishes, or commits. Ask with 2–4 concrete options and a recommendation; decide everything else yourself.
- **Status in a sentence or two at each milestone,** with screenshots in `artifacts/`.

## 4. Ship
1. Deploy to Vercel. `vercel.json` is already set up (it sends the WebXR permission header). Use `vercel link --yes`, `vercel build --yes --prod`, then `vercel deploy --prebuilt --prod --yes`. Open the production URL **signed out** and check that the page, models and audio load. Ask the user which Vercel account to use before linking.
2. Write `docs/JUDGING.md`, mapping each of the four 25% criteria to features with evidence, and `SUBMISSION.md`, with the Devpost text, credits, and a trailer shot list for a video under 3 minutes recorded on the headset.
3. Run the headset-only checks in `references/testing.md`. On Linux, `metavr capture video`, `metavr perf capture` and `metavr casting` work over USB.

## 5. Push your work back to this repo
The kit is the shared home for every project. Commit with the user's own git identity (check `git config user.name` / `user.email` and `gh auth status`; don't change them).
```bash
cd <kit root>
git pull --rebase origin main
git add projects/<kebab-case-name> skills/sync.sh
git status --short   # check: no .env*, node_modules, dist, artifacts or tokens staged
git commit -m "<kebab-case-name>: <what changed>"
git push origin HEAD:main
```
- **Never commit secrets.** API tokens go in a gitignored `.env.local`, written by the user from their own terminal.
- **Never force-push** and never rewrite others' commits. If the push is rejected, `git pull --rebase` and push again.
- **Commit after green test runs,** with small commits and clear messages. The repo is **public**, so don't add third-party code that has no licence; link to it instead.
- **Lessons that apply beyond your project** go into `skills/` (edit there, never in a project copy), then run `bash skills/sync.sh` and commit both.

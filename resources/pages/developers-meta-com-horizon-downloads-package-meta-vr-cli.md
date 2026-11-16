# Meta for Developers

> Source: https://developers.meta.com/horizon/downloads/package/meta-vr-cli/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 23, 2026|Version1.8.0

New Features

Added a single guided workflow in `metavr init` to set up MCP and skills with Muse Code, Claude Code, Codex, Cursor, and other coding harnesses.

Registered Muse Code as an agent target using `metavr mcp install muse-code`.

Introduced `metavr skills` to install and manage Meta VR Agent Skills.

Added `metavr xroperator` to integrate with Meta XR Operator, enabling AI agents to drive simulator and device interactions.

Enabled fully headless Unity editor setup using `metavr unity`, including execution via AI agents.

Added `metavr device fov-sim` to narrow a Meta Quest device's field of view to match Meta VR Glasses, enabling Glasses development on existing Quest hardware.

Added support for Meta Spatial Simulator and XR Simulator via `metavr ssim` and `metavr xrsim`.

Added `metavr vrc-local` to run performance and store-readiness checks.

Added `metavr store` to upload and download store submission assets directly from the CLI.

Added Linux platform support for the Meta VR CLI, including XR Simulator commands.

Changes & Improvements

Updated performance debugging tools: `metavr perf render-capture` now captures and analyzes GPU frames, `metavr perf memory-snapshot` captures memory snapshots, and a new Perfetto preset enables memory profiling.

Environment setup commands `metavr tools` and `metavr doctor` now detect existing Android SDK, JDK, and Unity installs to add only missing dependencies, with support for installing Android Studio and the Horizon plugin via `metavr tools`.

Support and legal

English (US)

© 2026 Meta
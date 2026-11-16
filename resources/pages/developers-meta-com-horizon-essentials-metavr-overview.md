# Meta VR CLI overview | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/essentials/metavr-overview/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Essentials

Updated: Oct 22, 2026

Meta VR CLI lets you drive your Meta VR device from a terminal. It also lets an AI coding agent drive it for you. The command is `metavr`.

It is one tool with two front ends. You can run commands yourself. Or your AI agent can call the same commands through a server that speaks the Model Context Protocol (MCP). Both reach the same code, so your choice of front end does not limit what you can do.

`hzdb`). The `@meta-quest/hzdb` npm package still works too. Both are permanent, so older scripts keep running.
The logic lives in one place. The command line and the MCP server are two doors into it. That keeps the two in step as the tool grows.

Between them they let you:

- Find devices, check their state, and connect over Wi-Fi
- Install, launch, and stop apps
- Move files, read logs, and run shell commands
- Take screenshots and drive the on-screen interface
- Capture and analyze performance traces
- Search the docs and the API reference
- Search Meta’s 3D asset library
- Publish builds to the Meta Horizon Store
- Share a build with testers through an unlisted link
- Install other developer tools and simulators

Run `metavr` in a terminal and pick each command:

metavr device list

This suits scripts, automation, and any job where you want each step spelled out.

Your agent can run the command line directly. Describe what you want and it picks the commands, so you never name one yourself.

Meta VR CLI also runs a Model Context Protocol (MCP) server. For an agent that speaks MCP, this exposes the same capabilities as tools the agent discovers on its own, and the set stays current as the CLI updates.

Skills are reusable instructions. They teach an agent how to run a Meta VR workflow from end to end. Guided setup installs the Meta VR CLI skill next to the MCP server config, so your agent gets workflow context on top of the raw commands.

| Consideration | Details | 
|---|---|
| Signing in | Installing and using the CLI works without an account, and `metavr init` offers to sign you in. Signing in is worth doing: it unlocks Meta Horizon Store commands and other account-backed features, and more will depend on it over time. It opens a browser. | 
| Installing | A native installer covers macOS, Linux, and Windows. You can also run the CLI through npm. | 
| Updates | A binary from the native installer updates itself. One from a package manager defers to that package manager. | 

Use it whenever your work touches a device. That covers installing builds, reading logs, capturing traces, taking screenshots, searching docs or assets, and shipping to the Meta Horizon Store.

Run it yourself when you want each step under your control. Let your agent run it when you prefer to describe the goal and have the agent pick the steps. Both reach the same commands.

- [Install Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-install): install the CLI and connect it to your AI coding agent.
- [Work with devices and apps](https://developers.meta.com/vr/essentials/metavr-devices-and-apps): connect a device, install builds, and read logs.
- [Share a build with a link](https://developers.meta.com/vr/essentials/metavr-share-builds): send a build to testers, friends, or family with one command.
- [Profile and debug performance](https://developers.meta.com/vr/essentials/metavr-performance): capture and analyze a trace.
- [Set up your environment and tools](https://developers.meta.com/vr/essentials/metavr-environment): install developer tools and simulators, then configure settings and sign-in.
- [Meta VR CLI in other tools](https://developers.meta.com/vr/essentials/metavr-other-tools): the Meta tools that already bundle the CLI.
- [Troubleshoot Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-troubleshooting): agent connection, sign-in, and update problems.
- [AI tooling overview](https://developers.meta.com/vr/essentials/ai-tooling-overview): the wider set of AI tools for Meta VR development.

Support and legal

English (US)

© 2026 Meta
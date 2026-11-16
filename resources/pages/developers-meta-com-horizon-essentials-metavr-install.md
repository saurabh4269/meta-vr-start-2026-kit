# Install Meta VR CLI | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/essentials/metavr-install
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Essentials

Updated: Nov 12, 2026

Jump to: [Verify your agent can search the docs](https://developers.meta.com#verify-your-agent-can-search-the-docs).

Meta VR CLI (`metavr`) is a single developer tool with two interfaces: a command line you run directly from your terminal, and a Model Context Protocol (MCP) server that your AI coding agent drives on your behalf. This guide installs the `metavr` command, verifies the install, and connects the tool to an AI agent so it can search documentation, manage connected devices, and automate other development tasks for you. For background on how the command line and the MCP server relate, see the [Meta VR CLI overview](https://developers.meta.com/vr/essentials/metavr-overview).

- A terminal on macOS or Linux, or PowerShell on Windows
- Node.js 18 or later, if you plan to install with npm instead of the native installer
- An AI coding agent already installed, if you want to connect one during setup

Install the CLI with the native installer. The installer detects your operating system and architecture, downloads the matching binary, and adds it to your `PATH`.

macOS / Linux

Windows

curl -fsSL https://developers.meta.com/horizon/install-cli/ | sh

By default, the macOS and Linux script installs to `~/.metavr/bin`, and the Windows script installs to `%USERPROFILE%\.metavr\bin`. Set `METAVR_HOME` before running the installer to choose a different location, or `METAVR_NO_PATH` to skip the `PATH` changes.

When the installer finishes, it prints `metavr init` as the next step.

If you have Node.js, you can run the CLI through npm instead. Running it with `npx` picks up the current release every time, so it is the option to prefer:

npx metavr@latest init

Any command works this way, for example `npx metavr@latest device list`.

To install it globally instead:

npm install -g metavr

The package downloads a binary for your platform the first time you run it, verifies it, and caches it locally.

`npm update -g metavr` to move to a newer release.
Confirm the CLI installed correctly:

metavr --version

A version number prints to confirm the install. Then run the diagnostic report to see what developer software metavr found on your machine:

metavr doctor

`metavr init` or `metavr tools install <name>` for anything missing.
Run the guided setup to connect metavr to your AI agent:

Pass flags to skip the prompts:

metavr init --cursor --no-auth

Available flags: `-y`/`--no-prompt`, `--all-agents`, `--no-auth`, `--claude-code`, `--cursor`, `--gemini`, `--copilot`, `--codex`, and `--opencode`. Without a flag, `metavr init` uses `--all-agents`, falls back to an interactive multi-select, or detects agents already on your `PATH`.

To configure a single agent instead, use `metavr mcp install <target>`:

metavr mcp install cursor

Valid targets: `android-studio`, `cursor`, `claude-desktop`, `claude-code`, `vscode`, `vscode-insiders`, `codex`, `zed`, `windsurf`, `antigravity`, `gemini-cli`, `open-code`, `lm-studio`, and `project`. The `project` target writes a project-scoped configuration in your current directory instead of a global one. If you use the [Meta VR Android Studio plugin](https://developers.meta.com/vr/documentation/android-apps/meta-vr-android-studio-plugin), use the `android-studio` target.

The metavr MCP server communicates over stdio. To start it directly, run `metavr mcp server`.

`metavr auth login`, which opens your browser.
Update the CLI when a new version ships:

metavr update

Add `--version <V>` to install a specific version, `--dry-run` to preview the update, or `--force` to reinstall the current version.

This works for a binary from the native installer, which updates itself in place. If you installed through a package manager, update through that instead, and `metavr update` tells you so rather than changing anything:

You can run metavr directly from your terminal, without going through your AI agent, to explore what it can do.

- `metavr --version`: confirms your installed version. No device or sign-in needed.
- `metavr doctor`: lists the developer software metavr found on your machine. No device or sign-in needed.
- `metavr docs search "passthrough rendering"`: searches Meta VR documentation and API references. No device or sign-in needed.
- `metavr asset search "office chair"`: searches the 3D asset catalog, returning five results by default and up to ten. No device or sign-in needed.
- `metavr device list`: lists connected devices. Needs a device.
- `metavr capture screenshot`: captures a screenshot from a connected device, saving a 1024x1024 image named `screenshot_<timestamp>.png` by default. Needs a device.

To inspect a specific device, run `metavr device list` first to get a device ID, then pass it to `metavr device info <device_id>`.

Common flags work across every command:

- `-d, --device <DEVICE>`: targets a specific device.
- `--format <table|json|plain>`, or `--json` as a shortcut, sets the output format.
- `--color <auto|always|never>`: controls colored output.
- `-v`, `-vv`, `-vvv`, and `-q`: control log verbosity.

With more than one device attached, pick a target with `--device`, or set a default once:

metavr config set default-device 1WMHH000X00000

`--device` overrides the default. The `HZDB_DEVICE` environment variable sets it too. For automation, set `METAVR_TOKEN` so scripts do not need an interactive sign-in.
These commands are a small sample. metavr also covers:

- Device management, plus app and build installation
- File transfer, device logs, and shell access
- Screenshots and user interface automation
- Performance capture and trace analysis
- Documentation, application programming interface (API) reference, and 3D asset search
- Meta Horizon Store distribution
- Managed developer-tool installs and simulators

Run `metavr --help` for the full list, or let your AI agent discover these capabilities through the MCP server you configured in the previous step.

`metavr: unsupported platform`, followed by your platform name and the list of platforms the package covers.
On macOS and Linux:

In PowerShell on Windows:

iwr -useb https://developers.meta.com/horizon/install-cli/windows/ | iex

`command not found: metavr` (or `metavr is not recognized` on Windows).`~/.bash_profile` or `~/.bashrc` for `bash`, `~/.zshrc` for `zsh`, `~/.config/fish/conf.d/metavr.fish` for `fish`, and `~/.profile` for anything else. On Windows, it updates your user `Path`. Open a new terminal window so the change takes effect. If you set `METAVR_NO_PATH` before installing, add the install directory to your `PATH` manually.
- [Work with devices and apps](https://developers.meta.com/vr/essentials/metavr-devices-and-apps): connect a device, install builds, and read logs.
- [Profile and debug performance](https://developers.meta.com/vr/essentials/metavr-performance): capture and analyze a trace.
- [Troubleshoot Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-troubleshooting): agent connection, sign-in, and update problems.

- [Browse agent skills](https://developers.meta.com/vr/essentials/agent-skills): the published catalog of agent skills, grouped by category.
- [Meta VR CLI in other tools](https://developers.meta.com/vr/essentials/metavr-other-tools): the Meta tools you may already have it through.
- [Meta VR CLI overview](https://developers.meta.com/vr/essentials/metavr-overview): how the command line and the MCP server relate.
- [LLM resources for agents](https://developers.meta.com/vr/essentials/ai-solutions): LLM-optimized documentation indexes you can point any AI tool at.
- [Prompting best practices](https://developers.meta.com/vr/essentials/ai-prompting-best-practices): how to prompt your AI agent once it is connected.
- [Meta VR Android Studio plugin](https://developers.meta.com/vr/documentation/android-apps/meta-vr-android-studio-plugin): the Android Studio plugin that bundles this CLI.

After you run `metavr init` or `metavr mcp install <target>`, restart your agent if the command printed a line about restarting.

To confirm the connection itself, ask your agent to use `vr_docs_search`, the MCP tool that reaches the same documentation search as the `metavr docs search` command:

Use the metavr server’s vr\_docs\_search tool to search the Meta VR developer documentation for passthrough. Show me the tool’s result, and tell me which pages it returned.

Confirm your agent’s response shows the `vr_docs_search` tool result and cites the documentation pages it returned. If either is missing, see [Troubleshoot Meta VR CLI](https://developers.meta.com/vr/essentials/metavr-troubleshooting#your-ai-agent-cannot-reach-meta-vr-cli).

Support and legal

English (US)

© 2026 Meta
# Use the Unity command-line interface (CLI) • Unity command-line interface (CLI)

> Source: https://docs.unity.com/en-us/unity-cli/use-unity-cli
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

# Use the Unity command-line interface (CLI)

Install the Unity CLI standalone binary and use it to install Editors, add modules, and open projects from a terminal.

Use the Unity CLI to install Unity Editors, add modules, and manage projects from a terminal. The CLI is a standalone binary that works in CI pipelines, automation scripts, and terminal-first workflows.

The Unity CLI works well for:

- Continuous integration (CI) pipelines and build agents.
- Scripting and automation that needs structured output (JSON or TSV) and predictable exit codes.
- Users who prefer a terminal-first workflow for installing Editors, managing modules, and opening projects.

For command syntax, options, and flags, refer to [Unity CLI reference](https://docs.unity.com/en-us/unity-cli/reference). If you have existing scripts that use the Hub CLI's `-- --headless`

syntax, refer to [Migrate from the Hub CLI](https://docs.unity.com/en-us/unity-cli/reference/migrate-hub-cli) for a comparison of syntax and behavior changes.

## Compatibility

The Unity CLI is compatible with the following operating systems:

- Windows 10 21H1 or newer.
- Linux RHEL 9 and Ubuntu 22.04 and later. Requires glibc 2.34 or newer. Debian 11, CentOS 8, Amazon Linux 2 aren't supported.
- macOS 14 and newer.

## Common Unity CLI tasks

The following commands cover the most common CLI tasks:

unity --help # Top-level helpunity install lts # Install the latest LTS Editorunity install-modules -e 6000.3.7f1 -m ios # Add the iOS moduleunity editors -i # List installed Editorsunity open ./MyProject # Open a projectunity shell # Run many commands in one interactive sessionunity doctor # Print a diagnostic snapshot

## Install the Unity CLI

To install the Unity CLI:

1. Open a terminal. On Windows, use PowerShell.
2. Run the install script for your operating system.

curl -fsSL https://unity.com/install.sh | bash

After the script completes, verify the CLI is available by running `unity --version`

. If the command isn't found, add the install directory to your shell's `PATH`

or reopen your terminal.

On Linux, the script installs the binary to `~/.local/bin/unity`

, which is on `PATH`

by default on most distributions. Re-running the installer migrates an install from the previous `~/.unity`

location.

The install script above is the recommended way to install the Unity CLI. It always installs the latest release, and `unity self-update`

keeps the CLI current after installation (refer to [Update the Unity CLI](https://docs.unity.com/en-us/unity-cli/reference/cli-config-diagnostics-commands#update-the-unity-cli)). If you already manage command-line tools with a package manager, you can use one of the alternatives below:

To install to a different directory, set `UNITY_CLI_HOME`

before you run the script. The script then installs the CLI to `<UNITY_CLI_HOME>/bin`

(
`<UNITY_CLI_HOME>\bin`

on Windows) instead of the default location.

- Homebrew: update through that package manager instead of `unity self-update`
- Linux package repositories: update through that package manager instead of `unity self-update`
- winget: winget is the exception, it installs an MSIX package, so `unity self-update` keeps working

### Install with a package manager

On macOS and Linux, you can install the CLI with [Homebrew](https://brew.sh) instead of the install script, so Homebrew keeps it current:

brew install --cask unity-cli

The cask supports Apple silicon and Intel on macOS, and x64 and arm64 on Linux. On Linux, installing casks requires Homebrew 6.0 or later.

To update the CLI, run `brew upgrade unity-cli`

.

## Update the Unity CLI

To update the CLI to the latest release:

1. Open a terminal.
2. Run the self-update command:

unity self-update

The CLI replaces the current binary with the latest available release. If a download is interrupted, the next `unity self-update`

resumes the download instead of starting over. The CLI also checks for updates in the background and prints a notice when a new release is available. To turn the check off, run `unity config update-check off`

.

`unity upgrade``unity self-update`
If you installed the CLI with Homebrew or from the Linux package repositories, update it through that package manager instead. `unity self-update`

detects the package-managed install and shows the matching command. A winget install is the exception, since it's an MSIX package, `unity self-update`

continues to update it directly.

### Install a specific Unity CLI version

To install a specific version of the Unity CLI instead of the latest release, run the following self-update command in a terminal with the `--target`

option and the version to install:

unity self-update --target \<version>

`unity upgrade``unity self-update`
unity upgrade --target \<version>

Replace `<version>`

with a release version such as `1.0.0`

. The `--target`

option also accepts a leading `v`

, such as `v1.0.0`

, and `latest`

for the latest release.

If you installed the CLI with Homebrew or from the Linux package repositories, use that package manager to install a specific version.

### Limits on automatic updates

The following limits apply to automatic updates of the Unity CLI:

- The Unity Hub updates the Unity CLI automatically. You can't disable these updates in the Hub.
- `unity config update-check off` disables only the CLI's notice that a new release is available. It doesn't stop the Hub from updating the CLI.
- If you installed the CLI as an MSIX package, including through winget, Windows keeps the CLI current in the background. Rollback isn't available for MSIX installs.
- If you installed the CLI with Homebrew or from the Linux package repositories, the package manager controls updates. `unity self-update` doesn't update these installs.

### Update with a package manager

brew upgrade unity-cli

To see what the CLI resolved and which command updates your install, run:

unity diagnose update

## Install a Unity Editor

To install a Unity Editor:

1. Open a terminal.
2. Run `unity install` with the version you want. Use a version alias such as `lts` or a specific version string such as `6000.3.7f1`:

unity install ltsunity install 6000.3.7f1

The Editor downloads and installs to the configured install path.

To add modules at install time, use `-m`

followed by one or more module IDs:

unity install lts -m ios android webgl

For all options, version aliases, and module IDs, refer to [Unity CLI reference](https://docs.unity.com/en-us/unity-cli/reference/editor-project-commands#install-an-editor).

## Add modules to an installed Editor

To add modules to an Editor you already installed:

1. Open a terminal.
2. Run `unity install-modules` with `-e` for the Editor version and `-m` for the module IDs:

unity install-modules -e 6000.3.7f1 -m android ios

The modules download and install for the specified Editor version.

For all options and module IDs, refer to [Unity CLI reference](https://docs.unity.com/en-us/unity-cli/reference/editor-project-commands#install-modules-for-an-existing-editor).

## Create a project

To create a new Unity project:

1. Open a terminal.
2. Run `unity projects create` with a project name:

unity projects create MyGame

By default, `unity projects create`

enables Unity Cloud for the new project and creates a Unity Cloud project entry in your organization. The command doesn't upload files, assets, or settings, and it doesn't store or host the local project anywhere. Because the default creates a cloud project, the command needs a signed-in user account. If you aren't signed in, the command stops with exit code 3 before creating anything and names both `unity auth login`

and `--no-cloud`

. The same applies when you authenticate as a service account because service accounts can't create projects in an organization.

To create a local-only project, pass `--no-cloud`


unity projects create MyGame --no-cloud

To keep an entire pipeline local, set `UNITY_NO_CLOUD`

for the job.

To use an existing Unity Cloud project instead of creating one, pass `--cloud-project <id-or-name>`

. You can't combine `--no-cloud`

with `--cloud`

, `--cloud-org`

, or `--cloud-project`

. If the cloud setup doesn't complete, you keep the local project and the command reports a warning.

For all options, run `unity projects create --help`

. For the other `projects`

subcommands, refer to [Unity CLI reference](https://docs.unity.com/en-us/unity-cli/reference/editor-project-commands#manage-projects-in-the-hub-registry).

## Open a project

To open a Unity project:

1. Open a terminal.
2. Run `unity open` with the path to the project:

unity open ./MyProject

Unity opens the project in the Editor version specified in the project's settings.

You can omit the `open`

keyword when the first argument is a path:

unity ./MyProject

## Set up version control

To add a Unity project to version control:

1. Open a terminal in the project's directory.
2. Run:

unity vcs setup

`unity vcs setup``--save-preset <name>``--git-*``unity projects link vcs`
unity vcs setup --vcs github --git-namespace my-org --non-interactive

For the full command tree, including status and sync, repository audits, hooks, conflict resolution, and diffs, refer to [Unity CLI reference](https://docs.unity.com/en-us/unity-cli/reference/uvcs-commands).

## Sign in

To sign in to your Unity account:

1. Open a terminal.
2. Run the login command, which opens a browser-based sign-in flow:

unity auth login

The CLI stores your session so you can use other commands without signing in again.

To check whether you're signed in, run `unity auth status`

. For all auth commands, refer to [Unity CLI reference](https://docs.unity.com/en-us/unity-cli/reference/accounts-licenses-cloud-commands#sign-in-and-out).

### Sign in as a service account

For unattended workflows such as CI pipelines and build agents, you can authenticate with a service account. This is the same service account type used to sign into other Unity services, it isn't specific to the CLI. To learn how to create a service account, refer to [Service accounts](https://docs.unity.com/en-us/cloud/accounts/create-service-account).

To sign in automatically through the Unity CLI, set the `UNITY_SERVICE_ACCOUNT_ID`

and `UNITY_SERVICE_ACCOUNT_SECRET`

environment variables to the account's key ID and secret key. For the full list of environment variables, refer to [Unity CLI reference](https://docs.unity.com/en-us/unity-cli/reference/output-formats#environment-variables).

## View long command output

Commands with long listings, such as `unity releases`

, `unity editors`

, `unity changelog`

, `unity logs`

, and the bare `unity command`

listing, page human-readable output through a terminal pager when you run them in an interactive terminal. This prevents long lists from flooding your scrollback, similar to `git log`

. Only human-readable output uses the pager: machine formats such as, `--format json`

, piped or redirected output, `--quiet`

, and commands run inside `unity shell`

print directly:

unity releases

Set `UNITY_PAGER`

or `PAGER`

to use a different pager. Pass `--no-pager`

to turn off paging for a single run, or set `UNITY_NO_PAGER`

to turn off paging for all runs. If no pager is available, output prints directly instead of failing. his is common on Windows, where less isn't installed by default.

## Additional resources

Copyright © 2026 Unity Technologies
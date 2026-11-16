# Device Readiness Check | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/device-readiness/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Oct 12, 2026

Experimental feature

Device Readiness Check is experimental. How the tool works with AI, its dependencies, and the setup flow may change in future versions. Meta will continue updating its best-practice guidance and setup rules until the Meta VR Glasses device release. Current checks focus on controller-to-hands migration and field-of-view validation. As the Meta VR Glasses release approaches, Meta will add more specific rules and guidance for gaze interactions and graphics optimization.

The scan is read-only. Your project is not changed unless you explicitly apply a fix. Each finding includes an actionable recommendation, and standard project-setup issues can be resolved with a single click.

- **See what affects device readiness.** Get a prioritized list of project-configuration issues and recommendations for preparing your project for Meta VR Glasses.
- **Apply fixes automatically.** Auto-fixable project-setup issues offer **Apply automated fix**, or **Apply all automated fixes** for the whole set.
- **Get code-grounded guidance for harder changes.** With AI enabled, recommendations reference your project and provide steps that you can apply with your own AI coding agent.
- **Track and share progress.** Mark findings complete as you work through them, and use **Export as Markdown** to save or share the report.

After you select **Get started**, choose how to scan:

- **Standard check:** Runs project-configuration and device checks, then scans your C# scripts for controller-only input patterns. It does not require an AI provider.
- **AI-powered check:** Runs the same project and device checks, then performs AI analysis to produce recommendations based on your project context. It requires Meta XR AI Tools to be connected to an AI provider of your choice.

Before proceeding with this tutorial, complete the setup steps outlined in [Set Up Unity for XR development](https://developers.meta.com/vr/documentation/unity/unity-project-setup/) to create a project with the necessary dependencies.

In addition:

- Meta XR Core SDK v207 or later, with Device Readiness Check available.
- Meta Interaction SDK v205 or later for projects that use Interaction SDK hand interactions.
- For the AI-powered check only: Meta XR AI Tools connected to an AI provider. See [Connect your AI coding assistant](https://developers.meta.com/vr/documentation/unity/immersivedebugger-ai-assistant/#part-1-connect-your-ai-coding-assistant).

From the Unity menu bar, select **Window** > **Meta** > **Tools** > **Device Readiness Check**. You can also access it from the Meta XR SDK toolbar menu or welcome screen.

1. Select **Get started**, choose **Standard check**, then select **Next**.
2. The scanning screen reads the project configuration, checks device requirements, analyzes the project, and compiles the readiness report. When it finishes, select **Next**.
3. On the results screen, review the recommendations. Open a finding for guidance, apply the available automated fixes, and use **Export as Markdown** to save the report.

The AI-powered check adds project-specific AI analysis to the standard project and device checks.

1. Connect an AI provider through Meta XR AI Tools. To switch providers, select **Window** > **Meta** > **Tools** > **AI Tools**. Supported providers include Claude Code, OpenAI Codex, Gemini CLI, OpenCode, and Muse Code. Muse Code requires Meta XR Core SDK v207.0.1 or later.
2. In Device Readiness Check, select **Get started**, choose **AI-powered check**, then select **Next**.
3. Optionally describe your project to give the AI context for its recommendations, then start the scan.
4. On the results screen, open **AI assisted** findings to review code-grounded recommendations, copy the steps into your AI coding agent, and mark items complete as you address them.

You can also expand **Run it yourself in any AI agent** and copy the Device Readiness prompt to run the same analysis in your own AI coding agent.

The results screen lists findings by priority and type:

| Type badge | Meaning | 
|---|---|
| **Automated** | A project-setup issue that the tool can fix for you. | 
| **Manual** | A readiness issue that you address yourself using the provided guidance. | 
| **AI assisted** | A recommendation grounded in your project, with steps you can copy to your AI coding agent. | 

Use **Apply all automated fixes** to resolve the available automated findings. Mark other findings complete as you work through them, select **Check readiness** to scan again, or use **Export as Markdown** to save the full report.

To continue in your own AI coding agent, copy the command displayed with the session ID at the bottom of the report and run it in your terminal.

The tool restores the saved report after Unity reloads your scripts. Closing the tool window clears the current report.

If an AI-powered check does not start or the selected provider rejects the request, review the provider launch settings:

Known issue: OpenCode on Windows

OpenCode does not work with AI-powered Device Readiness Check on Windows. 1. In Unity, select **Edit** > **Preferences** > **Meta XR** > **Agent Bridge**.
2. Turn on **Enable AI Agent Bridge**. If it is off, Device Readiness Check runs a standard check instead.
3. In **Additional Arguments**, enter any command-line options required by your provider configuration. For example, use the provider’s documented model-selection argument when its default model is unavailable to your account. Put quotation marks around values that contain spaces.
4. Press Enter or move focus away from the field. Agent Bridge appends the arguments to the provider’s normal launch command and validates the complete command. For Muse Code, validation checks only that the Muse Code CLI is available and does not test the arguments.
5. Expand **Advanced**, enable **Verbose Logging**, run the check again, and review the Unity Console.

If validation reports an invalid argument, revise **Additional Arguments**. Clear the field if validation still fails.

Support and legal

English (US)

© 2026 Meta
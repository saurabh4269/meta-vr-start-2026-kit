# Meta XR Operator overview | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unity/meta-xr-operator/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 9, 2026

Experimental feature

Meta XR Operator is an experimental component of the Meta XR Core SDK. Tool names, APIs, and behavior may change in future releases. Avoid depending on it in production apps. Meta XR Operator is an OpenXR API layer that gives AI agents spatial context and control over a running Unity XR app. It ships as an optional, experimental component of the [Meta XR Core SDK](https://developers.meta.com/vr/documentation/unity/unity-core-sdk/) and works with any OpenXR-based Unity app without requiring changes to your app’s code.

The goal is to give agents rich spatial awareness. They can then perceive, understand, and act within virtual and mixed reality through a standard protocol and a set of tools.

The API layer sits between your app and the OpenXR runtime. It intercepts the runtime calls your app already makes. This exposes session state, tracking data, and input control to AI coding agents through the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/). Any MCP-compatible agent can then observe and interact with your app. The same workflow runs in the Unity Editor, in [Meta XR Simulator](https://developers.meta.com/vr/documentation/unity/xrsim-intro/), or on a Meta Quest headset.

Meta XR Operator is built for agent-driven development and testing workflows, such as:

- Reproducing and debugging issues by driving the app with natural language.
- Running automated test passes without scripting each scenario.
- Inspecting live session, tracking, and frame state while the app runs.
- Prototyping agent-driven XR experiences and spatial reasoning.

Through MCP, an agent can use Meta XR Operator to:

- Query the XR session state, system information, and per-frame data.
- Navigate the Unity scene graph and inspect UI canvases, including interactable controls such as buttons, toggles, and sliders.
- Read and control the head and controller poses, including smooth, interpolated movement.
- Set controller input, such as buttons, triggers, grips, and thumbsticks.
- Drive hand tracking by moving the hands and making gestures such as pinch, poke, and grab, and read back the current hand state.
- Trigger gaze-and-pinch interactions.
- Capture composited images that combine the physical environment and virtual content.
- List spatial entities, such as rooms, walls, floors, tables, and other furniture, with their poses and semantic labels.
- Perform spatial math, including vector and quaternion operations and Unity-to-OpenXR coordinate conversion.
- Call custom, app-specific tools that you register from your own C# code.

Meta XR Operator runs a local MCP server inside your app and bridges it to your agent through an MCP proxy. The pieces fit together as follows:

1. Your Unity app runs with the Meta XR Operator API layer enabled.
2. The API layer intercepts OpenXR runtime calls and starts a local MCP server inside the app’s process.
3. An MCP proxy connects your AI coding tool to that server and discovers the available tools - including a set of pre-included tools as well as any custom tools your app registers. The proxy can be installed from the AI Tools panel, or found within the [standalone downloadable bundle](https://developers.meta.com/horizon/downloads/package/meta-xr-operator-standalone/).
4. The agent calls tools to read state from, or send input to, the running app.

The MCP server is also reachable directly over HTTP with Server-Sent Events (SSE) at `http://localhost:8720/sse`. Connecting through the proxy is the recommended path; the direct endpoint is an advanced option.

Because the integration happens at the OpenXR layer, the same workflow applies whether you run in the Editor with Quest Link, in Meta XR Simulator, or on a Quest headset. When you run on a headset, you forward the port over ADB so the host machine can reach the on-device server.

| Platform | Runs with | Notes | 
|---|---|---|
| Windows | Quest Link, Meta XR Simulator | Full tool support for desktop development. | 
| macOS (Apple Silicon) | Meta XR Simulator | Editor and Simulator workflows. | 
| Meta Quest | On-device builds | Requires the `android.permission.INTERNET` permission and ADB port forwarding to connect from a host machine. | 

Before you use Meta XR Operator, make sure you have:

- Unity 6000.0.x or later.
- Meta XR Core SDK v207 or later.
- OpenXR Plugin 1.17.0 or later.
- An MCP-compatible AI coding agent.

The following guides cover setup and day-to-day use of Meta XR Operator:

- [Getting started](https://developers.meta.com/vr/documentation/unity/meta-xr-operator/getting-started/): Install the Core SDK, enable the API layer, and connect your first agent.
- [Connecting AI agents (standalone)](https://developers.meta.com/vr/documentation/unity/meta-xr-operator/connecting-ai-agents/): Set up Meta XR Operator from the standalone distribution and connect an agent, without requiring a Unity project.
- [Registering custom tools](https://developers.meta.com/vr/documentation/unity/meta-xr-operator/custom-tools/): Expose your own app-specific tools to agents from the OpenXR API layer or the Unity C# API.
- [Using with Meta XR Simulator](https://developers.meta.com/vr/documentation/unity/meta-xr-operator/xr-simulator/): The recommended desktop workflow for fast iteration.
- [Using with Meta Quest](https://developers.meta.com/vr/documentation/unity/meta-xr-operator/quest/): Build, deploy, and connect to a Meta Quest headset over ADB port forwarding.

Support and legal

English (US)

© 2026 Meta
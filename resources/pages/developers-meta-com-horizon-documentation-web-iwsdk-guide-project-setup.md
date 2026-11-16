# Chapter 1: Project Setup | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/web/iwsdk-guide-project-setup
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 4, 2026

IWSDK projects use Vite, Three.js, and an Entity Component System (ECS). The project generator creates a working starter with a project manifest, a native scene, an asset catalog, and example systems.

Install the following software before you create a project:

- Node.js `20.19` or later in the Node 20 line, `22.12` or later in the Node 22 line, or Node 24 or later
- A current version of Chrome, Edge, Firefox, or Safari
- npm, which is included with Node.js

A headset is optional for initial development. The development server includes browser-based XR emulation.

Run the project generator:

npm create @iwsdk@latest

The generator first asks for a project name.

Select one of the following targets:

- **Virtual reality**: Starts inside an authored virtual environment.
- **Mixed reality / passthrough**: Starts with virtual content in the physical environment.
- **Desktop 3D**: Starts in a desktop browser without an immersive session.

The target initializes compatible world and WebXR settings. You can edit those settings later in `iwsdk.config.json`.

Select **Create with recommended settings** to use the defaults for the selected target.

Select **Customize setup** to choose:

- TypeScript or JavaScript
- Whether to enable each top-level feature available for the selected target
- Whether to initialize a Git repository
- Whether to install dependencies immediately

The available feature choices depend on the target. They can include locomotion, grabbing, physics, room surfaces and anchors, and real-world placement.

When locomotion is enabled, the generator automatically enables locomotion worker execution for virtual reality and Desktop 3D projects. It also enables browser locomotion controls for Desktop 3D projects. These two settings are derived from the target and locomotion choices; **Customize setup** does not prompt for them.

A generated TypeScript project has the following core structure:

my-iwsdk-app/
├── iwsdk.config.json
├── index.html
├── package.json
├── public/
│   ├── scenes/
│   │   └── main.iwsdk.scene.json
│   └── ui/
│       └── welcome.uikitml
├── src/
│   ├── assets.ts
│   ├── components.ts
│   ├── index.ts
│   ├── panel.ts
│   ├── robot-component.ts
│   └── robot.ts
├── tsconfig.json
└── vite.config.ts

The corresponding JavaScript starter uses `.js` files instead of `.ts` files.

The main files have these responsibilities:

- `iwsdk.config.json`: Selects the active scene and asset/component modules, and stores serializable world and emulator options.
- `public/scenes/main.iwsdk.scene.json`: Stores authored hierarchy, transforms, resources, environment, and component values.
- `src/assets.ts`: Exports the asset catalog used by the runtime and native scene editor.
- `src/components.ts`: Exports custom component definitions used by the runtime and native scene editor.
- `src/index.ts`: Creates the world and registers application systems.
- `public/ui/welcome.uikitml`: Contains the starter spatial UI markup.
- `vite.config.ts`: Registers the IWSDK development plugin.

The generated entry point imports the project options provided by Vite:

```
import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { PanelSystem } from './panel.js';
import { RobotSystem } from './robot.js';
World.create(
  document.getElementById('scene-container') as HTMLDivElement,
  projectOptions,
).then((world) => {
  world.registerSystem(RobotSystem);
  world.registerSystem(PanelSystem);
});
```
Keep serializable project configuration in `iwsdk.config.json`. Keep systems, callbacks, procedural values, and other executable behavior in JavaScript or TypeScript.

If you asked the generator to install dependencies, enter the project directory and start the session:

cd my-iwsdk-app
npm run dev

If you skipped installation, run `npm install` first.

The `dev` script starts an IWSDK-managed development session. Use the runtime URL reported by the command because Vite selects the available port.

The starter also provides these commands:

- `npm run dev:status`: Shows the current runtime URL, port, and adapter state.
- `npm run dev:down`: Stops a managed session that is running in the background.
- `npm run build`: Creates a production build.
- `npm run preview`: Serves the production build locally.
- `npm run typecheck`: Type-checks a TypeScript starter.

- [Configure the project manifest](https://developers.meta.com/vr/documentation/iwsdk/guides/01a-project-manifest/)
- [Add a minimal scene object](https://developers.meta.com/vr/documentation/iwsdk/guides/01b-minimal-scene/)
- [Test the experience](https://developers.meta.com/vr/documentation/iwsdk/guides/02-testing-experience/)
- [Use the native scene editor](https://developers.meta.com/vr/documentation/iwsdk/guides/09-native-scene-editor/)

For the generated templates and examples, see the[IWSDK repository](https://github.com/facebook/immersive-web-sdk).

Support and legal

English (US)

© 2026 Meta
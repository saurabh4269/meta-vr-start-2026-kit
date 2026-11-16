# Chapter 1: Project Setup | Immersive Web SDK

> Source: https://iwsdk.dev/guides/01-project-setup.html
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

# Chapter 1: Project Setup [](https://iwsdk.dev#chapter-1-project-setup)

Welcome to the Immersive Web SDK! In this first chapter, you'll learn how to create your first WebXR project from scratch. By the end of this chapter, you'll have a working IWSDK project with all dependencies installed and a development server running.

## What You'll Build [](https://iwsdk.dev#what-you-ll-build)

Throughout this getting started guide, you'll progressively build an interactive WebXR experience that includes:

- 3D objects and environments
- Interactive grabbable elements
- Player movement and navigation
- Spatial user interfaces
- Professional lighting and effects

But first, let's get your development environment set up!

## Prerequisites [](https://iwsdk.dev#prerequisites)

Before we begin, make sure you have:

- **Node.js** (version 20.19.0 or higher) - [Download here](https://nodejs.org/)
- **A modern web browser** (Chrome, Edge, Firefox, or Safari)
- **Basic familiarity** with command line/terminal
- **Basic knowledge of JavaScript/TypeScript** (we'll teach you the WebXR and 3D parts!)

### Optional but Highly Recommended [](https://iwsdk.dev#optional-but-highly-recommended)

- **A WebXR-compatible headset** (Meta Quest, HTC Vive, etc.) for testing your experience immersively. While not strictly required thanks to IWER (our WebXR emulator), having a physical headset provides the best testing experience.

### Native Scene Editor (Optional) [](https://iwsdk.dev#native-scene-editor-optional)

IWSDK includes a native scene JSON workflow for visual scene composition. This tutorial starts with code so you can learn the runtime fundamentals first. If you want to place assets visually later, continue with [Chapter 9: Native Scene Editor](https://iwsdk.dev/09-native-scene-editor.html) after completing the core tutorial.

## Creating Your First Project [](https://iwsdk.dev#creating-your-first-project)

The fastest way to get started with IWSDK is using our interactive project generator. Open your terminal and run:

`npm create @iwsdk@latest`
This command will download and run the latest version of our project creation tool, which will guide you through setting up your project with the right configuration for your needs.

## Understanding the Setup Questions [](https://iwsdk.dev#understanding-the-setup-questions)

The create tool will ask you several questions to customize your project. The exact questions depend on your choices, so let's walk through the complete flow. **Note**: Some questions are only asked for VR or AR experiences, which we'll call out clearly.

### Project Name [](https://iwsdk.dev#project-name)

`Project name (iwsdk-app)`
This will be the name of your project folder and will also be used in your `package.json`. Choose something descriptive for your project. If you're just following along with this tutorial, you can use the default `iwsdk-app` or something like `my-first-xr-app`.

### Language Choice [](https://iwsdk.dev#language-choice)

```
Which language do you want to use?
❯ TypeScript
  JavaScript
```
- **TypeScript**: Provides type safety, better IDE support, and catches errors at development time. Recommended for most projects.
- **JavaScript**: Simpler setup, no compilation step, good for quick prototypes.

We recommend **TypeScript** for this tutorial as it provides better development experience and catches common mistakes early.

### Experience Type [](https://iwsdk.dev#experience-type)

```
What type of experience are you building?
❯ Virtual Reality
  Augmented Reality
```
- **Virtual Reality**: Creates a fully immersive virtual environment. Users will be completely immersed in your 3D world.
- **Augmented Reality**: Overlays digital content onto the real world. Users can see virtual objects in their physical space.

For this tutorial, we recommend choosing **VR** as it provides a more straightforward introduction to 3D concepts and spatial interactions.

### WebXR Features [](https://iwsdk.dev#webxr-features)

Next, you'll be asked about various WebXR features. Each feature has three options:

- **No**: Don't include this feature
- **Optional**: Include the feature but make it work if not available
- **Required**: Require this feature (experience won't work without it)

#### For VR Experiences: [](https://iwsdk.dev#for-vr-experiences)

- **Enable Hand Tracking?** - Allows users to use their hands instead of controllers
- **Enable WebXR Layers?** - Advanced rendering optimization for better performance

#### For AR Experiences (additional options): [](https://iwsdk.dev#for-ar-experiences-additional-options)

- **Enable Hand Tracking?** - Same as VR
- **Enable Anchors?** - Persistent positioning of objects in real world
- **Enable Hit Test?** - Detecting surfaces in the real world
- **Enable Plane Detection?** - Finding flat surfaces like floors, walls, tables
- **Enable Mesh Detection?** - Detailed 3D understanding of real-world geometry
- **Enable WebXR Layers?** - Same as VR

For this tutorial, the default choices work well. You can always change these later.

### Core Features [](https://iwsdk.dev#core-features)

#### Locomotion (VR Only) [](https://iwsdk.dev#locomotion-vr-only)

`Enable locomotion? (Y/n)`
Locomotion allows users to move around in your virtual world using controllers.

- **Yes**: Include movement systems (teleport, smooth movement, turning)
- **No**: Users stay in one place (good for seated experiences)

If you choose Yes, you'll get a follow-up question:

```
Deploy locomotion engine on a Worker? (recommended for performance)
❯ Yes (recommended)
  No
```
Workers run locomotion calculations on a separate thread for better performance. Choose **Yes** unless you have specific reasons not to.

#### Scene Understanding (AR Only) [](https://iwsdk.dev#scene-understanding-ar-only)

`Enable Scene Understanding (planes/meshes/anchors)? (Y/n)`
Scene Understanding helps your AR app understand the real world around it.

- **Yes**: Include systems for detecting surfaces, objects, and spatial anchors
- **No**: Basic AR without advanced world understanding

#### Grabbing (Both VR and AR) [](https://iwsdk.dev#grabbing-both-vr-and-ar)

`Enable grabbing (one/two-hand, distance)? (Y/n)`
Grabbing lets users pick up and manipulate objects in your experience.

- **Yes**: Include one-handed, two-handed, and distance grabbing systems
- **No**: Objects can't be grabbed or moved by users

Recommended: **Yes** for interactive experiences.

#### Physics Simulation [](https://iwsdk.dev#physics-simulation)

`Enable physics simulation (Havok)? (y/N)`
Physics simulation adds realistic object behavior (gravity, collisions, etc.).

- **Yes**: Objects fall, bounce, and collide realistically
- **No**: Simpler behavior, better performance

Default is **No** because physics adds complexity. You can enable it later if needed.

### Scene Composition [](https://iwsdk.dev#scene-composition)

New projects include native scene JSON under `public/scenes/`. You can load that scene directly from `World.create`, edit it through the development editor, or keep building entities in code when procedural behavior is a better fit.

IWSDK loads 3D model assets as GLTF or GLB. Convert source formats such as FBX or OBJ before adding them to `src/assets.ts`; Chapter 4 covers the supported asset types and conversion workflow.

### Development Setup [](https://iwsdk.dev#development-setup)

#### Git Repository [](https://iwsdk.dev#git-repository)

`Set up a Git repository? (Y/n)`
Recommended: **Yes**. This initializes a Git repository for version control.

#### Install Dependencies [](https://iwsdk.dev#install-dependencies)

`Install dependencies now? (We will print the command to start the dev server.) (Y/n)`
Recommended: **Yes**. This runs `npm install` automatically and shows you the command to start the dev server.

## Project Structure Overview [](https://iwsdk.dev#project-structure-overview)

Once the project is created, you'll see a structure like this:

```
my-iwsdk-app/
├── iwsdk.config.json   # Scene, modules, serializable world/dev authority
├── src/
│   ├── index.ts         # World creation and explicit system registration
│   ├── assets.ts        # Complete runtime/editor asset catalog
│   ├── components.ts    # Custom component declarations
│   ├── robot.ts         # Example custom component and system
│   ├── panel.ts         # UI panel interaction system
│   └── scene-assets/
│       ├── studio.scene-asset.ts # Starter studio props built in code
│       └── decor.scene-asset.ts  # Background furniture built in code
├── public/
│   ├── scenes/
│   │   └── main.iwsdk.scene.json # Authored hierarchy and component values
│   ├── audio/           # Audio files (.mp3, .wav, etc.)
│   │   └── chime.mp3
│   └── ui/
│       ├── welcome.uikitml  # Runtime-loaded spatial UI markup
│       └── label-*.uikitml  # Station labels
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Build configuration with IWSDK plugins
└── index.html           # HTML entry point
```
### Key Files Explained [](https://iwsdk.dev#key-files-explained)

- **`iwsdk.config.json`**: The committed project authority shared by Vite, runtime, and editor. It selects the scene and asset/component modules and stores JSON-safe world and emulator options.
- **`src/index.ts`**: Ordinary application logic. It passes `virtual:iwsdk-project` to `World.create()` and keeps complete, typed system registration calls in code.
- **`src/assets.ts`** / **`src/components.ts`**: The exact catalogs consumed by both runtime and editor.
- **`src/robot.ts`** & **`src/panel.ts`**: Example custom components and systems showing how to create interactive behaviors.
- **`src/scene-assets/studio.scene-asset.ts`**: The starter's floor, stage, plinths, and the dark pieces you can grab and spin, built in code so the starter downloads no extra models. Delete them together with their `src/assets.ts` entries and scene nodes when you replace the starter content. The sky, the floor's fade into it, and the soft shadows are not code: they are the `DomeGradient` on the scene root and the `DomeFade` and `ContactShadow` (in AR, `ShadowCatcher`) components on scene nodes, which you edit in the editor.
- **`src/scene-assets/decor.scene-asset.ts`**: The marble sculpture, sideboard, and floor lamp behind the VR and Desktop 3D studio, also built in code. Delete this file, the `gallery-set` and `sideboard-set` entries in `src/assets.ts`, and their scene nodes to clear the background.
- **`public/ui/welcome.uikitml`**: Spatial UI markup parsed directly by the runtime for the 3D interface panel. The `label-*.uikitml` files are the numbered station labels. We'll learn more about UIKitML in [Chapter 10: Spatial UI with UIKitML](https://iwsdk.dev/10-spatial-ui-uikitml.html).
- **`public/scenes/main.iwsdk.scene.json`**: Static scene hierarchy, transforms, assets, environment, and component values.
- **`public/audio/`**: Audio files used for sound effects and spatial audio.
- **`vite.config.ts`**: Build configuration with bare `iwsdkDev()`; project metadata does not need to be duplicated here.

## Starter Dev Commands [](https://iwsdk.dev#starter-dev-commands)

Fresh starters ship the `iwsdk` CLI through `@iwsdk/cli`, so the default commands are:

- `npm run dev` starts the CLI-managed dev session, opens the app, and keeps the terminal attached; a session already running for the project is stopped first
- `npm run dev:runtime` is the internal runtime script the CLI launches
- `npx @iwsdk/cli dev status` shows the current runtime URL/port and adapter state
- `npx @iwsdk/cli dev down` stops the managed runtime if you started it in the background

The starter's configured port (8081) is the runtime's address, so an occupied port stops `dev up` with an error instead of moving to another port. Stop the other process or change `server.port`. Treat the runtime URL reported by the CLI as the source of truth instead of hardcoding a port.

## What's Next [](https://iwsdk.dev#what-s-next)

Perfect! You now have a complete IWSDK project with all dependencies installed and a clear understanding of the project structure.

In Chapter 2, we'll launch your development server and learn how to test your WebXR experience both in a physical headset and using the built-in emulator on your computer.
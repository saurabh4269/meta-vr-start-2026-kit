# Chapter 6: Built-in Interactions | Immersive Web SDK

> Source: https://iwsdk.dev/guides/06-built-in-interactions.html
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

# Chapter 6: Built-in Interactions [](https://iwsdk.dev#chapter-6-built-in-interactions)

Now that your scene looks professional with environment and lighting, it's time to make it interactive. This chapter starts with the shared pointer path that works in browser 3D, then shows how to enable grabbing and locomotion for XR.

## How Input Works in IWSDK [](https://iwsdk.dev#how-input-works-in-iwsdk)

IWSDK provides a comprehensive input system that handles browser canvas pointers, keyboard, standard browser gamepads, XR controllers, hands, and various interaction patterns. The input stack includes:

- **Browser pointer events** - Mouse/touch events from the renderer canvas when `input.canvasPointerEvents` is enabled
- **XR pointer events** - Ray, grab, and poke interactions from controllers and hands, plus gaze targeting with hand-pinch selection
- **Keyboard and gamepad state** - `world.input.keyboard`, `world.input.browserGamepads`, and `world.input.xr.gamepads`
- **Input actions** - `world.input.actions` maps low-level devices to framework intent such as locomotion movement and jump
- **Built-in systems** - XR grab and locomotion work out of the box

**Interaction Patterns**: Browser canvas clicks and XR rays both flow through pointer events and can set ECS `Hovered` / `Pressed` tags on interactable entities. **Grabbing** is an XR spatial interaction built on pointer events. **Locomotion** uses action-backed input: XR thumbsticks are enabled by default, and browser keyboard/gamepad bindings can be enabled explicitly for first-person browser apps.

Learn More About Input

For a deep dive into IWSDK's input architecture, see [XR Input Concepts](https://iwsdk.dev/concepts/xr-input/). For gaze priority, fallback, visual feedback, and testing, see [Gaze and Pinch](https://iwsdk.dev/concepts/xr-input/gaze.html).

## Enabling Built-in Systems [](https://iwsdk.dev#enabling-built-in-systems)

Grab and locomotion are **built-in systems** that you enable via the `features` flag in `World.create()`. No additional setup required - just enable them and start adding components to objects.

## Browser Pointer Interaction [](https://iwsdk.dev#browser-pointer-interaction)

Canvas pointer forwarding is enabled by default. Add `RayInteractable` to an entity and react to `Hovered` or `Pressed` in a system to support both browser clicks and XR rays through the same ECS path.

```
World.create(document.getElementById('scene-container'), {
  xr: false,
  input: { canvasPointerEvents: true },
}).then((world) => {
  const cube = new Mesh(
    new BoxGeometry(0.4, 0.4, 0.4),
    new MeshStandardMaterial({ color: 0x3355ff }),
  );
  world.createTransformEntity(cube).addComponent(RayInteractable);
});
```
Use browser pointer interaction for selection, hover, and pressed states. Use XR grab and poke components when you need 6DoF spatial manipulation.

## Enabling Grab and Locomotion [](https://iwsdk.dev#enabling-grab-and-locomotion)

First, update your `World.create()` call to enable these features:

```
// Update your existing World.create() call in src/index.ts
World.create(document.getElementById('scene-container'), {
  assets,
  xr: {
    sessionMode: SessionMode.ImmersiveVR,
    features: { handTracking: true },
  },
  features: {
    grabbing: true, // Enable grab system
    locomotion: true, // Enable locomotion system
    // ... other existing features
  },
}).then((world) => {
  // ... your existing setup
});
```
That's it! IWSDK automatically sets up ray pointers, grab pointers, and locomotion controls. Controllers and hands will appear automatically, and the input systems start working immediately.

## Making Objects Grabbable [](https://iwsdk.dev#making-objects-grabbable)

With grabbing enabled, you can add grab components to any object. IWSDK provides several grab components including `TwoHandGrabbable` for complex manipulation, but we'll focus on the two most commonly used types:

### OneHandGrabbable - Direct Manipulation [](https://iwsdk.dev#onehandgrabbable-direct-manipulation)

For objects you grab and move directly with one input:

```
// Make your existing robot grabbable
const { scene: robotMesh } = AssetManager.getGLTF('robot');
robotMesh.position.set(-1.2, 0.95, -1.8);
robotMesh.scale.setScalar(0.5);
world
  .createTransformEntity(robotMesh)
  .addComponent(RayInteractable) // Makes it interactive
  .addComponent(OneHandGrabbable, {
    // Makes it grabbable with one hand
    translate: true, // Can move it around
    rotate: true, // Can rotate it
  });
```
With hand tracking, a pinch grabs OneHandGrabbable and TwoHandsGrabbable objects: the grab system forwards hand pinch to the squeeze action it uses for controllers. This is on by default. To require the physical squeeze button instead, set `useHandPinchForGrab` to `false`:


```
// Update your existing World.create() call in src/index.ts
World.create(document.getElementById('scene-container'), {
  assets,
  xr: {
    sessionMode: SessionMode.ImmersiveVR,
    features: { handTracking: true },
  },
  features: {
    grabbing: { useHandPinchForGrab: false }, // Only the squeeze button grabs
    // ... other existing features
  },
}).then((world) => {
  // ... your existing setup
});
```
### DistanceGrabbable - At-a-Distance Interaction [](https://iwsdk.dev#distancegrabbable-at-a-distance-interaction)

For objects you can grab, scale, and manipulate from far away:

```
// Make the plant grabbable at a distance
const { scene: plantMesh } = AssetManager.getGLTF('plantSansevieria');
plantMesh.position.set(1.2, 0.85, -1.8);
world
  .createTransformEntity(plantMesh)
  .addComponent(RayInteractable)
  .addComponent(DistanceGrabbable, {
    translate: true,
    rotate: true,
    scale: true, // Can also resize it
  });
```
**That's all you need!** Point at objects with your controllers, pull the trigger to grab them, and move them around naturally.

## Setting Up Locomotion [](https://iwsdk.dev#setting-up-locomotion)

With locomotion enabled, you need to tell IWSDK which surfaces can be walked on by adding the `LocomotionEnvironment` component:

### Making Your Environment Walkable [](https://iwsdk.dev#making-your-environment-walkable)

```
// Make your desk environment walkable
const { scene: envMesh } = AssetManager.getGLTF('environmentDesk');
envMesh.rotateY(Math.PI);
envMesh.position.set(0, -0.1, 0);
world.createTransformEntity(envMesh).addComponent(LocomotionEnvironment, {
  type: EnvironmentType.STATIC, // Static environment for collision
});
```
### How Locomotion Works [](https://iwsdk.dev#how-locomotion-works)

Once enabled, locomotion works automatically with standard VR controls:

- **Left thumbstick**: Walk forward/backward, strafe left/right
- **Right thumbstick**: Snap turn (comfortable) or smooth turn
- **Teleportation**: Point and click to teleport (if enabled)

The locomotion system handles collision detection, ground snapping, and comfortable movement speeds automatically.

### Browser Locomotion [](https://iwsdk.dev#browser-locomotion)

For first-person browser apps, opt into browser action bindings instead of wiring systems directly to keys:

```
World.create(document.getElementById('scene-container'), {
  xr: false,
  features: {
    locomotion: {
      browserControls: true,
    },
  },
});
```
This maps WASD/arrow keys, Space, and standard browser gamepads into locomotion actions. IWSDK still does not own your browser camera controls: pointer lock, touch look, orbit, follow, and third-person cameras remain app-authored. In first-person browser apps, rotate `world.camera` and let locomotion move `world.player`.

Learn More About Locomotion

For detailed locomotion configuration and movement types, see [Locomotion Concepts](https://iwsdk.dev/concepts/locomotion/).

## Complete Interactive Setup [](https://iwsdk.dev#complete-interactive-setup)

Here's how to add both grab and locomotion to your existing starter app:

```
// Update your src/index.ts with these additions:
import {
  AssetManager,
  AssetManifest,
  AssetType,
  EnvironmentType,
  RayInteractable,
  LocomotionEnvironment,
  OneHandGrabbable,
  DistanceGrabbable,
  SessionMode,
  World,
} from "@iwsdk/core";
// ... existing assets and World.create setup with features enabled ...
World.create(/* ... */, {
  features: {
    grabbing: true,
    locomotion: true,
    // ... other features
  },
}).then((world) => {
  // ... existing camera and environment setup ...
  // Make environment walkable
  const { scene: envMesh } = AssetManager.getGLTF("environmentDesk");
  envMesh.rotateY(Math.PI);
  envMesh.position.set(0, -0.1, 0);
  world
    .createTransformEntity(envMesh)
    .addComponent(LocomotionEnvironment, { type: EnvironmentType.STATIC });
  // Make plant grabbable at distance
  const { scene: plantMesh } = AssetManager.getGLTF("plantSansevieria");
  plantMesh.position.set(1.2, 0.85, -1.8);
  world
    .createTransformEntity(plantMesh)
    .addComponent(RayInteractable)
    .addComponent(DistanceGrabbable);
  // Make robot grabbable with one hand
  const { scene: robotMesh } = AssetManager.getGLTF("robot");
  robotMesh.position.set(-1.2, 0.95, -1.8);
  robotMesh.scale.setScalar(0.5);
  world
    .createTransformEntity(robotMesh)
    .addComponent(RayInteractable)
    .addComponent(OneHandGrabbable);
  // ... rest of your existing setup
});
```
## What's Next [](https://iwsdk.dev#what-s-next)

Excellent! Your VR scene is now fully interactive. Users can grab objects, move them around, and walk through your environment. In Chapter 7, we'll learn how to create your own custom systems and components to add unique behaviors to your WebXR experience.

You'll learn how to:

- Create custom components to store data
- Write systems that react to entities with specific components
- Implement custom game logic and behaviors
- Use queries to find entities efficiently
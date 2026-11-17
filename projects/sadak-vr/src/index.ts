import { DepthSensingSystem, World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { SadakSystem } from './game/director.js';
import { PanelSystem } from './panel.js';

World.create(
  document.getElementById('scene-container') as HTMLDivElement,
  projectOptions,
).then((world) => {
  // Real-world depth lets your real table hide what's behind it (Quest 3 / 3S); a no-op elsewhere.
  world.registerSystem(DepthSensingSystem, {
    configData: { enableDepthTexture: true, enableOcclusion: true, useFloat32: true, blurRadius: 20 },
  });
  world.registerSystem(PanelSystem);
  world.registerSystem(SadakSystem);
});

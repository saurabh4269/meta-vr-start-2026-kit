import { AssetType, defineAssets } from '@iwsdk/core';

const publicAssetUrl = (filePath: string): string =>
  `${import.meta.env.BASE_URL}${filePath.replace(/^\/+/u, '')}`;

const panel = (file: string, name: string) => ({ url: publicAssetUrl(`ui/${file}`), type: AssetType.UIKitML, name });

// The street, vendors and goods are built procedurally at runtime (src/world/*).
// Panels: Sadak's title screen, its Errands HUD, the dialogue result row,
// the first-meeting card, the ride bar and the district finale.
const character = (id: string, name: string, first = false) => ({ url: publicAssetUrl(`humans/char-${id}.glb`), type: AssetType.GLTF, priority: first ? ('critical' as const) : ('background' as const), name });

// The six errand hosts as real characters (tools/humans/build_character.py: MakeHuman CC0 bodies,
// textured skin, fitted clothes and hair from MakeHuman's CC0 packs, face morphs; SADAK's attireFor colours).
// Raju comes first in the day, so he loads before the world starts; the rest stream in.
export default defineAssets({
  'char-auto': character('auto', 'Raju (auto driver)', true),
  'char-kachori': character('kachori', 'Vikram (kachori)'),
  'char-flowers': character('flowers', 'Sunita (flowers)'),
  'char-bus': character('bus', 'Suresh (conductor)'),
  'char-paranthe': character('paranthe', 'Mohan (paranthe)'),
  'char-minaret': character('minaret', 'Imran (caretaker)'),
  'welcome-panel': panel('welcome.uikitml', 'Welcome Panel'),
  'hud-panel': panel('hud.uikitml', 'Errands HUD'),
  'actions-panel': panel('actions.uikitml', 'Dialogue Actions'),
  'intro-panel': panel('intro.uikitml', 'Errand Intro Card'),
  'ride-panel': panel('ride.uikitml', 'Ride Bar'),
  'finale-panel': panel('finale.uikitml', 'District Finale'),
});

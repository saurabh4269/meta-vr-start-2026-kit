import { AssetType, defineAssets } from '@iwsdk/core';

const publicAssetUrl = (filePath: string): string =>
  `${import.meta.env.BASE_URL}${filePath.replace(/^\/+/u, '')}`;

const panel = (file: string, name: string) => ({ url: publicAssetUrl(`ui/${file}`), type: AssetType.UIKitML, name });

// The street, vendors and goods are built procedurally at runtime (src/world/*).
// Panels: Sadak's title screen, its Errands HUD, the dialogue result row,
// the first-meeting card, the ride bar and the district finale.
export default defineAssets({
  'welcome-panel': panel('welcome.uikitml', 'Welcome Panel'),
  'hud-panel': panel('hud.uikitml', 'Errands HUD'),
  'actions-panel': panel('actions.uikitml', 'Dialogue Actions'),
  'intro-panel': panel('intro.uikitml', 'Errand Intro Card'),
  'ride-panel': panel('ride.uikitml', 'Ride Bar'),
  'finale-panel': panel('finale.uikitml', 'District Finale'),
});

/**
 * Sadak VR's own ECS components (system-free, so the editor can list them).
 * Interaction itself uses IWSDK's stock components: RayInteractable + PokeInteractable
 * (Hovered / Pressed tags from the InputSystem) and OneHandGrabbable (Grabbed from the GrabSystem).
 */
import { createComponent, Types } from '@iwsdk/core';

/** A reply card (or finale choice): poke it or point and pinch at it to say it. */
export const ReplyChoice = createComponent('ReplyChoice', {
  slot: { type: Types.Int8, default: 0, label: 'Card slot', min: 0, max: 2 },
});

/** The mic orb: press to start or stop recording a spoken reply. */
export const MicButton = createComponent('MicButton', {});

/** A rupee coin in the player's pouch: pinch it, carry it, drop it on the vendor's plate. */
export const Coin = createComponent('Coin', {
  value: { type: Types.Int16, default: 10, label: 'Rupees' },
  slot: { type: Types.Int8, default: 0, label: 'Pool index' },
});

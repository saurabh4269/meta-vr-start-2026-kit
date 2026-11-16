# Adapting from controllers | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/design/hands-adapting-from-controllers/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Design

Updated: Sep 9, 2026

If your app was built for Touch controllers, adding hand tracking is not a trivial remapping exercise. Controllers include multiple distinct inputs per hand, some of which can be used simultaneously. Hands offer fewer inputs, which generally cannot be used simultaneously. While many core VR interactions translate seamlessly from controllers to hands, others do not. Follow this guide for best practices on adapting a VR app built for Touch controllers to also support hand interactions.

For new apps, you should design your experience thinking about hand tracking from the start, following design [best practices](https://developers.meta.com/vr/design/hands-best-practices/) for hand tracking. However, in some cases, you may have built a VR app for controllers that you decide you want to update to also support hand tracking. This guide is to help you think through how to adapt the interactions in your app to work well for hands.

Start from what the user is trying to **accomplish**, not from the button they used to press. Below is a table of common VR interactions with established best practice translations between controllers and hands.

| Interaction | Controller | Hands | 
|---|---|---|
| Selection (direct) | Touch with virtual hand index finger tip | Touch with index finger tip | 
| Selection (indirect) | Trigger button | Index pinch | 
| Grab/Hold (direct and indirect) | Grab button | Palm grab or hold pinch | 
| Teleport | Thumbstick down | Microgesture thumb tap | 
| Turn | Thumbstick left/right | Microgesture thumb swipe | 
| Open/Close system menu | Menu button | System gesture right hand | 
| Open/Close app menu | Menu button | System gesture left hand | 

The system gesture in the table above is a palm-up pinch: the palm faces up and the thumb and index finger meet. See [Input hierarchy](https://developers.meta.com/vr/design/interactions-input-hierarchy/) for how the system routes it.

Note that the four face buttons have no default hands equivalent by design. If your app relies on them, consider redesigning or simplifying the underlying action before mapping these actions to hand gestures.

The mappings above are system-level conventions that users already know, so they carry no learning cost. Your own app-specific actions are a different case. When each controller input is translated directly into its own custom hand gesture, four failure modes appear consistently in compatibility reviews.

- **Gestures become too similar.** As the gesture set grows, poses converge and the runtime cannot reliably distinguish them.
- **The wrong gesture activates.** Overlapping or adjacent gestures cause accidental triggers mid-interaction.
- **Awkward sequencing.** Users are forced to chain several poses to complete one action that a controller did in a single press.
- **Too much to remember.** A large gesture vocabulary has no physical affordance to fall back on, unlike a labeled button.

🎓 See this workflow in depth

The [Adapting an Existing Game for Hands](https://app.dataprotocol.com/container/257?utm_source=mh_docs&utm_medium=link&utm_campaign=HIG-adapting-from-controllers&utm_id=mh) interactive course on Meta VR Academy walks the full adaptation end to end, from deciding whether your game is a candidate to a working hands-only critical path.

List what the user does in your app (grab, rotate, place, confirm, toggle a state, scale, navigate) and note which are essential to the core loop. Ignore the button each one is currently bound to.

Make the core mechanic as direct as the mechanic allows, and use established hand interactions for common actions: pinch for indirect selection, palm grab for holding, index touch for direct contact. These are what users already learned from the system UI, so they cost nothing to teach. See the Interaction SDK overview for [Unity](https://developers.meta.com/vr/documentation/unity/unity-isdk-interaction-sdk-overview/), [Unreal](https://developers.meta.com/vr/documentation/unreal/unreal-isdk-overview/), and [Spatial SDK](https://developers.meta.com/vr/documentation/spatial-sdk/spatial-sdk-isdk-overview/). Available interactions vary by engine.

For every remaining action, ask which applies: **Combine** it with the primary action, for example placement that confirms itself through snapping and alignment feedback instead of a separate confirm gesture; **Automate** it when it does not require a user decision; **Contextualize** it by surfacing the control only when relevant, as a virtual button or panel the other hand can poke; **Remove** it if it is not essential to the experience with hands. Only after exhausting these should you add a new gesture.

Hand input is affected by natural hand movement and tracking variation, so hit targets tuned for controller-driven rays are usually too tight for hands. Extend object colliders beyond the visible control and increase UI button sizes so users can reliably target with hands.

Controllers keep reporting usable input when out of view. Hands lose gesture detection instead: an inferred hand pose can survive, but gestures do not, and a pinch always releases on tracking loss. Define explicit behavior for what happens to a held object when tracking is lost, and how the user recovers. Avoid interactions that require one hand to occlude the other, or that push hands outside the tracking volume.

Any gesture that is not pinch, palm grab, or index touch needs to be taught explicitly. For apps supporting both controllers and hands, adjust onboarding based on the input currently in use, and let users revisit that content later if they switch inputs.

- [Hands](https://developers.meta.com/vr/design/hands/): Explore how hands can be used as an input method for immersive experiences.
- [Limitations and mitigations](https://developers.meta.com/vr/design/hands-limitations-mitigations/): Design and code mitigations for tracking volume, occlusion, lighting, and movement-speed limitations in hand tracking.
- [Microgesture design](https://developers.meta.com/vr/design/design-microgestures/): Guidance on designing microgesture interactions for hands.
- [Input mappings](https://developers.meta.com/vr/design/interactions-input-mappings/): A comprehensive overview of input modalities and their corresponding input mappings.

Support and legal

English (US)

© 2026 Meta
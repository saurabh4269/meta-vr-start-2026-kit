# Accessibility | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/design/accessibility/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Design

Updated: Apr 6, 2026

When leveraged correctly, immersive platforms offer super powers for accessibility.

People of different abilities can feel present with others, enjoy haptics and immersive sound, move easily through virtual spaces, or read live captions of conversations. Spatial technology can even offer sight correction for those with only partial vision loss or conditions like farsightedness.

It’s also important to remember that disabilities aren’t always permanent—they can be temporary or situational. For example, if you happen to break your arm, you might still want to play an immersive game with friends while you heal. Accessibility solutions are not as mature for immersive experiences as they are for 2D devices, but that presents an enormous opportunity for designers and developers to innovate.

This design guidance will continue to be expanded and updated over time. For detailed developer guidelines on accessibility, see our [VRC content](https://developers.meta.com/vr/resources/vrc-quest-accessibility-1/). You can also review the [XRA’S Developers Guide, Chapter Three: Accessibility and Inclusive Design in Immersive Experiences](https://xra.org/research/xra-developers-guide-accessibility-and-inclusive-design/).

There are five disability groups: vision, hearing, speech, motor, and cognition. You’ll see these icons on each section to indicate the groups they affect.

Consider these principles to help build immersive experiences that are accessible for everyone.

Consider people with disabilities from the very start of the design process. Including diverse groups of people with disabilities is essential to make sure that everyone can take control of their experience and engage safely.

People need to be able to set their accessibility preferences early on so they can complete all other actions in a way that works for them. Ensure everyone can access and use an app or experience without assistance.

People with and without disabilities are already using immersive experiences for therapeutic purposes and to do things that are challenging or impossible for them in the physical world. When designing, consider how to create new value for people with disabilities in addition to removing barriers.

Controllers, voice commands, and physical gestures are all ways to interact with immersive experiences. Optimizing inputs and interactions not only improves the experience for those with disabilities but also creates a clearer and more comfortable user experience for everyone.

- Keep the controller scheme simple.
- Reduce required button presses.
- Let people set up and save preferences early on.

- Provide optional remapping of controls on the controller for left and right hands, including for use with only a single controller.
- Offer remapping controls onto alternate controllers, sensors, or keyboards.
- Let people use the experience in a seated, reclining, or stationary position.
- Let people select targets with head gaze and other inputs where possible.
- Include voice assistance. (Consider ways to use [Voice SDK](https://developers.meta.com/vr/blog/presence-platform-voice-sdk-and-passthrough-now-available/) and [wit.ai](https://wit.ai/).)

- Use button highlights to represent controller inputs.
- Provide sounds and haptic feedback.

Hit targets ensure that people can accurately interact with their experience, like pressing virtual buttons. Extra cushion is required in immersive experiences to account for variance in the size, dexterity and movement of people’s hands and bodies.

For example, this could include multiplying an input, such as scaling the position of the controller by twice the distance so that the avatar can fully extend its arms, even if the person is only able to achieve half-arm extension in real life.

- Comfortably-sized hit targets should be a minimum of **22mm x 22mm / 48dp x 48dp / 3˚FOV at 0.42m**. This sizing allows enough space for a user’s finger and accounts for hand tracking movements.
- Add invisible hitslop (the additional space surrounding a UI element that will still trigger an action when touched) to meet or exceed 48 dp if an interactive element is smaller than 48 dp.
- Visual targets can be smaller than their hit targets, but, the smaller the visual target, the more difficult users will perceive hitting it to be. Visual targets should be at least 32 dp x 32 dp.
- When interfaces require a range of motion or hand dexterity to perform input actions, make sure there’s the ability to exaggerate or enlarge the input.

DO add invisible hitslop to meet or exceed 48 dp if needed.

DON'T create hit targets smaller than 48 dp.

Assistive technology includes any hardware devices or software features designed to support users with disabilities. Such tools are a major area of opportunity to make immersive experiences usable for everyone, as they’re often more complex than 2D experiences and industry resources are in their infancy. Focus on developing fundamental tools, such as captions and screen reader support, tailored to the unique aspects of spatial design.

- Support third-party integrations and devices when possible.
- Aim to provide the tools available on 2D devices, like captions, while accounting for the unique considerations of immersive experiences.

Do you prefer to always watch TV with captions? [You’re in the majority if so](https://www.boia.org/blog/gen-z-more-likely-to-use-captions-when-viewing-video-content). Captions offer a true [curb-cut effect](https://ssir.org/articles/entry/the_curb_cut_effect) because they benefit users beyond the disability cohorts they were intended for, improving comprehension, focus, retention, and information processing for all. Many people rely on captioning to understand audio through text, while others use it to better process the information around them, regardless of hearing ability.

This is especially critical for immersive experiences, where spatial audio cues people on where to look and who is speaking. The captioning needs are unique from other devices, so designers and engineers must innovate solutions that often do not yet exist. Below are best practices established so far, which will continue to be updated. Recommendations are still being developed and implemented for captions in immersive experiences across the industry.

- Start with captions at about half the distance of the far-field or 1 meter away, but give people the option to move them.
- Try options like leashing captions to head movement to ensure people don’t need to move in an uncomfortable way to read or feel increased nausea.
- Captions should be an overlay that’s visible at all times and never obstructed by spatial elements.
- Try placing captions at the top or bottom of their 40-degree field of view (FOV). Pick a placement that’s best to avoid obscuring tasks.
- Do not attach captions to the personal UI. If needed, gradually shift them above or below so they don’t obstruct the view of the UI or roomscale elements.

DO place captions at about half the distance of the far-field or 1 meter away, but give people the option to move them.

DON'T place captions too far back.

DO place captions where they won't obscure tasks.

DON'T obstruct a user's task or important information.

- Sync captions as closely to real-time audio as possible.
- Allow pauses to give readers a break.
- Either display the words in unison with the dialogue or display complete sentences as they are spoken.
- Make sure the sentences are provided in easily understood blocks, such as 2-3 sentences at a time.
- When a new line is added, all previous captions should “roll up” so that the new line is visible within the FOV. This animation should last approximately 0.5s and use an ease-out animation curve.
- If there’s a pause between two pieces of speech, the gap must be a minimum of 1 second, preferably 1.5 seconds. Anything shorter produces a jerky effect. Try to not use gaps if the time can be used for text.
- A new line should be added after 1.5 seconds has transpired without speech and there is new text to display.

- Make sure captions clearly indicate who is speaking. Typically, captioning more than 4 people is too confusing and not recommended.
- Depending on the experience, consider a line break in the captions for each new speaker.
- Consider garbling or ignoring audio from speakers with whom the user is not in conversation.
- Use visual cues to direct people towards the source of sound or event. However, consider whether cues may cause confusion when in a crowd or large group setting. Let the user know when someone is trying to get their attention, but avoid overwhelming them with unwanted cues.

DO provide speaker attribution.

DON'T make the user guess who is speaking.

- In social experiences, ensure other users are aware of or can consent to their audio being captioned (required by states and other locales with wiretapping laws).
- Provide several fonts, colors, and 3+ settings for text size (50%, 75%, 100%, 150% and 200% the default size), using 10% of the screen size (for example: FOV) as a baseline. Line and row height should scale appropriately.
- Provide a background box to visually separate captions from the environment and avatars behind it.
- Display a maximum of 32 characters per row and 2 rows of text.
- Words should wrap to the next row and not hyphenate. Words that already contain a hyphen may wrap mid-word.

Meta Horizon OS lets users enable live captions, combine audio into a single channel, adjust audio balance, and control how closed captions appear. To support users who rely on these features:

- Provide audio descriptions for visual-only content.
- Make sure all critical audio has synchronized captions or subtitles.
- Support system live captions by using standard audio APIs.
- Avoid relying solely on audio cues for important information. Pair audio cues with visual or haptic alternatives.

Meta Horizon OS lets users enable voice controls, remap controller actions, and switch interactions for thumbsticks and menu buttons. To support users with limited mobility:

- Make sure all UI elements are reachable through controller navigation.
- Support alternative input methods for gesture-based interactions.
- Avoid interactions that require simultaneous button presses.
- Provide adequate target sizes for interactive elements. Use a minimum of 32x32 dp for visual targets, with a hitbox height of 48 dp for interactive elements like buttons and inputs.

Adequate color contrast helps users with low vision or color blindness read and interact with your app. Follow the WCAG 2.1 minimum contrast ratios:

- **Normal text:** 4.5:1 contrast ratio minimum
- **Large text** (18pt or larger, or 14pt bold): 3:1 contrast ratio minimum
- **UI components and graphics:** 3:1 contrast ratio minimum

- Do not rely solely on color to convey information. Provide patterns, icons, or text labels alongside color indicators.
- Test your app with color correction modes enabled in the accessibility settings.
- Use high contrast color combinations for important UI elements.
- Consider providing a high-contrast theme option.

Meta Horizon OS automatically adjusts text size within your app when a user modifies the text size setting in the accessibility menu. To make sure your app respects these preferences:

- Use scalable units (sp) for text sizes instead of fixed pixel values (dp).
- Avoid setting fixed text sizes in your layouts.
- Test your UI at minimum and maximum font scale settings.
- Make sure text containers can expand without breaking layouts.

Meta Horizon OS includes text-to-speech and screen reader features that let users navigate your app with audio feedback. To make your app compatible:

- Add contentDescription attributes to all interactive elements.
- Provide meaningful descriptions (for example, “Play button” not just “Button”).
- Avoid redundant information. Do not repeat the element role if it is already exposed (for example, do not say “button” in the description if the role is already button).
- Keep contentDescription text concise but descriptive.
- Make sure the logical focus order matches the visual reading order.
- Mark decorative images as not important for accessibility.
- Group related elements using accessibility containers.
- Announce dynamic content changes using AccessibilityEvent.
- Use proper punctuation in content descriptions to control speech pacing.

When users navigate your app with a controller, clear focus indicators help them understand which element is selected.

- All interactive elements must have a visible focus state.
- Focus indicators should have sufficient contrast against the background.
- Focus state should be visually distinct from hover and selected states.
- Make sure focus is never trapped in a single element or region.

- Use a consistent focus indicator style throughout your app.
- Make focus indicators at least 2px thick with high contrast.
- Avoid focus indicators that only change color. Combine with borders or outlines.

Before releasing your app, test these accessibility scenarios on your Meta VR device.

- Enable screen reader (Settings > Experimental) and navigate your entire app.
- Test with text size set to minimum and maximum values.
- Enable color correction and verify all information is still visible.
- Enable text-to-speech and verify all elements are read correctly.
- Test with high contrast mode enabled.

- Enable live captions and verify captions appear for audio content.
- Test with mono audio enabled.
- Verify your app works when device volume is muted.
- Check that all audio cues have visual alternatives.

- Test full app navigation using only the controller.
- Enable voice controls and navigate your app hands-free.
- Test with remapped controller buttons.
- Verify no UI elements require precise pointing or timing.

- Custom views that do not expose accessibility information.
- Focus order that does not match visual layout.
- Interactive elements without contentDescription.
- Timeout-based interactions without extensions.
- Audio-only feedback without visual alternatives.

Use the [accessibility checklist](https://developers.meta.com/vr/design/accessibility-checklist/) to track your app’s accessibility before submission. The checklist separates VRC recommendations (evaluated during Store review) from design best practices, so you can see exactly what the Store checks and what is additional guidance.

Explore more design guidelines and learn how to design great experiences for your app users:

- [Scene understanding](https://developers.meta.com/vr/design/mr-design-scene/): Use the physical environment as a canvas using Scene Understanding.
- [Passthrough](https://developers.meta.com/vr/design/mr-design-passthrough/): Blend virtual objects with the physical environment using Passthrough.
- [Spatial anchors](https://developers.meta.com/vr/design/mr-design-spatial-anchors/): Anchor virtual objects in the physical environment, and provide shared experiences.
- [Health and safety](https://developers.meta.com/vr/design/mr-health-safety-guideline/): Learn how to design safe immersive experiences.

For technical information, start from these development guidelines:

Support and legal

English (US)

© 2026 Meta
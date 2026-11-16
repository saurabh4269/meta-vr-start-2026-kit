# Key considerations | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/design/mr-design-guideline/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Design

Updated: Oct 7, 2025

Designing immersive experiences is exciting and provides many opportunities. Immersive experiences should balance familiarity and innovation, offering stunning content, enhanced capabilities, and thrilling adventures.

These best practices outline design decisions, identified by our researchers, that can enhance user satisfaction.

When starting a design, consider a similar situation or object that exists in the physical world. Use this comparison to guide the design process, and ask how it relates to the problem being solved:

- How would a user do the action in physical space?
- How would a user interact with objects?
- How would those elements interact with a user’s environment?

The following video shows users interacting with familiar items.

**Video 1:** Users don't need to learn how to interact with these familiar virtual objects

By supporting a common, physical-space metaphor and its expected behaviors, it’s possible to create a great user experience. This will also secure usability, because users won’t have to relearn a new type of interaction.

Here are some examples:

- Users should be able to intuitively grab objects or press buttons without relearning (for example, a handle or button).
- Virtual objects should feel grounded and do not fall through walls or fall off the floor.
- Virtual objects should be arranged to match the size and depth of reality.

Even when the experience is rooted in real, familiar experiences, it’s possible to let go of physical limitations and create magical experiences that are impossible in the physical world. Once core mechanics are defined, free the design process from physical-space constraints.

For example:

- Replace sections of the physical environment, creating a magic window or portal into virtual spaces.
- Transition between and bridge physical environments and virtual content/worlds.
- Transcend space and time by bringing remote users into a shared space, either in real-time or asynchronously.
- Give users super powers with multi-modal input, such as hand ray and speech input (for example, grab an object at a distance with a ray cast from the user’s hand).
- Connect virtual content with physical environments (for example, use a virtual switch to control physical lamps).

In the following example, the user can summon an object at a distance.

**Video 2:** This video shows users catch and throwing a virtual ball, and also the split between the physical world and virtual world

In mixed reality experiences with passthrough, use spaces and physical surfaces like walls, tables, and ceilings as the creative canvas. Place virtual content and objects on these surfaces and make them persist like physical objects. Virtual objects can also be made to interact with the environment. For example, have a game character climb a sofa, jump off a table, or hide behind a chair.

While this is simultaneously an exciting new opportunity for designers, it presents a huge design challenge because there is no control over the user’s environment. When designing an experience that uses a particular type of surface, make sure to have alternative options. For example, an environment might not have a sofa or table, or it may not have enough floor space. Design alternative placement options to accommodate this kind of dynamically changing environmental situation.

See [Scene understanding](https://developers.meta.com/vr/design/mr-design-scene/) for more detailed design guidelines.

You never know what will work until it is experienced. Take the time to prototype and test ideas before implementing them. Even if something is carefully designed on a 2D screen, the actual experience itself is often different than what is anticipated. Accordingly, it’s important to experience creations on a Meta VR device as soon as possible. Test and iterate frequently to avoid surprises in behavior.

By placing 2D images or 3D dummy placeholder objects (for example, like a cube in a physical environment), you can experience and gather great insights on many design elements, including optimal size, distance, placement, and overall spatial layout.

Since immersive sessions are typically shorter than PC sessions, and there is an additional hurdle of setting up and wearing the device, it’s crucial to quickly engage users and meet their expectations. Ensure gameplay aligns with promotional materials, avoid lengthy non-interactive cinematics, and provide tutorials that enrich the game context. Also, offer a sense of progression or achievement within the first few minutes to keep users invested.

Provide an animation, video, or mirror to assist visual learning. This is applicable to hand gestures as well as full motion gestures like leaning or putting hands together. Be sure to use the correct terminology to describe the gesture; selecting something with hands is typically a pinch from distance, and a grab or press close up.

Here are some of the crucial elements that need to be considered when designing spatial interactions.

- Object placement
- “Billboarding”: orienting objects for readability and usability
- Size and distance for proper depth perception
- Consistent viewing size with angular scaling
- Support direct and indirect input interactions alike
- Minimize the use of head-locked content
- Use world-locked content for more lifelike experiences
- Locomotion
- Design content with sufficient visual and audio cues
- Design experiences to be spatially responsive
- Design with user safety in mind

When placing virtual information, or content in a space, place it at a comfortable distance and location. In general, we recommend placing objects at a roughly 1 meter distance slightly below the user’s line of sight. In addition, we recommend the following:

- When launching an app, avoid objects that suddenly appear too close or large to the user. Also, provide visual or audio cues to the user when placing objects on surfaces in physical space (for example, tables, walls, and ceilings).
- If an object’s size can be visually overwhelming to the user, consider gradually revealing the object with fade-in animation.
- When placing an object on a table, wall, or other surface, make sure the object is aligned with the surface so that it feels realistic.

In immersive experiences, since users can move freely in space, users can view objects from various angles.

“Billboarding” means making an object rotate and always face the user, regardless of orientation. It is recommended to use billboarding to increase the readability and usability of text labels and/or objects containing important information. When using billboarding, consider using axis constraints to optimize experiences. Consider applying billboarding to the UI. This will allow the user to interact with the UI from any angle.

**Video 3:** Example of annotation labels and description window with billboarding that always face the user

When displaying virtual objects, it’s important to display them at an appropriate size and distance. Getting this wrong can create user confusion.

- Do not place virtual objects behind walls, or other physical objects in physical space. In this case, when the user tries to approach the object, they may injure themselves by colliding with physical objects. Eye fatigue and motion sickness also increase due to incorrect depth information.
- When displaying a modal UI, such as a dialog box or other overlay information, display it with consideration for the depth of virtual objects. When displaying an important dialog as an overlay, virtual content must be dimmed or hidden so that the user does not feel confused regarding the depth of objects.
- When displaying small-sized objects, users can easily get lost. This is because they can move freely and look anywhere in immersive experiences. Therefore, it is recommended to provide clear visual and auditory cues when displaying small-sized objects to guide users.
- When an object bigger than the actual physical space is overlaid on top of the environment, this can lead to confusion about what’s physical and what’s virtual. To avoid this, either make the background of the virtual object non-transparent, effectively hiding the physical-environment behind it, or clip the object so it doesn’t exceed the physical space boundaries.

If certain information needs to be readable at any distance, use angular scaling. For example, UI elements that display important information and/or require user action (for example, dialogs), can be displayed in a constant size, regardless of the display distance, by using angular scaling.

- Ensure readability by applying angular scaling to objects that need to be visible from a distance, such as visual indicators, wayfinding arrows, and annotation labels.
- When scaling up or down based on the distance change, use animations to help the user understand how distance is being changed.
- Apply a min/max size limit to avoid objects moving too close to the user or too far away.

Users expect the ability to interact with objects through various input methods, such as hand tracking and controllers. Accordingly, design to natively support various Meta VR device input methods.

- Consider controller support if more inputs and detailed control are required.
- Allow the users to directly interact with objects to create a more immersive and intuitive experience.
- Design support for ray-casting from hands so users can interact with objects from a distance.

Displaying information around the user’s field of view, like a heads-up display (HUD), is a popular method used in first-person games. However, while using passthrough on a Meta VR device, the information displayed around the user’s eyes can tire them quickly and reduce usability.

- Avoid locking HUD style content to the user’s head movements.
- Anchor information and digital content to a space, or loosely follow the user using smoothing animation.

Increase immersion and realism by fixing virtual objects to physical space. This enables intuitive, spatialized interactions by allowing users to view virtual objects anchored in physical space from various angles.

- When possible, try to keep objects anchored in physical space rather than following the user.
- Use shadows for more realistic object placement.

Unlike in fully immersive experiences, users cannot be “teleported” in physical space. Therefore, apps that provide passthrough, must be designed to prevent “teleporting” users to a space that does not match their physical surroundings.

- In mixed reality experiences with passthrough, do not use teleport to move the user or other content. It can confuse the user’s sense of location and orientation.
- Apps that support both should utilize transitions (for example, fade animations) when switching modes to gradually change the environment and prevent user confusion.

Since virtual objects are blended into the physical environment, while there is no control over the user’s point of view, it is essential to design content with sufficient cues and feedback. This allows users to explore and interact with virtual content in a space without getting lost. Since there is no physical, tactile feedback when interacting with virtual objects, visual cues for states such as “hover” and “pressed” become crucial for quality and usability.

- Provide visual feedback when someone focuses on or hovers over intractable objects.
- Provide audio/visual feedback such as compressing movement, or highlighting on press accompanied by audio feedback.

Users are more likely to stay in an experience when they are physically comfortable at all times.

- Ensure users have the opportunity to practice object interaction in a relaxed, untimed environment.
- Avoid forcing users to bend down to pick up items. Implement a feature to easily retrieve dropped objects and ensure users can easily spot the dropped object on a cluttered floor.
- Avoid displaying motion or forcing the user to physically move around too much while fully immersed. Make sure to define a fixed frame of reference and boundary setup for safety. We recommend anchoring content in the space instead of making it follow the user’s head rotation.
- Display content and text within the users’ field-of-view and prevent the users from having to turn their head.
- Support indirect interactions that let the user interact with objects while staying in a rested position. When using direct interactions, make sure the interactables are not too far away from the users or they have a way to recenter or summon the content to them.
- Expect that approximately half of users will play sitting down, while the other half will prefer standing. Users may also alternate between the two as they tire or become more engaged with the gameplay. Ensure they can enjoy the game in both sitting and standing positions.

Users’ physical environments vary in size, layout, and furnishing. To provide a consistent user experience for everyone, design experiences to be adaptable to different physical environments. Consider the spatial responsiveness of the experience as a whole, not just for each virtual object in isolation.

- Account for a user’s flow through space. Make sure there is adequate and clear space for users to interact with, move around, and move between virtual content, especially for content that cannot be moved.
- The virtual experience must agree with physical environments, taking user safety into consideration. Virtual content should not compel or suggest that the user behave in ways that conflict with their physical environment. Lack of coherence can confuse users, break immersion, and endanger safety.
- Design for a minimally viable environment. Determine the minimum space and surface requirements for experiences, and make sure to design an experience from the ground-up to work well with these constraints.

Even though the user can see their physical space, they can be distracted by virtual objects, which in turn can cause injury. For example, a virtual object may collide with a physical lamp or vase, obscuring it. Or, virtual content may be misplaced behind a wall, causing a user’s hand or body to collide with the wall when trying to interact with it. Accordingly, it is crucial to design experiences to accurately and safely blend virtual content with the user’s physical environment.

See [Health & safety](https://developers.meta.com/vr/design/mr-health-safety-guideline/) for more detailed design guidelines.

Interacting with three-dimensional objects that have volume is both engaging and immersive. However, various types of content such as videos, documents, images, and blueprints remain two-dimensional. For these types of content, displaying and interacting with them in a flat, two-dimensional window is still the most efficient and intuitive approach. Additionally, since people have become accustomed to and efficiently use the two-dimensional user interfaces of computers, smartphones, and tablets over a long period, two-dimensional windows remain essential and important in immersive experiences.

Designing these interfaces requires both drawing on existing interface patterns and understanding the unique constraints and opportunities of the medium. The evolving nature of immersive experiences opens up new solution spaces for interaction and experience design, but also introduces limitations that necessitate careful consideration on a range of issues related to human perception.

**Video 4:** Interacting with 2D UI in space

When displaying 2D UI windows in space, it is recommended to place them at an optimal distance from the user. For example, place the window at around 45 cm away from the user for optimal direct hand interaction experience. If an app is optimized for a larger screen at further distance with indirect interactions, the window can be placed around 1 meter from the user.

If an app supports both hand and controllers, display it around 70 cm from the user and provide a manipulation UI that allows the user to grab, move, and place the window at preferred distance and location. You’ll find similar behaviors in Meta Horizon’s operating system.

Additionally, consider the user’s field of view (FOV) when positioning UI, as their size and placement can impact the user’s experience. For instance, when the virtual keyboard UI window opens, ensure it:

- Doesn’t obstruct the user’s view
- Isn’t placed too low out of the FOV, making it difficult to find

By considering the user’s FOV, create a more comfortable and intuitive interaction experience.

One important thing to remember — since the user can freely move around the space, it’s not possible to control the interaction distance between the user and target object or windows. As described in the section above, ‘Support direct and indirect input interactions alike, don’t prevent users from approaching and directly interacting with the window.

As the user moves away from the window or grabs and moves the window further away with hands or controller ray, it becomes difficult to interact with since the legibility and target size decreases. To improve the usability, angular scaling could be applied to the window which can automatically scale up or down depending on the distance from the user, to keep the legibility and target size.

Provide an affordance for grabbing, moving, and placing the window at user’s preference. Always provide visual cue and feedback that invites the user to comfortably interact with the object.

**Video 5:** Visual feedback for interaction states on UI and interactable contents

Explore more design guidelines and learn how to design great experiences for your app users:

- [Overview](https://developers.meta.com/vr/design/mr-overview/): Learn the basics of designing for mixed reality.
- [Scene understanding](https://developers.meta.com/vr/design/mr-design-scene/): Use the physical environment as a canvas using Scene Understanding.
- [Passthrough](https://developers.meta.com/vr/design/mr-design-passthrough/): Blend virtual objects with the physical environment using Passthrough.
- [Spatial anchors](https://developers.meta.com/vr/design/mr-design-spatial-anchors/): Anchor virtual objects in the physical environment, and provide shared experiences.
- [Health & safety](https://developers.meta.com/vr/design/mr-health-safety-guideline/): Learn how to design safe immersive experiences.

For technical information, start from these development guidelines:

Support and legal

English (US)

© 2026 Meta
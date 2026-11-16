# Best Practices | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/design/hands-best-practices
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Design

Updated: Sep 14, 2026

The following best practices guide the use of hands as inputs and interactions in VR app design and development. They aim to enhance user experience and ensure optimal performance.

🎓 Keeping to a small, consistent set of interactions is what makes hands feel reliable. [Building a Simple, Consistent Interaction Vocabulary](https://app.dataprotocol.com/container/260?utm_source=mh_docs&utm_medium=link&utm_campaign=HIG-hands-best-practices-start-simple&utm_id=mh), a short video on Meta VR Academy, shows how to choose a few dependable actions and reuse them everywhere.

If you are thinking about adding hands inputs it’s best to start designing your experience from a hands-first perspective and avoid adapting a controller-based design. Many interactions require special design considerations to create a high-quality hands experience. Controller interactions like pressing X to pick up an item are easy to learn. However, using hands for these actions can be harder to master and remember. Problems with user orientation, switching between movement and engagement, and targeting items often cause fatigue and frustration.

When prioritizing hands as the primary input method: **Simplicity is key**.

For example, hand inputs should prioritize direct manipulation of physical objects over 2D menu interactions, because [natural interactions](https://developers.meta.com#use-natural-hand-interactions) like grasping, pointing, and gesturing suit hands better. While actions like scrolling will suit controller inputs better.

Leverage real-world hand behaviors for intuitive object manipulation

Users are often more accustomed to performing multiple inputs simultaneously when using controllers. For example, you can often move with the left stick while turning the camera with the right stick at the same time.

In contrast, hand input typically requires sequential actions with one hand, such as using a [thumb tap](https://developers.meta.com/vr/design/design-microgestures/#what-is-a-microgesture) microgesture to [teleport](https://developers.meta.com/vr/design/design-microgestures/#locomotion) and then a [swipe microgesture](https://developers.meta.com/vr/design/design-microgestures/#what-is-a-microgesture) to snap turn. This sequential process is much slower than using controllers, due to both the nature of single-hand input and the time required for gesture detection. While it is possible to have simultaneous hand inputs from both the left and right hands, this approach is still slower than controllers, which allow multiple inputs from each device at once.  These differences should be carefully considered when designing the pacing of your experience or gameplay.

Use hands as the primary input while working on your experience as this will help surface issues and design opportunities early. For example, consider disabling controller input for a time or gating it behind a debug setting.

But keep in mind: **Just because it works for you doesn’t mean it works for everyone**. Everyone’s hands are different, length, strength, orientation, and movement styles vary.

- Test with a diverse group and expect to get things wrong before you get them right and that’s okay.
- Prototyping with real users from the start helps develop a natural language for hand implementation.
- When moving from controller-first contexts, explore interaction models like poke, grab, and ray casting to find the best fit while considering the player’s cognitive load.

This collaboration helps produce a more polished, intuitive, and enjoyable experience that meets user expectations and technical limits.

Users expect hand interactions to feel natural and intuitive, not just a direct mapping of controller buttons to hand gestures. Exact replication of controller inputs with hands often creates awkward, unintuitive experiences and forces users to unlearn natural behaviors. Users learn and remember more easily when their experience closely matches and mimics real-world hand use.

For example: **Don’t push rope. Rope is good for pulling, not pushing**. Or grab and turn objects instead of using [microgestures](https://developers.meta.com/vr/design/design-microgestures/).

This approach enhances immersion by letting users:

- Interact as they would in the real world, rather than forcing controller-like behaviors.
- Push buttons, if they are close, and only resort to raycast, if it is farther away.
- Have more natural and responsive interactions.

Hands-first gameplay increases cognitive load, so users can have less bandwidth to learn complex controls. Instead, aim for one core interaction so users only have to remember one. For example, you could focus on grabbing as the primary interaction, with only a few additional gestures.

This helps because:

- Users can master one motion and feel successful quickly.
- You can polish this one core interaction for a great experience.
- Automate wherever else possible to help reduce cognitive load.
    
  - For example, instead of one hand gesture to chop down a tree and another to harvest the wood, have the wood automatically be harvested.
- Removes extraneous interaction and focuses on what’s vital to your experience.

Focus on one core interaction like pinch-to-select for a streamlined experience

The absence of physical buttons and haptic feedback in controllers makes clear visual and audio feedback essential for hand interactions.

Feedback helps users:

- Know when their gestures are recognized.
- What actions occur, reducing confusion.

Visual cues, such as highlighting points or objects of interest and animations; both where the interactions happen, combined with subtle sounds, compensate for the lack of physical touch. These cues make interactions feel more responsive and engaging.

Visual rays and audio cues provide feedback when physical touch is absent

Though keep in mind that there are some experiences or action where you should tailor hand visuals to improve immersion and reduce confusion, for example:

- Hide virtual hands during activities like yoga poses to avoid distraction.
- Keep hands visible when interacting with the UI to enhance presence and control.
- Choose visualizations that optimize usability and comfort.
    
  - For example, minimize visuals flashing on and off. As this can be jarring, unsafe, and cause distraction.

Hide hands during yoga to reduce distraction; show hands during combat for control

When creating experiences with hand input, it’s important to recognize that these interactions can be more physically demanding than other modalities, even with careful design.

- Incorporate rest periods.
- Optimize interaction zones to reduce fatigue.
- Avoid time-based or reflex-heavy events, unless the experience is intentionally fitness-focused.
- Let users progress at their own speed and avoid unnecessary physical demands.
    
  - For example, do not penalize users for taking their time or needing breaks.
- Avoid requiring hands to be held above heart level or excessive reaching.
- Prioritize comfort.

When designing hand interactions, consider the overall challenge level of your experience. Below is a breakdown of different scenarios based on how challenging they are when using hands input:

- Few simultaneous input types
- Stationary player position
- Slower pace of gameplay
- Few or no timing-critical inputs

- Many simultaneous input types
    
  - For example: moving while shooting and reloading
- Fast hand/arm motion
- Smooth locomotion
- Faster pace of gameplay
- Timing-critical inputs
- Real-time multiplayer

Though you should always keep in mind that hands are different for everyone and these recommendations might range more widely for your experiences target user demographic.

Hands are still a major emerging  input modality in immersive and VR applications. Designers should be involved early to craft and test interaction metaphors, gesture vocabularies, and user flows. Input design is something that needs a lot of prototyping and experimentation, and hands input is one of the most challenging areas. Give time and resources to test a variety of solutions early.  Expect a lot of assumptions to be proven wrong and certain design challenges to take a variety of approaches to find the best solution.

It’s important to remember:

- Designing inputs is a process.
- Progress is more important than perfection.
- Stay open, explore, and embrace learning.

Hands as an input method offer unique advantages that enhance user engagement and interaction, but also creates some challenges you should keep in mind.

Distance interactions Hands are less effective for interactions at a distance compared to controllers or ray-based input methods.

Fatigue Extended use of hands, especially with arms held above the heart, can lead to user fatigue. Designing interactions that allow for arms to rest at the sides can help mitigate this challenge.

- **Users Expectations**: Virtual hands do not work identically to real hands nor any specific fantasy universe, which can contradict user expectations rooted in both reality and sci-fi stories.
- **Tracking**: Hand tracking relies on the device’s cameras. The reliance introduces technological challenges such as tracking volume, occlusion, and environmental lighting conditions.
- **Tactility**: Virtual objects don’t provide tactile feedback that happens when interacting with real-life objects. Feedback such as weight, touch, and material is all missing in virtual reality, which reduces the cues users expect when interacting with hands.
- **Limited input complexity**: hands offer fewer distinct input types than controllers, which can limit the number of simultaneous actions or complex controls available to users. This can also create a slower pace of input due to sequential movements.
- **Gesture recall and variability**: Gestures must be taught and memorized, and users perform gestures differently. This can lead to challenges in gesture recognition and recall, requiring forgiving design and in-app gesture reminders.

Natural and intuitive interactions Interacting with objects and touchscreens in VR with your virtual hands is just like interacting with objects and touchscreens in the real world. Hands are highly approachable and low-friction input due to this familiarity, attracting the widest range of users. Users less familiar with gaming controllers often find using hands more natural than hardware input. Natural hand movements reduce the need for complex controls and memory for button mapping.

Immersive and social presence Seeing their virtual hands move just like real hands helps users feel present. Using hands naturally in virtual environments helps users feel more connected to others and to the experience itself. This method is also highly intuitive for non-gamers, as it leverages familiar, real-world gestures and movements, reducing the learning curve for new users.

Expressiveness Hands convey emotions and social cues effectively. Solo and social experiences are emotionally richer when users can use their real hands to express themselves.

Real-world multitasking Hand tracking enables users to interact with virtual content while still being able to perform tasks in their physical environment. This is useful for apps that use [passthrough](https://developers.meta.com/vr/design/mr-design-passthrough).

- **Availability and flexible**: No additional hardware is needed for hand input. Unlike hardware devices, hands are present as soon as a Meta VR device is worn. Hands are free when used as an input, they are free to interact with physical objects, such as adjusting hardware buttons on a device or stoking a pet.
- **Direct input for up-close interactions**: hands excel at direct manipulation and touch-based input, making them ideal for tasks that require precision or are performed at close range.

Below is a list of our recommended practices when using hands in an immersive experience:

DO Provide a multimodal experience so that users can use different input methods seamlessly.

DON'T Never use Meta Quest headsets outdoors. Sunlight can damage their lenses and displays. Meta VR Glasses support outdoor use, but stay in shaded environments because direct sunlight can reduce hand-tracking accuracy.

DO encourage users to make gestures that are clearly visible to the HMD.

DON'T promote gestures that are too close (\< 10cm) to the HMD.

🎓 Want to go deeper on any of these? [Designing Forgiving and Reversible Interactions](https://app.dataprotocol.com/container/262?utm_source=mh_docs&utm_medium=link&utm_campaign=HIG-hands-best-practices-dos-and-donts&utm_id=mh) covers generous targets and easy correction. This short video is available on Meta VR Academy.

Explore more design guidelines and learn how to design great experiences for your app:

For technical information, start from these development guidelines:

Support and legal

English (US)

© 2026 Meta
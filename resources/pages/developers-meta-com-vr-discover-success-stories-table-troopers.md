# Blog | Meta Horizon OS Developers

> Source: https://developers.meta.com/vr/discover/success-stories/table-troopers/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Cosmorama Technologies

When Fabian Knauer and Sven Otto first tried Meta Quest 3, they did not ask how to bring an existing game into VR. They asked what kind of game could only work on this device. That thinking resulted in what is now thousands of hours of weekly play for *Table Troopers*.

"The first step was that the technology of [hand tracking](https://developers.meta.com/horizon/documentation/unity/unity-handtracking-overview/) and [mixed reality](https://developers.meta.com/horizon/documentation/unity/mr-experience-and-use-cases/) were at a point where we really wanted to build something for that technology," Knauer says. "Then we came up with a design for *Table Troopers* specifically to fit that technology and the capabilities of the device. After some prototyping, we realized that we had something here that works just on these platforms."

The result is ***[Table Troopers](https://www.meta.com/experiences/table-troopers/8293950053976436/)***, a mixed reality, hands-first virtual board game where players pinch, place, and aim their way around a destructible battlefield. Players move units like board-game pieces, aim weapons with their hands, destroy terrain, and compete in social multiplayer matches that feel more like gathering around a physical table than loading into a traditional strategy game.

For Cosmorama Technologies, hand tracking was never a feature added later. It was part of the reason the game existed. That hands-first approach shaped the gameplay, interface, onboarding, technical architecture, business model, live ops strategy, and the studio's view of what comes next for mixed reality on Quest.

Cosmorama Technologies was founded in 2024 by Knauer and Otto with a clear goal: build the kind of mixed reality experience they wanted to play themselves but could not find anywhere else.

We have seen a lot of things on mobile, and how people were still designing for older platforms or previous platforms. We wanted to apply our knowledge from mobile to VR and design it first hand for VR.
                    ### Sven Otto

## Co-founder, Cosmorama Technologies


Quest 3 made that shift feel possible. After trying passthrough and hand tracking, the team felt the technology was ready for the tabletop mixed reality experience they had imagined.

"When we both bought Quest 3 headsets and saw the quality of passthrough and hand-tracking interactions for the first time, we got inspired by marketing images that were shown around launch," Knauer says. "They showed a game that we didn't find on the platform, so we decided to build it ourselves."

The goal was not to clone a flat-screen strategy game or recreate a static board game. It was to transfer proven multiplayer and tabletop ideas into a form that felt native to mixed reality.

"The idea came from our design pillars for a made-for-MR game and our fond memories of playing local multiplayer games with friends," Knauer says. "It was important to us not to blindly clone something, but to transfer parts of proven elements to a new platform."

Those pillars were simple but demanding: minimal friction, no artificial locomotion, mixed reality first, hands first, short sessions, high replayability, and the feeling that something virtual was actually present in the room.

For Cosmorama, hand tracking was the most natural input for the fantasy they were building.

"One of our first ideas when seeing mixed reality and hand tracking was to build something like a diorama-style tabletop game," Knauer says. "We wanted to use hand tracking as one of our core pillars, because you want the interactions to be as close to the real-world equivalent as possible."

If players were interacting with a tabletop battlefield, the studio wanted them to reach out, pick things up, aim, place, and pinch in ways that felt familiar before they felt technical.

Accessibility also shaped the design. The game can be played with one hand, regardless of left or right-handedness, and includes accessibility options for color blind players.

"Focusing on hand tracking really helped us get the game as accessible as possible," Knauer says. "Users can just play with one hand, have their hands free to do other things while they play the game, grab something to eat, grab a snack, and use the other hand for gestures in the game."

The larger goal was to make the interface disappear.

"Our goal was to provide minimal friction," Knauer says. "We wanted players to forget that they're actually wearing a headset and feel that something virtual is actually present in front of them in their room."

That is the business case for hands-first mixed reality: less setup, less abstraction, faster access to the fun.

The first version of *Table Troopers* was intentionally simple: a small table, a static level, and basic shooting and movement mechanics.

"One of the first things we prototyped was the slingshot mechanic for shooting," Knauer says. "Using hands and spatial awareness, the ability to move your head around and aim and really have a perception of depth and a sense of space in front of you, very early showed us that this is a fun mechanic that we want to continue to build on."

The second prototype focused on moving units.

"The second thing we prototyped is how you can use your hands to move the little units around like pawns on a board game," Otto says. "We were thinking about how we can incorporate this into the game design, and it fit perfectly."

Together, those mechanics became the core of *Table Troopers*: pick up and place units, then aim and fire across the battlefield.

For Otto, the early turning point came when Knauer showed him a prototype where the physical table could move while the game continued to run on it.

“When Fabian demonstrated the second prototype to me, moving the table and at the same time also playing the game, that really felt like magic,” Otto says. “We had the table, moved it around, and we could also play the game. That made the whole thing just better.”

After validating the core loop, Cosmorama rebuilt the game from scratch with multiplayer functionality, destructible terrain, and lessons learned from building physics on a moving tabletop playfield.

A hands-first strategy game has a brutal requirement: the input has to feel trustworthy.

For a casual interaction, 90% reliability might feel impressive. For a tactical multiplayer game, it is not enough. If a player accidentally shoots, places a unit in the wrong spot, or loses tracking during a critical move, the system does not just feel imperfect. It feels unfair.

"One of the biggest challenges when implementing hand tracking was to get the precision and reliability on par with the controller implementation," Knauer says. "The game felt good with hands, but we often noticed false positives, or users executed actions they didn't actually want to execute, or they lost tracking for some reason."

The team designed the game hands-first, but did not ship hand tracking during [Early Access](https://developers.meta.com/horizon/resources/early-access/) because the experience was not ready.

"It worked 90% of the time, but for it to be enjoyable, it has to work almost every time, or 99.9% of the time," Knauer says. "We didn't want players that play with hands to have a competitive disadvantage to players that play with controllers."

At the same time, Cosmorama was solving another major technical challenge: networked physics with fully destructible terrain. Every object could become dynamic. The full scene stayed visible on the table. The playfield could move. Projectiles could leave the board and collide with the player's real room geometry.

"One thing we realized was more tricky than expected is that we had to separate our physical simulation spaces between the game world and the user's room," Knauer says. "Whenever a projectile leaves the game world, we have to copy it to a local space so it can then collide with the room geometry of each individual player and not interact with the game world anymore."

The payoff became one of Otto's favorite moments.

"After all those challenges, my favorite part is if you move the table around and an enemy unit falls off the table, it literally stays on your floor," he says.

That is *Table Troopers* in miniature: technical complexity turned into instant player delight.

To bring hand tracking closer to controller-level reliability, Cosmorama built small systems that helped the game understand player intent.

The first was a warning system around hand visibility. Because headset cameras can only track what they can see, players sometimes blocked fingertips or moved their hands into positions where the system could not reliably interpret them.

"We warn the user up front by tinting the hands a bit red," Knauer says. "That gives them an indicator that they're about to lose tracking before they actually lose the tracking, reminding them to keep their hands inside the camera."

The second solution addressed aiming. *Table Troopers*' slingshot mechanic relies on opening the pinch gesture to confirm a shot, but releasing a pinch can create small hand movements that change the final aim direction.

The fix: record recent hand positions and use a slightly earlier position as the player's intended target.

"When we recognize the open gesture, we just take the position that was valid for like half a second before and use that as the final intent for what the user actually wanted to do," Knauer says. "That helps improve precision by a lot."

In practice, players do not see the system. They just feel that the shot went where they expected.

Playtesting was critical. Cosmorama learned that developers are often poor judges of how players will use an input system, because they already know how it is supposed to work.

"Other people usually use it a bit different than you do yourself," Knauer says. "Watching other people play the game, especially people that never used the headset before, gave us the best insights."

Since launch, *Table Troopers* has grown from a promising Early Access title into a growing multiplayer business. During its first month in Early Access, active users averaged 85 minutes of play time per week, giving Cosmorama an early signal that players were not just trying the game, they were coming back.

The team is especially proud of maintaining a 4.8-star Store rating from Early Access through the game's first year.

"The game has grown steadily since launch," Knauer says. "We are very proud that we have kept a very high store rating from our users from the very first Early Access version up until now."

Cosmorama chose a premium model with a deliberately low price point. The goal was to make the game feel like an impulse purchase and reduce friction for multiplayer.

"In the beginning, we chose to release *Table Troopers* as a premium title, but we deliberately chose a very low price point to make it easy and low entry for users to invite their friends with them," Knauer says. "We wanted to provide the game to as many people as possible."

Joining [Meta Horizon+](https://developers.meta.com/horizon/resources/meta-horizon-plus/) in May 2026 helped accelerate that growth. Since becoming available through the catalog, monthly active users have increased more than 5x, while total downloads have grown more than 6x. The larger player base also helped create more multiplayer activity, with the community now generating thousands of hours of play each week.

"*Table Troopers* is available on Meta Horizon+ since the beginning of May, which drove a lot of new players into our game and increased the amount of multiplayer matches that we see every day," Knauer says.

The team's biggest revenue driver has been DLC. Cosmorama began adding premium content packs with new levels, teams, and weapons, supported by a multiplayer-friendly policy: only one friend needs to own the DLC to invite others into a match.

"DLC packs are a very big driver of our current revenue," Knauer says. "A lot of people are repeat customers. People are looking forward to the next DLC."

Today, DLC accounts for more than half of revenue, with buyers averaging roughly 1.5 purchases per month and many purchasing multiple packs over time. The model works because it builds on a strong core loop, a social multiplayer design, and a content cadence players trust.

The lesson is clear: the core experience brought players in, but community feedback, Horizon+ visibility, and regular DLC helped turn *Table Troopers* into a longer-term business.

Cosmorama used Meta tools and platform features to support development, social presence, multiplayer, and monetization.

Meta sample apps helped the team understand the range of possible hand-tracking interactions early in development.

We took a lot of inspiration from the sample apps provided by Meta. When we started out, it was good to see what range of interactions was possible, and then we could pick from these inspirations and start thinking about what we wanted to incorporate in our game.
              ### Fabian Knauer

## Co-founder, Cosmorama Technologies


The Unity Interaction SDK helped with hand-tracking input. [Platform SDK](https://developers.meta.com/horizon/documentation/unity/ps-platform-intro/) supported DLC handling, invites, and leaderboards.

"What also helped us is the [Platform SDK](https://assetstore.unity.com/packages/tools/integration/meta-xr-all-in-one-sdk-269657) to integrate the in-app purchases for our DLC packs," Knauer says. "Especially for us as a multiplayer game, it was very important to use the streamlined invite feature so that you can invite your friends with the press of a button."

For a social multiplayer game, those details matter. Invites reduce friction. Leaderboards add competition. DLC handling supports the business. Storefront tools, notifications, [Developer Posts](https://developers.meta.com/horizon/blog/developer-posts-meta-horizon-os/), [promo codes,](https://developers.meta.com/horizon/resources/monetization-custom-promo-codes/) and [A/B testing](https://developers.meta.com/horizon/resources/ab-testing-instructions/) help the team maintain and grow the game after launch.

Otto also credits developer support from Meta and the [Meta Horizon Start](https://developers.meta.com/horizon/discover/programs/start/) program community with helping the team improve hand tracking.

"Meta was very supportive along the way with regards to hand tracking," he says. "They gave us feedback on how we can improve it, and we were part of the Start community where developers can exchange their experience."

Cosmorama did not retrofit an existing game for Quest. They started with mixed reality, passthrough, hand tracking, spatial presence, and social multiplayer.

The first prototypes were simple: slingshot shooting and moving units like pawns. Those two interactions proved the core loop before the team invested in multiplayer, destructible terrain, DLC, or polish.

"What we learned is that it's often better to simplify the mechanic that you want to build rather than make the input schema more complex," Knauer says. "Accept early that not every mechanic works perfectly for hands."

"It was definitely important for us to test on devices early and as often as possible," Knauer says. "The game feels much different on device than seeing it on the screen."

Use these resources to start building your own hands-first or mixed reality experience on Quest:

- **[Meta XR SDK](https://assetstore.unity.com/packages/tools/integration/meta-xr-all-in-one-sdk-269657):** includes Meta Interaction SDK and Meta XR Platform SDK to build hand and controller interactions, add invites, leaderboards, in-app purchases, and multiplayer platform features
- **[Hand tracking documentation](https://developers.meta.com/horizon/documentation/unity/unity-handtracking-overview/):** design and implement hand-first input
- **[Mixed reality documentation](https://developers.meta.com/horizon/documentation/unity/mr-experience-and-use-cases/):** build experiences with scene understanding that blend virtual content with the player's physical surroundings
- **[Meta Quest Developer Hub](https://developers.meta.com/horizon/documentation/unity/ts-mqdh/):** test, debug, and optimize on-device
- **[Meta Horizon Start Program](https://developers.meta.com/horizon/discover/programs/start/):** connect with other developers and access support resources

Quest

Games

Experiences

Apps

Design

Optimization

Streaming

Support and legal

English (US)

© 2026 Meta
# Blog | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/discover/success-stories/hand-physics-lab-holonautic/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Holonautic

When hand tracking first became available on the original Meta Quest, Küng and Kuhnert did not start with a finished game concept and ask how hands could fit into it. They started with the technology itself.

"When hand tracking was introduced, we were immediately amazed," Küng says. "It was like a completely new world on how you could interact in VR."

The result was ***[Hand Physics Lab](https://www.meta.com/experiences/hand-physics-lab/3392175350802835/?srsltid=AfmBOooLrb3hulU-XGA64TOnOTzV6VgVJB3YDkiS2xG-5lve_rLGI-V_)***, an experimental sandbox where players use their hands and fingers to touch, pinch, grab, push, paint, build, and solve physics-based puzzles. What began as a weekend side project became an early proof point for what [hands-first](https://developers.meta.com/horizon/documentation/unity/unity-handtracking-overview/) interaction could do in VR, and one of the platform's hand-tracking success stories, with more than 1.3 million copies sold to date.

For Holonautic, hand tracking was not an input method layered onto an existing design. It was the creative spark.

"The thing is, how we design experiences is never that we have a game idea and then try to retrofit interactions or the technology into it," Küng says. "We usually start with the technology, in this case hand tracking, and through experimentation figure out what a game around this can be."

That approach shaped everything: the first prototype, the physics system, puzzle design, user testing, the development workflow, and Holonautic's view of where hands, gaze, and player intent are going next.

Holonautic was founded by Küng and Kuhnert in Switzerland after the two experienced VR for the first time and realized the medium could combine many of their interests: engineering, biology, neuroprosthetics, game design, and interactive art.

"What brought us into VR was actually on my birthday," Küng says. "My brother had the idea to go into a VR arcade, and we experienced VR for the first time. After I got the experience of being immersed into another world, there was no going back."

For Kuhnert, VR brought together the creative and technical threads he had been following for years.

"When I tried it for the first time, I was completely blown away," he says. "VR allows us to be creative, using engineering skills, using all the knowledge we had in engineering and biology and neuroprosthetics."

That cross-disciplinary perspective became central to Holonautic's work. The studio is interested in how XR can change embodiment, perception, and the way people interact with virtual environments.

"For us, XR has always been a very different way to interact with the world, with computers, and with games than any previous medium," Küng says. "We wanted to explore that in the deepest way we could."

That exploration led them directly to hands.

When hand tracking became available, we noticed that people who usually struggled with controller interactions started to have no problem playing around with things inside the game. From very young children to very old adults, it just worked.
              ### Roger Küng

## Co-founder, Holonautic


That ease had a deeper explanation. "One of the most beautiful things about physics-based interaction is that it is literally the most natural user interface you can imagine for interacting with a computer," Küng says. "You use your fingers, you use your hands, you press things, touch things, grab things, the way you have been learning your entire life."

That was the thesis. The engineering was the hard part.

"We cannot really say that Hand Physics Lab was designed around hand tracking interaction," Küng says. "It was actually quite the opposite. That new, really exciting input system gave birth to Hand Physics Lab. It was not really designed and intended from the beginning. I built the very first prototype immediately after the [Meta XR Interaction SDK](https://developers.meta.com/horizon/documentation/unity/unity-isdk-interaction-sdk-overview/) became available."

At the time, Holonautic was working on bringing another VR game to Quest. That process involved performance challenges, optimization work, and the complexity of porting a PC VR experience to a mobile headset. Hand tracking became the more exciting side path.

"Experimenting with it, we did many little things with the hands to see how it felt," Küng says. "But adding physics to it was really the breakthrough that made us see, okay, that's really cool. We have to build something from that."

The early clips were simple: hands, cubes, pushing, grabbing, physics. But when Holonautic posted them online, the VR community responded.

"After posting very short clips of the early prototype on social media, we saw the reaction of people and said, okay, that's really cool," Küng says. "There is something to be done, and people seem to really want to experiment with it as well."

The interest quickly expanded beyond a typical game audience. People were not only asking about the product. They were asking what hand tracking could make possible.

"It grew beyond just a simple game," Küng says. "It grew into: *how do you do interactions with hands in VR, and what are all the possibilities?*"

That momentum pushed the team to release early on SideQuest. After roughly three and a half months, Holonautic put the prototype out for free and started collecting feedback.

"We very quickly got a lot of downloads, a lot of great feedback, and a lot of people really liked it," Küng says. "After over 100,000 downloads and so many comments, we knew, okay, we are on the right track."

That signal held. Hand Physics Lab launched as a paid title on the Meta Quest Store in April 2021, and more than five years later it has sold over 1.3 million copies, with Holonautic still shipping updates today.

That early community response also shaped the team's launch philosophy.

"We have the tendency to maybe polish things too long," Küng says. "So we pushed and said, let's get it out for free, get feedback, and be sure that we are on the right track."

The first prototypes were bare bones. Holonautic started by adding dynamic bodies to fingers, then testing how those fingers could collide with objects.

"The very first prototype was trying to add dynamic bodies to those fingers," Küng says. "It was extremely challenging at the beginning because the SDK was very bare bones."

At the time, hand tracking data only worked in a build. The team could not easily see or debug the hand structure from the editor.

"You had to basically guess what was happening inside the build," Küng says. "You had no idea how the hand was structured. You had no idea how the transform or orientation was happening."

Today, he says, tools like [Meta Horizon Link](https://www.meta.com/help/quest/1517439565442928/?srsltid=AfmBOoqlhD5aFueoiZJhZ35_ZdchC7Kipie5KanEue4ZlQooNd2asOFZ) make that process significantly faster.

"One of the best tools provided by Meta was the ability to use the hands data through the Horizon Link connection and directly see what was going on in the editor," Küng says. "That allowed really rapid iterations."

For Holonautic, that faster feedback loop had a significant impact, saving the team an estimated one to two hours of development time per day. Instead of creating a new build every time they wanted to test a hand interaction, they could iterate directly in the Unity Editor, see interactions play out in real time, and move faster on the small adjustments that make hands-first interactions feel natural.

Other platform tools in the Meta XR SDK like [Meta XR Simulator](https://developers.meta.com/horizon/documentation/unity/xrsim-intro/) and [Meta XR Operator](https://developers.meta.com/horizon/documentation/unity/meta-xr-operator/) now enable developers to test hands-based interactions in simulated environments on desktop, and leverage AI agents to implement targeted fixes and verify them autonomously without a physical headset. But in the early days, Holonautic had to build through trial, error, and constant iteration.

"To reach the core interaction style, it took a lot of iterations over multiple weeks and months," Küng says. "Every time, we tried to add a new little system that made everything feel a little bit better, more stable, prevented more user error, or predicted the player's intent a little bit more."

The design goal was deceptively simple: make the interaction feel like nothing.

The most important thing is that everything you want the player to do should feel like a non-event. If you have to explain it, it usually means the design of the user interaction is wrong.
              ### Roger Küng

## Co-founder, Holonautic


That principle shaped the whole experience. *Hand Physics Lab* does not rely on walls of text or complicated gesture tutorials. Most interactions are communicated through icons, visual cues, and objects that suggest their own use.

"If the user just looks at something and naturally knows what to do, it means the design is correct," Küng says. "It has to feel natural. It has to feel like the user doesn't have to think about it. They just do it."

Hand tracking creates a lot of freedom, but freedom creates edge cases. Players occlude fingers, overlap hands with objects, lose tracking, twist into strange poses, and create virtual configurations that physics engines do not enjoy. Calmly said: things can go boom.

"With hand tracking, edge cases are everywhere, especially when you add physics on top of that," Küng says. "You have to think, how are we going to solve any problem that can happen?"

The team had to build guardrails that prevented impossible physical states without breaking immersion. For example, if tracking is lost while a player's hand is inside a table or object, the virtual hand cannot simply teleport to the newly detected real-world position. That could cause the physics simulation to react violently.

"If tracking is lost, the hand will be locked in place," Küng says. "As soon as the red signal goes away, the physical hand will slowly lerp toward the real hand, but it will not automatically teleport into it."

Puzzle design also had to account for tracking limitations.

"The puzzles should not create too much anger and frustration if the tracking is lost," Küng says. "They are designed in a way, especially the early ones, where even if things don't work out perfectly, it doesn't punish you too much."

For Holonautic, the central design question was not "Did the system detect a gesture?" It was "Did the system understand what the player meant?"

"Always try to predict the user intent and always give them the result they expect," Küng says. "Nothing unexpected should happen."

That mindset became especially important for physics-driven hands. Pure physics can feel magical when it works, but not every object should be handled the same way. A cube can be grabbed from almost any angle. A tool or gun may need a more guided pose to feel natural.

"The first way to interact was purely using physics," Küng says. "But later on, I added snapping, basically predefined positions on specific objects."

The final result became a hybrid system: physics where freedom matters, predefined poses where clarity matters.

"In certain instances, having a predefined pose system feels more natural than actually just trusting the data," Küng says.

That is one of *Hand Physics Lab*'s most useful developer lessons: realism is not always the goal. Believability is.

Over time, Holonautic developed a clear philosophy for hands-first design: keep the interaction simple, and put the cleverness around it.

A good interaction in hand tracking is anything that feels absolutely natural and makes the feeling of frustration completely absent. What we saw where most people fail is when they try to be clever.
              ### Roger Küng

## Co-founder, Holonautic


That does not mean the experience itself should be simple. It means the base interaction should be obvious.

"You should not try to be clever with the interaction," Küng says. "The interaction is not what needs to be clever. Everything around the interaction can be clever, but not the interaction itself."

His example is direct: if you want a player to erase something on a board, do not make them perform a special gesture. Give them something that works like an eraser.

"Don't try to do special sign language to erase something on a blackboard," Küng says. "Just put something there which you can grab and start to erase."

That philosophy also applies to controller assumptions. Hands are expressive, but they are not controllers. They do not have buttons, thumbsticks, or the same tracking volume. Trying to reproduce controller input through gestures can quickly become frustrating.

"If you build a game just for controllers and then add hand tracking, many things might break," Küng says. "With hands, you really have to focus on one precise thing at a time."

When players first try *Hand Physics Lab*, their first move is often the same: they look at their hands.

"The first thing we have seen nearly everyone do when they first experience *Hand Physics Lab* is they do this," Küng says, holding up his hands. "They're amazed about seeing their own hands in skeletal form."

That first moment is both familiar and strange. The hands are theirs, but transformed. It invites curiosity.

"It's not scary," Küng says. "It's more like medical or scientific curiosity of seeing your bones. That first interaction seems to work up to this day."

Then players start experimenting.

"They saw, okay, cool, I have hands. I try to touch something. Oh, it's physics-based. I try to grab something. Oh, it works," Küng says. "We didn't need to explain anything. We just put the headset on, said, look at your hand, and they immediately started doing stuff."

The team found that some of the most memorable moments came from interactions that felt obvious to players but were technically complex underneath.

One example is simulated weight. Players push against a heavy virtual cube, and because the virtual hand is held back by the object, the brain begins to interpret resistance even though nothing is physically there.

"They seem to feel like it's so hard to push this cube over," Küng says. "Even though in reality you just see them push through thin air."

Another example is hand painting. Players dip a finger into paint and start drawing. Then they try all their fingers. Then they use the back of their hand to erase. They often discover the logic without being told.

"We didn't even have to explain," Küng says. "They were just picking up stuff, doing things, the obvious stuff. That was really satisfying to watch."

Then there are the stranger moments, like cutting off your virtual hand and watching it continue to react to your real hand movement.

"It blows nearly everyone's mind," Küng says. "It captures that this is a virtual experience. It feels very intuitive, but it does not exist in the real world."

That is the *Hand Physics Lab* sweet spot: familiar enough to use instantly, impossible enough to feel magical.

The payoff shows up in engagement. Years after launch, a meaningful share of new players are still active a week after first trying the app, a sign the experience keeps people coming back, which is not a given for a hand-tracking title built before the interaction patterns were settled.

"It opened that new way of interaction to basically every person owning a Quest," Küng says. "That was a big opportunity."

At the time, hand tracking was still early. But by supporting hands-first experiments, Meta helped give Holonautic a path to reach players.

"When *Hand Physics Lab* came out, hand tracking was still something early on," Küng says. "Meta was still willing to give the game a chance and put it on the Store relatively early. That helped us tremendously."

The team also points to how much the platform and tooling have improved over time.

"Hand tracking improved drastically over the years," Küng says. "That was really exciting to see. It allowed us to make a lot of things easier."

Most notably, v83 introduced [Hands 2.4](https://developers.meta.com/horizon/blog/whats-new-hand-tracking-v83/) in late 2025, bringing faster hand acquisition and smoother motion tracking for high-speed interactions like fitness and rhythm games. The update also expanded locomotion options and throwing customization, giving developers more precision for physics-driven gameplay.

For *Hand Physics Lab*, that raw hand tracking data remained essential. Holonautic's interaction system stayed almost fully custom because the game depends on finger-level physics, precise intent detection, and highly opinionated interaction design.

One of the biggest improvements for Holonautic's workflow was Meta Horizon Link, which now lets developers test hand tracking iterations directly in the Unity Editor without creating a new build every time.

"The main tool that would have helped the early development of *Hand Physics Lab* would be the Meta Horizon Link tool," Küng says. "It allows you to directly and quickly test iterations inside the Unity Editor without requiring a new build every time."

That matters because early *Hand Physics Lab* development was built on fast experimentation, but the process was slow. The team was working with raw hand tracking data, building custom systems on top, and repeatedly testing in-headset to understand what was actually happening.

The team keeps an eye on the latest Interaction SDK and other tools from Meta, but for this project, deeper control was critical.

"We always keep an eye on the latest tools provided by Meta," Küng says. "But we usually like to implement the interaction systems ourselves to have deeper control and flexibility."

That said, Küng sees clear value in today's SDKs for many developers, especially teams that need to move quickly or do not need the same level of custom physics.

"For certain applications where it is more about what the application does, and you want to get to a product as fast as possible, those SDKs can save you months of development and fine-tuning," he says.

Platform tools like [Building Blocks](https://developers.meta.com/horizon/documentation/unity/unity-building-blocks-overview/), for example, enable developers to integrate pre-built interaction components in just a few clicks. For many teams, that can turn hand interaction development from a custom engineering challenge into a faster starting point.

Performance was another major part of the journey, especially on standalone hardware. For the first Quest release, Holonautic had to think through every detail to hit CPU and GPU targets. The main CPU bottleneck was physics: simulated finger bodies, interactable objects, constraints, and all the systems needed to make virtual hands feel physical without breaking the experience.

"This was a big challenge, especially for the first release on Quest," Küng says. "Every single detail had to be thought through to make sure we met the performance target on both the CPU and GPU."

To optimize, the team relied first on the Unity Profiler for early code work, then used Meta Metrics HUD inside builds for deeper optimization, especially GPU profiling.

The practical balance is clear: use platform tools where they accelerate the work, profile early and often on-device, and build custom systems only when the experience truly demands it. For *Hand Physics Lab*, that custom work was the point. For many developers building today, Meta's current tools can make the path much faster.

Holonautic did not start with a traditional game and ask how to add hand tracking. The team started with hand tracking and asked what kind of experience it could make possible.

The best hand interactions should not need long explanations. Players should be able to look, reach, touch, grab, and understand what to do.

Hand tracking data is only part of the story. Players will move differently, occlude their hands, lose tracking, and create edge cases. The system needs to infer what they meant, not just react to raw input.

Holonautic's clearest advice: do not make the interaction itself too clever.

"Don't try to be clever with the interaction," Küng says. "Keep the cleverness in the experience around the interaction, not inside the interaction."

Use these resources to start building your own hands-first experience in VR:

- **[Meta XR SDK](https://assetstore.unity.com/packages/tools/integration/meta-xr-all-in-one-sdk-269657):** includes Meta Interaction SDK and Meta XR Platform SDK to build hand and controller interactions, add invites, leaderboards, in-app purchases, and multiplayer platform features.
- **[Hand tracking documentation](https://developers.meta.com/horizon/documentation/unity/unity-handtracking-overview/):** design and implement hand-first input.
- **[Meta Quest Developer Hub](https://developers.meta.com/horizon/documentation/unity/ts-mqdh/):** test, debug, and optimize on-device.
- **[Meta Horizon Start Program](https://developers.meta.com/horizon/discover/programs/start/):** connect with other developers and access support resources.

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
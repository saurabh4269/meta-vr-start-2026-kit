# Limitations & Mitigations | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/design/hands-limitations-mitigations/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Design

Updated: Sep 14, 2026

This section examines the inherent limitations and challenges that impact performance and usability and offers strategies for mitigation through design or code improvements.

The device’s sensors track within a specific area known as the tracking volume. Hands outside this area, such as resting by the thighs or placed too close to the device like on the cheek, will not be detected. The hand-tracking volume exceeds the display field of view, allowing for tracking even when hands are not visible to the user. The tracking volume varies depending on the hardware used.

Front view The hand tracking volume extends beyond the display field of view

Overhead view Overhead view of the hand tracking volume

To compensate for hands moving outside the camera’s field of view, body tracking techniques are employed to infer the positions of the hands.

To ensure that all relevant user motions are accurately tracked, it is recommended to design interactions that keep users’ movements within the tracking volume, avoiding the need for them to reach beyond it. For more guidance, refer to the [comfort](https://developers.meta.com/vr/design/comfort/) page.

Sensors play a vital role in tracking hand movements in virtual environments. They perform best when they have a clear view of the user’s hands. However, when parts of the hand are not visible to the sensors, the system attempts to estimate their positions. If significant portions of the hand are obscured, the virtual representation of the hand will disappear. The hand pose prediction model provides two key outputs: the estimated hand pose and the level of confidence in that prediction. If the confidence level falls below a certain threshold, the system will not display the hand. Obstacles that block the sensors’ view can include elements from the surrounding environment or the user’s own body, known as *Self-Occlusions*

Self-occlusion occurs when fingers or hands block each other from the tracking cameras

Aim to design interactions with minimal hand overlap; for example, having the index finger interact with a wrist button or palm menu on the other hand is a minimal overlap. The more one hand covers the other, the lower the accuracy. Additionally, interactions that can be performed with just one hand are always a good choice, as they not only enhance accessibility but also require less physical effort. This approach allows the hand tracking engine to effectively track both hands independently.

🎓 Designing around these limitations? [Designing Forgiving and Reversible Interactions](https://app.dataprotocol.com/container/262?utm_source=mh_docs&utm_medium=link&utm_campaign=HIG-hands-limitations-and-mitigations&utm_id=mh) on Meta VR Academy covers how to keep interactions satisfying when tracking isn’t exact.

The quality and intensity of light can impact the system’s ability to accurately detect hand movements. Hand tracking has different lighting requirements than inside-out (head) tracking. In some situations, this could result in functional differences between head tracking and hand tracking, where one may work while the other has stopped functioning.

Indoor vs. sunlight Indoor lighting provides optimal tracking conditions; direct sunlight can damage lenses

Low light Insufficient lighting reduces hand tracking accuracy

Meta VR devices adjust to different light conditions. For optimal functionality, advise users to be aware of their environment’s lighting, perhaps by including a note when launching an application.

Rapid or erratic hand movements can challenge the system’s tracking accuracy. For example, when throwing a virtual object, the hand moves quickly, and the camera may not immediately capture the exact point of release. Nevertheless, the Move Fast app successfully demonstrates that playing fast-paced rhythm games using hand gestures is indeed possible.

To improve tracking accuracy with fast-paced hand movements, consider these strategies:

- Centralize targets and encourage keeping hands at a moderate distance from the device.
- Maintain a predictable target speed.
- Note that hand movements directed away from the player (such as punches) are tracked more effectively than movements parallel to the view (such as chops).
- Use visual cues to guide users in maintaining appropriate hand speeds and positions. For example, visually slowing down hands or targets can encourage users to adapt their speed.

By integrating these design elements, it is possible to significantly enhance the tracking performance of hand movements, particularly in fast-paced applications.

Tracking accuracy may be influenced by individual user traits. Factors such as long fingernails, specific types of nail polish, tattoos on the hands, accessories like rings, long sleeves, and diverse hand sizes and shapes can all impact performance.

Enhance user interaction by offering a variety of input modalities and interaction choices. For instance, while long nails may hinder poke interactions, pinch actions using ray casting could be more effective. Alternatively, using a controller can serve as a reliable fallback option. For more information, please refer to the section on [accessibility](https://developers.meta.com/vr/design/accessibility/).

Support and legal

English (US)

© 2026 Meta
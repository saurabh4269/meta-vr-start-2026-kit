# Hand tracking Microgestures in Unreal Engine | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unreal/unreal-microgestures
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Apr 14, 2026

Microgestures expand the capabilities of hand tracking by recognizing subtle thumb tap and thumb swipe motions performed on the side of the index finger. These gestures trigger discrete D-pad-like directional commands.

The hand pose and motion of the thumb is as follows: initially, the thumb must be raised above the index finger (not touching the index finger). The other fingers should be slightly curled as in the picture below for best performance: that is, not too extended, nor completely curled into a fist. A tap is performed by touching the middle segment of the index finger with the thumb, and then lifting the thumb. The four directional thumb swipes performed on the surface of the index finger are:

- **Left swipe**: a swipe towards the index fingertip on the right hand, and away from the index fingertip on the left hand. On the right hand for example, the motion is as follows: the thumb starts raised above the index finger, touches the middle segment of the index finger, slides towards the index fingertip, and lifts.
- **Right swipe**: the same motion as the left swipe, but in the opposite direction. On the right hand for example, the thumb starts raised above the index finger, touches the middle segment of the index finger, slides away from the index fingertip, and lifts.
- **Forward swipe**: the thumb starts raised above the index finger, touches the middle segment of the index finger, slides forward, and lifts.
- **Backward swipe**: the thumb starts raised above the index finger, touches the middle segment of the index finger, slides backward/downward, and lifts.

- Meta Quest 2, Meta Quest Pro, Meta Quest 3 family of devices, and Meta VR Glasses

- Unreal Engine 5.5 or higher
- [Meta XR plugin V77 or higher](https://developers.meta.com/vr/documentation/unreal/unreal-quick-start-install-metaxr-plugin)

Microgestures in Unreal Engine are exposed via the Enhanced Input system, similar to how other system gestures - such as pinch - and controller inputs are exposed. To use microgestures in your project, you must set up Input Actions for each microgesture you want to support as well as an Input Mapping Context that maps those Input Actions to the microgesture input.

1. In the Content Drawer, select**Add New** > **Input** > **Input Action** to create the Input Action asset.
2. Name the new Input Action asset. In this example, it is named*IA\_Microgesture\_L\_Left\_Swipe* because this is the Input Action for the left swipe gesture on the left hand.
3. Double-click the new Input Action asset in the Content Drawer to open it in the editor.
4. The microgesture inputs are either active or not, like a button press. Set the**Action** > **Value Type** to **Digital (bool)**.

1. In the Content Drawer, select**Add New** > **Input** > **Input Mapping Context** to create the Input Mapping Context asset.
2. Name the new Input Mapping Context asset. In this example, it is named*IMC\_Microgestures* because this is the Input Mapping Context for all microgestures.
3. Double-click the new Input Mapping Context asset in the Content Drawer to open it in the editor.
4. Click the plus button next to**Mappings** to add a new mapping to the Input Mapping Context.
5. Select the Input Action you want to add a mapping for from the dropdown for the new mapping. In this example, it is*IA\_Microgesture\_L\_Left\_Swipe*.
6. Select the microgesture input you want to map the Input Action to from the dropdown for the new mapping. In this example, it is*Oculus Hand (L) Microgesture - Swipe Left*.
7. Repeat this process for the remaining microgestures you want to support in your project.

For more information on creating Input Actions and Input Mapping Context assets in Unreal Engine, see the [Enhanced Input](https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine) documentation.

The *Input Mapping Context* asset must be added to the player through the **Project Settings** or via Blueprint so the Enhanced Input system knows to listen for those inputs. If you always want to use the *Input Mapping Context* in your project, you can add it to the **Default Mapping Contexts** in the **Project Settings**. If you only want to use the *Input Mapping Context* in certain circumstances, you can add it using Blueprint in response to some event. For example, it is common to add it to the Pawn when the Begin play event is fired so that specific Pawn type will always have the same input mappings. You could also use the Level Blueprint to add the *Input Mapping Context* to the player for a specific level that requires specialized inputs you want to have mapped to the microgestures.

To add the *Input Mapping Context* through the **Project Settings**, open the **Project Settings** from the **Edit** menu and select **Enhanced Input** on the left. Click the plus button next to **Default Mapping Contexts** under the **Enhanced Input** section. Assign the *Input Mapping Context* you want to add to the **Input Mapping Context** property.

To add the *Input Mapping Context* through Blueprint, use the **Add Mapping Context** function. Connect a reference to the **Enhanced Input Local Player Subsystem** to the **Target** input pin and assign the *Input Mapping Context* you want to add to the **Mapping Context** input pin.

Each Input Action you created for a microgesture has a corresponding Input Action event that can be bound in Blueprint. This enables you to listen for each of the microgestures and perform some action or series of actions in response. For example, you could bind the Thumb Tap input to open a menu, use the directional swipe inputs to navigate the menu, and use the Thumb Tap input again to select the menu item.

To bind the Input Action event in Blueprint:

1. Drag the Input Action asset from the Content Drawer into the Blueprint graph.
2. Connect nodes to the corresponding output pin, depending on when you want to listen for the Input Action event. For example, generally you will want to connect a node to the**Started** output pin to listen for when the Input Action is first detected. Similarly, if you want to repeatedly listen for the input while it is being detected, you can connect a node to the **Triggered** output pin.**Note**: To expose the **Started** output pin, click the down arrow at the bottom of the event.

Support and legal

English (US)

© 2026 Meta
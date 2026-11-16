# Getting Started with Interaction SDK for Unreal Engine | Meta Horizon OS Developers

> Source: https://developers.meta.com/horizon/documentation/unreal/unreal-isdk-getting-started/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Apr 15, 2026

Interaction SDK for Unreal Engine provides out-of-the-box [grab](https://developers.meta.com/vr/documentation/unreal/unreal-isdk-grab-interactions/), [poke](https://developers.meta.com/vr/documentation/unreal/unreal-isdk-poke-interactions/), and [raycasting](https://developers.meta.com/vr/documentation/unreal/unreal-isdk-ray-interactions/) functionality that enable you to add complex, robust interactions to your project.

When you finish this guide, you should be able to:

- Add an interaction-ready rig to an Unreal Engine project.
- Create a user interface with multiple UI elements.
- Make the user interface interactable up close using poke interactions.
- Make the user interface interactable from a distance using raycasting.

This guide relies on the Meta XR Interaction SDK plugin and either the Meta XR plugin for Unreal Engine or the built-in Unreal Engine OpenXR plugin. The Meta XR plugin is recommended for Meta Quest devices, as it enables the full set of Interaction SDK features. The built-in OpenXR plugin is a supported alternative, but some features such as hand pinch input use automatic fallback behavior. If you choose to use the Meta XR plugin, you can obtain it from the Unreal Marketplace.

Your project must have the Meta XR Interaction SDK plugin enabled. You will also need to have your project set up to deploy to a Meta Quest headset. Make sure you have followed [Creating Your First Meta Quest VR App in Unreal Engine](https://developers.meta.com/vr/documentation/unreal/unreal-create-and-configure-new-project/) before you proceed.

To demonstrate several features of the Interaction SDK for Unreal Engine, you will be creating a very basic user interface with a button and a slider that the user can interact with using hands or controllers.

To begin adding your own functionality, you need to create and configure some custom framework classes and tell the application to use them instead of the defaults.

1. In the**Content Drawer**, create a new **Blueprint Class** asset using *Game Mode Base* as the parent class. Name the new asset appropriately for your use case. In this example, it is called *MyGameMode*.
2. In the**Content Drawer**, create a new *Blueprint Class* asset using **Pawn** as the parent class. Name the new asset appropriately for your use case. In this example, it is called *MyPawn*.
3. In the**Window** menu, select **World Settings**. Assign your new `Game Mode` asset to the **GameMode Override** property to use your `Game Mode` when you run the application.
4. In the **Level Editor** toolbar, click the **Save** button to save the changes to disk.
5. In the**Content Drawer**, double-click the `Game Mode` asset to open it for editing. In the **Blueprint Editor** toolbar, click **Class Defaults** if it is not already selected. Assign your new `Pawn` asset to the **Default Pawn Class** property to force your `Pawn` class to be used with your `Game Mode`.
6. In the **Blueprint Editor** toolbar, click the **Compile** button to compile the `Game Mode` and then click the **Save** button to save the asset to disk.
7. Close the **MyGameMode** tab to return to the **Level Editor**.

Interaction SDK includes components which can be added to the `Pawn` to enable interactions for each tracked hand or controller. The simplest way to get started is to use the `IsdkHandRigComponent[Left|Right]` and `IsdkControllerRigComponent[Left|Right]` components, which are part of the **ISDK Prebuilts** module. These provide a prebuilt setup of interactors that can be used in common use cases, or to bootstrap your application.

A simple `Pawn` that supports hands and controllers will have the following structure of components (items with an *Isdk* prefix are part of Interaction SDK):

- **RootComponent** (`SceneComponent`)
- **VRCamera** (`CameraComponent`)
- **RightHand** (`MotionControllerComponent`)
  - **RightHandInteractors** (`IsdkHandRigComponentRight`)
  - **RightControllerInteractors** (`IsdkControllerRigComponentRight`)
- **LeftHand** (`MotionControllerComponent`)
  - **LeftHandInteractors** (`IsdkHandRigComponentLeft`)
  - **LeftControllerInteractors** (`IsdkControllerRigComponentLeft`)

If your application wants to support both hand tracking and controller tracking, there needs to be a separate rig for hands and controllers for each side: right and left.

1. In the **Content Drawer**, double-click your **Pawn** asset to open it for editing.
2. In the**Components** panel, add a new **Motion Controller** component under the **DefaultSceneRoot** component. Name the new component *LeftMotionController*.
3. With the **LeftMotionController** component selected, set the **Motion Source** property to **Left** under **Motion Controller** in the **Details** panel.
4. In the**Components** panel, add a new **Isdk Controller Rig (L)** under the **LeftMotionController** component.
5. In the**Components** panel, add a new **Isdk Hand Rig (L)** under the **LeftMotionController** component.
6. In the**Components** panel, add a new **Motion Controller** component under the **DefaultSceneRoot** component. Name the new component *RightMotionController*.
7. With the **RightMotionController** component selected, set the **Motion Source** property to **Right** under **Motion Controller** in the **Details** panel.
8. In the**Components** panel, add a new **Isdk Controller Rig (R)** component under the **RightMotionController** component.
9. In the**Components** panel, add a new **Isdk Hand Rig (R)** component under the **RightMotionController** component.
10. In the**Components** panel, add a new **Camera** component under the **DefaultSceneRoot** component. Name the component *VRCamera*.
11. In the **Blueprint Editor** toolbar, click the **Compile** button to compile the `Pawn` and then click the **Save** button to save the asset to disk.

The Pawn Blueprint is an appropriate location for setting the tracking space. This can be done in response to the BeginPlay event.

1. In the Event Graph of your Pawn class, right-click next to the BeginPlay event and choose Is Head Mounted Display Enabled.
2. Drag off the Return value output pin and choose Branch. Drag a connection from the output exec pin of the BeginPlay event to the input exec pin of the Branch node.
3. Drag off the True output exec pin of the Branch node and choose Set Tracking Origin. Set the Origin pin value to Local Floor.
4. In the**Blueprint Editor** toolbar, click the **Compile** button to compile the `Pawn` and then click the **Save** button to save the asset to disk.

The completed network should look like this:

Interaction SDK uses Unreal’s **Enhanced Input** system to connect input events (such as *pinch*, or *button press*) to Unreal **Input Actions**. Interaction SDK’s **Input Action** assets are located in the *Plugins > OculusInteraction > Inputs* folder. The **Input Actions** are used by the prebuilt Interaction SDK rig components to invoke *select* events.

There are default Interaction SDK **Input Mapping Contexts** for both hands and controllers provided as part of the OculusInteraction plugin: *IMC\_IsdkHand* and *IMC\_IsdkControllerAnimation*. The **Input Mapping Context** binds the **Input Actions** to input signals. These mapping contexts are designed for the Meta XR plugin. When using the built-in OpenXR plugin, Interaction SDK provides automatic fallback behavior for hand interactions, such as using a pinch grab recognizer instead of the Enhanced Input pinch action. These mapping contexts should be added to the `EnhancedInputLocalPlayerSubsystem`.

The default mappings bind the following inputs and interactions:

| Source | Interaction | Input | 
|---|---|---|
| Hand | Poke | Extend index finger | 
| Hand | Ray Select | Pinch Index + Thumb | 
| Controller | Poke | Poke with tip of controller | 
| Controller | Ray Select | Press and hold Trigger | 

1. Right-click after the**Set Tracking Origin** function and choose *Get Player Controller*.
2. Drag off the output pin of the**Get Player Controller** node and choose *Get EnhancedInputLocalPlayerSubsystem*.
3. Drag off the**Enhanced Input Local Player Subsystem** node and choose *Add Mapping Context*.
4. On the**Add Mapping Context** function, set the **Mapping Context** pin value to reference the Interaction SDK hand **Input Mapping Context** asset, *IMC\_IsdkHand*.  Set the **Priority** to a value that makes sense for your use case. In this example, it is set to *1* to override the default Input Mapping Contexts registered in the VR Template.**Note:** to get this to show up, you may have to select **Show plugin content** and **Show engine content** from the gear icon next to the **Search Assets** textbox.
5. Drag a connection from the output exec pin of the**Set Tracking Origin** function to the input exec pin of the **Add Mapping Context** function.
6. Select the**Add Mapping Context** function and press **Ctrl + D** to duplicate it. Place the new function node to the right of the existing one. Drag a connection from the output pin of the **Enhanced Input Local Player Subsystem** node to the **Target** input pin of the new **Add Mapping Context** function.
7. Set the**Mapping Context** pin value to reference the Interaction SDK controller **Input Mapping Context** asset, *IMC\_IsdkControllerAnimation*. Set the **Priority** to a value that makes sense for your use case. In this example, it is set to *1* to override the default Input Mapping Contexts registered in the VR Template.
8. Drag a connection from the output exec pin of the first**Add Mapping Context** function to the input exec pin of the second **Add Mapping Context** function.
9. In the**Blueprint Editor** toolbar, click the **Compile** button to compile the `Pawn` and then click the **Save** button to save the asset to disk.

The completed network should look similar to this:

In this section, you will create a user interface using UMG. This section will focus only on the steps necessary to get a functioning UI. For more information on using UMG to create Widget Blueprints, see [Creating User Interfaces](https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-user-interfaces-with-umg-and-slate-in-unreal-engine) on the Unreal Engine documentation site.

1. In the**Content Drawer**, create a new *Widget Blueprint* asset using **User Widget** as the parent class. To find User Widget, you may need to select **All Classes** from the class picker. Name the new asset appropriately for your use case. In this example, it is called *UI\_Interactable*.
2. Double-click the new **Widget Blueprint** to open it in the **Widget Blueprint Editor**.
3. In the**Designer**, drag a **Canvas** widget from the **Palette** panel to the root in the **Hierarchy** panel.
4. Next, drag an**Image** widget from the **Palette** panel onto the *Canvas* widget in the **Hierarchy** panel. Make sure it is parented to the *Canvas* widget. Rename this widget to *Background*. Set the following properties of the *Background* widget:
  - **Size X**: 800.0
  - **SizeY**: 425.0
  - **Appearance** > **Color and Opacity**: Select a background color to use for the UI.
5. Drag a**Vertical Box** widget from the **Palette** panel onto the *Canvas* widget in the **Hierarchy** panel. Make sure it is parented to the *Canvas* widget. Set the following properties of the *Vertical Box* widget:
  - **Size X**: 800.0
  - **SizeY**: 425.0
6. Drag a**Text** widget from the **Palette** panel onto the *Vertical Box* widget in the **Hierarchy** panel. Make sure it is parented to the *Vertical Box* widget. Set the following properties of the *Text* widget:
  - **Padding**: 30.0
  - **Horizontal Alignment**: Center
  - **Text**: Enter a name for the UI. For this example, the menu is named *Controls Menu*.
  - **Font** > **Size**: 56
7. Drag a**Button** widget from the **Palette** panel onto the *Vertical Box* widget in the **Hierarchy** panel. Make sure it is parented to the *Vertical Box* widget. Set the following properties of the *Button* widget:
  - **Padding**: 20.0
  - **Appearance** > **Style** > **Normal**/**Hover**/**Pressed** > **Tint**: Select colors for each button state. Make sure they are distinct enough to easily see the differences when interacting with the UI.
  - **Appearance** > **Style** > **Normal**/**Hover**/**Pressed** > **Outline Settings** > **Corner Radii**: 30.0, 30.0, 30.0, 30.0.
  - **Appearance** > **Style** > **Normal**/**Hover**/**Pressed** > **Outline Settings** > **Width**: 0.0.
  - **Appearance** > **Style** > **Normal**/**Hover**/**Pressed** > **Outline Settings** > **Outline**: Set to match the color used for the Tint property above. This will hide any remaining artifacts from the rounding even with the outline width set to 0.0.
8. Drag a**Text** widget from the **Palette** panel to the *Button* widget in the **Hierarchy** panel. Make sure it is parented to the *Button* widget. Set the following properties of the *Text* widget:
  - **Padding**: 10.0
  - **Text**: Enter text to display on the *Button* widget. For this example, the button displays *Select Me*.
  - **Content** > **Text**: Enter text to display on the *Button* widget. For this example, the button displays *Select Me*.
  - **Appearance** > **Font** > **Size**: 36
9. Drag a**Slider** widget from the **Palette** panel to the *Vertical Box* widget in the **Hierarchy** panel. Make sure it is parented to the *Vertical Box* widget. Set the following properties of the *Slider* widget:
  - **Padding**: 0.0, 30.0
  - **Appearance** > **Value**: 0.5
  - **Style** > **Normal Bar Image** > **Tint**: Select a color for the slider bar.
  - **Style** > **Normal Bar Image** > **Draw As**: Rounded Box
  - **Style** > **Hovered Bar Image** > **Tint**: Select a color for the slider bar when hovered. Make it distinct enough from the normal bar image tint color to easily see the difference when interacting with the UI.
  - **Style** > **Hovered Bar Image** > **Draw As**: Rounded Box
  - **Style** > **Normal Thumb Image** > **Image Size**: 72.0, 72.0
  - **Style** > **Normal Thumb Image** > **Tint**: Select a color for the slider thumb.
  - **Style** > **Normal Thumb Image** > **Draw As**: Rounded Box
  - **Style** > **Hovered Thumb Image** > **Image Size**: 72.0, 72.0
  - **Style** > **Hovered Thumb Image** > **Tint**: Select a color for the slider thumb when hovered. Make it distinct enough from the normal thumb image tint color to easily see the difference when interacting with the UI.
  - **Style** > **Hovered Thumb Image** > **Draw A**s: Rounded Box
  - **Style** > **Bar Thickness**: 72.0
10. In the **Widget Blueprint Editor** toolbar, click the **Compile** button to compile the `Widget Blueprint` and then click the **Save** button to save the asset to disk.

The completed UI should look similar to the one shown below.

Interaction SDK provides a specialized Actor type, called `IsdkInteractableWidget`, that handles all the scaffolding and plumbing necessary to display a **Widget Blueprint** in the world and make it interactable using Interaction SDK interactions. In this section, you will place an instance of the UI you created previously into the world and configure it.

1. In the**Content Drawer**, make sure you are showing content from Plugins and Engine and select the *All* folder. Type *InteractableWidget* into the search box to filter the content and drag an **IsdkInteractableWidget** into your level.
2. Select the new*IsdkInteractableWidget*. In the **Details** panel, type *Widget* into the search box to filter the properties. This displays the **Widget Component** properties which are the ones you will need first to set up the UI.
3. Set the**Widget Class** to reference your `Widget Blueprint`. In this case, it is the *UI\_Interactable*.**Note:** You may need to rotate the `InteractableWidget` 180 degrees to see the UI in the viewport.
4. You need to set the size to display the UI at. There are two properties that work in conjunction to do this.**Draw Size** determines the resolution, or fidelity, of the rendered UI, while **Widget Scale** controls the size it is rendered at in the world. Set the **Draw Size** to the same size as the *Background* widget in the `Widget Blueprint`. In this example, it is set to *800.0*, *425.0*.
5. At the default**Widget Scale** of *0.02*, the UI may be a little small in the world for interacting with it. Set the value to *0.04* to increase the size.
6. Expand the**Rounded Box Material** section and enable the **Use Rounded Box Material** option.
7. Set the Corner Radius values to 30.0 to match the radii of the button and slider in the UI.
8. The**Background Color** specified here will blend with the color of the *Background* widget in the UI. Set the **Background Color** to the same color you used for the *Background* widget in the UI. Set the **Background Color.A** to *0.0* to preserve the original opacity of the *Background* widget.
9. Set the**Blend Mode** to *Transparent* since you want the UI to have transparency.
10. Enable the**Two Sided** option so the UI is visible from the front and back since it is being rendered in the 3D world.
11. In the**Details** panel, type *Interactable* into the search box to filter the properties. This displays the Interactable section which contains the settings for adding support for poke and ray interactions. Create Poke Interactable and Create Ray Interactable are both enabled by default, which is what you want for this example. If you don’t want the UI to work with one of those types of interactions, you can disable it here.
12. Click the dropdown next to**Default Poke Interactable Config Asset** and select *IsdkPokeInteractablePanelConfig*. This will assign some default configuration settings for poke interactions.
13. In the **Level Editor** toolbar, click the **Save** button to save the changes to disk.
14. Test out the level on your headset using the**VR Preview** available from the **Play Mode** menu.You can now press the button or drag the slider using your hand or with the controller either by poking or using ray selection.

To take this concept further and polish the experience, consider the following:

- Add a **Text** widget below the slider that displays the value of the slider.
- Use the *On Clicked* event of the button or the *On Value Changed* event of the slider to change something in the world, such as toggling a light on and off or changing its intensity with the slider.
- Make the UI [grabbable](https://developers.meta.com/vr/documentation/unreal/unreal-isdk-grab-interactions/) using an `IsdkGrabbableComponent`.

Now that you know how to get started with Interaction SDK, continue on to the following guides:

Design guidelines are Meta’s human interface standards and design frameworks that help you create safe, user-oriented, and retainable immersive and passthrough user experiences.

- [Input mappings](https://developers.meta.com/vr/design/interactions-input-mappings/): Understand how input mappings bridge modalities and interaction types.
- [Input hierarchy](https://developers.meta.com/vr/design/interactions-input-hierarchy/): Understand the input hierarchy.
- [Multimodality](https://developers.meta.com/vr/design/interactions-multimodality/): Understand multimodality.
- [Ray casting](https://developers.meta.com/vr/design/raycasting_usage/): Understand indirect interaction through ray casting.
- [Touch](https://developers.meta.com/vr/design/touch_usage/): Understand direct interaction through touch.
- [Grab](https://developers.meta.com/vr/design/grab_usage/): Understand grab interactions for object manipulation.
- [Microgestures](https://developers.meta.com/vr/design/design-microgestures/): Understand microgesture interactions.

- [Buttons](https://developers.meta.com/vr/design/buttons/): Recommendations for buttons controls.
- [Dropdown](https://developers.meta.com/vr/design/dropdowns/): Dropdown controls best practices.
- [Selectors](https://developers.meta.com/vr/design/selectors/): Guidelines for selectors controls.
- [Sliders](https://developers.meta.com/vr/design/sliders/): Understand slider controls.
- [Virtual keyboard](https://developers.meta.com/vr/design/virtual-keyboard/): Virtual keyboard controls best practices.

Support and legal

English (US)

© 2026 Meta
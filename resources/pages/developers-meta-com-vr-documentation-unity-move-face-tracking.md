# Face Tracking for Movement SDK for Unity | Meta Horizon OS Developers

> Source: https://developers.meta.com/vr/documentation/unity/move-face-tracking/
> Fetched: 2026-11-16 (IST) — readable copy for offline reference; content © its owner.

Develop

Updated: Sep 30, 2026

The Face Tracking API allows developers to use abstracted facial expression data to enhance social presence. For example, face tracking can help make a character’s facial expression look more natural during virtual interactions with other users. At a high level, creating a character with face tracking consists of creating the character to be represented with blendshapes that represent the facial expressions of your character, and adding the scripts to the character containing the blendshapes to read the API and map the expressions detected to the character blendshapes.

The Face Tracking API supports expressions based on the Facial Action Coding System (FACS) or the Oculus Viseme-based expressions. The FACS expressions represent the different 70 muscles that are used to animate the face. Visemes represent the shape of the mouth when producing phonemes (sounds) and are represented by 15 blendshapes. Both the traditional Lipsync library and the Face Tracking API described in this section use the same 15 Oculus Visemes.

On the Quest Pro, the facial movements detected by the headset sensors are converted to activations of the expressions of the FACS blendshapes, such as jaw drop and nose wrinkle.  On other VR devices, the audio stream is analyzed and translated into either FACS expressions or into Oculus Visemes relying on a machine learning model that has been trained on speech samples using a feature we call Audio To Expressions.

Within the face tracking implementation in Unity, these expressions are mapped into FACS-based blendshapes that an artist has created to represent the facial expressions of the character. In highly realistic cases and in the samples, there is one of these blendshapes representing each of the expressions detected by the sensors. However, it is important to realize that a human wearing the headset will typically trigger a multiple of these expressions at the same time. For instance, when you smile, you may see lip corner raisers and also other actions on the cheek or even the eye.  The API returns a weight corresponding to the strength of the expression (for example, barely raising an eyebrow or an extreme raise of an eyebrow). The list of expressions that are fired along with their weights are then used to activate the blendshapes.  Since these blendshape meshes can be deformed corresponding to the strength (or weight) of the expression, the combination of the different meshes combine to create the effect desired. There is no absolute requirement to match the number of FACS-based blendshapes and the number of expressions.  For instance, you could create a simple avatar with two blendshapes (neutral and smile). You could then map only a few of the expressions provided, such as lip corner raiser, to detect a smile and activate the smile blendshape.

The Face Tracking API provides FACS-based blendshapes that represent most of the face including nose, mouth, jaw, eyebrows, and areas close to the eye. This provides coverage for the facial movements that make up smiling, frowning, surprise, and other facial expressions. This allows developers to provide their users with characters that can range from high-quality 3D representations for realistic VR experiences, to extremely stylized ones for fantasy and science-fiction environments.

For highly realistic characters, it is especially important to use accurate photogrammetry that will generate face assets and provide each of the 70 FACS expressions or the 15 visemes that the Face Tracking API defines. These can be combined to a skinned mesh.

When a user enables Natural Facial Expressions for your app, your app is granted access to real time abstracted facial expressions data which is user data under the [Developer Data Use Policy](https://developers.meta.com/vr/policy/data-use/). This data is only permitted to be used for purposes outlined in the Developer Data Use Policy.  You are expressly forbidden from using this data for [Data Use Prohibited Practices](https://developers.meta.com/vr/policy/data-use/#section-4-prohibited-uses-of-user-data). The Natural Facial Expressions feature is powered by our Face Tracking API.

Your use of the Face Tracking API must at all times be consistent with the [Oculus SDK License Agreement](https://developers.meta.com/horizon/licenses/pc-3.3/), the [Developer Data Use Policy](https://developers.meta.com/vr/policy/data-use/) and all applicable Oculus and Meta policies, terms, and conditions. Applicable privacy and data protection laws may cover your use of Movement, and all applicable privacy and data protection laws.

In particular, you must post and abide by a publicly available and easily accessible privacy policy that clearly explains your collection, use, retention, and processing of data through the Face Tracking API. You must ensure that a user is provided with clear and comprehensive information about, and consents to, your access to and use of abstracted facial expression data prior to collection, including as required by applicable privacy and data protection laws.

Please note that Meta reserves the right to monitor your use of the Face Tracking API to enforce compliance with our policies.

The following are known issues:

- Confidence values for Face Tracking API facial expressions are not populated.
- Audio to Expressions: Yawning may not result in the character opening their mouth as the models are trained mostly on verbal input.
- Audio to Expressions: When the app first launches, there may be up to 10 seconds until the voice is fully connected to drive the face animation. This problem has been observed after a reboot of the device.
- Similar to visual based face tracking, the Audio to Expressions model is trained on how users really move their lips. For users expecting more exaggerated movements like provided with visemes, you can increase the multipliers in the retargeting configuration file. See the JSON configuration section.

After completing this section, the developer should be able to:

1. Set up a new project for face tracking.
2. Enable a character using blendshapes corresponding directly to the Face Tracking API for face tracking.
3. Enable a character using ARKit blendshapes for face tracking.
4. Enable a character using Visemes for face tracking.

After configuring your project for VR, follow these steps.

1. Make sure you have an **OVRCameraRig** prefab in your scene. The prefab is located at `Packages/com.meta.xr.sdk.core/Prefabs/OVRCameraRig.prefab`.
2. Select the **OVRCameraRig** object in the **Hierarchy**. Then, locate the **OVRManager** component in the **Inspector**.
3. Expand the **Quest Features** item and click **General**.
4. If you want hand tracking, select **Controllers and Hands** for **Hand Tracking Support**.
5. Ensure **Face Tracking Support** is set to **Supported**.
6. Fix any issues diagnosed by the Project Setup Tool. On the menu in Unity, go to **Edit** > **Project Settings** > **Meta XR** to access the Project Setup Tool.
7. Select the **Android, Meta Quest** platform tab.
8. Click **Fix All** if there are any issues. For details, see [Use Project Setup Tool](https://developers.meta.com/vr/documentation/unity/unity-upst-overview/).

- Step 1: Characters with FACS-based blendshapes. If your character has blendshapes that correspond to our face tracking API blendshapes (see [FACS-based blendshapes](https://developers.meta.com/vr/documentation/unity/move-face-tracking/#facs-based-blendshapes)) follow this step. Otherwise, skip to Step 2.
  - Step 1a: There is a helper function under **Game Object** > **Movement SDK** > **Face Tracking** > **Add A2E Face**. This should be used as a base setting, but it should be examined and modified based on the target character to make certain that blendshapes predictably work together.
- Step 2: Characters with ARKit Blendshapes. Right-click on your character’s face skinned mesh that has blendshapes, then use the ARKit helper function under**Game Object** > **Movement SDK** > **Face Tracking** > **Add A2E ARKit Face** which establishes our default mappings for ARKit.
- Step 3: Make sure your character has`FaceDriver` and `FaceRetargeterComponent` components, and the `FaceRetargeterComponent` component references a `OVRWeightsProvider`. The `FaceDriver` should reference meshes that animate in response to face tracking.
- Step 4: Test your character. At this point your character should be ready to test by donning the headset with the character being used. The `FaceRetargeterComponent`’s “Retargeter Config” field references a JSON that can be modified to influence how the character animates.

`RecalculateNormals` component.
To configure the `RecalculateNormals` component:

1. Assign the character’s face skinned mesh renderer to the **Skinned Mesh Renderer** field.
  - You must use a compatible material based on `Movement/PBR (Specular)` or `Movement/PBR (Metallic)` on the skinned mesh renderer in order for normal recalculation to work.
2. Set the **Recalculate Material Indices** array to the indices of the materials that normal recalculation needs to be run on. Indicate the index of the sub mesh that recalculation should operate on using the “Sub Mesh” array.
3. Set the **Duplicate Layer** field to the layer that the character is located on.
4. Set the **Hidden Mesh Layer Name** field to the layer name that isn’t rendered by the camera.
  - If no layer exists, head to **Edit** > **Project Settings** > **Tags and Layers**, expand the **Layers** section, and then create a new layer in an empty slot (for example, enter a name like `HiddenMesh` in one of the User Layer fields). Use this new layer name for the **Hidden Mesh Layer Name** field. The `RecalculateNormals` script will change the culling mask for all cameras in the scene to exclude the rendering of this layer.
5. Enable the **Recalculate Independently** field.

This section offers a brief description for the **OVR Face Expressions** component that defines the blendshapes that drive face tracking.

The [`OVRFaceExpressions`](https://developers.meta.com/horizon/reference/unity/latest/class_o_v_r_face_expressions/) component queries and updates face expression data every frame. The `OVRFaceExpressions` component script defines an indexer for accessing face expression data and provides the field `ValidExpressions` to indicate whether or not expression data is valid. This component only works in apps that users granted face tracking permissions for.

Implements a retargeting  `WeightsProvider` to map source tracking weights to a set of target weights based on a JSON configuration file. Each item in this file defines a set of input drivers, and what combination of output weights this specific combination should map to. The `FaceRetargeterComponent` class then creates a mapping function implementing these. The intended consumer for these weights is a `FaceDriver` instance.

Implements a rig concept based on a naming convention, and drives the deformation. Using a list of blendshapes extracted from a list of skinned meshes, it builds a `RigLogic` instance, which interprets each name in terms of direct driver signals, in-betweens and correctives, and assembles their activation functions. The signals from the associated `WeightsProvider` then drive the deformation.

An abstract class that provides weights values to consumers. Examples include `FaceRetargeterComponent` and `OVRWeightsProvider`.

Each character’s `FaceRetargeterComponent` references “Retargeter Config” field that can be used to tweak the character’s performance by modifying the drivers (`FaceExpression`) that drive the targets (target FACS-based blendshapes) via weights. For instance, when setting up a character using **Game Object**->**Movement SDK**->**Face Tracking**->**Add A2E ARKit Face**, a default `arkit_retarget_a2e_v10.json` configuration is added. Each entry is this configuration has an `FaceExpression` name followed by a list of ARKit blendshape names that are driven by it. If you wish for the corresponding ARKit blendshape to react differently, you can increase the weight next to it. Optionally, you can change the FACS-based blendshapes modified by removing and adding entries. This workflow does not apply to Viseme-based blendshapes.

This section describes configuring a character with [Viseme-compatible blendshapes](https://developers.meta.com/vr/documentation/unity/move-face-tracking/#viseme-blendshapes).

To use Visemes, follow the steps discussed [above](https://developers.meta.com/vr/documentation/unity/move-face-tracking/#set-up-a-project-that-supports-face-tracking), and then enable the following:

1. Select **OVRCameraRig** in the **Hierarchy**. Locate the **OVR Manager (Script)** item in the **Inspector**.
2. Expand **Quest Features**. Then, click **Experimental** and check the **Experimental Features Enabled** item.
3. Expand **Tracking** > **Face Tracking**. Then, check the **Visual**, **Audio**, and **Enable visemes** items.
4. Expand **Permission Requests On Startup**. Then, check the **Record Audio for audio base Face Tracking** item.

`OVRFaceExpressions``AreVisemesValid` to query viseme validity, and `GetViseme` to obtain the weight of a given `FaceViseme`. `TryGetFaceViseme` is similar to `false` if the provided For quicker Viseme integration, use the `VisemeDriver` component in the [Oculus Samples GitHub package](https://github.com/oculus-samples/Unity-Movement). To use it, follow these steps:

- Step 1: Add `VisemeDriver` as a component to each skinned mesh renderer that has viseme-compatible blendshapes.
- Step 2: Click on the “Auto Generate Mapping” button to associate the skinned mesh renderer blendshapes to visemes.
    
  - Step 2a: The “Clear Mapping” button can be used to clear these associations.
- Step 3: Check the mappings that have been generated on the `VisemeDriver` component and make changes if required.

If you notice unusual creases that appear near the eyelids, please use the `RecalculateNormals` component discussed above.

1. **Which headset models support face tracking?**
Natural Facial Expressions, which estimates facial movements based on inward facing cameras, is only available on Meta Quest Pro headsets. However, Audio To Expressions is available on all Meta Quest 2, Meta Quest 3, and Meta Quest 3S devices with the same API.
2. **Does Meta VR Glasses support face tracking for 3P apps?**
No. There’s no camera-based face tracking available to apps on Meta VR Glasses. Face animation (aka Blendshapes) for apps is driven by Audio To Expressions, the same audio-driven approach that powers stylized avatars on Quest 3 and Quest 3S today. This method and eye movement are both provided by Movement SDK. Hologram calling does utilize camera-based face tracking on Meta VR Glasses but there is no 3P developer API.
3. **How do I adapt my existing blendshapes to the FACS blendshapes Face Tracking API provides?**
If the existing blendshapes don’t match the naming convention of the expected blendshapes in[`OVRFace`](https://developers.meta.com/vr/reference/unity/v209/class_o_v_r_face/), the blendshapes will need to be manually assigned. One may also inherit [`OVRCustomFace`](https://developers.meta.com/vr/reference/unity/v209/class_o_v_r_custom_face/) to create their own custom mapping. The blendshape visual reference can be found in the [Movement - Face BlendShapes](https://developers.meta.com/vr/documentation/unity/move-face-tracking/#facs-based-blendshapes) topic.
4. **Are tongue blendshapes supported?**
Yes, a total seven tongue blendshapes are supported, including tongue out, among the FACS blendshapes provided.

| **Blendshapes** | 
|---|
| `BROW_LOWERER_L` and `BROW_LOWERER_R` knit and lower the brow area and lower central forehead. | 
| `CHEEK_PUFF_L` and `CHEEK_PUFF_R` fill the cheeks with air causing them to round and extend outward. | 
| `CHEEK_RAISER_L` and `CHEEK_RAISER_R` tighten the outer rings of the eye orbit and squeeze the lateral eye corners. | 
| `CHEEK_SUCK_L` and `CHEEK_SUCK_R` suck the cheeks inward and against the teeth to create a hollow effect in the cheeks. | 
| `CHIN_RAISER_B` and `CHIN_RAISER_T` push the skin of the chin and the lower lip upward. When the lips are touching, the upward force from the lower lip pushes up the top lip as well. | 
| `DIMPLER_L` and `DIMPLER_R` pinch the lip corners against the teeth, drawing them slightly backward and often upward in the process. | 
| `EYES_CLOSED_L` and `EYES_CLOSED_R` lower the top eyelid to cover the eye. | 
| `EYES_LOOK_DOWN_L` and `EYES_LOOK_DOWN_R` move the eyelid consistent with downward gaze. | 
| `EYES_LOOK_LEFT_L` and `EYES_LOOK_LEFT_R` move the eyelid consistent with leftward gaze. | 
| `EYES_LOOK_RIGHT_L` and `EYES_LOOK_RIGHT_R` move the eyelid consistent with rightward gaze. | 
| `EYES_LOOK_UP_L` and `EYES_LOOK_UP_R` move the eyelid consistent with upward gaze. | 
| `INNER_BROW_RAISER_L` and `INNER_BROW_RAISER_R` lift the medial brow and forehead area. | 
| `JAW_DROP` moves the lower mandible downward and toward the neck. | 
| `JAW_SIDEWAYS_LEFT` moves the lower mandible leftward. | 
| `JAW_SIDEWAYS_RIGHT` moves the lower mandible rightward. | 
| `JAW_THRUST` projects the lower mandible forward. | 
| `LID_TIGHTENER_L` and `LID_TIGHTENER_R` tighten the rings around the eyelids and push the lower eyelid skin toward the inner eye corners. | 
| `LIP_CORNER_DEPRESSOR_L` and `LIP_CORNER_DEPRESSOR_R` draw the lip corners downward. | 
| `LIP_CORNER_PULLER_L` and `LIP_CORNER_PULLER_R` draw the lip corners up, back, and laterally. | 
| `LIP_FUNNELER_LB`, `LIP_FUNNELER_LT`, `LIP_FUNNELER_RB`, and `LIP_FUNNELER_RT` fan the lips outward in a forward projection, often rounding the mouth and separating the lips. | 
| `LIP_PRESSOR_L` and `LIP_PRESSOR_R` press the upper and lower lips against one another. | 
| `LIP_PUCKER_L` and `LIP_PUCKER_R` draw the lip corners medially causing the lips to protrude in the process. | 
| `LIP_STRETCHER_L` and `LIP_STRETCHER_R` draw the lip corners laterally, stretching the lips and widening the jawline. | 
| `LIP_SUCK_LB`, `LIP_SUCK_LT`, `LIP_SUCK_RB`, and `LIP_SUCK_RT` suck the lips toward the inside of the mouth. | 
| `LIP_TIGHTENER_L` and `LIP_TIGHTENER_R` narrow or constrict each lip on a horizontal plane. | 
| `LIPS_TOWARD` forces contact between top and bottom lips to keep the mouth closed regardless of the position of the jaw. | 
| `LOWER_LIP_DEPRESSOR_L` and `LOWER_LIP_DEPRESSOR_R` draw the lower lip downward and slightly laterally. | 
| `MOUTH_LEFT` pulls the left lip corner leftward and pushes the right side of the mouth toward the left lip corner. | 
| `MOUTH_RIGHT` pulls the right lip corner rightward and pushes the left side of the mouth toward the right lip corner. | 
| `NOSE_WRINKLER_L` and `NOSE_WRINKLER_R` lift the sides of the nose, nostrils, and central upper lip area. Often pairs with brow lowering muscles to lower the medial brow tips. | 
| `OUTER_BROW_RAISER_L` and `OUTER_BROW_RAISER_R` lift the lateral brows and forehead areas. | 
| `UPPER_LID_RAISER_L` and `UPPER_LID_RAISER_R` pull the top eyelid up and back to widen eyes. | 
| `UPPER_LIP_RAISER_L` and `UPPER_LIP_RAISER_R` lift the top lip (in a more lateral manner than nose wrinkler). | 
| `TONGUE_TIP_INTERDENTAL` raises the tip of the tongue to touch the top teeth like with the viseme “TH”. The tongue is visible and slightly sticks out past the teeth line. | 
| `TONGUE_TIP_ALVEOLAR` raises the tip of the tongue to touch the back of the top teeth like in the viseme “NN”. | 
| `TONGUE_FRONT_DORSAL_PALATE` presses the front part of the tongue against the palate like in the viseme “CH”. | 
| `TONGUE_MID_DORSAL_PALATE` presses the middle of the tongue against the palate like in the viseme “DD”. | 
| `TONGUE_BACK_DORSAL_VELAR` presses the back of the tongue against the palate like in the viseme “KK”. | 
| `TONGUE_OUT` sticks the tongue out. | 
| `TONGUE_RETREAT` pulls the tongue back in the throat and makes the tongue stay down like in the viseme “AA”. | 

| **Viseme** | **Phonemes** | **Examples** | **Mild** | **Emphasized** | **Rotated** | 
|---|---|---|---|---|---|
| SIL | neutral |  |  | None |  | 
| PP | p, b, m | put, bat, mat |  |  |  | 
| FF | f, v | fat, vat |  |  |  | 
| TH | th | think, that |  |  |  | 
| DD | t, d | tip, doll |  |  |  | 
| KK | k, g | call, gas |  |  |  | 
| CH | tS, dZ, S | chair, join, she |  |  |  | 
| SS | s, z | sir, zeal |  |  |  | 
| NN | n, l | lot, not |  |  |  | 
| RR | r | red |  |  |  | 
| AA | A: | car |  |  |  | 
| E | e | bed |  |  |  | 
| IH | ih | tip |  |  |  | 
| OH | oh | toe |  |  |  | 
| OU | ou | book |  |  |  | 

Support and legal

English (US)

© 2026 Meta
# Magic Wonders - visual reference stills (2025 winner)

> **Attribution / use.** All images are (c) Magic Wonders (Federico and Martin Perez), the 2025 Meta Horizon Start Developer Competition winner
> "Best Experience Built with React Native". They are kept here **for internal reference only** (a visual mood board for the coding agent),
> must **not** be shipped in the app, the trailer or the Devpost entry, and are not licensed for reuse. Re-create the *style* with our own assets.

## Read this first - what the footage actually is

* The YouTube video ([NTN3Vbj88MY](https://www.youtube.com/watch?v=NTN3Vbj88MY), 2 min 24 s) is a **phone-app screen recording** over an animated purple lightning/nebula background - it is **not** Quest passthrough footage. It shows their UI/VFX language, the **gesture-drawing** mechanic and glow treatment, not a mixed-reality scene.
* The nearest thing to "hands doing magic" is the official **site promo video** (live action: a hooded child raises both hands, purple light washes the face, a smart lamp glows) and the Devpost marketing composites.
* The Devpost page ([software/magic-wonders](https://devpost.com/software/magic-wonders)) also says the VR scene with real hand-tracked spellcasting was still "what's next"; their Quest/Expo build was an Early Access app. We found no public Quest screenshots, so there are none here.
* Their palette: near-black violet UI, **electric purple / magenta core with cyan-white highlights**, gold serif logotype, glowing icon-medallions on dark cards, soft nebula backdrops.

## How to read the table

`How to adapt` is for **Hast Rekha** (Unity, Quest passthrough, glowing palm lines, pinch a line to open its world, divine/Vedic theme). Colours: swap purple for gold/ember/saffron per [`../../../hast-rekha-magic-design.md`](../../../hast-rekha-magic-design.md) section 3.

## Source A - YouTube video (downloaded with yt-dlp 2026.10.26, 1080p, no cookies, default clients)

Frames are cropped to the phone area (500x1010) except the two full frames. Timestamps are video time.

| File | Source | Time | What it shows | How to adapt for Hast Rekha |
|---|---|---|---|---|
| `yt-t003s_title-logo-lightning-bg.jpg` | [YouTube](https://www.youtube.com/watch?v=NTN3Vbj88MY) | 0:03 | Title card: gold-and-silver serif "MAGIC WONDERS" with a swirl ring, on a violet energy-lightning vortex. | Title/end-card feel: warm gold serif logotype over a slowly rotating nebula; ours: Devanagari "हस्त रेखा" in gold over a saffron-indigo mandala vortex. |
| `yt-t018s_crystal-card-umbra.jpg` | same | 0:18 | "Congratulations!" card for an "Umbra Crystal": a glowing magenta crystal medallion with a gradient energy halo, ability text and a small lightning-glyph chip beneath. | Template for the **line-reveal card**: when a line is touched, show its glowing emblem (e.g. a lotus for the Heart line) with a halo and a one-line meaning chip. |
| `yt-t025s_lightning-bolt-gesture-trail.jpg` | same | 0:25 | "Draw the lightning bolt gesture": a violet bolt glyph with a bright white-violet core and a trailing glow while a pointer traces it; prompt text above, "Unleash your magic!" below. | **Glow trail look**: hot white core + coloured halo + fading tail. Use for the stroke that runs along a palm line when it ignites, and for the finger trail on hover. |
| `yt-t028s_training-complete-cloaked-glow.jpg` | same | 0:28 | "Training Complete!": a dim hooded figure with a teal glowing staff-light emerging from darkness (captured mid cross-fade). | Mood for the **world-intro**: dark scene, a single small light, reveals slowly - matches the "bloom from the palm" beat. |
| `yt-t048s_loadout-crystal-and-spells.jpg` | same | 0:48 | "Prepare for Battle": a magenta crystal tile and a 3x2 grid of round neon icon-medallions (poison, blind, stun, regenerate, confuse, first strike), each a bright glyph in a dark circle. | **Icon language** for the line/mount picker or the tradition's marks: one bright single-colour glyph per dark circular badge. |
| `yt-t060s_duel-opponent-cloak-spell-tray.jpg` | same | 1:00 | Duel screen: hooded opponent silhouette with a green glow in a purple mist, below it a tray of spell icons with one magenta tile highlighted and a countdown "4". | Shows the **selected-state** treatment: the chosen item gets a saturated magenta border glow while others stay dim. Use for the hovered/selected line vs the rest. |
| `yt-t066s_draw-gesture-nebula-stroke.jpg` | same | 1:06 | Gesture-capture screen: a thick white stroke (a caret shape) drawn over a swirling dark-purple nebula, countdown ring "6" and "Please wait...". | The **drawing surface** is a living nebula that sits behind the stroke. In VR: a faint swirling shader on the palm plane while the user hovers; stroke stays crisp white-hot. |
| `yt-t070s_spells-resolve-center-orb.jpg` | same | 1:10 | "Spells resolve!": two spell cards top and bottom, a small glowing teal vortex orb in the middle where they collide. | The **clash/reveal moment** is tiny and centred: a spinning orb between two cards. Use a small orb over the touched point of the line before the portal blooms. |
| `yt-t105s_you-won-glowing-wand-nebula.jpg` | same | 1:45 | Full frame. "You Won!" screen: a luminous blue-white nebula cloud, a wand with a glowing teal tip rising into it. | The **reward/portal bloom**: a soft nebula cloud opens around a bright point. Reference for the portal bubble opening from the palm (gold cloud instead of blue). |
| `yt-t121s_smart-home-room-purple-wand-light.jpg` | same | 2:01 | Smart Home tab: a hero photo of a dim room with a purple light streak from a wand, "Cast Enchantment" button, Alexa integration toggle. | Their **real-world reaction** idea (the room responds). For us: tint the passthrough gold when a world opens (OVRPassthroughLayer LUT) - the same "the real room answers" feel. |
| `yt-t126s_gesture-library-grid.jpg` | same | 2:06 | **Gesture vocabulary** grid: nine bordered tiles each with a thin white-glow stroke icon and a label (Open Infinity, Diagonal slash, Eye outline, Heart outline, Spiral, Lightning bolt, Checkmark, Caret Up, S Shape). | Direct model for our **tutorial glyph set** and for ghost-hand prompts: simple strokes, one label each. Hast Rekha's 3 gestures: show palm, touch/pinch a line, close fist. |

## Source B - Devpost gallery (official project images)

Original 1620x1080 PNGs from the Devpost CDN (`d112y698adiu2z.cloudfront.net/photos/production/software_photos/004/076/305..309/datas/original.png`), resized to 1280 px.

| File | Source | What it shows | How to adapt for Hast Rekha |
|---|---|---|---|
| `devpost-gallery-1_duel-cards-floating.jpg` | [Devpost](https://devpost.com/software/magic-wonders) gallery 1 ("App Showcase") | A tilted phone showing the Duel screen (a glowing blue "Freeze" crystal card above, a "+3 Heal" card below, a centre vortex orb) with **floating UI chips** ("Freeze", "-2", "+3", heart rings) breaking out of the phone onto a purple nebula. | Floating **damage/status chips** = our floating **meaning chips** that leave the palm and hover near a line ("vitality", "feeling") with a soft drop-glow. |
| `devpost-gallery-2_prepare-for-battle-logo.jpg` | gallery 2 ("Select Your Build") | Three tilted phones: loadout screen with ornate gradient crystal cards, the gold swirl "MAGIC WONDERS" splash, and a duel screen with a hooded opponent. | Cards with **ornate gradient backgrounds** (fire, ice, dark) - use one gradient + one motif per line world (Life: green-gold roots; Heart: rose-teal lotus). |
| `devpost-gallery-3_cast-spiral-gesture-screens.jpg` | gallery 3 ("Duel Phases") | Phones fanned out: centre screen "Cast your spell!" with a large white **spiral stroke** drawn over a nebula, another with a red-orange "Inferno" spell card in a fiery vortex, hooded opponent top-left. | Best reference for the **hand-drawn glowing line** look: thick white core, soft halo, nebula behind; also shows the **spell-card with a vortex of colour** around an icon. |
| `devpost-gallery-4_smart-home-enchant-gestures.jpg` | gallery 4 ("Smart Home" / "Spell Resolution") | Phones: a smart-home screen with a dim room photo, the tutorial "To Smart Home" with a person holding a glowing wand, the Alexa "Enchant" screen with a grid of stroke gestures, and a "Cast Your Enchantments" caret stroke. | Gesture tiles again, plus the **person-in-room hero photo** style for our trailer's real-hand shots (warm room, one coloured light on the face). |
| `devpost-gallery-5_spell-cards-glow-icons.jpg` | gallery 5 | A "Prepare for Battle" phone in the middle surrounded by large floating **spell medallions**: Absolute Freeze (cyan snowflake), Shadow Eclipse (violet ring), Inferno (red flame), Stunt (orange starburst), Overclock (blue ring), Block, Haste, Poison... each a bright glyph in a dark circle on a rounded gradient card. | **Best sheet of the glow-icon style**: dark circular medallion + one neon glyph + outer gradient glow + label. Model for the planet/mount medallions (Surya starburst, Chandra ring, Mangal flame...). |

## Source C - magicwonders.com official promo video and OG image

Public 46 s promo on the official site (Cloudflare Stream HLS, downloaded with yt-dlp), plus the site's OG image.
Page: [magicwonders.com](https://www.magicwonders.com/) (HLS `customer-dd453chvyfaxjizy.cloudflarestream.com/0923dc43b8ee4cad6a6a51eb05d24756/manifest/video.m3u8`). Timestamps are promo-video time.

| File | Source | Time | What it shows | How to adapt for Hast Rekha |
|---|---|---|---|---|
| `site-promo-t002s_hands-raised-at-camera.jpg` | promo video | 0:02 | A hooded child, hands raised toward the camera with fingers spread, intense look, warm room. | **The gesture pose**: both open palms to camera. This is the "show palm" start pose for our trailer's first shot. |
| `site-promo-t018s_hands-up-purple-glow-on-face.jpg` | promo video | 0:18 | The child with both hands up; purple-magenta light from the scene colours the face and hood. | **Light from the hands onto the face**: when lines ignite, our passthrough should tint the room/face warmly - capture it in the trailer by lighting. |
| `site-promo-t022s_crystal-card-miraqua-energy.jpg` | promo video | 0:22 | Three tilted spell cards; the centre "Miraqua" card has a cyan crystal inside a swirling electric-blue energy vortex with tendrils crackling outside the frame. | **Energy tendrils around an emblem**: arcing wisps around the opened line emblem; in Unity, a few animated line-renderer arcs plus a vortex shader. |
| `site-promo-t008s_wand-crystal-tip-glow.jpg` | promo video | 0:08 | Close-up of a smart wand on a wooden table, its crystal tip glowing violet-white, a hand about to pick it up, magenta rim light. | **Point-light emitter** at the tip: small bright core + bloom. Use at the fingertip as it nears a line. |
| `site-promo-t016s_smart-lamp-glows-purple.jpg` | promo video | 0:16 | A real smart lamp on a shelf glowing violet, wooden table, plants. | The **real-world reaction** shot. Our equivalent: the passthrough room warming to gold when a world opens. |
| `site-promo-t026s_phone-spell-loadout.jpg` | promo video | 0:26 | Phone lying on a wooden table, the loadout/duel screen glowing, magenta highlight on a chosen spell, hand-held filming style. | Shows the **screen-in-the-world** shot style; for us a headset-capture shot with the glowing UI near the hand. |
| `site-og-image_woman-casting-energy-trail.jpg` | [og-image](https://www.magicwonders.com/images/og-image.jpg) | - | A woman laughing and flicking her wrist, a luminous violet-white energy trail curling past her hand; Meta / NVIDIA Inception program badges lower-left. | **Energy trail following a hand motion**: a ribbon with fading tail. Best single picture for the palm-line "river of light" flowing off the hand. |

## Sources tried

| Source | Result |
|---|---|
| yt-dlp (current pip release, plain web client, no cookies) | **worked**: format list returned and 1080p video downloaded; no special client flags or cookies needed from this box |
| YouTube storyboard sprites (sb0/sb1/sb2) | listed by yt-dlp but not needed once the video downloaded |
| `i.ytimg.com/vi/ID/maxresdefault.jpg`, `hq1..3` | all 200 (maxres is a gesture-screen frame, a duplicate of what is in the video); not kept |
| Devpost gallery (5 PNGs) | worked (see Source B) |
| magicwonders.com promo video + OG image | worked (see Source C) |
| Meta Horizon Store, Kickstarter | not scraped (no screenshot URLs found without a signed-in session; the VR app is "Early Access" per the team's posts) |
| X (Twitter) media from their posts | downloaded but they are duplicates of the Devpost gallery or contain a named private individual; not kept |

Re-create the frame set: `yt-dlp -f 137 -o mw.mp4 https://www.youtube.com/watch?v=NTN3Vbj88MY` then
`ffmpeg -ss 25 -i mw.mp4 -frames:v 1 -vf "crop=500:1010:710:35" out.jpg` (use `-vf scale=1280:-1` for a full frame).

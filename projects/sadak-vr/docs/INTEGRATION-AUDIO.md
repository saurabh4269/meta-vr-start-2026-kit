# SADAK audio: integration notes for the director

`src/sadak-audio/` is SADAK's game audio, ported as faithfully as Web Audio on
a Quest allows: the Delhi music (Qawwali in raga Kafi), SADAK's SFX clips and
names, the location-card raga chime, and the synthesised street (traffic
rumble and per-vehicle horns, crowd, temple bells and chant, the azaan at
prayer times). It is plain TypeScript with no React and no files to fetch. All
of it is synthesised, apart from ten CC0 Kenney clips embedded as data URIs.
SADAK's owner gave permission to reuse it. Every file has a provenance
header naming its SADAK source and what changed.

Nothing in `src/game/**` or `src/index.ts` is wired to it yet. This note says
how to wire it.

## API

```ts
import { sadakAudio, CHANDNI_CHOWK, type SfxName, type Nearby } from './sadak-audio/index.js';

sadakAudio.unlock(ctx?)            // create/resume the AudioContext; call from a user gesture. Pass one to share it.
sadakAudio.context                 // AudioContext | null
sadakAudio.music.start('delhi')    // idempotent; called before unlock it waits for unlock
sadakAudio.music.stop()
sadakAudio.music.duck(on)          // to silence in 0.35 s (time constant), back in 1.4 s, as SADAK does
sadakAudio.music.enabled = false   // stops the scheduler (no CPU); true restarts from the intro
sadakAudio.sfx.play(name)          // 'click'|'tap'|'success'|'partial'|'error'|'cash'|'open'|'hover'|'switchOn'|'switchOff'|'close'
sadakAudio.sfx.enabled = false     // SFX bus off: also silences the chime and stops the ambience (one bus, as in SADAK)
sadakAudio.chime()                 // location-card chime: santoor S g P S' in Kafi, then a manjira ching
sadakAudio.ambience.start() / .stop()
sadakAudio.ambience.duck(on)       // down to 0.15 under dialogue, as SADAK does
sadakAudio.ambience.setNearby({ vehicles, people, templeDist, mosqueDist, waiting })  // any subset, any time
sadakAudio.ambience.update(dt)     // every frame, dt in seconds; allocation-free
sadakAudio.muted = true            // master mute; stops the music and ambience schedulers
// testing extras: sadakAudio.ambience.callAzaan(), sadakAudio.ambience.ringBell()
```

### `Nearby`

| Field | Meaning | Default (`CHANDNI_CHOWK`) |
| --- | --- | --- |
| `vehicles` | vehicles within earshot (about 70 m), 0 to 24. Sets the rumble and how many can honk. | 12 |
| `people` | people within about 25 m. The crowd murmur is full at 25. | 30 |
| `templeDist` | metres to the nearest temple. Bells within 70 m, chant within 40 m. `Infinity` means none. | 20 (the mandir by the flower stall) |
| `mosqueDist` | metres to the nearest mosque, for the azaan's level. `Infinity` means none, so no azaan. | 110 (Jama Masjid at x = -104) |
| `waiting` | traffic is held up: the 3 nearest vehicles move in to 4 to 10 m and honk insistently (SADAK's `heldUp`: a 0.7/s chance, at least 1.2 s apart). | false |
| `templeBearing`, `mosqueBearing` (optional) | direction from where the listener faces, in radians, positive to the right. Pans the bells, chant and azaan. | 1.1, -1.4 |

The defaults already sound like a busy Chandni Chowk, so `start()` with no
`setNearby` works. For panning, set the bearings from the head pose now and
then (a few times a second is plenty). The virtual vehicles have their own
bearings, which drift.

## Wiring it in (suggested, in `src/game/director.ts`)

1. **Unlock, sharing the context.** Where `sfx.unlock()` runs (the
   pointerdown handler and the Enter XR path), add
   `sadakAudio.unlock(sfx.context ?? undefined)`. One AudioContext then serves
   the existing voice bus, the old SFX and SADAK's audio. `unlock` is safe to
   call repeatedly.
2. **Street bed.** Replace `sfx.startStreet()` / `sfx.stopStreet()` (reveal
   phase, leaving XR) with `sadakAudio.ambience.start()` / `.stop()`. In
   `update(delta)`, call `sadakAudio.ambience.update(delta)`. Start the music
   at the same moment: `sadakAudio.music.start('delhi')`.
3. **Ducking (SADAK's rule).** Music goes silent and the street drops to 0.15
   whenever someone is speaking or the mic is held, and while a menu is open:
   ```ts
   const duck = speaking || micRecording || menuOpen;
   sadakAudio.music.duck(duck);
   sadakAudio.ambience.duck(duck);
   ```
   Call it on changes, not every frame, because each call restarts the gain
   ramp. The simplest hook is in `speech.ts`, beside
   `sfx.setStreetLevel(0.45)` and `sfx.setStreetLevel(1)`, plus the mic's
   start and stop.
4. **SFX on events (as SADAK fires them).**

   | Event | SADAK | Here |
   | --- | --- | --- |
   | voice reply scored (`scoreAttempt`) | points ≥ 72 `success`, ≥ 40 `partial`, else `error` | same thresholds in `finishVoice` |
   | heard nothing from the mic | `error` | same |
   | mic released | `tap` | `toggleMic` stop |
   | correct card touched / errand step done | `success` | in place of `sfx.right()` |
   | wrong card | `error` | in place of `sfx.nope()`, or keep the softer `nope` for a lesson |
   | errand complete / money handed over | `cash` | exact amount on the plate |
   | NPC first met, dialogue opens | `open` | when a vendor's dialogue card first shows |
   | buttons | `click`; reply choices and joystick `tap`; hover `hover` (90 ms debounce) | card poke `tap`, ray hover `hover` |
   | settings toggles | `switchOn` / `switchOff` | mute toggle |
   | panel closed | `close` | |
   | location card slides in | `chime()` (and SADAK's `open` for the NPC card) | the title card at the reveal, and each spot's arrival card |

   Coin clinks (`sfx.clink`), the bite crunch and the reveal swell have no
   SADAK counterpart, so keep the existing synth for those.
5. **Mute.** Where `m` toggles `sfx.muted`, also set `sadakAudio.muted`. If
   there is a settings panel: `sadakAudio.music.enabled` and
   `sadakAudio.sfx.enabled`.

## What is faithful

- **Music:** `theory.ts` and `instruments.ts` are verbatim (Karplus-Strong
  plucks, held voices with formants, vibrato, meend and gamaka, tabla bols,
  claps, kick, sub, tanpura, generated hall reverb). `delhi.ts` is SADAK's
  `qawwali` composition note for note: Sa = MIDI 49, Kafi, keherwa 8×2,
  116 bpm, harmonium, sarangi, sub, tabla with tihai fill, claps, kick,
  tanpura, and the same form (intro 2, a 6, b 4, break 2, a 4, b 4, looping
  from the second section). `music.ts` has SADAK's scheduler verbatim
  (0.8 s look-ahead every 100 ms, catch-up after a stall, seeded variation,
  humanising, accent on sam), the same compressor (-18 dB, 3:1), master 0.27,
  and the same duck (`setTargetAtTime` 0 with τ 0.35 s, 1 with τ 1.4 s).
- **SFX:** the same ten clips, the same name-to-clip map, volume 0.35, hover
  0.18 with a 90 ms debounce, `partial` as the `open` pop at 0.22.
- **Chime:** verbatim (santoor on Sa, the third, the fifth and upper Sa, 85 ms
  apart; manjira at 0.3 s; level 0.15; on the SFX bus).
- **Ambience:** the sound design is verbatim. That covers the rumble (lowpass
  220 Hz with a +9 dB peak at 95 Hz), the three breathing formant bands of the
  crowd, the horns (car 415/523 sawtooth, one or two blasts; auto 1050/1180
  square pip-pip, 2 or 3 times; bus 233/277 bray, 0.7 s; scooter 720 Hz
  beep ×2; rickshaw 2350/3100), the honk rates (0.05/s for autos and
  scooters, 0.025/s for the rest, at least 4 s apart, 0.7/s when held up),
  the level fall-off with distance, temple bells (big bell or hand-bell run,
  8 to 17 s apart), the chant on SADAK's two recitation lines in the city's
  raga, the azaan's Hijaz takbir line from the nearest mosque at
  fajr/dhuhr/asr/maghrib/isha (IST, a 10-minute window, once per prayer
  per day, never looped), the hall reverb, levels 0.55 and 0.7 wet, and the
  0.15 duck.

## What differs, and why

- **No traffic or crowd simulation.** SADAK read real vehicle and site
  positions. Here, a fixed pool of 24 virtual vehicles (Old Delhi's mix:
  autos, rickshaws, scooters, cars, an occasional bus) with distances and
  drifting bearings stands in. `vehicles` decides how many are live. A
  vehicle that honks is replaced, half the time, by a fresh one. Speed is
  assumed (5 m/s, a crawl when `waiting`). `waiting` holds up the nearest 3
  instead of whichever vehicle is blocked.
- **Only the temple.** The gurdwara kirtan branch is dropped because there
  is no gurdwara on our street. The chant and bells are now panned too: SADAK
  panned only the bells and horns.
- **One AudioContext.** SADAK's music made its own context, and SFX had a
  module singleton. Here there is a single graph:
  `music → compressor → 0.27 → duck → root`, plus
  `SFX / chime / ambience → SFX bus → root`, and `root → destination`. `root`
  is the master mute.
- **Quest CPU.** A disabled or muted part stops its scheduler and sources
  instead of playing into a zero gain. Re-enabling the music restarts it from
  its intro. SADAK only ramped the gain. The ambience does its work at
  SADAK's 10 Hz, however often `update` is called. The per-frame path
  allocates nothing. Audio nodes are created only when a horn, bell, chant
  line or azaan actually sounds (a few times a minute), which Web Audio's
  one-shot sources require. One noise buffer is shared by every bed (SADAK
  made one per bed). SFX clips are decoded once at unlock rather than on
  first play.
- **Names:** `toggleOn`/`toggleOff` are `switchOn`/`switchOff`.
- **No localStorage prefs.** The director owns the toggles.

## Cost (approximate)

Steady state with music and ambience: the held harmonium and sarangi (about
10 nodes each, always on), sub notes, tabla strokes (3 to 6 oscillators per
stroke, short-lived), tanpura plucks (buffer sources), two convolvers (music
hall 1.8 s, street hall 1.8 s), four looping noise sources, and about 12
filters and gains for the beds. This has not been profiled on a Quest yet.
When muted, only the idle graph remains.

## Files

- `src/sadak-audio/index.ts`: `SadakAudio`, `sadakAudio` (the API above).
- `src/sadak-audio/music.ts`: `MusicEngine` (SADAK `music/engine.ts`).
- `src/sadak-audio/delhi.ts`: the Delhi composition (SADAK `music/cities.ts`).
- `src/sadak-audio/instruments.ts`, `theory.ts`: verbatim SADAK synthesis and notation.
- `src/sadak-audio/chime.ts`: the location chime (SADAK `music/chime.ts`).
- `src/sadak-audio/sfx.ts`, `assets/*.ts`: SFX bank and the CC0 Kenney clips (SADAK `sfx.ts`, `engine.ts`, `assets/`).
- `src/sadak-audio/ambience.ts`: the street (SADAK `ambience.ts`).
- Dev only: `tools/audio/preview.html` and `preview.ts` (a button for
  everything, `Nearby` sliders, an offline render), `tools/audio/vite.config.ts`
  (plain Vite on port 8097, cache in `.tmp/vite-audio`), and
  `tools/audio/check.mjs` (a headless check).

## Testing

```sh
npx vite --config tools/audio/vite.config.ts      # http://127.0.0.1:8097/tools/audio/preview.html
node tools/audio/check.mjs                         # needs the server above; exits 1 on any console error or bad levels
```

`check.mjs` presses every button and lets the street play. It then measures
live RMS at the master for music, music ducked, ambience, ambience ducked,
both, and muted. Finally it renders 20 s of the music and 3 s of the chime in
an `OfflineAudioContext`. Results on 17 Nov 2026 (headless Chromium, 44.1 kHz,
no console errors):

| Render | RMS | Peak | Samples > 1.0 | Silent seconds |
| --- | --- | --- | --- | --- |
| music, 20 s, seed 1 | 0.0606 (-24.4 dBFS) | 0.327 | 0 | 0 |
| music, 20 s, seed 7 | 0.0583 (-24.7 dBFS) | 0.400 | 0 | 0 |
| chime, 3 s | 0.0140 | 0.158 | 0 | 0 |

The music's RMS per second is about 0.035 to 0.055 during the 8.3 s intro
(harmonium and tanpura only), then about 0.06 to 0.07 once the tabla, claps
and kick enter.

Live RMS: music 0.0475, music ducked 0.0004, ambience 0.0408, ambience ducked
0.0039, both 0.0768, muted 0.

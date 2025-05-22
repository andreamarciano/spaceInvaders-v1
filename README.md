# Space Invaders React + Canvas

## Why

I’m sharing this project because, while there are many tutorials showing how to build Space Invaders with plain JavaScript and HTML, I couldn’t find any recent tutorials implementing the game with modern React patterns. For example, in some videos I saw people asking for help trying to remake the game in React — I even searched for such tutorials myself.
Since I managed to build a version using React’s hooks and a structure I find acceptable, I decided to share it back with the community.
I want to stress that I’m not an expert in JavaScript, React, or frontend development — I’m just sharing my personal work, hoping it might help someone.

## Project Overview

This small game is a version of Space Invaders made using React and the Canvas API (along with JavaScript, HTML, CSS, and Tailwind).

The project started as part of my learning journey with React and frontend development in general. The idea was to hide little games inside a fictional shop.

Along the way, I discovered a video tutorial by Chris Courses (https://youtu.be/MCVU0w73uKI?si=mPR8_lmein4EcWMw), which covered how to build a Space Invaders-style game using just plain JavaScript and canvas. The video only covers a basic version of the game, which I used as a reference. All the rest is just personal experimentation and creative additions — the game grew naturally as I tried new things.
Instead of using pure JavaScript, I converted everything into React, mostly using useRef and useEffect. I used useState only where actual UI updates were needed.

Initially, everything was written in a single file, which eventually grew to over 3000 lines. That pushed me to break the code into separate files and learn how to properly structure and share logic across them. The result is a feature-based organization with folders like player/, invaders/, boss/, ui/, powerup/, and so on. I’ve added large section comments to make the code easier to follow, and it’s still evolving as I continue to refactor and improve it—even after the video release.

## Player

- Can move horizontally and shoot projectiles
- Projectiles hit enemies or boss weak points
- Can be hit by enemy projectiles, lasers, or falling objects
- Customizable ship and projectile colors
- After defeating the boss, a power-up bubble appears. Picking it up upgrades the ship with improved stats and a new look.
- Lives: the player starts with 5 lives. Lives are displayed as a ship icon followed by "x" and a numeral sprite. The icon updates based on the selected color and the current ship stage (before/after upgrade).

## 👾 Invaders

- Spawn in grids with random size (columns × rows)
- Move together horizontally and descend after hitting edges
- Shoot projectiles at random intervals
- Destroyed on hit; triggers explosion particles and sound
- Each grid has increasing speed based on its size
- If any invader reaches the bottom of the screen, the player loses the game

## Meteor

- Spawn after reaching a score threshold
- Spawns every 3s
- 3 types: large → medium → small, each hit downgrades the size
- Each type has different stats and impact sound

## Follower Enemy

- Spawns after reaching a score threshold
- Spawns every 6s if under the limit, max 2 on screen
- Follows the player, then stops to charge and fire a laser
- 3-phase cycle: follow → charge → shoot
- Has visible health bar (5 HP)
- Phase 2 upgrade: after defeating the boss, it gains a visual update, larger laser, faster movement, and new animation

## Boss

- Appears after a certain score threshold
- Phase 1: only projectiles, with random spawn frequency
- Projectiles: 3 types, each with different shapes and speed
- Phase 2: only laser beams with charging/shooting phases
- Beams: 3 types, each with different shapes, particles and sounds
- Phase 3: fires both lasers and projectiles, with lower projectile frequency
- Blue weak points: infinite, reposition every 5s, replaced when destroyed
- Red weak points: limited, stay until hit, replaced on destroy, higher damage
- Between phase 1 and phase 2, the boss moves up off-screen, changes sprite (from closed to open eyes), then descends back into the canvas (The boss sprite was hand-drawn in GIMP based on an image generated with Sora; the original .xcf file is included in the project).
- Oscillatory movement with periodic switching between clockwise and counterclockwise rotation.

## Power Ups

- **Shield**: unlocks after reaching a certain score threshold; spawns every 15 seconds as a falling bubble the player must collect; provides 5 seconds of invulnerability from all damage sources; flashes when about to expire.
- **Ship Upgrade**: spawns after defeating the boss; grants a new player ship sprite and improved stats; appears as a glowing, animated bubble that falls but stops at player height to ensure pickup.

## 🏆 Score

- Display: uses numeral sprites, increases smoothly with easing animation
- Effects: grows every 1K and 10K
- End screen: Final score appears in the main menu after the game ends.
- High scores: Top 3 scores are saved locally (local storage) and shown at startup.
- Bonus message: A custom congratulatory message appears if you reach 10K.

## Particles, Effects, Animation

- Particle explosions for enemy/boss hits and player death
- Flash animation when the player is hit or the shield is running out
- Particle effects for enemies lasers
- "Evolution" animation when picking up the ship upgrade.
- Background star particles with varying opacity and radius; speed changes during boss entry (faster), and post-boss phase 2 (slightly accelerated).
- Retreat animation for enemies and player exit/return synchronized with boss entrance.

## 🔊 Sound

- SFX: Almost every action has an associated sound — shooting, hits, explosions, laser charge and fire, invader grid spawn, game over, etc.
- Background music: At the start of each game, one of several background tracks is randomly selected. After defeating the boss and entering phase 2, the background track switches to a different set. The boss also has its own unique randomly chosen tracks.
  All these background tracks were originally generated with Suno AI, but since I can’t upload them to YouTube due to licensing, I replaced each type with a similar copyright-free track for the video (intro, boss, and phase 2).

## Assets

- All images and sounds used are listed in the file `credits.md`, where I also credit the original authors and sources. They are all CC0 or similarly licensed-free to use without restrictions.
- The Suno AI-generated music tracks have been removed from the project repository to avoid copyright issues.
- Image and sound paths are stored in `asset/imgURL.js` and `asset/soundURL.js`.

## UI

- Audio controls: individual volume sliders for SFX, SFX (shooting only), and background music; plus a global mute toggle.
- Controls help: popup menu showing gameplay controls.
- Quit button: An optional button to exit the game, useful when the game is embedded above another component.

## Extra

- Debug Hitbox: uncomment a line to show some hitboxes for player, enemies, and projectiles.

## ⚠️ Known Issues / Limitations

1. Grid Width Adjustment:
   The tutorial mentions (point 7a) the need to recalculate the invader grid width-height when invaders get removed. I attempted to handle this but encountered many issues, so I left it unimplemented.

2. Music Management:
   The individual volume sliders for background music and sound effects work well. However, the global mute toggle, which stops and restarts music, is unstable. Rapid toggling or switching tracks quickly can cause the music to bug out—either not restarting or continuing to play after the game is closed. Under normal use, it works fine, so I have not fixed this yet.

3. Background Music Loading:
   Background tracks are about 3 minutes long and loaded lazily. Sometimes the music does not start on the first game load because the browser is still loading the files. Refreshing the page solves this, and afterward the music plays smoothly.

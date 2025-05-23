export function updateFollower({
  followerConfig,
  followersRef,
  canvas,
  playerX,
  playerWidth,
  bossDefeatedRef,
  soundURL,
  playSound,
}) {
  followersRef.current.forEach((follower) => {
    const { stats: fs, beam: fb } = followerConfig;

    const chargeStart = bossDefeatedRef.current
      ? fb.shootInterval2
      : fb.shootInterval;
    const beamStart = chargeStart + fb.chargeDuration;
    const beamDuration = bossDefeatedRef.current ? fb.duration2 : fb.duration;
    const beamEnd = beamStart + beamDuration;

    // === BOSS-RETREAT ===
    if (follower.retreating) {
      follower.y -= 1.2;
      if (follower.retreatDirection === "left") {
        follower.x -= 1;
      } else {
        follower.x += 1;
      }

      // Retreat
      if (
        follower.y + follower.height < 0 ||
        follower.x + follower.width < 0 ||
        follower.x > canvas.width
      ) {
        const index = followersRef.current.indexOf(follower);
        if (index !== -1) followersRef.current.splice(index, 1);
      }

      return;
    }

    // === MOVEMENT ===
    const targetX = playerX + playerWidth / 2 - follower.width / 2;
    const followerSpeed = bossDefeatedRef.current ? fs.speed2 : fs.speed;

    // Follow Player
    if (!follower.isCharging && !follower.isShooting) {
      if (follower.x < targetX) {
        follower.x = Math.min(follower.x + followerSpeed, targetX);
      } else if (follower.x > targetX) {
        follower.x = Math.max(follower.x - followerSpeed, targetX);
      }
    }

    // === BEAM SEQUENCE ===
    follower.shootTimer++;

    // Charge Start
    if (follower.shootTimer === chargeStart) {
      follower.isCharging = true;

      playSound(soundURL.beamCharge, 0.4);
    }

    // Beam Start
    if (follower.shootTimer === beamStart) {
      follower.isCharging = false;
      follower.isShooting = true;

      playSound(soundURL.beamActive, 0.2);
    }

    // Beam End
    if (follower.shootTimer === beamEnd) {
      follower.isShooting = false;
      follower.shootTimer = 0;
      follower.hasHitPlayer = false;
    }
  });
}

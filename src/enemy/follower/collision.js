export function collisionPlayerHitFollower(
  projectilesRef,
  followersRef,
  followerConfig,
  soundURL,
  hitEnemy,
  destroyEnemy
) {
  projectilesRef.current.forEach((p, pIndex) => {
    followersRef.current.forEach((follower, fIndex) => {
      const { hitParticles: fh, stats: fs } = followerConfig;

      const hit =
        p.x < follower.x + follower.width &&
        p.x + p.width > follower.x &&
        p.y < follower.y + follower.height &&
        p.y + p.height > follower.y;

      // === HIT: FOLLOWER ===
      if (hit) {
        follower.lives -= 1;

        const centerX = follower.x + follower.width / 2;
        const centerY = follower.y + follower.height / 2;

        if (follower.lives > 0) {
          hitEnemy({
            x: centerX,
            y: centerY,
            particles: fh,
            sound: soundURL.hitFollower,
            volume: 0.6,
          });
        } else {
          destroyEnemy({
            x: centerX,
            y: centerY,
            particles: fh,
            sound: soundURL.destroyFollower,
            volume: 0.6,
            score: fs.score,
          });

          followersRef.current.splice(fIndex, 1);
        }

        projectilesRef.current.splice(pIndex, 1);
      }
    });
  });
}

export function collisionFollowerHitPlayer(
  canvas,
  followersRef,
  followerConfig,
  isGameEndingRef,
  isPlayerInvincible,
  isShieldActiveRef,
  handleShieldBlock,
  handlePlayerHit,
  livesRef,
  setLives,
  handleGameOver,
  playerWidth,
  getPlayerHitbox,
  getFollowerBeamHitbox,
  bossDefeatedRef
) {
  followersRef.current.forEach((follower) => {
    if (isGameEndingRef.current || isPlayerInvincible.current) return;
    if (!follower.isShooting) return;

    const fb = followerConfig.beam;

    const beamHitbox = getFollowerBeamHitbox({
      follower,
      followerConfig,
      bossDefeatedRef,
      canvas,
    });

    const playerHitbox = getPlayerHitbox(playerWidth);

    const hit =
      beamHitbox.x < playerHitbox.x + playerHitbox.width &&
      beamHitbox.x + beamHitbox.width > playerHitbox.x &&
      beamHitbox.y < playerHitbox.y + playerHitbox.height &&
      beamHitbox.y + beamHitbox.height > playerHitbox.y;

    if (hit && !follower.hasHitPlayer) {
      follower.hasHitPlayer = true; // avoid multiple hits in the same beam

      if (isShieldActiveRef.current) {
        handleShieldBlock(
          playerHitbox.x + playerHitbox.width / 2,
          playerHitbox.y + playerHitbox.height / 2 - 50
        );
      } else {
        handlePlayerHit(playerWidth);
        const damage = bossDefeatedRef.current ? fb.damage2 : fb.damage;
        const newLives = Math.max(0, livesRef.current - damage);
        setLives(newLives);

        if (newLives <= 0) {
          handleGameOver();
        }
      }

      // allow new hits in the next beam
      if (!follower.isShooting) {
        follower.hasHitPlayer = false;
      }
    }
  });
}

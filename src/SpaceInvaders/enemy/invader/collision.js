export function collisionPlayerHitInvader(
  projectilesRef,
  invaderGridsRef,
  invaderConfig,
  destroyEnemy,
  soundURL,
  addScore,
  playSound
) {
  projectilesRef.current.forEach((p, pIndex) => {
    invaderGridsRef.current.forEach((grid) => {
      const { stats: inv, hitParticles: pa } = invaderConfig;

      for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
          if (grid.invaders[row][col]) {
            const invaderX = grid.x + col * inv.width;
            const invaderY = grid.y + row * inv.height;

            const hit =
              p.x < invaderX + inv.width &&
              p.x + p.width > invaderX &&
              p.y < invaderY + inv.height &&
              p.y + p.height > invaderY;

            // === REMOVE INVADER ===
            if (hit) {
              grid.invaders[row][col] = false;

              destroyEnemy({
                x: invaderX + inv.width / 2,
                y: invaderY + inv.height / 2,
                particles: pa,
                sound: soundURL.destroyInvader,
                volume: 0.5,
                score: inv.single,
              });

              projectilesRef.current.splice(pIndex, 1);
            }
          }
        }
      }
    });
  });

  // === REMOVE EMPTY GRID ===
  invaderGridsRef.current = invaderGridsRef.current.filter((grid) => {
    const stillHasInvaders = grid.invaders.some((row) =>
      row.some((inv) => inv)
    );
    if (!stillHasInvaders) {
      playSound(soundURL.destroyGrid, 0.5);

      addScore(invaderConfig.stats.grid);
    }
    return stillHasInvaders;
  });
}

export function collisionInvaderHitPlayer({
  invaderProjectilesRef,
  invaderConfig,
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
}) {
  invaderProjectilesRef.current.forEach((p, index) => {
    if (isGameEndingRef.current || isPlayerInvincible.current) return;

    const pr = invaderConfig.projectile;

    const hitbox = getPlayerHitbox(playerWidth);
    const hit =
      p.x < hitbox.x + hitbox.width &&
      p.x + p.width > hitbox.x &&
      p.y < hitbox.y + hitbox.height &&
      p.y + p.height > hitbox.y;

    if (hit) {
      // === INVADER PROJECTILE → SHIELD ===
      if (isShieldActiveRef.current) {
        invaderProjectilesRef.current.splice(index, 1);

        handleShieldBlock(p.x, p.y);

        return;
      }

      handlePlayerHit(playerWidth);
      const newLives = Math.max(0, livesRef.current - pr.damage);
      setLives(newLives);

      invaderProjectilesRef.current.splice(index, 1);

      // === PLAYER LOSE ===
      if (newLives <= 0) {
        handleGameOver();
      }
    }
  });
}

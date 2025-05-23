export function collisionPlayerHitMeteor(
  projectilesRef,
  meteorsRef,
  meteorConfig,
  meteorImages,
  hitEnemy,
  destroyEnemy,
  addScore,
  soundURL
) {
  projectilesRef.current.forEach((p, pIndex) => {
    meteorsRef.current.forEach((m, mIndex) => {
      const hit =
        p.x > m.x && p.x < m.x + m.width && p.y > m.y && p.y < m.y + m.height;

      // === HIT: METEOR ===
      if (hit) {
        m.lives -= 1;
        projectilesRef.current.splice(pIndex, 1);

        const centerX = m.x + m.width / 2;
        const centerY = m.y + m.height / 2;

        if (m.lives <= 0) {
          // DESTROY METEOR - Small
          destroyEnemy({
            x: centerX,
            y: centerY,
            particles: meteorConfig.hitParticles[m.type],
            sound: soundURL.destroyMeteor2,
            volume: 0.4,
            score: meteorConfig.score.small,
          });

          meteorsRef.current.splice(mIndex, 1);
        } else {
          // HIT METEOR - Downgrade Type
          const currentType = m.type;

          if (m.lives === 2) {
            addScore(meteorConfig.score.big);
            m.type = "med";
          } else if (m.lives === 1) {
            addScore(meteorConfig.score.med);
            m.type = "small";
          }

          m.width = meteorConfig.size[m.type];
          m.height = meteorConfig.size[m.type];
          m.image = meteorImages[m.type];
          m.speed = meteorConfig.speed[m.type];

          hitEnemy({
            x: centerX,
            y: centerY,
            particles: meteorConfig.hitParticles[currentType],
            sound: soundURL.destroyMeteor,
            volume: 0.4,
          });
        }
      }
    });
  });
}

export function collisionMeteorHitPlayer(
  meteorsRef,
  isGameEndingRef,
  isPlayerInvincible,
  isShieldActiveRef,
  handleShieldBlock,
  handlePlayerHit,
  livesRef,
  setLives,
  handleGameOver,
  getPlayerHitbox,
  playerWidth
) {
  meteorsRef.current.forEach((m, index) => {
    if (isGameEndingRef.current || isPlayerInvincible.current) return;

    const hitbox = getPlayerHitbox(playerWidth);
    const hit =
      m.x < hitbox.x + hitbox.width &&
      m.x + m.width > hitbox.x &&
      m.y < hitbox.y + hitbox.height &&
      m.y + m.height > hitbox.y;

    if (hit) {
      // === COLLISION DETECTION: METEOR → SHIELD ===
      if (isShieldActiveRef.current) {
        meteorsRef.current.splice(index, 1);

        handleShieldBlock(m.x + m.width / 2, m.y + m.height / 2);

        return;
      }

      handlePlayerHit(playerWidth);
      const damage = m.type === "big" ? 2 : 1;
      const newLives = Math.max(0, livesRef.current - damage);
      setLives(newLives);

      meteorsRef.current.splice(index, 1);

      // === LOSE CONDITION ===
      if (newLives <= 0) {
        handleGameOver();
      }
    }
  });
}

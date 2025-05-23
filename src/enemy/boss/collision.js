import { getBossBeamHitbox } from "./beam/beam";

export function collisionBossProjHitPlayer({
  bossProjectilesRefs,
  getPlayerHitbox,
  playerWidth,
  isPlayerInvincible,
  isGameEnding,
  isShieldActive,
  handleShieldBlock,
  handlePlayerHit,
  livesRef,
  setLives,
  handleGameOver,
}) {
  bossProjectilesRefs.forEach((ref) => {
    ref.current.forEach((p, index) => {
      if (isGameEnding.current || isPlayerInvincible.current) return;

      const hitbox = getPlayerHitbox(playerWidth);
      const hit =
        p.x < hitbox.x + hitbox.width &&
        p.x + p.width > hitbox.x &&
        p.y < hitbox.y + hitbox.height &&
        p.y + p.height > hitbox.y;

      if (hit) {
        ref.current.splice(index, 1);

        if (isShieldActive.current) {
          handleShieldBlock(p.x, p.y);
          return;
        }

        handlePlayerHit(playerWidth);

        const newLives = Math.max(0, livesRef.current - (p.damage || 1));
        setLives(newLives);

        if (newLives <= 0) handleGameOver();
      }
    });
  });
}

export function collisionBossBeamHitPlayer({
  boss,
  bossRef,
  bossBeamsRef,
  bossBeamConfig,
  isPhase2EnabledRef,
  isGameEndingRef,
  isPlayerInvincible,
  isShieldActiveRef,
  getPlayerHitbox,
  playerWidth,
  playerXRef,
  playerYRef,
  handleShieldBlock,
  handlePlayerHit,
  livesRef,
  setLives,
  handleGameOver,
  canvas,
  drawX,
  drawY,
}) {
  if (boss && isPhase2EnabledRef.current) {
    bossBeamsRef.current.forEach((beam) => {
      if (
        !beam.isShooting ||
        isGameEndingRef.current ||
        isPlayerInvincible.current
      )
        return;

      const beamHitbox = getBossBeamHitbox(
        beam,
        drawX,
        drawY,
        canvas,
        bossBeamConfig
      );
      const playerHitbox = getPlayerHitbox(playerWidth);

      const hit =
        beamHitbox.x < playerHitbox.x + playerHitbox.width &&
        beamHitbox.x + beamHitbox.width > playerHitbox.x &&
        beamHitbox.y < playerHitbox.y + playerHitbox.height &&
        beamHitbox.y + beamHitbox.height > playerHitbox.y;

      if (hit && !beam.hasHitPlayer) {
        beam.hasHitPlayer = true;

        if (isShieldActiveRef.current) {
          handleShieldBlock(playerXRef.current, playerYRef.current - 50);
          return;
        }

        handlePlayerHit(playerWidth);

        const beamDamage = beam.damage;
        const newLives = Math.max(0, livesRef.current - beamDamage);
        setLives(newLives);

        if (newLives <= 0) handleGameOver();
      }
    });
  }
}

export function collisionPlayerHitBoss({
  bossRef,
  projectilesRef,
  bossConfig,
  activeBlueWeakPointsRef,
  activeRedWeakPointsRef,
  allRedSpaces,
  usedRedSpacesRef,
  generateBlueWeakPoint,
  handleBossHit,
  updateBossPhase,
  isPlayerFrozenRef,
  enablePhase1,
  enablePhase2,
  enablePhase3,
  beamIntervalsRef,
  soundURL,
  playSound,
  resumeBackgroundMusic,
  damageLabelsRef,
  drawX,
  drawY,
}) {
  if (bossRef.current && !bossRef.current.entering) {
    const b = bossRef.current;

    projectilesRef.current.forEach((p, pIndex) => {
      const bossX = drawX;
      const bossY = drawY;

      // === BLUE WEAK POINTS ===
      const hitIndex = activeBlueWeakPointsRef.current.findIndex((wp) => {
        return (
          p.x < bossX + wp.x + wp.width &&
          p.x + p.width > bossX + wp.x &&
          p.y < bossY + wp.y + wp.height &&
          p.y + p.height > bossY + wp.y
        );
      });

      if (hitIndex !== -1) {
        b.lives -= bossConfig.blueWeakPoints.damage;
        handleBossHit(p.x + p.width / 2, p.y, soundURL.hitFollower);
        projectilesRef.current.splice(pIndex, 1);

        damageLabelsRef.current.push({
          x: p.x,
          y: p.y,
          text: `-${bossConfig.blueWeakPoints.damage}`,
          alpha: 1,
          lifetime: 60,
          color: "blue",
          font: "bold 16px Arial",
        });

        // replace
        const usedSpaces = activeBlueWeakPointsRef.current.map(
          (p) => p.originSpace
        );
        const remainingSpaces = bossConfig.blueWeakPoints.spaces.filter(
          (s) => !usedSpaces.includes(s)
        );
        if (remainingSpaces.length > 0) {
          const newSpace =
            remainingSpaces[Math.floor(Math.random() * remainingSpaces.length)];
          const newPoint = generateBlueWeakPoint(newSpace);
          activeBlueWeakPointsRef.current[hitIndex] = newPoint;
        }
      }

      // === RED WEAK POINTS ===
      const redHitIndex = activeRedWeakPointsRef.current.findIndex((wp) => {
        return (
          p.x < bossX + wp.x + wp.width &&
          p.x + p.width > bossX + wp.x &&
          p.y < bossY + wp.y + wp.height &&
          p.y + p.height > bossY + wp.y
        );
      });

      if (redHitIndex !== -1) {
        b.lives -= bossConfig.redWeakPoints.damage;
        handleBossHit(p.x + p.width / 2, p.y, soundURL.destroyFollower);
        projectilesRef.current.splice(pIndex, 1);

        activeRedWeakPointsRef.current.splice(redHitIndex, 1);

        damageLabelsRef.current.push({
          x: p.x,
          y: p.y,
          text: `-${bossConfig.redWeakPoints.damage}`,
          alpha: 1,
          lifetime: 60,
          color: "red",
          font: "bold 20px Arial",
        });

        if (allRedSpaces.length > 0) {
          const index = Math.floor(Math.random() * allRedSpaces.length);
          const newRedPoint = allRedSpaces[index];
          activeRedWeakPointsRef.current.push(newRedPoint);
          usedRedSpacesRef.current.push(newRedPoint);
          allRedSpaces.splice(index, 1);
        }
      }
    });

    updateBossPhase();

    // === BOSS DEFEATED CONDITION ===
    if (b.lives <= 0 && !b.retreating) {
      b.retreating = true;
      b.entering = true;
      b.entrancePhase = "retreat";
      isPlayerFrozenRef.current = true;

      enablePhase1(false);
      enablePhase2(false);
      enablePhase3(false);

      beamIntervalsRef.current.forEach(clearInterval);
      beamIntervalsRef.current = [];

      playSound(soundURL.bossDefeated);
      setTimeout(() => {
        resumeBackgroundMusic();
      }, 4000);
    }
  }
}

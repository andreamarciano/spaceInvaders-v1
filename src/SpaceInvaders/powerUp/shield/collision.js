export function collisionShieldHitPlayer(
  shieldPowerUpRef,
  isGameEndingRef,
  isPlayerInvincible,
  playerXRef,
  playerYRef,
  playerStats,
  playerWidth,
  isShieldActiveRef,
  shieldStartTimeRef,
  shieldTimerRef,
  shieldStats,
  playSound,
  soundURL
) {
  /* === ACTIVATE SHIELD === */
  const activateShield = () => {
    isShieldActiveRef.current = true;
    shieldStartTimeRef.current = performance.now();

    playSound(soundURL.shieldUp, 0.4);

    if (shieldTimerRef.current) clearTimeout(shieldTimerRef.current);
    shieldTimerRef.current = setTimeout(() => {
      isShieldActiveRef.current = false;
      playSound(soundURL.shieldDown);
    }, shieldStats.time);
  };

  shieldPowerUpRef.current.forEach((powerUp, sIndex) => {
    if (isGameEndingRef.current || isPlayerInvincible.current) return;

    const hit =
      powerUp.x < playerXRef.current + playerWidth &&
      powerUp.x + powerUp.width > playerXRef.current &&
      powerUp.y < playerYRef.current + playerStats.height &&
      powerUp.y + powerUp.height > playerYRef.current;

    if (hit) {
      shieldPowerUpRef.current.splice(sIndex, 1);

      activateShield();
    }
  });
}

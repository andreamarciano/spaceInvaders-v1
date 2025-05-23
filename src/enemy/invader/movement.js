export function updateInvaderGrids(
  invaderGridsRef,
  canvas,
  invaderConfig,
  playSound,
  soundURL
) {
  invaderGridsRef.current.forEach((grid) => {
    const inv = invaderConfig.stats;

    // === BOSS - RETREAT ===
    if (grid.retreating) {
      if (grid.x + grid.width < canvas.width) {
        grid.x += grid.speed * grid.direction * inv.retreadSpeed;
      } else {
        invaderGridsRef.current = invaderGridsRef.current.filter(
          (g) => g !== grid
        );
      }
    } else {
      grid.x += grid.speed * grid.direction;

      const hitLeft = grid.x <= 0;
      const hitRight = grid.x + grid.width >= canvas.width;

      if (hitLeft || hitRight) {
        grid.direction *= -1;
        grid.y += 30;
        playSound(soundURL.gridHitBorder, 0.3);
      }
    }
  });
}

export function checkInvaderLoseCondition(
  invaderGridsRef,
  canvas,
  handleGameOver
) {
  const hasLost = invaderGridsRef.current.some(
    (grid) => grid.y + grid.height >= canvas.height + 10
  );
  if (hasLost) handleGameOver();
}

export function spawnBoss({
  bossActiveRef,
  bossRef,
  scoreRef,
  bossConfig,
  bossStats,
  canvas,
  activeBlueWeakPointsRef,
  pickBlueWeakPoints,
  activeRedWeakPointsRef,
  pickRedWeakPoints,
  allRedSpaces,
  usedRedSpacesRef,
  isPlayerActiveRef,
  isPlayerFrozenRef,
}) {
  if (
    bossActiveRef.current &&
    !bossRef.current &&
    scoreRef.current >= bossConfig.spawn
  ) {
    bossRef.current = {
      x: canvas.width / 2 - bossStats.width / 2,
      y: -bossStats.height,
      width: bossStats.width,
      height: bossStats.height,
      lives: bossStats.lives,
      entering: true,
      entrancePhase: "descending",
      phase: 1,
      hasChangedImage: false,
      retreating: false,
      oscillation: {
        amplitudeX: bossStats.amplitudeX,
        amplitudeY: bossStats.amplitudeY,
        speed: bossStats.speed,
        t: 0,
        timer: 0,
        direction: 1,
        rotationsCount: 0,
        rotationsToSwitch: 4,
        rotationsSinceLastSwitch: 0,
      },
    };

    // Weak Points
    activeBlueWeakPointsRef.current = pickBlueWeakPoints(
      bossConfig.blueWeakPoints.spaces,
      bossConfig.blueWeakPoints.count
    );
    activeRedWeakPointsRef.current = pickRedWeakPoints(
      allRedSpaces,
      usedRedSpacesRef.current,
      bossConfig.redWeakPoints.count
    );

    isPlayerActiveRef.current = false;
    isPlayerFrozenRef.current = true;
  }
}

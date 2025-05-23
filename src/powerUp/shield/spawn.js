export function spawnShieldBubble(
  bossRef,
  bossDefeatedRef,
  scoreRef,
  shieldConfig,
  canvas,
  shieldImageRef,
  shieldPowerUpRef,
  shieldStats
) {
  return setInterval(() => {
    if (
      !bossRef.current?.entering &&
      scoreRef.current >= shieldConfig.spawn.score
    ) {
      const bubble = shieldConfig.bubble;

      const x = Math.floor(Math.random() * (canvas.width - shieldStats.width));
      const y = -bubble.height;

      shieldPowerUpRef.current.push({
        x,
        y,
        width: bubble.width,
        height: bubble.height,
        speed: bossDefeatedRef.current ? bubble.speed2 : bubble.speed,
        image: shieldImageRef.current,
      });
    }
  }, shieldConfig.spawn.time);
}

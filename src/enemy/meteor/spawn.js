export function setupMeteorSpawn(
  meteorConfig,
  meteorsRef,
  meteorImages,
  canvas,
  bossActiveRef,
  bossDefeatedRef,
  scoreRef
) {
  return setInterval(() => {
    if (
      !bossActiveRef.current &&
      scoreRef.current >= meteorConfig.spawn.score
    ) {
      const types = ["big", "med", "small"];
      const type = types[Math.floor(Math.random() * types.length)];

      const x = Math.floor(
        Math.random() * (canvas.width - meteorConfig.size[type])
      );
      const y = -meteorConfig.size[type];

      meteorsRef.current.push({
        x,
        y,
        type,
        width: meteorConfig.size[type],
        height: meteorConfig.size[type],
        speed: bossDefeatedRef.current
          ? meteorConfig.speed2[type]
          : meteorConfig.speed[type],
        lives: meteorConfig.lives[type],
        image: meteorImages[type],
        rotation: Math.random() * Math.PI,
        rotationSpeed: Math.random() * 0.02 + 0.01,
        retreating: false,
        retreatSpeed: meteorConfig.retreatSpeed[type],
      });
    }
  }, meteorConfig.spawn.time);
}

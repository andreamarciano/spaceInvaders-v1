export function setupFollowerSpawn(
  followerConfig,
  followersRef,
  canvas,
  bossActiveRef,
  scoreRef
) {
  return setInterval(() => {
    if (
      !bossActiveRef.current &&
      scoreRef.current >= followerConfig.spawn.score &&
      followersRef.current.length < 2
    ) {
      const fs = followerConfig.stats;

      const x = Math.random() * (canvas.width - fs.width);

      followersRef.current.push({
        x,
        y: 10,
        width: fs.width,
        height: fs.height,
        lives: fs.lives,
        shootTimer: 0,
        isCharging: false,
        isShooting: false,
        hasHitPlayer: false,
        particles: [],
        shootParticles: [],
        retreating: false,
        retreatDirection: Math.random() < 0.5 ? "left" : "right",
      });
    }
  }, followerConfig.spawn.time);
}

export function spawnInvaderGrid({
  invaderGridsRef,
  invaderConfig,
  playSound,
  soundURL,
  firstGrid = true,
}) {
  const inv = invaderConfig.stats;

  const cols = Math.floor(Math.random() * 10 + 5);
  const rows = Math.floor(Math.random() * 5 + 2);
  const gridWidth = cols * inv.width;
  const gridHeight = rows * inv.height;

  const x = 0;
  const y = 0;

  const sizeFactor = cols * rows;
  const minSize = 5 * 2;
  const maxSize = 15 * 7;
  const speed =
    inv.maxSpeed -
    ((sizeFactor - minSize) / (maxSize - minSize)) *
      (inv.maxSpeed - inv.minSpeed);

  invaderGridsRef.current.push({
    x,
    y,
    direction: 1,
    width: gridWidth,
    height: gridHeight,
    cols,
    rows,
    speed,
    invaders: Array.from({ length: rows }, () => Array(cols).fill(true)),
    retreating: false,
  });

  if (firstGrid) playSound(soundURL.spawnGrid, 0.6);
}

export function scheduleInvaderGrid({
  invaderGridsRef,
  invaderConfig,
  isGameRunningRef,
  bossActiveRef,
  playSound,
  soundURL,
}) {
  if (bossActiveRef.current) return;

  const ft = invaderConfig.spawn;

  const interval = Math.floor(Math.random() * (ft.max - ft.min) + ft.min);
  return setTimeout(() => {
    if (!isGameRunningRef.current || bossActiveRef.current) return;

    spawnInvaderGrid({ invaderGridsRef, invaderConfig, playSound, soundURL });
    scheduleInvaderGrid({
      invaderGridsRef,
      invaderConfig,
      isGameRunningRef,
      bossActiveRef,
      playSound,
      soundURL,
    });
  }, interval);
}

export function spawnInvaderProjectile({
  invaderGridsRef,
  invaderProjectilesRef,
  invaderConfig,
  bossActiveRef,
  bossDefeatedRef,
  soundURL,
  playLaserSound,
}) {
  return setInterval(() => {
    if (!bossActiveRef.current && !bossDefeatedRef.current) {
      const { stats: inv, projectile: pr } = invaderConfig;

      invaderGridsRef.current.forEach((grid) => {
        const aliveInvaders = [];
        for (let row = 0; row < grid.rows; row++) {
          for (let col = 0; col < grid.cols; col++) {
            if (grid.invaders[row][col]) {
              aliveInvaders.push({ row, col });
            }
          }
        }

        if (aliveInvaders.length > 0) {
          const { row, col } =
            aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
          const x = grid.x + col * inv.width + inv.width / 2 - pr.width / 2;
          const y = grid.y + row * inv.height + inv.height;

          invaderProjectilesRef.current.push({
            x,
            y,
            width: pr.width,
            height: pr.height,
            speed: pr.speed,
          });

          playLaserSound(soundURL.laserInvader);
        }
      });
    }
  }, invaderConfig.spawn.projectile);
}

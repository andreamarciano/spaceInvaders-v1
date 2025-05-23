const backgroundParticles = {
  radius: 2,
  speed: 0.3,
  speedBoss: 15,
  speed2: 1.8,
  opacity: 0.5,
  color: "white",
};

export function spawnBackgroundParticles({
  canvas,
  backgroundParticlesRef,
  bossDefeatedRef,
  isBoostingRef,
}) {
  const particles = [];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * backgroundParticles.radius,
      speedY: isBoostingRef.current
        ? backgroundParticles.speedBoss
        : bossDefeatedRef.current
        ? backgroundParticles.speed2
        : backgroundParticles.speed,
      opacity:
        backgroundParticles.opacity +
        Math.random() * backgroundParticles.opacity,
      color: backgroundParticles.color,
    });
  }

  backgroundParticlesRef.current = particles;
}

export function drawBackgroundParticles({
  c,
  canvas,
  backgroundParticlesRef,
  bossDefeatedRef,
  isBoostingRef,
}) {
  backgroundParticlesRef.current.forEach((p) => {
    // boosted
    p.speedY = isBoostingRef.current
      ? backgroundParticles.speedBoss
      : bossDefeatedRef.current
      ? backgroundParticles.speed2
      : backgroundParticles.speed;

    p.y += p.speedY;

    if (p.y - p.radius > canvas.height) {
      p.x = Math.random() * canvas.width;
      p.y = -p.radius;
    }

    c.save();
    c.globalAlpha = p.opacity;
    c.beginPath();
    c.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    c.fillStyle = p.color;
    c.fill();
    c.closePath();
    c.restore();
  });
}

export function createExplosion(
  particlesRef,
  { x, y, color, count, opacity, radiusRange = [1, 3], velocityRange = [1, 2] }
) {
  for (let i = 0; i < count; i++) {
    const radius =
      Math.random() * (radiusRange[1] - radiusRange[0]) + radiusRange[0];
    const speed =
      Math.random() * (velocityRange[1] - velocityRange[0]) + velocityRange[0];

    particlesRef.current.push({
      x,
      y,
      radius,
      color,
      velocity: {
        x: (Math.random() - 0.5) * speed,
        y: (Math.random() - 0.5) * speed,
      },
      opacity,
    });
  }
}

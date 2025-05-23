export function followerChargeParticles(
  follower,
  bossDefeatedRef,
  followerConfig
) {
  const fp = followerConfig.beamParticles.charge;

  const spawnAreaWidth = 100;
  const spawnX =
    follower.x + follower.width / 2 + (Math.random() - 0.5) * spawnAreaWidth;
  const spawnY = follower.y + follower.height + 80 + Math.random() * 40;

  const targetX = follower.x + follower.width / 2;
  const targetY = follower.y + follower.height;

  const angle = Math.atan2(targetY - spawnY, targetX - spawnX);
  const speed = 1 + Math.random() * 1;

  follower.particles.push({
    x: spawnX,
    y: spawnY,
    radius: Math.random() * 2 + 1,
    color: bossDefeatedRef.current ? fp.color2 : fp.color,
    velocity: {
      x: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.3,
      y: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.3,
    },
    target: { x: targetX, y: targetY },
    opacity: fp.opacity,
  });
}

export function getFollowerBeamHitbox({
  follower,
  followerConfig,
  bossDefeatedRef,
  canvas,
}) {
  const fb = followerConfig.beam;

  const beamWidth = bossDefeatedRef.current ? fb.width2 : fb.width;
  const beamX = follower.x + follower.width / 2 - beamWidth / 2;
  const beamY = follower.y + follower.height;
  const beamHeight = canvas.height - beamY;

  return {
    x: beamX,
    y: beamY,
    width: beamWidth,
    height: beamHeight,
  };
}

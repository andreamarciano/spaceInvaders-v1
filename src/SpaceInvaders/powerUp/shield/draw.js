export function drawShield({
  c,
  isShieldActiveRef,
  shieldImageRef,
  shieldStartTimeRef,
  shieldStats,
  playerXRef,
  playerYRef,
  playerWidth,
  playerStats,
  debugHitbox,
}) {
  if (isShieldActiveRef.current && shieldImageRef.current.complete) {
    const now = performance.now();
    const elapsed = now - shieldStartTimeRef.current;
    const remaining = shieldStats.time - elapsed;

    // flash animation
    let opacity = 1;
    if (remaining <= 2000) {
      const flashSpeed = 200;
      opacity = Math.sin((now / flashSpeed) * Math.PI) * 0.5 + 0.5;
    }

    const shieldX =
      playerXRef.current + playerWidth / 2 - shieldStats.width / 2;
    const shieldY =
      playerYRef.current + playerStats.height / 2 - shieldStats.height / 2;

    c.save();
    c.globalAlpha = opacity;
    c.drawImage(
      shieldImageRef.current,
      shieldX,
      shieldY,
      shieldStats.width,
      shieldStats.height
    );
    c.restore();

    // hitbox
    if (debugHitbox) {
      c.save();
      c.strokeStyle = "rgba(0, 255, 255, 0.7)";
      c.lineWidth = 2;
      c.strokeRect(shieldX, shieldY, shieldStats.width, shieldStats.height);
      c.restore();
    }
  }
}

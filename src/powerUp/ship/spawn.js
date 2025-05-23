export function handleShipBubbleSpawn({
  shipUpgradeRef,
  playerXRef,
  playerYRef,
  playerWidth,
  playerStats,
  playerUpgradeInProgressRef,
  playerUpgradeTimerRef,
  playSound,
  soundURL,
  c,
}) {
  const u = shipUpgradeRef.current;
  if (!u) return;

  if (u.y < u.stopY) {
    u.y += u.speed;
  }

  const bubbleCenterX = u.x + u.width / 2;
  const bubbleCenterY = u.y + u.height / 2;
  const maxRadius = Math.max(u.width, u.height) * 0.7;
  const pulse = Math.sin(performance.now() / 300) * 5;

  c.drawImage(u.image, u.x, u.y, u.width, u.height);

  c.save();
  c.beginPath();
  c.arc(bubbleCenterX, bubbleCenterY, maxRadius + pulse, 0, Math.PI * 2);
  c.strokeStyle = "rgba(0, 255, 255, 0.6)";
  c.lineWidth = 4;
  c.shadowColor = "cyan";
  c.shadowBlur = 15;
  c.stroke();
  c.restore();

  // COLLISION DETECTION: SHIP BUBBLE → PLAYER
  const hit =
    u.x < playerXRef.current + playerWidth &&
    u.x + u.width > playerXRef.current &&
    u.y < playerYRef.current + playerStats.height &&
    u.y + u.height > playerYRef.current;

  if (hit) {
    shipUpgradeRef.current = null;

    playerUpgradeInProgressRef.current = true;
    playerUpgradeTimerRef.current = performance.now();

    playSound(soundURL.shipUpgrade);
  }
}

export function drawPlayer({
  c,
  canvas,
  playerXRef,
  playerYRef,
  playerWidth,
  playerStats,
  playerImageRef,
  playerRotationRef,
  playerOpacityRef,
  isPlayerActiveRef,
  isPlayerFrozenRef,
  playerTransitionRef,
  debugHitbox,
  playerUpgradeInProgressRef,
  playerUpgradeTimerRef,
  playerPart2Ref,
  imgURL,
  playerColor,
}) {
  // Handle transitions (exit/reenter)
  if (playerTransitionRef.current === "exitScene") {
    playerYRef.current += 0.5;
    if (playerYRef.current >= canvas.height + 50) {
      playerTransitionRef.current = null;
      playerYRef.current = canvas.height + 100;
      playerRotationRef.current = 0;
    }
  } else if (playerTransitionRef.current === "reenterScene") {
    playerYRef.current -= 3;
    if (playerYRef.current <= canvas.height - playerStats.height - 10) {
      playerYRef.current = canvas.height - playerStats.height - 10;
      playerTransitionRef.current = null;
    }
  }

  c.save();

  // Flash animation & opacity on revive/freeze
  c.globalAlpha =
    isPlayerActiveRef.current || isPlayerFrozenRef.current
      ? playerOpacityRef.current
      : 0;

  // Rotation
  c.translate(
    playerXRef.current + playerWidth / 2,
    playerYRef.current + playerStats.height / 2
  );
  c.rotate(playerRotationRef.current);
  c.translate(
    -playerXRef.current - playerWidth / 2,
    -playerYRef.current - playerStats.height / 2
  );

  // Upgrade Ship Animation
  let imageToDraw = playerImageRef.current;

  if (playerUpgradeInProgressRef.current) {
    const now = performance.now();
    const elapsed = now - playerUpgradeTimerRef.current;

    const flashInterval = 200;
    const frame = Math.floor(elapsed / flashInterval) % 2;

    const tempImage = new Image();
    tempImage.src =
      frame === 0 ? imgURL[`${playerColor}`] : imgURL[`${playerColor}2`];
    imageToDraw = tempImage;

    if (elapsed >= 2000) {
      playerUpgradeInProgressRef.current = false;
      playerImageRef.current = new Image();
      playerImageRef.current.src = imgURL[`${playerColor}2`];
      playerPart2Ref.current = true;
    }
  }

  if (imageToDraw.complete) {
    c.drawImage(
      imageToDraw,
      playerXRef.current,
      playerYRef.current,
      playerWidth,
      playerStats.height
    );
  }

  // Hitbox
  if (debugHitbox) {
    c.fillStyle = "rgba(255, 0, 0, 0.2)";
    c.fillRect(
      playerXRef.current,
      playerYRef.current,
      playerWidth,
      playerStats.height
    );
  }

  c.restore();
}

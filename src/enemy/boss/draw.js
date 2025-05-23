export function handleBossEntranceAndDraw({
  bossRef,
  bossImageRef,
  bossImage2Ref,
  bossBeamsRef,
  bossActiveRef,
  bossDefeatedRef,
  bossMusicPlayedRef,
  activeBlueWeakPointsRef,
  activeRedWeakPointsRef,
  shipUpgradeRef,
  playerXRef,
  playerYRef,
  playerWidth,
  playerColor,
  isPlayerActiveRef,
  isPlayerFrozenRef,
  isPlayerInvincible,
  playerTransitionRef,
  isBoostingRef,
  addScore,
  playSound,
  playBossMusic,
  soundURL,
  imgURL,
  shipBubbleConfig,
  bossStats,
  c,
  canvas,
}) {
  const b = bossRef.current;
  if (!b) return { drawX: 0, drawY: 0 };

  // === ANIMATION: ENTERING ===
  if (b.entering) {
    isBoostingRef.current = true;

    if (b.phase === 1) {
      isPlayerInvincible.current = true;

      // play boss entrance music
      if (!bossMusicPlayedRef.current) {
        bossMusicPlayedRef.current = true;
        playBossMusic();
      }

      // DESCENDING → RISING
      if (b.entrancePhase === "descending") {
        playerTransitionRef.current = "exitScene";
        b.y += bossStats.descendingSpeed;

        if (b.y >= 0) {
          b.entrancePhase = "rising";
          playSound(soundURL.bossDescending, 0.5);
        }
      } else if (b.entrancePhase === "rising") {
        playerTransitionRef.current = "reenterScene";
        isBoostingRef.current = false;
        b.y -= bossStats.risingSpeed;

        if (b.y <= -40) {
          b.y = -40;
          b.entering = false;
          b.entrancePhase = null;

          isPlayerActiveRef.current = true;
          isPlayerInvincible.current = false;
          isPlayerFrozenRef.current = false;
        }
      }
    } else if (b.phase === 2) {
      // RISING → IMAGE SWAP → DESCENDING
      if (b.entrancePhase === "rising") {
        b.y -= bossStats.risingSpeed2;

        if (b.y <= -b.height) {
          b.y = -b.height;
          playSound(soundURL.bossDescending2, 0.5);

          if (!b.hasChangedImage) {
            bossImageRef.current = bossImage2Ref.current;
            b.hasChangedImage = true;
          }

          b.entrancePhase = "descending";
        }
      } else if (b.entrancePhase === "descending") {
        isBoostingRef.current = false;
        b.y += bossStats.descendingSpeed2;

        if (b.y >= -40) {
          b.y = -40;
          b.entering = false;
          b.entrancePhase = null;

          isPlayerActiveRef.current = true;
          isPlayerInvincible.current = false;
          isPlayerFrozenRef.current = false;
        }
      }
    } else if (b.entrancePhase === "retreat") {
      // === BOSS DEFEATED ===
      b.y -= bossStats.risingSpeed3;

      isPlayerInvincible.current = true;

      if (b.y + b.height < 0) {
        bossRef.current = null;
        bossActiveRef.current = false;
        bossDefeatedRef.current = true;
        isBoostingRef.current = false;

        isPlayerActiveRef.current = true;
        isPlayerFrozenRef.current = false;
        isPlayerInvincible.current = false;
        playerTransitionRef.current = null;

        bossBeamsRef.current = [];
        bossMusicPlayedRef.current = false;

        addScore(bossStats.score);

        // === DRAW: SHIP BUBBLE ===
        const upgradeX = playerXRef.current + playerWidth / 2 - 20;
        const upgradeY = -60;
        const upgradeImage = new Image();
        upgradeImage.src = imgURL[`${playerColor}2`];
        shipUpgradeRef.current = {
          x: upgradeX,
          y: upgradeY,
          width: shipBubbleConfig.width,
          height: shipBubbleConfig.height,
          speed: shipBubbleConfig.speed,
          stopY: playerYRef.current - 10,
          image: upgradeImage,
        };
      }
    }
  }

  // === ANIMATION: BOSS MOVEMENT ===
  let drawX = b.x;
  let drawY = b.y;

  if (!b.entering && b.oscillation) {
    const osc = b.oscillation;
    osc.timer += 1; // total rotation
    osc.t += osc.direction; // current direction

    const offsetX = Math.sin(osc.t * osc.speed) * osc.amplitudeX;
    const offsetY = Math.cos(osc.t * osc.speed) * osc.amplitudeY;

    drawX += offsetX;
    drawY += offsetY;

    const totalRotations = Math.floor((osc.timer * osc.speed) / (2 * Math.PI));

    if (totalRotations > osc.rotationsCount) {
      osc.rotationsCount = totalRotations;
      osc.rotationsSinceLastSwitch += 1;

      // const remaining = osc.rotationsToSwitch - osc.rotationsSinceLastSwitch;

      // console.log(`Full rotations: ${osc.rotationsCount}`);
      // console.log(`Missing rotations: ${remaining}`);
      // console.log(
      //   `Current direction: ${
      //     osc.direction === 1 ? "counterclockwise" : "clockwise"
      //   }`
      // );

      if (osc.rotationsSinceLastSwitch >= osc.rotationsToSwitch) {
        osc.direction *= -1;
        osc.rotationsSinceLastSwitch = 0;
        // console.log(
        //   "Change direction: " +
        //     (osc.direction === 1 ? "counterclockwise" : "clockwise")
        // );
      }
    }
  }

  // === DRAW: BOSS IMAGE ===
  if (bossImageRef.current.complete) {
    c.drawImage(bossImageRef.current, drawX, drawY, b.width, b.height);
  } else {
    c.fillStyle = "red";
    c.fillRect(drawX, drawY, b.width, b.height);
  }

  // === DRAW: WEAK POINTS ===
  if (!b.entering) {
    const bossX = drawX;
    const bossY = drawY;

    // === DRAW: BLUE WEAK POINTS ===
    activeBlueWeakPointsRef.current.forEach((wp) => {
      c.fillStyle = "rgba(0, 0, 255, 0.4)";
      c.fillRect(bossX + wp.x, bossY + wp.y, wp.width, wp.height);
    });

    // === DRAW: RED WEAK POINTS ===
    const pulse = Math.sin((performance.now() / 1000) * Math.PI);
    const scale = 1 + pulse * 0.01;
    const opacity = 0.5 + pulse * 0.1;

    activeRedWeakPointsRef.current.forEach((wp) => {
      const drawWidth = wp.width * scale;
      const drawHeight = wp.height * scale;
      const offsetX = (drawWidth - wp.width) / 2;
      const offsetY = (drawHeight - wp.height) / 2;

      c.fillStyle = `rgba(255, 0, 0, ${opacity.toFixed(2)})`;
      c.fillRect(
        bossX + wp.x - offsetX,
        bossY + wp.y - offsetY,
        drawWidth,
        drawHeight
      );
    });

    // === DRAW: LIFE BAR ===
    const lifeRatio = Math.max(b.lives / 1000, 0);
    const barHeight = 7;
    const barWidth = canvas.width / 2;
    const x = (canvas.width - barWidth) / 2;
    const y = 1;

    c.fillStyle = "rgba(0, 0, 0, 0.2)";
    c.fillRect(x, y, barWidth, barHeight);

    c.fillStyle =
      b.lives > 700
        ? "rgba(34, 211, 238, 0.4)"
        : b.lives > 400
        ? "rgba(250, 204, 21, 0.6)"
        : "rgba(239, 68, 68, 0.8)";

    c.fillRect(x, y, barWidth * lifeRatio, barHeight);

    c.strokeStyle = "rgba(255, 255, 255, 0.4)";
    c.lineWidth = 2;
    c.strokeRect(x, y, barWidth, barHeight);
  }

  return { drawX, drawY };
}

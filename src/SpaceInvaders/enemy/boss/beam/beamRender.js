export function renderSmallLaser(c, beam, hitbox, now, debugHitbox) {
  const baseX = hitbox.x;
  const baseY = hitbox.y;
  const width = hitbox.width;
  const height = hitbox.height;

  const time = performance.now() / 200;
  const oscillationAmplitude = width * 0.1;

  const pointsLeft = [
    { x: 5, y: 20 },
    { x: 4, y: 18 },
    { x: 5, y: 17 },
    { x: 4, y: 15 },
    { x: 5, y: 14 },
    { x: 3.5, y: 11 },
    { x: 4, y: 10 },
    { x: 3.6, y: 9 },
    { x: 3.8, y: 8 },
    { x: 3.6, y: 7 },
    { x: 3.8, y: 6 },
    { x: 3, y: 5 },
    { x: 5, y: 3 },
    { x: 4, y: 2 },
    { x: 4.5, y: 1.5 },
    { x: 4, y: 0.5 },
    { x: 4, y: -0.5 },
  ];

  const pointsRight = [
    { x: 6, y: 20 },
    { x: 5, y: 18 },
    { x: 6, y: 17 },
    { x: 5, y: 15 },
    { x: 6, y: 14 },
    { x: 4.5, y: 11 },
    { x: 5, y: 10 },
    { x: 4.6, y: 9 },
    { x: 5, y: 8 },
    { x: 4.8, y: 7 },
    { x: 5, y: 6 },
    { x: 4, y: 5 },
    { x: 6, y: 3 },
    { x: 5, y: 2 },
    { x: 5.5, y: 1.5 },
    { x: 5, y: 0.5 },
    { x: 5, y: -0.5 },
  ];

  function transformPoint(p, sideFactor = 1) {
    const oscillationX =
      oscillationAmplitude * Math.sin(time + p.y * 0.5) * sideFactor;

    return {
      x: baseX + (p.x - 4.5) * width + oscillationX,
      y: baseY + height - p.y * (height / 20),
    };
  }

  c.save();
  c.beginPath();

  let p = transformPoint(pointsLeft[0], -1);
  c.moveTo(p.x, p.y);

  for (let i = 1; i < pointsLeft.length; i++) {
    p = transformPoint(pointsLeft[i], -1);
    c.lineTo(p.x, p.y);
  }

  for (let i = pointsRight.length - 1; i >= 0; i--) {
    p = transformPoint(pointsRight[i], 1);
    c.lineTo(p.x, p.y);
  }

  c.closePath();

  c.fillStyle = beam.color;
  c.globalAlpha = 0.8;
  c.fill();

  // Sparkles
  if (!beam.sparkles) {
    beam.sparkles = Array.from({ length: 20 }).map(() => ({
      xOffset: (Math.random() - 0.5) * 20,
      y: Math.random() * height,
      speed: 0.3 + Math.random() * 0.5,
      life: 1000 + Math.random() * 1000,
      startTime: performance.now() - Math.random() * 1000,
      length: 6 + Math.random() * 6,
    }));
  }
  const centerX = baseX + width / 2;
  beam.sparkles.forEach((sparkle) => {
    const elapsed = now - sparkle.startTime;
    if (elapsed > sparkle.life) {
      sparkle.y = Math.random() * height;
      sparkle.startTime = now;
    } else {
      sparkle.y -= sparkle.speed;
      if (sparkle.y > height) sparkle.y = 0;

      const flashFrequency = 2;
      const alpha =
        0.4 +
        0.6 *
          Math.abs(
            Math.sin((elapsed / sparkle.life) * flashFrequency * Math.PI * 2)
          );

      c.strokeStyle = `rgba(30, 120, 200, ${alpha.toFixed(2)})`;
      c.lineWidth = 1;

      const direction = sparkle.xOffset > 0 ? 1 : -1;

      c.beginPath();
      c.moveTo(centerX + sparkle.xOffset, baseY + height - sparkle.y);
      c.lineTo(
        centerX + sparkle.xOffset + direction * 2,
        baseY + height - sparkle.y - sparkle.length
      );
      c.stroke();
    }
  });

  c.restore();

  // hitbox
  if (debugHitbox) {
    c.strokeStyle = "white";
    c.lineWidth = 2;
    c.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
  }
}

export function renderMediumLaser(c, beam, hitbox, now, debugHitbox) {
  const baseWidth = hitbox.width;
  const beamHeight = hitbox.height;
  const centerX = hitbox.x + hitbox.width / 2;
  const startY = hitbox.y + 15;

  const pulse = 1 + 0.25 * Math.sin(now / 200);
  const beamWidth = baseWidth * pulse;

  const segments = 20;
  const amplitude = 5;
  const waveSpeed = 400;

  c.save();

  const gradient = c.createLinearGradient(
    centerX - beamWidth / 2,
    startY,
    centerX + beamWidth / 2,
    startY + beamHeight
  );
  gradient.addColorStop(0, "rgba(0,255,0,0.2)");
  gradient.addColorStop(0.4, beam.color);
  gradient.addColorStop(0.6, beam.color);
  gradient.addColorStop(1, "rgba(0,255,0,0.2)");

  c.fillStyle = gradient;
  c.globalAlpha = 0.9;

  c.beginPath();

  for (let i = 0; i <= segments; i++) {
    const y = startY + (i / segments) * beamHeight;
    const offset = Math.sin((now + y * 3) / waveSpeed) * amplitude;
    const x = centerX - beamWidth / 2 + offset;
    if (i === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }

  for (let i = segments; i >= 0; i--) {
    const y = startY + (i / segments) * beamHeight;
    const offset = Math.sin((now + y * 3) / waveSpeed) * amplitude;
    const x = centerX + beamWidth / 2 + offset;
    c.lineTo(x, y);
  }

  c.closePath();
  c.fill();

  for (let i = 0; i < beamHeight; i += 20) {
    const waveWidth = 6 + 2 * Math.sin((now + i * 10) / 150);
    c.beginPath();
    c.arc(centerX, startY + i, waveWidth, 0, Math.PI * 2);
    c.fillStyle = "rgba(80,255,80,0.3)";
    c.fill();
  }

  c.restore();

  // hitbox
  if (debugHitbox) {
    c.strokeStyle = "white";
    c.lineWidth = 2;
    c.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
  }
}

export function renderLargeLaser(c, beam, hitbox, now, debugHitbox) {
  const baseWidth = hitbox.width * 2;
  const tipWidth = hitbox.width;
  const beamHeight = hitbox.height;
  const startX = hitbox.x + hitbox.width / 2;
  const startY = hitbox.y + 15;
  const pulsate = 1 + 0.3 * Math.sin(now / 100);
  const animatedBaseWidth = baseWidth * pulsate;

  const gradient = c.createLinearGradient(
    startX - animatedBaseWidth / 2,
    startY,
    startX + animatedBaseWidth / 2,
    startY
  );
  gradient.addColorStop(0, "#FF8C00");
  gradient.addColorStop(0.5, "#FF0000");
  gradient.addColorStop(1, "#FF8C00");

  // Core Beam
  c.save();
  c.beginPath();
  c.moveTo(startX - animatedBaseWidth / 2, startY);
  c.quadraticCurveTo(
    startX,
    startY - 40,
    startX + animatedBaseWidth / 2,
    startY
  );
  c.lineTo(startX + tipWidth / 2, startY + beamHeight);
  c.lineTo(startX - tipWidth / 2, startY + beamHeight);
  c.closePath();

  c.fillStyle = gradient;
  c.globalAlpha = 0.85;
  c.fill();
  c.restore();

  // Rings
  const ringCount = 3;
  for (let i = 0; i < ringCount; i++) {
    const radius = animatedBaseWidth / 2 + i * 8 + 10 * Math.sin(now / 200 + i);
    c.beginPath();
    c.strokeStyle = `rgba(255, 120, 0, ${0.3 + 0.3 * Math.sin(now / 300 + i)})`;
    c.lineWidth = 2.5;
    c.ellipse(startX, startY + 40, radius, radius / 3, 0, 0, Math.PI * 2);
    c.stroke();
  }

  // === Solar flares ===
  const flareCount = 20;
  for (let i = 0; i < flareCount; i++) {
    const fx =
      startX - animatedBaseWidth / 2 + Math.random() * animatedBaseWidth;
    const fy = startY + Math.random() * beamHeight;
    const flareLength = 5 + Math.random() * 10;
    const angle = (Math.random() - 0.5) * Math.PI;

    const dx = Math.cos(angle) * flareLength;
    const dy = Math.sin(angle) * flareLength;

    c.beginPath();
    c.moveTo(fx, fy);
    c.lineTo(fx + dx, fy + dy);
    c.strokeStyle = "rgba(255, 255, 0, 0.5)";
    c.lineWidth = 1;
    c.stroke();

    // hitbox
    if (debugHitbox) {
      c.strokeStyle = "white";
      c.lineWidth = 2;
      c.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    }
  }
}

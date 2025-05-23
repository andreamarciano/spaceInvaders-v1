export function generateBossProjectiles({
  boss,
  bossConfig,
  drawX,
  drawY,
  bossStats,
  bossProjectileConfig,
  bossProjectilesRefs,
  isPhase3EnabledRef,
  playLaserSound,
  soundURL,
}) {
  if (!boss || boss.entering) return;

  const types = ["small", "medium", "large"];

  types.forEach((type) => {
    const offsets = bossConfig.gunOffsets[type];

    const chance = { small: 0.03, medium: 0.02, large: 0.01 }[type];
    const chance2 = { small: 0.01, medium: 0.01, large: 0.01 }[type];
    const chanceByPhase = isPhase3EnabledRef.current ? chance2 : chance;

    const shapesByType = {
      small: ["rect", "triangle"],
      medium: ["rect", "diamond", "s"],
      large: ["rect", "diamond", "triangle"],
    };

    offsets.forEach((offsetX) => {
      if (Math.random() < chanceByPhase) {
        const shapeChoices = shapesByType[type];
        const shape =
          shapeChoices[Math.floor(Math.random() * shapeChoices.length)];

        const newProjectile = {
          x: drawX + offsetX,
          y: drawY + bossStats.height - 1,
          ...bossProjectileConfig[type],
          shape,
        };

        bossProjectilesRefs[type].current.push(newProjectile);

        if (type === "small") {
          playLaserSound(soundURL.laserInvader);
        }
      }
    });
  });
}

export function drawBossProjectiles(projectiles, config, c) {
  projectiles.forEach((p) => {
    p.y += p.speed;

    switch (p.shape) {
      case "triangle":
        if (p.type === "large") {
          const time = performance.now() / 300;
          const stretch = 1 + Math.sin(time + p.y * 0.05) * 0.2;
          const wobble = Math.sin(time + p.x * 0.05) * 4;
          const dynamicHeight = config.height * stretch;

          c.fillStyle = config.borderColor;
          c.beginPath();
          c.moveTo(p.x - config.borderSize + wobble, p.y);
          c.lineTo(
            p.x + config.width / 2,
            p.y + dynamicHeight + config.borderSize
          );
          c.lineTo(p.x + config.width + config.borderSize + wobble, p.y);
          c.closePath();
          c.fill();

          c.fillStyle = config.color;
          c.beginPath();
          c.moveTo(p.x + wobble, p.y);
          c.lineTo(p.x + config.width / 2, p.y + dynamicHeight);
          c.lineTo(p.x + config.width + wobble, p.y);
          c.closePath();
          c.fill();

          // hitbox
          // c.strokeStyle = "lime";
          // c.lineWidth = 1;
          // c.strokeRect(p.x, p.y, config.width, config.height);
        } else {
          c.fillStyle = config.borderColor;
          c.beginPath();
          c.moveTo(p.x - config.borderSize, p.y);
          c.lineTo(
            p.x + config.width / 2,
            p.y + config.height + config.borderSize
          );
          c.lineTo(p.x + config.width + config.borderSize, p.y);
          c.closePath();
          c.fill();

          c.fillStyle = config.color;
          c.beginPath();
          c.moveTo(p.x, p.y);
          c.lineTo(p.x + config.width / 2, p.y + config.height);
          c.lineTo(p.x + config.width, p.y);
          c.closePath();
          c.fill();

          // hitbox
          // c.strokeStyle = "red";
          // c.lineWidth = 1;
          // c.strokeRect(p.x, p.y, config.width, config.height);

          break;
        }

      case "diamond": {
        let width = config.width;
        let height = config.height;
        let offsetY = 0;

        const isMedium = p.type === "medium";
        const isLarge = p.type === "large";

        if (isLarge) {
          const time = performance.now() / 200;
          const wave = Math.sin(time + p.x * 0.05);
          width += wave * 3;
          offsetY = Math.sin(time + p.y * 0.1) * 1.5;

          // hitbox
          // c.strokeStyle = "lime";
          // c.lineWidth = 1;
          // c.strokeRect(p.x, p.y, config.width, config.height);
        }

        if (isMedium) {
          c.save();

          const centerX = p.x + width / 2;
          const centerY = p.y + height / 2 + offsetY;
          const rotation = (performance.now() / 300) % (2 * Math.PI);

          c.translate(centerX, centerY);
          c.rotate(rotation);
          c.translate(-centerX, -centerY);
        }

        c.fillStyle = config.borderColor;
        c.beginPath();
        c.moveTo(p.x + width / 2, p.y + offsetY - config.borderSize);
        c.lineTo(p.x - config.borderSize, p.y + height / 2 + offsetY);
        c.lineTo(p.x + width / 2, p.y + height + offsetY + config.borderSize);
        c.lineTo(p.x + width + config.borderSize, p.y + height / 2 + offsetY);
        c.closePath();
        c.fill();

        c.fillStyle = config.color;
        c.beginPath();
        c.moveTo(p.x + width / 2, p.y + offsetY);
        c.lineTo(p.x, p.y + height / 2 + offsetY);
        c.lineTo(p.x + width / 2, p.y + height + offsetY);
        c.lineTo(p.x + width, p.y + height / 2 + offsetY);
        c.closePath();
        c.fill();

        if (isMedium) {
          // hitbox
          // c.strokeStyle = "red";
          // c.lineWidth = 1;
          // c.strokeRect(p.x, p.y, config.width, config.height);

          c.restore();
        }

        break;
      }

      case "s": {
        c.save();

        const centerX = p.x + config.width / 2;
        const centerY = p.y + config.height / 2;
        const rotation = (performance.now() / 100) % (2 * Math.PI);

        c.translate(centerX, centerY);
        c.rotate(rotation);
        c.translate(-centerX, -centerY);

        const path = [
          [p.x + config.width, p.y],
          [p.x, p.y],
          [p.x, p.y + config.height / 2],
          [p.x + config.width, p.y + config.height / 2],
          [p.x + config.width, p.y + config.height],
          [p.x, p.y + config.height],
        ];

        c.strokeStyle = config.borderColor;
        c.lineWidth = config.borderSize + 2;
        c.beginPath();
        c.moveTo(...path[0]);
        path.slice(1).forEach(([x, y]) => c.lineTo(x, y));
        c.stroke();

        c.strokeStyle = config.color;
        c.lineWidth = config.borderSize;
        c.beginPath();
        c.moveTo(...path[0]);
        path.slice(1).forEach(([x, y]) => c.lineTo(x, y));
        c.stroke();

        c.restore();

        // hitbox
        // c.strokeStyle = "red";
        // c.lineWidth = 1;
        // c.strokeRect(p.x, p.y, config.width, config.height);

        break;
      }

      default:
        if (p.type === "large") {
          const time = performance.now() / 200;
          const wave = Math.sin(time + p.x * 0.1) * 3;

          const dynamicWidth = config.width + wave;
          const dynamicHeight = config.height + Math.sin(time + p.y * 0.1) * 2;

          c.fillStyle = config.borderColor;
          c.fillRect(
            p.x - config.borderSize,
            p.y - config.borderSize,
            dynamicWidth + config.borderSize * 2,
            dynamicHeight + config.borderSize * 2
          );

          c.fillStyle = config.color;
          c.fillRect(p.x, p.y, dynamicWidth, dynamicHeight);

          // hitbox
          // c.strokeStyle = "lime";
          // c.lineWidth = 1;
          // c.strokeRect(p.x, p.y, config.width, config.height);
        } else {
          c.fillStyle = config.borderColor;
          c.fillRect(
            p.x - config.borderSize,
            p.y - config.borderSize,
            config.width + config.borderSize * 2,
            config.height + config.borderSize * 2
          );

          c.fillStyle = config.color;
          c.fillRect(p.x, p.y, config.width, config.height);
        }
        break;
    }
  });
}

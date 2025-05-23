import { followerChargeParticles, getFollowerBeamHitbox } from "./utils";

export function drawFollower({
  c,
  canvas,
  followerConfig,
  followersRef,
  followerImageRef,
  followerImage2Ref,
  bossDefeatedRef,
}) {
  followersRef.current.forEach((follower) => {
    if (followerImageRef.current.complete) {
      c.drawImage(
        bossDefeatedRef.current
          ? followerImage2Ref.current
          : followerImageRef.current,
        follower.x,
        follower.y,
        follower.width,
        follower.height
      );
    } else {
      c.fillStyle = "red";
      c.fillRect(follower.x, follower.y, follower.width, follower.height);
    }

    const {
      stats: fs,
      beam: fb,
      beamParticles: { active: fp },
    } = followerConfig;

    // === DRAW FOLLOWER LIFE BAR ===
    const drawFollowerLifeBar = () => {
      const barPadding = 4;
      const barWidth = follower.width - barPadding * 2;
      const barHeight = 5;
      const x = follower.x + barPadding;
      const y = follower.y - barHeight - 2;
      const lifeRatio = follower.lives / fs.lives;
      c.fillStyle = "black";
      c.fillRect(x, y, barWidth, barHeight);
      c.fillStyle = "#7C3AED";
      c.fillRect(x, y, barWidth * lifeRatio, barHeight);
    };
    drawFollowerLifeBar();

    // === CHARGE Beam ===
    if (follower.isCharging) {
      // === Charge Animation ===
      const beamHitbox = getFollowerBeamHitbox({
        follower,
        followerConfig,
        bossDefeatedRef,
        canvas,
      });

      const colorCycle = bossDefeatedRef.current
        ? fb.colorCycle2
        : fb.colorCycle;
      const elapsed = performance.now();
      const colorCycleSpeed = 100;
      const alphaCycleSpeed = 300;
      const colorIndex =
        Math.floor(elapsed / colorCycleSpeed) % colorCycle.length;
      const beamColor = colorCycle[colorIndex];
      const alpha = 0.3 + 0.5 * Math.abs(Math.sin(elapsed / alphaCycleSpeed));
      c.fillStyle = beamColor;
      c.globalAlpha = alpha;
      c.fillRect(
        beamHitbox.x,
        beamHitbox.y,
        beamHitbox.width,
        beamHitbox.height
      );
      c.globalAlpha = 1;

      // === Charge Particles ===
      if (Math.random() < 0.6) {
        followerChargeParticles(follower, bossDefeatedRef, followerConfig);
      }
      for (let i = follower.particles.length - 1; i >= 0; i--) {
        const p = follower.particles[i];
        p.x += p.velocity.x;
        p.y += p.velocity.y;

        const dx = p.target.x - p.x;
        const dy = p.target.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 10) {
          p.velocity.x = 0;
          p.velocity.y = 0;
          p.opacity -= 0.05;
        }

        if (p.opacity <= 0) {
          follower.particles.splice(i, 1);
          continue;
        }

        c.globalAlpha = p.opacity;
        c.fillStyle = p.color;
        c.beginPath();
        c.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        c.fill();
        c.globalAlpha = 1;
      }
    }
    if (!follower.isCharging) {
      follower.particles = [];
    }

    // === ACTIVE Beam ===
    if (follower.isShooting) {
      // === Shooting Animation ===
      const beamHitbox = getFollowerBeamHitbox({
        follower,
        followerConfig,
        bossDefeatedRef,
        canvas,
      });

      const baseWidth = beamHitbox.width * 2;
      const tipWidth = beamHitbox.width;
      const beamHeight = beamHitbox.height;
      const startX = beamHitbox.x + beamHitbox.width / 2;
      const startY = beamHitbox.y + 15;

      const tipHeight = 40;
      const waveBeamHeight = beamHeight - tipHeight;
      const waveCount = 10;
      const waveHeight = 8;
      const waveLength = waveBeamHeight / waveCount;

      c.save();
      if (bossDefeatedRef.current) {
        const phase = Date.now() / 100;
        // === WAVE BEAM ===
        c.beginPath();
        c.moveTo(startX - baseWidth / 2, startY);
        c.quadraticCurveTo(startX, startY - 40, startX + baseWidth / 2, startY);

        let currentY = startY;
        let currentX = startX + baseWidth / 2;
        for (let i = 0; i < waveCount; i++) {
          const controlX = currentX + Math.sin(phase + i) * waveHeight;
          const controlY = currentY + waveLength / 2;
          const endY = currentY + waveLength;
          c.quadraticCurveTo(controlX, controlY, currentX, endY);
          currentY = endY;
        }

        c.lineTo(startX + tipWidth / 2, currentY + tipHeight);
        c.lineTo(startX - tipWidth / 2, currentY + tipHeight);

        for (let i = waveCount - 1; i >= 0; i--) {
          const controlX =
            startX - baseWidth / 2 + Math.sin(phase + i) * waveHeight;
          const controlY = currentY - waveLength / 2;
          const endY = currentY - waveLength;
          c.quadraticCurveTo(controlX, controlY, startX - baseWidth / 2, endY);
          currentY = endY;
        }
        c.closePath();
      } else {
        // === RECTANGULAR BEAM ===
        c.beginPath();
        c.moveTo(startX - baseWidth / 2, startY);
        c.quadraticCurveTo(startX, startY - 40, startX + baseWidth / 2, startY);
        c.lineTo(startX + tipWidth / 2, startY + beamHeight);
        c.lineTo(startX - tipWidth / 2, startY + beamHeight);
        c.closePath();
      }
      c.fillStyle = bossDefeatedRef.current ? fb.color2 : fb.color;
      c.globalAlpha = 0.7;
      c.fill();
      c.restore();

      // === Shooting Particles ===
      if (Math.random() < 0.8) {
        const beamHitbox = getFollowerBeamHitbox({
          follower,
          followerConfig,
          bossDefeatedRef,
          canvas,
        });

        for (let i = 0; i < 2; i++) {
          const px = beamHitbox.x + Math.random() * beamHitbox.width;
          const py = beamHitbox.y + Math.random() * beamHitbox.height;
          follower.shootParticles.push({
            x: px,
            y: py,
            radius: Math.random() * 4 + 3,
            color: bossDefeatedRef.current ? fp.color2 : fp.color,
            velocity: {
              x: (Math.random() - 0.5) * 0.3,
              y: (Math.random() - 0.5) * 0.3,
            },
            opacity: fp.opacity,
          });
        }
      }
      for (let i = follower.shootParticles.length - 1; i >= 0; i--) {
        const p = follower.shootParticles[i];
        p.x += p.velocity.x;
        p.y += p.velocity.y;
        p.opacity -= 0.03;

        if (p.opacity <= 0) {
          follower.shootParticles.splice(i, 1);
          continue;
        }

        c.globalAlpha = p.opacity;
        c.fillStyle = p.color;
        c.beginPath();
        c.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        c.fill();
        c.globalAlpha = 1;
      }
    }
    if (!follower.isShooting) {
      follower.shootParticles = [];
    }
  });
}

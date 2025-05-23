export function updateBossPhase(bossRef, handleBossPhaseChange) {
  const b = bossRef.current;
  if (!b || b.entering) return;

  let newPhase;
  if (b.lives <= 400) {
    newPhase = 3;
  } else if (b.lives <= 700) {
    newPhase = 2;
  } else {
    newPhase = 1;
  }

  if (b.phase !== newPhase) {
    b.phase = newPhase;
    handleBossPhaseChange(newPhase, bossRef);
  }
}

export function handleBossPhaseChange(
  phase,
  bossRef,
  {
    enablePhase1,
    enablePhase2,
    enablePhase3,
    bossBeamsRef,
    beamIntervalsRef,
    bossBeamConfig,
  }
) {
  const b = bossRef.current;
  if (!b) return;

  switch (phase) {
    case 1:
      enablePhase1(true);
      enablePhase2(false);
      bossBeamsRef.current = [];
      beamIntervalsRef.current.forEach(clearInterval);
      beamIntervalsRef.current = [];
      break;

    case 2:
      enablePhase1(false);
      enablePhase2(true);

      b.entering = true;
      b.entrancePhase = "rising";
      b.hasChangedImage = false;

      const configs = [
        bossBeamConfig.small,
        bossBeamConfig.medium,
        bossBeamConfig.large,
      ];
      configs.forEach((config) => {
        config.x.forEach((x, i) => {
          const y = config.y[i];
          const interval = setInterval(() => {
            const now = performance.now();
            bossBeamsRef.current.push({
              x,
              y,
              width: config.beamWidth,
              damage: config.beamDamage,
              color: config.beamColor,
              type: config.type,
              isCharging: true,
              isShooting: false,
              createdAt: now,
              chargeEnd: now + config.chargeDuration,
              shootEnd: now + config.chargeDuration + config.beamDuration,
            });
          }, config.shootInterval);

          beamIntervalsRef.current.push(interval);
        });
      });
      break;

    case 3:
      enablePhase1(true);
      enablePhase2(true);
      enablePhase3(true);
      break;
  }
}

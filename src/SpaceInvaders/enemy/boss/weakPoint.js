export const generateBlueWeakPoint = (space) => {
  const weakWidth = 18;
  const maxX = space.width - weakWidth;
  const offsetX = Math.floor(Math.random() * (maxX + 1));
  return {
    x: space.x + offsetX,
    y: space.y,
    width: weakWidth,
    height: space.height,
    originSpace: space,
  };
};

export const pickBlueWeakPoints = (blueSpaces, count) => {
  const allBlueSpaces = [...blueSpaces];
  const selected = [];

  while (selected.length < count && allBlueSpaces.length > 0) {
    const index = Math.floor(Math.random() * allBlueSpaces.length);
    const space = allBlueSpaces[index];
    selected.push(generateBlueWeakPoint(space));
    allBlueSpaces.splice(index, 1);
  }

  return selected;
};

export function spawnBlueWeakPoints({
  bossRef,
  activeBlueWeakPointsRef,
  bossConfig,
}) {
  return setInterval(() => {
    if (
      bossRef.current &&
      !bossRef.current.retreating &&
      !bossRef.current.entering
    ) {
      activeBlueWeakPointsRef.current = pickBlueWeakPoints(
        bossConfig.blueWeakPoints.spaces,
        bossConfig.blueWeakPoints.count
      );
    }
  }, 5000);
}

export const pickRedWeakPoints = (allRedSpaces, usedRedSpaces, count) => {
  const selected = [];
  while (selected.length < count && allRedSpaces.length > 0) {
    const index = Math.floor(Math.random() * allRedSpaces.length);
    const space = allRedSpaces[index];
    selected.push(space);
    usedRedSpaces.push(space);
    allRedSpaces.splice(index, 1);
  }
  return selected;
};

export function drawDamageLabels({ ctx, damageLabelsRef }) {
  damageLabelsRef.current.forEach((label) => {
    ctx.save();
    ctx.globalAlpha = label.alpha;
    ctx.fillStyle = label.color;
    ctx.font = label.font;
    ctx.fillText(label.text, label.x, label.y);
    ctx.restore();

    label.y -= 0.5;
    label.lifetime--;
    label.alpha -= 1 / 60;
  });

  damageLabelsRef.current = damageLabelsRef.current.filter(
    (label) => label.lifetime > 0
  );
}

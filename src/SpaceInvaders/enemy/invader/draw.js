export function drawInvaderGrids(
  c,
  invaderGridsRef,
  invaderConfig,
  invaderImageRef
) {
  const inv = invaderConfig.stats;

  invaderGridsRef.current.forEach((grid) => {
    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        if (!grid.invaders[row][col]) continue;

        const x = grid.x + col * inv.width;
        const y = grid.y + row * inv.height;

        if (invaderImageRef.current.complete) {
          c.drawImage(invaderImageRef.current, x, y, inv.width, inv.height);
        } else {
          c.fillStyle = "white";
          c.fillRect(x, y, inv.width, inv.height);
        }
      }
    }
  });
}

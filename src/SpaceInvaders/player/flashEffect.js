export function flashEffect(
  ref,
  { min = 0.2, max = 1, flashes = 10, interval = 100, playerActive } = {}
) {
  let count = 0;
  const intervalId = setInterval(() => {
    if (!playerActive) {
      clearInterval(intervalId);
      return;
    }

    ref.current = ref.current === max ? min : max;
    count++;
    if (count > flashes) {
      clearInterval(intervalId);
      ref.current = max;
    }
  }, interval);
}

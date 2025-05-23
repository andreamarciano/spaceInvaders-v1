const meteorConfig = {
  speed: {
    big: 2,
    med: 3,
    small: 4,
  },
  speed2: {
    big: 3.5,
    med: 4.5,
    small: 5.5,
  },
  retreatSpeed: {
    big: 5,
    med: 6,
    small: 7,
  },
  lives: {
    big: 3,
    med: 2,
    small: 1,
  },
  size: {
    big: 96,
    med: 43,
    small: 28,
  },
  score: {
    big: 10,
    med: 20,
    small: 50,
  },
  spawn: {
    score: 500,
    time: 3000,
  },
  hitParticles: {
    big: {
      color: "#FFA726",
      opacity: 0.6,
      count: 500,
      radiusRange: [2, 6],
      velocityRange: [2, 6],
    },
    med: {
      color: "#FFCC26",
      opacity: 0.5,
      count: 250,
      radiusRange: [1.5, 4],
      velocityRange: [1.5, 4],
    },
    small: { color: "#FFDB26", opacity: 0.4, count: 15 },
  },
};

export default meteorConfig;

const invaderConfig = {
  stats: {
    width: 30,
    height: 30,
    maxSpeed: 3,
    minSpeed: 2,
    retreadSpeed: 3,
    single: 10,
    grid: 50,
  },
  projectile: {
    width: 4,
    height: 12,
    speed: 4,
    damage: 1,
  },
  hitParticles: {
    color: "#BAA0DE",
    opacity: 0.4,
    count: 20,
  },
  spawn: {
    min: 7500,
    max: 13000,
    projectile: 1500,
  },
};

export default invaderConfig;

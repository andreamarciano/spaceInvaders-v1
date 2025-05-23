const followerConfig = {
  stats: {
    width: 50,
    height: 40,
    lives: 5,
    speed: 2.5,
    speed2: 3.5,
    score: 100,
  },
  beam: {
    shootInterval: 240,
    shootInterval2: 120,
    chargeDuration: 90,
    duration: 120,
    duration2: 90,
    width: 20,
    width2: 30,
    color: "red",
    color2: "#B388EB",
    damage: 1,
    damage2: 2,
    colorCycle: ["#FFFF00", "#FFC300", "#FF8C00", "#FF4500", "#FF0000"],
    colorCycle2: ["#87F5FB", "#A3D5FF", "#C3B1E1", "#B07BE0", "#B388EB"],
  },
  beamParticles: {
    charge: {
      color: "#FFD700",
      color2: "#C084FC",
      opacity: 1,
    },
    active: {
      color: "#FFA500",
      color2: "#B071F0",
      opacity: 0.9,
    },
  },
  hitParticles: {
    color: "#7049A6",
    opacity: 0.6,
    count: 100,
  },
  spawn: {
    score: 750,
    time: 6500,
  },
};

export default followerConfig;
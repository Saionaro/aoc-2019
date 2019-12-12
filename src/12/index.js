const initialPositions = require("./data")
  .split("\n")
  .map(row => row.match(/-?\d+/g).map(num => parseInt(num, 10)));

const getPairs = length => {
  const pairs = [];

  for (var i = 0; i < length - 1; i++) {
    for (var j = i; j < length - 1; j++) {
      pairs.push([i, j + 1]);
    }
  }

  return pairs;
};

const absSum = loc => loc.reduce((acc, num) => acc + Math.abs(num), 0);

const getEnergy = body => absSum(body.location) * absSum(body.velocity);

class System {
  constructor(bodyes) {
    this.bodyes = bodyes.map(([x, y, z]) => ({
      location: [x, y, z],
      velocity: [0, 0, 0]
    }));
    this.pairs = getPairs(bodyes.length);
  }

  runIteration() {
    this.applyGravity();
    this.applyVelocity();
  }

  getEnergy() {
    return this.bodyes.reduce((acc, body) => acc + getEnergy(body), 0);
  }

  applyGravity() {
    for (const pair of this.pairs) {
      const b1 = this.bodyes[pair[0]];
      const b2 = this.bodyes[pair[1]];

      for (let i = 0; i < 3; i++) {
        if (b1.location[i] > b2.location[i]) {
          b1.velocity[i]--;
          b2.velocity[i]++;
        } else if (b1.location[i] < b2.location[i]) {
          b1.velocity[i]++;
          b2.velocity[i]--;
        }
      }
    }
  }

  applyVelocity() {
    for (const body of this.bodyes) {
      for (let i = 0; i < 3; i++) {
        body.location[i] += body.velocity[i];
      }
    }
  }
}

// part 1

const system = new System(initialPositions);

for (let i = 0; i < 1000; i++) {
  system.runIteration();
}

console.log(system.getEnergy()); // 9139

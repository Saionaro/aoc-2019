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

class Body {
  constructor([x, y, z]) {
    this.location = [x, y, z];
    this.velocity = [0, 0, 0];
  }
}
class System {
  constructor(bodyes) {
    this.bodyes = bodyes.map(([x, y, z]) => new Body([x, y, z]));
    this.pairs = getPairs(bodyes.length);
  }

  runIteration() {
    this.applyGravity();
    this.applyVelocity();
  }

  getEnergy() {
    return this.bodyes.reduce((acc, body) => acc + getEnergy(body), 0);
  }

  static applyGravityPair(b1, b2, i) {
    if (b1.location[i] > b2.location[i]) {
      b1.velocity[i]--;
      b2.velocity[i]++;
    } else if (b1.location[i] < b2.location[i]) {
      b1.velocity[i]++;
      b2.velocity[i]--;
    }
  }

  applyGravity() {
    for (const pair of this.pairs) {
      const b1 = this.bodyes[pair[0]];
      const b2 = this.bodyes[pair[1]];

      for (let i = 0; i < 3; i++) {
        System.applyGravityPair(b1, b2, i);
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

  getSnapshot() {
    let snapshots = new Array(3).fill("");

    for (let j = 0; j < this.bodyes.length; j++) {
      for (let i = 0; i < 3; i++) {
        snapshots[
          i
        ] += `${this.bodyes[j].location[i]}${this.bodyes[j].velocity[i]}`;
      }
    }

    return snapshots;
  }
}

// part 1

const system = new System(initialPositions);

for (let i = 0; i < 1000; i++) {
  system.runIteration();
}

console.log(system.getEnergy()); // 9139

// part 2

const getNod = (a1, b1) => {
  let a = a1;
  let b = b1;

  while (b > 0) {
    let tmp = a % b;
    a = b;
    b = tmp;
  }

  return a;
};

const getNoc = (a, b) => Math.abs(a * b) / getNod(a, b);

const solvePart2 = () => {
  const system = new System(initialPositions);
  const mems = [
    { store: {}, per: 0 },
    { store: {}, per: 0 },
    { store: {}, per: 0 }
  ];
  let steps = 0;

  while (1) {
    system.runIteration();

    const snap = system.getSnapshot();

    for (let i = 0; i < mems.length; i++) {
      if (!mems[i].per) {
        if (mems[i].store[snap[i]]) {
          mems[i].per = steps;
          mems[i].store = {};
        } else {
          mems[i].store[snap[i]] = true;
        }
      }
    }

    steps++;

    if (mems.every(item => Boolean(item.per))) break;
  }

  return getNoc(mems[0].per, getNoc(mems[1].per, mems[2].per));
};

console.log(solvePart2()); // 420788524631496

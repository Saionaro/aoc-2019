const tests = [];

for (let i = 1; i <= 5; i++) {
  const { result, data, count } = require(`./examples/${i}`);

  tests.push({
    id: i,
    data: data.split("\n"),
    count,
    result
  });
}

// Gradient the same for same lines. So it kinda "hash" for line
const getGrad = ([x1, y1], [x2, y2]) => (x1 - x2) / (y1 - y2);

const isSame = ([x1, y1], [x2, y2]) => x1 === x2 && y1 === y2;

const calcVisibleAsteroids = (astrA, asteroids) => {
  const firstHalf = new Set();
  const secondHalf = new Set();

  for (const astrB of asteroids) {
    if (isSame(astrA, astrB)) continue;

    const grad = getGrad(astrA, astrB);
    // we should separate areas on opposite sides of lines
    if (astrA[0] < astrB[0] || (astrA[0] === astrB[0] && astrA[1] < astrB[1])) {
      firstHalf.add(grad);
    } else {
      secondHalf.add(grad);
    }
  }

  return firstHalf.size + secondHalf.size;
};

const getBestBase = map => {
  let maxCount = -Infinity;
  const maxCoords = [];
  const asteroids = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "#") {
        asteroids.push([j, i]);
      }
    }
  }

  for (const asteroid of asteroids) {
    const count = calcVisibleAsteroids(asteroid, asteroids);

    if (count > maxCount) {
      maxCount = count;
      maxCoords[0] = asteroid[0];
      maxCoords[1] = asteroid[1];
    }
  }

  return { coords: maxCoords, count: maxCount };
};

for (const test of tests) {
  const {
    coords: [x, y],
    count
  } = getBestBase(test.data);

  if (x !== test.result[0] || y !== test.result[1] || count !== test.count) {
    console.log(`{${test.id}} test failed`);
    console.log(`Got <${x},${y}> and ${count}`);
    console.log(
      `Expected <${test.result[0]},${test.result[1]}> and ${test.count}`
    );
  } else {
    console.log(`{${test.id}} test passed`);
  }
  console.log("-".repeat(20));
}

const data = require("./data").split("\n");

// part 1

console.log(getBestBase(data)); // 227

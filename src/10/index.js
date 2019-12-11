const ANIMATE = false;

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
const getGrad = ([x1, y1], [x2, y2]) => {
  const divider = y1 - y2;

  if (divider === 0) return undefined;

  return (x1 - x2) / divider;
};

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

const getAsteroidsList = map => {
  const asteroids = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "#") {
        asteroids.push([j, i]);
      }
    }
  }

  return asteroids;
};

const getBestBase = asteroids => {
  let maxCount = -Infinity;
  const maxCoords = [];

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
  } = getBestBase(getAsteroidsList(test.data));

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
const asteroids = getAsteroidsList(data);

// part 1
const base = getBestBase(asteroids);

console.log(base); // 227

// part 2

// from 0 to 24
const sortGrads = (firstHalf, secondHalf) => {
  const keys = [
    ...new Set([...Object.keys(firstHalf), ...Object.keys(secondHalf)])
  ];
  const sortedGrads = ["0"];

  negatives = keys.filter(item => parseFloat(item) < 0).sort((a, b) => b - a);
  sortedGrads.push(...negatives);
  sortedGrads.push("undefined");
  positives = keys.filter(item => parseFloat(item) > 0).sort((a, b) => b - a);
  sortedGrads.push(...positives);

  return sortedGrads;
};

const getDistance = ([x1, y1], [x2, y2]) =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

const drawField = (gradMap1, gradMap2, [x, y]) => {
  let kke = "";
  const asteroids = {};

  for (const list of Object.values(gradMap1)) {
    for (const item of list) {
      asteroids[`${item[0]},${item[1]}`] = true;
    }
  }
  for (const list of Object.values(gradMap2)) {
    for (const item of list) {
      asteroids[`${item[0]},${item[1]}`] = true;
    }
  }

  for (let i = 0; i < 21; i++) {
    for (let j = 0; j < 21; j++) {
      if (j === base.coords[0] && i === base.coords[1]) {
        kke += "0";
      } else if (j === x && i === y) {
        kke += "x";
      } else {
        const astro = asteroids[`${j},${i}`];
        kke += astro ? "#" : ".";
      }
    }

    kke += "\n";
  }

  console.log(kke);
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const destroyAsteroids = async (base, asteroids) => {
  const astrA = base;
  const firstHalf = {};
  const secondHalf = {};

  for (const astrB of asteroids) {
    if (isSame(astrA, astrB)) continue;

    const grad = getGrad(astrA, astrB);

    if (astrA[0] < astrB[0] || (astrA[0] === astrB[0] && astrA[1] > astrB[1])) {
      if (!firstHalf[grad]) firstHalf[grad] = [];
      firstHalf[grad].push(astrB);
    } else {
      if (!secondHalf[grad]) secondHalf[grad] = [];
      secondHalf[grad].push(astrB);
    }
  }

  const grads = sortGrads(firstHalf, secondHalf);

  for (const grad of Object.keys(firstHalf)) {
    firstHalf[grad] = firstHalf[grad].sort(
      (item1, item2) => getDistance(astrA, item2) - getDistance(astrA, item1)
    );
  }

  for (const grad of Object.keys(secondHalf)) {
    secondHalf[grad] = secondHalf[grad].sort(
      (item1, item2) => getDistance(astrA, item2) - getDistance(astrA, item1)
    );
  }

  let destroyed = 0;

  // 11,13 - its base

  // firstHalf - from 12 to 18 (not included)
  // secondHalf - from 18 to 24 (not included)

  while (asteroids.length - 1 - destroyed > 0) {
    for (const grad of grads) {
      if (firstHalf[grad]) {
        const destroyedCoords = firstHalf[grad].pop();
        if (++destroyed === 200) console.log(destroyedCoords);
        if (!firstHalf[grad].length) delete firstHalf[grad];
        if (ANIMATE) {
          drawField(firstHalf, secondHalf, destroyedCoords);
          await delay(30);
        }
      }
    }

    for (const grad of grads) {
      if (secondHalf[grad]) {
        const destroyedCoords = secondHalf[grad].pop();
        if (++destroyed === 200) console.log(destroyedCoords);
        if (!secondHalf[grad].length) delete secondHalf[grad];
        if (ANIMATE) {
          drawField(firstHalf, secondHalf, destroyedCoords);
          await delay(30);
        }
      }
    }
  }
  if (ANIMATE) drawField(firstHalf, secondHalf, []);
};

destroyAsteroids(base.coords, asteroids); // [6,4] => 604

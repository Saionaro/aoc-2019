const data = require("./data")
  .split("\n")
  .map(item => item.split(","));

// part 1

const usedCoordsA = {};
const usedCoordsB = {};
const intersections = [];

const move = ({ x, y, steps }, direction, distance, type) => {
  let step = 1;
  let isX = true;

  switch (direction) {
    case "D": {
      isX = false;
      break;
    }
    case "U": {
      isX = false;
      step = -1;
      break;
    }
    case "L": {
      step = -1;
      break;
    }
  }

  let newX = x;
  let newY = y;
  let newSteps = steps;

  for (let i = 1; i <= distance; i++) {
    if (isX) {
      newX += step;
    } else {
      newY += step;
    }
    newSteps++;

    const key = `${newX}-${newY}`;

    if (type === "A") {
      usedCoordsA[key] = newSteps;

      if (usedCoordsB[key]) {
        intersections.push({
          x: newX,
          y: newY,
          steps: newSteps + usedCoordsB[key]
        });
      }
    } else {
      usedCoordsB[key] = newSteps;

      if (usedCoordsA[key]) {
        intersections.push({
          x: newX,
          y: newY,
          steps: newSteps + usedCoordsA[key]
        });
      }
    }
  }

  return { x: newX, y: newY, steps: newSteps };
};

const getManhattanDistance = ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

let aCoords = { x: 0, y: 0, steps: 0 };
let bCoords = { x: 0, y: 0, steps: 0 };

for (let i = 0; i < data[0].length; i++) {
  const directionA = data[0][i][0];
  const distanceA = data[0][i].slice(1);
  const directionB = data[1][i][0];
  const distanceB = data[1][i].slice(1);

  aCoords = move(aCoords, directionA, distanceA, "A");
  bCoords = move(bCoords, directionB, distanceB, "B");
}

let minDistance = Infinity;
let minSteps = Infinity;
const center = { x: 0, y: 0 };

for (const item of intersections) {
  minDistance = Math.min(minDistance, getManhattanDistance(center, item));
  minSteps = Math.min(minSteps, item.steps);
}

console.log(minDistance); // 5357

// part 2

console.log(minSteps); // 101956

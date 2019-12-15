const ANIMATE = true;

const VM = require("./vm");

const data = require("./data")
  .split(",")
  .map(num => parseInt(num, 10));

const DIRECTIONS = {
  EAST: 4,
  SOUTH: 2,
  WEST: 3,
  NORTH: 1
};

const DIRECTIONS_LIST = Object.values(DIRECTIONS);

const OBJECTS = {
  WALL: 0,
  EMPTY: 1,
  OXYGEN: 2
};

const OBJECTS_DATA = {
  [OBJECTS.WALL]: { symbol: "#" },
  [OBJECTS.EMPTY]: { symbol: " " },
  [OBJECTS.OXYGEN]: { symbol: "O" }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const drawField = (field, pos = {}, size, stops = {}) => {
  let canvas = "";

  for (let i = size.minY; i <= size.maxY; i++) {
    for (let j = size.minX; j <= size.maxX; j++) {
      if (pos.x === j && pos.y === i) {
        canvas += "D";
      } else if (j === 0 && i === 0) {
        canvas += "S";
      } else if (stops[i] && stops[i][j]) {
        canvas += "x";
      } else if (
        field[i] &&
        field[i][j] !== undefined &&
        OBJECTS_DATA[field[i][j]]
      ) {
        canvas += OBJECTS_DATA[field[i][j]].symbol;
      } else {
        canvas += ".";
      }
    }
    canvas += "\n";
  }

  console.log("\n".repeat(50));
  console.log(canvas);
};

const getTargetCoords = (x, y, dir) => {
  let target = { x, y };

  switch (dir) {
    case DIRECTIONS.NORTH: {
      target.y--;
      break;
    }
    case DIRECTIONS.EAST: {
      target.x--;
      break;
    }
    case DIRECTIONS.WEST: {
      target.x++;
      break;
    }
    case DIRECTIONS.SOUTH: {
      target.y++;
      break;
    }
  }

  return target;
};

const isInteresting = (field, point, visited) => {
  const isUndefined = !field[point.y] || field[point.y][point.x] === undefined;
  const isVisited = visited[point.y]
    ? Boolean(visited[point.y][point.x])
    : false;

  return isUndefined && !isVisited;
};

const visited = { 0: { 0: true } };
const oCoords = { x: -1, y: -1 };
const field = { 0: { 0: OBJECTS.EMPTY } };
let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0;

const run = async (vm, x = 0, y = 0, dir = DIRECTIONS.NORTH, steps = 0) => {
  const gen = vm.run();
  let val = gen.next();
  let posX = x;
  let posY = y;
  const moves = [];
  let coords = [];

  while (!val.done) {
    switch (val.value.type) {
      case "o": {
        const response = val.value.val;
        let target = getTargetCoords(posX, posY, dir);

        if (!field[target.y]) field[target.y] = {};
        field[target.y][target.x] = response;

        if (response === OBJECTS.WALL) {
          return {};
        }

        if (response !== OBJECTS.WALL) {
          posX = target.x;
          posY = target.y;
        }

        if (response === OBJECTS.OXYGEN) {
          oCoords.x = posX;
          oCoords.y = posY;

          console.log(steps);

          if (ANIMATE) {
            drawField(field, {}, { minX, minY, maxX, maxY });
          }

          return true;
        }

        coords.push([posX, posY]);
        coords = coords.slice(-3);

        maxX = Math.max(posX, maxX, target.x);
        maxY = Math.max(posY, maxY, target.y);
        minX = Math.min(posX, minX, target.x);
        minY = Math.min(posY, minY, target.y);

        val = gen.next();

        break;
      }
      case "i": {
        let incognitoDirs = [];

        for (const direction of DIRECTIONS_LIST) {
          const target = getTargetCoords(posX, posY, direction);

          if (isInteresting(field, target, visited)) {
            incognitoDirs.push(direction);
          }

          if (!visited[target.y]) visited[target.y] = {};
          visited[target.y][target.x] = true;
        }

        if (incognitoDirs.length) {
          await Promise.all(
            incognitoDirs.map(d => run(vm.clone(), posX, posY, d, steps + 1))
          );

          return;
        }

        moves.push(dir);
        val = gen.next(dir);

        break;
      }
    }

    if (ANIMATE) {
      drawField(field, { x: posX, y: posY }, { minX, minY, maxX, maxY }, {});
      await delay(10);
    }
  }
};

run(new VM(data)); // 204

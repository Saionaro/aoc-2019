const VM = require("./vm");

const data = require("./data")
  .split(",")
  .map(num => parseInt(num, 10));

const OBJECTS = {
  BRICK: 35,
  EMPTY: 46,
  NL: 10,
  UP: 94,
  LEFT: 60,
  RIGHT: 62,
  DOWN: 118,
  DEAD: 88
};

const OBJECTS_DATA = {
  [OBJECTS.BRICK]: { symbol: "#" },
  [OBJECTS.EMPTY]: { symbol: "." },
  [OBJECTS.NL]: { symbol: "\n" },
  [OBJECTS.UP]: { symbol: "^" },
  [OBJECTS.LEFT]: { symbol: "<" },
  [OBJECTS.RIGHT]: { symbol: ">" },
  [OBJECTS.DOWN]: { symbol: "v" },
  [OBJECTS.DEAD]: { symbol: "X" }
};

const BRICK_LIKE = {
  [OBJECTS.BRICK]: true,
  [OBJECTS.UP]: true,
  [OBJECTS.DOWN]: true,
  [OBJECTS.LEFT]: true,
  [OBJECTS.RIGHT]: true
};

const isIntersection = (field, x, y) => {
  try {
    return (
      BRICK_LIKE[field[y - 1][x]] &&
      BRICK_LIKE[field[y + 1][x]] &&
      BRICK_LIKE[field[y][x - 1]] &&
      BRICK_LIKE[field[y][x + 1]] &&
      BRICK_LIKE[field[y][x]]
    );
  } catch (e) {
    return false;
  }
};

const drawField = field => {
  let canvas = "";

  for (const row of field) {
    for (const object of row) {
      canvas += OBJECTS_DATA[object].symbol;
    }

    canvas += "\n";
  }

  console.log("\n".repeat(50));
  console.log(canvas);
};

const run = vm => {
  const gen = vm.run();
  let val = gen.next();
  const field = [[]];

  while (!val.done) {
    switch (val.value.type) {
      case "o": {
        const response = val.value.val;

        if (!OBJECTS_DATA[response]) debugger;

        if (response === OBJECTS.NL) {
          field.push([]);
        } else {
          field[field.length - 1].push(response);
        }

        val = gen.next();

        break;
      }
      case "i": {
        val = gen.next();

        break;
      }
    }
  }

  return field;
};

const calibrate = field => {
  let sum = 0;

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (isIntersection(field, j, i)) {
        sum += i * j;
      }
    }
  }

  return sum;
};

// part 1
const solve1 = () => {
  const field = run(new VM(data));
  drawField(field);
  return calibrate(field);
};

console.log(solve1()); // x < 2729

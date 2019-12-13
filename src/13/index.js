const automatic = true;
const readline = require("readline");

const data = require("./data")
  .split(",")
  .map(num => parseInt(num, 10));

const getPosition = (data, mode = "0", index, base = 0) => {
  switch (mode) {
    case "0":
      return data[index];
    case "1":
      return index;
    case "2":
      return data[index] + base;
  }
};

const getValue = (data, mode = "0", index, base = 0) =>
  data[getPosition(data, mode, index, base)];

function* runProgram(input) {
  const copy = [...data];
  if (input) copy[0] = input;
  let base = 0;
  let i = 0;

  while (i < copy.length) {
    const operation = String(copy[i]);
    const code = parseInt(operation.slice(-2), 10);
    const modes = operation
      .slice(0, -2)
      .split("")
      .reverse();

    const p0 = getValue(copy, modes[0], i + 1, base);
    const pos0 = getPosition(copy, modes[0], i + 1, base);
    const p1 = getValue(copy, modes[1], i + 2, base);
    const pos1 = getPosition(copy, modes[1], i + 2, base);
    const p2 = getValue(copy, modes[2], i + 3, base);
    const pos2 = getPosition(copy, modes[2], i + 3, base);

    switch (code) {
      case 1: {
        copy[pos2] = p0 + p1;
        i += 4;
        break;
      }

      case 2: {
        copy[pos2] = p0 * p1;
        i += 4;
        break;
      }

      case 3: {
        copy[pos0] = yield { type: "i" };
        i += 2;
        break;
      }

      case 4: {
        yield { type: "o", val: p0 };
        i += 2;
        break;
      }

      case 5: {
        i = p0 ? p1 : i + 3;
        break;
      }

      case 6: {
        i = p0 ? i + 3 : p1;
        break;
      }

      case 7: {
        copy[pos2] = p0 < p1 ? 1 : 0;
        i += 4;
        break;
      }

      case 8: {
        copy[pos2] = p0 === p1 ? 1 : 0;
        i += 4;
        break;
      }

      case 9: {
        base += p0;
        i += 2;
        break;
      }

      case 99: {
        return;
      }
    }
  }

  throw new Error("There is no output signal");
}

const OBJECTS = {
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2,
  PADDLE: 3,
  BALL: 4
};

const OBJECTS_DATA = {
  [OBJECTS.EMPTY]: { symbol: " " },
  [OBJECTS.WALL]: { symbol: "#" },
  [OBJECTS.BLOCK]: { symbol: "0" },
  [OBJECTS.PADDLE]: { symbol: "=" },
  [OBJECTS.BALL]: { symbol: "*" }
};

const DIRECTIONS = {
  LEFT: -1,
  STOP: 0,
  RIGHT: 1
};

const DIRECTIONS_DATA = {
  [DIRECTIONS.LEFT]: {
    a: true,
    left: true
  },
  [DIRECTIONS.RIGHT]: {
    d: true,
    right: true
  },
  [DIRECTIONS.STOP]: {
    w: true,
    s: true,
    up: true,
    down: true
  }
};

const run = () => {
  const field = {};
  const gen = runProgram();
  let val = gen.next();
  let maxX = -Infinity;
  let maxY = -Infinity;

  while (!val.done) {
    switch (val.value.type) {
      case "o": {
        const x = val.value.val;
        val = gen.next();
        const y = val.value.val;
        val = gen.next();
        const id = val.value.val;
        val = gen.next();

        maxX = Math.max(x, maxX);
        maxY = Math.max(y, maxY);

        if (!field[y]) field[y] = {};
        field[y][x] = id;

        break;
      }
    }
  }

  return { field, size: { x: maxX + 1, y: maxY + 1 } };
};

const drawField = (field, size, score) => {
  let canvas = "";

  for (let i = 0; i < size.y; i++) {
    for (let j = 0; j < size.x; j++) {
      if (field[i] && field[i][j] && OBJECTS_DATA[field[i][j]]) {
        canvas += OBJECTS_DATA[field[i][j]].symbol;
      } else {
        canvas += " ";
      }
    }
    if (i === 0) canvas += " ".repeat(20) + score;
    canvas += "\n";
  }
  console.log("\n".repeat(50));
  console.log(canvas);
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let direction = DIRECTIONS.STOP;

const runGame = async () => {
  const field = {};
  const gen = runProgram(2);
  let val = gen.next();
  let maxX = -Infinity;
  let maxY = -Infinity;
  let score = 0;
  let fieldDone = false;
  let ballX = -1;
  let ballY = -1;
  let paddleX = -1;

  while (!val.done) {
    switch (val.value.type) {
      case "o": {
        const x = val.value.val;
        val = gen.next();
        const y = val.value.val;
        val = gen.next();
        const value = val.value.val;
        val = gen.next();

        if (x === -1 && y === 0) {
          score = value;
          fieldDone = true;
        } else {
          maxX = Math.max(x, maxX);
          maxY = Math.max(y, maxY);
          if (!field[y]) field[y] = {};
          field[y][x] = value;

          if (value === OBJECTS.BALL) {
            ballX = x;
            ballY = y;
          }

          if (value === OBJECTS.PADDLE) {
            paddleX = x;
          }
        }

        break;
      }
      case "i": {
        let dir = DIRECTIONS.STOP;

        if (automatic) {
          if (ballX > paddleX) {
            dir = DIRECTIONS.RIGHT;
          } else if (ballX === paddleX) {
            dir = DIRECTIONS.STOP;
          } else {
            dir = DIRECTIONS.LEFT;
          }
        } else {
          dir = direction;
        }

        val = gen.next(dir);
        break;
      }
      default: {
        val = gen.next();
      }
    }

    if (fieldDone) {
      drawField(field, { x: maxX + 1, y: maxY + 1 }, score);
      await delay(5);
    }
  }
};

const calcBlocksField = (field, size) => {
  let blocks = 0;

  for (let i = 0; i < size.y; i++) {
    for (let j = 0; j < size.x; j++) {
      if (field[i][j] === OBJECTS.BLOCK) blocks++;
    }
  }

  return blocks;
};

const { field, size } = run();

// part 1
console.log(calcBlocksField(field, size)); // 363

// part 2

runGame(); // 17159

if (!automatic) {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", (str, key) => {
    if (key.ctrl && key.name === "c") {
      process.exit();
    } else {
      if (DIRECTIONS_DATA[DIRECTIONS.STOP][key.name])
        direction = DIRECTIONS.STOP;
      if (DIRECTIONS_DATA[DIRECTIONS.LEFT][key.name])
        direction = DIRECTIONS.LEFT;
      if (DIRECTIONS_DATA[DIRECTIONS.RIGHT][key.name])
        direction = DIRECTIONS.RIGHT;
    }
  });
}

// ###########################################                    17159
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                         *               #
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                                         #
// #                         =               #
// #                                         #

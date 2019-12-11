const data = require("./data")
  .split(",")
  .map(num => parseInt(num, 10));

const BLACK = ".";
const WHITE = "#";

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

function* runProgram() {
  const copy = [...data];
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

const getColor = (field, x, y) => {
  if (!field[x]) return BLACK;
  if (!field[x][y]) return BLACK;

  return field[x][y];
};

const setColor = (field, x, y, color) => {
  if (!field[x]) field[x] = {};
  field[x][y] = color ? WHITE : BLACK;
};

const directionsMap = {
  "0": {
    "-1": {
      0: [-1, 0],
      1: [1, 0]
    },
    "1": {
      0: [1, 0],
      1: [-1, 0]
    }
  },
  "1": {
    "0": {
      0: [0, -1],
      1: [0, 1]
    }
  },
  "-1": {
    "0": {
      0: [0, 1],
      1: [0, -1]
    }
  }
};

const run = () => {
  const field = { 0: { 0: BLACK } };
  const gen = runProgram();
  let val = gen.next();
  let x = 0;
  let y = 0;
  let speed = [0, -1];
  let countSet = new Set();

  while (!val.done) {
    switch (val.value.type) {
      case "o": {
        setColor(field, x, y, val.value.val);
        countSet.add(`${x},${y}`);
        val = gen.next();

        speed = directionsMap[speed[0]][speed[1]][val.value.val];
        x += speed[0];
        y += speed[1];
        val = gen.next();
        break;
      }
      case "i": {
        val = gen.next(getColor(field, x, y) === WHITE ? 1 : 0);
        break;
      }
      default: {
        val = gen.next();
      }
    }
  }

  return countSet.size;
};

// part 1

console.log(run()); // 2392

const data = require("./data")
  .split("\n")
  .map(row => row.split(""));

const BUG = "#";
const EMPTY = ".";

const getCountAround = (field, x, y) => {
  let count = 0;

  if (field[y]) {
    count += field[y][x + 1] === BUG ? 1 : 0;
    count += field[y][x - 1] === BUG ? 1 : 0;
  }

  if (field[y + 1]) {
    count += field[y + 1][x] === BUG ? 1 : 0;
  }

  if (field[y - 1]) {
    count += field[y - 1][x] === BUG ? 1 : 0;
  }

  return count;
};

const shouldDie = count => count !== 1;

const shouldAlive = count => count === 1 || count === 2;

const getStats = (field, x, y) => {
  const count = getCountAround(field, x, y);

  return {
    die: shouldDie(count),
    alive: shouldAlive(count)
  };
};

const iterate = data => {
  const newField = [];

  for (let i = 0; i < data.length; i++) {
    newField[i] = [];
    for (let j = 0; j < data[i].length; j++) {
      const stats = getStats(data, j, i);
      const isBug = data[i][j] === BUG;

      if (isBug) {
        newField[i][j] = stats.die ? "." : "#";
      } else {
        newField[i][j] = stats.alive ? "#" : ".";
      }
    }
  }

  return newField;
};

const print = field => {
  console.log("\n".repeat(10));

  for (const row of field) {
    let canvas = "";
    for (const cell of row) {
      canvas += cell;
    }
    console.log(canvas);
  }
};

const stringify = field => {
  let data = "";

  for (const row of field) {
    for (const cell of row) {
      data += cell;
    }
  }

  return data;
};

const calcBiodiversity = field => {
  let score = 0;

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] === BUG) {
        score += Math.pow(2, i * field[i].length + j);
      }
    }
  }

  return score;
};

const solve1 = () => {
  let dataset = data;

  const mem = {
    [stringify(dataset)]: true
  };

  while (1) {
    dataset = iterate(dataset);
    const hash = stringify(dataset);
    if (mem[hash]) break;
    mem[hash] = true;
  }

  return calcBiodiversity(dataset);
};

console.log(solve1()); // 18370591

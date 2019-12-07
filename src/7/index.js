const data = require("./data")
  .split(",")
  .map(num => parseInt(num, 10));

const getValue = (data, mode = "0", index) =>
  mode === "0" ? data[data[index]] : data[index];

function* runProgram() {
  const copy = [...data];

  let i = 0;

  while (i < copy.length) {
    const operation = String(copy[i]);
    const code = parseInt(operation.slice(-2), 10);
    const modes = operation
      .slice(0, -2)
      .split("")
      .reverse();

    if (code === 99) break;
    if (code === 1) {
      copy[copy[i + 3]] =
        getValue(copy, modes[0], i + 1) + getValue(copy, modes[1], i + 2);

      i += 4;
    }

    if (code === 2) {
      copy[copy[i + 3]] =
        getValue(copy, modes[0], i + 1) * getValue(copy, modes[1], i + 2);

      i += 4;
    }

    if (code === 3) {
      const input = yield;
      copy[copy[i + 1]] = input;
      i += 2;
    }

    if (code === 4) {
      return copy[copy[i + 1]];
    }

    if (code === 5) {
      if (getValue(copy, modes[0], i + 1)) {
        i = getValue(copy, modes[1], i + 2);
      } else {
        i += 3;
      }
    }

    if (code === 6) {
      if (getValue(copy, modes[0], i + 1)) {
        i += 3;
      } else {
        i = getValue(copy, modes[1], i + 2);
      }
    }

    if (code === 7) {
      const val =
        getValue(copy, modes[0], i + 1) < getValue(copy, modes[1], i + 2)
          ? 1
          : 0;

      copy[copy[i + 3]] = val;
      i += 4;
    }

    if (code === 8) {
      const val =
        getValue(copy, modes[0], i + 1) === getValue(copy, modes[1], i + 2)
          ? 1
          : 0;

      copy[copy[i + 3]] = val;

      i += 4;
    }
  }

  throw new Error("There is no output signal");
}

const runIteration = sequence => {
  let value = 0;

  for (const phaseSetting of sequence) {
    const args = [phaseSetting, value];
    const gen = runProgram();
    let val = gen.next();

    while (!val.done) {
      val = gen.next(args.shift());
    }

    value = val.value;
  }

  return value;
};

function generatePermutations(xs) {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = generatePermutations([...xs.slice(0, i), ...xs.slice(i + 1)]);

    if (rest.length) {
      for (const item of rest) {
        ret.push([xs[i], ...item]);
      }
    } else {
      ret.push([xs[i]]);
    }
  }
  return ret;
}

let max = -Infinity;

for (const setting of generatePermutations([0, 1, 2, 3, 4])) {
  max = Math.max(max, runIteration(setting));
}

// part 1

console.log(max); // 422858

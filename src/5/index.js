const data = require("./data")
  .split(",")
  .map(num => parseInt(num, 10));

const getValue = (data, mode = "0", index) =>
  mode === "0" ? data[data[index]] : data[index];

const runProgram = input => {
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
      copy[copy[i + 1]] = input;
      i += 2;
    }

    if (code === 4) {
      console.log(copy[copy[i + 1]]);
      i += 2;
    }
  }

  return copy[0];
};

runProgram(1);
// part 1
// 9006673

const runProgramPro = input => {
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
      copy[copy[i + 1]] = input;
      i += 2;
    }

    if (code === 4) {
      console.log(copy[copy[i + 1]]);
      i += 2;
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

  return copy[0];
};

runProgramPro(5);
// part 2
// 3629692

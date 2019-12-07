const data = require("./data")
  .split(",")
  .map(num => parseInt(num, 10));

const getValue = (data, mode = "0", index) =>
  mode === "0" ? data[data[index]] : data[index];

const generatePermutations = xs => {
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
};

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

    if (code === 99) return;
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
      copy[copy[i + 1]] = yield { type: "i" };
      i += 2;
    }

    if (code === 4) {
      yield { type: "o", val: copy[copy[i + 1]] };
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

  throw new Error("There is no output signal");
}

// part 1

const runIteration = sequence => {
  let value = 0;

  for (const phaseSetting of sequence) {
    const args = [phaseSetting, value];
    const gen = runProgram();
    let val = gen.next();

    while (!val.done) {
      if (val.value.type === "o") {
        value = val.value.val;
      }
      val = gen.next(args.shift());
    }
  }

  return value;
};

let max = -Infinity;

for (const setting of generatePermutations([0, 1, 2, 3, 4])) {
  max = Math.max(max, runIteration(setting));
}

console.log(max); // 422858

// part 2

const runIterationCycle = sequence => {
  let value = 0;

  const gens = sequence.map(() => runProgram());
  const vals = gens.map((gen, i) => {
    gen.next();
    return gen.next(sequence[i]);
  });

  let fin = false;

  while (1) {
    for (let i = 0; i < 5; i++) {
      vals[i] = gens[i].next(value); // push input and receive output
      value = vals[i].value.val;
      vals[i] = gens[i].next(); // move to input waiting

      if (vals[i].done) fin = true;
    }

    if (fin) return value;
  }
};

let max2 = -Infinity;

for (const setting of generatePermutations([5, 6, 7, 8, 9])) {
  max2 = Math.max(max2, runIterationCycle(setting));
}

console.log(max2); // 14897241

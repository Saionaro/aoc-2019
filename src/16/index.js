const rawData = require("./data");

const BASE_PATTERN = [0, 1, 0, -1];

function* getPattern(n) {
  let skipped = false;

  while (1) {
    for (let i = 0; i < BASE_PATTERN.length; i++) {
      for (let j = 0; j < n; j++) {
        if (!skipped) {
          skipped = true;
          continue;
        }
        if (yield BASE_PATTERN[i]) return;
      }
    }
  }
}

const iterate = input => {
  let acc = [];

  for (let i = 1; i <= input.length; i++) {
    const gen = getPattern(i);

    let sum = 0;

    for (let i = 0; i < input.length; i++) {
      sum += gen.next().value * input[i];
    }

    gen.next(true);
    acc.push(Math.abs(sum % 10));
  }

  return acc;
};

// part 1

let input = rawData.split("").map(item => parseInt(item, 10));

const solve1 = (offset, inputSignal) => {
  let signal = inputSignal;

  for (let i = 0; i < 100; i++) {
    signal = iterate(signal);
  }

  return signal.slice(offset, offset + 8).join("");
};

console.log(solve1(0, input)); // 59522422

// part 2

let input2 = rawData
  .repeat(10000)
  .split("")
  .map(item => parseInt(item, 10));

const solve2 = (offset, inputSignal) => {
  let signal = inputSignal;

  for (let i = 0; i < 100; i++) {
    const newSignal = [];

    for (let j = signal.length - 1; j >= 0; j--) {
      if (j < (3 * signal.length) / 4) {
        newSignal.push(0);
      } else if (j == signal.length - 1) {
        newSignal.push(signal[signal.length - 1]);
      } else {
        const next = Math.abs(newSignal[newSignal.length - 1] + signal[j]) % 10;
        newSignal.push(next);
      }
    }

    signal = newSignal.reverse();
  }

  return signal.slice(offset, offset + 8).join("");
};

console.log(solve2(parseInt(rawData.slice(0, 7), 10), input2)); // 18650834

const data = require("./data")
  .split("")
  .map(item => parseInt(item, 10));

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

    const sum = input.reduce((acc, item) => {
      return acc + gen.next().value * item;
    }, 0);

    acc.push(Math.abs(sum % 10));
  }

  return acc;
};

// part 1

let input = data;

for (let i = 0; i < 100; i++) {
  input = iterate(input);
}

console.log(input.slice(0, 8).join("")); // 59522422

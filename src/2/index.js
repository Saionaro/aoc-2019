const data = require("./data")
  .split(",")
  .map(num => parseInt(num, 10));

const runProgram = (a, b) => {
  const copy = [...data];
  copy[1] = a;
  copy[2] = b;

  for (let i = 0; i < copy.length; i += 4) {
    if (copy[i] === 99) break;
    if (copy[i] === 1) {
      copy[copy[i + 3]] = copy[copy[i + 1]] + copy[copy[i + 2]];
    }

    if (copy[i] === 2) {
      copy[copy[i + 3]] = copy[copy[i + 1]] * copy[copy[i + 2]];
    }
  }

  return copy[0];
};

// part 1

console.log(runProgram(12, 2)); // 6327510

// part 2

let a, b;

for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    if (runProgram(i, j) === 19690720) {
      a = i;
      b = j;
      break;
    }
  }
}

console.log(a * 100 + b);

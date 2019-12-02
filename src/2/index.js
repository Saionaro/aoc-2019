const data = require("./data")
  .split(",")
  .map(num => parseInt(num, 10));

// part 1

data[1] = 12;
data[2] = 2;

for (let i = 0; i < data.length; i += 4) {
  if (data[i] === 99) break;
  if (data[i] === 1) {
    data[data[i + 3]] = data[data[i + 1]] + data[data[i + 2]];
  }

  if (data[i] === 2) {
    data[data[i + 3]] = data[data[i + 1]] * data[data[i + 2]];
  }
}

console.log(data[0]);

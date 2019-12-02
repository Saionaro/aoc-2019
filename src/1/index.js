const data = require("./data").split("\n");

// part 1

const sum = data.reduce((sum, mass) => {
  const massInt = parseInt(mass);

  return sum + (Math.floor(massInt / 3) - 2);
}, 0);

console.log(sum); //3372695

// part 2

const sum2 = data.reduce((sum, mass) => {
  const massInt = parseInt(mass);

  let total = Math.floor(massInt / 3) - 2;

  let fuelNeeded = total;

  while (fuelNeeded) {
    fuelNeeded = Math.max(0, Math.floor(fuelNeeded / 3) - 2);
    total += fuelNeeded;
  }

  return sum + total;
}, 0);

console.log(sum2); // 5056172

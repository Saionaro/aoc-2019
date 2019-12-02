const data = require("./data").split("\n");

const calcFuelMass = mass => Math.floor(mass / 3) - 2;

// part 1

const sum = data.reduce((sum, mass) => {
  const massInt = parseInt(mass);

  return sum + calcFuelMass(massInt);
}, 0);

console.log(sum); // 3372695

// part 2

const sum2 = data.reduce((sum, mass) => {
  const massInt = parseInt(mass);
  let total = calcFuelMass(massInt);
  let fuelNeeded = total;

  while (fuelNeeded) {
    fuelNeeded = Math.max(0, calcFuelMass(fuelNeeded));
    total += fuelNeeded;
  }

  return sum + total;
}, 0);

console.log(sum2); // 5056172

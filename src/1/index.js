const data = require("./data").split("\n");

const sum = data.reduce((sum, mass) => {
  const massInt = parseInt(mass);

  return sum + (Math.floor(massInt / 3) - 2);
}, 0);

console.log(sum); //3372695

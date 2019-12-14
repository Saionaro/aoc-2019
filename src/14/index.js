const FUEL = "FUEL";
const ORE = "ORE";

const parseReagent = str => {
  const parts = str.split(" ");

  return {
    title: parts[1],
    amount: parseInt(parts[0], 10)
  };
};

const reagentsMap = {};

require("./data")
  .split("\n")
  .map(row => {
    const parts = row.split(" => ");

    const reagentsRaw = parts[0].split(", ");
    const result = parseReagent(parts[1]);
    const reagents = reagentsRaw.map(parseReagent);

    reagentsMap[result.title] = {
      amount: result.amount,
      reagents
    };

    return { reagents, result };
  });

const calc = (reagent, inputAmount, extras) => {
  let amount = inputAmount;
  let count = 0;

  if (reagent === ORE) return amount;

  if (extras[reagent]) {
    if (extras[reagent] >= amount) {
      extras[reagent] -= amount;
      return 0;
    }

    amount -= extras[reagent];
    extras[reagent] = 0;
  }

  const reactions = Math.ceil(amount / reagentsMap[reagent].amount);

  if (!extras[reagent]) extras[reagent] = 0;

  extras[reagent] += reactions * reagentsMap[reagent].amount - amount;

  for (const item of reagentsMap[reagent].reagents) {
    count += calc(item.title, item.amount * reactions, extras);
  }

  return count;
};

// part 1

console.log(calc(FUEL, 1, {})); //  1185296

// part 2

let count = 0;
let res = 0;

while (res < 1000000000000) {
  res = calc(FUEL, ++count, {});
}

console.log(count - 1); //  1376631

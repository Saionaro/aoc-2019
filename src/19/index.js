const VM = require("./vm");

const data = require("./data")
  .split(",")
  .map(num => parseInt(num, 10));

const OBJECTS = {
  STAT: 0,
  PULLED: 1
};

const OBJECTS_DATA = {
  [OBJECTS.STAT]: { symbol: "." },
  [OBJECTS.PULLED]: { symbol: "#" }
};

const run = (vm, input = []) => {
  const gen = vm.run();
  let val = gen.next();

  while (!val.done) {
    switch (val.value.type) {
      case "o": {
        const response = val.value.val;

        val = gen.next();
        return response;
      }
      case "i": {
        val = gen.next(input.pop());

        break;
      }
    }
  }
};

const drawField = field => {
  let canvas = "";
  for (let row of field) {
    for (let item of row) {
      canvas += OBJECTS_DATA[item].symbol;
    }
    canvas += "\n";
  }

  console.log(canvas);
};

const solve1 = () => {
  let count = 0;

  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      const res = run(new VM(data), [i, j]);
      if (res === OBJECTS.PULLED) count++;
    }
  }

  return count;
};

console.log(solve1()); // 206

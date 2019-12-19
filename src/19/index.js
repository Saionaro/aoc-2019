const VM = require("./vm");

const data = require("./data")
  .split(",")
  .map(num => parseInt(num, 10));

const OBJECTS = {
  STAT: 0,
  PULLED: 1
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

const checkLine = y => {
  let count = 0;
  let start = -1;
  let end = -1;

  for (let j = 0; j < 1000; j++) {
    const res = run(new VM(data), [y, j]);

    if (res === OBJECTS.PULLED) {
      count++;

      if (start === -1) start = j;
      end = j;
    }
  }

  return { count, start, end };
};

const checkArea = y => {
  const stats1 = checkLine(y);
  const stats2 = checkLine(y + 99);
  return { diff: stats1.end - stats2.start, 1: stats1, 2: stats2 };
};

const solve2 = () => {
  for (let i = 900; i < 1000; i++) {
    const data = checkArea(i);
    if (data.diff === 99) {
      return data[2].start * 10000 + i;
    }
  }
};

console.log(solve2()); // 6190948

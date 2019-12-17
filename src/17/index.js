const VM = require("./vm");

const data = require("./data")
  .split(",")
  .map(num => parseInt(num, 10));

const OBJECTS = {
  BRICK: 35,
  EMPTY: 46,
  NL: 10,
  UP: 94,
  LEFT: 60,
  RIGHT: 62,
  DOWN: 118,
  DEAD: 88
};

const OBJECTS_DATA = {
  [OBJECTS.BRICK]: { symbol: "#" },
  [OBJECTS.EMPTY]: { symbol: "." },
  [OBJECTS.NL]: { symbol: "\n" },
  [OBJECTS.UP]: { symbol: "^" },
  [OBJECTS.LEFT]: { symbol: "<" },
  [OBJECTS.RIGHT]: { symbol: ">" },
  [OBJECTS.DOWN]: { symbol: "v" },
  [OBJECTS.DEAD]: { symbol: "X" }
};

const BRICK_LIKE = {
  [OBJECTS.BRICK]: true,
  [OBJECTS.UP]: true,
  [OBJECTS.DOWN]: true,
  [OBJECTS.LEFT]: true,
  [OBJECTS.RIGHT]: true
};

const ROBOT_LIKE = {
  [OBJECTS.UP]: true,
  [OBJECTS.DOWN]: true,
  [OBJECTS.LEFT]: true,
  [OBJECTS.RIGHT]: true
};

const isIntersection = (field, x, y) => {
  try {
    return (
      BRICK_LIKE[field[y - 1][x]] &&
      BRICK_LIKE[field[y + 1][x]] &&
      BRICK_LIKE[field[y][x - 1]] &&
      BRICK_LIKE[field[y][x + 1]] &&
      BRICK_LIKE[field[y][x]]
    );
  } catch (e) {
    return false;
  }
};

const run = (vm, input = []) => {
  const gen = vm.run();
  const field = [[]];
  const start = { x: -1, y: -1 };
  let val = gen.next();
  let message = "";

  while (!val.done) {
    switch (val.value.type) {
      case "o": {
        const response = val.value.val;

        if (!OBJECTS_DATA[response]) {
          if (response > 200) {
            console.log(response);
          } else {
            message += String.fromCharCode(response);
          }
        } else {
          if (response === OBJECTS.NL) {
            field.push([]);
          } else {
            field[field.length - 1].push(response);
          }
        }

        if (ROBOT_LIKE[response] && start.x === -1) {
          start.x = field[field.length - 1].length - 1;
          start.y = field.length - 1;
        }

        val = gen.next();

        break;
      }
      case "i": {
        if (message) {
          console.log(message);
          message = "";
        }

        val = gen.next(input.shift());

        break;
      }
    }
  }

  if (message) console.error(message);

  return { field, start };
};

const calibrate = field => {
  let sum = 0;

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (isIntersection(field, j, i)) {
        sum += i * j;
      }
    }
  }

  return sum;
};

// part 1
const solve1 = () => {
  const { field } = run(new VM(data));
  return calibrate(field);
};

const isOk = (field, x, y) =>
  Boolean(field[y]) && field[y][x] === OBJECTS.BRICK;

const PREVS = {
  R: {
    U: "L",
    D: "R"
  },
  L: {
    U: "R",
    D: "L"
  },
  D: {
    L: "R",
    R: "L"
  },
  U: {
    L: "L",
    R: "R"
  }
};

const getProgram = () => {
  // got the program by strong human analize (*)
  return {
    main: "A,B,A,C,A,B,C,C,A,B",
    A: "R,8,L,10,R,8",
    B: "R,12,R,8,L,8,L,12",
    C: "L,12,L,10,L,8",
    video: "n"
  };
};

const compile = programs => {
  const compiled = [];

  for (const key of Object.keys(programs)) {
    for (const letter of programs[key]) {
      compiled.push(letter.charCodeAt(0));
    }
    compiled.push(10);
  }

  return compiled;
};

// part 2
const solve2 = () => {
  const vm = new VM(data);
  const { field, start } = run(vm);

  const moves = [];
  let prev = "U";
  const position = { ...start };

  while (1) {
    let moved = false;
    let count = 0;

    if (prev !== "L") {
      while (isOk(field, position.x + 1, position.y)) {
        position.x++;
        count++;
        moved = true;
      }
      if (moved) {
        moves.push(`${PREVS[prev].R}`, `${count}`);
        prev = "R";
      }
    }
    if (prev !== "D" && !moved) {
      while (isOk(field, position.x, position.y - 1)) {
        position.y--;
        count++;
        moved = true;
      }
      if (moved) {
        moves.push(`${PREVS[prev].U}`, `${count}`);
        prev = "U";
      }
    }
    if (prev !== "R" && !moved) {
      while (isOk(field, position.x - 1, position.y)) {
        position.x--;
        count++;
        moved = true;
      }
      if (moved) {
        moves.push(`${PREVS[prev].L}`, `${count}`);
        prev = "L";
      }
    }
    if (prev !== "U" && !moved) {
      while (isOk(field, position.x, position.y + 1)) {
        position.y++;
        count++;
        moved = true;
      }
      if (moved) {
        moves.push(`${PREVS[prev].D}`, `${count}`);
        prev = "D";
      }
    }
    if (!moved) break;
  }

  const vm2 = new VM(data);
  vm2.setInput(2);
  run(vm2, compile(getProgram(moves)));
};

console.log(solve1()); // 2804
console.log(solve2()); // 833429

// (*)
// [
//   "R8","L10","R8", // 1
//   "R12","R8","L8","L12", // 2
//   "R8","L10","R8", // 1
//   "L12","L10","L8", // 3
//   "R8","L10","R8", // 1
//   "R12","R8","L8","L12", // 2
//   "L12","L10","L8", // 3
//   "L12","L10","L8", // 3
//   "R8","L10","R8", // 1
//   "R12","R8","L8","L12" // 2
// ]

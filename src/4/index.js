const range = [145852, 616942];

// part 1

const checkNum = num => {
  const stringNum = String(num);
  let prevNum = parseInt(stringNum[0], 10);
  let hasDouble = false;

  for (let i = 1; i < stringNum.length; i++) {
    const currentNum = parseInt(stringNum[i], 10);

    if (currentNum < prevNum) return false;
    if (currentNum === prevNum) hasDouble = true;

    prevNum = currentNum;
  }

  return hasDouble;
};

// part 2

const checkNum2 = num => {
  const stringNum = String(num);
  let prevNum = parseInt(stringNum[0], 10);
  let digitsMap = {};

  for (let i = 1; i < stringNum.length; i++) {
    const currentNum = parseInt(stringNum[i], 10);

    if (currentNum < prevNum) return false;
    if (currentNum === prevNum) {
      if (!digitsMap[currentNum]) digitsMap[currentNum] = 1;
      digitsMap[currentNum]++;
    }

    prevNum = currentNum;
  }

  return Object.values(digitsMap).some(count => count === 2);
};

let count1 = 0;
let count2 = 0;

for (let i = range[0]; i <= range[1]; i++) {
  if (checkNum(i)) count1++;
  if (checkNum2(i)) count2++;
}

console.log(count1); // 1767
console.log(count2); // 1192

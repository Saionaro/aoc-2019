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

let count = 0;

for (let i = range[0]; i <= range[1]; i++) {
  if (checkNum(i)) count++;
}

console.log(count); // 1767

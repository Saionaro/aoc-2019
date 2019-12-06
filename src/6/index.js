const data = require("./data")
  .split("\n")
  .map(item => item.split(")"));

class Body {
  constructor(title) {
    this.title = title;
    this.satellites = [];
    this.master = null;
  }
}

// part 1

const buildTree = () => {
  let COM = null;
  let YOU = null;
  let SAN = null;
  const bodyesMap = {};

  for (const relationship of data) {
    const masterTitle = relationship[0];
    const slayTitle = relationship[1];

    if (!bodyesMap[masterTitle]) {
      bodyesMap[masterTitle] = new Body(masterTitle);

      if (masterTitle === "COM") COM = bodyesMap[masterTitle];
    }

    if (!bodyesMap[slayTitle]) {
      bodyesMap[slayTitle] = new Body(slayTitle);

      if (slayTitle === "YOU") YOU = bodyesMap[slayTitle];
      if (slayTitle === "SAN") SAN = bodyesMap[slayTitle];
    }

    bodyesMap[masterTitle].satellites.push(bodyesMap[slayTitle]);
    bodyesMap[slayTitle].master = bodyesMap[masterTitle];
  }

  return { root: COM, YOU, SAN };
};

const getChecksum = (node, level = 0) => {
  let sum = 0;

  for (const satellite of node.satellites) {
    sum += getChecksum(satellite, level + 1);
  }

  return level + sum;
};

const { root, YOU, SAN } = buildTree();

console.log(getChecksum(root)); // 292387

// part 2

const findPathLen = (nodeA, nodeB) => {
  let result = -1;
  const youMap = {};
  const sanMap = {};
  let currMaster = YOU.master;
  let counter = 0;

  // since there is a tree, just find nearest common node and count steps

  while (currMaster) {
    youMap[currMaster.title] = counter++;
    currMaster = currMaster.master;
  }

  currMaster = SAN.master;
  counter = 0;

  while (currMaster) {
    sanMap[currMaster.title] = counter++;

    if (youMap[currMaster.title]) {
      result = youMap[currMaster.title] + sanMap[currMaster.title];
      break;
    }

    currMaster = currMaster.master;
  }

  return result;
};

console.log(findPathLen(YOU, SAN)); // 433

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
    }

    bodyesMap[masterTitle].satellites.push(bodyesMap[slayTitle]);
    bodyesMap[slayTitle].master = bodyesMap[masterTitle];
  }

  return COM;
};

const getChecksum = (node, level = 0) => {
  let sum = 0;

  for (const satellite of node.satellites) {
    sum += getChecksum(satellite, level + 1);
  }

  return level + sum;
};

console.log(getChecksum(buildTree())); // 292387

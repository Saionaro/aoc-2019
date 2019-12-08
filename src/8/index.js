const data = require("./data");

const WIDTH = 25;
const HEIGHT = 6;
const PIXELS_PER_LAYER = WIDTH * HEIGHT;

const splitLayers = image => {
  const layers = [];
  let currentLayer = 0;
  let currentZeros = 0;
  let minZeros = Infinity;
  let minIndex = -1;

  for (let i = 0; i < image.length; i++) {
    if (i && i % PIXELS_PER_LAYER === 0) {
      if (currentZeros < minZeros) {
        minZeros = currentZeros;
        minIndex = currentLayer;
      }
      currentLayer++;
      currentZeros = 0;
    }
    const num = parseInt(image[i], 10);
    if (num === 0) currentZeros++;

    if (!layers[currentLayer]) layers[currentLayer] = [];

    layers[currentLayer].push(num);
  }

  return { layers, meta: { minIndex } };
};

const getChecksum = (layers, meta) => {
  const counts = layers[meta.minIndex].reduce(
    (acc, item) => {
      acc[1] += item === 1 ? 1 : 0;
      acc[2] += item === 2 ? 1 : 0;
      return acc;
    },
    { 1: 0, 2: 0 }
  );

  return counts[1] * counts[2];
};

const { layers, meta } = splitLayers(data);

// part 1

console.log(getChecksum(layers, meta)); // 1920

// part 2

const renderImage = layers => {
  let canvas = "";

  for (let j = 0; j < HEIGHT; j++) {
    const shift = j * WIDTH;

    for (let i = 0; i < WIDTH; i++) {
      const coord = shift + i;

      for (const layer of layers) {
        const pixel = layer[coord];

        if (pixel !== 2) {
          canvas += String(pixel === 0 ? " " : "0");
          break;
        }
      }
    }

    canvas += "\n";
  }

  return canvas;
};

console.log(renderImage(layers));
// 000   00  0  0 0     00
// 0  0 0  0 0  0 0    0  0
// 0  0 0    0  0 0    0  0
// 000  0    0  0 0    0000
// 0    0  0 0  0 0    0  0
// 0     00   00  0000 0  0

// PCULA

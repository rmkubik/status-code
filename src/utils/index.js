const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const updateArray = (array, index, updater) => [
  ...array.slice(0, index),
  updater(array[index]),
  ...array.slice(index + 1),
];

const isUnitHeadAtLocation = (unit, [row, col]) =>
  unit.tiles[0][0] === row && unit.tiles[0][1] === col;

const isUnitAtLocation = (unit, [row, col]) =>
  unit.tiles.some((tile) => tile[0] === row && tile[1] === col);

const findUnitAtLocation = (units, location) =>
  units.find((unit) => isUnitAtLocation(unit, location));

const findUnitIndexAtLocation = (units, location) =>
  units.findIndex((unit) => isUnitAtLocation(unit, location));

const isLocationInBounds = (tiles, location) =>
  location[0] >= 0 &&
  location[1] >= 0 &&
  location[0] < tiles.length &&
  location[1] < tiles[0].length;

const getNeighborLocations = (tiles, location) => {
  return [
    [location[0] - 1, location[1]],
    [location[0] + 1, location[1]],
    [location[0], location[1] - 1],
    [location[0], location[1] + 1],
  ].filter((neighbor) => isLocationInBounds(tiles, neighbor));
};

const getNeighbors = getNeighborLocations;

// get array of locations in diamond around location where radius of diamond === magnitude
const getLocationsInArea = (tiles, location, magnitude) => {
  const locations = [];

  for (let m = 1; m <= magnitude; m++) {
    locations.push(
      [location[0] - m, location[1]],
      [location[0] + m, location[1]],
      [location[0], location[1] - m],
      [location[0], location[1] + m]
    );
  }

  return locations.filter((inAreaLocation) =>
    isLocationInBounds(tiles, inAreaLocation)
  );
};

const getLocationsInDiamond = (tiles, location, magnitude) => {
  const locations = [];

  // get a triangle from top to bottom
  // then stack another triangle upsidedown underneath it
  // height of each triangle === magnitude

  for (let depth = 0; depth <= magnitude; depth++) {
    // top of diamond
    locations.push([location[0] + (-magnitude + depth), location[1]]);
    // bottom of diamond
    locations.push([location[0] + (magnitude - depth), location[1]]);

    if (depth === 0) {
      // only add additional columns after the peak
      continue;
    }

    for (let layerWidth = 1; layerWidth <= depth; layerWidth++) {
      // top rows of diamond
      locations.push(
        [location[0] + (-magnitude + depth), location[1] + layerWidth],
        [location[0] + (-magnitude + depth), location[1] - layerWidth]
      );
      //bottom rows of diamond
      locations.push(
        [location[0] + (magnitude - depth), location[1] + layerWidth],
        [location[0] + (magnitude - depth), location[1] - layerWidth]
      );
    }
  }

  return locations.filter((inAreaLocation) =>
    isLocationInBounds(tiles, inAreaLocation)
  );
};

const getLocationsInSquare = (tiles, location, magnitude) => {
  const locations = [];

  for (let rowAdjust = 0; rowAdjust <= magnitude; rowAdjust++) {
    for (let colAdjust = 0; colAdjust <= magnitude; colAdjust++) {
      locations.push(
        [location[0] - rowAdjust, location[1] + colAdjust],
        [location[0] + rowAdjust, location[1] + colAdjust],
        [location[0] + rowAdjust, location[1] - colAdjust],
        [location[0] - rowAdjust, location[1] - colAdjust]
      );
    }
  }

  return locations.filter((inAreaLocation) =>
    isLocationInBounds(tiles, inAreaLocation)
  );
};

function findAllIndices(array, comparator) {
  const indices = [];

  for (let i = 0; i < array.length; i = +1) {
    if (comparator(array[i], i, array)) {
      indexes.push(i);
    }
  }

  return indices;
}

const manhattanDistance = (a, b) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

function pickRandomlyFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getAllLocations(tiles) {
  const locations = [];

  tiles.forEach((row, rowIndex) =>
    row.forEach((col, colIndex) => {
      locations.push([rowIndex, colIndex]);
    })
  );

  return locations;
}

export {
  deepClone,
  updateArray,
  isUnitHeadAtLocation,
  isUnitAtLocation,
  findUnitAtLocation,
  findUnitIndexAtLocation,
  isLocationInBounds,
  getNeighbors,
  getNeighborLocations,
  findAllIndices,
  manhattanDistance,
  pickRandomlyFromArray,
  getLocationsInArea,
  getLocationsInDiamond,
  getLocationsInSquare,
  getAllLocations,
};

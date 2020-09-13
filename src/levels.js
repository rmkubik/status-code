import levels from "../assets/levels/*.txt";

const parse = (level) => {
  const lines = level.split("\n");
  const icon = lines[1].split(" ");
  const units = [];
  const tiles = lines.slice(2).map((row, rowIndex) =>
    row.split("").map((char, colIndex) => {
      switch (char) {
        case "h":
          units.push({
            icon: [0, 1],
            bg: "#5454ff",
            name: "HACK.slsh",
            size: 4,
            abilities: ["hack"],
            moves: [2, 2],
            ap: [1, 1],
            owner: 0,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "x":
          units.push({
            icon: [0, 2],
            bg: "#ff5454",
            name: "GUARD_AV",
            size: 3,
            abilities: ["bash"],
            moves: [1, 1],
            ap: [1, 1],
            owner: 1,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "X":
          units.push({
            icon: [3, 2],
            bg: "#ff5454",
            name: "GUARD_AV++",
            size: 4,
            abilities: ["bash"],
            moves: [2, 2],
            ap: [1, 1],
            owner: 1,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "f":
          units.push({
            icon: [2, 0],
            bg: "#ff5454",
            name: "FIREWALL",
            size: 10,
            abilities: ["bash"],
            moves: [3, 3],
            ap: [1, 1],
            owner: 1,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "t":
          units.push({
            icon: [1, 0],
            bg: "#ff5454",
            name: "TRASH",
            size: 3,
            abilities: ["empty"],
            moves: [2, 2],
            ap: [1, 1],
            owner: 1,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "p":
          units.push({
            icon: [2, 3],
            bg: "#5454ff",
            name: "PING",
            size: 3,
            abilities: ["ping"],
            moves: [1, 1],
            ap: [1, 1],
            owner: 0,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "s":
          units.push({
            icon: [1, 4],
            bg: "#5454ff",
            name: "SLING",
            size: 2,
            abilities: ["sling"],
            moves: [1, 1],
            ap: [1, 1],
            owner: 0,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "e":
          units.push({
            icon: [2, 1],
            bg: "#ff5454",
            name: "SENTRY",
            size: 1,
            abilities: ["peek"],
            moves: [0, 0],
            ap: [1, 1],
            owner: 1,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "d":
          units.push({
            icon: [3, 1],
            bg: "#ff5454",
            name: "DUD",
            size: 1,
            abilities: ["sputter"],
            moves: [0, 0],
            ap: [1, 1],
            owner: 1,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "m":
          units.push({
            icon: [1, 2],
            bg: "#ff5454",
            name: "PHISHER",
            size: 2,
            abilities: ["spam"],
            moves: [2, 2],
            ap: [1, 1],
            owner: 1,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "u":
          units.push({
            icon: [2, 2],
            bg: "#ff5454",
            name: "CURSOR",
            size: 1,
            abilities: ["click"],
            moves: [0, 0],
            ap: [1, 1],
            owner: 1,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "w":
          units.push({
            icon: [3, 3],
            bg: "#ff5454",
            name: "TRIP_WIRE",
            size: 1,
            abilities: ["beam"],
            moves: [0, 0],
            ap: [1, 1],
            owner: 1,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "b":
          units.push({
            icon: [2, 4],
            bg: "#5454ff",
            name: "BLITZ",
            size: 2,
            abilities: ["sting"],
            moves: [3, 3],
            ap: [1, 1],
            owner: 0,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "y":
          units.push({
            icon: [1, 3],
            bg: "#5454ff",
            name: "SPACE_SVR",
            size: 8,
            abilities: ["flop"],
            moves: [3, 3],
            ap: [1, 1],
            owner: 0,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        case "z":
          units.push({
            icon: [3, 0],
            bg: "#ff5454",
            name: "BOSS",
            size: 6,
            abilities: ["veto"],
            moves: [2, 2],
            ap: [1, 1],
            owner: 1,
            tiles: [[rowIndex, colIndex]],
            animation: {},
          });
          break;
        default:
          break;
      }

      return undefined;
    })
  );

  return {
    name: lines[0],
    icon,
    tiles,
    units,
  };
};

export default Object.entries(levels)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([_, level]) => parse(level));

import level1 from "../assets/level1.txt";
import level2 from "../assets/level2.txt";
import level3 from "../assets/level3.txt";

const parse = (level) => {
  const lines = level.split("\n");
  const icon = lines[1].split(" ");
  const units = [];
  const tiles = lines.slice(2).map((row, rowIndex) =>
    row.split(" ").map((char, colIndex) => {
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
            icon: [2, 5],
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
            icon: [0, 6],
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
            icon: [0, 9],
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
            size: 3,
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
            icon: [1, 6],
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
            icon: [1, 7],
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

export default [parse(level1), parse(level2), parse(level3)];

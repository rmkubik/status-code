import movesData from "../assets/moves.txt";

const moves = {};

movesData.split("\n").forEach((line) => {
  const [key, power, area] = line.split(" ");

  moves[key] = { key, power: parseInt(power), area };
});

export default moves;

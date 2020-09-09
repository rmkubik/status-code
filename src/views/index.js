import h from "../hyperapp-jsx";

import Main from "./main";
import Intro from "./intro";
import Map from "./map";
import Connection from "./connection";
import Battle from "./battle";

const views = {
  main: Main,
  intro: Intro,
  map: Map,
  connection: Connection,
  battle: Battle,
};

export { views };

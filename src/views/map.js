import h from "../hyperapp-jsx";

import tileSheet from "../../assets/tiles.png";

import { Server } from "../components";

const StartConnection = (state, index) => {
  return {
    ...state,
    connection: {
      ...state.connection,
      serverIndex: index,
    },
    view: "connection",
  };
};

const Map = ({ map: { servers } }) => {
  return (
    <main>
      <p>--- The Cloud -----------------------[x]---</p>
      <div class="map">
        {servers.map((server, index) => (
          <Server
            sheet={tileSheet}
            icon={server.icon}
            label={"#" + (index + 1) + " " + server.name}
            statusCode={server.statusCode}
            onclick={(state) => StartConnection(state, index)}
          />
        ))}
      </div>
      <p>Click a server to attempt to establish a connection...</p>
    </main>
  );
};

export default Map;

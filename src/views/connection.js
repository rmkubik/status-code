import h from "../hyperapp-jsx";

import { deepClone } from "../utils";

const StartBattle = (state, index) => {
  return {
    ...state,
    connection: {
      ...state.connection,
      step: 0,
    },
    map: {
      ...state.map,
      selected: index,
    },
    battle: {
      ...state.battle,
      tiles: deepClone(state.map.servers[index].tiles),
      units: deepClone(state.map.servers[index].units),
    },
    view: "battle",
  };
};

const AdvanceStep = (state, event, finalStep) => {
  const step = state.connection.step + 1;

  if (step === finalStep) {
    return StartBattle(state, state.connection.serverIndex);
  }

  return {
    ...state,
    connection: {
      ...state.connection,
      // prevent step from exceeding the finalStep
      step: Math.min(step, finalStep),
    },
  };
};

const Connection = ({
  map: { servers },
  connection: { step, serverIndex },
}) => {
  const { name } = servers[serverIndex];

  const steps = [
    <p className="animated flash" style={{ opacity: 0 }}>
      Establishing connection to {name}....
    </p>,
    <p className="animated flash" style={{ opacity: 0, color: "red" }}>
      WARNING - Shield OS has detected hostile connection attempt. Deploying
      virus control programs.
    </p>,
  ];

  return (
    <main onclick={(state, event) => AdvanceStep(state, event, steps.length)}>
      {steps.slice(0, step + 1)}
      <p className="" style={{ opacity: 1 }}>
        Click anywhere to{" "}
        {step === steps.length - 1
          ? "HACK past the rogue virus control programs"
          : "continue"}
        ... <span class="flash animated infinite">|</span>
      </p>
    </main>
  );
};

export default Connection;

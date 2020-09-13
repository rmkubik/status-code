import h from "../hyperapp-jsx";

const AdvanceStep = (state, event, finalStep) => {
  const step = state.intro.step + 1;

  if (step === finalStep) {
    return {
      ...state,
      view: "map",
    };
  }

  return {
    ...state,
    intro: {
      // prevent step from exceeding the finalStep
      step: Math.min(step, finalStep),
    },
  };
};

const Intro = ({ intro: { step } }) => {
  const steps = [
    <p className="animated flash" style={{ opacity: 0 }}>
      Your machine is connected to The Cloud, a system of interconnected servers
      that speak with each other.
    </p>,

    <p className="animated flash" style={{ opacity: 0 }}>
      Normally, users of The Cloud are free to visit any server they wish but
      something has gone wrong.
    </p>,

    <p className="animated flash" style={{ opacity: 0 }}>
      The servers' antivirus software has gone rogue and is preventing
      connection attempts by responding erroneously with a{" "}
      <span style={{ color: "red" }}>404 Not Found</span>.
    </p>,

    <p className="animated flash" style={{ opacity: 0 }}>
      Attempt to establish a connection to these servers, eradicate the rogue
      programs, and return them to the network with a{" "}
      <span style={{ color: "green" }}>200 OK</span> status.
    </p>,
  ];

  return (
    <main onclick={(state, event) => AdvanceStep(state, event, steps.length)}>
      {steps.slice(0, step + 1)}
      <p className="" style={{ opacity: 1 }}>
        Click anywhere to{" "}
        {step === steps.length - 1 ? (
          <span class="flash animated" style={{ animationDelay: "750ms" }}>
            START
          </span>
        ) : (
          "continue"
        )}
        ... <span class="flash animated infinite">|</span>
      </p>
    </main>
  );
};

export default Intro;

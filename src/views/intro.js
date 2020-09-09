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
      Many of the servers that should be working are responding with 404 Not
      Found.
    </p>,

    <p className="animated flash" style={{ opacity: 0 }}>
      Attempt to establish a connection to these servers and return them to the
      network (200 OK).
    </p>,
  ];

  return (
    <main onclick={(state, event) => AdvanceStep(state, event, steps.length)}>
      {steps.slice(0, step + 1)}
      <p className="" style={{ opacity: 1 }}>
        Press any key to{" "}
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

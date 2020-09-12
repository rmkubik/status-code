import { app } from "hyperapp";
import h from "./hyperapp-jsx";

import "./main.scss";

import { views } from "./views";
import levels from "./levels";
import moves from "./moves";

const onDomEvent = (eventType) =>
  (() => {
    const subFn = (dispatch, options) => {
      const onEventFn = (event) => {
        dispatch(options.action, event);
      };

      document.addEventListener(eventType, onEventFn);

      return () => document.removeEventListener(eventType, onEventFn);
    };
    return (action) => [subFn, { action }];
  })();

const onClick = onDomEvent("click");

const onKeyDown = onDomEvent("keydown");

const Click = (state, event) => {
  if (state.view === "main") {
    return {
      ...state,
      view: "intro",
    };
  }
};

const App = (state) => {
  const { view = "main", ...rest } = state;

  console.log(state);

  const CurrentView = views[view];

  return <CurrentView {...rest} />;
};

app({
  init: {
    view: "main",
    map: {
      servers: levels.map((level) => ({ ...level, statusCode: 404 })),
      selected: -1,
    },
    battle: {
      tiles: [[]],
      selected: [],
      units: [],
      selectedAction: -1,
      turn: 0,
    },
    intro: {
      step: 0,
    },
    connection: {
      step: 0,
    },
    moves,
  },
  view: App,
  node: document.getElementById("app"),
  subscriptions: (state) => [
    state.view === "main" && onClick(Click),
    // state.view === "main" && onKeyDown(Click),
  ],
});

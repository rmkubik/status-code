import { h, text } from "hyperapp";

export default (type, props, ...children) =>
  typeof type === "function"
    ? type(props, children)
    : h(
        type,
        props || {},
        []
          .concat(...children)
          .map((any) =>
            typeof any === "string" || typeof any === "number" ? text(any) : any
          )
      );

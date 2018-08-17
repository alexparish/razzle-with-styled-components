import React from "react";
import { render } from "react-dom";
import App from "./App";

// no hydrate function in preact
render(<App />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}

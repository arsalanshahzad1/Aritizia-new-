import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { hydrate, render } from "react-dom";
// import Connector from "./connector";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//     {/* <Connector /> */}
//   </React.StrictMode>
// );

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { hydrate, render } from "react-dom";
import { StoreProvider } from "./Context/Store";
import { ToastContainer } from "react-toastify";
// import Connector from "./connector";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <StoreProvider>
    <App />
    <ToastContainer />
  </StoreProvider>
  // </React.StrictMode>
);


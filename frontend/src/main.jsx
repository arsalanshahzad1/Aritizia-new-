import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { hydrate, render } from "react-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./redux/store";
// import Connector from "./connector";

import { Provider } from "react-redux";
let persistor = persistStore(store);
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
<Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <App />
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);


// const rootElement = document.getElementById("root");
// if (rootElement.hasChildNodes()) {
//   hydrate(<App />, rootElement);
// } else {
//   render(<App />, rootElement);
// }

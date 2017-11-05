import React from "react";
import ReactDOM from "react-dom";
import App from "../src/App.js";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { BrowserRouter } from "react-router-dom";
import { AppContainer } from "react-hot-loader";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore((state = {}, action) => state, composeEnhancers());

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById("root")
  );
};

document.addEventListener("DOMContentLoaded", event => {
  render(App);
});

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("../src/App.js", () => {
    const NextApp = require("../src/App.js").default;
    render(NextApp);
  });
}

const socket = new WebSocket("wss://" + window.location.host);
socket.onopen = () => {
  console.log("connected to startd server");
};
socket.onmessage = e => {
  console.log(e);
};

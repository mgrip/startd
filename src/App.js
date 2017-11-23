// @flow

import React from "react";
import { Provider, connect } from "react-redux";
import theme from "./theme";
import { ThemeProvider } from "styled-components";

const App = () => (
  <ThemeProvider theme={theme}>
    <div>Lets get startd.</div>
  </ThemeProvider>
);
export default App;

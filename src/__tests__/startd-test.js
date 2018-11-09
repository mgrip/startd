// @flow strict

import Startd from "../startd";

test("startd should correctly generate a webpack config from an input path", () => {
  const startd = new Startd("TEST_APP");
  expect(startd.webpackConfig).toMatchSnapshot();
  const startdWithMiddleware = new Startd("TEST_APP", "TEST_MIDDLEWARE");
  expect(startdWithMiddleware.webpackConfig).toMatchSnapshot();
});

// @flow strict

import Startd from "../startd";
jest.mock("../dirname");

test("startd should correctly generate a webpack config from an input path", () => {
  const startd = new Startd("TEST_APP", false);
  expect(startd.webpackConfig).toMatchSnapshot();
  const startdWithMiddleware = new Startd("TEST_APP", false, "TEST_MIDDLEWARE");
  expect(startdWithMiddleware.webpackConfig).toMatchSnapshot();
});

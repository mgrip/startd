"use strict";

var _startd = _interopRequireDefault(require("../startd"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  strict
test("startd should correctly generate a webpack config from an input path", () => {
  const startd = new _startd.default("TEST_APP");
  expect(startd.webpackConfig).toMatchSnapshot();
  const startdWithMiddleware = new _startd.default("TEST_APP", "TEST_MIDDLEWARE");
  expect(startdWithMiddleware.webpackConfig).toMatchSnapshot();
});
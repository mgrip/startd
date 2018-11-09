"use strict";

const ignorePatterns = [
  "node_modules",
  "flow-typed",
  "lib",
  "app.bundle.js",
  "server.bundle.js"
];

module.exports = {
  projects: [
    {
      displayName: "test",
      testMatch: ["<rootDir>/**/__tests__/**/*.js"],
      testPathIgnorePatterns: ignorePatterns
    },
    {
      runner: "jest-runner-flowtype",
      displayName: "flow",
      testMatch: ["<rootDir>/**/*.js"],
      testPathIgnorePatterns: ignorePatterns
    },
    {
      runner: "jest-runner-eslint",
      displayName: "lint",
      testMatch: ["<rootDir>/**/*.js"],
      testPathIgnorePatterns: ignorePatterns
    }
  ]
};

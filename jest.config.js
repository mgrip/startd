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
      displayName: "tests",
      testMatch: ["<rootDir>/**/__tests__/**/*.(js|ts|tsx)"],
      testPathIgnorePatterns: ignorePatterns
    },
    {
      runner: "jest-runner-eslint",
      displayName: "eslint",
      testMatch: ["<rootDir>/**/*.(js|ts|tsx)"],
      testPathIgnorePatterns: ignorePatterns
    }
  ]
};

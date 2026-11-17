/** @type {import('jest').Config} */
module.exports = {
  verbose: !!process.env.VERBOSE,
  moduleNameMapper: {
    "^testHelpers$": "<rootDir>/testHelpers/index.js",
  },
  setupFilesAfterEnv: [
    "<rootDir>/testHelpers/setup.js",
    "<rootDir>/testHelpers/preload_protocol.mjs",
  ],
  testPathIgnorePatterns: ["/node_modules/"],
  testEnvironment: "node",
  testRegex: "(/__tests__/.*\\.spec|(\\.|/)spec)\\.(?:[cm]?js|jsx)$",
  transform: {},
  reporters: ["default", "jest-junit"],
  bail: false,
  testTimeout: 90000,
  injectGlobals: false,
};

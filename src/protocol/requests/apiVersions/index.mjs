import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const logResponseError = false;

const versions = {
  0: () => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return { request: request(), response, logResponseError: true };
  },
  1: () => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return { request: request(), response, logResponseError };
  },
  2: () => {
    const request = require("./v2/request.mjs").default;
    const response = require("./v2/response.mjs").default;
    return { request: request(), response, logResponseError };
  },
};

const indexProtocol = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
};

export default indexProtocol;

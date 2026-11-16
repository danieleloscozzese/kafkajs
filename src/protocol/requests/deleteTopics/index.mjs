import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const versions = {
  0: ({ topics, timeout }) => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return { request: request({ topics, timeout }), response };
  },
  1: ({ topics, timeout }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return { request: request({ topics, timeout }), response };
  },
};

const indexProtocol = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
};

export default indexProtocol;

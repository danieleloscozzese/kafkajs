import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const versions = {
  1: ({ groupId, topics }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return { request: request({ groupId, topics }), response };
  },
  2: ({ groupId, topics }) => {
    const request = require("./v2/request.mjs").default;
    const response = require("./v2/response.mjs").default;
    return { request: request({ groupId, topics }), response };
  },
  3: ({ groupId, topics }) => {
    const request = require("./v3/request.mjs").default;
    const response = require("./v3/response.mjs").default;
    return { request: request({ groupId, topics }), response };
  },
  4: ({ groupId, topics }) => {
    const request = require("./v4/request.mjs").default;
    const response = require("./v4/response.mjs").default;
    return { request: request({ groupId, topics }), response };
  },
};

const indexProtocol = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
};

export default indexProtocol;

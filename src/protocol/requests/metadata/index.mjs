import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const versions = {
  0: ({ topics }) => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return { request: request({ topics }), response };
  },
  1: ({ topics }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return { request: request({ topics }), response };
  },
  2: ({ topics }) => {
    const request = require("./v2/request.mjs").default;
    const response = require("./v2/response.mjs").default;
    return { request: request({ topics }), response };
  },
  3: ({ topics }) => {
    const request = require("./v3/request.mjs").default;
    const response = require("./v3/response.mjs").default;
    return { request: request({ topics }), response };
  },
  4: ({ topics, allowAutoTopicCreation }) => {
    const request = require("./v4/request.mjs").default;
    const response = require("./v4/response.mjs").default;
    return { request: request({ topics, allowAutoTopicCreation }), response };
  },
  5: ({ topics, allowAutoTopicCreation }) => {
    const request = require("./v5/request.mjs").default;
    const response = require("./v5/response.mjs").default;
    return { request: request({ topics, allowAutoTopicCreation }), response };
  },
  6: ({ topics, allowAutoTopicCreation }) => {
    const request = require("./v6/request.mjs").default;
    const response = require("./v6/response.mjs").default;
    return { request: request({ topics, allowAutoTopicCreation }), response };
  },
};

const indexProtocol = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
};

export default indexProtocol;

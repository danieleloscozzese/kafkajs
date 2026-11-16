import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const versions = {
  0: ({ groupId, memberId }) => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return {
      request: request({ groupId, memberId }),
      response,
    };
  },
  1: ({ groupId, memberId }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return {
      request: request({ groupId, memberId }),
      response,
    };
  },
  2: ({ groupId, memberId }) => {
    const request = require("./v2/request.mjs").default;
    const response = require("./v2/response.mjs").default;
    return {
      request: request({ groupId, memberId }),
      response,
    };
  },
  3: ({ groupId, memberId, groupInstanceId }) => {
    const request = require("./v3/request.mjs").default;
    const response = require("./v3/response.mjs").default;
    return {
      request: request({ groupId, members: [{ memberId, groupInstanceId }] }),
      response,
    };
  },
};

const indexProtocol = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
};

export default indexProtocol;

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const versions = {
  0: ({ groupId, generationId, memberId, groupAssignment }) => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return {
      request: request({ groupId, generationId, memberId, groupAssignment }),
      response,
    };
  },
  1: ({ groupId, generationId, memberId, groupAssignment }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return {
      request: request({ groupId, generationId, memberId, groupAssignment }),
      response,
    };
  },
  2: ({ groupId, generationId, memberId, groupAssignment }) => {
    const request = require("./v2/request.mjs").default;
    const response = require("./v2/response.mjs").default;
    return {
      request: request({ groupId, generationId, memberId, groupAssignment }),
      response,
    };
  },
  3: ({ groupId, generationId, memberId, groupInstanceId, groupAssignment }) => {
    const request = require("./v3/request.mjs").default;
    const response = require("./v3/response.mjs").default;
    return {
      request: request({ groupId, generationId, memberId, groupInstanceId, groupAssignment }),
      response,
    };
  },
};

const indexProtocol = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
};

export default indexProtocol;

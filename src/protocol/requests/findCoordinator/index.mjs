import { createRequire } from "node:module";
import COORDINATOR_TYPES from "../../coordinator_types.mjs";
const require = createRequire(import.meta.url);
const versions = {
  0: ({ groupId }) => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return { request: request({ groupId }), response };
  },
  1: ({ groupId, coordinatorType = COORDINATOR_TYPES.GROUP }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return { request: request({ coordinatorKey: groupId, coordinatorType }), response };
  },
  2: ({ groupId, coordinatorType = COORDINATOR_TYPES.GROUP }) => {
    const request = require("./v2/request.mjs").default;
    const response = require("./v2/response.mjs").default;
    return { request: request({ coordinatorKey: groupId, coordinatorType }), response };
  },
};

const indexProtocol = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
};

export default indexProtocol;

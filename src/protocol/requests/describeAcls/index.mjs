import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const versions = {
  0: ({ resourceType, resourceName, principal, host, operation, permissionType }) => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return {
      request: request({ resourceType, resourceName, principal, host, operation, permissionType }),
      response,
    };
  },
  1: ({
    resourceType,
    resourceName,
    resourcePatternType,
    principal,
    host,
    operation,
    permissionType,
  }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return {
      request: request({
        resourceType,
        resourceName,
        resourcePatternType,
        principal,
        host,
        operation,
        permissionType,
      }),
      response,
    };
  },
};

const indexProtocol = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
};

export default indexProtocol;

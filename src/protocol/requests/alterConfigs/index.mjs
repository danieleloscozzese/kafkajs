import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const versions = {
  0: ({ resources, validateOnly }) => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return { request: request({ resources, validateOnly }), response };
  },
  1: ({ resources, validateOnly }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return { request: request({ resources, validateOnly }), response };
  },
};

const indexProtocol = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
};

export default indexProtocol;

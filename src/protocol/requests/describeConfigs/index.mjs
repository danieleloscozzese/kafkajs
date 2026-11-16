import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const versions = {
  0: ({ resources }) => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return { request: request({ resources }), response };
  },
  1: ({ resources, includeSynonyms }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return { request: request({ resources, includeSynonyms }), response };
  },
  2: ({ resources, includeSynonyms }) => {
    const request = require("./v2/request.mjs").default;
    const response = require("./v2/response.mjs").default;
    return { request: request({ resources, includeSynonyms }), response };
  },
};

const indexProtocol = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
};

export default indexProtocol;

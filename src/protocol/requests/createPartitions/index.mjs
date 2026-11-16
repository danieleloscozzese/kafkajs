import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const versions = {
  0: ({ topicPartitions, timeout, validateOnly }) => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return { request: request({ topicPartitions, timeout, validateOnly }), response };
  },
  1: ({ topicPartitions, validateOnly, timeout }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return { request: request({ topicPartitions, validateOnly, timeout }), response };
  },
};

const indexProtocol = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
};

export default indexProtocol;

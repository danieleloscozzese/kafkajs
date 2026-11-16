import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
// This value signals to the broker that its default configuration should be used.
const RETENTION_TIME = -1;

const versions = {
  0: ({ groupId, topics }) => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return { request: request({ groupId, topics }), response };
  },
  1: ({ groupId, groupGenerationId, memberId, topics }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return { request: request({ groupId, groupGenerationId, memberId, topics }), response };
  },
  2: ({ groupId, groupGenerationId, memberId, retentionTime = RETENTION_TIME, topics }) => {
    const request = require("./v2/request.mjs").default;
    const response = require("./v2/response.mjs").default;
    return {
      request: request({
        groupId,
        groupGenerationId,
        memberId,
        retentionTime,
        topics,
      }),
      response,
    };
  },
  3: ({ groupId, groupGenerationId, memberId, retentionTime = RETENTION_TIME, topics }) => {
    const request = require("./v3/request.mjs").default;
    const response = require("./v3/response.mjs").default;
    return {
      request: request({
        groupId,
        groupGenerationId,
        memberId,
        retentionTime,
        topics,
      }),
      response,
    };
  },
  4: ({ groupId, groupGenerationId, memberId, retentionTime = RETENTION_TIME, topics }) => {
    const request = require("./v4/request.mjs").default;
    const response = require("./v4/response.mjs").default;
    return {
      request: request({
        groupId,
        groupGenerationId,
        memberId,
        retentionTime,
        topics,
      }),
      response,
    };
  },
  5: ({ groupId, groupGenerationId, memberId, topics }) => {
    const request = require("./v5/request.mjs").default;
    const response = require("./v5/response.mjs").default;
    return {
      request: request({
        groupId,
        groupGenerationId,
        memberId,
        topics,
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

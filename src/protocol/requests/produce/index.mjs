import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const versions = {
  0: ({ acks, timeout, topicData }) => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return { request: request({ acks, timeout, topicData }), response };
  },
  1: ({ acks, timeout, topicData }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return { request: request({ acks, timeout, topicData }), response };
  },
  2: ({ acks, timeout, topicData, compression }) => {
    const request = require("./v2/request.mjs").default;
    const response = require("./v2/response.mjs").default;
    return { request: request({ acks, timeout, compression, topicData }), response };
  },
  3: ({ acks, timeout, compression, topicData, transactionalId, producerId, producerEpoch }) => {
    const request = require("./v3/request.mjs").default;
    const response = require("./v3/response.mjs").default;
    return {
      request: request({
        acks,
        timeout,
        compression,
        topicData,
        transactionalId,
        producerId,
        producerEpoch,
      }),
      response,
    };
  },
  4: ({ acks, timeout, compression, topicData, transactionalId, producerId, producerEpoch }) => {
    const request = require("./v4/request.mjs").default;
    const response = require("./v4/response.mjs").default;
    return {
      request: request({
        acks,
        timeout,
        compression,
        topicData,
        transactionalId,
        producerId,
        producerEpoch,
      }),
      response,
    };
  },
  5: ({ acks, timeout, compression, topicData, transactionalId, producerId, producerEpoch }) => {
    const request = require("./v5/request.mjs").default;
    const response = require("./v5/response.mjs").default;
    return {
      request: request({
        acks,
        timeout,
        compression,
        topicData,
        transactionalId,
        producerId,
        producerEpoch,
      }),
      response,
    };
  },
  6: ({ acks, timeout, compression, topicData, transactionalId, producerId, producerEpoch }) => {
    const request = require("./v6/request.mjs").default;
    const response = require("./v6/response.mjs").default;
    return {
      request: request({
        acks,
        timeout,
        compression,
        topicData,
        transactionalId,
        producerId,
        producerEpoch,
      }),
      response,
    };
  },
  7: ({ acks, timeout, compression, topicData, transactionalId, producerId, producerEpoch }) => {
    const request = require("./v7/request.mjs").default;
    const response = require("./v7/response.mjs").default;
    return {
      request: request({
        acks,
        timeout,
        compression,
        topicData,
        transactionalId,
        producerId,
        producerEpoch,
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

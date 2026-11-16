import { createRequire } from "node:module";
import ISOLATION_LEVEL from "../../isolation_level.mjs";
const require = createRequire(import.meta.url);
// For normal consumers, use -1
const REPLICA_ID = -1;

const versions = {
  0: ({ replicaId = REPLICA_ID, topics }) => {
    const request = require("./v0/request.mjs").default;
    const response = require("./v0/response.mjs").default;
    return { request: request({ replicaId, topics }), response };
  },
  1: ({ replicaId = REPLICA_ID, topics }) => {
    const request = require("./v1/request.mjs").default;
    const response = require("./v1/response.mjs").default;
    return { request: request({ replicaId, topics }), response };
  },
  2: ({ replicaId = REPLICA_ID, isolationLevel = ISOLATION_LEVEL.READ_COMMITTED, topics }) => {
    const request = require("./v2/request.mjs").default;
    const response = require("./v2/response.mjs").default;
    return { request: request({ replicaId, isolationLevel, topics }), response };
  },
  3: ({ replicaId = REPLICA_ID, isolationLevel = ISOLATION_LEVEL.READ_COMMITTED, topics }) => {
    const request = require("./v3/request.mjs").default;
    const response = require("./v3/response.mjs").default;
    return { request: request({ replicaId, isolationLevel, topics }), response };
  },
};

const indexProtocol = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
};

export default indexProtocol;

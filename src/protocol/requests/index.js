const apiKeys = require("./api_keys.mjs").default;
const { KafkaJSServerDoesNotSupportApiKey, KafkaJSNotImplemented } = require("../../errors.mjs").default;

/**
 * @typedef {(options?: Object) => { request: any, response: any, logResponseErrors?: boolean }} Request
 */

/**
 * @typedef {Object} RequestDefinitions
 * @property {string[]} versions
 * @property {({ version: number }) => Request} protocol
 */

/**
 * @typedef {(apiKey: number, definitions: RequestDefinitions) => Request} Lookup
 */

/** @type {RequestDefinitions} */
const noImplementedRequestDefinitions = {
  versions: [],
  protocol: () => {
    throw new KafkaJSNotImplemented();
  },
};

/**
 * @type {{[apiName: string]: RequestDefinitions}}
 */
const requests = {
  Produce: require("./produce/index.mjs").default,
  Fetch: require("./fetch/index.mjs").default,
  ListOffsets: require("./listOffsets/index.mjs").default,
  Metadata: require("./metadata/index.mjs").default,
  LeaderAndIsr: noImplementedRequestDefinitions,
  StopReplica: noImplementedRequestDefinitions,
  UpdateMetadata: noImplementedRequestDefinitions,
  ControlledShutdown: noImplementedRequestDefinitions,
  OffsetCommit: require("./offsetCommit/index.mjs").default,
  OffsetFetch: require("./offsetFetch/index.mjs").default,
  GroupCoordinator: require("./findCoordinator/index.mjs").default,
  JoinGroup: require("./joinGroup/index.mjs").default,
  Heartbeat: require("./heartbeat/index.mjs").default,
  LeaveGroup: require("./leaveGroup/index.mjs").default,
  SyncGroup: require("./syncGroup/index.mjs").default,
  DescribeGroups: require("./describeGroups"),
  ListGroups: require("./listGroups"),
  SaslHandshake: require("./saslHandshake"),
  ApiVersions: require("./apiVersions/index.mjs").default,
  CreateTopics: require("./createTopics/index.mjs").default,
  DeleteTopics: require("./deleteTopics/index.mjs").default,
  DeleteRecords: require("./deleteRecords/index.mjs").default,
  InitProducerId: require("./initProducerId/index.mjs").default,
  OffsetForLeaderEpoch: noImplementedRequestDefinitions,
  AddPartitionsToTxn: require("./addPartitionsToTxn/index.mjs").default,
  AddOffsetsToTxn: require("./addOffsetsToTxn/index.mjs").default,
  EndTxn: require("./endTxn/index.mjs").default,
  WriteTxnMarkers: noImplementedRequestDefinitions,
  TxnOffsetCommit: require("./txnOffsetCommit/index.mjs").default,
  DescribeAcls: require("./describeAcls"),
  CreateAcls: require("./createAcls"),
  DeleteAcls: require("./deleteAcls"),
  DescribeConfigs: require("./describeConfigs/index.mjs").default,
  AlterConfigs: require("./alterConfigs/index.mjs").default,
  AlterReplicaLogDirs: noImplementedRequestDefinitions,
  DescribeLogDirs: noImplementedRequestDefinitions,
  SaslAuthenticate: require("./saslAuthenticate"),
  CreatePartitions: require("./createPartitions/index.mjs").default,
  CreateDelegationToken: noImplementedRequestDefinitions,
  RenewDelegationToken: noImplementedRequestDefinitions,
  ExpireDelegationToken: noImplementedRequestDefinitions,
  DescribeDelegationToken: noImplementedRequestDefinitions,
  DeleteGroups: require("./deleteGroups"),
  ElectLeaders: noImplementedRequestDefinitions,
  IncrementalAlterConfigs: noImplementedRequestDefinitions,
  AlterPartitionReassignments: require("./alterPartitionReassignments/index.mjs").default,
  ListPartitionReassignments: require("./listPartitionReassignments/index.mjs").default,
};

const names = Object.keys(apiKeys);
const keys = Object.values(apiKeys);
const findApiName = (apiKey) => names[keys.indexOf(apiKey)];

/**
 * @param {import("../../../types").ApiVersions} versions
 * @returns {Lookup}
 */
const lookup = (versions) => (apiKey, definition) => {
  const version = versions[apiKey];
  const availableVersions = definition.versions.map(Number);
  const bestImplementedVersion = Math.max(...availableVersions);

  if (!version || version.maxVersion == null) {
    throw new KafkaJSServerDoesNotSupportApiKey(
      `The Kafka server does not support the requested API version`,
      { apiKey, apiName: findApiName(apiKey) },
    );
  }

  const bestSupportedVersion = Math.min(bestImplementedVersion, version.maxVersion);
  return definition.protocol({ version: bestSupportedVersion });
};

module.exports = {
  requests,
  lookup,
};

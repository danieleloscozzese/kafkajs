import apiKeys from "./api_keys.mjs";
import errors from "../../errors.mjs";
import produce from "./produce/index.mjs";
import fetch from "./fetch/index.mjs";
import listOffsets from "./listOffsets/index.mjs";
import metadata from "./metadata/index.mjs";
import offsetCommit from "./offsetCommit/index.mjs";
import offsetFetch from "./offsetFetch/index.mjs";
import findCoordinator from "./findCoordinator/index.mjs";
import joinGroup from "./joinGroup/index.mjs";
import heartbeat from "./heartbeat/index.mjs";
import leaveGroup from "./leaveGroup/index.mjs";
import syncGroup from "./syncGroup/index.mjs";
import describeGroups from "./describeGroups/index.mjs";
import listGroups from "./listGroups/index.mjs";
import saslHandshake from "./saslHandshake/index.mjs";
import apiVersions from "./apiVersions/index.mjs";
import createTopics from "./createTopics/index.mjs";
import deleteTopics from "./deleteTopics/index.mjs";
import deleteRecords from "./deleteRecords/index.mjs";
import initProducerId from "./initProducerId/index.mjs";
import addPartitionsToTxn from "./addPartitionsToTxn/index.mjs";
import addOffsetsToTxn from "./addOffsetsToTxn/index.mjs";
import endTxn from "./endTxn/index.mjs";
import txnOffsetCommit from "./txnOffsetCommit/index.mjs";
import describeAcls from "./describeAcls/index.mjs";
import createAcls from "./createAcls/index.mjs";
import deleteAcls from "./deleteAcls/index.mjs";
import describeConfigs from "./describeConfigs/index.mjs";
import alterConfigs from "./alterConfigs/index.mjs";
import saslAuthenticate from "./saslAuthenticate/index.mjs";
import createPartitions from "./createPartitions/index.mjs";
import deleteGroups from "./deleteGroups/index.mjs";
import alterPartitionReassignments from "./alterPartitionReassignments/index.mjs";
import listPartitionReassignments from "./listPartitionReassignments/index.mjs";
const { KafkaJSServerDoesNotSupportApiKey, KafkaJSNotImplemented } = errors;

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
  Produce: produce,
  Fetch: fetch,
  ListOffsets: listOffsets,
  Metadata: metadata,
  LeaderAndIsr: noImplementedRequestDefinitions,
  StopReplica: noImplementedRequestDefinitions,
  UpdateMetadata: noImplementedRequestDefinitions,
  ControlledShutdown: noImplementedRequestDefinitions,
  OffsetCommit: offsetCommit,
  OffsetFetch: offsetFetch,
  GroupCoordinator: findCoordinator,
  JoinGroup: joinGroup,
  Heartbeat: heartbeat,
  LeaveGroup: leaveGroup,
  SyncGroup: syncGroup,
  DescribeGroups: describeGroups,
  ListGroups: listGroups,
  SaslHandshake: saslHandshake,
  ApiVersions: apiVersions,
  CreateTopics: createTopics,
  DeleteTopics: deleteTopics,
  DeleteRecords: deleteRecords,
  InitProducerId: initProducerId,
  OffsetForLeaderEpoch: noImplementedRequestDefinitions,
  AddPartitionsToTxn: addPartitionsToTxn,
  AddOffsetsToTxn: addOffsetsToTxn,
  EndTxn: endTxn,
  WriteTxnMarkers: noImplementedRequestDefinitions,
  TxnOffsetCommit: txnOffsetCommit,
  DescribeAcls: describeAcls,
  CreateAcls: createAcls,
  DeleteAcls: deleteAcls,
  DescribeConfigs: describeConfigs,
  AlterConfigs: alterConfigs,
  AlterReplicaLogDirs: noImplementedRequestDefinitions,
  DescribeLogDirs: noImplementedRequestDefinitions,
  SaslAuthenticate: saslAuthenticate,
  CreatePartitions: createPartitions,
  CreateDelegationToken: noImplementedRequestDefinitions,
  RenewDelegationToken: noImplementedRequestDefinitions,
  ExpireDelegationToken: noImplementedRequestDefinitions,
  DescribeDelegationToken: noImplementedRequestDefinitions,
  DeleteGroups: deleteGroups,
  ElectLeaders: noImplementedRequestDefinitions,
  IncrementalAlterConfigs: noImplementedRequestDefinitions,
  AlterPartitionReassignments: alterPartitionReassignments,
  ListPartitionReassignments: listPartitionReassignments,
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

const indexProtocol = {
  requests,
  lookup,
};

export default indexProtocol;

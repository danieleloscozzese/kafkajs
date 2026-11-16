import { describe, expect, it } from "@jest/globals";
import { createRequire } from "node:module";
import ApiVersions from "./apiVersions/index.mjs";
import Metadata from "./metadata/index.mjs";
import Produce from "./produce/index.mjs";
import Fetch from "./fetch/index.mjs";
import ListOffsets from "./listOffsets/index.mjs";
import GroupCoordinator from "./findCoordinator/index.mjs";
import JoinGroup from "./joinGroup/index.mjs";
import Heartbeat from "./heartbeat/index.mjs";
import LeaveGroup from "./leaveGroup/index.mjs";
import SyncGroup from "./syncGroup/index.mjs";
import OffsetCommit from "./offsetCommit/index.mjs";
import OffsetFetch from "./offsetFetch/index.mjs";
import InitProducerId from "./initProducerId/index.mjs";
import AddPartitionsToTxn from "./addPartitionsToTxn/index.mjs";
import AddOffsetsToTxn from "./addOffsetsToTxn/index.mjs";
import EndTxn from "./endTxn/index.mjs";
import TxnOffsetCommit from "./txnOffsetCommit/index.mjs";
import CreateTopics from "./createTopics/index.mjs";
import DeleteTopics from "./deleteTopics/index.mjs";
import CreatePartitions from "./createPartitions/index.mjs";
import DeleteRecords from "./deleteRecords/index.mjs";
import DescribeConfigs from "./describeConfigs/index.mjs";
import AlterConfigs from "./alterConfigs/index.mjs";
import AlterPartitionReassignments from "./alterPartitionReassignments/index.mjs";
import ListPartitionReassignments from "./listPartitionReassignments/index.mjs";
import apiKeys from "./api_keys.mjs";

const require = createRequire(import.meta.url);
const { default: requests } = await import("./index.js");

describe("Protocol registries", () => {
  it("shares registry and API-key objects across module formats", () => {
    expect(require("./apiVersions/index.js")).toBe(ApiVersions);
    expect(require("./metadata/index.js")).toBe(Metadata);
    expect(require("./apiKeys.js")).toBe(apiKeys);
    expect(requests.requests.ApiVersions).toBe(ApiVersions);
    expect(requests.requests.Metadata).toBe(Metadata);
    expect(require("./findCoordinator/index.js")).toBe(GroupCoordinator);
    expect(requests.requests.GroupCoordinator).toBe(GroupCoordinator);
    for (const [name, registry] of Object.entries({
      Produce,
      Fetch,
      ListOffsets,
      JoinGroup,
      Heartbeat,
      LeaveGroup,
      SyncGroup,
      OffsetCommit,
      OffsetFetch,
      InitProducerId,
      AddPartitionsToTxn,
      AddOffsetsToTxn,
      EndTxn,
      TxnOffsetCommit,
      CreateTopics,
      DeleteTopics,
      CreatePartitions,
      DeleteRecords,
      DescribeConfigs,
      AlterConfigs,
      AlterPartitionReassignments,
      ListPartitionReassignments,
    })) {
      const directory = name[0].toLowerCase() + name.slice(1);
      expect(require(`./${directory}/index.js`)).toBe(registry);
      expect(requests.requests[name]).toBe(registry);
    }
  });

  it.each([
    [ApiVersions, apiKeys.ApiVersions, ["0", "1", "2"]],
    [Metadata, apiKeys.Metadata, ["0", "1", "2", "3", "4", "5", "6"]],
    [Produce, apiKeys.Produce, ["0", "1", "2", "3", "4", "5", "6", "7"]],
    [Fetch, apiKeys.Fetch, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]],
    [ListOffsets, apiKeys.ListOffsets, ["0", "1", "2", "3"]],
    [GroupCoordinator, apiKeys.GroupCoordinator, ["0", "1", "2"]],
    [JoinGroup, apiKeys.JoinGroup, ["0", "1", "2", "3", "4", "5"]],
    [Heartbeat, apiKeys.Heartbeat, ["0", "1", "2", "3"]],
    [LeaveGroup, apiKeys.LeaveGroup, ["0", "1", "2", "3"]],
    [SyncGroup, apiKeys.SyncGroup, ["0", "1", "2", "3"]],
    [OffsetCommit, apiKeys.OffsetCommit, ["0", "1", "2", "3", "4", "5"]],
    [OffsetFetch, apiKeys.OffsetFetch, ["1", "2", "3", "4"]],
    [InitProducerId, apiKeys.InitProducerId, ["0", "1"]],
    [AddPartitionsToTxn, apiKeys.AddPartitionsToTxn, ["0", "1"]],
    [AddOffsetsToTxn, apiKeys.AddOffsetsToTxn, ["0", "1"]],
    [EndTxn, apiKeys.EndTxn, ["0", "1"]],
    [TxnOffsetCommit, apiKeys.TxnOffsetCommit, ["0", "1"]],
    [CreateTopics, apiKeys.CreateTopics, ["0", "1", "2", "3"]],
    [DeleteTopics, apiKeys.DeleteTopics, ["0", "1"]],
    [CreatePartitions, apiKeys.CreatePartitions, ["0", "1"]],
    [DeleteRecords, apiKeys.DeleteRecords, ["0", "1"]],
    [DescribeConfigs, apiKeys.DescribeConfigs, ["0", "1", "2"]],
    [AlterConfigs, apiKeys.AlterConfigs, ["0", "1"]],
    [AlterPartitionReassignments, apiKeys.AlterPartitionReassignments, ["0"]],
    [ListPartitionReassignments, apiKeys.ListPartitionReassignments, ["0"]],
  ])("returns synchronous factories for each advertised version", (registry, apiKey, versions) => {
    expect(registry.versions).toEqual(versions);
    expect(registry.protocol({ version: 99 })).toBeUndefined();
    for (const version of versions) {
      const protocol = registry.protocol({ version: Number(version) })({ topics: ["test"] });
      expect(protocol.request).toMatchObject({ apiKey, apiVersion: Number(version) });
      expect(typeof protocol.response.decode).toBe("function");
      expect(typeof protocol.response.parse).toBe("function");
      expect(protocol.then).toBeUndefined();
    }
  });

  it.each([0, 1000, Number.MAX_SAFE_INTEGER])(
    "preserves fetch request timeout adjustment for maxWaitTime %s",
    (maxWaitTime) => {
      for (const version of Fetch.versions) {
        const result = Fetch.protocol({ version })({ maxWaitTime, topics: [] });
        const expected = maxWaitTime === Number.MAX_SAFE_INTEGER ? maxWaitTime : maxWaitTime + 100;
        expect(result.requestTimeout).toBe(expected);
      }
    },
  );

  it("negotiates the highest common metadata version", () => {
    const factory = requests.lookup({ [apiKeys.Metadata]: { minVersion: 0, maxVersion: 3 } })(
      apiKeys.Metadata,
      Metadata,
    );
    expect(factory({ topics: ["test"] }).request.apiVersion).toBe(3);
    expect(Metadata.protocol({ version: 99 })).toBeUndefined();
  });

  it.each([0, 1])(
    "keeps delete-record v%s errors scoped to their request offsets",
    async (version) => {
      const offsets = ["42", "9007199254740993"];
      const responses = offsets.map(
        (offset) =>
          DeleteRecords.protocol({ version })({
            topics: [{ topic: "test", partitions: [{ partition: 0, offset }] }],
          }).response,
      );
      expect(responses[0]).not.toBe(responses[1]);
      for (const [index, response] of responses.entries()) {
        await expect(
          response.parse({
            topics: [{ topic: "test", partitions: [{ partition: 0, errorCode: 1 }] }],
          }),
        ).rejects.toMatchObject({
          name: "KafkaJSDeleteTopicRecordsError",
          partitions: [{ partition: 0, offset: offsets[index], error: { code: 1 } }],
        });
      }
    },
  );

  it.each([
    [undefined, 6000],
    [2000, 7000],
    [0, 6000],
    [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  ])(
    "preserves join-group timeout precedence for rebalanceTimeout %s",
    (rebalanceTimeout, expected) => {
      for (const version of JoinGroup.versions) {
        const result = JoinGroup.protocol({ version })({ sessionTimeout: 1000, rebalanceTimeout });
        expect(result.requestTimeout).toBe(version === "0" ? 6000 : expected);
      }
    },
  );

  it.each([
    [undefined, false],
    ["", false],
    ["member", true],
  ])("preserves join-group response logging for member %s", (memberId, expected) => {
    for (const version of [4, 5]) {
      expect(JoinGroup.protocol({ version })({ memberId }).logResponseError).toBe(expected);
    }
  });
});

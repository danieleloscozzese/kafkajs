import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { KafkaJSBrokerNotFound, KafkaJSConnectionError } from "../../errors.mjs";
import COORDINATOR_TYPES from "../../protocol/coordinator_types.mjs";

jest.unstable_mockModule("../../utils/shuffle.mjs", () => ({
  default: jest.fn((brokers) => brokers.sort((a, b) => a > b)),
}));

const { default: Broker } = await import("../../broker/index.mjs");
const { default: helpers } = await import("testHelpers");
const { createCluster, secureRandom } = helpers;

describe("Cluster > findGroupCoordinator", () => {
  let cluster, groupId;

  beforeEach(async () => {
    cluster = createCluster();
    await cluster.connect();
    await cluster.refreshMetadata();
    jest.spyOn(Broker.prototype, "findGroupCoordinator");
    groupId = `test-group-${secureRandom()}`;
  });

  afterEach(async () => {
    cluster && (await cluster.disconnect());
  });

  test("find the group coordinator", async () => {
    const broker = await cluster.findGroupCoordinator({ groupId });

    expect(Broker.prototype.findGroupCoordinator).toHaveBeenCalledWith({
      groupId,
      coordinatorType: COORDINATOR_TYPES.GROUP,
    });
    expect(broker).not.toBeFalsy();
  });

  test("find the coordinator if transactional", async () => {
    const broker = await cluster.findGroupCoordinator({
      groupId,
      coordinatorType: COORDINATOR_TYPES.TRANSACTION,
    });

    expect(Broker.prototype.findGroupCoordinator).toHaveBeenCalledWith({
      groupId,
      coordinatorType: COORDINATOR_TYPES.TRANSACTION,
    });
    expect(broker).not.toBeFalsy();
  });

  test("refresh the metadata and try again in case of broker not found", async () => {
    const firstNodeId = Object.keys(cluster.brokerPool.brokers)[0];
    const firstNode = cluster.brokerPool.brokers[firstNodeId];

    cluster.brokerPool.findBroker = jest
      .fn()
      .mockImplementationOnce(() => {
        throw new KafkaJSBrokerNotFound("Not found");
      })
      .mockImplementation(() => firstNode);

    const coordinator = await cluster.findGroupCoordinator({ groupId });
    expect(coordinator).toEqual(firstNode);
    expect(cluster.brokerPool.findBroker).toHaveBeenCalledTimes(4);
  });

  test("attempt to find coordinator across all brokers until one is found", async () => {
    jest.spyOn(cluster.brokerPool.brokers[0], "findGroupCoordinator").mockImplementation(() => {
      throw new KafkaJSConnectionError("Something went wrong");
    });
    jest.spyOn(cluster.brokerPool.brokers[1], "findGroupCoordinator").mockImplementation(() => {
      throw new KafkaJSConnectionError("Something went wrong");
    });
    jest
      .spyOn(cluster.brokerPool.brokers[2], "findGroupCoordinator")
      .mockImplementation(() => ({ coordinator: { nodeId: 2 } }));

    await expect(cluster.findGroupCoordinator({ groupId })).resolves.toEqual(
      cluster.brokerPool.brokers[2],
    );
  });

  test("retry on ECONNREFUSED", async () => {
    const broker = await cluster.findGroupCoordinator({ groupId });
    await broker.disconnect();

    jest.spyOn(broker, "connect").mockImplementationOnce(() => {
      throw new KafkaJSConnectionError(`Connection error: connect ECONNREFUSED <ip>:<port>`, {
        code: "ECONNREFUSED",
      });
    });

    await expect(cluster.findGroupCoordinator({ groupId })).resolves.toBeTruthy();
  });
});

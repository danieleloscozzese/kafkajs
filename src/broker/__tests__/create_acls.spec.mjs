import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import Broker from "../index.mjs";
import ACL_RESOURCE_TYPES from "../../protocol/acl_resource_types.mjs";
import ACL_OPERATION_TYPES from "../../protocol/acl_operation_types.mjs";
import ACL_PERMISSION_TYPES from "../../protocol/acl_permission_types.mjs";
import RESOURCE_PATTERN_TYPES from "../../protocol/resource_pattern_types.mjs";
const { default: testHelpers } = await import("testHelpers");
const { createConnectionPool, connectionOpts, secureRandom, newLogger } = testHelpers;

describe("Broker > createAcls", () => {
  let seedBroker, broker;

  beforeEach(async () => {
    seedBroker = new Broker({
      connectionPool: createConnectionPool(connectionOpts()),
      logger: newLogger(),
    });
    await seedBroker.connect();

    const metadata = await seedBroker.metadata();
    const newBrokerData = metadata.brokers.find((b) => b.nodeId === metadata.controllerId);

    broker = new Broker({
      connectionPool: createConnectionPool(newBrokerData),
      logger: newLogger(),
    });
  });

  afterEach(async () => {
    seedBroker && (await seedBroker.disconnect());
    broker && (await broker.disconnect());
  });

  test("request", async () => {
    await broker.connect();

    const topicName = `test-topic-${secureRandom()}`;
    const principal = `User:bob-${secureRandom()}`;
    const acl = {
      resourceType: ACL_RESOURCE_TYPES.TOPIC,
      resourceName: topicName,
      resourcePatternType: RESOURCE_PATTERN_TYPES.LITERAL,
      principal,
      host: "*",
      operation: ACL_OPERATION_TYPES.ALL,
      permissionType: ACL_PERMISSION_TYPES.ALLOW,
    };

    const response = await broker.createAcls({ acl: [acl] });

    expect(response).toEqual({
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      creationResponses: [{ errorCode: 0, errorMessage: null }],
    });
  });
});

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import Broker from "../index.mjs";
import COORDINATOR_TYPES from "../../protocol/coordinator_types.mjs";
const { default: testHelpers } = await import("testHelpers");
const { createConnectionPool, newLogger, retryProtocol, secureRandom } = testHelpers;

describe("Broker > InitProducerId", () => {
  let broker, seedBroker, transactionalId;

  beforeEach(async () => {
    transactionalId = `producer-group-id-${secureRandom()}`;

    seedBroker = new Broker({
      connectionPool: createConnectionPool(),
      logger: newLogger(),
    });
    await seedBroker.connect();

    const {
      coordinator: { host, port },
    } = await retryProtocol(
      "GROUP_COORDINATOR_NOT_AVAILABLE",
      async () =>
        await seedBroker.findGroupCoordinator({
          groupId: transactionalId,
          coordinatorType: COORDINATOR_TYPES.TRANSACTION,
        }),
    );

    broker = new Broker({
      connectionPool: createConnectionPool({ host, port }),
      logger: newLogger(),
    });
    await broker.connect();
  });

  afterEach(async () => {
    seedBroker && (await seedBroker.disconnect());
    broker && (await broker.disconnect());
  });

  test("request with transaction id", async () => {
    const response = await broker.initProducerId({
      transactionalId,
      transactionTimeout: 30000,
    });

    expect(response).toEqual({
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      errorCode: 0,
      producerId: expect.stringMatching(/\d+/),
      producerEpoch: expect.any(Number),
    });
  });

  test("request without transaction id", async () => {
    const response = await broker.initProducerId({ transactionTimeout: 30000 });

    expect(response).toEqual({
      clientSideThrottleTime: expect.optional(0),
      throttleTime: 0,
      errorCode: 0,
      producerId: expect.stringMatching(/\d+/),
      producerEpoch: expect.any(Number),
    });
  });
});

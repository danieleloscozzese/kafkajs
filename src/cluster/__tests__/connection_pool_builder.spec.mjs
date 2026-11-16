import { describe, test, expect, beforeEach, it, jest } from "@jest/globals";
import connectionPoolBuilder from "../connection_pool_builder.mjs";
import ConnectionPool from "../../network/connection_pool.mjs";
import errors from "../../errors.mjs";
const { default: testHelpers } = await import("testHelpers");
const { newLogger } = testHelpers;

const { KafkaJSConnectionError, KafkaJSNonRetriableError } = errors;

describe("Cluster > ConnectionBuilder", () => {
  let builder;

  const brokers = ["host.test:7777", "host2.test:7778", "host3.test:7779"];
  const ssl = { ssl: true };
  const sasl = { sasl: true };
  const clientId = "test-client-id";
  const connectionTimeout = 30000;
  const logger = newLogger();
  const socketFactory = jest.fn();

  beforeEach(() => {
    builder = connectionPoolBuilder({
      socketFactory,
      brokers,
      ssl,
      sasl,
      clientId,
      connectionTimeout,
      logger,
    });
  });

  test("creates a new connection from the seed broker list", async () => {
    const connectionPool = await builder.build();
    expect(connectionPool).toBeInstanceOf(ConnectionPool);
    expect(connectionPool.host).toBeOneOf(["host.test", "host2.test", "host3.test"]);
    expect(connectionPool.port).toBeOneOf([7777, 7778, 7779]);
    expect(connectionPool.ssl).toEqual(ssl);
    expect(connectionPool.sasl).toEqual(sasl);
    expect(connectionPool.clientId).toEqual(clientId);
    expect(connectionPool.connectionTimeout).toEqual(connectionTimeout);
    expect(connectionPool.logger).not.toBeFalsy();
    expect(connectionPool.socketFactory).toBe(socketFactory);
  });

  test("rotates through the seed brokers in order and wraps around", async () => {
    const connections = [];
    for (let i = 0; i <= brokers.length; i++) {
      const { host, port } = await builder.build();
      connections.push(`${host}:${port}`);
    }

    expect(connections).toEqual([...brokers, brokers[0]]);
  });

  test("accepts overrides for host, port and rack", async () => {
    const connectionPool = await builder.build({
      host: "host.another",
      port: 8888,
      rack: "rack",
    });
    expect(connectionPool.host).toEqual("host.another");
    expect(connectionPool.port).toEqual(8888);
    expect(connectionPool.rack).toEqual("rack");
  });

  it("throws an exception if brokers list is empty", async () => {
    await expect(
      connectionPoolBuilder({
        socketFactory,
        brokers: [],
        ssl,
        sasl,
        clientId,
        connectionTimeout,
        logger,
      }).build(),
    ).rejects.toEqual(new KafkaJSNonRetriableError("Failed to connect: brokers array is empty"));
  });

  it("throws an exception if brokers is null", async () => {
    await expect(
      connectionPoolBuilder({
        socketFactory,
        brokers: null,
        ssl,
        sasl,
        clientId,
        connectionTimeout,
        logger,
      }).build(),
    ).rejects.toEqual(
      new KafkaJSNonRetriableError("Failed to connect: brokers should not be null"),
    );
  });

  it("throws an exception if one of the brokers is not a string", async () => {
    await expect(
      connectionPoolBuilder({
        socketFactory,
        brokers: ["localhost:1234", undefined],
        ssl,
        sasl,
        clientId,
        connectionTimeout,
        logger,
      }).build(),
    ).rejects.toEqual(
      new KafkaJSNonRetriableError('Failed to connect: broker at index 1 is invalid "undefined"'),
    );
  });

  it("rejects a null broker-provider result as non-retriable", async () => {
    await expect(
      connectionPoolBuilder({
        socketFactory,
        brokers: () => null,
        ssl,
        sasl,
        clientId,
        connectionTimeout,
        logger,
      }).build(),
    ).rejects.toMatchObject({
      name: "KafkaJSNonRetriableError",
      retriable: false,
      message: "Failed to connect: brokers should not be null",
    });
  });

  it("throws an KafkaJSConnectionError if brokers is function crashes", async () => {
    await expect(
      connectionPoolBuilder({
        socketFactory,
        brokers: () => {
          throw new Error("oh a crash!");
        },
        ssl,
        sasl,
        clientId,
        connectionTimeout,
        logger,
      }).build(),
    ).rejects.toEqual(
      new KafkaJSConnectionError('Failed to connect: "config.brokers" threw: oh a crash!'),
    );
  });

  it("brokers can be function that returns array of host:port strings", async () => {
    const builder = connectionPoolBuilder({
      socketFactory,
      brokers: () => ["host.test:7777"],
      ssl,
      sasl,
      clientId,
      connectionTimeout,
      logger,
    });

    const connectionPool = await builder.build();
    expect(connectionPool).toBeInstanceOf(ConnectionPool);
    expect(connectionPool.host).toBe("host.test");
    expect(connectionPool.port).toBe(7777);
  });

  it("brokers can be async function that returns array of host:port strings", async () => {
    const builder = connectionPoolBuilder({
      socketFactory,
      brokers: async () => ["host.test:7777"],
      ssl,
      sasl,
      clientId,
      connectionTimeout,
      logger,
    });

    const connectionPool = await builder.build();
    expect(connectionPool).toBeInstanceOf(ConnectionPool);
    expect(connectionPool.host).toBe("host.test");
    expect(connectionPool.port).toBe(7777);
  });

  it("refreshes async broker providers for seeds and bypasses them for explicit destinations", async () => {
    const provider = jest
      .fn()
      .mockResolvedValueOnce(["first.test:7777"])
      .mockResolvedValueOnce(["second.test:7778"]);
    const builder = connectionPoolBuilder({ brokers: provider, socketFactory, logger });
    expect((await builder.build()).host).toBe("first.test");
    expect((await builder.build()).host).toBe("second.test");
    const destination = await builder.build({ host: "override.test", port: 7779 });
    expect(destination.host).toBe("override.test");
    expect(destination.port).toBe(7779);
    expect(provider).toHaveBeenCalledTimes(2);
  });
});

import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import Connection from "./connection.mjs";
import connectionStatuses from "./connection_status.mjs";
import Broker from "../broker/index.mjs";
import apiKeys from "../protocol/requests/api_keys.mjs";
import Long from "../utils/long.mjs";
import { KafkaJSLockTimeout } from "../errors.mjs";

describe("Authentication lifecycle", () => {
  let connection, logger;

  beforeEach(() => {
    jest.useFakeTimers({ now: 0 });
    logger = {
      namespace: () => logger,
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
    connection = new Connection({
      host: "broker.test",
      port: 9094,
      logger,
      socketFactory: jest.fn(),
      connectionTimeout: 10,
      requestTimeout: 100,
      reauthenticationThreshold: 100,
      sasl: { mechanism: "plain", username: "user", password: "test-password" },
    });
    connection.connectionStatus = connectionStatuses.CONNECTION_STATUS.CONNECTED;
    connection.socket = { write: jest.fn(), end: jest.fn(), unref: jest.fn() };
    connection.setVersions({
      [apiKeys.SaslHandshake]: { minVersion: 0, maxVersion: 1 },
      [apiKeys.SaslAuthenticate]: { minVersion: 0, maxVersion: 1 },
    });
    connection.setSupportAuthenticationProtocol(true);
  });

  afterEach(async () => {
    await connection.disconnect();
    expect(jest.getTimerCount()).toBe(0);
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test("shares authentication and reauthenticates at the exact session threshold", async () => {
    jest
      .spyOn(connection, "send")
      .mockImplementation(async ({ request }) =>
        request.apiKey === apiKeys.SaslHandshake
          ? { enabledMechanisms: ["PLAIN"] }
          : { authBytes: Buffer.alloc(0), sessionLifetimeMs: "1000" },
      );
    await Promise.all([connection.authenticate(), connection.authenticate()]);
    expect(connection.send).toHaveBeenCalledTimes(2);
    await jest.advanceTimersByTimeAsync(899);
    expect(connection.isAuthenticated()).toBe(true);
    await jest.advanceTimersByTimeAsync(1);
    expect(connection.isAuthenticated()).toBe(false);
    await Promise.all([connection.authenticate(), connection.authenticate()]);
    expect(connection.send).toHaveBeenCalledTimes(4);
    expect(connection.isAuthenticated()).toBe(true);
    await connection.disconnect();
    expect(connection.isAuthenticated()).toBe(false);
  });

  test.each(["0", "9007199254740993"])(
    "retains unlimited or int64 lifetime %s",
    async (lifetime) => {
      connection.authenticatedAt = process.hrtime();
      connection.sessionLifetime = Long.fromString(lifetime);
      await jest.advanceTimersByTimeAsync(1000000);
      expect(connection.isAuthenticated()).toBe(true);
    },
  );

  test("shares provider failures, clears failed state and allows another attempt", async () => {
    const failure = new Error("provider unavailable");
    const authenticate = jest.fn().mockRejectedValueOnce(failure).mockResolvedValue(undefined);
    connection.sasl.authenticationProvider = () => ({ authenticate });
    jest.spyOn(connection, "send").mockResolvedValue({ enabledMechanisms: ["PLAIN"] });
    const results = await Promise.allSettled([
      connection.authenticate(),
      connection.authenticate(),
    ]);
    expect(results).toEqual([
      { status: "rejected", reason: failure },
      { status: "rejected", reason: failure },
    ]);
    expect(authenticate).toHaveBeenCalledTimes(1);
    expect(connection.authenticatedAt).toBeNull();
    await connection.authenticate();
    expect(authenticate).toHaveBeenCalledTimes(2);
    expect(connection.isAuthenticated()).toBe(true);
  });

  test("times out a stalled SaslAuthenticate request without marking the connection authenticated", async () => {
    const send = connection.send.bind(connection);
    jest
      .spyOn(connection, "send")
      .mockImplementation((protocol) =>
        protocol.request.apiKey === apiKeys.SaslHandshake
          ? Promise.resolve({ enabledMechanisms: ["PLAIN"] })
          : send(protocol),
      );
    connection.requestQueue.scheduleRequestTimeoutCheck();
    const rejected = expect(connection.authenticate()).rejects.toMatchObject({
      name: "KafkaJSSASLAuthenticationError",
      message: expect.stringContaining("Request SaslAuthenticate"),
    });
    await jest.advanceTimersByTimeAsync(0);
    expect(connection.requestQueue.inflight.size).toBe(1);
    await jest.advanceTimersByTimeAsync(100);
    expect(connection.requestQueue.inflight.size).toBe(1);
    await jest.advanceTimersByTimeAsync(100);
    await rejected;
    expect(connection.authenticatedAt).toBeNull();
    expect(connection.requestQueue.inflight.size).toBe(0);
    expect(connection.socket.write).toHaveBeenCalledTimes(1);
  });

  test("adds authenticationTimeout to twice the connection timeout for queued connects", async () => {
    const broker = new Broker({
      connectionPool: { host: "broker.test", port: 9094, connectionTimeout: 10 },
      authenticationTimeout: 30,
      logger,
    });
    await broker.lock.acquire();
    let settled = false;
    const pending = broker.connect();
    const rejected = expect(pending).rejects.toThrow(KafkaJSLockTimeout);
    pending.catch(() => {
      settled = true;
    });
    await jest.advanceTimersByTimeAsync(49);
    expect(settled).toBe(false);
    await jest.advanceTimersByTimeAsync(1);
    await rejected;
    expect(settled).toBe(true);
    await broker.lock.release();
  });
});

import { describe, expect, beforeEach, afterEach, it } from "@jest/globals";
import apiKeys from "../protocol/requests/api_keys.mjs";
import ConnectionPool from "./connection_pool.mjs";
const { default: testHelpers } = await import("testHelpers");
const { connectionOpts } = testHelpers;

describe("ConnectionPool", () => {
  /** @type {ConnectionPool} */
  let pool;

  beforeEach(() => {
    pool = new ConnectionPool(connectionOpts());
  });

  afterEach(async () => {
    pool && (await pool.destroy());
  });

  it("should connect on getConnect()", async () => {
    const connection = await pool.getConnection();
    expect(connection.isConnected()).toBe(true);

    expect(pool.isConnected()).toBe(true);
    await pool.destroy();
    expect(pool.isConnected()).toBe(false);

    expect(connection.isConnected()).toBe(false);
  });

  it("should return different connection for Fetch requests", async () => {
    const heartbeatConnection = await pool.getConnectionByRequest({
      request: { apiKey: apiKeys.Heartbeat },
    });
    const fetchConnection = await pool.getConnectionByRequest({
      request: { apiKey: apiKeys.Fetch },
    });
    const metadataConnection = await pool.getConnectionByRequest({
      request: { apiKey: apiKeys.Metadata },
    });
    expect(heartbeatConnection).not.toBe(fetchConnection);
    expect(metadataConnection).toBe(heartbeatConnection);
  });

  it("should reconnect connection if it disconnects", async () => {
    let connection = await pool.getConnection();

    expect(connection.isConnected()).toBe(true);
    await connection.disconnect();
    expect(connection.isConnected()).toBe(false);

    connection = await pool.getConnection();
    expect(connection.isConnected()).toBe(true);
  });
});

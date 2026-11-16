import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import net from "node:net";
import { once } from "node:events";
import Connection from "./connection.mjs";
import createSocketFactory from "./socket_factory.mjs";
import { createLogger, LEVELS } from "../loggers/index.mjs";
import ApiVersions from "../protocol/requests/apiVersions/index.mjs";
import { KafkaJSConnectionClosedError } from "../errors.mjs";

describe("Connection real-socket lifecycle", () => {
  let server, connection, sockets;

  beforeEach(async () => {
    sockets = new Set();
    server = net.createServer((socket) => {
      sockets.add(socket);
      socket.once("close", () => sockets.delete(socket));
      socket.on("data", () => socket.end());
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    connection = new Connection({
      host: "127.0.0.1",
      port: server.address().port,
      socketFactory: createSocketFactory(),
      logger: createLogger({ level: LEVELS.NOTHING, logCreator: () => () => {} }),
      connectionTimeout: 5000,
      requestTimeout: 5000,
      maxInFlightRequests: 1,
    });
  });

  afterEach(async () => {
    if (connection) await connection.disconnect();
    for (const socket of sockets) socket.destroy();
    if (server.listening) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
    jest.restoreAllMocks();
  });

  it("rejects in-flight and queued requests on peer closure, then reconnects", async () => {
    const accepted = once(server, "connection");
    await Promise.all([connection.connect(), accepted]);
    const write = jest.spyOn(connection.socket, "write");
    const protocol = ApiVersions.protocol({ version: 0 });
    const results = await Promise.allSettled([
      connection.send(protocol()),
      connection.send(protocol()),
    ]);
    for (const result of results) {
      expect(result.status).toBe("rejected");
      expect(result.reason).toBeInstanceOf(KafkaJSConnectionClosedError);
    }
    expect(results[0].reason).toBe(results[1].reason);
    expect(write).toHaveBeenCalledTimes(1);
    expect(connection.requestQueue.inflight.size).toBe(0);
    expect(connection.requestQueue.pending).toHaveLength(0);
    await connection.disconnect();
    expect(connection.isConnected()).toBe(false);
    expect(connection.requestQueue.throttleCheckTimeoutId).toBeNull();

    const reconnected = once(server, "connection");
    await Promise.all([connection.connect(), reconnected]);
    expect(connection.isConnected()).toBe(true);
  });
});

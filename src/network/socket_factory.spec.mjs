import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import net from "node:net";
import tls from "node:tls";
import { EventEmitter } from "node:events";
import createSocketFactory from "./socket_factory.mjs";
import createSocket from "./socket.mjs";

describe("Socket factories", () => {
  let socket;
  const onConnect = () => {};

  beforeEach(() => {
    socket = { setKeepAlive: jest.fn() };
    jest.spyOn(net, "connect").mockReturnValue(socket);
    jest.spyOn(tls, "connect").mockReturnValue(socket);
  });

  afterEach(() => jest.restoreAllMocks());

  it("creates synchronous plaintext sockets with the existing keep-alive delay", () => {
    const factory = createSocketFactory();
    expect(factory({ host: "localhost", port: 9092, ssl: null, onConnect })).toBe(socket);
    expect(net.connect).toHaveBeenCalledWith({ host: "localhost", port: 9092 }, onConnect);
    expect(tls.connect).not.toHaveBeenCalled();
    expect(socket.setKeepAlive).toHaveBeenCalledWith(true, 60000);
  });

  it.each(["kafka.example", "127.0.0.1", "::1"])("preserves TLS SNI selection for %s", (host) => {
    const ssl = Object.freeze({ rejectUnauthorized: true });
    expect(createSocketFactory()({ host, port: 9093, ssl, onConnect })).toBe(socket);
    const options = { host, port: 9093, rejectUnauthorized: true };
    if (host === "kafka.example") options.servername = host;
    expect(tls.connect).toHaveBeenCalledWith(options, onConnect);
    expect(net.connect).not.toHaveBeenCalled();
    expect(socket.setKeepAlive).toHaveBeenCalledWith(true, 60000);
  });

  it("honours an explicit TLS server name", () => {
    createSocketFactory()({
      host: "kafka.example",
      port: 9093,
      ssl: { servername: "override.example" },
      onConnect,
    });
    expect(tls.connect).toHaveBeenCalledWith(
      {
        host: "kafka.example",
        port: 9093,
        servername: "override.example",
      },
      onConnect,
    );
  });

  it("retains custom socket identity and wires every lifecycle callback", () => {
    const customSocket = new EventEmitter();
    const socketFactory = jest.fn(() => customSocket);
    const callbacks = {
      onConnect: jest.fn(),
      onData: jest.fn(),
      onEnd: jest.fn(),
      onError: jest.fn(),
      onTimeout: jest.fn(),
    };
    const ssl = { servername: "custom.example" };
    const result = createSocket({ socketFactory, host: "custom", port: 1234, ssl, ...callbacks });
    expect(result).toBe(customSocket);
    expect(socketFactory).toHaveBeenCalledWith({
      host: "custom",
      port: 1234,
      ssl,
      onConnect: callbacks.onConnect,
    });
    for (const [event, callback] of Object.entries({
      data: callbacks.onData,
      end: callbacks.onEnd,
      error: callbacks.onError,
      timeout: callbacks.onTimeout,
    })) {
      const payload = event === "error" ? new Error("socket failed") : Buffer.from("payload");
      customSocket.emit(event, payload);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(payload);
    }
  });
});

import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import SASLAuthenticator from "./index.mjs";
import apiKeys from "../../protocol/requests/api_keys.mjs";
import { KafkaJSSASLAuthenticationError } from "../../errors.mjs";

describe("SASL controller contracts", () => {
  let connection, logger, request, response, versions;

  beforeEach(() => {
    logger = { namespace: jest.fn(() => logger), debug: jest.fn(), error: jest.fn() };
    request = { encode: jest.fn(async () => Buffer.from("challenge")) };
    response = {
      decode: jest.fn(async (bytes) => bytes.toString()),
      parse: jest.fn(async (value) => ({ value })),
    };
    versions = {
      [apiKeys.SaslHandshake]: { minVersion: 0, maxVersion: 1 },
      [apiKeys.SaslAuthenticate]: { minVersion: 0, maxVersion: 1 },
    };
    connection = {
      host: "broker.test",
      port: 9094,
      sasl: {
        mechanism: "custom",
        authenticationProvider: jest.fn(({ saslAuthenticate }) => ({
          authenticate: () => saslAuthenticate({ request, response }),
        })),
      },
      send: jest
        .fn()
        .mockResolvedValueOnce({ enabledMechanisms: ["CUSTOM"] })
        .mockResolvedValue({
          authBytes: Buffer.from("answer"),
          sessionLifetimeMs: "9007199254740993",
        }),
      sendAuthRequest: jest.fn(async () => "legacy"),
    };
  });

  test("passes the provider context and preserves int64 session lifetimes", async () => {
    const authenticator = new SASLAuthenticator(connection, logger, versions, true);
    await authenticator.authenticate();
    expect(connection.sasl.authenticationProvider).toHaveBeenCalledWith({
      host: "broker.test",
      port: 9094,
      logger,
      saslAuthenticate: expect.any(Function),
    });
    expect(logger.namespace).toHaveBeenCalledWith("SaslAuthenticator-CUSTOM");
    expect(request.encode).toHaveBeenCalledTimes(1);
    expect(response.decode).toHaveBeenCalledWith(Buffer.from("answer"));
    expect(response.parse).toHaveBeenCalledWith("answer");
    expect(authenticator.sessionLifetime).toBe("9007199254740993");
    expect(connection.sendAuthRequest).not.toHaveBeenCalled();
  });

  test.each([undefined, "0"])("uses an unlimited lifetime for %s", async (sessionLifetimeMs) => {
    connection.send
      .mockReset()
      .mockResolvedValue({ authBytes: Buffer.alloc(0), sessionLifetimeMs });
    connection.send.mockResolvedValueOnce({ enabledMechanisms: ["CUSTOM"] });
    const authenticator = new SASLAuthenticator(connection, logger, versions, true);
    await authenticator.authenticate();
    expect(authenticator.sessionLifetime).toBe("0");
  });

  test("retains legacy raw-auth request and response identity", async () => {
    const authenticator = new SASLAuthenticator(connection, logger, versions, false);
    await authenticator.authenticate();
    expect(connection.sendAuthRequest).toHaveBeenCalledWith({ request, response });
    expect(connection.send).toHaveBeenCalledTimes(1);
    expect(request.encode).not.toHaveBeenCalled();
    expect(authenticator.sessionLifetime).toBe("0");
  });

  test("rejects unsupported mechanisms before invoking the provider", async () => {
    connection.send.mockReset().mockResolvedValue({ enabledMechanisms: ["PLAIN"] });
    const authenticator = new SASLAuthenticator(connection, logger, versions, true);
    await expect(authenticator.authenticate()).rejects.toThrow(KafkaJSSASLAuthenticationError);
    expect(connection.sasl.authenticationProvider).not.toHaveBeenCalled();
    expect(connection.send).toHaveBeenCalledTimes(1);
  });

  test("preserves provider rejection identity", async () => {
    const failure = new Error("provider unavailable");
    connection.sasl.authenticationProvider.mockReturnValue({
      authenticate: () => Promise.reject(failure),
    });
    const authenticator = new SASLAuthenticator(connection, logger, versions, true);
    await expect(authenticator.authenticate()).rejects.toBe(failure);
  });

  test("propagates malformed response failures", async () => {
    const failure = new Error("malformed challenge");
    response.parse.mockRejectedValue(failure);
    const authenticator = new SASLAuthenticator(connection, logger, versions, true);
    await expect(authenticator.authenticate()).rejects.toBe(failure);
  });

  test("allows providers without a response decoder", async () => {
    connection.sasl.authenticationProvider.mockImplementation(({ saslAuthenticate }) => ({
      authenticate: () => saslAuthenticate({ request }),
    }));
    await new SASLAuthenticator(connection, logger, versions, true).authenticate();
    expect(response.decode).not.toHaveBeenCalled();
    expect(connection.send).toHaveBeenCalledTimes(2);
  });
});

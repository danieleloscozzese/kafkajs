import { describe, expect, jest, test } from "@jest/globals";
import Decoder from "../../protocol/decoder.mjs";
import plain from "./plain.mjs";
import awsIam from "./aws_iam.mjs";
import oauthBearer from "./oauth_bearer.mjs";
import { KafkaJSSASLAuthenticationError } from "../../errors.mjs";

const cases = [
  [
    "PLAIN",
    plain,
    () => ({ username: "user", password: "test-password" }),
    "\0user\0test-password",
  ],
  [
    "AWS",
    awsIam,
    () => ({
      authorizationIdentity: "identity",
      accessKeyId: "test-key",
      secretAccessKey: "test-secret",
    }),
    "identity\0test-key\0test-secret\0",
  ],
  [
    "OAUTHBEARER",
    oauthBearer,
    () => ({
      oauthBearerProvider: async () => ({
        value: "test-token",
        extensions: { extension: "value" },
      }),
    }),
    "n,,\u0001auth=Bearer test-token\u0001extension=value\u0001\u0001",
  ],
];

describe.each(cases)("%s provider contracts", (name, provider, config, payload) => {
  test("preserves encoded bytes without logging credentials", async () => {
    const logger = { debug: jest.fn(), error: jest.fn() };
    const saslAuthenticate = jest.fn(async ({ request }) => {
      const decoder = new Decoder(await request.encode());
      expect(decoder.readBytes().toString()).toBe(payload);
    });
    await provider(config())({
      host: "broker.test",
      port: 9094,
      logger,
      saslAuthenticate,
    }).authenticate();
    expect(saslAuthenticate).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalledTimes(2);
    const logs = JSON.stringify(logger.debug.mock.calls);
    for (const credential of ["test-password", "test-secret", "test-key", "test-token"]) {
      expect(logs).not.toContain(credential);
    }
  });

  test("keeps transport rejection classification and error logging", async () => {
    const logger = { debug: jest.fn(), error: jest.fn() };
    const authenticator = provider(config())({
      host: "broker.test",
      port: 9094,
      logger,
      saslAuthenticate: async () => {
        throw new Error("server rejected credentials");
      },
    });
    await expect(authenticator.authenticate()).rejects.toThrow(KafkaJSSASLAuthenticationError);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("server rejected credentials"),
      { broker: "broker.test:9094" },
    );
  });
});

test("OAuth token-provider rejection is passed through unchanged", async () => {
  const failure = new Error("token provider unavailable");
  const saslAuthenticate = jest.fn();
  const authenticator = oauthBearer({
    oauthBearerProvider: async () => {
      throw failure;
    },
  })({ host: "broker.test", port: 9094, logger: {}, saslAuthenticate });
  await expect(authenticator.authenticate()).rejects.toBe(failure);
  expect(saslAuthenticate).not.toHaveBeenCalled();
});

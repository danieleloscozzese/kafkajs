import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import scram from "./scram.mjs";
import scram256 from "./scram256.mjs";
import scram512 from "./scram512.mjs";
import Decoder from "../../protocol/decoder.mjs";

const { SCRAM } = scram;
const nonce = "rOprNGfwEbeRWgbNEkqO";
const serverNonce = `${nonce}%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0`;
const serverFirst = {
  original: `r=${serverNonce},s=W22ZaJ0SNY7soEsUEjb6gQ==,i=4096`,
  r: serverNonce,
  s: "W22ZaJ0SNY7soEsUEjb6gQ==",
  i: "4096",
};

// RFC 7677's SHA-256 exchange; SHA-512 uses the same inputs, independently derived with Node crypto.
const vectors = [
  [
    "SHA256",
    scram256,
    "dHzbZapWIk4jUhN+Ute9ytag9zjfMHgsqmmiz7AndVQ=",
    "6rriTRBi23WpRR/wtup+mMhUZUn/dB5nLTJRsjl95G4=",
  ],
  [
    "SHA512",
    scram512,
    "gMGXRcevScNtxZ6/8lQYpGtnsNAc3mGcmNomv+xnoOMw+3R2xNJdMNnzMlTN8PPC6wdp6dybEmDYXYTxwnYPJQ==",
    "ZQnYEgWQMFmmsM8aQMF0nDDCy/AgCzkwk8CmMZYcMg0vSVlKDanekLtifDSeVGT4+5ZxXnJq199RVG2rR7N7Zw==",
  ],
];

describe.each(vectors)("SCRAM %s handshake", (name, provider, proof, signature) => {
  let logger;

  beforeEach(() => {
    jest.spyOn(SCRAM, "nonce").mockReturnValue(nonce);
    logger = { debug: jest.fn(), error: jest.fn() };
  });
  afterEach(() => jest.restoreAllMocks());

  const create = (logger, saslAuthenticate) =>
    provider({ username: "user", password: "pencil" })({
      host: "broker.test",
      port: 9094,
      logger,
      saslAuthenticate,
    });

  test("validates a complete exchange against fixed proofs and server signatures", async () => {
    const saslAuthenticate = jest
      .fn()
      .mockImplementationOnce(async ({ request }) => {
        expect(new Decoder(await request.encode()).readBytes().toString()).toBe(
          `n,,n=user,r=${nonce}`,
        );
        return serverFirst;
      })
      .mockImplementationOnce(async ({ request }) => {
        expect(new Decoder(await request.encode()).readBytes().toString()).toBe(
          `c=biws,r=${serverNonce},p=${proof}`,
        );
        return { v: signature };
      });
    await create(logger, saslAuthenticate).authenticate();
    expect(saslAuthenticate).toHaveBeenCalledTimes(2);
    expect(logger.error).not.toHaveBeenCalled();
    expect(JSON.stringify(logger.debug.mock.calls)).not.toContain("pencil");
  });

  test.each([
    ["nonce mismatch", { r: "unrelated-nonce" }, "Invalid server nonce"],
    ["too few iterations", { i: "4095" }, "Requested iterations 4095"],
    ["malformed iterations", { i: "invalid" }, "iterations"],
    ["missing nonce", { r: undefined }, "startsWith"],
  ])("rejects %s before sending the final message", async (name, overrides, message) => {
    const saslAuthenticate = jest.fn().mockResolvedValue({ ...serverFirst, ...overrides });
    await expect(create(logger, saslAuthenticate).authenticate()).rejects.toMatchObject({
      name: "KafkaJSSASLAuthenticationError",
      retriable: false,
      message: expect.stringContaining(message),
    });
    expect(saslAuthenticate).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  test.each([
    ["invalid signature", { v: "incorrect" }, "Invalid server signature"],
    ["server error", { e: "credentials rejected" }, "credentials rejected"],
  ])("rejects %s in the final response", async (name, finalResponse, message) => {
    const saslAuthenticate = jest
      .fn()
      .mockResolvedValueOnce(serverFirst)
      .mockResolvedValueOnce(finalResponse);
    await expect(create(logger, saslAuthenticate).authenticate()).rejects.toMatchObject({
      name: "KafkaJSSASLAuthenticationError",
      retriable: false,
      message: expect.stringContaining(message),
    });
    expect(saslAuthenticate).toHaveBeenCalledTimes(2);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});

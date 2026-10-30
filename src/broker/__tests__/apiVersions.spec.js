const { describe, test, expect, beforeEach, afterEach, jest } = require("@jest/globals");

const { createConnectionPool, connectionOpts, newLogger } = require("testHelpers");
const { KafkaJSProtocolError, KafkaJSNonRetriableError } = require("../../errors.js");
const { createErrorFromCode } = require("../../protocol/error.js");
const { requests } = require("../../protocol/requests/index.js");
const Broker = require("../index.js");

const UNSUPPORTED_VERSION_CODE = 35;

describe("Broker > ApiVersions", () => {
  let broker;

  beforeEach(async () => {
    broker = new Broker({
      connectionPool: createConnectionPool(connectionOpts()),
      logger: newLogger(),
    });
    await broker.connect();
  });

  afterEach(async () => {
    broker && (await broker.disconnect());
  });

  test("request", async () => {
    await expect(broker.apiVersions()).resolves.toBeTruthy();
  });

  test("try to use the latest version", async () => {
    jest.spyOn(requests.ApiVersions, "protocol").mockImplementationOnce(() => () => {
      throw new KafkaJSProtocolError(createErrorFromCode(UNSUPPORTED_VERSION_CODE));
    });

    await expect(broker.apiVersions()).resolves.toBeTruthy();
    expect(requests.ApiVersions.protocol).toHaveBeenCalledWith({ version: 2 });
    expect(requests.ApiVersions.protocol).toHaveBeenCalledWith({ version: 1 });
    expect(requests.ApiVersions.protocol).not.toHaveBeenCalledWith({ version: 0 });
  });

  test("throws if API versions cannot be used", async () => {
    jest.spyOn(requests.ApiVersions, "protocol").mockImplementation(() => () => {
      throw new KafkaJSProtocolError(createErrorFromCode(UNSUPPORTED_VERSION_CODE));
    });

    await expect(broker.apiVersions()).rejects.toThrow(
      KafkaJSNonRetriableError,
      "API Versions not supported",
    );
  });
});

import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import errors from "../../errors.mjs";
import protocolErrors from "../../protocol/error.mjs";
import requests0 from "../../protocol/requests/index.mjs";
import Broker from "../index.mjs";
const { default: testHelpers } = await import("testHelpers");
const { createConnectionPool, connectionOpts, newLogger } = testHelpers;
const { KafkaJSProtocolError, KafkaJSNonRetriableError } = errors;
const { createErrorFromCode } = protocolErrors;
const { requests } = requests0;

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

import { describe, expect, it } from "@jest/globals";
import { createRequire } from "node:module";
import ApiVersions from "./apiVersions/index.mjs";
import Metadata from "./metadata/index.mjs";
import Produce from "./produce/index.mjs";
import Fetch from "./fetch/index.mjs";
import ListOffsets from "./listOffsets/index.mjs";
import apiKeys from "./api_keys.mjs";

const require = createRequire(import.meta.url);
const { default: requests } = await import("./index.js");

describe("Protocol registries", () => {
  it("shares registry and API-key objects across module formats", () => {
    expect(require("./apiVersions/index.js")).toBe(ApiVersions);
    expect(require("./metadata/index.js")).toBe(Metadata);
    expect(require("./apiKeys.js")).toBe(apiKeys);
    expect(requests.requests.ApiVersions).toBe(ApiVersions);
    expect(requests.requests.Metadata).toBe(Metadata);
    for (const [name, registry] of Object.entries({ Produce, Fetch, ListOffsets })) {
      const directory = name[0].toLowerCase() + name.slice(1);
      expect(require(`./${directory}/index.js`)).toBe(registry);
      expect(requests.requests[name]).toBe(registry);
    }
  });

  it.each([
    [ApiVersions, apiKeys.ApiVersions, ["0", "1", "2"]],
    [Metadata, apiKeys.Metadata, ["0", "1", "2", "3", "4", "5", "6"]],
    [Produce, apiKeys.Produce, ["0", "1", "2", "3", "4", "5", "6", "7"]],
    [Fetch, apiKeys.Fetch, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]],
    [ListOffsets, apiKeys.ListOffsets, ["0", "1", "2", "3"]],
  ])("returns synchronous factories for each advertised version", (registry, apiKey, versions) => {
    expect(registry.versions).toEqual(versions);
    expect(registry.protocol({ version: 99 })).toBeUndefined();
    for (const version of versions) {
      const protocol = registry.protocol({ version: Number(version) })({ topics: ["test"] });
      expect(protocol.request).toMatchObject({ apiKey, apiVersion: Number(version) });
      expect(typeof protocol.response.decode).toBe("function");
      expect(typeof protocol.response.parse).toBe("function");
      expect(protocol.then).toBeUndefined();
    }
  });

  it.each([0, 1000, Number.MAX_SAFE_INTEGER])(
    "preserves fetch request timeout adjustment for maxWaitTime %s",
    (maxWaitTime) => {
      for (const version of Fetch.versions) {
        const result = Fetch.protocol({ version })({ maxWaitTime, topics: [] });
        const expected = maxWaitTime === Number.MAX_SAFE_INTEGER ? maxWaitTime : maxWaitTime + 100;
        expect(result.requestTimeout).toBe(expected);
      }
    },
  );

  it("negotiates the highest common metadata version", () => {
    const factory = requests.lookup({ [apiKeys.Metadata]: { minVersion: 0, maxVersion: 3 } })(
      apiKeys.Metadata,
      Metadata,
    );
    expect(factory({ topics: ["test"] }).request.apiVersion).toBe(3);
    expect(Metadata.protocol({ version: 99 })).toBeUndefined();
  });
});

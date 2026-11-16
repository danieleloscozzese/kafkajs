import { describe, expect, it } from "@jest/globals";
import { createRequire } from "node:module";
import ApiVersions from "./apiVersions/index.mjs";
import Metadata from "./metadata/index.mjs";
import apiKeys from "./api_keys.mjs";

const require = createRequire(import.meta.url);
const { default: requests } = await import("./index.js");

describe("Discovery protocol registries", () => {
  it("shares registry and API-key objects across module formats", () => {
    expect(require("./apiVersions/index.js")).toBe(ApiVersions);
    expect(require("./metadata/index.js")).toBe(Metadata);
    expect(require("./apiKeys.js")).toBe(apiKeys);
    expect(requests.requests.ApiVersions).toBe(ApiVersions);
    expect(requests.requests.Metadata).toBe(Metadata);
  });

  it.each([
    [ApiVersions, apiKeys.ApiVersions, ["0", "1", "2"]],
    [Metadata, apiKeys.Metadata, ["0", "1", "2", "3", "4", "5", "6"]],
  ])("returns synchronous factories for each advertised version", (registry, apiKey, versions) => {
    expect(registry.versions).toEqual(versions);
    for (const version of versions) {
      const protocol = registry.protocol({ version: Number(version) })({ topics: ["test"] });
      expect(protocol.request).toMatchObject({ apiKey, apiVersion: Number(version) });
      expect(typeof protocol.response.decode).toBe("function");
      expect(typeof protocol.response.parse).toBe("function");
      expect(protocol.then).toBeUndefined();
    }
  });

  it("negotiates the highest common metadata version", () => {
    const factory = requests.lookup({ [apiKeys.Metadata]: { minVersion: 0, maxVersion: 3 } })(
      apiKeys.Metadata,
      Metadata,
    );
    expect(factory({ topics: ["test"] }).request.apiVersion).toBe(3);
    expect(Metadata.protocol({ version: 99 })).toBeUndefined();
  });
});

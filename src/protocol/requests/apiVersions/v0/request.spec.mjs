import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import requestFixtureV0 from "../fixtures/v0_request.json" with { type: "json" };
describe("Protocol > Requests > ApiVersions > v0", () => {
  test("request", async () => {
    const { buffer } = await RequestV0Protocol().encode();
    expect(buffer).toEqual(Buffer.from(requestFixtureV0));
  });
});

import { describe, test, expect, beforeEach } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import v0Request from "../fixtures/v0_request.json" with { type: "json" };
describe("Protocol > Requests > DescribeAcls > v0", () => {
  let args;

  beforeEach(() => {
    args = {
      resourceType: 2,
      resourceName: "test-topic-064a1bcf62c877843e3c-18742-da400056-f741-4b3e-a725-b758d8104afa",
      host: "*",
      operation: 2,
      permissionType: 3,
    };
  });

  test("request", async () => {
    const { buffer } = await RequestV0Protocol(args).encode();
    expect(buffer).toEqual(Buffer.from(v0Request));
  });
});

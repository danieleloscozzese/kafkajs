import { describe, test, expect } from "@jest/globals";
import RequestV0Protocol from "./request.mjs";
import v1Request from "../fixtures/v1_request.json" with { type: "json" };
describe("Protocol > Requests > FindCoordinator > v1", () => {
  test("request", async () => {
    const coordinatorKey = "group-id";
    const coordinatorType = 0;

    const { buffer } = await RequestV0Protocol({ coordinatorKey, coordinatorType }).encode();
    expect(buffer).toEqual(Buffer.from(v1Request));
  });
});

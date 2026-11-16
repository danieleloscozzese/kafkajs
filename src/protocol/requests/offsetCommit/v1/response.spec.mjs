import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v1Response from "../fixtures/v1_response.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > OffsetCommit > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v1Response));
    expect(data).toEqual({
      responses: [
        { topic: "test-topic-eb1a285cda2e9f9a1021", partitions: [{ partition: 0, errorCode: 0 }] },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

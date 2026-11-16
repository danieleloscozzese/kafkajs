import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v1Response from "../fixtures/v1_response.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > OffsetFetch > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v1Response));
    expect(data).toEqual({
      responses: [
        {
          topic: "test-topic-9f9b074057acd4335946",
          partitions: [{ partition: 0, offset: "-1", metadata: "", errorCode: 0 }],
        },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v2Response from "../fixtures/v2_response.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > OffsetFetch > v2", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v2Response));
    expect(data).toEqual({
      responses: [
        {
          topic: "test-topic-2cbbd6e6362f1a638c94",
          partitions: [{ partition: 0, offset: "-1", metadata: "", errorCode: 0 }],
        },
      ],
      errorCode: 0,
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

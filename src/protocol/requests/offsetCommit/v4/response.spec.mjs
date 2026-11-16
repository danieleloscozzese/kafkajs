import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v4Response from "../fixtures/v4_response.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > OffsetCommit > v4", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v4Response));
    expect(data).toEqual({
      throttleTime: 0,
      clientSideThrottleTime: 0,
      responses: [
        {
          topic: "test-topic-5c24efe0ac41b91bee85-9985-841d6145-c897-4471-bd09-acd8b4c905f2",
          partitions: [{ partition: 0, errorCode: 0 }],
        },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

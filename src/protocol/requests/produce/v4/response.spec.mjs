import { describe, test, expect } from "@jest/globals";
import responseModule from "./response.mjs";
import v4ResponseModule from "../fixtures/v4_response.json" with { type: "json" };
const { decode, parse } = responseModule;

describe("Protocol > Requests > Produce > v4", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v4ResponseModule));
    expect(data).toEqual({
      topics: [
        {
          partitions: [{ baseOffset: "0", errorCode: 0, logAppendTime: "-1", partition: 0 }],
          topicName: "test-topic-5370ce2c813663fce3ca-99758-4d9ea731-5a23-4d5b-abbd-8390588d655d",
        },
      ],
      throttleTime: 0,
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

import { describe, test, expect } from "@jest/globals";
import responseModule from "./response.mjs";
import v3ResponseModule from "../fixtures/v3_response.json" with { type: "json" };
const { decode, parse } = responseModule;

describe("Protocol > Requests > Produce > v3", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v3ResponseModule));
    expect(data).toEqual({
      topics: [
        {
          partitions: [{ baseOffset: "0", errorCode: 0, logAppendTime: "-1", partition: 0 }],
          topicName: "test-topic-ebba68879c6f5081d8c2",
        },
      ],
      throttleTime: 0,
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

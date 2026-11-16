import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v0Response from "../fixtures/v0_response.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > CreateTopics > v0", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v0Response));
    expect(data).toEqual({
      topicErrors: [
        { errorCode: 0, topic: "test-topic-050fb2e6aed13a954288" },
        { errorCode: 0, topic: "test-topic-c8d8ca3d95495c6b900d" },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

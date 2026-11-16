import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v0Response from "../fixtures/v0_response.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > DeleteTopics > v0", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v0Response));
    expect(data).toEqual({
      topicErrors: [
        { topic: "test-topic-bb9886eb859786ce646d", errorCode: 0 },
        { topic: "test-topic-d41416601b422429db78", errorCode: 0 },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

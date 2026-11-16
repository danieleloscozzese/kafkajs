import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v1Response from "../fixtures/v1_response.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > CreateTopics > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v1Response));
    expect(data).toEqual({
      topicErrors: [
        {
          topic: "test-topic-98abe97d412df76b4deb",
          errorCode: 0,
          errorMessage: null,
        },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

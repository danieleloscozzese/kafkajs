import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v1Response from "../fixtures/v1_response.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > DeleteTopics > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v1Response));
    expect(data).toEqual({
      clientSideThrottleTime: 0,
      throttleTime: 0,
      topicErrors: [
        {
          topic: "test-topic-386ea404396d663a8042-56298-e6e26331-de25-48d8-90b6-4710cd0b618b",
          errorCode: 0,
        },
        {
          topic: "test-topic-bb5d4c0c37ae53eb8b53-56298-ac202bf8-78e7-4d8b-ad07-4e01d8148db0",
          errorCode: 0,
        },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

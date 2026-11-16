import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v3Response from "../fixtures/v3_response.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > OffsetFetch > v4", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v3Response));
    expect(data).toEqual({
      clientSideThrottleTime: 0,
      throttleTime: 0,
      responses: [
        {
          topic: "test-topic-df48241c4bf2fca9d16b-20117-aff9b64c-69a2-4456-be7b-de5bcd78984e",
          partitions: [{ partition: 0, offset: "-1", metadata: "", errorCode: 0 }],
        },
      ],
      errorCode: 0,
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

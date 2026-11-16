import { describe, test, expect } from "@jest/globals";
import responseModule from "./response.mjs";
import v0ResponseModule from "../fixtures/v0_response.json" with { type: "json" };
const { decode, parse } = responseModule;

describe("Protocol > Requests > Offsets > v0", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v0ResponseModule));
    expect(data).toEqual({
      responses: [
        {
          topic: "test-topic-727705ce68c29fedddf4",
          partitions: [{ partition: 0, errorCode: 0, offsets: ["0"] }],
        },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v3Response from "../fixtures/v3_response.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > LeaveGroup > v3", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v3Response));
    expect(data).toEqual({
      throttleTime: 0,
      clientSideThrottleTime: 0,
      errorCode: 0,
      members: [
        {
          memberId: "test-42962f68-e801-4cd8-b359-2d862ebb4d05",
          groupInstanceId: null,
          errorCode: 0,
        },
      ],
    });
    await expect(parse(data)).resolves.toBeTruthy();
  });
});

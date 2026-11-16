import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import v2Response from "../fixtures/v2_response.json" with { type: "json" };
import v2AssignerMetadata from "../fixtures/v2_assignerMetadata.json" with { type: "json" };
const { decode, parse } = response0;

describe("Protocol > Requests > JoinGroup > v4", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v2Response));
    expect(data).toEqual({
      throttleTime: 0,
      clientSideThrottleTime: 0,
      errorCode: 0,
      generationId: 1,
      groupProtocol: "AssignerName",
      leaderId:
        "test-b773bdb220aa2b862440-23702-2b1581f6-55ea-4af0-97f0-931d4f071111-68a2051d-7b30-4161-b920-89346d7b672b",
      memberId:
        "test-b773bdb220aa2b862440-23702-2b1581f6-55ea-4af0-97f0-931d4f071111-68a2051d-7b30-4161-b920-89346d7b672b",
      members: [
        {
          memberId:
            "test-b773bdb220aa2b862440-23702-2b1581f6-55ea-4af0-97f0-931d4f071111-68a2051d-7b30-4161-b920-89346d7b672b",
          memberMetadata: Buffer.from(v2AssignerMetadata),
        },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

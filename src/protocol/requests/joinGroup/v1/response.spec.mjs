import { describe, test, expect } from "@jest/globals";
import testHelpers0 from "testHelpers";
import response0 from "./response.mjs";
import v1Response from "../fixtures/v1_response.json" with { type: "json" };
import v1AssignerMetadata from "../fixtures/v1_assignerMetadata.json" with { type: "json" };
const { unsupportedVersionResponse } = testHelpers0;
const { decode, parse } = response0;

describe("Protocol > Requests > JoinGroup > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v1Response));
    expect(data).toEqual({
      errorCode: 0,
      generationId: 1,
      groupProtocol: "AssignerName",
      leaderId:
        "test-9dfcfa24752a27f51026-21486-91f3d0e3-dc7a-464f-ab89-94cb49a53a62-d9c2c2a5-cb2f-468e-a943-368336a2cd48",
      memberId:
        "test-9dfcfa24752a27f51026-21486-91f3d0e3-dc7a-464f-ab89-94cb49a53a62-d9c2c2a5-cb2f-468e-a943-368336a2cd48",
      members: [
        {
          memberId:
            "test-9dfcfa24752a27f51026-21486-91f3d0e3-dc7a-464f-ab89-94cb49a53a62-d9c2c2a5-cb2f-468e-a943-368336a2cd48",
          memberMetadata: Buffer.from(v1AssignerMetadata),
        },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });

  test("throws KafkaJSProtocolError if the api is not supported", async () => {
    await expect(decode(unsupportedVersionResponse())).rejects.toThrow(
      /The version of API is not supported/,
    );
  });
});

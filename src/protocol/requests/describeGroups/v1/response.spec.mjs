import { describe, test, expect } from "@jest/globals";
import response from "./response.mjs";
import v1Response from "../fixtures/v1_response.json" with { type: "json" };
import v1MemberMetadata from "../fixtures/v1_memberMetadata.json" with { type: "json" };
import v1MemberAssignment from "../fixtures/v1_memberAssignment.json" with { type: "json" };
const { decode, parse } = response;

describe("Protocol > Requests > DescribeGroups > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v1Response));
    expect(data).toEqual({
      throttleTime: 0,
      groups: [
        {
          errorCode: 0,
          groupId:
            "consumer-group-id-4de0aa10ef94403a397d-53384-d2fee969-1446-4166-bc8e-c88e8daffdfe",
          state: "Stable",
          protocolType: "consumer",
          protocol: "RoundRobinAssigner",
          members: [
            {
              memberId:
                "test-6ee008af511cbf89b897-53384-55bf525a-2ff5-49ef-8853-5fdf400a9c61-dbdee491-9f08-49d7-aa41-080b89bc69a8",
              clientId: "test-6ee008af511cbf89b897-53384-55bf525a-2ff5-49ef-8853-5fdf400a9c61",
              clientHost: "/172.19.0.1",
              memberMetadata: Buffer.from(v1MemberMetadata),
              memberAssignment: Buffer.from(v1MemberAssignment),
            },
          ],
        },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });
});

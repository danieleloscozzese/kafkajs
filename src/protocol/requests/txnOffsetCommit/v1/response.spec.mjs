import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import errors0 from "../../../../errors.mjs";
import v0Response from "../fixtures/v0_response.json" with { type: "json" };
const { decode, parse } = response0;
const { KafkaJSProtocolError } = errors0;

describe("Protocol > Requests > TxnOffsetCommit > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v0Response));
    expect(data).toEqual({
      clientSideThrottleTime: 0,
      throttleTime: 0,
      topics: [
        {
          topic: "test-topic-0ba33173f7664d75c6b2-63632-a0dab079-1c9a-44ba-be25-ca3d50df5003",
          partitions: [
            { errorCode: 0, partition: 1 },
            { errorCode: 0, partition: 2 },
          ],
        },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });

  test("throws KafkaJSProtocolError if there is an error on any of the partitions", async () => {
    const data = {
      throttleTime: 0,
      topics: [
        {
          topic: "test-topic",
          partitions: [
            { errorCode: 0, partition: 1 },
            { errorCode: 49, partition: 2 },
          ],
        },
      ],
    };

    await expect(parse(data)).rejects.toEqual(
      new KafkaJSProtocolError(
        "The producer attempted to use a producer id which is not currently assigned to its transactional id",
      ),
    );
  });
});

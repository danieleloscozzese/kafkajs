import { describe, test, expect } from "@jest/globals";
import response0 from "./response.mjs";
import errors0 from "../../../../errors.mjs";
import v0Response from "../fixtures/v0_response.json" with { type: "json" };
const { decode, parse } = response0;
const { KafkaJSProtocolError } = errors0;

describe("Protocol > Requests > AddPartitionsToTxn > v1", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v0Response));
    expect(data).toEqual({
      clientSideThrottleTime: 0,
      throttleTime: 0,
      errors: [
        {
          topic: "test-topic-f6bab978bdca094688e3-37015-ca4f7ad4-5dcc-4bb9-9853-b1e4c4ed78a7",
          partitionErrors: [
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
      errors: [
        {
          topic: "test-topic",
          partitionErrors: [
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

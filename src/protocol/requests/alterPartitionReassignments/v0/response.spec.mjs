import { describe, test, expect } from "@jest/globals";
import errors0 from "../../../../errors.mjs";
import response0 from "./response.mjs";
import v0Response from "../fixtures/v0_response.json" with { type: "json" };
import v0ResponseError from "../fixtures/v0_response_error.json" with { type: "json" };
const { KafkaJSAggregateError } = errors0;
const { decode, parse } = response0;

describe("Protocol > Requests > AlterPartitionReassignments > v0", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(v0Response));
    expect(data).toEqual({
      throttleTime: 0,
      errorCode: 0,
      responses: [
        {
          topic: "test-topic-1",
          partitions: [
            { partition: 1, errorCode: 0 },
            { partition: 0, errorCode: 0 },
          ],
        },
        {
          topic: "test-topic-2",
          partitions: [{ partition: 0, errorCode: 0 }],
        },
      ],
    });

    await expect(parse(data)).resolves.toBeTruthy();
  });

  test("error response", async () => {
    const data = await decode(Buffer.from(v0ResponseError));

    expect(data).toEqual({
      errorCode: 0,
      responses: [
        {
          partitions: [{ errorCode: 39, partition: 0 }],
          topic: "test-topic-f9d6da30a8893d0ec3e9-85563-975cbeab-1fd0-4800-8e69-3b974c21aef6",
        },
      ],
      throttleTime: 0,
    });

    const promise = parse(data);
    await expect(promise).rejects.toThrow(KafkaJSAggregateError);
    await expect(promise).rejects.toThrow(
      expect.objectContaining({
        message: "Errors altering partition reassignments",
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: "Replica assignment is invalid",
            topic: "test-topic-f9d6da30a8893d0ec3e9-85563-975cbeab-1fd0-4800-8e69-3b974c21aef6",
            partition: 0,
          }),
        ]),
      }),
    );
  });
});

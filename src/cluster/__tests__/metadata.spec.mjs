import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import waitFor from "../../utils/wait_for.mjs";
const { default: testHelpers } = await import("testHelpers");
const { createCluster, secureRandom, createTopic } = testHelpers;

describe("Cluster > metadata", () => {
  let cluster, topic1, topic2, topic3;

  beforeEach(async () => {
    topic1 = `test-topic-${secureRandom()}`;
    topic2 = `test-topic-${secureRandom()}`;
    topic3 = `test-topic-${secureRandom()}`;

    await createTopic({ topic: topic1 });
    await createTopic({ topic: topic2 });
    await createTopic({ topic: topic3 });

    cluster = createCluster();
    await cluster.connect();
  });

  afterEach(async () => {
    cluster && (await cluster.disconnect());
  });

  test("returns metadata for a set of topics", async () => {
    const response = await cluster.metadata({ topics: [topic1, topic2] });
    expect(response.topicMetadata.length).toEqual(2);

    const topics = response.topicMetadata.map(({ topic }) => topic).sort();
    expect(topics).toEqual([topic1, topic2].sort());
  });

  test("returns metadata for all topics", async () => {
    await cluster.refreshMetadata();
    const nodeIds = cluster.brokerPool.getNodeIds();
    const expectedTopics = [topic1, topic2, topic3];

    // Topic creation can finish before every broker has received its metadata.
    await waitFor(
      async () => {
        const responses = await Promise.all(
          nodeIds.map(async (nodeId) => {
            const broker = await cluster.brokerPool.findBroker({ nodeId });
            return broker.metadata([]);
          }),
        );
        return responses.every(({ topicMetadata }) =>
          expectedTopics.every((topic) => topicMetadata.some((entry) => entry.topic === topic)),
        );
      },
      { timeoutMessage: "Timed out waiting for topic metadata on every broker" },
    );

    const response = await cluster.metadata({ topics: [] });
    expect(response.topicMetadata.length).toBeGreaterThanOrEqual(3);

    const topics = response.topicMetadata.map(({ topic }) => topic).sort();
    expect(topics).toEqual(expect.arrayContaining(expectedTopics.sort()));
  });
});

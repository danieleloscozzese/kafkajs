const { describe, it, expect, jest } = require("@jest/globals");

const waitFor = require("./waitFor");
const Lock = require("./lock");

const sleep = (value) => waitFor((delay) => delay >= value);

describe("Utils > Lock", () => {
  it("allows only one resource at a time", async () => {
    const lock = new Lock({ timeout: 1000 });
    const acquired = [];

    await lock.acquire();
    const second = lock.acquire().then(() => acquired.push("second"));
    const third = lock.acquire().then(() => acquired.push("third"));
    expect(acquired).toEqual([]);

    await lock.release();
    await second;
    expect(acquired).toEqual(["second"]);

    await lock.release();
    await third;
    expect(acquired).toEqual(["second", "third"]);
    await lock.release();
  });

  it("throws an error if the lock cannot be acquired within a period", async () => {
    const lock = new Lock({ timeout: 60 });
    const resource = jest.fn();
    const callResource = async () => {
      await lock.acquire();
      resource(Date.now());
      await sleep(50);
      // it never releases the lock
    };

    await expect(
      Promise.all([callResource(), callResource(), callResource()]),
    ).rejects.toHaveProperty("message", "Timeout while acquiring lock (2 waiting locks)");
  });

  it("throws if the lock is initiated with an undefined timeout", async () => {
    expect(() => new Lock()).toThrowWithMessage(
      TypeError,
      `'timeout' is not a number, received 'undefined'`,
    );
  });

  it("allows lock to be acquired after timeout", async () => {
    const lock = new Lock({ timeout: 60 });
    const resource = jest.fn();
    const callResource = async () => {
      await lock.acquire();
      try {
        resource(Date.now());
        await sleep(100);
      } finally {
        lock.release();
      }
    };

    await expect(
      Promise.all([callResource(), callResource(), callResource()]),
    ).rejects.toHaveProperty("message", "Timeout while acquiring lock (2 waiting locks)");

    await expect(callResource()).resolves.toBeUndefined();
  });

  describe("with a description", () => {
    it("throws an error with the configured description if the lock cannot be acquired within a period", async () => {
      const lock = new Lock({ timeout: 60, description: "My test mock" });
      const resource = jest.fn();
      const callResource = async () => {
        await lock.acquire();
        resource(Date.now());
        await sleep(50);
        // it never releases the lock
      };

      await expect(
        Promise.all([callResource(), callResource(), callResource()]),
      ).rejects.toHaveProperty(
        "message",
        'Timeout while acquiring lock (2 waiting locks): "My test mock"',
      );
    });
  });
});

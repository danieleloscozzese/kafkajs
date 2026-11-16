import { describe, test, expect } from "@jest/globals";
import { spawnSync } from "node:child_process";
import errors from "../../../errors.mjs";
import randomBytes from "./random_bytes.mjs";
const { KafkaJSNonRetriableError } = errors;

describe("Producer > Partitioner > Default > RandomBytes", () => {
  test("it throws when requesting more bytes than entry allows", () => {
    expect(() => randomBytes(65537)).toThrow(
      new KafkaJSNonRetriableError(
        "Byte length (65537) exceeds the max number of bytes of entropy available (65536)",
      ),
    );
  });

  test.each([0, 32, 65536])("returns exactly %i bytes within the entropy limit", (size) => {
    const bytes = randomBytes(size);
    expect(bytes).toEqual(expect.any(Buffer));
    expect(bytes.byteLength).toBe(size);
  });

  test.each(["web", "global-node", "ms", "node", "none"])(
    "preserves the %s crypto backend",
    (backend) => {
      const result = spawnSync(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          `
        import assert from "node:assert/strict";
        import crypto from "node:crypto";
        const backend = ${JSON.stringify(backend)};
        const calls = [];
        const web = { getRandomValues: bytes => { calls.push(backend); bytes.fill(7); return bytes; } };
        const globalNode = { randomBytes: size => { calls.push("global-node"); return Buffer.alloc(size, 7); } };
        crypto.randomBytes = size => { calls.push("node"); return Buffer.alloc(size, 7); };
        Object.defineProperty(globalThis, "crypto", {
          value: backend === "web" ? web : backend === "global-node" ? globalNode : undefined,
        });
        globalThis.msCrypto = backend === "ms" ? web : undefined;
        if (backend === "none") globalThis.global = null;
        const { default: randomBytes } = await import(${JSON.stringify(new URL("./random_bytes.mjs", import.meta.url).href)});
        if (backend === "none") {
          assert.throws(() => randomBytes(4), {
            name: "KafkaJSNonRetriableError", message: "No available crypto implementation",
          });
          assert.deepEqual(calls, []);
        } else {
          assert.deepEqual(randomBytes(4), Buffer.alloc(4, 7));
          assert.deepEqual(calls, [backend]);
        }
      `,
        ],
        { encoding: "utf8" },
      );
      expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: "" });
    },
  );
});

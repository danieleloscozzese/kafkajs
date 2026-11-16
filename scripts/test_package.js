const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "kafkajs-pack-consumer-"));
const consumerDir = path.join(tempDir, "consumer");
const protocolFamilies = [
  ["apiVersions", [0, 1, 2]],
  ["metadata", [0, 1, 2, 3, 4, 5, 6]],
  ["produce", [0, 1, 2, 3, 4, 5, 6, 7]],
  ["fetch", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
  ["listOffsets", [0, 1, 2, 3]],
  ["findCoordinator", [0, 1, 2]],
  ["joinGroup", [0, 1, 2, 3, 4, 5]],
  ["heartbeat", [0, 1, 2, 3]],
  ["leaveGroup", [0, 1, 2, 3]],
  ["syncGroup", [0, 1, 2, 3]],
  ["offsetCommit", [0, 1, 2, 3, 4, 5]],
  ["offsetFetch", [1, 2, 3, 4]],
  ["initProducerId", [0, 1]],
  ["addPartitionsToTxn", [0, 1]],
  ["addOffsetsToTxn", [0, 1]],
  ["endTxn", [0, 1]],
  ["txnOffsetCommit", [0, 1]],
  ["createTopics", [0, 1, 2, 3]],
  ["deleteTopics", [0, 1]],
  ["createPartitions", [0, 1]],
  ["deleteRecords", [0, 1]],
  ["describeConfigs", [0, 1, 2]],
  ["alterConfigs", [0, 1]],
  ["alterPartitionReassignments", [0]],
  ["listPartitionReassignments", [0]],
  ["describeAcls", [0, 1]],
  ["createAcls", [0, 1]],
  ["deleteAcls", [0, 1]],
  ["describeGroups", [0, 1, 2]],
  ["listGroups", [0, 1, 2]],
  ["deleteGroups", [0, 1]],
  ["saslHandshake", [0, 1]],
  ["saslAuthenticate", [0, 1]],
];

fs.mkdirSync(consumerDir);
fs.writeFileSync(
  path.join(consumerDir, "package.json"),
  JSON.stringify({ name: "packed-consumer", private: true, type: "module" }),
);

try {
  const packOutput = execFileSync("npm", ["pack", "--json", "--pack-destination", tempDir], {
    cwd: root,
    encoding: "utf8",
  });
  const [{ filename }] = JSON.parse(packOutput);
  const tarball = path.join(tempDir, filename);
  const files = execFileSync("tar", ["-tzf", tarball], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);

  for (const requiredFile of [
    "package/index.js",
    "package/index.mjs",
    "package/src/index.js",
    "package/src/errors.js",
    "package/src/errors.mjs",
    "package/src/constants.js",
    "package/src/constants.mjs",
    "package/src/loggers/index.js",
    "package/src/loggers/index.mjs",
    "package/src/loggers/console.js",
    "package/src/loggers/console.mjs",
    "package/src/instrumentation/emitter.js",
    "package/src/instrumentation/emitter.mjs",
    "package/src/instrumentation/event.js",
    "package/src/instrumentation/event.mjs",
    "package/src/instrumentation/eventType.js",
    "package/src/instrumentation/event_type.mjs",
    "package/src/utils/once.js",
    "package/src/utils/once.mjs",
    "package/src/utils/arrayDiff.js",
    "package/src/utils/array_diff.mjs",
    "package/src/utils/groupBy.js",
    "package/src/utils/group_by.mjs",
    "package/src/utils/mapValues.js",
    "package/src/utils/map_values.mjs",
    "package/src/utils/seq.js",
    "package/src/utils/seq.mjs",
    "package/src/utils/swapObject.js",
    "package/src/utils/swap_object.mjs",
    "package/src/utils/uniq.js",
    "package/src/utils/uniq.mjs",
    "package/src/utils/long.js",
    "package/src/utils/long.mjs",
    "package/src/utils/lock.js",
    "package/src/utils/lock.mjs",
    "package/src/utils/sharedPromiseTo.js",
    "package/src/utils/shared_promise_to.mjs",
    "package/src/utils/shuffle.js",
    "package/src/utils/shuffle.mjs",
    "package/src/utils/sleep.js",
    "package/src/utils/sleep.mjs",
    "package/src/utils/waitFor.js",
    "package/src/utils/wait_for.mjs",
    "package/src/utils/websiteUrl.js",
    "package/src/utils/website_url.mjs",
    "package/types/index.d.ts",
  ]) {
    assert(files.includes(requiredFile), `Tarball is missing ${requiredFile}`);
  }
  assert(
    !files.some((file) => /\.spec\.(?:[cm]?js|jsx)$/.test(file)),
    "Tarball includes spec files",
  );
  assert(
    !files.some((file) => /\/(fixtures|testHelpers|scripts)\//.test(file)),
    "Tarball includes test-only files",
  );

  execFileSync(
    "npm",
    ["install", "--no-package-lock", "--ignore-scripts", "--no-audit", "--no-fund", tarball],
    { cwd: consumerDir, stdio: "inherit" },
  );

  const packageJson = require(path.join(consumerDir, "node_modules/@dagher/kafkajs/package.json"));
  assert.equal(packageJson.main, "index.js");
  assert.equal(packageJson.module, "index.mjs");
  assert.equal(packageJson.types, "types/index.d.ts");

  fs.writeFileSync(
    path.join(consumerDir, "require.cjs"),
    `const assert = require("node:assert/strict");
const packageExports = require("@dagher/kafkajs");
assert.equal(typeof packageExports.Kafka, "function");
assert.equal(packageExports.CompressionTypes.GZIP, 1);
assert(new packageExports.KafkaJSError("CommonJS import") instanceof Error);
`,
  );
  fs.writeFileSync(
    path.join(consumerDir, "static-import.mjs"),
    `import assert from "node:assert/strict";
import { Kafka, CompressionTypes, KafkaJSError } from "@dagher/kafkajs";
assert.equal(typeof Kafka, "function");
assert.equal(CompressionTypes.GZIP, 1);
assert(new KafkaJSError("static ESM import") instanceof Error);
`,
  );
  fs.writeFileSync(
    path.join(consumerDir, "dynamic-import.mjs"),
    `import assert from "node:assert/strict";
const packageExports = await import("@dagher/kafkajs");
assert.equal(typeof packageExports.Kafka, "function");
assert.equal(packageExports.CompressionTypes.GZIP, 1);
`,
  );
  fs.writeFileSync(
    path.join(consumerDir, "lazy_protocols.cjs"),
    `const assert = require("node:assert/strict");
const { registerHooks } = require("node:module");
const { pathToFileURL } = require("node:url");
const loaded = new Set();
const hooks = registerHooks({
  load(url, context, nextLoad) {
    loaded.add(url);
    return nextLoad(url, context);
  },
});
const kafka = require("@dagher/kafkajs");
assert(loaded.has(pathToFileURL(require.resolve("@dagher/kafkajs/src/protocol/requests/api_keys.mjs")).href));
const gzipUrl = pathToFileURL(require.resolve("@dagher/kafkajs/src/protocol/message/compression/gzip.mjs")).href;
assert(!loaded.has(gzipUrl));
assert.equal(typeof kafka.CompressionCodecs[kafka.CompressionTypes.GZIP]().compress, "function");
assert(loaded.has(gzipUrl));
for (const [family, versions] of ${JSON.stringify(protocolFamilies)}) {
  const prefix = "@dagher/kafkajs/src/protocol/requests/" + family;
  const registry = require(prefix + "/index.js");
  const urls = versions.map(version => ["request", "response"].map(kind =>
    pathToFileURL(require.resolve(prefix + "/v" + version + "/" + kind + ".mjs")).href,
  ));
  for (const url of urls.flat()) assert(!loaded.has(url), "Prematurely loaded " + url);
  const result = registry.protocol({ version: versions[0] })({ topics: [] });
  assert.equal(result.request.apiVersion, versions[0]);
  assert.equal(result.then, undefined);
  for (const url of urls[0]) assert(loaded.has(url), "Selected module not loaded: " + url);
  for (const url of urls.slice(1).flat()) assert(!loaded.has(url), "Unused version loaded: " + url);
}
hooks.deregister();
`,
  );
  fs.writeFileSync(
    path.join(consumerDir, "mixed-import.mjs"),
    `import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  Kafka,
  KafkaJSError,
  Partitioners,
  CompressionCodecs,
} from "@dagher/kafkajs/index.mjs";
import once from "@dagher/kafkajs/src/utils/once.mjs";
import arrayDiff from "@dagher/kafkajs/src/utils/array_diff.mjs";
import groupBy from "@dagher/kafkajs/src/utils/group_by.mjs";
import mapValues from "@dagher/kafkajs/src/utils/map_values.mjs";
import seq from "@dagher/kafkajs/src/utils/seq.mjs";
import swapObject from "@dagher/kafkajs/src/utils/swap_object.mjs";
import uniq from "@dagher/kafkajs/src/utils/uniq.mjs";
import Long from "@dagher/kafkajs/src/utils/long.mjs";
import Lock from "@dagher/kafkajs/src/utils/lock.mjs";
import sharedPromiseTo from "@dagher/kafkajs/src/utils/shared_promise_to.mjs";
import shuffle from "@dagher/kafkajs/src/utils/shuffle.mjs";
import sleep from "@dagher/kafkajs/src/utils/sleep.mjs";
import waitFor from "@dagher/kafkajs/src/utils/wait_for.mjs";
import websiteUrl from "@dagher/kafkajs/src/utils/website_url.mjs";
import InstrumentationEvent from "@dagher/kafkajs/src/instrumentation/event.mjs";
import InstrumentationEventEmitter from "@dagher/kafkajs/src/instrumentation/emitter.mjs";
import instrumentationEventType from "@dagher/kafkajs/src/instrumentation/event_type.mjs";
import loggers, { LEVELS } from "@dagher/kafkajs/src/loggers/index.mjs";
import LoggerConsole from "@dagher/kafkajs/src/loggers/console.mjs";
import errors, * as namedErrors from "@dagher/kafkajs/src/errors.mjs";
import constants, * as namedConstants from "@dagher/kafkajs/src/constants.mjs";
import Encoder from "@dagher/kafkajs/src/protocol/encoder.mjs";
import Decoder from "@dagher/kafkajs/src/protocol/decoder.mjs";
import compression from "@dagher/kafkajs/src/protocol/message/compression/index.mjs";
import apiKeys from "@dagher/kafkajs/src/protocol/requests/api_keys.mjs";
import protocols from "@dagher/kafkajs/src/protocol/requests/index.mjs";
import createRetry from "@dagher/kafkajs/src/retry/index.mjs";
import RequestQueue from "@dagher/kafkajs/src/network/requestQueue/index.mjs";
import SocketRequest from "@dagher/kafkajs/src/network/requestQueue/socket_request.mjs";
import Connection from "@dagher/kafkajs/src/network/connection.mjs";
import ConnectionPool from "@dagher/kafkajs/src/network/connection_pool.mjs";
import createSocket from "@dagher/kafkajs/src/network/socket.mjs";
import createSocketFactory from "@dagher/kafkajs/src/network/socket_factory.mjs";
import getEnv from "@dagher/kafkajs/src/env.mjs";
import Broker from "@dagher/kafkajs/src/broker/index.mjs";
${protocolFamilies
  .map(
    ([family], index) =>
      `import protocol${index} from "@dagher/kafkajs/src/protocol/requests/${family}/index.mjs";`,
  )
  .join("\n")}

const require = createRequire(import.meta.url);
const commonjs = require("@dagher/kafkajs");
assert.strictEqual(Kafka, commonjs.Kafka);
assert.strictEqual(Partitioners, commonjs.Partitioners);
assert.strictEqual(KafkaJSError, commonjs.KafkaJSError);
assert(new commonjs.KafkaJSError("shared constructor") instanceof KafkaJSError);
assert.strictEqual(require("@dagher/kafkajs/src/utils/once.js"), once);
assert.strictEqual(require("@dagher/kafkajs/src/utils/arrayDiff.js"), arrayDiff);
assert.strictEqual(require("@dagher/kafkajs/src/utils/groupBy.js"), groupBy);
assert.strictEqual(require("@dagher/kafkajs/src/utils/mapValues.js"), mapValues);
assert.strictEqual(require("@dagher/kafkajs/src/utils/seq.js"), seq);
assert.strictEqual(require("@dagher/kafkajs/src/utils/swapObject.js"), swapObject);
assert.strictEqual(require("@dagher/kafkajs/src/utils/uniq.js"), uniq);
assert.strictEqual(require("@dagher/kafkajs/src/utils/long.js"), Long);
assert.strictEqual(require("@dagher/kafkajs/src/utils/long.js").MAX_VALUE, Long.MAX_VALUE);
assert.strictEqual(require("@dagher/kafkajs/src/utils/lock.js"), Lock);
assert.strictEqual(require("@dagher/kafkajs/src/utils/sharedPromiseTo.js"), sharedPromiseTo);
assert.strictEqual(require("@dagher/kafkajs/src/utils/shuffle.js"), shuffle);
assert.strictEqual(require("@dagher/kafkajs/src/utils/sleep.js"), sleep);
assert.strictEqual(require("@dagher/kafkajs/src/utils/waitFor.js"), waitFor);
assert.strictEqual(require("@dagher/kafkajs/src/utils/websiteUrl.js"), websiteUrl);
assert.strictEqual(require("@dagher/kafkajs/src/instrumentation/event.js"), InstrumentationEvent);
assert.strictEqual(require("@dagher/kafkajs/src/instrumentation/emitter.js"), InstrumentationEventEmitter);
assert.strictEqual(require("@dagher/kafkajs/src/instrumentation/eventType.js"), instrumentationEventType);
assert.strictEqual(require("@dagher/kafkajs/src/loggers/index.js"), loggers);
assert.strictEqual(require("@dagher/kafkajs/src/loggers/console.js"), LoggerConsole);
assert.strictEqual(commonjs.LEVELS, LEVELS);
assert.strictEqual(require("@dagher/kafkajs/src/errors.js"), errors);
assert.strictEqual(require("@dagher/kafkajs/src/constants.js"), constants);
assert.strictEqual(require("@dagher/kafkajs/src/protocol/encoder.js"), Encoder);
assert.strictEqual(require("@dagher/kafkajs/src/protocol/decoder.js"), Decoder);
assert.strictEqual(require("@dagher/kafkajs/src/retry/index.js"), createRetry);
assert.strictEqual(require("@dagher/kafkajs/src/network/requestQueue/index.js"), RequestQueue);
assert.strictEqual(require("@dagher/kafkajs/src/network/requestQueue/socketRequest.js"), SocketRequest);
assert.equal(RequestQueue.name, "RequestQueue");
assert.equal(SocketRequest.name, "SocketRequest");
assert.strictEqual(require("@dagher/kafkajs/src/network/connection.js"), Connection);
assert.strictEqual(require("@dagher/kafkajs/src/network/connectionPool.js"), ConnectionPool);
assert.strictEqual(require("@dagher/kafkajs/src/network/socket.js"), createSocket);
assert.strictEqual(require("@dagher/kafkajs/src/network/socketFactory.js"), createSocketFactory);
assert.strictEqual(require("@dagher/kafkajs/src/env.js"), getEnv);
assert.equal(Connection.name, "Connection");
assert.equal(ConnectionPool.name, "ConnectionPool");
const connectionOptions = {
  host: "localhost", port: 9092, connectionTimeout: 1000, requestTimeout: 1000,
  socketFactory: createSocketFactory(),
  logger: loggers.createLogger({ level: LEVELS.NOTHING, logCreator: () => () => {} }),
};
assert.equal(typeof connectionOptions.socketFactory, "function");
const connection = new Connection(connectionOptions);
assert(connection.requestQueue instanceof RequestQueue);
assert.equal(connection.isConnected(), false);
await connection.disconnect();
const pool = new ConnectionPool(connectionOptions);
assert(pool.pool.every(value => value instanceof Connection));
await pool.destroy();
assert.strictEqual(require("@dagher/kafkajs/src/broker/index.js"), Broker);
assert.equal(Broker.name, "Broker");
const broker = new Broker({ connectionPool: pool, logger: connectionOptions.logger });
assert(broker.connectionPool instanceof ConnectionPool);
assert.equal(broker.isConnected(), false);
assert.throws(() => broker.lookupRequest(), /Broker not connected/);
await broker.disconnect();
for (const [oldPath, newPath] of [
  ["retry/defaults", "retry/defaults"],
  ["retry/defaults.test", "retry/defaults_test"],
  ["network/connectionStatus", "network/connection_status"],
  ["network/instrumentationEvents", "network/instrumentation_events"],
]) {
  const { default: implementation } = await import("@dagher/kafkajs/src/" + newPath + ".mjs");
  assert.strictEqual(require("@dagher/kafkajs/src/" + oldPath + ".js"), implementation);
}
assert.equal(await createRetry({ initialRetryTime: 0, factor: 0 })(async () => "retried"), "retried");
const queue = new RequestQueue({
  requestTimeout: 50, maxInFlightRequests: 1, enforceRequestTimeout: false,
  clientId: "packed-consumer", broker: "localhost:9092", logger: { debug() {}, warn() {} },
});
let resolved = 0;
queue.push({
  entry: { correlationId: 0, resolve: () => { resolved++; }, reject: error => { throw error; } },
  sendRequest() {}, expectResponse: false,
});
assert.equal(resolved, 1);
assert.equal(queue.inflight.size, 0);
queue.destroy();
for (const [oldName, newName, publicName] of [
  ["error", "error"],
  ["request", "request"],
  ["crc32", "crc32"],
  ["acl-operation-types", "acl_operation_types", "AclOperationTypes"],
  ["acl-permission-types", "acl_permission_types", "AclPermissionTypes"],
  ["acl-resource-types", "acl_resource_types", "AclResourceTypes"],
  ["config-resource-types", "config_resource_types", "ConfigResourceTypes"],
  ["config-source", "config_source", "ConfigSource"],
  ["resource-pattern-types", "resource_pattern_types", "ResourcePatternTypes"],
  ["coordinatorTypes", "coordinator_types"],
  ["isolationLevel", "isolation_level"],
  ["timestampTypes", "timestamp_types"],
  ["message/compression/index", "message/compression/index"],
  ["message/compression/gzip", "message/compression/gzip"],
  ["message/index", "message/index"],
  ["message/decoder", "message/decoder"],
  ["message/v0/index", "message/v0/index"],
  ["message/v0/decoder", "message/v0/decoder"],
  ["message/v1/index", "message/v1/index"],
  ["message/v1/decoder", "message/v1/decoder"],
  ["messageSet/index", "messageSet/index"],
  ["messageSet/decoder", "messageSet/decoder"],
  ["recordBatch/v0/index", "recordBatch/v0/index"],
  ["recordBatch/v0/decoder", "recordBatch/v0/decoder"],
  ["recordBatch/record/v0/index", "recordBatch/record/v0/index"],
  ["recordBatch/record/v0/decoder", "recordBatch/record/v0/decoder"],
  ["recordBatch/header/v0/index", "recordBatch/header/v0/index"],
  ["recordBatch/header/v0/decoder", "recordBatch/header/v0/decoder"],
  ["recordBatch/crc32C/index", "recordBatch/crc32C/index"],
  ["recordBatch/crc32C/crc32C", "recordBatch/crc32C/crc32_c"],
]) {
  const { default: implementation } = await import("@dagher/kafkajs/src/protocol/" + newName + ".mjs");
  assert.strictEqual(require("@dagher/kafkajs/src/protocol/" + oldName + ".js"), implementation);
  if (publicName) assert.strictEqual(commonjs[publicName], implementation);
}
for (const [name, value] of Object.entries(errors)) {
  assert.strictEqual(namedErrors[name], value);
  assert.strictEqual(commonjs[name], value);
}
for (const [name, value] of Object.entries(constants)) {
  assert.strictEqual(namedConstants[name], value);
}

const codec = () => "registered through ESM";
CompressionCodecs[99] = codec;
assert.strictEqual(commonjs.CompressionCodecs[99](), codec());
assert.strictEqual(compression.Codecs, CompressionCodecs);
assert.strictEqual(compression.lookupCodec(99), codec());
assert.strictEqual(require("@dagher/kafkajs/src/protocol/requests/apiKeys.js"), apiKeys);
assert.strictEqual(require("@dagher/kafkajs/src/protocol/requests/index.js"), protocols);
assert.strictEqual(
  require("@dagher/kafkajs/src/protocol/requests/fetch/v4/decodeMessages.js"),
  (await import("@dagher/kafkajs/src/protocol/requests/fetch/v4/decode_messages.mjs")).default,
);
const staticProtocols = [${protocolFamilies.map((_, index) => `protocol${index}`).join(", ")}];
for (const [index, [family, versions]] of ${JSON.stringify(protocolFamilies)}.entries()) {
  const prefix = "@dagher/kafkajs/src/protocol/requests/" + family;
  const { default: registry } = await import(prefix + "/index.mjs");
  assert.strictEqual(require(prefix + "/index.js"), registry);
  assert.strictEqual(staticProtocols[index], registry);
  assert.deepEqual(registry.versions, versions.map(String));
  for (const version of versions) {
    const protocol = registry.protocol({ version })({ topics: [] });
    assert.equal(protocol.request.apiVersion, version);
    for (const kind of ["request", "response"]) {
      const filename = prefix + "/v" + version + "/" + kind;
      const { default: implementation } = await import(filename + ".mjs");
      assert.strictEqual(require(filename + ".js"), implementation);
    }
  }
}
`,
  );

  fs.writeFileSync(
    path.join(consumerDir, "retry_defaults.mjs"),
    `import assert from "node:assert/strict";
import createRetry from "@dagher/kafkajs/src/retry/index.mjs";
const expected = process.env.NODE_ENV === "test" ? 50 : 300;
await createRetry({ factor: 0, retries: 0 })(async (_bail, retryCount, retryTime) => {
  assert.equal(retryCount, 0);
  assert.equal(retryTime, expected);
});
`,
  );

  for (const file of [
    "require.cjs",
    "static-import.mjs",
    "dynamic-import.mjs",
    "mixed-import.mjs",
    "lazy_protocols.cjs",
  ]) {
    execFileSync(process.execPath, [path.join(consumerDir, file)], {
      cwd: consumerDir,
      stdio: "inherit",
    });
  }

  for (const mode of ["production", "test"]) {
    execFileSync(process.execPath, [path.join(consumerDir, "retry_defaults.mjs")], {
      cwd: consumerDir,
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: mode },
    });
  }

  fs.writeFileSync(
    path.join(consumerDir, "commonjs-consumer.cts"),
    `import KafkaJS = require("@dagher/kafkajs");
const kafka = new KafkaJS.Kafka({ brokers: ["localhost:9092"] });
const compression: KafkaJS.CompressionTypes = KafkaJS.CompressionTypes.GZIP;
void kafka;
void compression;
`,
  );
  fs.writeFileSync(
    path.join(consumerDir, "nodenext-consumer.mts"),
    `import { Kafka, CompressionTypes, KafkaJSError } from "@dagher/kafkajs";
const kafka = new Kafka({ brokers: ["localhost:9092"] });
const compression: CompressionTypes = CompressionTypes.GZIP;
const error = new KafkaJSError("typed package import");
void kafka;
void compression;
void error;
`,
  );

  const tsc = path.join(root, "node_modules/typescript/bin/tsc");
  const typeRoots = path.join(root, "node_modules/@types");
  const commonOptions = ["--noEmit", "--strict", "--types", "node", "--typeRoots", typeRoots];
  execFileSync(
    process.execPath,
    [
      tsc,
      ...commonOptions,
      "--module",
      "Node16",
      "--moduleResolution",
      "Node16",
      path.join(consumerDir, "commonjs-consumer.cts"),
    ],
    { cwd: consumerDir, stdio: "inherit" },
  );
  execFileSync(
    process.execPath,
    [
      tsc,
      ...commonOptions,
      "--module",
      "NodeNext",
      "--moduleResolution",
      "NodeNext",
      path.join(consumerDir, "nodenext-consumer.mts"),
    ],
    { cwd: consumerDir, stdio: "inherit" },
  );

  console.log("Packed consumer contracts passed");
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

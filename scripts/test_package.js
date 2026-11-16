const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "kafkajs-pack-consumer-"));
const consumerDir = path.join(tempDir, "consumer");

fs.mkdirSync(consumerDir);
fs.writeFileSync(
  path.join(consumerDir, "package.json"),
  JSON.stringify({ name: "packed-consumer", private: true, type: "module" }),
);

try {
  const packOutput = execFileSync(
    "npm",
    ["pack", "--json", "--pack-destination", tempDir],
    { cwd: root, encoding: "utf8" },
  );
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
    [
      "install",
      "--no-package-lock",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      tarball,
    ],
    { cwd: consumerDir, stdio: "inherit" },
  );

  const packageJson = require(path.join(
    consumerDir,
    "node_modules/@dagher/kafkajs/package.json",
  ));
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
`,
  );

  for (const file of [
    "require.cjs",
    "static-import.mjs",
    "dynamic-import.mjs",
    "mixed-import.mjs",
  ]) {
    execFileSync(process.execPath, [path.join(consumerDir, file)], {
      cwd: consumerDir,
      stdio: "inherit",
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
  const commonOptions = [
    "--noEmit",
    "--strict",
    "--types",
    "node",
    "--typeRoots",
    typeRoots,
  ];
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

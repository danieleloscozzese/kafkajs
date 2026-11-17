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
    "package/types/index.d.ts",
  ]) {
    assert(files.includes(requiredFile), `Tarball is missing ${requiredFile}`);
  }
  assert(!files.some((file) => /\.spec\.js$/.test(file)), "Tarball includes spec files");
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

const require = createRequire(import.meta.url);
const commonjs = require("@dagher/kafkajs");
assert.strictEqual(Kafka, commonjs.Kafka);
assert.strictEqual(Partitioners, commonjs.Partitioners);
assert.strictEqual(KafkaJSError, commonjs.KafkaJSError);
assert(new commonjs.KafkaJSError("shared constructor") instanceof KafkaJSError);

const codec = () => "registered through ESM";
CompressionCodecs[99] = codec;
assert.strictEqual(commonjs.CompressionCodecs[99](), codec());
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

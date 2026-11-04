# KafkaJS modernisation plan

## Outcome and scope

Modernise this fork without turning a mature Kafka client into a new client.
Preserve upstream KafkaJS behaviour, the fork's minimum-timeout fix, public
contracts, and operational characteristics. Prefer incremental simplification
and native ESM source over a wholesale rewrite.

This document is the planning artefact, not approval to change behaviour or drop
compatibility. Each numbered item below is a proposed PR, not an existing GitHub
PR. Large items must become a short sub-stack of independently green PRs.

The request's "login" could mean application logic or authentication. This plan
covers both the implementation's ESM migration and the actual SASL login code in
`src/broker/saslAuthenticator/`. A SASL rewrite is an optional, evidence-gated
follow-on, not a prerequisite for ESM.

### Non-negotiable constraints

- Keep the fork close enough to upstream to port fixes without reimplementing
  KafkaJS. Record deliberate divergences and their regression tests.
- Preserve producer partition selection, ordering, retries, idempotency,
  transactions, consumer offsets, rebalance/heartbeat semantics, and wire bytes.
- Preserve error classes, retriable flags, event names/payloads, logging contracts,
  custom authentication providers, socket factories, and compression plugins.
- Use npm and the committed lockfile. Do not introduce a TypeScript rewrite,
  mandatory runtime framework, or dependency upgrades unrelated to the PR.
- Keep every merge green. Existing failures are blockers to establish or repair
  explicitly, never a reason to disable suites or silently refresh snapshots.
- Follow `AGENTS.md`: exports at the end, default export before named exports,
  and snake-case names for new or renamed files. For migrated modules use `.mjs`,
  explicit relative extensions, and explicit `index.mjs` paths.

`AGENTS.md` and the ESM skill differ in their example spelling for renamed files;
this plan follows the repository's snake-case rule. Settle that discrepancy
before the first rename rather than mixing naming conventions.

## Repository evidence and immediate risks

These are checkout observations, not claims that the current test suite passes.
No runtime baseline was executed while preparing this documentation-only plan.

| Surface | Current evidence | Planning consequence |
| --- | --- | --- |
| Fork contract | `README.md`, `AGENTS.md`, `src/network/requestQueue/index.js` | Protect the non-negative throttle scheduling fix before touching timer logic. |
| Package entry | `package.json` has `type: commonjs`, `module: index.mjs`, and `types`, but no explicit `main` or `exports` | A bundler-facing `module` field is not a native Node entry-point contract. Establish package-root consumption first. |
| Partial ESM | `index.mjs` re-exports CommonJS internals, including named exports and `LEVELS`; examples request `logLevel` through `../index` | Verify intended names against declarations and consumers; do not make current entry-point inconsistencies the new contract. |
| Runtime/toolchain | Package engine is Node `>=22.0.0`; CI selects Node 24; npm is pinned in `packageManager` | Test the declared minimum and compatible npm/tooling versions, or approve an explicit engine change. Do not assume all Node 22 minors support the same ESM interop. |
| Test harness | Jest 30, CommonJS setup, `.js`-only test regex, `jest.mock`, protocol preload through `glob` and `require` | ESM discovery, mocking, and setup must work before module conversion starts. |
| Static checks | Lint/format shell scripts select only `.js`; flat ESLint config includes ESM; root TS config is separate from declaration tests | Include `.mjs`/`.cjs`, distinguish source types, and add incremental checked-JS coverage. |
| CI gates | `.github/workflows/ci.yml` runs `npm test`; `test:types` is separate | Public declarations need an explicit CI gate, alongside runtime/package smoke tests. |
| Protocol loading | `src/protocol/requests/` selects version modules; test setup eagerly requires protocol files | Preserve synchronous request factories and version negotiation while replacing dynamic loading. |
| Extension state | `src/protocol/message/compression/index.js` exposes mutable `Codecs` | ESM and CommonJS consumers must share registrations and class identity in one process. |
| Integration environment | Compose pins Confluent 5.4.2 with ZooKeeper; CI labels Kafka 2.4 | Retain a legacy lane and add an explicitly pinned modern Kafka lane; an environment variable alone does not change broker images. |
| Documentation/package contents | `docs/Testing.md` still uses yarn; `.npmignore` excludes `.spec.js`, not `.spec.mjs` | Update workflows and pack rules as their corresponding changes land. |

## Architecture and compatibility decisions

### Recommended module strategy

Target native ESM-authored JavaScript with JSDoc, not two hand-maintained source
trees. Keep the synchronous public API synchronous. Do not add top-level `await`
or make constructors, partitioners, codec factories, or protocol lookup async
merely to accommodate imports.

First repair and test an ESM facade over the existing CommonJS implementation.
For object-shaped CommonJS exports, prefer explicit property extraction over
depending on Node's heuristic named-export detection. This is a useful,
releasable intermediate state, not evidence that the implementation is ESM.

Before migrating any module with CommonJS callers, prove a single-source
distribution approach in PR 4. Recommended compatibility model: the CommonJS
entry and ESM facade both reach one canonical synchronous implementation in a
mixed-consumer process; ESM source may need a generated CommonJS distribution
for this. A naive independent ESM/CJS build is unacceptable if it creates two
codec registries or incompatible error constructors.

Do not assume `require(esm)` works on the declared Node 22.0.0 minimum, and do
not insert asynchronous `import()` into synchronous call chains. `createRequire`
can load remaining CommonJS from ESM as a temporary boundary; it is not a way
to load arbitrary ESM synchronously on every supported runtime.

The packaging spike must choose and document exact output paths, import/require
conditions, declaration resolution, source maps, extension rewriting, lazy
loads, and clean-checkout build commands. Add build tooling only if the spike
demonstrates that it is needed and the result preserves contracts. If no simple
approach passes, stop internal conversion at the working facade and propose an
ESM-only major release separately; do not merge a broken hybrid.

Adding `exports` can block previously usable deep imports. Inventory documented
subpaths and representative consumer use before restricting access. Preserve
known supported paths or classify their removal as breaking. Keep the engine
floor unchanged unless a separately approved release decision changes it.

### Rewrite policy

Mechanical module conversion, behaviour-preserving simplification, and behaviour
changes belong in separate commits or PRs. Retain proven implementations of
Kafka protocol encoding, integer handling, partition hashing, CRCs, and SCRAM.
Native `BigInt`, private class fields, new timer abstractions, and new crypto
implementations are not automatic replacements for tested existing code.

A rewrite needs a concrete problem, a smaller proposed design, differential
tests against the old implementation, and an independently reviewable rollback.
If those conditions cannot be met, modernise the module in place.

## Proposed PR stack

Dependencies below are actual prerequisites, not just suggested ordering. Each
PR includes directly related docs and tests; no later "testing PR" repairs an
unsafe intermediate state.

| PR | Scope | Depends on | Completion gate |
| --- | --- | --- | --- |
| 1 | Establish reproducible baseline and compatibility inventory | None | Failures classified; declared runtime and API expectations recorded. |
| 2 | Repair package entry points and add packed-consumer contract tests | 1 | Native import and require work from an installed tarball. |
| 3 | Make lint, Jest, type checks, and CI module-aware | 2 | A representative ESM test and existing CommonJS tests pass together. |
| 4 | Prove single-source ESM distribution and migration boundaries | 3 | Mixed-consumer identity, extensions, types, and synchronous APIs pass. |
| 5 | Convert leaf utilities and foundational modules in small slices | 4 | Each slice preserves values, error identity, and importability. |
| 6 | Convert protocol loading, encoders/decoders, and compression | 5 | Wire fixtures and plugin contracts are unchanged. |
| 7 | Convert transport, request queue, retry, and cluster plumbing | 6 | Timeout, ordering, reconnect, and cleanup regressions pass. |
| 8 | Convert SASL providers; simplify login only if justified | 7 | Authentication vectors, custom providers, and failure paths pass. |
| 9 | Convert producer, consumer, admin, and public client | 8 | Full client and broker-backed acceptance suites pass. |
| 10 | Ratchet JSDoc and simplify measured maintenance hotspots | 9 | Checked-JS scope grows without public API or performance regression. |
| 11 | Expand broker coverage and refresh integration infrastructure | 3 | Legacy and selected modern broker lanes pass reproducibly. |
| 12 | Finish examples, packaging, migration docs, and release | 10, 11 | Clean install, complete matrix, and release checklist pass. |

### PR 1: baseline and invariants

Record a baseline from `npm ci`, lint, declaration checks, and the complete
Kafka-backed suite. Separate missing infrastructure from actual test failures.
Capture Node/npm versions, broker images, test counts, elapsed time, and
intermittent failures in the PR evidence. Repair blocking baseline defects in
small prerequisite commits, rather than bundling them into conversions.

Inventory public exports from `types/index.d.ts`, docs, examples, and runtime
entry points. Include `logLevel`, error constructors, assigners, partitioners,
codec registration, authentication providers, and supported import forms.
Record any pre-existing mismatch and the intended upstream-compatible contract.

Add focused characterization tests around the fork's throttle-delay clamp:
past/zero/future throttle deadlines, pending/non-pending queues, an existing
scheduled check, in-flight saturation, and destroy/late-callback behaviour.
Assert that computed timer delays never become negative and that requests
still progress. Do not blindly clamp all timers or change timeout precedence.

Establish reproducible cold-load, throughput, latency, memory, and shutdown
measurements before changing hot paths. Keep benchmark infrastructure small;
results must identify broker setup, payloads, concurrency, and sample variation.

### PR 2: repair the consumer-facing package boundary

Specify `main`, `module`, `types`, and any `exports` consistently with the
compatibility inventory. Preserve the package name and public export names.
Keep one CommonJS runtime behind both entry forms initially.

Build tarball-consumer smoke fixtures outside the source tree. Install the
actual `npm pack` output and exercise package-name `require`, native static
`import`, and dynamic import; do not substitute direct source imports.
Verify declaration resolution with CommonJS and NodeNext consumers.

Test a single process mixing both entry forms: error `instanceof`, exported
object identity, and a codec registered through one entry and used through
the other. Inspect the tarball to catch missing runtime files and accidental
test/fixture inclusion. Fix examples' root entry assumptions in this PR.

### PR 3: module-aware tooling and continuous verification

Extend lint, format, test discovery, test groups, and pack exclusions to the
extensions actually used. Apply CommonJS source type to remaining CommonJS
files and ESM rules to `.mjs`; avoid granting Jest globals to production code.

Prove Jest's supported native ESM mode on the selected runtimes. Migrate
representative mocks with explicit Jest imports and ESM-compatible mocking
before importing the subject. Update setup/preloading so module registration,
coverage, snapshots, and async initialization retain their existing purpose.
Preserve CommonJS tests during the transition; prevent renamed tests from
silently leaving a group selector.

Add explicit CI gates for declaration tests and packed-consumer smoke tests.
Resolve any compiler-option incompatibilities against the installed compiler
without weakening declaration checking. Exercise the declared Node minimum
with a compatible toolchain and the supported LTS lines at implementation time.
Do not raise the package engine just to satisfy development dependencies
without a separate compatibility decision.

Update `docs/Testing.md` with verified npm commands and distinguish tests that
need Kafka from broker-free tests. Diagnose open handles before considering
removal of `--forceExit`; do not remove it solely as a style change.

### PR 4: packaging spike and first complete ESM slice

Use one small dependency slice with a real CommonJS caller, tests, and a public
path to prove the strategy above. Document the import graph, cycles, mutable
state, dynamic loads, and inbound callers before conversion.

Compare a facade-only stop with the proposed generated distribution. Select
the smallest approach that passes PR 2's complete consumer matrix, including
extension remapping and identity. Production transforms must preserve lazy
loading, observable error names/stacks, and license notices.

If generation is selected, include the reproducible build and release lifecycle
in this PR. Tarballs must build from clean source without relying on untracked
local output. Decide which generated files are committed and enforce that
policy. Do not maintain a second handwritten runtime.

### PR 5: foundational modules

Start with genuinely low-coupling helpers under `src/utils/`, then error
definitions, constants, loggers, and instrumentation as their graphs permit.
Treat this as several small PRs if necessary; a folder is not automatically
an independent migration boundary.

For every slice, rename modules/tests, update all callers and fixtures, preserve
export shape, move exports to the end, and run both module modes. Add accurate
JSDoc at touched boundaries. Use `node:` built-in imports and remove redundant
wrappers only where tests demonstrate equivalent behaviour.

Do not replace Symbol-based state wholesale or globally reformat the tree.
Keep renames/conversion easy to distinguish from logic changes.

### PR 6: protocol and compression

Convert versioned request/response modules in bounded API-family sub-stacks.
Replace computed `require` paths with explicit version-to-module registries
where synchronous lookup requires it. Preserve unsupported-version errors,
version negotiation, and the current request/response factory contracts.

Update test preloading and fixtures deliberately, including JSON loading rules
on the oldest supported runtime. Keep byte-for-byte request fixtures, decoded
responses, partial buffers, int64 offsets, CRCs, compression, and malformed
payload behaviour unchanged. Never convert int64 strings to lossy numbers.

Preserve externally mutable codec registration and synchronous codec factory
lookup. Measure startup cost if explicit registries eagerly load modules that
were previously lazy.

### PR 7: transport and lifecycle

Convert `src/network/`, `src/retry/`, broker/cluster plumbing, and their callers
in dependency order. Keep timer/retry simplification separate from syntax work.

Characterize connection/authentication/request timeout boundaries, throttle
rescheduling, queue FIFO order, correlation IDs, max-in-flight limits, broker
disconnects, pending request rejection, and teardown. Use deterministic clocks
for scheduling assertions plus real-socket tests for lifecycle behaviour.

Check exactly-once settlement and instrumentation, no sends after teardown,
and no leaked timers/listeners. Keep the fork's non-negative scheduling test
mandatory throughout this stack. Preserve retry jitter and backoff semantics;
do not add cancellation or change timeout defaults incidentally.

### PR 8: SASL/login

Migrate `src/broker/saslAuthenticator/` and protocol SASL dependencies to ESM
without rewriting authentication algorithms. Retain PLAIN, SCRAM-SHA-256,
SCRAM-SHA-512, OAuth bearer, AWS IAM, and custom provider contracts.

Cover success and failure, rejected credentials, malformed responses,
unsupported mechanisms, SCRAM nonce/iteration/signature validation, provider
rejection, authentication timeout, session lifetime, and reauthentication.
Keep error classification and logging/redaction behaviour intact. Mechanisms
without a reproducible broker fixture need deterministic protocol/provider
tests and an explicit coverage limitation, not an unsubstantiated integration
claim.

Only propose a separate login-logic rewrite if characterization reveals a
specific maintainability or correctness problem. State the problem, preserve
known protocol vectors, differential-test old/new implementations, and keep
crypto changes out of a module-format PR.

### PR 9: high-level client surfaces

Convert producer/partitioners, consumer/assigners and coordination, admin, then
`src/index.js` and remaining entry wiring. Split by subsystem; keep the public
client conversion last.

Validate partition hashing against existing vectors; ordering and
max-in-flight behaviour; transaction commit/abort and idempotent retry paths;
consumer restart, offset commit, pause/resume, heartbeat and rebalance paths;
and admin error/result shapes. Preserve plugin hooks and event payloads.

Run the complete suite after the root graph is converted. Verify both exported
runtime behaviour and declaration contracts against packed consumer fixtures,
not only tests importing `src/`.

### PR 10: checked JavaScript and targeted simplification

Extend `checkJs`/`// @ts-check` module by module with no-emit checks; the root
`tsconfig.json` alone is not proof of checked production JS. Reuse public
declaration types where appropriate and introduce narrow internal typedefs
for protocol and lifecycle contracts.

Prioritise actionable hotspots found during migration: duplicated lifecycle
cleanup, overly broad callback types, avoidable promise wrappers, confusing
state transitions, and genuinely duplicated transformations. Use standard
library APIs only when semantics and runtime support match.

Keep the public `.d.ts` surface authoritative and tested. No blanket `any`,
suppression comments, speculative abstraction layer, native-integer rewrite,
or switch to a different test framework. Re-run hot-path measurements before
accepting performance-sensitive refactors.

### PR 11: integration environment and dependency hygiene

This branch can proceed after PR 3 independently of source conversion. Select
and pin a modern Kafka image/version and a reproducible KRaft configuration
while retaining the current legacy compatibility lane. Port TLS/SASL, ACLs,
SCRAM provisioning, readiness checks, and multi-broker replication explicitly.
Do not infer support for new Kafka APIs from a successful connection.

Isolate Compose project names, ports, and teardown to the test invocation so
concurrent jobs cannot disrupt one another. Keep readiness timeouts bounded
and report broker logs on failure.

Review dependencies and automation scripts by actual use. Upgrade or replace
older development packages in separate, small changes with their affected
tests; do not perform an undifferentiated "latest everything" update. Preserve
the runtime dependency footprint unless an approved need justifies otherwise.

### PR 12: release readiness

Update examples, `README.md`, `CONTRIBUTING.md`, testing/development docs, and
release scripts for the actual module and npm workflows. Document supported
import forms, plugin registration, Node/broker matrix, intentional compatibility
limits, generated-output policy, and remaining upstream divergences.

Audit `.npmignore` or adopt a tested explicit publish allowlist. Check that
tarballs exclude renamed specs, test keys/fixtures, coverage and tooling while
including all needed modules, types, source maps if promised, and licenses.

Classify changes before choosing a release version: removing CommonJS,
restricting supported deep imports, raising the Node floor, or changing public
behaviour requires an explicit breaking-change decision. Publish a prerelease
only through the authorised release workflow; test representative applications
from the packed/published artefact before a stable release.

## Validation and merge policy

Run the smallest relevant tests during development, then the required gates
before merging. Current commands, to be maintained by PR 3 as discovery changes:

```sh
npm ci
npm run lint
npm run test:types
npm run test:local -- --runInBand --runTestsByPath src/network/requestQueue/index.spec.js
npm test
npm pack --dry-run
```

The request-queue selector is an example, not a substitute for each PR's affected
tests; broker-backed cases still need their documented environment. `npm test`
currently provisions Kafka through `scripts/testWithKafka.sh`. Tarball contents
from `--dry-run` are not a substitute for installing and executing a real tarball.

| Change type | Required evidence |
| --- | --- |
| Module rename/conversion | Affected tests discovered and passing; inbound callers updated; both consumer modes work. |
| Package/toolchain change | Clean install/build; packed import/require and declaration fixtures; oldest supported runtime. |
| Protocol/auth change | Existing golden vectors plus negative cases and applicable broker tests. |
| Lifecycle/concurrency change | Deterministic edge cases, real socket/broker coverage, cleanup/open-handle evidence. |
| Hot-path refactor | Correctness gates plus repeatable before/after performance measurements. |
| Release candidate | Full runtime/broker matrix, complete tests, tarball audit, representative application smoke tests. |

Freeze benchmark scenarios in PR 1. Initially flag repeatable regressions over
5% in throughput or p95 latency, or 10% in cold-load time/RSS, for investigation;
these are proposed review budgets, not measured current results. Compare at
least five runs on the same setup, report variability, and agree revised budgets
before accepting a known regression rather than moving thresholds afterward.

Each PR description should state its parent/dependencies, paths migrated,
behavioural changes (normally none), exact validation evidence, unresolved
limitations, and rollback. Link conceptual PR numbers in this document to real
PRs only as they are created.

## Stop conditions and rollback

Stop the dependent stack if public identity differs between entry forms,
request bytes or partition assignments change unexpectedly, the timeout fix is
lost, tests disappear from discovery, or supported consumers stop resolving
types. Repair the prerequisite before proceeding; do not hide failures behind
new skips, retries, or broad catches.

Land prerequisites bottom-up and rebase descendants after each merge. Keep
conversion separate from simplification so a problematic refactor can be
reverted without undoing package infrastructure. Reverts involving renames must
restore dependent import paths as a coherent unit.

The first useful stopping point is a correctly packaged, verified ESM facade
with modern tooling. The final target is ESM-authored, checked JavaScript with
an explicitly supported distribution contract, preserved KafkaJS behaviour, and
no unexplained difference from the protected baseline.

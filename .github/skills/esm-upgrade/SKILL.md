---
name: "esm-upgrade"
description: "Upgrade a module or group of modules in the project to ESM"
---

# ESM Upgrade Skill

ESM upgrades need to be run accurately:

1. Upgrade the file by rename: `x.js` to `x.mjs`; `xBlahThing.js` to `x-blah-thing.mjs`
2. Update `require` statements to `import` statements.
3. Update `module.exports` to `export` statements:
   - `module.exports = foo` becomes `export default foo`
   - `exports.bar = bar` becomes `export { bar }`
4. Upgrade all dependents to import the updated name
4. Test the module to verify it works correctly after the upgrade.

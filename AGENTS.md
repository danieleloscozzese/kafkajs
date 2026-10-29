# `@danieleloscozzese/kafkajs`

This is a faithful fork of `kafkajs` made to patch a small bug in timeout
handling.
The functionality should follow the main implementation.
The JS can be modernised, annodated with JSDoc and transformed progressively
into ESM.

The package manager is npm and not yarn.

Tests must pass at all stages.

## Style

Exports are always at the end of the file.
`export default` comes before the named exports block.
Renamed or new files are in `snake-case`.

# Changelog

All notable changes to `git-coedit-pmi` are documented here. This project follows
[Semantic Versioning](https://semver.org/) — pin with `git-coedit-pmi@^0.2.0` (or an exact
`0.2.0`) in your `package.json`.

## [0.2.0] — 2026-06-26

### Added
- **`maxFilesPerCommit` option (default `50`)** — skip commits that touch more than N matched
  files. Refactors, merges, and format/lint sweeps create huge `C(n,2)` co-change sets that
  drown the real coupling signal. Set to `Infinity` to restore the 0.1.x behaviour.

### Changed
- **Default behaviour:** mega-commits are now filtered out by default. On refactor-heavy
  histories this sharpens (and changes) the returned pairs — hence the minor version bump.

### Why
- Temporal-holdout testing (train PMI on older commits, predict held-out recent co-changes)
  showed git-PMI beats a random baseline ~2.8× on clean-history repos, but collapses to
  ≈random when refactor/merge commits pollute the counts. This filter is what makes the
  signal robust across repositories.

## [0.1.0] — 2026-06-24

- Initial release. `coeditPmi(repoRoot, options)` mines git history and returns file pairs
  scored by pointwise mutual information; `coeditNeighbors(pairs, file)` is a convenience
  filter for one file's strongest co-change partners. Zero runtime dependencies.

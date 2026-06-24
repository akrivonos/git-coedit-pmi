# git-coedit-pmi

Find the files in a git repository that **change together** — scored by pointwise mutual
information (PMI) over commit history. Zero runtime dependencies (Node built-ins only),
synchronous, returns plain data.

```
PMI(a, b) = log2( P(a ∧ b) / (P(a) · P(b)) )
```

A high PMI means two files co-occur in commits far more often than their individual change
rates would predict — i.e. they're **logically coupled** even if nothing in the import graph
or an embedding model connects them. That signal is useful for:

- ranking/expanding code-retrieval results ("also surface what this file co-changes with"),
- "you touched X — you probably need to look at Y" hints,
- architectural smell detection (coupling across module boundaries).

## Install

```bash
npm install git-coedit-pmi
```

## Usage

```ts
import { coeditPmi, coeditNeighbors } from 'git-coedit-pmi';

const pairs = coeditPmi('/path/to/repo', { commitLimit: 500 });
// pairs: [{ a: 'src/api.ts', b: 'src/api.test.ts', cooccur: 41, pmi: 5.54 }, ...]  (PMI-desc)

// files most coupled to one file:
const neighbors = coeditNeighbors(pairs, 'src/api.ts', 5);
// [{ file: 'src/api.test.ts', pmi: 5.54, cooccur: 41 }, ...]
```

## API

### `coeditPmi(repoRoot, options?): CoeditPair[]`

Mines recent history and returns pairs sorted by PMI descending. Returns `[]` (never throws)
if `repoRoot` isn't a git repo, `git log` fails, or there's too little history.

| option | default | meaning |
|---|---|---|
| `commitLimit` | `500` | how many recent commits to mine |
| `minCooccur` | `2` | drop pairs seen together in fewer than N commits |
| `minPmi` | `1` | drop pairs below this PMI |
| `minCommits` | `5` | below this much history, PMI is unreliable → `[]` |
| `extensions` | common source set | extension allowlist (with dot); pass `null` for all files |

`CoeditPair = { a, b, cooccur, pmi }`, with `a < b` lexicographically.

### `coeditNeighbors(pairs, file, limit?)`

Convenience filter over already-mined pairs: the files most coupled to `file`.

## How it works

Runs `git log -n <N> --name-only`, groups changed files per commit, counts how often each
unordered file pair appears in the same commit, and applies the PMI formula above using each
file's marginal change frequency. Only files matching `extensions` are considered, which keeps
build artifacts and lockfiles from dominating.

## Prior art / honesty note

The *concept* — "logical / evolutionary coupling" from version history — is well established
(Gall et al.; Zimmermann's *Mining Version Histories to Guide Software Changes*, 2004; Adam
Tornhill's `code-maat` and *Your Code as a Crime Scene*). What those tools are is **analysis
CLIs / visualizations**. What this is: a tiny **embeddable library** that hands you the coupling
scores as data, to wire into a retriever, recommender, or agent-context pipeline. That
library-shaped packaging is the gap it fills, not the algorithm.

## License

MIT

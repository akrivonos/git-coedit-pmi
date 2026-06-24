export interface CoeditPair {
    /** Lexicographically smaller path of the pair (a < b). Repo-relative, as git emits. */
    a: string;
    /** Lexicographically larger path of the pair. */
    b: string;
    /** Number of commits in the window that touched BOTH files. */
    cooccur: number;
    /** log2( P(a∧b) / (P(a)·P(b)) ). > 0 means more correlated than independent. */
    pmi: number;
}
export interface CoeditPmiOptions {
    /** How many recent commits to mine. Default 500. */
    commitLimit?: number;
    /** Drop pairs co-occurring in fewer than this many commits (noise floor). Default 2. */
    minCooccur?: number;
    /** Drop pairs below this PMI. Default 1. */
    minPmi?: number;
    /** Below this many commits PMI is statistically unreliable → returns []. Default 5. */
    minCommits?: number;
    /**
     * Allowlist of file extensions WITH the leading dot, e.g. ['.ts', '.tsx']. Only matching
     * files are considered. Pass `null` to consider ALL changed files. Defaults to a common
     * source-code set.
     */
    extensions?: string[] | null;
}
/** Common source-code extensions. Override via `options.extensions` (or pass `null` for all). */
export declare const DEFAULT_EXTENSIONS: string[];
/**
 * Mine co-edit PMI from a git repository's recent history. Returns pairs sorted by PMI
 * descending. Returns [] (never throws) if `repoRoot` is not a git repo, `git log` fails, or
 * there is too little history (< `minCommits`).
 */
export declare function coeditPmi(repoRoot: string, options?: CoeditPmiOptions): CoeditPair[];
/**
 * Convenience: given mined pairs, return the files most coupled to `file`, PMI-descending.
 */
export declare function coeditNeighbors(pairs: CoeditPair[], file: string, limit?: number): Array<{
    file: string;
    pmi: number;
    cooccur: number;
}>;

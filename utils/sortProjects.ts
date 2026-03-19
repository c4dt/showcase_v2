import type { ExtendedProject } from "./loadData";

export function meanEvaluation(interest: Record<string, number> | undefined): number {
  const vals = Object.values(interest ?? {});
  return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
}

export function sortProjects(projects: ExtendedProject[], evaluators: string[]): ExtendedProject[] {
  return [...projects].sort((a, b) => {
    // 1. "2026 Proposal" tag first
    const aProposal = a.tags?.includes("2026 Proposal") ? 1 : 0;
    const bProposal = b.tags?.includes("2026 Proposal") ? 1 : 0;
    if (bProposal !== aProposal) return bProposal - aProposal;

    // 2. Primary sort: evaluator sum (if evaluators selected) OR sortKey
    if (evaluators.length > 0) {
      const score = (p: ExtendedProject) =>
        evaluators.reduce((sum, k) => sum + (((p.showcase_interest as Record<string, number>) ?? {})[k] ?? 0), 0);
      const scoreDiff = score(b) - score(a);
      if (scoreDiff !== 0) return scoreDiff;
    } else {
      const keyDiff =
        ((b as unknown as { sortKey?: number }).sortKey ?? 0) - ((a as unknown as { sortKey?: number }).sortKey ?? 0);
      if (keyDiff !== 0) return keyDiff;
    }

    // 3. Tiebreaker: mean of all evaluations
    return (
      meanEvaluation(b.showcase_interest as Record<string, number>) -
      meanEvaluation(a.showcase_interest as Record<string, number>)
    );
  });
}

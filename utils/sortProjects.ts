import type { ExtendedProject } from "./loadData";

/** Lowercase and strip combining diacritics so "geneve" matches "Genève". */
export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

export function meanEvaluation(interest: Record<string, number> | undefined): number {
  const vals = Object.values(interest ?? {});
  return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
}

/**
 * Returns true if the project matches the query across all fields,
 * including the lab description.
 */
export function projectMatchesSearch(project: ExtendedProject, query: string): boolean {
  if (query === "") return true;
  const q = normalize(query);
  const searchable = normalize(
    [
      project.id,
      project.title,
      project.description ?? "",
      project.tech_desc ?? "",
      project.layman_desc ?? "",
      project.lab.name,
      ...project.lab.prof.name,
      project.lab.description,
      ...(project.tags ?? []),
      ...(project.categories ?? []),
      ...(project.applications ?? [])
    ].join("\n")
  );
  return searchable.includes(q);
}

/**
 * Scores where in the project the query matches, from highest to lowest:
 *   7 — exact project name/id match
 *   6 — project name/id starts with query
 *   5 — project name/id contains query
 *   4 — professor name contains query
 *   3 — lab name contains query
 *   2 — project description/tags/categories/applications contains query
 *   1 — only lab description contains query
 *   0 — no match
 */
export function searchRelevance(project: ExtendedProject, query: string): number {
  if (query === "") return 0;
  const q = normalize(query);
  const title = normalize(project.title);
  const id = normalize(project.id);

  if (title === q || id === q) return 7;
  if (title.startsWith(q) || id.startsWith(q)) return 6;
  if (title.includes(q) || id.includes(q)) return 5;

  if (project.lab.prof.name.some((n) => normalize(n).includes(q))) return 4;

  if (normalize(project.lab.name).includes(q)) return 3;

  const projectDesc = normalize(
    [
      project.description ?? "",
      project.tech_desc ?? "",
      project.layman_desc ?? "",
      ...(project.tags ?? []),
      ...(project.categories ?? []),
      ...(project.applications ?? [])
    ].join("\n")
  );
  if (projectDesc.includes(q)) return 2;

  if (normalize(project.lab.description).includes(q)) return 1;

  return 0;
}

export function sortProjects(
  projects: ExtendedProject[],
  evaluators: string[],
  searchQuery: string = ""
): ExtendedProject[] {
  const relevanceCache = new WeakMap<ExtendedProject, number>();
  const getRelevance = (project: ExtendedProject): number => {
    const cached = relevanceCache.get(project);
    if (cached !== undefined) return cached;
    const score = searchRelevance(project, searchQuery);
    relevanceCache.set(project, score);
    return score;
  };
  return [...projects].sort((a, b) => {
    // 0. If a search query is active, highest relevance wins first
    if (searchQuery !== "") {
      const relDiff = getRelevance(b) - getRelevance(a);
      if (relDiff !== 0) return relDiff;
    }

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

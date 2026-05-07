import type { ExtendedProject } from "./loadData";
import { PROPOSAL_2026_STATUS, PROJECT_C4DT_STATUS, PROJECT_LAB_STATUS } from "./vars";

export const MAX_SEARCH_RELEVANCE = 7;
export const MAX_ACTIVITY_SCORE = 4;

/** Lowercase, strip combining diacritics, and replace hyphens with spaces
 * so "zero-knowledge" and "zero knowledge" index identically. */
export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/-/g, " ");
}

/**
 * Returns true if `q` appears in `haystack` at a word boundary on both sides
 * (not as a substring inside a longer word like "nate" inside "coordinate").
 */
function isWholeWord(haystack: string, q: string): boolean {
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "u").test(haystack);
}

/** Split a query into non-empty tokens on whitespace or hyphens. */
function tokenize(query: string): string[] {
  return query
    .trim()
    .split(/[\s-]+/)
    .filter((t) => t.length > 0);
}

export function meanEvaluation(interest: Record<string, number> | undefined): number {
  const vals = Object.values(interest ?? {});
  return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
}

function singleTokenMatches(project: ExtendedProject, token: string): boolean {
  const q = normalize(token);
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

function singleTokenRelevance(project: ExtendedProject, token: string): number {
  const q = normalize(token);
  const title = normalize(project.title);
  const id = normalize(project.id);

  if (title === q || id === q) return 7;
  if (title.startsWith(q) || id.startsWith(q)) return 6;
  if (title.includes(q) || id.includes(q)) {
    return isWholeWord(title, q) || isWholeWord(id, q) ? 5 : 3;
  }

  // Suggestion 4: startsWith so "nate" only matches name elements that begin with the token,
  // not names that merely contain it as an interior substring.
  if (project.lab.prof.name.some((n) => normalize(n).startsWith(q))) return 4;

  const labName = normalize(project.lab.name);
  if (labName.includes(q)) {
    return isWholeWord(labName, q) ? 3 : 1;
  }

  // Tags get a dedicated tier (same level as lab name) since they are curated keywords.
  const tagsText = normalize((project.tags ?? []).join("\n"));
  if (tagsText.includes(q)) {
    return isWholeWord(tagsText, q) ? 3 : 0;
  }

  const projectDesc = normalize(
    [
      project.description ?? "",
      project.tech_desc ?? "",
      project.layman_desc ?? "",
      ...(project.categories ?? []),
      ...(project.applications ?? [])
    ].join("\n")
  );
  if (projectDesc.includes(q)) {
    return isWholeWord(projectDesc, q) ? 2 : 0;
  }

  const labDesc = normalize(project.lab.description);
  if (labDesc.includes(q)) {
    return isWholeWord(labDesc, q) ? 1 : 0;
  }

  return 0;
}

/**
 * Returns true if the project matches ALL tokens in the query (AND logic).
 */
export function projectMatchesSearch(project: ExtendedProject, query: string): boolean {
  if (query === "") return true;
  const tokens = tokenize(query);
  if (tokens.length === 0) return true;
  return tokens.every((token) => singleTokenMatches(project, token));
}

/**
 * RMS of per-token relevance scores across all tokens in the query.
 * Single-token queries return the same integer score as before.
 * Max value is always ≤ 7, preserving MAX_SEARCH_RELEVANCE for normalisation.
 */
export function searchRelevance(project: ExtendedProject, query: string): number {
  if (query === "") return 0;
  const tokens = tokenize(query);
  if (tokens.length === 0) return 0;
  const scores = tokens.map((token) => singleTokenRelevance(project, token));
  return Math.sqrt(scores.reduce((sum, s) => sum + s * s, 0) / scores.length);
}

/**
 * 5-tier activity score:
 *   4 — 2026 Proposal
 *   3 — C4DT Active (incubated / incubated_market)
 *   2 — Lab Active (recent commits, no C4DT active)
 *   1 — C4DT Retired
 *   0 — else
 */
export function activityScore(project: ExtendedProject): number {
  if (project.tags?.includes(PROPOSAL_2026_STATUS)) return 4;
  if (project.c4dt_status === PROJECT_C4DT_STATUS.ACTIVE) return 3;
  if (project.lab_status === PROJECT_LAB_STATUS.ACTIVE) return 2;
  if (project.c4dt_status === PROJECT_C4DT_STATUS.RETIRED) return 1;
  return 0;
}

/**
 * Composite score combining activity tier, search relevance, and mean showcase interest.
 *   no query:  a + 4*c        (activity dominates; b is 0 anyway)
 *   searching: a + 4*b + 2*c  (relevance dominates; activity breaks ties)
 */
export function compositeScore(project: ExtendedProject, searchQuery: string, maxMeanInterest: number): number {
  const a =
    maxMeanInterest > 0 ? meanEvaluation(project.showcase_interest as Record<string, number>) / maxMeanInterest : 0;
  const b = searchQuery !== "" ? searchRelevance(project, searchQuery) / MAX_SEARCH_RELEVANCE : 0;
  const c = activityScore(project) / MAX_ACTIVITY_SCORE;
  if (searchQuery !== "") return a + 4 * b + 2 * c;
  return a + 4 * c;
}

export function sortProjects(
  projects: ExtendedProject[],
  evaluators: string[],
  searchQuery: string = ""
): ExtendedProject[] {
  // Evaluate mode: existing priority-based sort (unchanged)
  if (evaluators.length > 0) {
    return [...projects].sort((a, b) => {
      const aProposal = a.tags?.includes(PROPOSAL_2026_STATUS) ? 1 : 0;
      const bProposal = b.tags?.includes(PROPOSAL_2026_STATUS) ? 1 : 0;
      if (bProposal !== aProposal) return bProposal - aProposal;

      const score = (p: ExtendedProject) =>
        evaluators.reduce((sum, k) => sum + (((p.showcase_interest as Record<string, number>) ?? {})[k] ?? 0), 0);
      const scoreDiff = score(b) - score(a);
      if (scoreDiff !== 0) return scoreDiff;

      return (
        meanEvaluation(b.showcase_interest as Record<string, number>) -
        meanEvaluation(a.showcase_interest as Record<string, number>)
      );
    });
  }

  // Normal mode: composite weighted score
  const maxMeanInterest = Math.max(
    0,
    ...projects.map((p) => meanEvaluation(p.showcase_interest as Record<string, number>))
  );
  const scoreCache = new Map<string, number>();
  const getScore = (p: ExtendedProject) => {
    if (!scoreCache.has(p.id)) scoreCache.set(p.id, compositeScore(p, searchQuery, maxMeanInterest));
    return scoreCache.get(p.id)!;
  };
  return [...projects].sort((a, b) => getScore(b) - getScore(a));
}

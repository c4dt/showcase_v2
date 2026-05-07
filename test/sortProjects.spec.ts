import { describe, test, expect } from "vitest";
import {
  sortProjects,
  projectMatchesSearch,
  searchRelevance,
  activityScore,
  compositeScore
} from "../utils/sortProjects";
import type { ExtendedProject } from "../utils/loadData";
import { PROJECT_C4DT_STATUS, PROJECT_LAB_STATUS } from "../utils/vars";

// Minimal helper to build a fake ExtendedProject for testing
function makeProject(
  id: string,
  opts: {
    title?: string;
    description?: string;
    tags?: string[];
    sortKey?: number;
    showcase_interest?: Record<string, number>;
    c4dt_status?: PROJECT_C4DT_STATUS;
    lab_status?: PROJECT_LAB_STATUS;
  } = {}
): ExtendedProject {
  return {
    id,
    title: opts.title ?? id,
    description: opts.description ?? "",
    type: "Application",
    categories: [],
    applications: [],
    tags: opts.tags ?? [],
    date_added: "2024-01-01",
    lab: { name: id, prof: { name: [], email: "" }, description: "", url: "" } as ExtendedProject["lab"],
    descriptionDisplay: "",
    status: 0,
    sortKey: opts.sortKey ?? 0,
    showcase_interest: opts.showcase_interest,
    c4dt_status: opts.c4dt_status,
    lab_status: opts.lab_status
  } as unknown as ExtendedProject;
}

describe("sortProjects", () => {
  test("'2026 Proposal' projects come before all others (non-evaluateMode)", () => {
    const A = makeProject("A", { sortKey: 12 });
    const B = makeProject("B", { tags: ["2026 Proposal"], sortKey: 1 });
    expect(sortProjects([A, B], [])).toEqual([B, A]);
  });

  test("within same proposal-group, higher mean interest ranks first", () => {
    const A = makeProject("A", { showcase_interest: { x: 4 } });
    const B = makeProject("B", { showcase_interest: { x: 2 } });
    const C = makeProject("C", { tags: ["2026 Proposal"], showcase_interest: { x: 5 } });
    const D = makeProject("D", { tags: ["2026 Proposal"], showcase_interest: { x: 1 } });
    expect(sortProjects([A, B, C, D], [])).toEqual([C, D, A, B]);
  });

  test("equal activity tier → mean evaluation is tiebreaker (non-evaluateMode)", () => {
    const A = makeProject("A", { showcase_interest: { x: 2.0 } });
    const B = makeProject("B", { showcase_interest: { x: 4.0 } });
    expect(sortProjects([A, B], [])).toEqual([B, A]);
  });

  test("'2026 Proposal' projects come first in evaluateMode", () => {
    const A = makeProject("A", { showcase_interest: { carine: 10 } });
    const B = makeProject("B", { tags: ["2026 Proposal"], showcase_interest: { carine: 2 } });
    expect(sortProjects([A, B], ["carine"])).toEqual([B, A]);
  });

  test("equal evaluator score → mean evaluation tiebreaker (evaluateMode)", () => {
    // evaluators=["x","y"]: both have sum=5; A mean=2.5, B mean=(4+1+3)/3≈2.67 → B wins
    const A = makeProject("A", { showcase_interest: { x: 3, y: 2 } });
    const B = makeProject("B", { showcase_interest: { x: 4, y: 1, z: 3 } });
    expect(sortProjects([A, B], ["x", "y"])).toEqual([B, A]);
  });

  test("no proposals → sorted by activity tier then mean evaluation", () => {
    const A = makeProject("A", { c4dt_status: PROJECT_C4DT_STATUS.ACTIVE, showcase_interest: { x: 2 } });
    const B = makeProject("B", { lab_status: PROJECT_LAB_STATUS.ACTIVE });
    const C = makeProject("C", { c4dt_status: PROJECT_C4DT_STATUS.ACTIVE, showcase_interest: { x: 4 } });
    // C: c=3, a=1.0 → score=3+1=4; A: c=3, a=0.5 → score=3+0.5=3.5; B: c=2, a=0 → score=2
    expect(sortProjects([A, B, C], [])).toEqual([C, A, B]);
  });
});

describe("projectMatchesSearch", () => {
  test("matches via lab description", () => {
    const p = makeProject("other");
    (p.lab as unknown as Record<string, unknown>).description = "techniques to discover bugs";
    expect(projectMatchesSearch(p, "disco")).toBe(true);
  });

  test("matches via lab name", () => {
    const p = makeProject("proj1");
    (p.lab as unknown as Record<string, unknown>).name = "Disco Lab";
    expect(projectMatchesSearch(p, "disco")).toBe(true);
  });

  test("matches via professor name", () => {
    const p = makeProject("proj1");
    (p.lab as unknown as Record<string, unknown>).prof = { name: ["Jane", "Disco"], email: "" };
    expect(projectMatchesSearch(p, "disco")).toBe(true);
  });

  test("matches via project id", () => {
    const p = makeProject("disco", { title: "Disco" });
    expect(projectMatchesSearch(p, "disco")).toBe(true);
  });

  test("matches via project title", () => {
    const p = makeProject("other", { title: "Disco" });
    expect(projectMatchesSearch(p, "disco")).toBe(true);
  });

  test("matches via project description", () => {
    const p = makeProject("other", { description: "uses disco protocol" });
    expect(projectMatchesSearch(p, "disco")).toBe(true);
  });

  test("returns true for empty query", () => {
    const p = makeProject("anything");
    expect(projectMatchesSearch(p, "")).toBe(true);
  });
});

describe("projectMatchesSearch — multi-token", () => {
  test("two-token AND: matches project with first token in title, second in description", () => {
    const p = makeProject("p", { title: "Zero-Knowledge Proof", description: "uses blockchain technology" });
    expect(projectMatchesSearch(p, "zero blockchain")).toBe(true);
  });

  test("two-token AND: does NOT match when second token is absent", () => {
    const p = makeProject("p", { title: "Zero-Knowledge Proof", description: "nothing related" });
    expect(projectMatchesSearch(p, "zero blockchain")).toBe(false);
  });

  test("all-whitespace query treated as empty → returns true", () => {
    const p = makeProject("p");
    expect(projectMatchesSearch(p, "   ")).toBe(true);
  });

  test("single-token query behaves as before", () => {
    const p = makeProject("disco", { title: "Disco" });
    expect(projectMatchesSearch(p, "disco")).toBe(true);
  });
});

describe("searchRelevance", () => {
  test("exact title match scores 7", () => {
    const p = makeProject("x", { title: "Disco" });
    expect(searchRelevance(p, "Disco")).toBe(7);
  });

  test("exact id match scores 7", () => {
    const p = makeProject("disco", { title: "Other" });
    expect(searchRelevance(p, "disco")).toBe(7);
  });

  test("title prefix match scores 6", () => {
    const p = makeProject("x", { title: "Discotron" });
    expect(searchRelevance(p, "disco")).toBe(6);
  });

  test("title contains query (non-prefix) scores 5", () => {
    const p = makeProject("x", { title: "My Disco Thing" });
    expect(searchRelevance(p, "disco")).toBe(5);
  });

  test("professor name match scores 4", () => {
    const p = makeProject("proj1");
    (p.lab as unknown as Record<string, unknown>).prof = { name: ["Carmela", "Troncoso"], email: "" };
    expect(searchRelevance(p, "troncoso")).toBe(4);
  });

  test("lab name match scores 3", () => {
    const p = makeProject("proj1");
    (p.lab as unknown as Record<string, unknown>).name = "SPRING";
    expect(searchRelevance(p, "spring")).toBe(3);
  });

  test("project description match scores 2", () => {
    const p = makeProject("other", { description: "uses disco protocol" });
    expect(searchRelevance(p, "disco")).toBe(2);
  });

  test("lab description only match scores 1", () => {
    const p = makeProject("other");
    (p.lab as unknown as Record<string, unknown>).description = "the disco library";
    expect(searchRelevance(p, "disco")).toBe(1);
  });

  test("no match scores 0", () => {
    const p = makeProject("other", { title: "Other", description: "unrelated content" });
    expect(searchRelevance(p, "disco")).toBe(0);
  });

  test("empty query scores 0", () => {
    const p = makeProject("disco", { title: "Disco" });
    expect(searchRelevance(p, "")).toBe(0);
  });
});

describe("searchRelevance — multi-token RMS", () => {
  test("two tokens: title(5) + description(2) → RMS ≈ 3.81", () => {
    // id "some-project" does not match "eid"; title contains "eid" but does not start with it → score 5
    const p = makeProject("some-project", { title: "My EID Thing", description: "contains demo feature" });
    // "eid" → title contains → 5; "demo" → description contains → 2
    // RMS = sqrt((25 + 4) / 2) = sqrt(14.5) ≈ 3.8078
    expect(searchRelevance(p, "eid demo")).toBeCloseTo(Math.sqrt(29 / 2), 5);
  });

  test("three tokens 5,2,5 → RMS ≈ 4.24", () => {
    // title starts with "My", so "zero" is a contains-match (5), not a startsWith-match (6)
    const p = makeProject("zkp", {
      title: "My Zero Knowledge Proofs",
      description: "privacy enhancing tech"
    });
    // "zero" → title contains (not starts) → 5; "privacy" → description → 2; "proofs" → title contains → 5
    expect(searchRelevance(p, "zero privacy proofs")).toBeCloseTo(Math.sqrt(54 / 3), 5);
  });

  test("single-token RMS equals the raw score", () => {
    const p = makeProject("x", { title: "My Disco Thing" });
    expect(searchRelevance(p, "disco")).toBe(5);
  });
});

describe("activityScore", () => {
  test("returns 4 for 2026 Proposal tag", () => {
    const p = makeProject("A", { tags: ["2026 Proposal"] });
    expect(activityScore(p)).toBe(4);
  });

  test("returns 3 for c4dt_status=ACTIVE", () => {
    const p = makeProject("A", { c4dt_status: PROJECT_C4DT_STATUS.ACTIVE });
    expect(activityScore(p)).toBe(3);
  });

  test("returns 2 for lab_status=ACTIVE (no C4DT)", () => {
    const p = makeProject("A", { lab_status: PROJECT_LAB_STATUS.ACTIVE });
    expect(activityScore(p)).toBe(2);
  });

  test("returns 1 for c4dt_status=RETIRED", () => {
    const p = makeProject("A", { c4dt_status: PROJECT_C4DT_STATUS.RETIRED });
    expect(activityScore(p)).toBe(1);
  });

  test("returns 0 for no status", () => {
    const p = makeProject("A");
    expect(activityScore(p)).toBe(0);
  });

  test("C4DT Active takes precedence over Lab Active", () => {
    const p = makeProject("A", {
      c4dt_status: PROJECT_C4DT_STATUS.ACTIVE,
      lab_status: PROJECT_LAB_STATUS.ACTIVE
    });
    expect(activityScore(p)).toBe(3);
  });

  test("2026 Proposal takes precedence over C4DT Active", () => {
    const p = makeProject("A", {
      tags: ["2026 Proposal"],
      c4dt_status: PROJECT_C4DT_STATUS.ACTIVE
    });
    expect(activityScore(p)).toBe(4);
  });
});

describe("compositeScore", () => {
  test("activity-only (no search, no interest): 4 * (c/4)", () => {
    const p = makeProject("A", { c4dt_status: PROJECT_C4DT_STATUS.ACTIVE });
    // c=3, c_norm=0.75, score = 4*0.75 = 3.0
    expect(compositeScore(p, "", 0)).toBeCloseTo(3.0, 5);
  });

  test("exact-name search with no activity: 4 * (7/7) = 4.0", () => {
    const p = makeProject("disco", { title: "Disco" });
    expect(compositeScore(p, "disco", 0)).toBeCloseTo(4.0, 5);
  });

  test("interest only (no search, no activity): a = interest/maxMeanInterest", () => {
    const p = makeProject("A", { showcase_interest: { x: 5 } });
    expect(compositeScore(p, "", 10)).toBeCloseTo(0.5, 5);
  });

  test("all three combined: a + 4*b + 2*c", () => {
    // exact title match → b=7/7=1; c4dt_active → c=3/4=0.75; interest 4/8=0.5
    const p = makeProject("disco", {
      title: "Disco",
      c4dt_status: PROJECT_C4DT_STATUS.ACTIVE,
      showcase_interest: { x: 4 }
    });
    // score = 0.5 + 4*1.0 + 2*0.75 = 0.5 + 4.0 + 1.5 = 6.0
    expect(compositeScore(p, "disco", 8)).toBeCloseTo(6.0, 5);
  });
});

describe("hyphen as word boundary in queries", () => {
  test("'zero-knowledge' and 'zero knowledge' match the same project", () => {
    const p = makeProject("zksk", { tags: ["Zero-Knowledge Proofs"] });
    expect(projectMatchesSearch(p, "zero-knowledge")).toBe(true);
    expect(projectMatchesSearch(p, "zero knowledge")).toBe(true);
  });

  test("hyphenated query token split gives same relevance as space-separated", () => {
    const p = makeProject("zksk", { tags: ["Zero-Knowledge Proofs"] });
    expect(searchRelevance(p, "zero-knowledge")).toBeCloseTo(searchRelevance(p, "zero knowledge"), 5);
  });

  test("tag whole-word match scores 3", () => {
    const p = makeProject("x", { tags: ["Zero-Knowledge Proofs"] });
    expect(searchRelevance(p, "zero")).toBe(3);
    expect(searchRelevance(p, "knowledge")).toBe(3);
    expect(searchRelevance(p, "proofs")).toBe(3);
  });

  test("mid-word substring inside a tag scores 0", () => {
    const p = makeProject("x", { tags: ["Zero-Knowledge Proofs"] });
    // "ledge" is a mid-word substring of "knowledge" → should not score
    expect(searchRelevance(p, "ledge")).toBe(0);
  });
});

describe("accent handling in search", () => {
  test("matches description containing accented text when query uses same accent", () => {
    const p = makeProject("city-proj", { description: "A project based in Genève, Switzerland" });
    expect(projectMatchesSearch(p, "Genève")).toBe(true);
  });

  test("case-insensitive accent match works (lowercase query)", () => {
    const p = makeProject("city-proj", { description: "A project based in Genève, Switzerland" });
    expect(projectMatchesSearch(p, "genève")).toBe(true);
  });

  test("query without accent matches accented description (accent-folding)", () => {
    // id and title are unrelated so only the description is the potential match site
    const p = makeProject("city-proj", { title: "CityProject", description: "A project based in Genève, Switzerland" });
    expect(projectMatchesSearch(p, "Geneve")).toBe(true);
  });

  test("accented project appears in sortProjects results when query matches", () => {
    const p = makeProject("city-proj", {
      title: "CityProject",
      description: "A project based in Genève, Switzerland",
      sortKey: 5
    });
    const other = makeProject("other", { description: "unrelated", sortKey: 5 });
    const result = sortProjects([other, p], [], "genève");
    expect(result.map((r) => r.id)).toContain("city-proj");
  });
});

describe("sortProjects with search query", () => {
  test("exact title match beats same-sortKey description-only match", () => {
    const disco = makeProject("disco", { title: "Disco", sortKey: 12 });
    // "other" matches "disco" only via its description (substring of "discover")
    const other = makeProject("other", { title: "Other", description: "let's discover things", sortKey: 12 });
    const result = sortProjects([other, disco], [], "disco");
    expect(result[0].id).toBe("disco");
  });

  test("without search query, existing sort order is preserved", () => {
    const A = makeProject("A", { sortKey: 12 });
    const B = makeProject("B", { tags: ["2026 Proposal"], sortKey: 1 });
    expect(sortProjects([A, B], [])).toEqual([B, A]);
  });

  test("active C4DT project ranks above retired with same search relevance", () => {
    // both titles contain "eid" → same relevance; active beats retired via activityScore
    const retired = makeProject("eid-old", {
      title: "EID Old",
      c4dt_status: PROJECT_C4DT_STATUS.RETIRED
    });
    const active = makeProject("eid-new", {
      title: "EID New",
      c4dt_status: PROJECT_C4DT_STATUS.ACTIVE
    });
    const result = sortProjects([retired, active], [], "eid");
    expect(result[0].id).toBe("eid-new");
  });
});

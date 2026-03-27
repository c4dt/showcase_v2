import { describe, test, expect } from "vitest";
import { sortProjects, projectMatchesSearch, searchRelevance } from "../utils/sortProjects";
import type { ExtendedProject } from "../utils/loadData";

// Minimal helper to build a fake ExtendedProject for testing
function makeProject(
  id: string,
  opts: {
    name?: string;
    description?: string;
    tags?: string[];
    sortKey?: number;
    showcase_interest?: Record<string, number>;
  } = {}
): ExtendedProject {
  return {
    id,
    name: opts.name ?? id,
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
    showcase_interest: opts.showcase_interest
  } as unknown as ExtendedProject;
}

describe("sortProjects", () => {
  test("'2026 Proposal' projects come before all others (non-evaluateMode)", () => {
    const A = makeProject("A", { sortKey: 12 });
    const B = makeProject("B", { tags: ["2026 Proposal"], sortKey: 1 });
    expect(sortProjects([A, B], [])).toEqual([B, A]);
  });

  test("within same proposal-group, sortKey ordering is maintained", () => {
    const A = makeProject("A", { sortKey: 12 });
    const B = makeProject("B", { sortKey: 5 });
    const C = makeProject("C", { tags: ["2026 Proposal"], sortKey: 12 });
    const D = makeProject("D", { tags: ["2026 Proposal"], sortKey: 5 });
    expect(sortProjects([A, B, C, D], [])).toEqual([C, D, A, B]);
  });

  test("equal sortKey → mean evaluation is tiebreaker (non-evaluateMode)", () => {
    const A = makeProject("A", { sortKey: 5, showcase_interest: { x: 2.0 } });
    const B = makeProject("B", { sortKey: 5, showcase_interest: { x: 4.0 } });
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

  test("no proposals → sorted by sortKey desc, then mean desc", () => {
    const A = makeProject("A", { sortKey: 5, showcase_interest: { x: 2 } });
    const B = makeProject("B", { sortKey: 10 });
    const C = makeProject("C", { sortKey: 5, showcase_interest: { x: 4 } });
    expect(sortProjects([A, B, C], [])).toEqual([B, C, A]);
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
    const p = makeProject("disco", { name: "Disco" });
    expect(projectMatchesSearch(p, "disco")).toBe(true);
  });

  test("matches via project name", () => {
    const p = makeProject("other", { name: "Disco" });
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

describe("searchRelevance", () => {
  test("exact name match scores 7", () => {
    const p = makeProject("x", { name: "Disco" });
    expect(searchRelevance(p, "Disco")).toBe(7);
  });

  test("exact id match scores 7", () => {
    const p = makeProject("disco", { name: "Other" });
    expect(searchRelevance(p, "disco")).toBe(7);
  });

  test("name prefix match scores 6", () => {
    const p = makeProject("x", { name: "Discotron" });
    expect(searchRelevance(p, "disco")).toBe(6);
  });

  test("name contains query (non-prefix) scores 5", () => {
    const p = makeProject("x", { name: "My Disco Thing" });
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
    (p.lab as unknown as Record<string, unknown>).description = "techniques to discover bugs";
    expect(searchRelevance(p, "disco")).toBe(1);
  });

  test("no match scores 0", () => {
    const p = makeProject("other", { name: "Other", description: "unrelated content" });
    expect(searchRelevance(p, "disco")).toBe(0);
  });

  test("empty query scores 0", () => {
    const p = makeProject("disco", { name: "Disco" });
    expect(searchRelevance(p, "")).toBe(0);
  });
});

describe("sortProjects with search query", () => {
  test("exact name match beats same-sortKey description-only match", () => {
    const disco = makeProject("disco", { name: "Disco", sortKey: 12 });
    // "other" matches "disco" only via its description (substring of "discover")
    const other = makeProject("other", { name: "Other", description: "let's discover things", sortKey: 12 });
    const result = sortProjects([other, disco], [], "disco");
    expect(result[0].id).toBe("disco");
  });

  test("without search query, existing sort order is preserved", () => {
    const A = makeProject("A", { sortKey: 12 });
    const B = makeProject("B", { tags: ["2026 Proposal"], sortKey: 1 });
    expect(sortProjects([A, B], [])).toEqual([B, A]);
  });
});

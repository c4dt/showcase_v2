import { describe, test, expect } from "vitest";
import { sortProjects } from "../utils/sortProjects";
import type { ExtendedProject } from "../utils/loadData";

// Minimal helper to build a fake ExtendedProject for testing
function makeProject(
  id: string,
  opts: {
    tags?: string[];
    sortKey?: number;
    showcase_interest?: Record<string, number>;
  } = {}
): ExtendedProject {
  return {
    id,
    name: id,
    description: "",
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

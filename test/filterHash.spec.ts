import { describe, test, expect } from "vitest";
import { serializeHash, deserializeHash, DEFAULT_FILTER_STATE, type FilterState } from "../utils/filterHash";

describe("serializeHash", () => {
  test("returns '' for default/all-empty FilterState", () => {
    expect(serializeHash(DEFAULT_FILTER_STATE)).toBe("");
  });

  test("encodes search field", () => {
    expect(serializeHash({ ...DEFAULT_FILTER_STATE, search: "foo" })).toBe("search=foo");
  });

  test("encodes multiple fields in fixed key order", () => {
    const state: FilterState = { search: "foo", lab: "MyLab", category: "", application: "", status: "", tags: [] };
    expect(serializeHash(state)).toBe("search=foo&lab=MyLab");
  });

  test("encodes multi-select tags as repeated keys", () => {
    const state: FilterState = { ...DEFAULT_FILTER_STATE, tags: ["a", "b"] };
    expect(serializeHash(state)).toBe("tags=a&tags=b");
  });

  test("percent-encodes some special chars (spaces, &, =, #)", () => {
    const result = serializeHash({ ...DEFAULT_FILTER_STATE, search: "a b&c=d#e" });
    // URLSearchParams encodes space as +, & as %26, = as %3D, # as %23
    expect(result).toContain("search=");
    expect(result).not.toContain("&c"); // & must be encoded
    expect(result).not.toContain("=d"); // = must be encoded (after the key=value =)
    // Decode back and verify round-trip
    const decoded = new URLSearchParams(result).get("search");
    expect(decoded).toBe("a b&c=d#e");
  });
});

describe("deserializeHash", () => {
  test("returns DEFAULT_FILTER_STATE for '' input", () => {
    expect(deserializeHash("")).toEqual(DEFAULT_FILTER_STATE);
  });

  test("strips leading '#' before parsing", () => {
    expect(deserializeHash("#search=foo")).toEqual({ ...DEFAULT_FILTER_STATE, search: "foo" });
    expect(deserializeHash("search=foo")).toEqual({ ...DEFAULT_FILTER_STATE, search: "foo" });
  });

  test("parses search=foo", () => {
    expect(deserializeHash("search=foo")).toEqual({ ...DEFAULT_FILTER_STATE, search: "foo" });
  });

  test("parses lab=MyLab independently", () => {
    expect(deserializeHash("lab=MyLab")).toEqual({ ...DEFAULT_FILTER_STATE, lab: "MyLab" });
  });

  test("parses category=ML independently", () => {
    expect(deserializeHash("category=ML")).toEqual({ ...DEFAULT_FILTER_STATE, category: "ML" });
  });

  test("parses repeated tags= into array", () => {
    expect(deserializeHash("tags=a&tags=b")).toEqual({ ...DEFAULT_FILTER_STATE, tags: ["a", "b"] });
  });

  test("ignores unknown keys silently", () => {
    expect(deserializeHash("unknown=foo&search=bar")).toEqual({ ...DEFAULT_FILTER_STATE, search: "bar" });
  });

  test("handles percent-encoded values", () => {
    expect(deserializeHash("search=hello%20world")).toEqual({ ...DEFAULT_FILTER_STATE, search: "hello world" });
  });

  test("round-trips: deserializeHash(serializeHash(state)) equals state", () => {
    const state: FilterState = {
      search: "hello world",
      lab: "My Lab",
      category: "ML",
      application: "App",
      status: "Active",
      tags: ["Privacy", "Security"]
    };
    expect(deserializeHash(serializeHash(state))).toEqual(state);
  });

  test("round-trips empty state", () => {
    expect(deserializeHash(serializeHash(DEFAULT_FILTER_STATE))).toEqual(DEFAULT_FILTER_STATE);
  });
});

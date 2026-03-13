import { describe, test, expect, vi, beforeEach } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import { defineComponent, ref, nextTick } from "vue";
import { useFilterHash } from "~/composables/useFilterHash";
import { DEFAULT_FILTER_STATE } from "~/utils/filterHash";

// State store for mocked useState — reset before each test for isolation
let stateStore: Map<string, ReturnType<typeof ref>>;

const { useStateMock } = vi.hoisted(() => ({
  useStateMock: vi.fn()
}));

mockNuxtImport("useState", () => useStateMock);

// Capture the composable's return value from the last mount
let lastFilterHash: ReturnType<typeof useFilterHash>;

// Minimal test component that exposes useFilterHash return values
const TestComponent = defineComponent({
  setup() {
    const fh = useFilterHash();
    lastFilterHash = fh;
    return fh;
  },
  template: "<div />"
});

beforeEach(() => {
  stateStore = new Map();
  useStateMock.mockImplementation(<T>(key: string, init?: () => T) => {
    if (!stateStore.has(key)) {
      stateStore.set(key, ref(init ? init() : undefined));
    }
    return stateStore.get(key);
  });
});

describe("initial state", () => {
  test("returns DEFAULT_FILTER_STATE when window.location.hash is ''", async () => {
    history.replaceState(null, "", "/");
    await mountSuspended(TestComponent);
    await nextTick();
    expect(
      Object.fromEntries(Object.keys(DEFAULT_FILTER_STATE).map((k) => [k, stateStore.get(`filter-${k}`)!.value]))
    ).toEqual(DEFAULT_FILTER_STATE);
  });

  test("initializes search from hash '#search=hello'", async () => {
    history.replaceState(null, "", "/#search=hello");
    await mountSuspended(TestComponent);
    await nextTick();
    expect(stateStore.get("filter-search")!.value).toBe("hello");
  });

  test("initializes tags from '#tags=Privacy&tags=Security'", async () => {
    history.replaceState(null, "", "/#tags=Privacy&tags=Security");
    await mountSuspended(TestComponent);
    await nextTick();
    expect(stateStore.get("filter-tags")!.value).toEqual(["Privacy", "Security"]);
  });
});

describe("hash write-back", () => {
  test("modifying search updates window.location.hash", async () => {
    history.replaceState(null, "", "/");
    await mountSuspended(TestComponent);
    await nextTick();
    stateStore.get("filter-search")!.value = "foo";
    await nextTick();
    expect(window.location.hash).toBe("#search=foo");
  });

  test("modifying tags updates hash with repeated tags= params", async () => {
    history.replaceState(null, "", "/");
    await mountSuspended(TestComponent);
    await nextTick();
    stateStore.get("filter-tags")!.value = ["a", "b"];
    await nextTick();
    expect(window.location.hash).toBe("#tags=a&tags=b");
  });

  test("clearing all fields sets hash to ''", async () => {
    history.replaceState(null, "", "/#search=foo");
    await mountSuspended(TestComponent);
    await nextTick();
    stateStore.get("filter-search")!.value = "";
    await nextTick();
    expect(window.location.hash).toBe("");
  });
});

describe("resetFilters()", () => {
  test("resets all fields to DEFAULT_FILTER_STATE", async () => {
    history.replaceState(null, "", "/#search=foo&lab=bar");
    await mountSuspended(TestComponent);
    await nextTick();
    lastFilterHash.resetFilters();
    await nextTick();
    expect(
      Object.fromEntries(Object.keys(DEFAULT_FILTER_STATE).map((k) => [k, stateStore.get(`filter-${k}`)!.value]))
    ).toEqual(DEFAULT_FILTER_STATE);
  });

  test("clears window.location.hash after reset", async () => {
    history.replaceState(null, "", "/#search=foo");
    await mountSuspended(TestComponent);
    await nextTick();
    lastFilterHash.resetFilters();
    await nextTick();
    expect(window.location.hash).toBe("");
  });
});

describe("hashchange event", () => {
  test("updates filterState when hashchange is dispatched", async () => {
    history.replaceState(null, "", "/");
    await mountSuspended(TestComponent);
    await nextTick();
    history.replaceState(null, "", "/#search=bar");
    window.dispatchEvent(new Event("hashchange"));
    await nextTick();
    expect(stateStore.get("filter-search")!.value).toBe("bar");
  });
});

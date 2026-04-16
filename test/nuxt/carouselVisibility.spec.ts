import { ref, computed } from "vue";
import { test, expect, vi, beforeEach } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import IndexPage from "~/pages/index.vue";

// --- useFilterHash mock ---
const { useFilterHashMock } = vi.hoisted(() => {
  return {
    useFilterHashMock: vi.fn()
  };
});

mockNuxtImport("useFilterHash", () => {
  return useFilterHashMock;
});

// --- useState mock ---
const { useStateMock } = vi.hoisted(() => {
  return {
    useStateMock: vi.fn(() => {
      return { value: [] };
    })
  };
});

mockNuxtImport("useState", () => {
  return useStateMock;
});

// --- useRuntimeConfig mock ---
const { useRuntimeConfigMock } = vi.hoisted(() => {
  return {
    useRuntimeConfigMock: vi.fn(() => ({
      public: { evaluateMode: false, playwrightTest: false }
    }))
  };
});

mockNuxtImport("useRuntimeConfig", () => {
  return useRuntimeConfigMock;
});

const projects = [
  {
    id: "a",
    title: "Alpha",
    description: "",
    type: "",
    categories: ["cat1"],
    applications: ["app1"],
    tags: ["tag1"],
    date_added: "2024-01-01",
    lab: { name: "LabA", prof: { name: ["Alice"] } },
    descriptionDisplay: "",
    c4dt_status: "Active",
    lab_status: "Active",
    showcase_interest: {}
  }
];

function makeFilterHash(overrides: Record<string, unknown> = {}) {
  return {
    search: overrides.search ?? ref(""),
    lab: overrides.lab ?? ref(""),
    category: overrides.category ?? ref(""),
    application: overrides.application ?? ref(""),
    status: overrides.status ?? ref(""),
    tags: overrides.tags ?? ref([]),
    searchQuery: computed({ get: () => "", set: () => {} }),
    resetFilters: vi.fn()
  };
}

beforeEach(() => {
  useRuntimeConfigMock.mockReturnValue({ public: { evaluateMode: false, playwrightTest: false } });
  useStateMock.mockImplementation((key: string) => {
    switch (key) {
      case "projects":
        return { value: projects };
      case "configuration":
        return { value: { highlightedProjects: [projects[0].id] } };
      default:
        return { value: [] };
    }
  });
});

test("carousel section is shown when no filters are active", async () => {
  useFilterHashMock.mockReturnValue(makeFilterHash());
  const wrapper = await mountSuspended(IndexPage);
  expect(wrapper.find("[data-testid='carousel-section']").exists()).toBe(true);
});

test("carousel section is hidden when search is active", async () => {
  useFilterHashMock.mockReturnValue(makeFilterHash({ search: ref("something") }));
  const wrapper = await mountSuspended(IndexPage);
  expect(wrapper.find("[data-testid='carousel-section']").exists()).toBe(false);
});

test("carousel section is hidden when lab filter is active", async () => {
  useFilterHashMock.mockReturnValue(makeFilterHash({ lab: ref("ALICE, Alice - LabA") }));
  const wrapper = await mountSuspended(IndexPage);
  expect(wrapper.find("[data-testid='carousel-section']").exists()).toBe(false);
});

test("carousel section is hidden when category filter is active", async () => {
  useFilterHashMock.mockReturnValue(makeFilterHash({ category: ref("cat1") }));
  const wrapper = await mountSuspended(IndexPage);
  expect(wrapper.find("[data-testid='carousel-section']").exists()).toBe(false);
});

test("carousel section is hidden when application filter is active", async () => {
  useFilterHashMock.mockReturnValue(makeFilterHash({ application: ref("app1") }));
  const wrapper = await mountSuspended(IndexPage);
  expect(wrapper.find("[data-testid='carousel-section']").exists()).toBe(false);
});

test("carousel section is hidden when status filter is active", async () => {
  useFilterHashMock.mockReturnValue(makeFilterHash({ status: ref("Active") }));
  const wrapper = await mountSuspended(IndexPage);
  expect(wrapper.find("[data-testid='carousel-section']").exists()).toBe(false);
});

test("carousel section is hidden when tags filter is active", async () => {
  useFilterHashMock.mockReturnValue(makeFilterHash({ tags: ref(["tag1"]) }));
  const wrapper = await mountSuspended(IndexPage);
  expect(wrapper.find("[data-testid='carousel-section']").exists()).toBe(false);
});

test("carousel section is hidden on initial render when URL has a hash (filters not yet parsed)", async () => {
  window.location.hash = "#lab=SomeLab";
  useFilterHashMock.mockReturnValue(makeFilterHash()); // filters empty — simulates pre-onMounted state
  const wrapper = await mountSuspended(IndexPage);
  expect(wrapper.find("[data-testid='carousel-section']").exists()).toBe(false);
  window.location.hash = "";
});

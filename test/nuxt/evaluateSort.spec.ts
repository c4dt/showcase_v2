import { test, expect, vi } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import IndexPage from "~/pages/index.vue";

// https://nuxt.com/docs/4.x/getting-started/testing#mocknuxtimport
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

const { useSearchQueryMock } = vi.hoisted(() => {
  return {
    useSearchQueryMock: vi.fn(() => ref(""))
  };
});

mockNuxtImport("useSearchQuery", () => {
  return useSearchQueryMock;
});

const projects = [
  {
    id: "a",
    name: "Alpha",
    description: "",
    type: "",
    categories: [],
    applications: [],
    tags: [],
    date_added: "2024-01-01",
    lab: { name: "LabA", prof: { name: ["Alice"] } },
    descriptionDisplay: "",
    status: 0,
    showcase_interest: { carine: 1, linus: 3 }
  },
  {
    id: "b",
    name: "Beta",
    description: "",
    type: "",
    categories: [],
    applications: [],
    tags: [],
    date_added: "2024-01-01",
    lab: { name: "LabB", prof: { name: ["Bob"] } },
    descriptionDisplay: "",
    status: 0,
    showcase_interest: { carine: 5, linus: 1 }
  },
  {
    id: "c",
    name: "Gamma",
    description: "",
    type: "",
    categories: [],
    applications: [],
    tags: [],
    date_added: "2024-01-01",
    lab: { name: "LabC", prof: { name: ["Carol"] } },
    descriptionDisplay: "",
    status: 0,
    showcase_interest: { carine: 3 }
  }
];

// Provide one highlighted project so SelectedProjects renders without error
// (it always renders highlightedProjects[0], which would crash if undefined)
function setupStateMock() {
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
}

test("evaluator selector is hidden when evaluateMode is false", async () => {
  setupStateMock();
  useRuntimeConfigMock.mockReturnValue({ public: { evaluateMode: false, playwrightTest: false } });

  const wrapper = await mountSuspended(IndexPage);

  expect(wrapper.find('[data-testid="evaluator-btn-carine"]').exists()).toBe(false);
});

test("evaluator selector is shown when evaluateMode is true", async () => {
  setupStateMock();
  useRuntimeConfigMock.mockReturnValue({ public: { evaluateMode: true, playwrightTest: false } });

  const wrapper = await mountSuspended(IndexPage);

  expect(wrapper.find('[data-testid="evaluator-btn-carine"]').exists()).toBe(true);
  expect(wrapper.find('[data-testid="evaluator-btn-linus"]').exists()).toBe(true);
});

test("projects are sorted by single evaluator score (descending)", async () => {
  setupStateMock();
  useRuntimeConfigMock.mockReturnValue({ public: { evaluateMode: true, playwrightTest: false } });

  const wrapper = await mountSuspended(IndexPage);

  await wrapper.find('[data-testid="evaluator-btn-carine"]').trigger("click");
  await wrapper.vm.$nextTick();

  // Check project order: Beta (carine=5) > Gamma (carine=3) > Alpha (carine=1)
  // Exclude data-testid="project-card" (from ProjectCard internals) by filtering for exact project-{id} wrappers
  const projectItems = wrapper.findAll("[data-testid^='project-']:not([data-testid='project-card'])");
  expect(projectItems.length).toBe(3);
  expect(projectItems[0].attributes("data-testid")).toBe("project-b");
  expect(projectItems[1].attributes("data-testid")).toBe("project-c");
  expect(projectItems[2].attributes("data-testid")).toBe("project-a");
});

test("evaluations are shown on project cards when evaluateMode is true", async () => {
  setupStateMock();
  useRuntimeConfigMock.mockReturnValue({ public: { evaluateMode: true, playwrightTest: false } });

  const wrapper = await mountSuspended(IndexPage);

  expect(wrapper.find('[data-testid="evaluations-a"]').exists()).toBe(true);
  expect(wrapper.find('[data-testid="evaluations-a"]').text()).toContain("carine");
  expect(wrapper.find('[data-testid="evaluations-a"]').text()).toContain("1");
});

test("evaluations are hidden on project cards when evaluateMode is false", async () => {
  setupStateMock();
  useRuntimeConfigMock.mockReturnValue({ public: { evaluateMode: false, playwrightTest: false } });

  const wrapper = await mountSuspended(IndexPage);

  expect(wrapper.find('[data-testid="evaluations-a"]').exists()).toBe(false);
});

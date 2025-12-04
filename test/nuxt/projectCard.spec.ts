import { describe, test, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ProjectCard from "@/components/homepage/ProjectCard.vue";

const baseProject = {
  id: 1,
  lab: {
    prof: {
      name: ["John", "Doe"]
    },
    name: "Research Lab"
  }
};

describe("bare-bones project", () => {
  test("displays lab information", async () => {
    const wrapper = await mountSuspended(ProjectCard, {
      props: {
        project: { ...baseProject, tags: [] }
      },
      global: {
        provide: {
          selectedTags: { value: [] },
          addTag: vi.fn()
        },
        stubs: {
          ProjectDescription: true,
          ProjectQuality: true,
          InfoIcons: true
        }
      }
    });
    const projectCard = wrapper.find("[data-testid='project-card']");
    expect(projectCard.text()).toContain(`Professor: ${baseProject.lab.prof.name[0]} ${baseProject.lab.prof.name[1]}`);
    expect(projectCard.text()).toContain(`Lab: ${baseProject.lab.name}`);
  });

  test("links to the project page", async () => {
    const wrapper = await mountSuspended(ProjectCard, {
      props: {
        project: { ...baseProject, tags: [] }
      },
      global: {
        provide: {
          selectedTags: { value: [] },
          addTag: vi.fn()
        },
        stubs: {
          ProjectDescription: true,
          ProjectQuality: true,
          InfoIcons: true
        }
      }
    });
    expect(wrapper.find(`a[href$=projects/${baseProject.id}]`).exists()).toBe(true);
  });
});

describe("bare-bones project w/ tags", () => {
  test("displays tags in alphabetical order", async () => {
    const wrapper = await mountSuspended(ProjectCard, {
      props: {
        project: { ...baseProject, tags: ["zeta", "alpha", "beta"] }
      },
      global: {
        provide: {
          selectedTags: { value: [] },
          addTag: vi.fn()
        },
        stubs: {
          ProjectDescription: true,
          ProjectQuality: true,
          InfoIcons: true
        }
      }
    });
    const tags = wrapper.findAll("[data-testid='tag']");
    expect(tags.length).toBe(3);
    expect(tags.at(0).text()).toBe("alpha");
    expect(tags.at(1).text()).toBe("beta");
    expect(tags.at(2).text()).toBe("zeta");
  });

  test("displays selected tag/unselected tags correctly", async () => {
    const wrapper = await mountSuspended(ProjectCard, {
      props: {
        project: { ...baseProject, tags: ["zeta", "alpha", "beta"] }
      },
      global: {
        provide: {
          selectedTags: { value: ["alpha"] },
          addTag: vi.fn()
        },
        stubs: {
          ProjectDescription: true,
          ProjectQuality: true,
          InfoIcons: true
        }
      }
    });
    const unselectedTags = wrapper.findAll("[data-testid='tag'][class~='epfl-tag-light']");
    expect(unselectedTags.length).toBe(2);
    expect(unselectedTags.at(0).text()).toBe("beta");
    expect(unselectedTags.at(1).text()).toBe("zeta");
    const selectedTag = wrapper.find("[data-testid='tag'][class~='epfl-tag-plain']");
    expect(selectedTag.exists()).toBe(true);
    expect(selectedTag.text()).toBe("alpha");
  });
});

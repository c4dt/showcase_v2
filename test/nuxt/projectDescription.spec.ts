import { test, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ProjectDescription from "@/components/ProjectDescription.vue";

const baseProject = {
  name: "Test Project",
  description: "A test project description"
};

test("renders project name and description", async () => {
  const wrapper = await mountSuspended(ProjectDescription, {
    props: { project: baseProject } // minimal project
  });
  expect(wrapper.text()).toContain(baseProject.name);
  expect(wrapper.text()).toContain(baseProject.description);
});

test("renders layperson description if present", async () => {
  const project = {
    ...baseProject,
    laymen_desc: "A simple explanation for non-technical people"
  };
  const wrapper = await mountSuspended(ProjectDescription, {
    props: { project: project }
  });
  expect(wrapper.text()).toContain(project.laymen_desc);
});

test("renders technical description if present and no layperson description is present", async () => {
  const project = {
    ...baseProject,
    tech_desc: "Technical details about the implementation"
  };
  const wrapper = await mountSuspended(ProjectDescription, {
    props: { project: project }
  });
  expect(wrapper.text()).toContain(project.tech_desc);
});

test("renders layperson description if both layperson and technical descriptions are present", async () => {
  const project = {
    ...baseProject,
    laymen_desc: "A simple explanation for non-technical people",
    tech_desc: "Technical details about the implementation"
  };
  const wrapper = await mountSuspended(ProjectDescription, {
    props: { project }
  });
  expect(wrapper.text()).toContain(project.laymen_desc);
  expect(wrapper.text()).not.toContain(project.tech_desc);
});

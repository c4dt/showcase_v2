import { describe, test, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ProjectQuality from "@/components/ProjectQuality.vue";

const baseProject = {
  name: "Test Project"
};

describe("bare-bone project", () => {
  test("displays mailto link", async () => {
    const wrapper = await mountSuspended(ProjectQuality, {
      props: { project: baseProject }
    });
    expect(wrapper.find("svg[class~=fa-envelope]").exists()).toBe(true);
    const anchor = wrapper.find("a");
    expect(anchor.exists()).toBe(true);
    expect(anchor.attributes("href")).toBe(
      `mailto:${FACTORY_EMAIL_ADDRESS}?subject=${baseProject.name}: maturity evaluation request&body=Dear Factory team, please create a maturity evaluation for '${baseProject.name}'.`
    );
    expect(anchor.attributes("aria-label")).toBe("Send evaluation request");
  });

  test("displays ellipsis if C4DT/lab support status is undefined", async () => {
    const wrapper = await mountSuspended(ProjectQuality, {
      props: { project: baseProject }
    });
    const c4dtStatusIcon = wrapper.find("[data-testid='c4dt-status'][class~=fa-ellipsis]");
    expect(c4dtStatusIcon.exists()).toBe(true);
    expect(c4dtStatusIcon.classes()).toContain("cursor-help");
    expect(c4dtStatusIcon.text()).toBe("Inactive");
    const labStatusIcon = wrapper.find("[data-testid='lab-status'][class~=fa-ellipsis]");
    expect(labStatusIcon.exists()).toBe(true);
    expect(labStatusIcon.classes()).toContain("cursor-help");
    expect(labStatusIcon.text()).toBe("Unknown");
  });
});

describe("bare-bone project w/ maturity evaluation", () => {
  test("all maturity icons except 'Prototype' are greyed out for maturity level 1", async () => {
    const wrapper = await mountSuspended(ProjectQuality, {
      props: { project: { ...baseProject, maturity: 1 } }
    });
    // assert that all icons are present
    const prototypeIcon = wrapper.find("svg[class~=fa-ruler-combined]");
    expect(prototypeIcon.classes()).toContain("cursor-help");
    expect(prototypeIcon.text()).toBe("Prototype");
    const intermediateIcon = wrapper.find("svg[class~=fa-hammer]");
    expect(intermediateIcon.classes()).toContain("cursor-help");
    expect(intermediateIcon.text()).toBe("Intermediate");
    const matureIcon = wrapper.find("svg[class~=fa-building]");
    expect(matureIcon.classes()).toContain("cursor-help");
    expect(matureIcon.text()).toBe("Mature");
    // 'Prototype' icon should not be greyed out
    expect(prototypeIcon.classes()).toContain("text-[#212121]");
    // other icons should be greyed out
    expect(intermediateIcon.classes()).toContain("text-[#e6e6e6]");
    expect(matureIcon.classes()).toContain("text-[#e6e6e6]");
  });

  test("'Prototype' and 'Intermediate' icons are not greyed out for maturity level 2", async () => {
    const wrapper = await mountSuspended(ProjectQuality, {
      props: { project: { ...baseProject, maturity: 2 } }
    });
    const prototypeIcon = wrapper.find("svg[class~=fa-ruler-combined]");
    const intermediateIcon = wrapper.find("svg[class~=fa-hammer]");
    const matureIcon = wrapper.find("svg[class~=fa-building]");
    // 'Prototype' and 'Intermediate' icons should not be greyed out
    expect(prototypeIcon.classes()).toContain("text-[#212121]");
    expect(intermediateIcon.classes()).toContain("text-[#212121]");
    // 'Mature' icon should be greyed out
    expect(matureIcon.classes()).toContain("text-[#e6e6e6]");
  });

  test("no icons are greyed out for maturity level 3", async () => {
    const wrapper = await mountSuspended(ProjectQuality, {
      props: { project: { ...baseProject, maturity: 3 } }
    });
    const prototypeIcon = wrapper.find("svg[class~=fa-ruler-combined]");
    const intermediateIcon = wrapper.find("svg[class~=fa-hammer]");
    const matureIcon = wrapper.find("svg[class~=fa-building]");
    // no icons should not be greyed out
    expect(prototypeIcon.classes()).toContain("text-[#212121]");
    expect(intermediateIcon.classes()).toContain("text-[#212121]");
    expect(matureIcon.classes()).toContain("text-[#212121]");
  });
});

describe("bare-bone project w/ C4DT/lab support", () => {
  test("displays 'active' icon if there is active C4DT support", async () => {
    const wrapper = await mountSuspended(ProjectQuality, {
      props: { project: { ...baseProject, c4dt_status: PROJECT_C4DT_STATUS.ACTIVE } }
    });
    const c4dtStatusIcon = wrapper.find("[data-testid='c4dt-status'][class~=fa-circle-check]");
    expect(c4dtStatusIcon.exists()).toBe(true);
    expect(c4dtStatusIcon.classes()).toContain("cursor-help");
    expect(c4dtStatusIcon.text()).toBe("Active");
  });

  test("displays 'retired' icon if there is no more C4DT support", async () => {
    const wrapper = await mountSuspended(ProjectQuality, {
      props: { project: { ...baseProject, c4dt_status: PROJECT_C4DT_STATUS.RETIRED } }
    });
    const c4dtStatusIcon = wrapper.find("[data-testid='c4dt-status'][class~=fa-circle-pause]");
    expect(c4dtStatusIcon.exists()).toBe(true);
    expect(c4dtStatusIcon.classes()).toContain("cursor-help");
    expect(c4dtStatusIcon.text()).toBe("Retired");
  });

  test("displays 'active' icon if there is active lab support", async () => {
    const wrapper = await mountSuspended(ProjectQuality, {
      props: { project: { ...baseProject, lab_status: PROJECT_LAB_STATUS.ACTIVE } }
    });
    const labStatusIcon = wrapper.find("[data-testid='lab-status'][class~=fa-circle-check]");
    expect(labStatusIcon.exists()).toBe(true);
    expect(labStatusIcon.classes()).toContain("cursor-help");
    expect(labStatusIcon.text()).toBe("Active");
  });
});

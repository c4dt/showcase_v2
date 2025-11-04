import { expect, test } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InfoIcons from "../components/InfoIcons.vue";

const id = "test-project";

test("renders no links if project has no additional information associated with it", async () => {
  const wrapper = await mountSuspended(InfoIcons, { props: { project: { id: id } } });
  // there should be no links
  expect(wrapper.findAll("a")).toHaveLength(0);
  // all 5 icons should be greyed out
  const icons = wrapper.findAll("svg[class*='fa-']");
  expect(icons).toHaveLength(5);
  icons.forEach((icon) => {
    expect(icon.classes()).toContain("text-[#e6e6e6]");
  });
});

test("renders link to home page if project has URL associated with it", async () => {
  const url = "https://example.com";
  const wrapper = await mountSuspended(InfoIcons, { props: { project: { id: id, url: url } } });
  // there should be exactly one link
  const anchors = wrapper.findAll("a");
  expect(anchors).toHaveLength(1);
  expect(anchors[0].attributes("href")).toBe(url);
  // its associated icon should not be greyed out
  expect(wrapper.find("svg[class~='fa-house']").classes()).not.toContain("text-[#e6e6e6]");
});

test("renders link to project page's 'Research papers' section", async () => {
  const wrapper = await mountSuspended(InfoIcons, { props: { project: { id: id, information: [{ type: "paper" }] } } });
  // there should be exactly one link
  const anchors = wrapper.findAll("a");
  expect(anchors).toHaveLength(1);
  expect(anchors[0].attributes("href")).toBe(`/projects/${id}?section=papers`);
  // its associated icon should not be greyed out
  expect(wrapper.find("svg[class~='fa-file']").classes()).not.toContain("text-[#e6e6e6]");
});

test("renders link to project page's 'Miscellaneous publications' section", async () => {
  const wrapper = await mountSuspended(InfoIcons, {
    props: { project: { id: id, information: [{ type: "article" }] } }
  });
  // there should be exactly one link
  const anchors = wrapper.findAll("a");
  expect(anchors).toHaveLength(1);
  expect(anchors[0].attributes("href")).toBe(`/projects/${id}?section=articles`);
  // its associated icon should not be greyed out
  expect(wrapper.find("svg[class~='fa-newspaper']").classes()).not.toContain("text-[#e6e6e6]");
});

test("renders mailto link if project has associated contact", async () => {
  const contacts = [{ name: "Linus Gasser", email: "linus.gasser@epfl.ch" }];
  const wrapper = await mountSuspended(InfoIcons, { props: { project: { id: id, contacts: contacts } } });
  // there should be exactly one link
  const anchors = wrapper.findAll("a");
  expect(anchors).toHaveLength(1);
  expect(anchors[0].attributes("href")).toBe(`mailto:${contacts[0].email}`);
});

test("renders no link if project's code has no URL associated with it", async () => {
  const wrapper = await mountSuspended(InfoIcons, { props: { project: { id: id, code: { type: "toto" } } } });
  // there should be no links
  expect(wrapper.findAll("a")).toHaveLength(0);
  // its associated icon should be greyed out
  expect(wrapper.find("svg[class~='fa-code']").classes()).toContain("text-[#e6e6e6]");
});

test("renders link w/ code icon if non-GitHub URL is associated with project", async () => {
  const url = "https://example.com/";
  const wrapper = await mountSuspended(InfoIcons, { props: { project: { id: id, code: { type: "toto", url: url } } } });
  // there should be exactly one link
  const anchors = wrapper.findAll("a");
  expect(anchors).toHaveLength(1);
  expect(anchors[0].attributes("href")).toBe(url);
  // its associated icon should not be greyed out
  expect(wrapper.find("svg[class~='fa-code']").classes()).not.toContain("text-[#e6e6e6]");
});

test("renders link w/ GitHub icon if GitHub URL is associated with project", async () => {
  const url = "https://github.com/example/repo";
  const wrapper = await mountSuspended(InfoIcons, {
    props: { project: { id: id, code: { type: "github", url: url } } }
  });
  // there should be exactly one link
  const anchors = wrapper.findAll("a");
  expect(anchors).toHaveLength(1);
  expect(anchors[0].attributes("href")).toBe(url);
  // its associated icon should not be greyed out
  expect(wrapper.find("svg[class~='fa-github']").classes()).not.toContain("text-[#e6e6e6]");
});

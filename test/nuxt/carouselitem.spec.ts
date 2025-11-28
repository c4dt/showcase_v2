import { describe, test, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import CarouselItem from "~/components/homepage/CarouselItem.vue";

describe("CarouselItem", () => {
  const project = {
    id: "1",
    name: "Test Project",
    descriptionDisplay: "This is a test project description",
    logo: "/test-logo.png"
  };

  test("renders project", async () => {
    const wrapper = await mountSuspended(CarouselItem, {
      props: {
        project: project
      },
      global: {
        stubs: {
          InfoIcons: true // stub child component
        }
      }
    });
    expect(wrapper.find(`img[src=${project.logo}][alt=${project.name}]`).exists()).toBe(true);
    expect(wrapper.find("[data-testid='header']").text()).toBe(project.name);
    expect(wrapper.find("[data-testid='body']").text()).toBe(project.descriptionDisplay);
  });

  test("links to the correct URL", async () => {
    const wrapper = await mountSuspended(CarouselItem, {
      props: {
        project: project
      },
      global: {
        stubs: {
          InfoIcons: true // stub child component
        }
      }
    });
    expect(wrapper.find(`a[href$=projects/${project.id}]`).exists()).toBe(true);
  });
});

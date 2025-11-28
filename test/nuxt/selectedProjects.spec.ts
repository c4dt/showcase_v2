import { test, expect, vi } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import SelectedProjects from "~/components/homepage/SelectedProjects.vue";

// https://nuxt.com/docs/4.x/getting-started/testing#mocknuxtimport
const { useStateMock } = vi.hoisted(() => {
  return {
    useStateMock: vi.fn(() => {
      return void 0;
    })
  };
});

mockNuxtImport("useState", () => {
  return useStateMock;
});

const projects = [
  {
    id: "1"
  },
  {
    id: "2"
  },
  {
    id: "3"
  }
];

test("renders only carousel item if only one project is highlighted", async () => {
  // mock state in which only one project is highlighted
  useStateMock.mockImplementation((key) => {
    switch (key) {
      case "configuration":
        return {
          value: {
            highlightedProjects: [projects[0].id]
          }
        };
      case "projects":
        return {
          value: [projects[0]]
        };
    }
  });
  const wrapper = await mountSuspended(SelectedProjects, {
    global: {
      stubs: {
        Carousel: true,
        Slide: true,
        Navigation: true,
        CarouselItem: true
      }
    }
  });
  // does not render carouel
  expect(wrapper.find("[data-testid='carousel']").exists()).toBe(false);
  expect(wrapper.find("[data-testid='slide']").exists()).toBe(false);
  expect(wrapper.find("[data-testid='navigation']").exists()).toBe(false);
  // renders single carousel item
  expect(wrapper.findAll("[data-testid='carousel-item']").length).toBe(1);
});

test("renders carousel if multiple projects are highlighted", async () => {
  // mock state in which multiple projects are highlighted
  useStateMock.mockImplementation((key) => {
    switch (key) {
      case "configuration":
        return {
          value: {
            highlightedProjects: projects.map((project) => project.id)
          }
        };
      case "projects":
        return {
          value: projects
        };
    }
  });
  const wrapper = await mountSuspended(SelectedProjects, {
    global: {
      stubs: {
        Carousel: true,
        Slide: true,
        Navigation: true,
        CarouselItem: true
      }
    }
  });
  // carousel should be rendered
  expect(wrapper.find("[data-testid='carousel']").exists()).toBe(true);
  expect(wrapper.find("[data-testid='navigation']").exists()).toBe(true);
  // more than one slide/carousel item is rendered per project to implement carousel functionality
  // therefore check that at least as many slides/carousel items as projects are rendered
  expect(wrapper.findAll("[data-testid='slide']").length >= 3).toBe(true);
  expect(wrapper.findAll("[data-testid='carousel-item']").length >= 3).toBe(true);
});

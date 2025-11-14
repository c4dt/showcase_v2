import { test, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ClearButton from "@/components/ClearButton.vue";

test("renders button", async () => {
  const wrapper = await mountSuspended(ClearButton, {
    props: {
      clearFunc: () => void 0
    }
  });
  expect(wrapper.find("svg[data-prefix='fas'][data-icon='xmark']").exists()).toBe(true);
  expect(wrapper.find("button").attributes("aria-label")).toBe("Clear all selections");
});

test("calls clear function when button is clicked", async () => {
  const clearFunc = vi.fn();
  const wrapper = await mountSuspended(ClearButton, {
    props: {
      clearFunc: clearFunc
    }
  });
  await wrapper.find("button").trigger("click");
  expect(clearFunc).toHaveBeenCalled();
});

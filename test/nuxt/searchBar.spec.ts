import { describe, test, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SearchBar from "@/components/SearchBar.vue";

describe("search bar toggle", () => {
  test("renders button", async () => {
    const wrapper = await mountSuspended(SearchBar);
    expect(wrapper.find("svg[class~=fa-magnifying-glass]").exists()).toBe(true);
    expect(wrapper.find("button").attributes("aria-label")).toBe("Toggle search bar open/closed");
  });
});

describe("input", () => {
  test("renders input box", async () => {
    const wrapper = await mountSuspended(SearchBar);
    expect(wrapper.find("input").attributes("aria-label")).toBe("Search");
  });

  test("emits update:searchQuery when search input is updated", async () => {
    const wrapper = await mountSuspended(SearchBar);
    const text = "toto";
    await wrapper.find("input").setValue(text);
    const emitted = wrapper.emitted("update:searchQuery");
    expect(emitted).toBeTruthy();
    expect(emitted![emitted!.length - 1]).toEqual([text]);
  });

  test("emits empty string when input is cleared", async () => {
    const wrapper = await mountSuspended(SearchBar, {
      props: { searchQuery: "toto" }
    });
    await wrapper.find("input").setValue("");
    const emitted = wrapper.emitted("update:searchQuery");
    expect(emitted).toBeTruthy();
    expect(emitted![emitted!.length - 1]).toEqual([""]);
  });
});

import { describe, test, expect, vi, afterEach } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import SearchBar from "@/components/SearchBar.vue";

describe("search bar toggle", () => {
  test("renders button", async () => {
    const wrapper = await mountSuspended(SearchBar);
    expect(wrapper.find("svg[class~=fa-magnifying-glass]").exists()).toBe(true);
    expect(wrapper.find("button").attributes("aria-label")).toBe("Toggle search bar open/closed");
  });

  //  test("calls toggleAndFocus when the button is clicked", async () => {
  //    const wrapper = await mountSuspended(SearchBar);
  //    const toggleAndFocus = vi.spyOn(wrapper.vm, "toggleAndFocus"));
  //    await wrapper.find("button").trigger("click");
  //    // https://github.com/nuxt/test-utils/issues/620
  //    expect(toggleAndFocus).toHaveBeenCalled();
  //  });
});

describe("input", () => {
  mockNuxtImport("navigateTo", () => vi.fn()); // don't navigate
  mockNuxtImport("useRoute", () => vi.fn()); // fix route
  const path = "/foo/bar";
  useRoute.mockReturnValue({ path: path });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders input box", async () => {
    const wrapper = await mountSuspended(SearchBar);
    expect(wrapper.find("input").attributes("aria-label")).toBe("Search");
  });

  test("tries to navigate to home page w/ search query when input is updated", async () => {
    const wrapper = await mountSuspended(SearchBar);
    const text = "toto";
    await wrapper.find("input").setValue(text);
    expect(navigateTo).toHaveBeenCalledWith(`/?search=${text}`);
  });

  test("resets query when input is cleared", async () => {
    const wrapper = await mountSuspended(SearchBar);
    const input = wrapper.find("input");
    await input.setValue("toto");
    navigateTo.mockClear();
    await input.setValue("");
    expect(navigateTo).toHaveBeenCalledWith(path, { query: {}, replace: true });
  });

  test("handles special characters in input", async () => {
    const wrapper = await mountSuspended(SearchBar);
    // cf. https://www.rfc-editor.org/rfc/rfc3986#section-2
    await wrapper.find("input").setValue("-._~:/?#[]@!$&'()*+");
    expect(navigateTo).toHaveBeenCalledWith("/?search=-._~%3A%2F%3F%23%5B%5D%40!%24%26'()*%2B");
  });
});

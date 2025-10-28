import { describe, expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import NavBar from "../components/NavBar.vue";

describe("navigation bar links", () => {
  test("contains link to EPFL home page", () => {
    const wrapper = mount(NavBar);
    const a = wrapper.get("a[href='https://epfl.ch']");
    expect(a.get("img").attributes("alt")).toBe("EPFL Logo");
  });

  test("contains link to Center for Digital Trust's home page", () => {
    const wrapper = mount(NavBar);
    const a = wrapper.get("a[href='https://c4dt.epfl.ch']");
    expect(a.text()).toBe("CENTER FOR DIGITAL TRUST");
  });
});

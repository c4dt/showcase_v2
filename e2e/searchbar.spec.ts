import { test, expect } from "@playwright/test";

test.describe("search box", () => {
  test.describe.configure({ retries: 3 }); // URL update is flaky for chromium/webkit
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("focuses on search box in navigation bar when home page is loaded", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: "Search" }).first();
    await expect(searchInput).toBeFocused();
  });

  test("updates URL when user inputs in search box", async ({ page }) => {
    const searchBox = page.getByRole("textbox", { name: "Search" }).first();
    const text = "toto";
    await searchBox.fill(text);
    await expect(page).toHaveURL(`/?search=${text}`);
  });

  test("updates URL when search box is cleared", async ({ page }) => {
    const text = "toto";
    await page.goto(`/?search=${text}`);
    const searchBox = page.getByRole("textbox", { name: "Search" }).first();
    await searchBox.clear();
    await expect(page).toHaveURL("/");
  });

  test("handles special characters in input", async ({ page }) => {
    const searchBox = page.getByRole("textbox", { name: "Search" }).first();
    // cf. https://www.rfc-editor.org/rfc/rfc3986#section-2
    await searchBox.fill("-._~:/?#[]@!$&'()*+");
    // browser escapes "'"
    await expect(page).toHaveURL("/?search=-._~%3A%2F%3F%23%5B%5D%40!%24%26%27()*%2B");
  });

  test("clicking search icon toggles search box visibility", async ({ page }) => {
    const searchIcon = page.getByRole("button", { name: "Toggle search bar open/closed" }).first();
    const searchBox = page.getByRole("textbox", { name: "Search" }).first();
    // search box is initially visible and focused
    await expect(searchBox).toBeVisible();
    await expect(searchBox).toBeFocused();
    // hide search box
    await searchIcon.click();
    await expect(searchBox).not.toBeVisible();
    // show search box
    await searchIcon.click();
    await expect(searchBox).toBeVisible();
    await expect(searchBox).toBeFocused();
  });

  test("clicking clear button clears search box", async ({ page }) => {
    const searchBox = page.getByRole("textbox", { name: "Search" }).first();
    const clearButton = page.getByRole("button", { name: "Clear search" }).first();
    const text = "toto";
    await searchBox.fill(text);
    await expect(searchBox).toHaveValue(text);
    await clearButton.click();
    await expect(searchBox).toHaveValue("");
  });
});

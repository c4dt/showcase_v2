import { test, expect } from "@playwright/test";

test.describe("search box", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("focuses on search box in navigation bar when home page is loaded", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: "Search" }).filter({ visible: true }).first();
    await expect(searchInput).toBeFocused();
  });

  test("updates URL when user inputs in search box", async ({ page }) => {
    const searchBox = page.getByRole("textbox", { name: "Search" }).filter({ visible: true }).first();
    const text = "toto";
    await searchBox.fill(text);
    await page.waitForURL(`/?search=${text}`);
  });

  test("updates URL when search box is cleared", async ({ page }) => {
    const text = "toto";
    await page.goto(`/?search=${text}`, { waitUntil: "networkidle" });
    const searchBox = page.getByRole("textbox", { name: "Search" }).filter({ visible: true }).first();
    await searchBox.clear();
    await page.waitForURL("/");
  });

  test("handles special characters in input", async ({ page }) => {
    const searchBox = page.getByRole("textbox", { name: "Search" }).filter({ visible: true }).first();
    // cf. https://www.rfc-editor.org/rfc/rfc3986#section-2
    await searchBox.fill("-._~:/?#[]@!$&'()*+");
    // browser escapes "'"
    await page.waitForURL("/?search=-._~%3A%2F%3F%23%5B%5D%40!%24%26%27()*%2B");
  });

  test("clicking search icon toggles search box visibility", async ({ page }) => {
    const searchIcon = page
      .getByRole("button", { name: "Toggle search bar open/closed" })
      .filter({ visible: true })
      .first();
    const searchBox = page.getByRole("textbox", { name: "Search" }).filter({ visible: true }).first();
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
    const searchBox = page.getByRole("textbox", { name: "Search" }).filter({ visible: true }).first();
    const text = "toto";
    await searchBox.fill(text);
    await expect(searchBox).toHaveValue(text);
    const clearButton = page.getByRole("button", { name: "Clear search" }).filter({ visible: true }).first();
    await clearButton.click();
    await expect(searchBox).toHaveValue("");
    await expect(page).toHaveURL("/");
  });
});

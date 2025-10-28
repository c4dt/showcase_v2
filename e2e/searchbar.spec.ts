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
    await page.waitForURL(`/?search=${text}`);
  });

  test("updates URL when search box is cleared", async ({ page }) => {
    const text = "toto";
    await page.goto(`/?search=${text}`);
    const searchBox = page.getByRole("textbox", { name: "Search" }).first();
    await searchBox.clear();
    await page.waitForURL("/");
  });

  test("handles special characters in input", async ({ page }) => {
    const searchBox = page.getByRole("textbox", { name: "Search" }).first();
    const text = "!*'();:@&=+$,/?%#[]";
    const textEncoded = "!*%27()%3B%3A%40%26%3D%2B%24%2C%2F%3F%25%23%5B%5D";
    await searchBox.fill(text);
    await page.waitForURL(`/?search=${textEncoded}`);
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

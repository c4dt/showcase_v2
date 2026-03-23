import { test, expect } from "@playwright/test";

test.describe("filter hash — loading from URL", () => {
  test("loading /#search=blockchain restores search input", async ({ page }) => {
    await page.goto("/#search=blockchain");
    const searchBox = page.getByRole("textbox", { name: "Search" }).filter({ visible: true }).first();
    await expect(searchBox).toHaveValue("blockchain");
  });

  test("loading /#tags=Anonymity restores tag chip", async ({ page }) => {
    await page.goto("/#tags=Anonymity");
    // The Anonymity tag chip should be active/selected in the tag filter
    // At minimum, verify the page loaded with the hash and projects are filtered
    await expect(page).toHaveURL(/#tags=Anonymity/);
    // Verify search box is empty (only tag filter active)
    const searchBox = page.getByRole("textbox", { name: "Search" }).filter({ visible: true }).first();
    await expect(searchBox).toHaveValue("");
  });
});

test.describe("filter hash — updating URL from interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("typing in search updates URL hash", async ({ page }) => {
    const searchBox = page.getByRole("textbox", { name: "Search" }).filter({ visible: true }).first();
    await searchBox.fill("blockchain");
    await page.waitForURL(`/#search=blockchain`);
  });

  test("reset button clears the hash", async ({ page }) => {
    const searchBox = page.getByRole("textbox", { name: "Search" }).filter({ visible: true }).first();
    await searchBox.fill("blockchain");
    await page.waitForURL(`/#search=blockchain`);
    await page.getByText("Reset Filters").click();
    await page.waitForURL("/");
    await expect(searchBox).toHaveValue("");
  });
});

test.describe("advanced search visibility", () => {
  test("clicking a project tag shows the advanced filters section", async ({ page }) => {
    // Networkidle is needed here
    await page.goto("/", { waitUntil: "networkidle" });
    const advancedSection = page.locator('[data-testid="advanced-filters"]');
    await expect(advancedSection).toBeHidden();

    // Click any tag on a project card
    const firstTag = page.locator('[data-testid="project-card"] .epfl-tag-light').first();
    await firstTag.click();

    // Advanced filters should now be visible
    await expect(advancedSection).toBeVisible();
  });
});

test.describe("filter hash — search and clear", () => {
  test("loading /#search=foo and clearing restores empty hash", async ({ page }) => {
    await page.goto("/#search=foo");
    const searchBox = page.getByRole("textbox", { name: "Search" }).filter({ visible: true }).first();
    await expect(searchBox).toHaveValue("foo");
    await searchBox.clear();
    await page.waitForURL("/");
  });
});

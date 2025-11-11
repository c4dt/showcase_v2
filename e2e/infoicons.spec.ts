import { test, expect } from "@playwright/test";

test.describe("bare-bone project", () => {
  let projectCard;
  let infoIcons;
  test.beforeEach(async ({ page }) => {
    projectCard = page.locator("[data-testid='project-card']").filter({ hasText: "E-ID Demo (Issuer & Verifier)" });
    infoIcons = page.locator("[data-testid='info-icons']");
    await page.goto("/");
  });

  test("renders 'Research papers' icon", async ({ page }) => {
    const icons = await projectCard.locator(infoIcons.locator(page.locator("svg[class~='fa-file']"))).all();
    // one icon per viewport breakpoint...
    expect(icons).toHaveLength(2);
    // ...but only one icon should be visible
    expect((await Promise.all(icons.map((icon) => icon.isVisible()))).filter((icon) => icon)).toHaveLength(1);
  });

  test("renders 'Miscellaneous publications' icon", async ({ page }) => {
    const icons = await projectCard.locator(infoIcons.locator(page.locator("svg[class~='fa-newspaper']"))).all();
    // one icon per viewport breakpoint...
    expect(icons).toHaveLength(2);
    // ...but only one icon should be visible
    expect((await Promise.all(icons.map((icon) => icon.isVisible()))).filter((icon) => icon)).toHaveLength(1);
  });

  test("renders home page icon", async ({ page }) => {
    const icons = await projectCard.locator(infoIcons.locator(page.locator("svg[class~='fa-house']"))).all();
    // one icon per viewport breakpoint...
    expect(icons).toHaveLength(2);
    // ...but only one icon should be visible
    expect((await Promise.all(icons.map((icon) => icon.isVisible()))).filter((icon) => icon)).toHaveLength(1);
  });

  test("renders code repository icon", async ({ page }) => {
    const icons = await projectCard.locator(infoIcons.locator(page.locator("svg[class~='fa-code']"))).all();
    // one icon per viewport breakpoint...
    expect(icons).toHaveLength(2);
    // ...but only one icon should be visible
    expect((await Promise.all(icons.map((icon) => icon.isVisible()))).filter((icon) => icon)).toHaveLength(1);
  });

  test("renders mailto icon", async ({ page }) => {
    const icons = await projectCard.locator(infoIcons.locator(page.locator("svg[class~='fa-envelope']"))).all();
    // one icon per viewport breakpoint...
    expect(icons).toHaveLength(2);
    // ...but only one icon should be visible
    expect((await Promise.all(icons.map((icon) => icon.isVisible()))).filter((icon) => icon)).toHaveLength(1);
  });
});

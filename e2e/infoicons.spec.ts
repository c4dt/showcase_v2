import { test, expect, type Locator } from "@playwright/test";

test.describe("bare-bone project", () => {
  let projectCard: Locator;
  let infoIcons: Locator;
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    projectCard = page.locator("[data-testid='project-card']").filter({ hasText: "E-ID Demo (Issuer & Verifier)" });
    infoIcons = page.locator("[data-testid='info-icons']");
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

test.describe("project w/ complete information", () => {
  let projectCard: Locator;
  let infoIcons: Locator;
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    projectCard = page.locator("[data-testid='project-card']").filter({ hasText: "E-ID Example" });
    infoIcons = page.locator("[data-testid='info-icons']");
  });

  test("navigates to project page's 'Research papers' section", async ({ page, baseURL }) => {
    await projectCard.locator(infoIcons).getByLabel("Papers").filter({ visible: true }).first().click();
    await expect(page).toHaveURL(`${baseURL}/projects/eid-example?section=papers`);
  });

  test("navigates to project page's 'Miscellaneous publications' section", async ({ page, baseURL }) => {
    await projectCard.locator(infoIcons).getByLabel("Articles").filter({ visible: true }).first().click();
    await expect(page).toHaveURL(`${baseURL}/projects/eid-example?section=articles`);
  });

  test("renders link to home page", async () => {
    const icon = projectCard.locator(infoIcons).getByLabel("Project Homepage").filter({ visible: true }).first();
    // do not test external URL, check only that link is present
    await expect(icon).toHaveAttribute("href", "https://example.com");
  });

  test("renders link w/ code icon", async () => {
    const icon = projectCard.locator(infoIcons).getByLabel("Source Code").filter({ visible: true }).first();
    // do not test external URL, check only that link is present
    await expect(icon).toHaveAttribute("href", "https://example.com/code");
  });

  test("renders mailto link", async () => {
    const icon = projectCard.locator(infoIcons).getByLabel("Contact").filter({ visible: true }).first();
    // check that link is present
    await expect(icon).toHaveAttribute("href", "mailto:linus.gasser@epfl.ch");
  });
});

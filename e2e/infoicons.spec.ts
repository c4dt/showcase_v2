import { test, expect } from "@playwright/test";

// FIXME fix filtering of visible items
// TODO use event listener to check for URLs

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

test.describe("project w/ complete information", () => {
  let projectCard;
  let infoIcons;
  test.beforeEach(async ({ page }) => {
    projectCard = page.locator("[data-testid='project-card']").filter({ hasText: "E-ID Example" });
    infoIcons = page.locator("[data-testid='info-icons']");
    await page.goto("/");
  });

  test("navigates to project page's 'Research papers' section", async ({ page, baseURL }) => {
    const icons = await projectCard.locator(infoIcons.locator(page.getByLabel("Papers"))).all();
    await (await Promise.all(icons.filter((icon) => icon.isVisible())))[0].click();
    await expect(page).toHaveURL(`${baseURL}/projects/eid-example?section=papers`);
  });

  test("navigates to project page's 'Miscellaneous publications' section", async ({ page, baseURL }) => {
    const icons = await projectCard.locator(infoIcons.locator(page.getByLabel("Articles"))).all();
    await (await Promise.all(icons.filter((icon) => icon.isVisible())))[0].click();
    await expect(page).toHaveURL(`${baseURL}/projects/eid-example?section=articles`);
  });

  test("renders link to home page", async ({ page }) => {
    const icons = await projectCard.locator(infoIcons.locator(page.getByLabel("Project Homepage"))).all();
    const icon = (await Promise.all(icons.filter((icon) => icon.isVisible())))[0];
    // do not test external URL, check only that link is present
    await expect(icon).toHaveAttribute("href", "https://example.com");
  });

  test("renders link w/ code icon", async ({ page }) => {
    const icons = await projectCard.locator(infoIcons.locator(page.getByLabel("Source Code"))).all();
    const icon = (await Promise.all(icons.filter((icon) => icon.isVisible())))[0];
    // do not test external URL, check only that link is present
    await expect(icon).toHaveAttribute("href", "https://example.com/code");
  });

  test("renders mailto link", async ({ page }) => {
    const icons = await projectCard.locator(infoIcons.locator(page.getByLabel("Contact"))).all();
    const icon = (await Promise.all(icons.filter((icon) => icon.isVisible())))[0];
    // check that link is present
    await expect(icon).toHaveAttribute("href", "mailto:linus.gasser@epfl.ch");
  });
});

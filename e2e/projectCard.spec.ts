import { test, expect } from "@playwright/test";

test.describe("bare-bone project", () => {
  let projectCard;
  let projectQuality;
  test.beforeEach(async ({ page }) => {
    projectCard = page.locator("[data-testid='project-card']").filter({ hasText: "E-ID Demo (Issuer & Verifier)" });
    projectQuality = page.locator("[data-testid='project-quality']");
    await page.goto("/");
  });

  test("highlights to project card when hovered over", async ({ page, baseURL }) => {
    await expect(projectCard).toHaveAttribute("", "");
    await projectCard.click();
    await expect(page).toHaveURL(`${baseURL}/projects/eid-demo`);
  });

  test("navigates to project page", async ({ page, baseURL }) => {
    await projectCard.click();
    await expect(page).toHaveURL(`${baseURL}/projects/eid-demo`);
  });

  test("renders mailto link", async () => {
    const icons = await projectCard.locator(projectQuality.locator("svg[class~=fa-envelope]")).all();
    // one icon per viewport breakpoint...
    expect(icons).toHaveLength(2);
    // ...but only one icon should be visible
    const areVisible = await Promise.all(icons.map((icon) => icon.isVisible()));
    const visibleIcons = icons.filter((_, i) => areVisible[i]);
    expect(visibleIcons).toHaveLength(1);
    // icon's parent is the anchor
    await expect(visibleIcons[0].locator("..")).toHaveAttribute(
      "href",
      "mailto:factory@c4dt.org?subject=E-ID Demo (Issuer & Verifier): maturity evaluation request&body=Dear Factory team, please create a maturity evaluation for 'E-ID Demo (Issuer & Verifier)'."
    );
  });

  test("renders C4DT support status", async () => {
    const icons = await projectCard.locator(projectQuality.locator("[data-testid=c4dt-status]")).all();
    // one icon per viewport breakpoint...
    expect(icons).toHaveLength(2);
    // ...but only one icon should be visible
    const areVisible = await Promise.all(icons.map((icon) => icon.isVisible()));
    const visibleIcons = icons.filter((_, i) => areVisible[i]);
    expect(visibleIcons).toHaveLength(1);
  });

  test("renders lab support status", async () => {
    const icons = await projectCard.locator(projectQuality.locator("[data-testid=lab-status]")).all();
    // one icon per viewport breakpoint...
    expect(icons).toHaveLength(2);
    // ...but only one icon should be visible
    const areVisible = await Promise.all(icons.map((icon) => icon.isVisible()));
    const visibleIcons = icons.filter((_, i) => areVisible[i]);
    expect(visibleIcons).toHaveLength(1);
  });

  test("should change CSS class when hovering over Access Control tag", async ({ page }) => {
    await page.goto("/");

    // Find the Access Control tag
    const accessControlTag = page.getByText("Access Control").first();

    // Get initial class
    const initialClass = await accessControlTag.getAttribute("class");

    // Hover over the tag
    await accessControlTag.hover();

    // Verify class changed
    const newClass = await accessControlTag.getAttribute("class");
    expect(newClass).not.toBe(initialClass);
  });

  test("should change CSS class when clicking Access Control tag", async ({ page }) => {
    await page.goto("/");

    // Find the Access Control tag
    const accessControlTag = page.getByText("Access Control").first();

    // Get initial class
    const initialClass = await accessControlTag.getAttribute("class");

    // Click the tag
    await accessControlTag.click();

    // Verify class changed
    const newClass = await accessControlTag.getAttribute("class");
    expect(newClass).not.toBe(initialClass);
  });
});
//
// TODO merge w/ InfoIcons tests
// improve InfoIcons (add help text if user hovers)

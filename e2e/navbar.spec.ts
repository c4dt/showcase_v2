import { test, expect } from "@playwright/test";

test.describe("home page navigation bar links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("contains link to EPFL home page", async ({ page }) => {
    const epfl = page.getByRole("link", { name: "EPFL Logo" });
    await expect(epfl).toBeVisible();
    await expect(epfl).toHaveAttribute("href", "https://epfl.ch");
  });

  test("contains link to C4DT home page", async ({ page }) => {
    const c4dt = page.getByRole("link", { name: "CENTER FOR DIGITAL TRUST", exact: true });
    await expect(c4dt).toBeVisible();
    await expect(c4dt).toHaveAttribute("href", "https://c4dt.epfl.ch");
  });

  test("contains breadcrumbs", async ({ page }) => {
    const showcaseBreadcrumb = page
      .getByRole("navigation", { name: "Breadcrumb" })
      .getByRole("list")
      .getByText("Showcase", { exact: true });
    await expect(showcaseBreadcrumb).toBeVisible();
    // on home page, home page breadcrumb is NOT a link
    await expect(showcaseBreadcrumb).not.toHaveAttribute("href");
  });
});

test.describe("project page navigation bar links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/dela");
  });

  test("contains breadcrumbs", async ({ page }) => {
    const breadcrumbs = page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("list");
    // on project page, home page breadcrumb IS a link
    const showcaseBreadcrumb = breadcrumbs.getByText("Showcase", { exact: true });
    await expect(showcaseBreadcrumb).toBeVisible();
    await expect(showcaseBreadcrumb).toHaveAttribute("href", "/");
    // on project page, project breadcrumb is NOT a link
    const projectBreadcrumb = breadcrumbs.getByText("Dela", { exact: true });
    await expect(projectBreadcrumb).toBeVisible();
    await expect(projectBreadcrumb).not.toHaveAttribute("href");
  });
});

import { test, expect } from "@playwright/test";

test.describe("breadcrumbs", () => {
  test("contains home page breadcrumb", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const showcaseBreadcrumb = page
      .getByRole("navigation", { name: "Breadcrumb" })
      .getByRole("list")
      .getByText("Showcase", { exact: true });
    await expect(showcaseBreadcrumb).toBeVisible();
    // on home page, home page breadcrumb is NOT a link
    await expect(showcaseBreadcrumb).not.toHaveAttribute("href");
  });

  test("contains project page breadcrumbs", async ({ page }) => {
    await page.goto("/projects/eid-demo", { waitUntil: "networkidle" });
    const breadcrumbs = page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("list");
    // on project page, home page breadcrumb IS a link
    const showcaseBreadcrumb = breadcrumbs.getByText("Showcase", { exact: true });
    await expect(showcaseBreadcrumb).toBeVisible();
    await expect(showcaseBreadcrumb).toHaveAttribute("href", "/");
    // on project page, project breadcrumb is NOT a link
    const projectBreadcrumb = breadcrumbs.getByText("Eid Demo", { exact: true });
    await expect(projectBreadcrumb).toBeVisible();
    await expect(projectBreadcrumb).not.toHaveAttribute("href");
  });
});

import { test, expect } from "@playwright/test";

test.describe("bare-bone project", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("navigates to project page when clicked", async ({ page, baseURL }) => {
    // multiple carousel items are generated per project for the carousel functionality
    const carouselItem = page
      .locator("[data-testid='carousel-item']")
      .filter({ hasText: "E-ID Demo (Issuer & Verifier)" })
      .filter({ visible: true })
      .first();
    await carouselItem.click();
    // no additional information is associated with the project, so no tab is open
    await expect(page).toHaveURL(`${baseURL}/projects/eid-demo`);
  });

  test("displays the project logo", async ({ page }) => {
    // multiple carousel items are generated per project for the carousel functionality
    const carouselItem = page
      .locator("[data-testid='carousel-item']")
      .filter({ hasText: "E-ID Demo (Issuer & Verifier)" })
      .filter({ visible: true })
      .first();
    // default logo
    await expect(carouselItem.locator("img")).toHaveAttribute(
      "src",
      "https://c4dt.epfl.ch/wp-content/themes/epfl/assets/svg/epfl-logo.svg"
    );
  });

  test("displays project description", async ({ page }) => {
    // multiple carousel items are generated per project for the carousel functionality
    const carouselItem = page
      .locator("[data-testid='carousel-item']")
      .filter({ hasText: "E-ID Demo (Issuer & Verifier)" })
      .filter({ visible: true })
      .first();
    await expect(carouselItem).toContainText("Demo for the swiss E-ID ledger. It includes an issuer and a verifier.");
  });

  test("displays information icons", async ({ page }) => {
    // multiple carousel items are generated per project for the carousel functionality
    const carouselItem = page
      .locator("[data-testid='carousel-item']")
      .filter({ hasText: "E-ID Demo (Issuer & Verifier)" })
      .filter({ visible: true })
      .first();
    await expect(carouselItem.locator("[data-testid='info-icons']")).toBeVisible();
  });
});

test.describe("project w/ complete information", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("navigates to project page when clicked", async ({ page, baseURL }) => {
    // multiple carousel items are generated per project for the carousel functionality
    const carouselItem = page
      .locator("[data-testid='carousel-item']")
      .filter({ hasText: "E-ID Example" })
      .filter({ visible: true })
      .first();
    await carouselItem.click();
    // if there is no related information regarding C4DT's work, the default open tab is "Technical"
    await expect(page).toHaveURL(`${baseURL}/projects/eid-example?section=technical`);
  });

  test("displays project logo", async ({ page }) => {
    // multiple carousel items are generated per project for the carousel functionality
    const carouselItem = page
      .locator("[data-testid='carousel-item']")
      .filter({ hasText: "E-ID Example" })
      .filter({ visible: true })
      .first();
    // custom logo
    await expect(carouselItem.locator("img")).toHaveAttribute(
      "src",
      "https://raw.githubusercontent.com/spring-epfl/hippiepug/refs/heads/master/hippiepug.svg"
    );
  });

  test("displays project description", async ({ page }) => {
    // multiple carousel items are generated per project for the carousel functionality
    const carouselItem = page
      .locator("[data-testid='carousel-item']")
      .filter({ hasText: "E-ID Example" })
      .filter({ visible: true })
      .first();
    await expect(carouselItem).toContainText("Example for the swiss E-ID ledger.");
  });

  test("displays information icons", async ({ page }) => {
    // multiple carousel items are generated per project for the carousel functionality
    const carouselItem = page
      .locator("[data-testid='carousel-item']")
      .filter({ hasText: "E-ID Example" })
      .filter({ visible: true })
      .first();
    await expect(carouselItem.locator("[data-testid='info-icons']")).toBeVisible();
  });
});

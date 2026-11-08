import { test, expect } from "@playwright/test";

const STORAGE_KEY = "agentteam.tasks";
const EVIDENCE_DIR = "test-results/evidence";

// Each Playwright test runs in its own browser context with its own
// localStorage, so tests never see tasks created by another test.
// (Deliberately not using addInitScript to clear storage here: it
// re-injects on every navigation, including page.reload(), which would
// erase a task right before the persistence check below.)

async function getStoredTaskCount(page: import("@playwright/test").Page): Promise<number> {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as unknown[]).length : 0;
  }, STORAGE_KEY);
}

// The dashboard hydrates from a server snapshot first and only persists the
// seed tasks to localStorage in a later passive effect, so wait for that
// write to land before treating the count as a stable baseline.
async function waitForSeededStorage(page: import("@playwright/test").Page): Promise<number> {
  await page.waitForFunction((key) => window.localStorage.getItem(key) !== null, STORAGE_KEY);
  return getStoredTaskCount(page);
}

test.describe("Task Creation", () => {
  test("dashboard loads successfully", async ({ page }, testInfo) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create task" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Task summary" })).toBeVisible();

    await page.screenshot({
      path: `${EVIDENCE_DIR}/01-dashboard-loaded-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test("create task button opens the modal", async ({ page }, testInfo) => {
    await page.goto("/");

    await expect(page.getByRole("dialog")).not.toBeVisible();
    await page.getByRole("button", { name: "Create task" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Create task" })).toBeVisible();

    await page.screenshot({ path: `${EVIDENCE_DIR}/02-modal-opened-${testInfo.project.name}.png` });
  });

  test("shows a validation error when title is left empty", async ({ page }, testInfo) => {
    await page.goto("/");
    const baselineCount = await waitForSeededStorage(page);

    await page.getByRole("button", { name: "Create task" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Create task" }).click();

    await expect(dialog.getByRole("alert")).toHaveText("Title is required.");
    // Modal must stay open and no new task should have been persisted.
    await expect(dialog).toBeVisible();
    expect(await getStoredTaskCount(page)).toBe(baselineCount);

    await page.screenshot({
      path: `${EVIDENCE_DIR}/03-title-validation-error-${testInfo.project.name}.png`,
    });
  });

  test("creates a task with valid inputs", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Create task" }).click();

    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Title", { exact: false }).fill("Write Playwright coverage");
    await dialog.getByLabel("Description").fill("Cover the task creation flow end to end.");
    await dialog.getByLabel("Priority").selectOption("high");
    await dialog.getByLabel("Due date").fill("2026-12-01");
    await dialog.getByRole("button", { name: "Create task" }).click();

    // Modal closes on successful submission.
    await expect(dialog).not.toBeVisible();

    await page.screenshot({
      path: `${EVIDENCE_DIR}/04-task-created-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test("new task appears on the dashboard", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Create task" }).click();

    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Title", { exact: false }).fill("Review Q3 retrospective notes");
    await dialog.getByRole("button", { name: "Create task" }).click();
    await expect(dialog).not.toBeVisible();

    await expect(
      page.getByRole("heading", { level: 3, name: "Review Q3 retrospective notes" })
    ).toBeVisible();

    await page.screenshot({
      path: `${EVIDENCE_DIR}/05-task-visible-on-dashboard-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test("task persists after page refresh", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Create task" }).click();

    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Title", { exact: false }).fill("Persisted task across refresh");
    await dialog.getByRole("button", { name: "Create task" }).click();
    await expect(dialog).not.toBeVisible();

    await expect(
      page.getByRole("heading", { level: 3, name: "Persisted task across refresh" })
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", { level: 3, name: "Persisted task across refresh" })
    ).toBeVisible();

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY);
    expect(stored).toContain("Persisted task across refresh");

    await page.screenshot({
      path: `${EVIDENCE_DIR}/06-task-persisted-after-refresh-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test("modal can be dismissed via cancel and via backdrop click", async ({ page }, testInfo) => {
    await page.goto("/");
    const baselineCount = await waitForSeededStorage(page);

    // Dismiss via Cancel button.
    await page.getByRole("button", { name: "Create task" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Title", { exact: false }).fill("Should not be saved");
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).not.toBeVisible();
    expect(await getStoredTaskCount(page)).toBe(baselineCount);

    // Dismiss via backdrop click.
    await page.getByRole("button", { name: "Create task" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    // Click the overlay itself, away from the dialog content.
    await page.locator('[role="presentation"]').click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole("dialog")).not.toBeVisible();
    expect(await getStoredTaskCount(page)).toBe(baselineCount);

    await page.screenshot({
      path: `${EVIDENCE_DIR}/07-modal-dismissed-${testInfo.project.name}.png`,
    });
  });

  test("task creation works on a mobile viewport", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await page.getByRole("button", { name: "Create task" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByLabel("Title", { exact: false }).fill("Mobile created task");
    await dialog.getByRole("button", { name: "Create task" }).click();
    await expect(dialog).not.toBeVisible();

    await expect(
      page.getByRole("heading", { level: 3, name: "Mobile created task" })
    ).toBeVisible();

    await page.screenshot({
      path: `${EVIDENCE_DIR}/08-mobile-task-creation-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});

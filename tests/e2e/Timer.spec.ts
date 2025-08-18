import { test, expect } from "@playwright/test";

test("Timer starts and stops", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // await page.screenshot({ path: 'before-click.png' });

  // Wait for timer display to appear (confirms Timer is loaded)
  await expect(page.getByTestId("time")).toBeVisible();

  // Get the button, assert initial label is "Start"
  const startStopButton = page.getByRole("button", { name: /start/i });

  await startStopButton.click();

  // Wait for the button to switch to "Stop"
  await expect(page.getByRole("button", { name: /stop/i })).toBeVisible();

  // Wait 1.5 seconds
  await page.waitForTimeout(1500);

  // Check that time has incremented
  const time = await page.getByTestId("time").textContent();
  expect(time?.startsWith("00:00:01")).toBeTruthy();

  await page.waitForTimeout(4000);
  const time2 = await page.getByTestId("time").textContent();
  expect(time2?.slice(0, 8)).toBe("00:00:05");

  // Stop the timer
  await page.getByRole("button", { name: /stop/i }).click();

  // Confirm button goes back to "Start"
  await expect(page.getByRole("button", { name: /start/i })).toBeVisible();

  // await page.screenshot({ path: 'after-click.png' });
});

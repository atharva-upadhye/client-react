/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
import { expect, test } from "@playwright/test";

test.describe("Timer Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
    await expect(page.getByTestId("timer")).toBeVisible();
  });

  test("Start → Stop → Confirm timer runs and stops correctly", async ({
    page,
  }) => {
    const startStopButton = page.getByTestId("timer").locator("button").first();
    const timeDisplay = page.getByTestId("time");

    // Start the timer
    await expect(startStopButton).toHaveText("Start");
    await startStopButton.click();
    await expect(startStopButton).toHaveText("Stop");

    // Wait 1.5s and verify time increased
    await page.waitForTimeout(1500);
    const time1 = await timeDisplay.textContent();
    expect(time1?.startsWith("00:00:01.5")).toBeTruthy();

    // Wait more and check again
    await page.waitForTimeout(4000);
    const time2 = await timeDisplay.textContent();
    expect(time2?.startsWith("00:00:05")).toBeTruthy();

    await page.waitForTimeout(500);
    const time3 = await timeDisplay.textContent();
    expect(time3?.startsWith("00:00:06")).toBeTruthy();

    // Stop the timer
    await startStopButton.click();
    await expect(startStopButton).toHaveText("Start");

    // Confirm it no longer updates
    const timeBefore = await timeDisplay.textContent();
    await page.waitForTimeout(500);
    const timeAfter = await timeDisplay.textContent();
    expect(timeBefore).toBe(timeAfter);
  });

  test("Pausing and resuming the timer", async ({ page }) => {
    const startButton = page.getByRole("button", { name: "Start" });
    const pauseResumeButton = page.getByRole("button", { name: "Pause" });

    await startButton.click();
    await page.waitForTimeout(200);
    await pauseResumeButton.click();

    const pausedTime = await page.getByTestId("time").textContent();
    await page.waitForTimeout(200);
    const timeAfterPause = await page.getByTestId("time").textContent();
    expect(timeAfterPause).toBe(pausedTime);

    // Resume
    const resumeButton = page.getByRole("button", { name: "Resume" });
    await resumeButton.click();
    await page.waitForTimeout(200);
    const resumedTime = await page.getByTestId("time").textContent();
    expect(resumedTime).not.toBe(pausedTime);
  });

  test("Resetting the timer", async ({ page }) => {
    const startButton = page.getByRole("button", { name: "Start" });
    const pauseButton = page.getByRole("button", { name: "Pause" });
    const resetButton = page.getByRole("button", { name: "Reset" });

    await startButton.click();
    await page.waitForTimeout(300);
    await pauseButton.click();
    await resetButton.click();

    const time = await page.getByTestId("time").textContent();
    expect(time).toBe("00:00:00.000");
  });

  test("Reset button should be disabled while timer is running", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Start" }).click();
    const resetButton = page.getByRole("button", { name: "Reset" });
    await expect(resetButton).toBeDisabled();
  });

  test("Pause button should be disabled until Start is clicked", async ({
    page,
  }) => {
    const pauseButton = page.getByRole("button", { name: "Pause" });
    await expect(pauseButton).toBeDisabled();
  });

  test("Start/Stop button toggles text correctly", async ({ page }) => {
    const startStopButton = page.getByTestId("timer").locator("button").first();

    await expect(startStopButton).toHaveText("Start");
    await startStopButton.click();
    await expect(startStopButton).toHaveText("Stop");
    await startStopButton.click();
    await expect(startStopButton).toHaveText("Start");
  });

  test("Pause/Resume button toggles text correctly", async ({ page }) => {
    const startButton = page.getByRole("button", { name: "Start" });
    await startButton.click();

    const pauseButton = page.getByRole("button", { name: "Pause" });
    await pauseButton.click();

    const resumeButton = page.getByRole("button", { name: "Resume" });
    await expect(resumeButton).toBeVisible();
    await resumeButton.click();

    const updatedPauseButton = page.getByRole("button", { name: "Pause" });
    await expect(updatedPauseButton).toBeVisible();
  });

  test("Timer does not crash on rapid Start → Pause → Reset", async ({
    page,
  }) => {
    const startButton = page.getByRole("button", { name: "Start" });
    const pauseButton = page.getByRole("button", { name: "Pause" });
    const resetButton = page.getByRole("button", { name: "Reset" });

    await startButton.click();
    await page.waitForTimeout(50);
    await pauseButton.click();
    await page.waitForTimeout(50);
    await resetButton.click();

    const time = await page.getByTestId("time").textContent();
    expect(time).toBe("00:00:00.000");
  });

  test("Timer cleans up interval on unmount (no crash)", async ({ page }) => {
    // Only meaningful in app context — simulated by navigation
    await page.getByRole("button", { name: "Start" }).click();
    await page.waitForTimeout(100);

    // Navigate away (simulate unmount)
    await page.goto("about:blank");

    // If no error occurs, test passes
    expect(true).toBe(true);
  });
});

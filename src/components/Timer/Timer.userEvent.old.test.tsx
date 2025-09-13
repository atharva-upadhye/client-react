/* eslint-disable max-statements */
/* eslint-disable no-warning-comments */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Timer } from "./Timer";
import userEvent from "@testing-library/user-event";

describe.skip("timer component", () => {
  beforeEach(() => {
    // use virtual timer
    vi.useFakeTimers();
  });

  afterEach(() => {
    // TODO: is this required?
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders initial state", () => {
    render(<Timer />);

    expect(screen.getByText("00:00:00.000")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start/iu })).toBeEnabled();
    expect(screen.getByRole("button", { name: /pause/iu })).toBeDisabled();
    expect(screen.getByRole("button", { name: /reset/iu })).toBeDisabled();
  });

  it("starts and stops the timer", async () => {
    render(<Timer />);
    const startButton = screen.getByRole("button", { name: /start/iu });

    await userEvent.click(startButton);

    expect(screen.getByRole("button", { name: /stop/iu })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pause/iu })).toBeEnabled();
    expect(screen.getByRole("button", { name: /reset/iu })).toBeEnabled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/00:00:01\.\d{3}/u)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /stop/iu }));

    expect(screen.getByRole("button", { name: /start/iu })).toBeInTheDocument();
  });

  it("starts and stops the timer v2", async () => {
    render(<Timer />);
    // Important: no delay!
    const user = userEvent.setup({ delay: null });

    const startButton = screen.getByRole("button", { name: /start/iu });

    await user.click(startButton);

    // Wrap timer advancement in act to flush React effects
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const timeText = screen.getByRole("heading").textContent ?? "";

    expect(timeText).toMatch(/00:00:01\.\d{3}/u);

    await user.click(screen.getByRole("button", { name: /stop/iu }));

    expect(screen.getByRole("button", { name: /start/iu })).toBeInTheDocument();
  });

  it("pauses and resumes the timer", async () => {
    render(<Timer />);
    await userEvent.click(screen.getByRole("button", { name: /start/iu }));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await userEvent.click(screen.getByRole("button", { name: /pause/iu }));

    const pausedTime = screen.getByText(/00:00:02\.\d{3}/u).textContent;
    // eslint-disable-next-line vitest/no-conditional-in-test
    if (pausedTime === null) {
      throw new Error("pausedTime === null");
    }

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Still the same, because it's paused
    expect(screen.getByText(pausedTime)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /resume/iu }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const resumedTime = screen.getByText(/00:00:03\.\d{3}/u);

    expect(resumedTime).toBeInTheDocument();
  });

  it("resets the timer", async () => {
    render(<Timer />);
    await userEvent.click(screen.getByRole("button", { name: /start/iu }));

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    await userEvent.click(screen.getByRole("button", { name: /reset/iu }));

    expect(screen.getByText("00:00:00.000")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start/iu })).toBeInTheDocument();
  });

  it("cleans up interval on unmount", async () => {
    const { unmount } = render(<Timer />);
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");

    await userEvent.click(screen.getByRole("button", { name: /start/iu }));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalledWith();

    clearIntervalSpy.mockRestore();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Timer from "./Timer";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Timer component", () => {
  it("renders initial state", () => {
    render(<Timer />);
    // expect(screen.getByTestId("time")).toHaveTextContent('00:00:00.000');
    expect(screen.getByRole("heading")).toHaveTextContent("00:00:00.000");
    expect(screen.getByRole("button", { name: /start/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /pause/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /reset/i })).toBeDisabled();
  });

  it("start button starts the timer", () => {
    render(<Timer />);
    const startButton = screen.getByText("Start");

    fireEvent.click(startButton);

    act(() => {
      vi.advanceTimersByTime(1234);
    });

    const timeText = screen.getByRole("heading").textContent ?? "";
    expect(timeText.startsWith("00:00:01.")).toBe(true); // Should be ~1 second
    // OR
    expect(/00:00:01\.\d{3}/.test(timeText)).toBe(true); // Should be ~1 second
  });

  it("stop button stops the timer", () => {
    render(<Timer />);
    const startButton = screen.getByText("Start");

    fireEvent.click(startButton);
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    fireEvent.click(screen.getByText("Stop")); // toggle button

    const frozenTime = screen.getByRole("heading").textContent;

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByRole("heading").textContent).toBe(frozenTime); // Time should not change
    expect(screen.getByRole("heading").textContent).toBe("00:00:01.000"); // time elapsed should be 1000ms in proper format
  });

  it("pause/resume toggles timer update", () => {
    render(<Timer />);
    const startButton = screen.getByText("Start");

    fireEvent.click(startButton);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    fireEvent.click(screen.getByText("Pause"));

    const pausedTime = screen.getByRole("heading").textContent;

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByRole("heading").textContent).toBe(pausedTime); // No change while paused

    fireEvent.click(screen.getByText("Resume"));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const resumedTime = screen.getByRole("heading").textContent ?? "";
    expect(resumedTime > pausedTime!).toBe(true); // Time should advance
  });

  it("reset button resets the timer and stops it", () => {
    render(<Timer />);
    const startButton = screen.getByText("Start");

    fireEvent.click(startButton);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    fireEvent.click(screen.getByText("Reset"));

    expect(screen.getByRole("heading")).toHaveTextContent("00:00:00.000");
    expect(startButton).toHaveTextContent("Start"); // should not say Stop
  });

  it("pause/resume button is disabled when timer is not running", () => {
    render(<Timer />);
    const pauseResumeButton = screen.getByText("Pause");
    expect(pauseResumeButton).toBeDisabled();
  });

  it("reset button is disabled initially and enabled when timer has run", () => {
    render(<Timer />);
    const resetButton = screen.getByText("Reset");
    expect(resetButton).toBeDisabled();

    fireEvent.click(screen.getByText("Start"));
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(resetButton).not.toBeDisabled();
  });
});

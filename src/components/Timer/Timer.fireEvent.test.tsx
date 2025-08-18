import { render, screen, fireEvent, act } from "@testing-library/react";
import Timer from "./Timer";
import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";

describe("Timer component", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // mock timers
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test("renders initial state correctly", () => {
    render(<Timer />);
    expect(screen.getByTestId("time")).toHaveTextContent("00:00:00.000");
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Pause")).toBeDisabled();
    expect(screen.getByText("Reset")).toBeDisabled();
  });

  test("starts timer when Start is clicked", () => {
    render(<Timer />);
    fireEvent.click(screen.getByText("Start"));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText("Stop")).toBeInTheDocument();
    expect(screen.getByText("Pause")).not.toBeDisabled();
    expect(screen.getByText("Reset")).toBeDisabled();

    expect(screen.getByTestId("time").textContent).toMatch(/^00:00:01\.\d{3}$/);
  });

  test("pauses and resumes the timer correctly", () => {
    render(<Timer />);
    fireEvent.click(screen.getByText("Start"));

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    fireEvent.click(screen.getByText("Pause"));

    const pausedTime = screen.getByTestId("time").textContent;
    act(() => {
      vi.advanceTimersByTime(2000); // simulate wait while paused
    });

    expect(screen.getByTestId("time").textContent).toBe(pausedTime);

    fireEvent.click(screen.getByText("Resume"));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("time").textContent).not.toBe(pausedTime);
  });

  test("stops the timer and resets state when Stop is clicked", () => {
    render(<Timer />);
    fireEvent.click(screen.getByText("Start"));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    fireEvent.click(screen.getByText("Stop"));
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByTestId("time").textContent).toMatch(/^00:00:01\.\d{3}$/);
  });

  test("resets the timer correctly", () => {
    render(<Timer />);
    fireEvent.click(screen.getByText("Start"));
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    fireEvent.click(screen.getByText("Pause"));
    fireEvent.click(screen.getByText("Reset"));

    expect(screen.getByTestId("time")).toHaveTextContent("00:00:00.000");
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Pause")).toBeDisabled();
    expect(screen.getByText("Reset")).toBeDisabled();
  });
});

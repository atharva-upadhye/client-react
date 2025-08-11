import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Timer from './Timer';
import userEvent from '@testing-library/user-event';

describe.skip('Timer component', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // use virtual timer
  });
  
  afterEach(() => {
    vi.runOnlyPendingTimers(); // TODO: is this required?
    vi.useRealTimers();
  });

  test('renders initial state', () => {
    render(<Timer />);
    expect(screen.getByText('00:00:00.000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /pause/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /reset/i })).toBeDisabled();
  });

  test('starts and stops the timer', async () => {
    render(<Timer />);
    const startButton = screen.getByRole('button', { name: /start/i });

    await userEvent.click(startButton);

    expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pause/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /reset/i })).toBeEnabled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/00:00:01\.\d{3}/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /stop/i }));

    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  test('starts and stops the timer v2', async () => {
    render(<Timer />);
    const user = userEvent.setup({ delay: null }); // Important: no delay!

    const startButton = screen.getByRole('button', { name: /start/i });

    await user.click(startButton);

    // Wrap timer advancement in act to flush React effects
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const timeText = screen.getByRole('heading').textContent ?? '';
    expect(timeText).toMatch(/00:00:01\.\d{3}/);

    await user.click(screen.getByRole('button', { name: /stop/i }));

    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  test('pauses and resumes the timer', async () => {
    render(<Timer />);
    await userEvent.click(screen.getByRole('button', { name: /start/i }));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await userEvent.click(screen.getByRole('button', { name: /pause/i }));

    const pausedTime = screen.getByText(/00:00:02\.\d{3}/).textContent;

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Still the same, because it's paused
    expect(screen.getByText(pausedTime!)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /resume/i }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const resumedTime = screen.getByText(/00:00:03\.\d{3}/);
    expect(resumedTime).toBeInTheDocument();
  });

  test('resets the timer', async () => {
    render(<Timer />);
    await userEvent.click(screen.getByRole('button', { name: /start/i }));

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    await userEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.getByText('00:00:00.000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  test('cleans up interval on unmount', () => {
    const { unmount } = render(<Timer />);
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    userEvent.click(screen.getByRole('button', { name: /start/i }));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});

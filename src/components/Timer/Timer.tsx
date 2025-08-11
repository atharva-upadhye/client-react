import { useState, useRef, useEffect } from 'react';

function formatTime(ms: number) {
  const hours = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  const milliseconds = String(ms % 1000).padStart(3, '0'); // 4 digits

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

const Timer = () => {
  const [time, setTime] = useState(0); // in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number>(undefined);

  useEffect(() => {
    if (isRunning && !isPaused) {
      const startTime = Date.now() - time;

      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 1);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);

  const handleStartStop = () => {
    if (isRunning) {
      // Stop
      setIsRunning(false);
      setIsPaused(false);
    } else {
      // Start
      setTime(0);
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const handlePauseResume = () => {
    if (!isRunning) return;

    setIsPaused((prev) => !prev);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setIsPaused(true);
  };

  return (
    <div style={{ fontFamily: 'monospace', textAlign: 'center' }}>
      <h1 data-testid="time">{formatTime(time)}</h1>
      <button onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>
      <button onClick={handlePauseResume} disabled={!isRunning}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button onClick={handleReset} disabled={!isRunning && time === 0}>
        Reset
      </button>
    </div>
  );
};

export default Timer;

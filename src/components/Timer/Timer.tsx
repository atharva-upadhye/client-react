import { type MouseEventHandler, useEffect, useRef, useState } from "react";

function formatTime(ms: number) {
  const hours = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const milliseconds = String(ms % 1000).padStart(3, "0"); // 4 digits

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export const Timer = () => {
  const [time, setTime] = useState<null | number>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const startRef = useRef<null | Date>(null);
  const intervalRef = useRef<number>(null);

  const handleStartStop: MouseEventHandler<HTMLButtonElement> = () => {
    if (isStarted) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
      setIsStarted(false);
      // setTime(0);
    } else {
      startRef.current = new Date();
      intervalRef.current = setInterval(
        () =>
          setTime(() => {
            if (!startRef.current) throw Error("impossible");
            return new Date().valueOf() - startRef.current.valueOf();
          }),
        1,
      );
      setIsRunning(true);
      setIsStarted(true);
    }
  };
  const handlePauseResume: MouseEventHandler<HTMLButtonElement> = () => {
    if (isRunning) {
      if (intervalRef.current === null)
        throw Error("impossible condition reached 1");
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    } else {
      if (intervalRef.current) throw Error("impossible condition reached 2");
      startRef.current = new Date(new Date().valueOf() - (time || 0));
      intervalRef.current = setInterval(
        () =>
          setTime(() => {
            if (!startRef.current) throw Error("impossible");
            return new Date().valueOf() - startRef.current.valueOf();
          }),
        1,
      );
      setIsRunning(true);
    }
  };
  const handleReset: MouseEventHandler<HTMLButtonElement> = () => {
    setTime(0);
    setIsRunning(false);
    setIsStarted(false);
  };
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  return (
    <div
      data-testid="timer"
      style={{ fontFamily: "monospace", textAlign: "center" }}
      className="flex flex-col gap-2 rounded-md border-2 bg-amber-200 p-2"
    >
      <h1 data-testid="time" className="text-2xl">
        {formatTime(time || 0)}
      </h1>
      <div className="flex justify-center gap-2">
        <button onClick={handleStartStop}>
          {isStarted ? "Stop" : "Start"}
        </button>
        <button onClick={handlePauseResume} disabled={!isStarted}>
          {!isStarted || isRunning ? "Pause" : "Resume"}
        </button>
        <button onClick={handleReset} disabled={!isStarted || isRunning}>
          Reset
        </button>
      </div>
    </div>
  );
};

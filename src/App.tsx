import "./App.css";
import { Suspense, lazy, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback";
import Timer from "./components/Timer/Timer";

const LazyComponent = lazy(() =>
  import("./components/LazyComponent/LazyComponent").then(e => ({
    default: e.LazyComponent,
  })),
);

function ComponentThatMayThrow({ userId }: { userId: string }) {
  if (userId === "0") {
    throw new Error("Invalid user!");
  }
  return <div>Valid user: {userId}</div>;
}

function App() {
  const [userId, setUserId] = useState("1");

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setUserId("1")} // Reset logic
      onError={(error, info) => {
        // Send to monitoring service (e.g., Sentry)
        console.error("Logged error:", error, info);
      }}
    >
      <ComponentThatMayThrow userId={userId} />
      <br />
      <Suspense fallback={<>loading...</>}>
        <LazyComponent />
      </Suspense>
      <br />
      <div className="m-auto w-fit">
        <div className="text-2xl">timer app</div>
        <Timer />
      </div>
    </ErrorBoundary>
  );
}

export default App;

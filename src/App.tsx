import "./App.css";
import { ErrorFallback, Timer } from "@/components";
import { Suspense, lazy, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

const LazyComponent = lazy(() =>
  import("@/components/LazyComponent/LazyComponent").then(exp => ({
    default: exp.LazyComponent,
  })),
);

const ComponentThatMayThrow = ({ userId }: { userId: string }) => {
  if (userId === "0") {
    throw new Error("Invalid user!");
  }
  return <div>Valid user: {userId}</div>;
};

export const App = () => {
  const [userId, setUserId] = useState("1");

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setUserId("1");
      }}
      onError={(error, info) => {
        // Send to monitoring service (e.g., Sentry)
        // eslint-disable-next-line no-console
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
};

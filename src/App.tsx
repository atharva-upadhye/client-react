import "./App.css";
import { ErrorFallback, Timer, Users } from "@/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

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

const queryClient = new QueryClient();
declare global {
  interface Window {
    // @ts-expect-error cannot find module
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

// This code is for all users
// eslint-disable-next-line no-underscore-dangle
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

export const App = () => {
  const [userId, setUserId] = useState("1");

  return (
    <QueryClientProvider client={queryClient}>
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
        <br />
        <hr />
        <br />
        <Users />
        <Toaster />
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

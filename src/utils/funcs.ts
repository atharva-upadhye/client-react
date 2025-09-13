import { ZodError } from "zod";

const isErrorWithMessage = (error: unknown): error is { message: string } => {
  if (error instanceof Error) {
    return true;
  }
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  );
};
export const errorMsg = (error: unknown): string => {
  if (error instanceof ZodError) {
    // eslint-disable-next-line no-console
    console.error("Validation error details:", error);
    return "Received malformed data from the server.";
  }
  if (isErrorWithMessage(error)) {
    if (error.message.includes("Failed to fetch")) {
      return "Network issue — check your connection.";
    }
    return error.message;
  }
  // eslint-disable-next-line no-console
  console.error("Unknown error", error);
  return "An error occurred";
};

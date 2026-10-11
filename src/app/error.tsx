"use client";

import { useEffect } from "react";

import { SERVER_ERROR_CONTENT } from "@/constants/errors";
import { ErrorBackLink } from "@/features/errors/error-back-link";
import { ErrorScreen } from "@/features/errors/error-screen";
import { captureError } from "@/lib/observability/sentry";

export default function ServerError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    captureError(error, { scope: "app/error", requestId: error.digest ?? null });
  }, [error]);

  return (
    <ErrorScreen content={SERVER_ERROR_CONTENT}>
      <ErrorBackLink />
    </ErrorScreen>
  );
}

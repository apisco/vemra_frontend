"use client";

import { SERVER_ERROR_CONTENT } from "@/constants/errors";
import { ErrorBackLink } from "@/features/errors/error-back-link";
import { ErrorScreen } from "@/features/errors/error-screen";

export default function ServerError() {
  return (
    <ErrorScreen content={SERVER_ERROR_CONTENT}>
      <ErrorBackLink />
    </ErrorScreen>
  );
}

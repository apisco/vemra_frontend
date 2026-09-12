import type { Metadata } from "next";

import { NOT_FOUND_CONTENT } from "@/constants/errors";
import { ErrorBackLink } from "@/features/errors/error-back-link";
import { ErrorScreen } from "@/features/errors/error-screen";

export const metadata: Metadata = {
  title: "Page not found — Vemra",
};

export default function NotFound() {
  return (
    <ErrorScreen content={NOT_FOUND_CONTENT}>
      <ErrorBackLink />
    </ErrorScreen>
  );
}

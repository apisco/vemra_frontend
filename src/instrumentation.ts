import { initSentry } from "@/lib/observability/sentry";

export function register(): void {
  initSentry();
}

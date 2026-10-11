import type { ReadFailure } from "@/lib/api/resilient";

const WAKING_TITLE = "Vemra is waking up";
const WAKING_BODY =
  "The server was idle and took too long to answer. This usually clears in a few seconds.";

const FAILED_TITLE = "We could not load this";

export interface LoadErrorPanelProps {
  failure: ReadFailure;
  label: string;
}

export function LoadErrorPanel({ failure, label }: LoadErrorPanelProps) {
  return (
    <section
      role="alert"
      aria-label={`${label} could not be loaded`}
      className="flex flex-col gap-3 rounded-lg border border-warning-600 bg-warning-50 p-4 md:p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-body-md font-semibold text-neutral-900">
          {failure.isWaking ? WAKING_TITLE : FAILED_TITLE}
        </h2>
        <p className="text-body-sm text-neutral-800">
          {failure.isWaking ? WAKING_BODY : failure.message}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href=""
          className="rounded-sm text-label-md font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Retry
        </a>
        {failure.requestId === null ? null : (
          <span className="text-label-sm text-neutral-700">
            Reference: <code className="font-mono">{failure.requestId}</code>
          </span>
        )}
      </div>
    </section>
  );
}

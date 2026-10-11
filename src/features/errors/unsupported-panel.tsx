import type { UnsupportedCapability } from "@/lib/api/capabilities";

export interface UnsupportedPanelProps {
  capability: UnsupportedCapability;
  label?: string;
}

export function UnsupportedPanel({
  capability,
  label,
}: UnsupportedPanelProps) {
  return (
    <section
      aria-label={label ?? capability.title}
      className="flex flex-col gap-1 rounded-lg border border-neutral-200 bg-white p-4 md:p-6"
    >
      <h2 className="text-body-md font-semibold text-neutral-900">
        {capability.title}
      </h2>
      <p className="text-body-sm text-neutral-700">{capability.description}</p>
    </section>
  );
}

import { cn } from "@/lib/cn";

export type SegmentedControlSize = "md" | "lg";

const TRACK_SIZE_CLASSES: Record<SegmentedControlSize, string> = {
  md: "p-1",
  lg: "gap-1 p-1",
};

const SEGMENT_SIZE_CLASSES: Record<SegmentedControlSize, string> = {
  md: "py-2 text-label-sm leading-[16px] md:text-label-md md:leading-[20px]",
  lg: "py-2 text-label-sm leading-[16px] lg:py-2.5 lg:text-label-md lg:leading-[20px]",
};

export function segmentedTrackClasses({
  size = "md",
  className,
}: {
  size?: SegmentedControlSize;
  className?: string;
} = {}) {
  return cn(
    "flex w-full rounded-md bg-neutral-100",
    TRACK_SIZE_CLASSES[size],
    className,
  );
}

export function segmentedSegmentClasses({
  size = "md",
  isSelected = false,
  isDisabled = false,
  className,
}: {
  size?: SegmentedControlSize;
  isSelected?: boolean;
  isDisabled?: boolean;
  className?: string;
} = {}) {
  return cn(
    "min-w-0 flex-1 rounded-md text-center font-semibold transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
    SEGMENT_SIZE_CLASSES[size],
    isDisabled
      ? "cursor-not-allowed text-neutral-400"
      : isSelected
        ? "cursor-pointer bg-white text-neutral-900"
        : "cursor-pointer text-neutral-700 hover:text-neutral-900",
    className,
  );
}

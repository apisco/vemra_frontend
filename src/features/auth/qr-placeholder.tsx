import { cn } from "@/lib/cn";

const MODULE_COUNT = 21;

const FINDER_ORIGINS: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0, MODULE_COUNT - 7],
  [MODULE_COUNT - 7, 0],
];

function inFinderZone(row: number, column: number): boolean {
  return FINDER_ORIGINS.some(
    ([originRow, originColumn]) =>
      row >= originRow - 1 &&
      row < originRow + 8 &&
      column >= originColumn - 1 &&
      column < originColumn + 8,
  );
}

function buildModules(): ReadonlyArray<ReadonlyArray<boolean>> {
  let seed = 0x2f6e2b1;
  const next = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  return Array.from({ length: MODULE_COUNT }, (_, row) =>
    Array.from({ length: MODULE_COUNT }, (_, column) => {
      const on = next() > 0.55;
      return inFinderZone(row, column) ? false : on;
    }),
  );
}

const MODULES = buildModules();

const FINDER_MODULES: ReadonlyArray<readonly [number, number]> =
  FINDER_ORIGINS.flatMap(([originRow, originColumn]) =>
    Array.from({ length: 7 }, (_, row) =>
      Array.from({ length: 7 }, (_, column) => {
        const edge = row === 0 || row === 6 || column === 0 || column === 6;
        const core = row >= 2 && row <= 4 && column >= 2 && column <= 4;
        return edge || core
          ? ([originRow + row, originColumn + column] as const)
          : null;
      }),
    )
      .flat()
      .filter((cell): cell is readonly [number, number] => cell !== null),
  );

export interface QrPlaceholderProps {
  className?: string;
}

export function QrPlaceholder({ className }: QrPlaceholderProps) {
  return (
    <div
      className={cn(
        "size-35 shrink-0 rounded-md border border-neutral-200 bg-white p-5 md:size-40",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${MODULE_COUNT} ${MODULE_COUNT}`}
        aria-hidden="true"
        focusable="false"
        className="size-full text-neutral-900"
      >
        {MODULES.map((row, rowIndex) =>
          row.map((on, columnIndex) =>
            on ? (
              <rect
                key={`m-${rowIndex}-${columnIndex}`}
                x={columnIndex}
                y={rowIndex}
                width="1"
                height="1"
                fill="currentColor"
              />
            ) : null,
          ),
        )}
        {FINDER_MODULES.map(([row, column]) => (
          <rect
            key={`f-${row}-${column}`}
            x={column}
            y={row}
            width="1"
            height="1"
            fill="currentColor"
          />
        ))}
      </svg>
    </div>
  );
}

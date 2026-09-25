export interface ResponsiveCopy {
  base: string;
  md?: string;
  lg?: string;
}

export interface ResponsiveTextProps {
  copy: ResponsiveCopy;
}

export function ResponsiveText({ copy }: ResponsiveTextProps) {
  const tablet = copy.md ?? copy.base;
  const desktop = copy.lg ?? tablet;

  if (copy.base === tablet && tablet === desktop) {
    return copy.base;
  }

  return (
    <>
      <span className="md:hidden">{copy.base}</span>
      {tablet === desktop ? (
        <span className="hidden md:inline">{tablet}</span>
      ) : (
        <>
          <span className="hidden md:inline lg:hidden">{tablet}</span>
          <span className="hidden lg:inline">{desktop}</span>
        </>
      )}
    </>
  );
}

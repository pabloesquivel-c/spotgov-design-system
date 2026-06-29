type ColorSwatchProps = {
  name: string;
  cssVar: string;
  hex?: string;
  darkText?: boolean;
};

export function ColorSwatch({
  name,
  cssVar,
  hex,
  darkText = false,
}: ColorSwatchProps) {
  return (
    <div className='flex flex-col gap-2'>
      <div
        className='h-16 w-full rounded-lg ring-1 ring-inset ring-stroke-soft-200'
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div>
        <p className='text-sg-small-label text-text-strong-950'>{name}</p>
        <p
          className={
            darkText
              ? 'font-mono text-sg-metadata text-text-sub-600'
              : 'font-mono text-sg-metadata text-text-soft-400'
          }
        >
          {hex ?? cssVar}
        </p>
      </div>
    </div>
  );
}

type SwatchGridProps = {
  children: React.ReactNode;
};

export function SwatchGrid({ children }: SwatchGridProps) {
  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
      {children}
    </div>
  );
}

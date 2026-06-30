type ColorSwatchProps = {
  name: string;
  cssVar: string;
  hex?: string;
};

export function ColorSwatch({ name, cssVar, hex }: ColorSwatchProps) {
  return (
    <div className='flex flex-col gap-2'>
      <div
        className='h-16 w-full rounded-lg ring-1 ring-inset ring-stroke-soft-200'
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div>
        <p className='text-label-xs text-text-strong-950'>{name}</p>
        <p className='text-paragraph-xs text-text-soft-400'>
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

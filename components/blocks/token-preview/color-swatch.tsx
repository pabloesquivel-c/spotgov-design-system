import { articleTag } from './article';

type ColorSwatchProps = {
  name: string;
  cssVar: string;
};

export function ColorSwatch({ name, cssVar }: ColorSwatchProps) {
  return (
    <div className='flex flex-col gap-2.5'>
      <div
        className='aspect-[4/3] w-full rounded-lg ring-1 ring-inset ring-black/5'
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <code className={articleTag}>{name}</code>
    </div>
  );
}

type SwatchRowProps = {
  children: React.ReactNode;
};

export function SwatchRow({ children }: SwatchRowProps) {
  return (
    <div className='grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3'>
      {children}
    </div>
  );
}

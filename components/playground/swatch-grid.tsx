import { ExampleContainer } from '@/components/playground/example-container';
import { articleCaption } from '@/components/playground/typography';

export type Swatch = {
  label: string;
  value: string;
};

/**
 * Palette/token display, matching the Paper mock's "Color" section: a filled
 * swatch with its token name captioned underneath in monospace.
 */
export function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <ExampleContainer className='items-stretch'>
      <div className='grid grid-cols-3 gap-x-5 gap-y-6'>
        {swatches.map((swatch) => (
          <div key={swatch.label} className='flex flex-col gap-2.5'>
            <div
              className='aspect-[4/3] w-full rounded-lg shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]'
              style={{ backgroundColor: swatch.value }}
            />
            <span className={articleCaption}>{swatch.label}</span>
          </div>
        ))}
      </div>
    </ExampleContainer>
  );
}

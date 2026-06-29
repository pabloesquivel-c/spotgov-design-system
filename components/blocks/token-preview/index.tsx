import { ColorsSection } from './colors';
import { ComponentShowcase } from './component-showcase';
import { RadiusSection } from './radius';
import { TypographySection } from './typography';

export function TokenPreview() {
  return (
    <div className='mx-auto max-w-5xl px-5 pb-16'>
      <header className='border-b border-stroke-soft-200 py-12'>
        <p className='text-sg-small-label text-primary-base'>
          SpotGov design direction
        </p>
        <h1 className='mt-2 text-sg-hero text-text-strong-950'>
          Design token preview
        </h1>
        <p className='mt-3 max-w-2xl text-sg-body text-text-sub-600'>
          Visual reference for SpotGov&apos;s product palette, typography, and
          radius — derived from AlignUI tokens and applied to real components.
        </p>
      </header>

      <TypographySection />
      <ColorsSection />
      <RadiusSection />
      <ComponentShowcase />
    </div>
  );
}

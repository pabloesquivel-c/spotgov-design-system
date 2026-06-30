import * as Divider from '@/components/ui/divider';
import { ColorsSection } from './colors';
import { ComponentShowcase } from './component-showcase';
import { RadiusSection } from './radius';
import { ShadowsSection } from './shadows';
import { SpacingSection } from './spacing';
import { TypographySection } from './typography';

export function TokenPreview() {
  return (
    <div className='container mx-auto flex-1 px-5 pb-16 pt-12'>
      <header className='mb-10'>
        <p className='text-subheading-xs text-primary-base'>
          SpotGov · AlignUI
        </p>
        <h1 className='mt-2 text-title-h6 text-text-strong-950'>
          Design token preview
        </h1>
        <p className='mt-2 max-w-2xl text-paragraph-sm text-text-sub-600'>
          Locked SpotGov tokens synced from{' '}
          <code className='text-label-xs'>docs/design-tokens.md</code>.
          Components below use AlignUI primitives with SG overrides applied.
        </p>
      </header>

      <TypographySection />
      <Divider.Root />
      <ColorsSection />
      <Divider.Root />
      <RadiusSection />
      <Divider.Root />
      <ShadowsSection />
      <Divider.Root />
      <SpacingSection />
      <Divider.Root />
      <ComponentShowcase />
    </div>
  );
}

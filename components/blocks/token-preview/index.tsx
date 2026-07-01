import { ArticleHeader, ArticleLayout, ArticleParagraph } from './article';
import { AccessibilitySection } from './accessibility';
import { ColorsSection } from './colors';
import { ComponentShowcase } from './component-showcase';
import { RadiusSection } from './radius';
import { ShadowsSection } from './shadows';
import { SpacingSection } from './spacing';
import { TypographySection } from './typography';

export function TokenPreview() {
  return (
    <ArticleLayout>
      <ArticleHeader title='Design tokens'>
        <ArticleParagraph>
          This page is a living reference for the visual language we use in
          SpotGov. Every color, type size, radius, and shadow here is locked
          and synced with our codebase. When you build a screen, these are the
          values to reach for.
        </ArticleParagraph>
        <ArticleParagraph>
          The tokens come from AlignUI, adapted for a restrained product feel.
          One brand blue, neutral surfaces, and a small set of status colors.
          Nothing extra.
        </ArticleParagraph>
      </ArticleHeader>

      <TypographySection />
      <ColorsSection />
      <RadiusSection />
      <ShadowsSection />
      <SpacingSection />
      <AccessibilitySection />
      <ComponentShowcase />
    </ArticleLayout>
  );
}

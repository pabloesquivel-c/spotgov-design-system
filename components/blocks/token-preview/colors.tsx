import { ColorSwatch, SwatchGrid } from './color-swatch';
import { Section } from './section';

export function ColorsSection() {
  return (
    <>
      <Section
        title='Primary'
        description='Brand accent — one visible blue (primary-base). Derivatives for hover and subtle fills only.'
      >
        <SwatchGrid>
          <ColorSwatch name='primary-base' cssVar='--primary-base' />
          <ColorSwatch name='primary-darker' cssVar='--primary-darker' />
          <ColorSwatch name='primary-dark' cssVar='--primary-dark' />
          <ColorSwatch name='primary-alpha-24' cssVar='--primary-alpha-24' />
          <ColorSwatch name='primary-alpha-16' cssVar='--primary-alpha-16' />
          <ColorSwatch name='primary-alpha-10' cssVar='--primary-alpha-10' />
        </SwatchGrid>
      </Section>

      <Section
        title='Neutral UI'
        description='Background, text, and stroke roles from the AlignUI semantic stack.'
      >
        <SwatchGrid>
          <ColorSwatch name='bg-white-0' cssVar='--bg-white-0' />
          <ColorSwatch name='bg-weak-50' cssVar='--bg-weak-50' />
          <ColorSwatch name='bg-soft-200' cssVar='--bg-soft-200' />
          <ColorSwatch name='text-strong-950' cssVar='--text-strong-950' />
          <ColorSwatch name='text-sub-600' cssVar='--text-sub-600' />
          <ColorSwatch name='text-soft-400' cssVar='--text-soft-400' />
          <ColorSwatch name='stroke-soft-200' cssVar='--stroke-soft-200' />
          <ColorSwatch name='stroke-sub-300' cssVar='--stroke-sub-300' />
        </SwatchGrid>
      </Section>

      <Section
        title='Status'
        description='Core feedback — warning, error, success.'
      >
        <SwatchGrid>
          <ColorSwatch name='warning-base' cssVar='--warning-base' />
          <ColorSwatch name='error-base' cssVar='--error-base' />
          <ColorSwatch name='success-base' cssVar='--success-base' />
        </SwatchGrid>
      </Section>

      <Section
        title='Special accents'
        description='Feature (highlights) and Away (workflow neutrals).'
      >
        <SwatchGrid>
          <ColorSwatch name='feature-base' cssVar='--feature-base' />
          <ColorSwatch name='away-base' cssVar='--away-base' />
        </SwatchGrid>
      </Section>

      <Section
        title='Utility'
        description='Faded (inactive) and Information (tips and callouts).'
      >
        <SwatchGrid>
          <ColorSwatch name='faded-base' cssVar='--faded-base' />
          <ColorSwatch name='information-base' cssVar='--information-base' />
        </SwatchGrid>
      </Section>
    </>
  );
}

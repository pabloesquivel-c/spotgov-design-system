import { ColorSwatch, SwatchGrid } from './color-swatch';
import { Section } from './section';

export function ColorsSection() {
  return (
    <>
      <Section
        title='Primary'
        description='Brand blue — working range 500–700 for interactive elements.'
      >
        <SwatchGrid>
          <ColorSwatch name='100' cssVar='--primary-100' hex='#DBEAFE' />
          <ColorSwatch name='300' cssVar='--primary-300' hex='#7BAAEF' />
          <ColorSwatch name='500' cssVar='--primary-500' hex='#2E6AD6' />
          <ColorSwatch name='600' cssVar='--primary-600' hex='#2558B8' />
          <ColorSwatch name='700' cssVar='--primary-700' hex='#1D4A9E' />
          <ColorSwatch name='900' cssVar='--primary-900' hex='#132F63' />
        </SwatchGrid>
      </Section>

      <Section
        title='Cool neutrals'
        description='Blue undertone grays for surfaces, borders, and secondary text.'
      >
        <SwatchGrid>
          <ColorSwatch name='0' cssVar='--neutral-0' hex='#FFFFFF' />
          <ColorSwatch name='50' cssVar='--neutral-50' hex='#F4F5F8' />
          <ColorSwatch name='100' cssVar='--neutral-100' hex='#E4E6EC' />
          <ColorSwatch name='200' cssVar='--neutral-200' hex='#CBCED8' />
          <ColorSwatch name='400' cssVar='--neutral-400' hex='#868DA2' />
          <ColorSwatch name='500' cssVar='--neutral-500' hex='#636A80' />
          <ColorSwatch name='700' cssVar='--neutral-700' hex='#3C4155' />
          <ColorSwatch name='900' cssVar='--neutral-900' hex='#252837' />
        </SwatchGrid>
      </Section>

      <Section
        title='Ink'
        description='Text colors — never pure black.'
      >
        <SwatchGrid>
          <ColorSwatch name='ink' cssVar='--ink' hex='#121520' />
          <ColorSwatch name='ink-soft' cssVar='--ink-soft' hex='#1C1F2D' />
        </SwatchGrid>
      </Section>

      <Section title='Semantic' description='Status and feedback colors.'>
        <SwatchGrid>
          <ColorSwatch name='success' cssVar='--success' hex='#248A48' />
          <ColorSwatch name='warning' cssVar='--warning' hex='#B87A1A' />
          <ColorSwatch name='error' cssVar='--error' hex='#C13A3A' />
        </SwatchGrid>
      </Section>

      <Section
        title='Data viz / tags'
        description='Distinct hues for categories, tags, and chart series.'
      >
        <SwatchGrid>
          <ColorSwatch name='viz-blue' cssVar='--viz-blue' hex='#3A7AE6' />
          <ColorSwatch name='viz-teal' cssVar='--viz-teal' hex='#1F9E9E' />
          <ColorSwatch name='viz-amber' cssVar='--viz-amber' hex='#C08725' />
          <ColorSwatch name='viz-rose' cssVar='--viz-rose' hex='#CC5070' />
          <ColorSwatch name='viz-purple' cssVar='--viz-purple' hex='#7B5EA7' />
          <ColorSwatch name='viz-green' cssVar='--viz-green' hex='#3A9E6B' />
        </SwatchGrid>
      </Section>
    </>
  );
}
